<template>
  <div class="w-48 space-y-2.5 p-0.5">
    <!-- Time + traffic label -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-sm shrink-0" :style="{ backgroundColor: cellColor }" />
        <span class="font-mono font-semibold text-white">{{ time }}</span>
      </div>
      <span :class="['text-[10px] font-medium px-1.5 py-0.5 rounded', badge.class]">
        {{ badge.label }}
      </span>
    </div>

    <!-- Density bar -->
    <div class="space-y-1">
      <div class="h-1 w-full rounded-full bg-gray-700 overflow-hidden">
        <div
          class="h-full rounded-full"
          :style="{ width: `${densityPct}%`, backgroundColor: cellColor }"
        />
      </div>
      <div class="flex justify-between text-[10px] text-gray-600 tabular-nums">
        <span>{{ formatCount(minDataCount) }}</span>
        <span>{{ formatCount(bucket.dataCount) }}</span>
        <span>{{ formatCount(maxDataCount) }}</span>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs border-t border-gray-700 pt-2">
      <span class="text-gray-500">Records</span>
      <span class="text-right tabular-nums text-gray-200">{{ formatCount(bucket.dataCount) }}</span>
      <span class="text-gray-500">Size</span>
      <span class="text-right tabular-nums text-gray-200">{{ formatBytes(bucket.sizeOnDisk) }}</span>
      <span class="text-gray-500">Ratio</span>
      <span class="text-right tabular-nums text-gray-200">{{ formatRatio(bucket.compressionRatio) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bucket } from '~~/shared/types'

const props = defineProps<{
  bucket: Bucket
  hour: number
  minDataCount: number
  maxDataCount: number
}>()

const time = computed(() =>
  `${String(props.hour).padStart(2, '0')}:${String(props.bucket.date.minute ?? 0).padStart(2, '0')}`,
)

const cellColor = computed(() =>
  getCellColor(props.bucket.dataCount, props.minDataCount, props.maxDataCount),
)

const densityPct = computed(() => {
  const range = props.maxDataCount - props.minDataCount
  if (range === 0) return 50
  return Math.round(((props.bucket.dataCount - props.minDataCount) / range) * 100)
})

const badge = computed(() => {
  const pct = densityPct.value
  if (pct >= 80) return { label: 'Peak',   class: 'bg-green-900/60 text-green-300' }
  if (pct >= 60) return { label: 'High',   class: 'bg-green-900/40 text-green-400' }
  if (pct >= 40) return { label: 'Normal', class: 'bg-green-900/20 text-green-500' }
  if (pct >= 20) return { label: 'Low',    class: 'bg-gray-700/40 text-gray-300' }
  return              { label: 'Quiet',  class: 'bg-gray-700/30 text-gray-500' }
})
</script>
