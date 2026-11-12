/**
 * Ping 延迟 Y 轴比例校准。
 *
 * ECharts 自动缩放会把任意数据填满整个绘图区，于是 1ms 波动和 50ms 波动
 * 渲染出的像素高度几乎一样。这里按数据自身量级计算一个稳定的基线：跨度不足
 * 时向上补齐到最小跨度，让小幅波动贴近平线、大幅波动才占满高度。
 */

/** 最小跨度下限：既保证 1ms 级波动可见地接近平线，也避免高延迟基线把波动压成一条线。 */
const MIN_SPAN_MS = 10
/** 跨度相对基线值的最小比例，量级越大越要求明确可见的起伏。 */
const MIN_SPAN_RATIO = 0.2
const NICE_STEPS = [1, 2, 2.5, 5, 10]

export interface PingAxisScale {
  min: number
  max: number
}

function niceStep(rawStep: number): number {
  if (!Number.isFinite(rawStep) || rawStep <= 0)
    return 1

  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const normalized = rawStep / magnitude
  const step = NICE_STEPS.find(candidate => normalized <= candidate + 1e-9) ?? 10
  return step * magnitude
}

function collectFiniteValues(
  rows: ReadonlyArray<Record<string, unknown>>,
  taskIds: ReadonlyArray<number>,
): number[] {
  const values: number[] = []
  for (const row of rows) {
    for (const taskId of taskIds) {
      const value = row[taskId]
      if (typeof value === 'number' && Number.isFinite(value))
        values.push(value)
    }
  }
  return values
}

/** 按给定的有限数值集合计算 Y 轴范围，供任意延迟图表复用。 */
export function resolveValueAxisScale(values: ReadonlyArray<number | null | undefined>): PingAxisScale | undefined {
  const finite = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
  if (!finite.length)
    return undefined
  return resolveScaleFromExtrema(Math.min(...finite), Math.max(...finite))
}

function resolveScaleFromExtrema(dataMin: number, dataMax: number): PingAxisScale | undefined {
  const magnitude = Math.max(Math.abs(dataMin), Math.abs(dataMax), 1)
  const span = Math.max(dataMax - dataMin, MIN_SPAN_MS, magnitude * MIN_SPAN_RATIO)

  const step = niceStep(span / 4)
  // 数据自身跨度不足时把补出来的余量平分到两侧，避免小幅波动贴着顶或底边看起来像被裁剪。
  const center = (dataMin + dataMax) / 2
  const min = Math.max(0, Math.floor((center - span / 2) / step) * step)
  const max = Math.ceil((center + span / 2) / step) * step

  return max > min ? { min, max } : undefined
}

/**
 * 计算延迟图的 Y 轴范围。无有效数据时返回 undefined，交给 ECharts 自动缩放。
 */
export function resolvePingAxisScale(
  rows: ReadonlyArray<Record<string, unknown>>,
  taskIds: ReadonlyArray<number>,
): PingAxisScale | undefined {
  const values = collectFiniteValues(rows, taskIds)
  if (!values.length)
    return undefined

  return resolveScaleFromExtrema(Math.min(...values), Math.max(...values))
}
