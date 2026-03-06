<template>
  <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
    <div class="flex items-center gap-6">
      <div>
        <p class="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Total Records</p>
        <p class="text-sm font-semibold tabular-nums">{{ formatCount(store.data!.dataCount) }}</p>
      </div>
      <div>
        <p class="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Total Chunks</p>
        <p class="text-sm font-semibold tabular-nums">{{ store.data!.dataChunkCount.toLocaleString() }}</p>
      </div>
      <div>
        <p class="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Size on Disk</p>
        <p class="text-sm font-semibold tabular-nums">{{ formatBytes(store.data!.sizeOnDisk) }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 select-none">
      <span>Less</span>
      <div class="flex gap-[3px]">
        <div
          v-for="(color, i) in COLOR_PALETTE"
          :key="i"
          class="w-3.5 h-3.5 rounded-sm"
          :style="{ backgroundColor: color }"
        />
      </div>
      <span>More</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useChunksStore()
</script>
