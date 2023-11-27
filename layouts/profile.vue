<script lang="ts" setup>
const colorMode = useColorMode();
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

import { useAuthStore } from '~/stores/useAuthStore';
const auth = useAuthStore();

async function handleLogout() {
  await auth.logout();
}
</script>
<template>
  <header>
    <div>
      <div>
        <RouterLink to="/" class="header-title">Flowboard</RouterLink>
      </div>

      <div class="header-auth-buttons">
        <span @click="handleLogout">Logout</span>
      </div>
    </div>
  </header>
  <h1 class="text-center mt-3" v-if="auth?.user">Hi, {{auth.user.username}} 👋</h1>
  <slot />
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<style>
span {
  cursor: pointer;
}
</style>