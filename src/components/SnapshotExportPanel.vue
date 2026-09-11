<script setup lang="ts">
import type { NodeData } from '@/stores/nodes'
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { CardX } from '@/components/ui/card-x'
import { Input } from '@/components/ui/input'
import { useNodeProviderMetadata } from '@/composables/useNodeProviderMetadata'
import { useVisitorAudit } from '@/composables/useVisitorAudit'
import { buildSnapshotCsvAsync, buildSnapshotJsonAsync, downloadText } from '@/services/snapshot.service'
import { useAppStore } from '@/stores/app'
import * as financeHelper from '@/utils/financeHelper'
import { formatBytesPerSecondWithConfig, formatBytesWithConfig, formatDateTime, formatUptimeWithFormat } from '@/utils/helper'
import { getTrafficUsed, getTrafficUsedPercentage } from '@/utils/nodeMetricsHelper'

interface SnapshotRow {
  uuid: string
  name: string
  online: boolean
  group: string
  region: string
  ipv4: string
  ipv6: string
  provider: string
  asn: string
  org: string
  os: string
  arch: string
  virtualization: string
  cpuName: string
  cpuCores: number
  cpuUsage: number
  load1: number
  memoryUsedBytes: number
  memoryTotalBytes: number
  diskUsedBytes: number
  diskTotalBytes: number
  trafficUsedBytes: number
  trafficLimitBytes: number
  trafficUsedPercent: number
  netInBytesPerSecond: number
  netOutBytesPerSecond: number
  uptimeSeconds: number
  price: number
  currency: string
  billingCycleDays: number
  monthlyCostCNY: number
  expiredAt: string
  tags: string
}

interface CsvColumn {
  label: string
  value: (row: SnapshotRow) => string | number
}

const props = defineProps<{
  nodes: NodeData[]
}>()

const appStore = useAppStore()
const { record: recordVisitorEvent } = useVisitorAudit()
const exchangeRates = ref(financeHelper.DEFAULT_EXCHANGE_RATES)
const exportPasswordInput = ref('')
const exporting = ref<null | 'json' | 'csv'>(null)

const { getNodeProviderMetadata } = useNodeProviderMetadata({
  nodes: () => props.nodes,
  customAliases: () => appStore.providerAliases,
  enabled: () => appStore.privateFeaturesAllowed,
  allowGeoLookup: () => appStore.privateFeaturesAllowed,
  geoPermission: 'snapshotExport',
})

onMounted(async () => {
  const { rates } = await financeHelper.getDailyExchangeRates()
  exchangeRates.value = rates
})

function formatBytes(bytes: number): string {
  return formatBytesWithConfig(bytes, appStore.byteDecimals)
}

function formatSpeed(bytes: number): string {
  return formatBytesPerSecondWithConfig(bytes, appStore.byteDecimals)
}

function formatPercent(value: number): string {
  return `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`
}

function getPercent(used: number, total: number): number {
  if (!Number.isFinite(used) || !Number.isFinite(total) || total <= 0)
    return 0
  return used / total * 100
}

function formatLoad(value: number): string {
  return (Number.isFinite(value) ? value : 0).toFixed(2)
}

function formatStatus(online: boolean): string {
  return online ? '上線' : '離線'
}

function formatLimit(bytes: number): string {
  return bytes > 0 ? formatBytes(bytes) : '不限'
}

function formatDate(value: string): string {
  return formatDateTime(value)
}

function formatUptime(seconds: number): string {
  return formatUptimeWithFormat(seconds, 'hour')
}

function formatBillingCycle(days: number): string {
  return days > 0 ? `${days} 天` : '-'
}

function formatPrice(row: SnapshotRow): string {
  if (row.price <= 0)
    return '-'

  const currency = financeHelper.normalizeCurrency(row.currency)
  const amount = financeHelper.formatFinanceAmount(row.price, currency)
  return `${amount.symbol}${amount.value} ${amount.currency}`
}

function formatMonthlyCost(row: SnapshotRow): string {
  const amount = financeHelper.formatFinanceAmount(row.monthlyCostCNY, 'CNY')
  return `${amount.symbol}${amount.value} CNY`
}

function getCostPerCore(row: SnapshotRow): number | null {
  return row.cpuCores > 0 ? row.monthlyCostCNY / row.cpuCores : null
}

