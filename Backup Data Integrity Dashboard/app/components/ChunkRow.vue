<template>
  <div
    class="flex items-center gap-3 py-[3px] px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900/60 transition-colors group"
  >
    <!-- Checkbox -->
    <UCheckbox
      :model-value="groupFullySelected"
      :indeterminate="groupPartialSelected && !groupFullySelected"
      @update:model-value="store.toggleGroup(group.date.hour)"
    />

    <!-- Hour label -->
    <span class="text-xs font-mono text-gray-400 dark:text-gray-500 w-10 shrink-0 select-none">
      {{ String(group.date.hour).padStart(2, '0') }}:00
    </span>

    <!-- 60 minute cells -->
    <div class="flex gap-[2px] shrink-0">
      <button
        v-for="bucket in group.buckets"
        :key="bucket.date.minute"
        v-memo="[store.isSelected(bucket.date), colorMode.value]"
        class="w-3 h-3 rounded-sm shrink-0 transition-transform duration-75 hover:scale-125 focus-visible:outline-none cursor-pointer"
        :style="cellStyle(bucket)"
        @click="store.toggleChunk(bucket.date)"
        @mouseenter="(e) => tooltip.show(e, bucket, group.date.hour, minDataCount, maxDataCount)"
        @mousemove="tooltip.move"
        @mouseleave="tooltip.hide"
      />
    </div>

    <!-- Group stats -->
    <ChunkRowStats class="ml-auto" :group="group" />
  </div>
</template>

<script setup lang="ts">
import type { ChunkGroup, Bucket } from '~~/shared/types'

const props = defineProps<{
  group: ChunkGroup
  minDataCount: number
  maxDataCount: number
}>()

const store = useChunksStore()
const colorMode = useColorMode()
const tooltip = useChunkTooltip()

const groupFullySelected = computed(() =>
  props.group.buckets.every(b => store.isSelected(b.date)),
)
const groupPartialSelected = computed(() =>
  props.group.buckets.some(b => store.isSelected(b.date)),
)

const CHECKMARK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 6l2.8 2.8 5-5' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`

function cellStyle(bucket: Bucket) {
  const selected = store.isSelected(bucket.date)
  const bg = getCellColor(bucket.dataCount, props.minDataCount, props.maxDataCount)
  const isDark = colorMode.value === 'dark'
  const empty = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'

  return {
    backgroundColor: bg === 'transparent' ? empty : bg,
    backgroundImage: selected ? CHECKMARK : 'none',
    backgroundSize: '100% 100%',
    boxShadow: selected ? 'inset 0 0 0 12px rgba(0,0,0,0.35)' : 'none',
  }
}
</script>
