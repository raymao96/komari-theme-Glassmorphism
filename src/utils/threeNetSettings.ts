const ID_SEPARATOR = /[\s,，;；]+/u
const UUID_PATTERN = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i
const CARRIERS = [
  { test: /电信|電信|telecom|\bct\b/i, label: '電信' },
  { test: /联通|聯通|unicom|\bcu\b/i, label: '聯通' },
  { test: /移动|移動|mobile|cmcc|\bcm\b/i, label: '移動' },
  { test: /教育|cernet/i, label: '教育' },
]
const IP_VERSION = /(?:ipv|v)([46])\b/i
const TASK_SEPARATOR = /[-_/|：:\s]+/
const REGION_SUFFIX = /[省市]$/

export function parsePingTaskIds(value: unknown): number[] {
  if (typeof value === 'string' && value.trim().startsWith('[')) {
    try {
      return parsePingTaskIds(JSON.parse(value))
    }
    catch { return [] }
  }
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(ID_SEPARATOR) : []
  return [...new Set(values.filter(item => typeof item === 'number' || (typeof item === 'string' && item.trim())).map(Number).filter(id => Number.isSafeInteger(id) && id > 0))].slice(0, 3)
}

// Ported from towersip: preserve region / carrier and IP version in short labels.
export function shortenPingTaskName(name: string, fallback: string): string {
  const trimmed = name.trim()
  if (!trimmed)
    return fallback
  const version = trimmed.match(IP_VERSION)
  const suffix = version ? `v${version[1]}` : ''
  const normalized = trimmed.replace(IP_VERSION, '').trim()
  const parts = normalized.split(TASK_SEPARATOR).filter(Boolean)
  const carrier = CARRIERS.find(item => item.test.test(parts.at(-1) ?? ''))?.label
  if (parts.length >= 2 && carrier) {
    const region = parts.slice(0, -1).join('').replace(REGION_SUFFIX, '').trim()
    return `${region}${carrier}${suffix}`
  }
  const isp = CARRIERS.find(item => item.test.test(normalized))?.label
  if (isp)
    return `${isp}${suffix}`
  const tail = parts.at(-1)
  const label = tail && tail.length <= 6 ? tail : normalized.length > 6 ? `${normalized.slice(0, 6)}…` : normalized
  return `${label || fallback}${suffix}`
}

export function parseNodePingBindings(value: unknown): Record<string, number[]> {
  const result: Record<string, number[]> = Object.create(null)
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      return result
    for (const [uuid, ids] of Object.entries(parsed)) {
      if (UUID_PATTERN.test(uuid))
        result[uuid] = parsePingTaskIds(ids)
    }
  }
  catch { /* Malformed optional configuration falls back to global bindings. */ }
  return result
}
