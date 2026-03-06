import type { Bucket } from '~~/shared/types'

interface TooltipState {
  visible: boolean
  x: number
  y: number
  bucket: Bucket | null
  hour: number
  minDataCount: number
  maxDataCount: number
}

const state = reactive<TooltipState>({
  visible: false,
  x: 0,
  y: 0,
  bucket: null,
  hour: 0,
  minDataCount: 0,
  maxDataCount: 0,
})

export function useChunkTooltip() {
  function show(e: MouseEvent, bucket: Bucket, hour: number, min: number, max: number) {
    state.bucket = bucket
    state.hour = hour
    state.minDataCount = min
    state.maxDataCount = max
    state.x = e.clientX
    state.y = e.clientY
    state.visible = true
  }

  function move(e: MouseEvent) {
    state.x = e.clientX
    state.y = e.clientY
  }

  function hide() {
    state.visible = false
  }

  return { state, show, move, hide }
}
