const CPU_TRADEMARK_PATTERN = /\((?:r|tm|c)\)/gi
const CPU_WORD_PATTERN = /\bcpu\b/gi
const CPU_CORE_SUFFIX_PATTERN = /\s+\d+-core processor\b.*$/i
const CPU_PROCESSOR_SUFFIX_PATTERN = /\s+processor\b.*$/i
const CPU_FREQUENCY_SUFFIX_PATTERN = /\s+@\s+[\d.]+\s*(?:ghz|mhz)\b.*$/i
const WHITESPACE_PATTERN = /\s+/g
const NON_DIGIT_PATTERN = /\D/g
const AMD_EPYC_MODEL_PATTERN = /\bepyc\s+([34789][a-z0-9-]{2,})/i
const INTEL_SCALABLE_MODEL_PATTERN = /\bxeon\s+(?:platinum|gold|silver|bronze|max)\s+(\d{4,5})/i
const INTEL_CORE_ULTRA_200_PATTERN = /\bcore\s+ultra\s+[579]\s+2\d{2}/i
const INTEL_CORE_ULTRA_100_PATTERN = /\bcore\s+ultra\s+[3579]\s+1\d{2}/i
const INTEL_CORE_MODEL_PATTERN = /\bcore\s+i[3579][ -](\d{4,5})/i
const AMD_THREADRIPPER_MODEL_PATTERN = /\b(?:ryzen\s+)?threadripper(?:\s+pro)?\s+(\d{4})/i
const AMD_RYZEN_MODEL_PATTERN = /\bryzen\s+[3579]\s+(?:pro\s+)?(\d{4,5})/i
const SERVER_CPU_PATTERN = /\b(?:epyc|xeon|opteron|power\d+)\b/i
const CONSUMER_CPU_PATTERN = /\b(?:core(?:\s+ultra)?|ryzen|threadripper|apple\s+m\d|celeron|pentium|atom|athlon|sempron|amd\s+fx|intel\s+n\d+)\b/i
const CLOUD_ARM_CPU_PATTERN = /\b(?:ampere|ampereone|altra|graviton|neoverse|kunpeng|thunderx|phytium|nvidia\s+grace|cortex|aarch64|armv[89])\b/i
const VIRTUAL_CPU_PATTERN = /\b(?:kvm64|qemu|virtual\s+cpu|common\s+kvm|generic\s+cpu)\b/i
const LOW_POWER_CPU_PATTERN = /\b(?:(?:intel\s+)?n(?:50|95|97|100|150|200|250|300|305)|celeron|pentium|atom)\b/i

export type CpuBenchmarkTier = 'S' | 'A' | 'B' | 'C' | 'D' | '?'

export interface CpuBenchmarkRating {
  tier: CpuBenchmarkTier
  label: string
  description: string
}

const CPU_TIER_DETAILS: Record<CpuBenchmarkTier, Omit<CpuBenchmarkRating, 'tier'>> = {
  'S': { label: '旗艦', description: '近期旗艦或高密度運算架構' },
  'A': { label: '高效能', description: '近期高效能伺服器或桌機架構' },
  'B': { label: '主流', description: '具備穩定效能的主流架構' },
  'C': { label: '次世代', description: '較早世代或省電取向架構' },
  'D': { label: '入門/老舊', description: '入門款、低功耗或年代較久的架構' },
  '?': { label: '未收錄', description: '型號資訊不足，無法完成本機效能評等' },
}

function rating(tier: CpuBenchmarkTier): CpuBenchmarkRating {
  return { tier, ...CPU_TIER_DETAILS[tier] }
}

function contextualizeRating(name: string, result: CpuBenchmarkRating): CpuBenchmarkRating {
  if (result.tier === '?')
    return result

  const tierIndex = { S: 0, A: 1, B: 2, C: 3, D: 4 }[result.tier]
  const serverLabels = ['旗艦主機級', '高階主機級', '中階主機級', '入門主機級', '早期主機級']
  const consumerLabels = ['旗艦消費級', '高階消費級', '中階消費級', '入門消費級', '早期消費級']
  const cloudLabels = ['旗艦雲端級', '高階雲端級', '雲端原生 ARM', '入門 ARM', '早期 ARM']

  if (VIRTUAL_CPU_PATTERN.test(name))
    return { ...result, label: '通用虛擬機' }
  if (LOW_POWER_CPU_PATTERN.test(name))
    return { ...result, label: '入門省電級' }
  if (SERVER_CPU_PATTERN.test(name))
    return { ...result, label: serverLabels[tierIndex] ?? result.label }
  if (CLOUD_ARM_CPU_PATTERN.test(name))
    return { ...result, label: cloudLabels[tierIndex] ?? result.label }
  if (CONSUMER_CPU_PATTERN.test(name))
    return { ...result, label: consumerLabels[tierIndex] ?? result.label }
  return { ...result, label: '一般規格' }
}