function getCostPerMemoryGb(row: SnapshotRow): number | null {
  const memoryGb = row.memoryTotalBytes / 1024 ** 3
  return memoryGb > 0 ? row.monthlyCostCNY / memoryGb : null
}

function getCostPerTrafficGb(row: SnapshotRow): number | null {
  const trafficGb = row.trafficLimitBytes / 1024 ** 3
  return trafficGb > 0 ? row.monthlyCostCNY / trafficGb : null
}

function formatValueCost(value: number | null): string {
  if (value === null || !Number.isFinite(value))
    return '-'
  const amount = financeHelper.formatFinanceAmount(value, 'CNY')
  return `${amount.symbol}${amount.value} CNY`
}

function buildRow(node: NodeData): SnapshotRow {
  const providerMetadata = getNodeProviderMetadata(node)
  return {
    uuid: node.uuid,
    name: node.name,
    online: node.online,
    group: node.group,
    region: node.region,
    ipv4: node.ipv4 || '',
    ipv6: node.ipv6 || '',
    provider: providerMetadata?.provider?.displayName || '',
    asn: providerMetadata?.geo?.asn || '',
    org: providerMetadata?.geo?.org || '',
    os: node.os,
    arch: node.arch,
    virtualization: node.virtualization,
    cpuName: node.cpu_name,
    cpuCores: node.cpu_cores || 0,
    cpuUsage: node.cpu || 0,
    load1: node.load || 0,
    memoryUsedBytes: node.ram || 0,
    memoryTotalBytes: node.mem_total || 0,
    diskUsedBytes: node.disk || 0,
    diskTotalBytes: node.disk_total || 0,
    trafficUsedBytes: getTrafficUsed(node),
    trafficLimitBytes: node.traffic_limit || 0,
    trafficUsedPercent: getTrafficUsedPercentage(node),
    netInBytesPerSecond: node.net_in || 0,
    netOutBytesPerSecond: node.net_out || 0,
    uptimeSeconds: node.uptime || 0,
    price: node.price || 0,
    currency: node.currency,
    billingCycleDays: node.billing_cycle || 0,
    monthlyCostCNY: financeHelper.calculateMonthlyCostCNY(node, exchangeRates.value),
    expiredAt: node.expired_at,
    tags: node.tags,
  }
}

function buildRows(): SnapshotRow[] {
  return props.nodes.map(buildRow)
}

const rows = computed(buildRows)
const onlineCount = computed(() => props.nodes.filter(node => node.online).length)
const totalCpuCores = computed(() => props.nodes.reduce((sum, node) => sum + (node.cpu_cores || 0), 0))
const totalMemoryBytes = computed(() => props.nodes.reduce((sum, node) => sum + (node.mem_total || 0), 0))
const totalDiskBytes = computed(() => props.nodes.reduce((sum, node) => sum + (node.disk_total || 0), 0))
const totalMonthlyCostCNY = computed(() => rows.value.reduce((sum, row) => sum + row.monthlyCostCNY, 0))

