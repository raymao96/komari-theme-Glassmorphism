import { expect, test } from '@playwright/test'
import { isPublicIp } from '../../src/utils/ipAddress'
import { installKomariFixture } from './fixtures/komari'

test('geo lookups accept complete public IP literals and reject special addresses', () => {
  for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700::1111', '[2001:4860:4860::8888]', '::ffff:8.8.8.8', '::ffff:808:808'])
    expect(isPublicIp(ip), ip).toBe(true)
  for (const ip of ['localhost', 'example.com', '8.8.8', '08.8.8.8', '256.1.1.1', '0.0.0.0', '127.1.2.3', '10.0.0.1', '172.16.0.1', '192.168.0.1', '100.64.0.1', '169.254.1.1', '192.0.2.1', '198.18.0.1', '198.51.100.1', '203.0.113.1', '224.0.0.1', '255.255.255.255', '::', '::1', '0:0:0:0:0:0:0:1', '::ffff:127.0.0.1', '::ffff:7f00:1', '::ffff:192.168.1.1', 'fc00::1', 'fe80::1', 'fe80::1%eth0', 'ff02::1', '2001:db8::1', '2001::1', '2002::1', '3fff::1', '2606:4700::1111:bad:bad:bad:bad:bad'])
    expect(isPublicIp(ip), ip).toBe(false)
})

for (const renderer of ['realistic', 'cobe'] as const) {
  test(`${renderer} falls back to a correctly sized map without WebGL`, async ({ page }) => {
    await page.addInitScript(() => {
      const native = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (String(type).startsWith('webgl'))
          return null
        return Reflect.apply(native, this, [type, ...args])
      } as typeof native
    })
    const heavyRequests: string[] = []
    page.on('request', (request) => {
      if (/\/globe-[\w-]+\.js/.test(request.url()))
        heavyRequests.push(request.url())
    })
    await installKomariFixture(page, { earthRenderer: renderer })
    await page.goto('/')
    const map = page.locator('.earth-map-shell')
    await expect(map).toBeVisible()
    expect((await map.boundingBox())!.height).toBeGreaterThan(200)
    await expect(page.locator('.earth-globe-host, .earth-globe-canvas')).toHaveCount(0)
    expect(heavyRequests).toEqual([])
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

test('a lost globe context recovers with the flat map', async ({ page }) => {
  await installKomariFixture(page, { earthRenderer: 'cobe' })
  await page.goto('/')
  const canvas = page.locator('.earth-globe-canvas')
  await expect(canvas).toBeVisible()
  await canvas.evaluate(element => element.dispatchEvent(new Event('webglcontextlost', { cancelable: true })))
  await expect(page.locator('.earth-map-shell')).toBeVisible()
  await expect(canvas).toHaveCount(0)
})

for (const loggedIn of [false, true]) {
  test(`geo uses IPv6 fallback and respects ${loggedIn ? 'authenticated' : 'guest'} permissions`, async ({ page }) => {
    await installKomariFixture(page, { earthRenderer: 'tiled', publicNodeIps: true, loggedIn })
    const calls: string[] = []
    await page.route(/^https:\/\/(?:api\.ip\.sb|ipinfo\.io|ipwho\.is|ipapi\.co)\//, async (route) => {
      const url = decodeURIComponent(route.request().url())
      if (url === 'https://ipwho.is/') {
        await route.fulfill({ json: { success: true, ip: '192.0.2.1', country: 'Japan' } })
        return
      }
      calls.push(url)
      const ipv6 = url.includes('2606:4700::1111')
      await route.fulfill({ json: ipv6
        ? { latitude: 35.68, longitude: 139.76, loc: '35.68,139.76', city: 'Tokyo', country: 'JP', country_code: 'JP' }
        : { latitude: 0, longitude: 0, loc: '0,0', city: 'Invalid' } })
    })
    await page.goto('/')
    await expect(page.locator('.earth-map-shell')).toBeVisible()
    if (loggedIn) {
      await expect.poll(() => calls.length).toBe(5)
      expect(calls.slice(0, 4).every(url => url.includes('8.8.8.8'))).toBe(true)
      expect(calls[4]).toContain('2606:4700::1111')
      await expect(page.locator('.legend-name').filter({ hasText: '东京' })).toBeVisible()
      const cache = await page.evaluate(() => Object.entries(localStorage).filter(([key]) => key.includes(':ipgeo:')))
      expect(cache.find(([key]) => key.endsWith(':8.8.8.8'))?.[1]).toContain('"negative":true')
      expect(cache.find(([key]) => key.endsWith(':2606:4700::1111'))?.[1]).toContain('35.68')
      expect(cache.every(([key]) => !key.includes('192.0.2') && !key.includes('2001:db8'))).toBe(true)
    }
    else {
      await expect(page.getByRole('button', { name: '查看节点 主控-洛杉矶 详情' })).toBeVisible()
      await page.waitForTimeout(300)
      expect(calls).toEqual([])
    }
  })
}

for (const hiddenFirstNode of [false, true]) {
  test(`optional group counts include offline nodes and ${hiddenFirstNode ? 'omit hidden nodes' : 'support multiple groups'}`, async ({ page }) => {
    await installKomariFixture(page, { hideEarth: true, groupNodeCount: true, hiddenFirstNode })
    await page.goto('/')
    await expect(page.getByRole('tab', { name: `全部节点 ${hiddenFirstNode ? 11 : 12}`, exact: true })).toBeVisible()
    await expect(page.getByRole('tab', { name: `生产 ${hiddenFirstNode ? 5 : 6}`, exact: true })).toBeVisible()
    await expect(page.getByRole('tab', { name: '测试 6', exact: true })).toBeVisible()
    await expect(page.getByRole('tab', { name: '边缘 6', exact: true })).toBeVisible()
  })
}

for (const hours of [168, 720]) {
  test(`Ping presets stay within ${hours} hours of server retention`, async ({ page }) => {
    await installKomariFixture(page, { hideEarth: true, pingRetentionHours: hours })
    await page.goto('/')
    await page.getByRole('button', { name: '主控-洛杉矶 延迟监测' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('tab', { name: '7 天', exact: true })).toBeVisible()
    await expect(dialog.getByRole('tab', { name: '6 小时', exact: true })).toBeVisible()
    await expect(dialog.getByRole('tab', { name: '12 小时', exact: true })).toBeVisible()
    await expect(dialog.getByRole('tab', { name: '15 天', exact: true })).toHaveCount(hours >= 360 ? 1 : 0)
    await expect(dialog.getByRole('tab', { name: '30 天', exact: true })).toHaveCount(hours >= 720 ? 1 : 0)
  })
}
