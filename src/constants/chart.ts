/** Shared geometry keeps metric charts and their legends aligned within a row. */
export const METRIC_CHART_GRID = { top: 30, right: 24, bottom: 52, left: 56 } as const

export const METRIC_CHART_LEGEND = {
  type: 'scroll',
  bottom: 4,
  itemWidth: 10,
  itemHeight: 10,
  itemGap: 12,
  icon: 'roundRect',
  pageIconSize: 10,
  textStyle: { fontSize: 11, lineHeight: 14 },
} as const