const csvColumns: CsvColumn[] = [
  { label: '伺服器 ID', value: row => row.uuid },
  { label: '伺服器名稱', value: row => row.name },
  { label: '狀態', value: row => formatStatus(row.online) },
  { label: '分組', value: row => row.group || '-' },
  { label: '地區', value: row => row.region || '-' },
  { label: 'IPv4', value: row => row.ipv4 || '-' },
  { label: 'IPv6', value: row => row.ipv6 || '-' },
  { label: '服務商', value: row => row.provider || '-' },
  { label: 'ASN', value: row => row.asn || '-' },
  { label: 'ISP 業者', value: row => row.org || '-' },
  { label: '系統', value: row => row.os || '-' },
  { label: '架構', value: row => row.arch || '-' },
  { label: '虛擬化技術', value: row => row.virtualization || '-' },
  { label: 'CPU 型號', value: row => row.cpuName || '-' },
  { label: 'CPU 核心', value: row => row.cpuCores },
  { label: 'CPU 使用率', value: row => formatPercent(row.cpuUsage) },
  { label: '1 分鐘負載', value: row => formatLoad(row.load1) },
  { label: '記憶體用量', value: row => formatBytes(row.memoryUsedBytes) },
  { label: '記憶體總容量', value: row => formatBytes(row.memoryTotalBytes) },
  { label: '記憶體使用率', value: row => formatPercent(getPercent(row.memoryUsedBytes, row.memoryTotalBytes)) },
  { label: '磁碟用量', value: row => formatBytes(row.diskUsedBytes) },
  { label: '磁碟總容量', value: row => formatBytes(row.diskTotalBytes) },
  { label: '磁碟使用率', value: row => formatPercent(getPercent(row.diskUsedBytes, row.diskTotalBytes)) },
  { label: '傳輸用量', value: row => formatBytes(row.trafficUsedBytes) },
  { label: '傳輸用量上限', value: row => formatLimit(row.trafficLimitBytes) },
  { label: '傳輸用量佔比', value: row => row.trafficLimitBytes > 0 ? formatPercent(row.trafficUsedPercent) : '不限' },
  { label: '即時上傳', value: row => formatSpeed(row.netOutBytesPerSecond) },
  { label: '即時下載', value: row => formatSpeed(row.netInBytesPerSecond) },
  { label: '運作時間', value: row => formatUptime(row.uptimeSeconds) },
  { label: '總價', value: row => formatPrice(row) },
  { label: '計費週期', value: row => formatBillingCycle(row.billingCycleDays) },
  { label: '每月成本', value: row => formatMonthlyCost(row) },
  { label: '每核月成本', value: row => formatValueCost(getCostPerCore(row)) },
  { label: '每 GB RAM 月成本', value: row => formatValueCost(getCostPerMemoryGb(row)) },
  { label: '每 GB 傳輸量月成本', value: row => formatValueCost(getCostPerTrafficGb(row)) },
  { label: '到期時間', value: row => formatDate(row.expiredAt) },
  { label: '標籤', value: row => row.tags || '-' },
]

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => resolve(), { timeout: 80 })
      return
    }
    setTimeout(resolve, 0)
  })
}

async function buildRowsAsync(chunkSize = 250): Promise<SnapshotRow[]> {
  const result: SnapshotRow[] = []
  for (let index = 0; index < props.nodes.length; index++) {
    const node = props.nodes[index]
    if (node)
      result.push(buildRow(node))
    if ((index + 1) % chunkSize === 0)
      await yieldToBrowser()
  }
  return result
}

function buildJsonNode(row: SnapshotRow) {
  return {
    id: row.uuid,
    name: row.name,
    status: formatStatus(row.online),
    metadata: {
      group: row.group || '-',
      region: row.region || '-',
      ipv4: row.ipv4 || '-',
      ipv6: row.ipv6 || '-',
      provider: row.provider || '-',
      asn: row.asn || '-',
      organization: row.org || '-',
      tags: row.tags || '-',
    },
    system: {
      os: row.os || '-',
      arch: row.arch || '-',
      virtualization: row.virtualization || '-',
      cpu: row.cpuName || '-',
      cpuCores: row.cpuCores,
    },
    resources: {
      cpu: {
        usage: formatPercent(row.cpuUsage),
        load1: formatLoad(row.load1),
      },
      memory: {
        used: formatBytes(row.memoryUsedBytes),
        total: formatBytes(row.memoryTotalBytes),
        usage: formatPercent(getPercent(row.memoryUsedBytes, row.memoryTotalBytes)),
      },
      disk: {
        used: formatBytes(row.diskUsedBytes),
        total: formatBytes(row.diskTotalBytes),
        usage: formatPercent(getPercent(row.diskUsedBytes, row.diskTotalBytes)),
      },
      traffic: {
        used: formatBytes(row.trafficUsedBytes),
        limit: formatLimit(row.trafficLimitBytes),
        usage: row.trafficLimitBytes > 0 ? formatPercent(row.trafficUsedPercent) : '不限',
      },
      network: {
        upload: formatSpeed(row.netOutBytesPerSecond),
        download: formatSpeed(row.netInBytesPerSecond),
      },
    },
    billing: {
      price: formatPrice(row),
      cycle: formatBillingCycle(row.billingCycleDays),
      monthlyCost: formatMonthlyCost(row),
      valueMetrics: {
        costPerCore: formatValueCost(getCostPerCore(row)),
        costPerMemoryGb: formatValueCost(getCostPerMemoryGb(row)),
        costPerTrafficGb: formatValueCost(getCostPerTrafficGb(row)),
      },
      expiredAt: formatDate(row.expiredAt),
    },
    uptime: formatUptime(row.uptimeSeconds),
  }
}

