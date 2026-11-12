import { expect, test } from '@playwright/test'
import { installKomariFixture } from './fixtures/komari'

for (const scenario of [
  { name: 'light desktop', dark: false, full: true, width: 1280, height: 900 },
  { name: 'dark mobile', dark: true, full: true, width: 390, height: 844 },
  { name: 'default desktop', dark: false, full: false, width: 1280, height: 900 },
]) {
  test(`metric chart legends align on ${scenario.name}`, async ({ page }) => {
    await page.setViewportSize(scenario)
    await installKomariFixture(page, { dark: scenario.dark, hideEarth: true, fullChartDashboard: scenario.full })
    await page.goto('/instance/00000000-0000-4000-8000-000000000004')
    const dashboard = page.locator('[data-load-chart-dashboard]')
    const charts = dashboard.locator('.echarts')
    await expect(charts).toHaveCount(scenario.full ? 12 : 6)
    await expect.poll(() => charts.evaluateAll(elements => elements.every((element) => {
      interface VNode {
        el?: Element
        component?: { exposed?: { chart?: { getOption: () => unknown } | { value?: { getOption: () => unknown } } }, subTree?: VNode }
        children?: VNode[]
      }
      const root = (document.querySelector('#app') as HTMLElement & { _vnode?: VNode })._vnode
      const pending = root ? [root] : []
      while (pending.length) {
        const node = pending.pop()!
        const exposed = node.component?.exposed?.chart
        // vue-echarts 8.0.2 exposes an unwrapped instance; older installs use a ref.
        const chart = exposed && 'getOption' in exposed ? exposed : exposed?.value
        if (node.el === element && chart?.getOption()) {
          Object.assign(element, { __chartLayoutTestInstance: chart })
          return true
        }
        if (node.component?.subTree)
          pending.push(node.component.subTree)
        if (Array.isArray(node.children))
          pending.push(...node.children.filter(child => child && typeof child === 'object'))
      }
      return false
    }))).toBe(true)

    const layout = await charts.evaluateAll((elements) => {
      interface Rect { x: number, y: number, width: number, height: number, clone: () => Rect, applyTransform: (transform: number[]) => void }
      interface Group { type: string, style?: { fill?: string }, getBoundingRect: () => Rect, getComputedTransform: () => number[], children: () => Group[] }
      interface Chart {
        getOption: () => { series: Array<{ name: string }>, legend: Array<{ selected: Record<string, boolean> }> }
        getModel: () => { getComponent: (type: string) => unknown }
        getViewOfComponentModel: (model: unknown) => { group: Group, getContentGroup: () => Group }
      }
      return elements.map((element) => {
        const host = element as HTMLElement & { __chartLayoutTestInstance: Chart }
        const chart = host.__chartLayoutTestInstance
        const view = chart.getViewOfComponentModel(chart.getModel().getComponent('legend'))
        const option = chart.getOption()
        const items = view.getContentGroup().children().map((group) => {
          const rect = group.getBoundingRect().clone()
          rect.applyTransform(group.getComputedTransform())
          return { x: rect.x, y: rect.y, height: rect.height, width: rect.width }
        })
        const hostRect = host.getBoundingClientRect()
        const card = host.parentElement!.parentElement!.parentElement!
        const header = card.querySelector<HTMLElement>('[data-metric-chart-header]')!
        const icon = header.querySelector<HTMLElement>('[data-metric-chart-icon]')!
        const glyph = icon.querySelector('svg')!
        const headerRect = header.getBoundingClientRect()
        const iconRect = icon.getBoundingClientRect()
        const glyphRect = glyph.getBoundingClientRect()
        return {
          names: option.series.map(series => series.name),
          legendTextColors: view.getContentGroup().children().flatMap(group => group.children().filter(child => child.type === 'text').map(child => child.style?.fill)),
          items,
          top: hostRect.top,
          bottom: hostRect.bottom,
          legendY: hostRect.top + items[0]!.y,
          headerHeight: headerRect.height,
          iconSize: [iconRect.width, iconRect.height],
          glyphSize: [glyphRect.width, glyphRect.height],
          iconCenterOffset: iconRect.top + iconRect.height / 2 - (headerRect.top + headerRect.height / 2),
        }
      })
    })
    expect(layout[0]!.names).toEqual(['CPU', '负载'])
    expect(layout.flatMap(chart => chart.names)).toContain('进程数')
    for (const chart of layout) {
      expect(chart.items.length).toBeGreaterThan(0)
      expect(chart.legendTextColors.length).toBeGreaterThan(0)
      expect(chart.legendTextColors.every(color => color === (scenario.dark ? 'rgba(255, 255, 255, 0.55)' : 'rgba(0, 0, 0, 0.55)'))).toBe(true)
      expect(new Set(chart.items.map(item => item.y)).size).toBe(1)
      expect(chart.items.every(item => item.width > 0 && item.height > 0)).toBe(true)
      expect(chart.headerHeight).toBe(40)
      expect(chart.iconSize).toEqual([32, 32])
      expect(chart.glyphSize).toEqual([18, 18])
      expect(chart.iconCenterOffset).toBe(0)
      expect(chart.legendY).toBeGreaterThan(chart.bottom - 35)
      expect(chart.legendY + chart.items[0]!.height).toBeLessThanOrEqual(chart.bottom)
      for (const peer of layout.filter(peer => Math.abs(peer.top - chart.top) < 1))
        expect(Math.abs(peer.legendY - chart.legendY)).toBeLessThan(1)
    }

    // CPU's newly visible legend must still toggle the series through real input.
    const cpu = charts.first()
    await cpu.scrollIntoViewIfNeeded()
    const box = await cpu.boundingBox()
    const cpuItem = layout[0]!.items[0]!
    const clickPoint = { x: box!.x + cpuItem.x + cpuItem.width / 2, y: box!.y + cpuItem.y + cpuItem.height / 2 }
    await page.mouse.click(clickPoint.x, clickPoint.y)
    await expect.poll(() => cpu.evaluate((element) => {
      const host = element as HTMLElement & { __chartLayoutTestInstance: { getOption: () => { legend: Array<{ selected: Record<string, boolean> }> } } }
      return host.__chartLayoutTestInstance.getOption().legend[0]!.selected.CPU
    })).toBe(false)
    await page.mouse.click(clickPoint.x, clickPoint.y)
    await expect.poll(() => cpu.evaluate((element) => {
      const host = element as HTMLElement & { __chartLayoutTestInstance: { getOption: () => { legend: Array<{ selected: Record<string, boolean> }> } } }
      return host.__chartLayoutTestInstance.getOption().legend[0]!.selected.CPU
    })).toBe(true)
    await dashboard.screenshot({ path: `test-results/chart-legends-${scenario.name.replaceAll(' ', '-')}.png` })
    await expect(page.locator('html')).toHaveJSProperty('scrollWidth', await page.locator('html').evaluate(element => element.clientWidth))
  })
}
