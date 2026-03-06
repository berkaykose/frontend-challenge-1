<template>
  <UModal v-model:open="open" title="Download Chunks" :ui="{ footer: 'justify-between' }">
    <template #body>
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-10 gap-3">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-3xl text-gray-400" />
        <p class="text-sm text-gray-400">Generating download links…</p>
      </div>

      <!-- Error -->
      <UAlert v-else-if="error" icon="i-lucide-alert-circle" color="error" variant="soft" :title="error" />

      <!-- File list -->
      <div v-else-if="files.length" class="space-y-2">
        <!-- Summary row -->
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs text-gray-400 dark:text-gray-500">
            {{ files.length }} file{{ files.length !== 1 ? 's' : '' }} ready — links expire in 48 hours.
          </p>
          <UButton
            v-if="files.length > 1"
            icon="i-lucide-download"
            size="xs"
            color="primary"
            variant="ghost"
            :loading="downloadingAll"
            @click="downloadAll"
          >
            Download all
          </UButton>
        </div>

        <div
          v-for="file in files"
          :key="file.fileId"
          class="flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <UIcon name="i-lucide-file" class="text-gray-400 dark:text-gray-500 shrink-0" />
            <div class="min-w-0">
              <p class="text-sm font-mono text-gray-700 dark:text-gray-200 truncate">{{ file.fileName }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500">{{ formatBytes(file.fileSize) }}</p>
            </div>
          </div>
          <UButton
            icon="i-lucide-download"
            size="xs"
            color="primary"
            variant="soft"
            :to="file.downloadUrl"
            target="_blank"
            external
          >
            Download
          </UButton>
        </div>
      </div>
    </template>

    <template #footer>
      <p v-if="files.length > 1" class="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
        {{ formatBytes(totalSize) }} total
      </p>
      <span v-else />
      <UButton color="neutral" variant="ghost" @click="open = false">Close</UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { DownloadFile } from '~~/shared/types'

const open = defineModel<boolean>('open', { required: true })
const store = useChunksStore()

const loading = ref(false)
const error = ref<string | null>(null)
const files = ref<DownloadFile[]>([])
const downloadingAll = ref(false)

const totalSize = computed(() => files.value.reduce((s, f) => s + f.fileSize, 0))

watch(open, async (isOpen) => {
  if (!isOpen) return
  files.value = []
  error.value = null
  loading.value = true
  try {
    files.value = await $fetch<DownloadFile[]>('/api/chunks/download-urls', {
      method: 'POST',
      body: { dates: store.selectedDates },
    })
  }
  catch {
    error.value = 'Failed to generate download links. Please try again.'
  }
  finally {
    loading.value = false
  }
})

async function downloadAll() {
  downloadingAll.value = true
  for (let i = 0; i < files.value.length; i++) {
    const a = document.createElement('a')
    a.href = files.value[i]!.downloadUrl
    a.download = files.value[i]!.fileName
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    if (i < files.value.length - 1) await new Promise(r => setTimeout(r, 120))
  }
  downloadingAll.value = false
}
</script>
