<script lang="ts" setup>
const colorMode = useColorMode();

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
  <div>
    <h1>Color mode: {{ colorMode.value }}</h1>
    <select v-model="colorMode.preference">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="test">Test</option>
    </select>
  </div>
</template>

<style>
span {
  cursor: pointer;
}
</style>