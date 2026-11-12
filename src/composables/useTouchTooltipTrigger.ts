import type { Ref } from 'vue'
import { onMounted, onScopeDispose } from 'vue'

// Adapted from VoyagerProbe's gesture checks for existing reka-ui tooltips.
const TAP_DISTANCE = 8
const TAP_DURATION = 400
const COMPATIBILITY_WINDOW = 700

export function useTouchTooltipTrigger(enabled: Ref<boolean>, close: () => void) {
  let candidate: { id: number, x: number, y: number, at: number } | null = null
  let lastTouch = -Infinity
  function cancel() {
    candidate = null
  }
  function pointerDown(event: PointerEvent) {
    if (!enabled.value || (event.pointerType !== 'touch' && event.pointerType !== 'pen'))
      return
    lastTouch = performance.now()
    candidate = event.isPrimary ? { id: event.pointerId, x: event.clientX, y: event.clientY, at: performance.now() } : null
  }
  function pointerMove(event: PointerEvent) {
    if (candidate?.id === event.pointerId && Math.hypot(event.clientX - candidate.x, event.clientY - candidate.y) > TAP_DISTANCE)
      cancel()
  }
  function pointerUp(event: PointerEvent, toggle: () => void) {
    const tap = candidate
    cancel()
    if (!tap || tap.id !== event.pointerId || performance.now() - tap.at > TAP_DURATION
      || Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > TAP_DISTANCE) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    lastTouch = performance.now()
    toggle()
  }
  function click(event: MouseEvent, toggle: () => void) {
    event.stopPropagation()
    if (!enabled.value || (event.detail !== 0 && performance.now() - lastTouch < COMPATIBILITY_WINDOW))
      return
    toggle()
  }
  function outside(event: PointerEvent) {
    if (!enabled.value)
      return
    if (candidate && candidate.id !== event.pointerId)
      cancel()
    if (!(event.target instanceof Element) || !event.target.closest('[data-ping-tooltip-trigger], [data-slot="tooltip-content"]'))
      close()
  }
  function reset() {
    cancel()
    close()
  }
  onMounted(() => {
    document.addEventListener('pointerdown', outside, true)
    window.addEventListener('resize', reset)
    window.addEventListener('scroll', reset, true)
  })
  onScopeDispose(() => {
    document.removeEventListener('pointerdown', outside, true)
    window.removeEventListener('resize', reset)
    window.removeEventListener('scroll', reset, true)
    reset()
  })
  return { pointerDown, pointerMove, pointerUp, click, cancel, reset }
}