function digitsFromModel(model: string): string {
  return model.replace(NON_DIGIT_PATTERN, '')
}

function rateAmdEpyc(name: string): CpuBenchmarkRating | null {
  const match = name.match(AMD_EPYC_MODEL_PATTERN)
  if (!match)
    return null

  const digits = digitsFromModel(match[1] ?? '')
  const family = Number(digits[0] ?? 0)
  const generation = Number(digits.at(-1) ?? 0)

  if (family === 9 || generation >= 4)
    return rating('S')
  if (family === 8 || generation === 3)
    return rating('A')
  if (generation === 2)
    return rating('B')
  if (generation === 1)
    return rating('C')
  return rating('B')
}

function rateIntelScalable(name: string): CpuBenchmarkRating | null {
  const match = name.match(INTEL_SCALABLE_MODEL_PATTERN)
  if (!match)
    return null

  const prefix = Number((match[1] ?? '').slice(0, 2))
  if ([84, 85, 64, 65, 67, 69].includes(prefix))
    return rating('S')
  if ([43, 53, 63, 83].includes(prefix))
    return rating('A')
  if ([42, 52, 62, 82].includes(prefix))
    return rating('B')
  if ([41, 51, 61, 81].includes(prefix))
    return rating('C')
  return rating('B')
}

function rateIntelCore(name: string): CpuBenchmarkRating | null {
  if (INTEL_CORE_ULTRA_200_PATTERN.test(name))
    return rating('S')
  if (INTEL_CORE_ULTRA_100_PATTERN.test(name))
    return rating('A')

  const match = name.match(INTEL_CORE_MODEL_PATTERN)
  if (!match)
    return null

  const sku = match[1] ?? ''
  const generation = sku.length >= 5 ? Number(sku.slice(0, 2)) : Number(sku[0])
  if (generation >= 13)
    return rating('S')
  if (generation === 12)
    return rating('A')
  if (generation >= 10)
    return rating('B')
  if (generation >= 8)
    return rating('C')
  return rating('D')
}

function rateAmdRyzen(name: string): CpuBenchmarkRating | null {
  const threadripper = name.match(AMD_THREADRIPPER_MODEL_PATTERN)
  if (threadripper) {
    const generation = Number((threadripper[1] ?? '')[0])
    if (generation >= 7)
      return rating('S')
    if (generation >= 3)
      return rating('A')
    return rating('B')
  }

  const match = name.match(AMD_RYZEN_MODEL_PATTERN)
  if (!match)
    return null

  const generation = Number((match[1] ?? '')[0])
  if (generation >= 9 || generation === 7)
    return rating('S')
  if (generation >= 5)
    return rating('A')
  if (generation >= 3)
    return rating('B')
  return rating('C')
}

interface CpuTierRule {
  pattern: RegExp
  tier: CpuBenchmarkTier
}

