<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { CardX } from '@/components/ui/card-x'
import { METRIC_CHART_GRID, METRIC_CHART_LEGEND } from '@/constants/chart'
import { useAppStore } from '@/stores/app'
import { getMetricChartTheme } from '@/utils/chartPalette'
import { formatBytes } from '@/utils/helper'
import { resolveValueAxisScale } from '@/utils/pingChartAxisScale'
import { escapePingTooltip } from '@/utils/pingChartPresentation'
import MetricChartHeader from './MetricChartHeader.vue'
import '@/utils/echarts'

type MetricChartTone = 'rose' | 'amber' | 'emerald' | 'cyan' | 'sky' | 'violet' | 'orange' | 'slate'
type MetricValueKind = 'bytes' | 'bytesPerSecond' | 'count' | 'milliseconds' | 'percent' | 'temperature'

export interface MetricChartSeriesData {
  name: string
  color: string
  kind: MetricValueKind
  data: Array<[string, number | null]>
  dashed?: boolean
}

const props = withDefaults(defineProps<{
  title: string
  icon: string
  tone?: MetricChartTone
  series: MetricChartSeriesData[]
  order?: number
  subtitle?: string
  latest?: string
  percentScale?: boolean
}>(), {
  tone: 'slate',
  order: 99,
  subtitle: '',
  latest: '',
  percentScale: false,
})

function formatMetricValue(value: number | null | undefined, kind: MetricValueKind): string {
  if (value === null || value === undefined || !Number.isFinite(value))
    return '-'

  switch (kind) {
    case 'bytes':
      return formatBytes(value)
    case 'bytesPerSecond':
      return `${formatBytes(value)}/s`
    case 'milliseconds':
      return `${value.toFixed(value >= 100 ? 0 : 1)} ms`
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'temperature':
      return `${value.toFixed(1)} °C`
    default:
      return Math.round(value).toLocaleString('zh-CN')
  }
}

const primaryKind = computed<MetricValueKind>(() => props.series[0]?.kind ?? 'count')
const appStore = useAppStore()
const chartThemeColors = computed(() => getMetricChartTheme(appStore.isDark))

// 延迟类图表按自身量级固定 Y 轴，避免自动缩放把小波动拉满整幅图；
// 百分比保持 0-100 固定量程，其他指标维持 ECharts 自动缩放。
const latencyAxisScale = computed(() => {
  if (props.percentScale || primaryKind.value !== 'milliseconds')
    return undefined
  return resolveValueAxisScale(props.series.flatMap(item => item.data.map(point => point[1])))
})

const latestText = computed(() => {
  if (props.latest)
    return props.latest

  for (const series of props.series) {
    const point = [...series.data].reverse().find(item => item[1] !== null && Number.isFinite(item[1]))
    if (point)
      return `${series.name} ${formatMetricValue(point[1], series.kind)}`
  }
  return '-'
})

const chartOption = computed(() => ({
  animation: false,
  color: props.series.map(item => item.color),
  tooltip: {
    trigger: 'axis',
    confine: true,
    backgroundColor: chartThemeColors.value.tooltipBg,
    borderColor: chartThemeColors.value.borderColor,
    borderWidth: 1,
    textStyle: { color: chartThemeColors.value.text, fontSize: 12 },
    formatter: (params: unknown) => {
      const items = params as Array<{ axisValueLabel?: string, color: string, data: [string, number | null], seriesIndex: number, seriesName: string }>
      if (!items.length)
        return ''
      const rows = items.map((item) => {
        const source = props.series[item.seriesIndex]
        const kind = source?.kind ?? primaryKind.value
        return `<div style="display:flex;align-items:center;gap:8px"><span style="width:8px;height:8px;border-radius:2px;background:${item.color};flex:none"></span><span>${escapePingTooltip(item.seriesName)}</span><strong style="margin-left:auto;padding-left:12px">${formatMetricValue(item.data?.[1], kind)}</strong></div>`
      }).join('')
      return `<div style="margin-bottom:6px;color:var(--color-muted-foreground)">${escapePingTooltip(items[0]?.axisValueLabel ?? '')}</div><div style="display:flex;flex-direction:column;gap:4px">${rows}</div>`
    },
  },
  legend: {
    ...METRIC_CHART_LEGEND,
    textStyle: { ...METRIC_CHART_LEGEND.textStyle, color: chartThemeColors.value.textSecondary },
    pageTextStyle: { color: chartThemeColors.value.textSecondary },
  },
  grid: METRIC_CHART_GRID,
  xAxis: {
    type: 'time',
    axisLine: { lineStyle: { color: chartThemeColors.value.borderColor } },
    axisTick: { show: false },
    axisLabel: { color: chartThemeColors.value.textSecondary, fontSize: 11, margin: 12, hideOverlap: true },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'value',
    min: props.percentScale ? 0 : latencyAxisScale.value?.min,
    max: props.percentScale ? 100 : latencyAxisScale.value?.max,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: chartThemeColors.value.textSecondary,
      fontSize: 11,
      formatter: (value: number) => formatMetricValue(value, primaryKind.value),
    },
    splitLine: { lineStyle: { color: chartThemeColors.value.splitLineColor, type: 'dashed' } },
  },
  series: props.series.map(item => ({
    name: item.name,
    type: 'line',
    data: item.data,
    connectNulls: false,
    showSymbol: false,
    // 延迟曲线平滑可钳制到 x 单调，避免平滑过冲产生尖锐毛刺。
    smooth: item.kind === 'milliseconds' ? 0.35 : false,
    smoothMonotone: item.kind === 'milliseconds' ? 'x' : undefined,
    lineStyle: { width: 1.6, type: item.dashed ? 'dashed' : 'solid', color: item.color },
  })),
}))
</script>

<template>
  <CardX
    data-metric-series-chart-card
    size="small"
    class="bg-background/50 border-none hover:bg-background transition-all rounded-md"
    :style="{ order }"
  >
    <template #header>
      <MetricChartHeader :title="title" :icon="icon" :tone="tone" :subtitle="subtitle">
        {{ latestText }}
      </MetricChartHeader>
    </template>
    <div class="h-48">
      <VChart :option="chartOption" autoresize />
    </div>
  </CardX>
</template>
