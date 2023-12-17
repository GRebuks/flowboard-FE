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
  <header class="bg-white dark:bg-gray-950 border-b border-b-gray-200 dark:border-b-gray-800 shadow shadow-gray-200 dark:shadow-gray-900 flex items-center justify-center h-[60px] w-full">
    <div class="max-w-[1440px] w-full px-[20px] flex">
      <div>
        <RouterLink to="/" class="font-bold text-primary text-2xl">Flowboard</RouterLink>
      </div>
      <div class="flex justify-between grow pl-20">
        <div class="flex gap-10">
          <div class="flex items-center gap-[20px]" v-if="auth.isLoggedIn">
            <RouterLink to="/workspaces">Workspaces</RouterLink>
          </div>
          <div class="flex items-center gap-[20px]" v-if="auth.isLoggedIn">
            <RouterLink to="/about">About</RouterLink>
          </div>
        </div>
        <div class="flex items-center gap-[20px]">
          <span @click="handleLogout()">Logout</span>
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
          <UAvatar
              chip-color="primary"
              chip-text=""
              chip-position="top-right"
              size="sm"
              src="https://avatars.githubusercontent.com/u/85909171?v=4"
              alt="Avatar"
          />
        </div>
      </div>
    </div>
  </header>
  <h1 class="text-center mt-3" v-if="auth?.user">Hi, {{auth.user.username}} 👋</h1>
  <slot />
</template>

<style>
span {
  cursor: pointer;
}
</style>