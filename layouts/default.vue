<script lang="ts" setup>
import { useAuthStore } from '~/stores/useAuthStore'
const auth = useAuthStore();

async function handleLogout() {
  await auth.logout();
}

</script>

<template>
  <div>
    <button v-if="auth.isLoggedIn" @click="handleLogout">Logout</button>
    <pre>{{ auth.user }}</pre>
    <ul>
      <li>
        <nuxt-link to="/">Home</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/register">Register</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/login">Log in</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/auth-only">Auth-protected</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/guest-only">Guest-protected</nuxt-link>
      </li>
    </ul>
    <slot />
  </div>
</template>

<style scoped></style>
