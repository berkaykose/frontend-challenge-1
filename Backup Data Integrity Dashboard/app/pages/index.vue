<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
    <div class="max-w-screen-xl mx-auto px-6 py-8 space-y-5">

      <!-- Loading -->
      <div v-if="store.loading" class="flex items-center justify-center py-40">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-4xl text-gray-300 dark:text-gray-600" />
      </div>

      <!-- Error -->
      <UAlert
        v-else-if="store.error"
        icon="i-lucide-alert-circle"
        color="error"
        variant="soft"
        :title="store.error"
      />

      <template v-else-if="store.data">
        <!-- Action bar -->
        <div class="flex items-center justify-between">
          <UCheckbox
            :model-value="allSelected"
            :indeterminate="someSelected && !allSelected"
            label="Select all"
            @update:model-value="store.toggleAll()"
          />

          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-download"
              size="sm"
              :color="hasSelection ? 'primary' : 'neutral'"
              :variant="hasSelection ? 'soft' : 'outline'"
              :class="!hasSelection ? 'opacity-40 cursor-not-allowed' : ''"
              :disabled="!hasSelection"
              @click="showDownloadModal = true"
            >
              Download{{ hasSelection ? ` (${selectedCount})` : '' }}
            </UButton>
            <UButton
              icon="i-lucide-trash-2"
              size="sm"
              :color="hasSelection ? 'error' : 'neutral'"
              :variant="hasSelection ? 'soft' : 'outline'"
              :class="!hasSelection ? 'opacity-40 cursor-not-allowed' : ''"
              :disabled="!hasSelection"
              @click="showDeleteModal = true"
            >
              Delete{{ hasSelection ? ` (${selectedCount})` : '' }}
            </UButton>
          </div>
        </div>

        <!-- Grid -->
        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4">
          <ChunkGrid />
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-6">
            <div>
              <p class="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Total Records</p>
              <p class="text-sm font-semibold tabular-nums">{{ formatCount(store.data.dataCount) }}</p>
            </div>
            <div>
              <p class="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Total Chunks</p>
              <p class="text-sm font-semibold tabular-nums">{{ store.data.dataChunkCount.toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">Size on Disk</p>
              <p class="text-sm font-semibold tabular-nums">{{ formatBytes(store.data.sizeOnDisk) }}</p>
            </div>
          </div>

          <!-- Color scale -->
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

    </div>
  </div>

  <DownloadModal v-model:open="showDownloadModal" />
  <DeleteModal v-model:open="showDeleteModal" />
</template>

<script setup lang="ts">
const store = useChunksStore()

onMounted(() => store.fetchChunks())

const selectedCount = computed(() => store.selectedDates.length)
const totalBuckets = computed(() => store.data?.dataChunkCount ?? 0)
const hasSelection = computed(() => selectedCount.value > 0)
const allSelected = computed(() => hasSelection.value && selectedCount.value === totalBuckets.value)
const someSelected = computed(() => hasSelection.value)

const showDownloadModal = ref(false)
const showDeleteModal = ref(false)
</script>