// Ordered broad families cover common VPS, workstation, desktop and ARM hosts.
// This is a model-generation estimate, not copied benchmark data or a node-side test.
const CPU_TIER_RULES: CpuTierRule[] = [
  { pattern: /\b(?:xeon\s+6|xeon\s+[67]\d{3}[ep])\b/i, tier: 'S' },
  { pattern: /\bxeon\s+w[ -]?(?:24|34)\d{2}\b/i, tier: 'S' },
  { pattern: /\bxeon\s+w[ -]?(?:32|33)\d{2}\b/i, tier: 'A' },
  { pattern: /\bxeon\s+w[ -]?(?:21|22)\d{2}\b/i, tier: 'B' },
  { pattern: /\bxeon\s+e[ -]?24\d{2}\b/i, tier: 'A' },
  { pattern: /\bxeon\s+e[ -]?23\d{2}\b/i, tier: 'A' },
  { pattern: /\bxeon\s+e[ -]?(?:21|22)\d{2}\b/i, tier: 'B' },
  { pattern: /\bxeon\s+d[ -]?27\d{2}\b/i, tier: 'B' },
  { pattern: /\bxeon\s+d[ -]?21\d{2}\b/i, tier: 'C' },
  { pattern: /\bxeon\s+d[ -]?15\d{2}\b/i, tier: 'D' },
  { pattern: /\bxeon\s+(?:e5|e7)[ -]?\d{4}\s+v4\b/i, tier: 'C' },
  { pattern: /\bxeon\s+(?:e5|e7)[ -]?\d{4}\s+v3\b/i, tier: 'D' },
  { pattern: /\bxeon\s+(?:e3|e5|e7)[ -]?\d{4}(?:\s+v[12])?\b/i, tier: 'D' },
  { pattern: /\b(?:epyc|xeon)\b/i, tier: 'C' },
  { pattern: /\bapple\s+m[45](?:\s+(?:pro|max|ultra))?\b/i, tier: 'S' },
  { pattern: /\bapple\s+m3(?:\s+(?:pro|max|ultra))?\b/i, tier: 'A' },
  { pattern: /\bapple\s+m2(?:\s+(?:pro|max|ultra))?\b/i, tier: 'A' },
  { pattern: /\bapple\s+m1(?:\s+(?:pro|max|ultra))?\b/i, tier: 'B' },
  { pattern: /\b(?:ampereone|graviton\s*4|neoverse[ -]?v2)\b/i, tier: 'S' },
  { pattern: /\b(?:altra\s+max|graviton\s*3|neoverse[ -]?(?:v1|n2))\b/i, tier: 'A' },
  { pattern: /\b(?:ampere\s+altra|graviton\s*2|neoverse[ -]?n1|kunpeng\s*920)\b/i, tier: 'B' },
  { pattern: /\b(?:graviton|neoverse|thunderx|phytium|aarch64|armv8|armv9)\b/i, tier: 'C' },
  { pattern: /\bpower10\b/i, tier: 'A' },
  { pattern: /\bpower9\b/i, tier: 'B' },
  { pattern: /\bpower8\b/i, tier: 'C' },
  { pattern: /\b(?:nvidia\s+grace|cortex[ -]?x\d+)\b/i, tier: 'A' },
  { pattern: /\b(?:intel\s+)?n(?:50|95|97|100|150|200|250|300|305)\b/i, tier: 'D' },
  { pattern: /\b(?:celeron|pentium|atom|athlon|sempron|opteron|amd\s+fx|core\s+2)\b/i, tier: 'D' },
  { pattern: /\b(?:kvm64|qemu|virtual\s+cpu|common\s+kvm|generic\s+cpu)\b/i, tier: 'D' },
]

export function normalizeCpuBenchmarkQuery(cpuName: string): string {
  return cpuName
    .normalize('NFKC')
    .replace(CPU_TRADEMARK_PATTERN, '')
    .replace(CPU_CORE_SUFFIX_PATTERN, '')
    .replace(CPU_PROCESSOR_SUFFIX_PATTERN, '')
    .replace(CPU_FREQUENCY_SUFFIX_PATTERN, '')
    .replace(CPU_WORD_PATTERN, '')
    .replace(WHITESPACE_PATTERN, ' ')
    .trim()
}

export function getPassMarkCpuLookupUrl(cpuName: string): string {
  const query = normalizeCpuBenchmarkQuery(cpuName)
  return query
    ? `https://www.cpubenchmark.net/cpu_lookup.php?cpu=${encodeURIComponent(query)}`
    : 'https://www.cpubenchmark.net/cpu-list/all'
}

export function getCpuBenchmarkRating(cpuName: string): CpuBenchmarkRating {
  const name = normalizeCpuBenchmarkQuery(cpuName)
  if (!name || name === '-')
    return rating('?')

  const result = rateAmdEpyc(name)
    ?? rateIntelScalable(name)
    ?? rateIntelCore(name)
    ?? rateAmdRyzen(name)
    ?? rating(CPU_TIER_RULES.find(rule => rule.pattern.test(name))?.tier ?? '?')
  return contextualizeRating(name, result)
}
