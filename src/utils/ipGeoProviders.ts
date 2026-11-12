/**
 * 地球 IP 定位使用的在线查询地址（回退链）。
 *
 * 主题设置里每行一个 URL 模板，`{ip}` 会被替换成待查询的 IP。管理员可以自由增删、
 * 调整顺序，或换成自建的 geo 接口。留空时地球直接采用后台下发的 region，
 * 从而与节点卡片国旗保持一致（牺牲城市级精度）。
 */

/** 内置回退链默认值，保持升级前的既有行为。 */
export const DEFAULT_IP_GEO_PROVIDER_URLS: readonly string[] = [
  'https://api.ip.sb/geoip/{ip}',
  'https://ipinfo.io/{ip}/json',
  'https://ipwho.is/{ip}',
  'https://ipapi.co/{ip}/json/',
]

const PROVIDER_URL_SEPARATOR_REGEX = /[\s,;]+/
const URL_PLACEHOLDER_REGEX = /\{ip\}/i
const HTTP_URL_REGEX = /^https?:\/\/\S+$/i
const TRAILING_SLASH_REGEX = /\/+$/

function normalizeTemplate(raw: string): string | null {
  const value = raw.trim()
  if (!value || !HTTP_URL_REGEX.test(value))
    return null
  // 未写占位符时默认追加到末尾，方便只填域名或前缀。
  return URL_PLACEHOLDER_REGEX.test(value) ? value : `${value.replace(TRAILING_SLASH_REGEX, '')}/{ip}`
}

/**
 * 解析主题设置里的 IP 查询地址列表。
 *
 * 返回 null 表示未配置，沿用 {@link DEFAULT_IP_GEO_PROVIDER_URLS}；
 * 返回空数组表示管理员显式留空，地球只按后台 region 定位。
 * 非法项一律丢弃：全部非法时回落到默认链，避免一个错别字悄悄关掉定位。
 */
export function parseIpGeoProviderUrls(raw: unknown): string[] | null {
  if (raw === undefined || raw === null)
    return null
  if (typeof raw !== 'string')
    return null

  const seen = new Set<string>()
  for (const part of raw.split(PROVIDER_URL_SEPARATOR_REGEX)) {
    const template = normalizeTemplate(part)
    if (template)
      seen.add(template)
  }

  return seen.size || !raw.trim() ? Array.from(seen) : null
}
