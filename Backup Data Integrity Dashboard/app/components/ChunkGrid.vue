<template>
  <div class="space-y-0.5">
    <ChunkRow
      v-for="group in [...store.data!.groups].sort((a, b) => a.date.hour - b.date.hour)"
      :key="group.date.hour"
      :group="group"
      :min-data-count="store.data!.minDataCount"
      :max-data-count="store.data!.maxDataCount"
    />
  </div>
</template>

<script setup lang="ts">
const store = useChunksStore()
</script>
