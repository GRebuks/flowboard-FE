<script lang="ts" setup>
import { useAuthStore } from '~/stores/useAuthStore'
const colorMode = useColorMode();
const auth = useAuthStore();
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>
<template>
  <div class="text-center mt-[100px]">
    <router-link to="/" class="text-4xl text-center mr-auto ml-auto w-[50%] text-primary">Flowboard</router-link>
  </div>
  <slot />
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark"
    />

    <UPopover v-if="auth.isLoggedIn" :popper="{ placement: 'bottom-start' }">
      <UButton
          icon="i-heroicons-paint-brush-16-solid"
      ></UButton>
      <template #panel="{ close }">
        <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
          <ColorPicker />
        </div>
      </template>
    </UPopover>

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
  <UNotifications />
</template>