async function verifySnapshotExportPermission(): Promise<boolean> {
  const granted = await appStore.requireLoginPermission('snapshotExport', { force: true })
  if (!granted) {
    window.$message?.warning('登入逾時，請重新登入。')
    return false
  }

  if (!appStore.exportSecondaryPassword)
    return true

  if (exportPasswordInput.value !== appStore.exportSecondaryPassword) {
    window.$message?.warning('無法匯出安全密碼。')
    return false
  }

  return true
}

async function exportJson(): Promise<void> {
  if (exporting.value)
    return
  if (!await verifySnapshotExportPermission())
    return

  exporting.value = 'json'
  try {
    await yieldToBrowser()
    const exportRows = await buildRowsAsync()
    const exportedAt = new Date()
    const content = await buildSnapshotJsonAsync(
      {
        generatedAt: formatDateTime(exportedAt),
        generatedAtIso: exportedAt.toISOString(),
        summary: {
          nodes: props.nodes.length,
          online: onlineCount.value,
          offline: props.nodes.length - onlineCount.value,
          cpuCores: totalCpuCores.value,
          memory: formatBytes(totalMemoryBytes.value),
          disk: formatBytes(totalDiskBytes.value),
          monthlyCost: financeHelper.formatFinanceAmount(totalMonthlyCostCNY.value, 'CNY'),
        },
      },
      exportRows,
      buildJsonNode,
      yieldToBrowser,
    )
    downloadText(
      `komari-snapshot-${Date.now()}.json`,
      content,
      'application/json;charset=utf-8',
    )
    void recordVisitorEvent({
      event: 'export_json',
      path: '/',
      route: 'home',
      target: 'snapshot',
      detail: { node_count: exportRows.length },
    })
  }
  finally {
    exporting.value = null
  }
}

