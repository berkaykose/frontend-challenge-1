<template>
  <div class="flex items-center gap-3 shrink-0">
    <!-- Records -->
    <UTooltip text="Total log records stored in this hour">
      <div class="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 tabular-nums cursor-default select-none">
        <UIcon name="i-lucide-database" class="size-3 shrink-0 text-gray-400 dark:text-gray-600" />
        <span>{{ formatCount(group.dataCount) }}</span>
      </div>
    </UTooltip>

    <!-- Size on disk -->
    <UTooltip :text="`Compressed data stored on disk\n${group.dataChunkCount.toLocaleString()} chunks`">
      <div class="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 tabular-nums cursor-default select-none">
        <UIcon name="i-lucide-hard-drive" class="size-3 shrink-0 text-gray-400 dark:text-gray-600" />
        <span>{{ formatBytes(group.sizeOnDisk) }}</span>
      </div>
    </UTooltip>

    <!-- Compression -->
    <UTooltip :text="compressionTooltip">
      <div class="flex items-center gap-1 text-[11px] tabular-nums cursor-default select-none" :class="savingsColorClass">
        <UIcon name="i-lucide-archive" class="size-3 shrink-0" />
        <span>{{ savingsPct }}% saved</span>
      </div>
    </UTooltip>
  </div>
</template>

<script setup lang="ts">
import type { ChunkGroup } from '~~/shared/types'

const props = defineProps<{ group: ChunkGroup }>()

const savingsPct = computed(() =>
  Math.round((1 - 1 / props.group.compressionRatio) * 100),
)

const compressionTooltip = computed(() =>
  `${formatBytes(props.group.uncompressedBytes)} original → ${formatBytes(props.group.sizeOnDisk)} on disk (${props.group.compressionRatio.toFixed(2)}x ratio)`,
)

const savingsColorClass = computed(() => {
  const pct = savingsPct.value
  if (pct >= 90) return 'text-green-500 dark:text-green-400'
  if (pct >= 75) return 'text-green-600 dark:text-green-500'
  return 'text-gray-400 dark:text-gray-500'
})
</script>
