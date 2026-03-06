<template>
  <header class="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
          <UIcon name="i-lucide-shield-check" class="text-green-500 dark:text-green-400 text-lg" />
        </div>
        <div class="leading-tight">
          <p class="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-widest uppercase">Firewall Monitoring</p>
          <h1 class="text-sm font-semibold text-gray-900 dark:text-white">Data Integrity Dashboard</h1>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <UIcon name="i-lucide-calendar" class="text-gray-400 dark:text-gray-600" />
          <span>{{ formattedDate }}</span>
        </div>

        <UButton
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          size="sm"
          :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleColorMode"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})
</script>
