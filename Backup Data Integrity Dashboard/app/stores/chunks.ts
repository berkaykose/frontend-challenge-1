import { defineStore } from 'pinia'
import type { SignedFilesResponse, ChunkDate } from '~~/shared/types'

export const useChunksStore = defineStore('chunks', () => {
  const data = ref<SignedFilesResponse | null>(null)
  const selectedDates = ref<ChunkDate[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const selectedKey = (d: ChunkDate) => `${d.hour}:${d.minute}`
  const selectedSet = computed(() => new Set(selectedDates.value.map(selectedKey)))

  async function fetchChunks() {
    loading.value = true
    error.value = null
    try {
      data.value = await $fetch<SignedFilesResponse>('/api/chunks')
    }
    catch (e) {
      error.value = 'Failed to load chunk data'
    }
    finally {
      loading.value = false
    }
  }

  function isSelected(date: ChunkDate): boolean {
    return selectedSet.value.has(selectedKey(date))
  }

  function toggleChunk(date: ChunkDate) {
    const key = selectedKey(date)
    const idx = selectedDates.value.findIndex(d => selectedKey(d) === key)
    if (idx === -1) {
      selectedDates.value.push(date)
    }
    else {
      selectedDates.value.splice(idx, 1)
    }
  }

  function toggleGroup(groupHour: number) {
    if (!data.value) return
    const group = data.value.groups.find(g => g.date.hour === groupHour)
    if (!group) return

    const allSelected = group.buckets.every(b => isSelected(b.date))
    if (allSelected) {
      selectedDates.value = selectedDates.value.filter(d => d.hour !== groupHour)
    }
    else {
      const toAdd = group.buckets
        .filter(b => !isSelected(b.date))
        .map(b => b.date)
      selectedDates.value.push(...toAdd)
    }
  }

  function toggleAll() {
    if (!data.value) return
    const allBuckets = data.value.groups.flatMap(g => g.buckets)
    if (selectedDates.value.length === allBuckets.length) {
      selectedDates.value = []
    }
    else {
      selectedDates.value = allBuckets.map(b => b.date)
    }
  }

  function clearSelection() {
    selectedDates.value = []
  }

  return {
    data,
    selectedDates,
    selectedSet,
    loading,
    error,
    fetchChunks,
    isSelected,
    toggleChunk,
    toggleGroup,
    toggleAll,
    clearSelection,
  }
})
