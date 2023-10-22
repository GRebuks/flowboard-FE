<script lang="ts" setup>
import { useAuthStore } from '~/stores/useAuthStore';
const auth = useAuthStore();

async function handleLogout() {
  await auth.logout();
}

const colorMode = useColorMode();

console.log(colorMode.preference)

</script>

<template>
  <div>
    <button v-if="auth.isLoggedIn" @click="handleLogout">Logout</button>
    <pre>{{ auth.user }}</pre>
    <header>
      <h1 class="title">PMS</h1>
      <ul class="navbar">
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li v-if="!auth.isLoggedIn">
          <nuxt-link to="/register">Register</nuxt-link>
        </li>
        <li v-if="!auth.isLoggedIn">
          <nuxt-link to="/login">Log in</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/auth-only">Auth-protected</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/guest-only">Guest-protected</nuxt-link>
        </li>
      </ul>
    </header>
    <slot />
  </div>
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

<style scoped lang="scss">
@use '~/assets/scss/base';

header {
  display: flex;
  width: 100%;
  height: 8vh;
  margin: 0;
}

.title {
  width: 10%;
  line-height: 4vh;
  height: 4vh;
  background-color: var(--bg-color-secondary);
  margin: 1% 0 1% 1%;
}

.navbar {
  display: flex;
  width: 100%;
  list-style: none;
  line-height: 4vh;
  font-size: 18px;
  height: 4vh;
  background-color: var(--bg-color-secondary);
  margin: 1% 0 1% 0;
  padding: 0;

  li {
    padding: 0 1% 0 1%;
    background-color: var(--bg-color-secondary);
    &:hover {
      background-color: var(--bg-color-primary);
    }

    a {
      color: var(--text-color-accent);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

</style>
