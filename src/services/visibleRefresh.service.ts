// Inspired by VoyagerProbe's shared refresh scheduler. One timer for all
// subscribers; background/offline tabs resume with one refresh on recovery.
const callbacks = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | null = null

function canRefresh(): boolean {
  return typeof document === 'undefined' || (!document.hidden && navigator.onLine !== false)
}

function refresh(): void {
  for (const callback of [...callbacks])
    callback()
}

function sync(): void {
  if (!canRefresh() || !callbacks.size) {
    if (timer)
      clearInterval(timer)
    timer = null
    return
  }
  if (timer)
    return
  refresh()
  timer = setInterval(refresh, 60_000)
}

export function subscribeVisibleRefresh(callback: () => void): () => void {
  callbacks.add(callback)
  if (callbacks.size === 1 && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
  }
  // Initial loading is owned by the subscriber; recovery refreshes immediately.
  if (!timer && canRefresh())
    timer = setInterval(refresh, 60_000)
  let released = false
  return () => {
    if (released)
      return
    released = true
    callbacks.delete(callback)
    if (callbacks.size)
      return
    sync()
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }
}
