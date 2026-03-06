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
        <ActionBar @download="showDownloadModal = true" @delete="showDeleteModal = true" />

        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4">
          <ChunkGrid />
        </div>

        <DashboardFooter />
      </template>

    </div>
  </div>

  <DownloadModal v-model:open="showDownloadModal" />
  <DeleteModal v-model:open="showDeleteModal" />
</template>

<script setup lang="ts">
const store = useChunksStore()

onMounted(() => store.fetchChunks())

const showDownloadModal = ref(false)
const showDeleteModal = ref(false)
</script>
