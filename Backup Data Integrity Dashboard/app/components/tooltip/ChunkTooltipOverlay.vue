<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-100"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-75"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.visible && state.bucket"
        class="fixed z-50 pointer-events-none"
        :style="tooltipStyle"
      >
        <div class="bg-gray-900 border border-gray-700/60 rounded-lg shadow-xl shadow-black/40 p-3 w-52">
          <!-- Time + traffic badge -->
          <div class="flex items-center justify-between mb-2.5">
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-sm shrink-0" :style="{ backgroundColor: cellColor }" />
              <span class="font-mono font-semibold text-sm text-white">{{ time }}</span>
            </div>
            <span :class="['text-[10px] font-medium px-1.5 py-0.5 rounded', badge.class]">
              {{ badge.label }}
            </span>
          </div>

          <!-- Density bar -->
          <div class="mb-2.5">
            <div class="h-1.5 w-full rounded-full bg-gray-700 overflow-hidden">
              <div
                class="h-full rounded-full"
                :style="{ width: `${densityPct}%`, backgroundColor: cellColor }"
              />
            </div>
            <div class="flex justify-between text-[10px] text-gray-600 tabular-nums mt-1">
              <span>{{ formatCount(state.minDataCount) }}</span>
              <span class="text-gray-400">{{ formatCount(state.bucket.dataCount) }}</span>
              <span>{{ formatCount(state.maxDataCount) }}</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs border-t border-gray-700/60 pt-2">
            <span class="text-gray-500">Records</span>
            <span class="text-right tabular-nums text-gray-200">{{ formatCount(state.bucket.dataCount) }}</span>
            <span class="text-gray-500">Size</span>
            <span class="text-right tabular-nums text-gray-200">{{ formatBytes(state.bucket.sizeOnDisk) }}</span>
            <span class="text-gray-500">Ratio</span>
            <span class="text-right tabular-nums text-gray-200">{{ formatRatio(state.bucket.compressionRatio) }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { state } = useChunkTooltip()

const OFFSET = 16

const tooltipStyle = computed(() => {
  const x = state.x + OFFSET
  const y = state.y + OFFSET
  const w = 208 // w-52 = 13rem = 208px

  // flip left if too close to right edge
  const left = typeof window !== 'undefined' && x + w > window.innerWidth
    ? state.x - w - OFFSET
    : x

  return {
    top: `${y}px`,
    left: `${left}px`,
  }
})

const cellColor = computed(() =>
  state.bucket
    ? getCellColor(state.bucket.dataCount, state.minDataCount, state.maxDataCount)
    : '#22c55e',
)

const densityPct = computed(() => {
  if (!state.bucket) return 0
  const range = state.maxDataCount - state.minDataCount
  if (range === 0) return 50
  return Math.round(((state.bucket.dataCount - state.minDataCount) / range) * 100)
})

const time = computed(() => {
  if (!state.bucket) return ''
  return `${String(state.hour).padStart(2, '0')}:${String(state.bucket.date.minute ?? 0).padStart(2, '0')}`
})

const badge = computed(() => {
  const pct = densityPct.value
  if (pct >= 80) return { label: 'Peak',   class: 'bg-green-900/60 text-green-300' }
  if (pct >= 60) return { label: 'High',   class: 'bg-green-800/50 text-green-400' }
  if (pct >= 40) return { label: 'Normal', class: 'bg-green-900/30 text-green-500' }
  if (pct >= 20) return { label: 'Low',    class: 'bg-gray-700/50 text-gray-300'  }
  return              { label: 'Quiet',  class: 'bg-gray-700/30 text-gray-500'  }
})
</script>
