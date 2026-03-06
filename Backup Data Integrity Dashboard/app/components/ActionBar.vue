<template>
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
        @click="emit('download')"
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
        @click="emit('delete')"
      >
        Delete{{ hasSelection ? ` (${selectedCount})` : '' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  download: []
  delete: []
}>()

const store = useChunksStore()

const selectedCount = computed(() => store.selectedDates.length)
const totalBuckets = computed(() => store.data?.dataChunkCount ?? 0)
const hasSelection = computed(() => selectedCount.value > 0)
const allSelected = computed(() => hasSelection.value && selectedCount.value === totalBuckets.value)
const someSelected = computed(() => hasSelection.value)
</script>
