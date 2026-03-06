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

export function useChunkTooltip() {
  const state = useState<TooltipState>('chunk-tooltip', () => ({
    visible: false,
    x: 0,
    y: 0,
    bucket: null,
    hour: 0,
    minDataCount: 0,
    maxDataCount: 0,
  }))

  function show(e: MouseEvent, bucket: Bucket, hour: number, min: number, max: number) {
    state.value.bucket = bucket
    state.value.hour = hour
    state.value.minDataCount = min
    state.value.maxDataCount = max
    state.value.x = e.clientX
    state.value.y = e.clientY
    state.value.visible = true
  }

  function move(e: MouseEvent) {
    state.value.x = e.clientX
    state.value.y = e.clientY
  }

  function hide() {
    state.value.visible = false
  }

  return { state, show, move, hide }
}
