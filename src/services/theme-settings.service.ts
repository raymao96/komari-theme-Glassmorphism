import { requirePermission } from '@/services/auth.service'
import { requestManager } from '@/services/request.service'
import { getSharedApi } from '@/utils/api'
import { parseNodePingBindings, parsePingTaskIds } from '@/utils/threeNetSettings'

export interface ThreeNetDisplaySettings {
  threeNetPingEnabled?: boolean
  threeNetPingSparkline?: boolean
}

// Adapted from towersip. Patch only edited nodes into freshly fetched settings,
// retaining hidden nodes and settings changed elsewhere since the editor opened.
export async function saveThreeNetPingBindings(changes: Record<string, number[]>, globalIds?: number[], display: ThreeNetDisplaySettings = {}) {
  const permission = await requirePermission('advancedTools', { force: true })
  if (!permission.granted)
    throw new Error('登录状态已过期，请先登录管理员账号。')
  return requestManager.run('theme-settings:three-net-save', async (signal) => {
    const api = getSharedApi()
    const current = await api.getPublicSettings(signal)
    const raw = typeof current.theme_settings === 'string' ? JSON.parse(current.theme_settings) as unknown : current.theme_settings
    if (raw !== undefined && raw !== null && (typeof raw !== 'object' || Array.isArray(raw)))
      throw new Error('主题设置格式无效，配置未保存。')
    const settings: Record<string, unknown> = raw ? { ...raw as Record<string, unknown> } : {}
    const bindings = parseNodePingBindings(settings.threeNetPingNodeTaskBindings)
    for (const [uuid, ids] of Object.entries(parseNodePingBindings(changes))) {
      if (ids.length)
        bindings[uuid] = ids
      else
        delete bindings[uuid]
    }
    // Komari's pingtasks storage contract is a JSON string, not a number array.
    settings.threeNetPingTaskIds = JSON.stringify(parsePingTaskIds(globalIds ?? settings.threeNetPingTaskIds))
    settings.threeNetPingNodeTaskBindings = JSON.stringify(bindings)
    if (typeof display.threeNetPingEnabled === 'boolean')
      settings.threeNetPingEnabled = display.threeNetPingEnabled
    if (typeof display.threeNetPingSparkline === 'boolean')
      settings.threeNetPingSparkline = display.threeNetPingSparkline
    if (!current.theme)
      throw new Error('无法确定当前主题，配置未保存。')
    await api.saveThemeSettings(current.theme, settings, signal)
    return { ...current, theme_settings: settings }
  }, { retryAttempts: 0 })
}
