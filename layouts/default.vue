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
      <div class="header-auth-buttons" v-if="!auth.isLoggedIn">
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </div>
      <div class="header-auth-buttons" v-else>
        <span @click="handleLogout()">Logout</span>
      </div>
    </div>
  </header>
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