async function exportCsv(): Promise<void> {
  if (exporting.value)
    return
  if (!await verifySnapshotExportPermission())
    return

  exporting.value = 'csv'
  try {
    await yieldToBrowser()
    const exportRows = await buildRowsAsync()
    downloadText(
      `komari-snapshot-${Date.now()}.csv`,
      await buildSnapshotCsvAsync(csvColumns, exportRows, yieldToBrowser),
      'text/csv;charset=utf-8',
      { bom: true },
    )
    void recordVisitorEvent({
      event: 'export_csv',
      path: '/',
      route: 'home',
      target: 'snapshot',
      detail: { node_count: exportRows.length },
    })
  }
  finally {
    exporting.value = null
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <CardX size="small" class="border-none bg-background/50">
        <div class="text-xs text-muted-foreground">
          可匯出伺服器總數
        </div>
        <div class="mt-1 text-2xl font-bold">
          {{ props.nodes.length }}
        </div>
        <div class="mt-1 text-[11px] text-muted-foreground">
          上線 {{ onlineCount }} / 離線 {{ props.nodes.length - onlineCount }}
        </div>
      </CardX>
      <CardX size="small" class="border-none bg-background/50">
        <div class="text-xs text-muted-foreground">
          CPU 
        </div>
        <div class="mt-1 text-2xl font-bold">
          {{ totalCpuCores }}
        </div>
        <div class="mt-1 text-[11px] text-muted-foreground">
          總計核心數
        </div>
      </CardX>
      <CardX size="small" class="border-none bg-background/50">
        <div class="text-xs text-muted-foreground">
          磁碟總消耗
        </div>
        <div class="mt-1 text-lg font-bold">
          {{ formatBytes(totalMemoryBytes) }} / {{ formatBytes(totalDiskBytes) }}
        </div>
        <div class="mt-1 text-[11px] text-muted-foreground">
          總計用量與總容量
        </div>
      </CardX>
      <CardX size="small" class="border-none bg-background/50">
        <div class="text-xs text-muted-foreground">
          每月成本
        </div>
        <div class="mt-1 text-2xl font-bold">
          {{ financeHelper.formatFinanceAmount(totalMonthlyCostCNY, 'CNY').symbol }}{{ financeHelper.formatFinanceAmount(totalMonthlyCostCNY, 'CNY').value }}
        </div>
        <div class="mt-1 text-[11px] text-muted-foreground">
          以人民幣為基準計算
        </div>
      </CardX>
    </div>

    <CardX class="border-none bg-background/50">
      <template #header>
        <div>
          <div class="font-semibold">
            匯出數據快照
          </div>
          <div class="text-xs text-muted-foreground">
            匯出目前所見伺服器規格、狀態、成本、廠商與 ASN 網路資訊。
          </div>
        </div>
      </template>
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2 text-sm text-muted-foreground">
          <div>JSON：依伺服器分組並保留易讀的單位格式；CSV：採中文欄位名稱、CP 值指標及 UTF-8 BOM 編碼，以確保使用 Excel 讀取時不出現亂碼。</div>
          <Input
            v-if="appStore.exportSecondaryPassword"
            v-model="exportPasswordInput"
            type="password"
            autocomplete="off"
            placeholder="匯出安全密碼"
            class="max-w-xs border-none bg-background/60"
          />
        </div>
        <div class="flex gap-2">
          <Button variant="outline" class="bg-background/60" :disabled="Boolean(exporting)" @click="exportJson">
            <Icon :icon="exporting === 'json' ? 'tabler:loader-2' : 'tabler:braces'" width="14" height="14" :class="exporting === 'json' && 'animate-spin'" />
            {{ exporting === 'json' ? '正在匯出' : '匯出 JSON' }}
          </Button>
          <Button variant="outline" class="bg-background/60" :disabled="Boolean(exporting)" @click="exportCsv">
            <Icon :icon="exporting === 'csv' ? 'tabler:loader-2' : 'tabler:file-spreadsheet'" width="14" height="14" :class="exporting === 'csv' && 'animate-spin'" />
            {{ exporting === 'csv' ? '正在匯出' : '匯出 CSV' }}
          </Button>
        </div>
      </div>
    </CardX>

    <CardX class="border-none bg-background/50" content-class="overflow-x-auto">
      <template #header>
        <div class="font-semibold">
          預覽匯出資訊
        </div>
      </template>
      <table class="min-w-[900px] w-full text-left text-sm">
        <thead class="text-xs text-muted-foreground">
          <tr class="border-b border-border/60">
            <th class="px-2 py-2 font-medium">
              伺服器
            </th>
            <th class="px-2 py-2 font-medium">
              狀態
            </th>
            <th class="px-2 py-2 font-medium">
              廠商 / ASN
            </th>
            <th class="px-2 py-2 font-medium">
              規格描述
            </th>
            <th class="px-2 py-2 font-medium">
              伺服器負載
            </th>
            <th class="px-2 py-2 font-medium">
              每月成本
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows.slice(0, 20)" :key="row.uuid" class="border-b border-border/40 last:border-0">
            <td class="px-2 py-3 font-medium">
              {{ row.name }}
            </td>
            <td class="px-2 py-3" :class="row.online ? 'text-success' : 'text-destructive'">
              {{ formatStatus(row.online) }}
            </td>
            <td class="px-2 py-3 text-xs text-muted-foreground">
              {{ row.provider || '-' }}<br>{{ row.asn || row.org || '-' }}
            </td>
            <td class="px-2 py-3 text-xs text-muted-foreground">
              {{ row.cpuCores }} 核 · {{ formatBytes(row.memoryTotalBytes) }} · {{ formatBytes(row.diskTotalBytes) }}
            </td>
            <td class="px-2 py-3 text-xs text-muted-foreground">
              CPU {{ formatPercent(row.cpuUsage) }} · 傳輸量 {{ row.trafficLimitBytes > 0 ? formatPercent(row.trafficUsedPercent) : '不限' }}
            </td>
            <td class="px-2 py-3 tabular-nums">
              {{ formatMonthlyCost(row) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="rows.length > 20" class="pt-3 text-xs text-muted-foreground">
        預覽匯出資訊僅包含前 20 筆資料，匯出檔案包含一共 {{ rows.length }} 筆資料。
      </div>
    </CardX>
  </div>
</template>
