<template>
  <UModal v-model:open="open" :ui="{ footer: 'justify-between' }">
    <template #header>
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-trash-2" class="text-red-500" />
        </div>
        <div>
          <p class="font-semibold text-gray-900 dark:text-white">Delete Chunks</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ selectedBuckets.length }} chunk{{ selectedBuckets.length !== 1 ? 's' : '' }} selected</p>
        </div>
      </div>
    </template>

    <template #body>
      <!-- Success state -->
      <div v-if="result" class="flex flex-col items-center gap-3 py-6 text-center">
        <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
          <UIcon name="i-lucide-check" class="text-green-500 text-2xl" />
        </div>
        <p class="font-medium text-gray-900 dark:text-white">{{ result.additionalInfo }}</p>
        <p class="text-sm text-gray-400">{{ result.processedFileIds.length }} file{{ result.processedFileIds.length !== 1 ? 's' : '' }} removed from storage.</p>
      </div>

      <template v-else>
        <!-- Warning -->
        <UAlert
          icon="i-lucide-alert-triangle"
          color="error"
          variant="soft"
          title="This action is irreversible"
          description="Deleted chunks cannot be recovered. Make sure you have downloaded any files you need before proceeding."
          class="mb-4"
        />

        <!-- Summary -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <div class="rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-3 text-center">
            <p class="text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{{ selectedBuckets.length.toLocaleString() }}</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Chunks</p>
          </div>
          <div class="rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-3 text-center">
            <p class="text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{{ formatBytes(totalSize) }}</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Total Size</p>
          </div>
          <div class="rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 p-3 text-center">
            <p class="text-lg font-semibold tabular-nums text-gray-900 dark:text-white">{{ formatCount(totalRecords) }}</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Records</p>
          </div>
        </div>

        <!-- Chunk list -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden mb-4">
          <div class="max-h-44 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
            <div
              v-for="bucket in visibleBuckets"
              :key="`${bucket.date.hour}-${bucket.date.minute}`"
              class="flex items-center justify-between px-3 py-2 text-xs"
            >
              <span class="font-mono text-gray-600 dark:text-gray-300">
                {{ String(bucket.date.hour).padStart(2, '0') }}:{{ String(bucket.date.minute ?? 0).padStart(2, '0') }}
              </span>
              <div class="flex items-center gap-3 text-gray-400 dark:text-gray-500 tabular-nums">
                <span>{{ formatCount(bucket.dataCount) }} rec</span>
                <span>{{ formatBytes(bucket.sizeOnDisk) }}</span>
              </div>
            </div>
            <button
              v-if="hiddenCount > 0"
              class="w-full px-3 py-2 text-xs text-primary-500 dark:text-primary-400 text-center bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              @click="showMore"
            >
              Show {{ Math.min(PAGE_SIZE, hiddenCount) }} more
              <span class="text-gray-400 dark:text-gray-500">({{ hiddenCount }} remaining)</span>
            </button>
          </div>
        </div>

        <!-- Confirmation checkbox -->
        <UCheckbox
          v-model="confirmed"
          label="I understand this action cannot be undone"
          color="error"
        />
      </template>
    </template>

    <template #footer>
      <UButton color="neutral" variant="ghost" @click="open = false">
        {{ result ? 'Close' : 'Cancel' }}
      </UButton>
      <UButton
        v-if="!result"
        icon="i-lucide-trash-2"
        color="error"
        :disabled="!confirmed"
        :loading="deleting"
        @click="handleDelete"
      >
        Delete ({{ selectedBuckets.length }})
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Bucket, DeleteResult } from '~~/shared/types'

const PAGE_SIZE = 8

const open = defineModel<boolean>('open', { required: true })
const store = useChunksStore()

const confirmed = ref(false)
const deleting = ref(false)
const result = ref<DeleteResult | null>(null)
const visibleCount = ref(PAGE_SIZE)

watch(open, (isOpen) => {
  if (!isOpen) {
    confirmed.value = false
    result.value = null
    visibleCount.value = PAGE_SIZE
  }
})

const selectedBuckets = computed<Bucket[]>(() => {
  if (!store.data) return []
  return store.selectedDates
    .map(date => {
      const group = store.data!.groups.find(g => g.date.hour === date.hour)
      return group?.buckets.find(b => b.date.minute === date.minute)
    })
    .filter((b): b is Bucket => !!b)
    .sort((a, b) => a.date.hour !== b.date.hour ? a.date.hour - b.date.hour : (a.date.minute ?? 0) - (b.date.minute ?? 0))
})

const visibleBuckets = computed(() => selectedBuckets.value.slice(0, visibleCount.value))
const hiddenCount = computed(() => Math.max(0, selectedBuckets.value.length - visibleCount.value))

function showMore() {
  visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, selectedBuckets.value.length)
}
const totalSize = computed(() => selectedBuckets.value.reduce((s, b) => s + b.sizeOnDisk, 0))
const totalRecords = computed(() => selectedBuckets.value.reduce((s, b) => s + b.dataCount, 0))

async function handleDelete() {
  deleting.value = true
  try {
    result.value = await $fetch<DeleteResult>('/api/chunks', {
      method: 'DELETE',
      body: { dates: store.selectedDates },
    })
    store.clearSelection()
  }
  catch {
    result.value = {
      processedFileIds: [],
      failedFileIds: [],
      status: 'failed',
      additionalInfo: 'Delete operation failed. Please try again.',
    }
  }
  finally {
    deleting.value = false
  }
}
</script>
