// Inspired by 3560912451zz-stack's geo filter; parse full literals before
// classifying them, including expanded IPv6 and hexadecimal IPv4 mappings.
const IPV4_PART = /^(?:0|[1-9]\d{0,2})$/
const IPV6_CHARACTERS = /^[\da-f:.]+$/i

function ipv4Parts(value: string): number[] | null {
  const parts = value.split('.')
  if (parts.length !== 4 || parts.some(part => !IPV4_PART.test(part) || Number(part) > 255))
    return null
  return parts.map(Number)
}

function publicIpv4(parts: number[]): boolean {
  const [a, b, c] = parts as [number, number, number, number]
  return !(a === 0 || a === 10 || a === 127 || a >= 224
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && ((b === 0 && (c === 0 || c === 2)) || (b === 88 && c === 99) || b === 168))
    || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100)))
    || (a === 203 && b === 0 && c === 113))
}

/** Only globally scoped IP literals suitable for external geo lookup. */
export function isPublicIp(value: string): boolean {
  const ip = value.trim()
  const ipv4 = ipv4Parts(ip)
  if (ipv4)
    return publicIpv4(ipv4)
  const literal = ip.startsWith('[') && ip.endsWith(']') ? ip.slice(1, -1) : ip
  if (!literal.includes(':') || !IPV6_CHARACTERS.test(literal))
    return false
  try {
    const canonical = new URL(`http://[${literal}]/`).hostname.slice(1, -1)
    const halves = canonical.split('::')
    const left = halves[0] ? halves[0].split(':') : []
    const right = halves[1] ? halves[1].split(':') : []
    const words = halves.length === 2 ? [...left, ...Array.from<string>({ length: 8 - left.length - right.length }).fill('0'), ...right] : left
    const numbers = words.map(word => Number.parseInt(word, 16))
    if (numbers.length !== 8)
      return false
    if (numbers.slice(0, 5).every(word => word === 0) && numbers[5] === 0xFFFF) {
      const high = numbers[6]!
      const low = numbers[7]!
      return publicIpv4([high >> 8, high & 255, low >> 8, low & 255])
    }
    // Global unicast only; exclude protocol assignments, documentation and 6to4.
    const first = numbers[0]!
    const second = numbers[1]!
    return (first & 0xE000) === 0x2000
      && !(first === 0x2001 && (second < 0x200 || second === 0xDB8))
      && first !== 0x2002
      && !(first === 0x3FFF && second < 0x1000)
  }
  catch {
    return false
  }
}
