<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";


const form = ref({
  email: 'test@example.com',
  password: 'password',
})

const auth = useAuthStore();

async function handleLogin() {
  if (auth.isLoggedIn) {
    return navigateTo("/");
  }

  const {error} = await auth.login(form.value);
  
  if (!error.value) {
    return navigateTo("/");
  }
}

</script>

<template>
  <form @submit.prevent="handleLogin">

    <label for="email">
      E-mail
      <input type="email" id="email" name="email" v-model="form.email">
    </label>

    <label for="password">
      Password
      <input type="password" id="password" name="password" v-model="form.password">
    </label>

    <button type="submit">Log in</button>

  </form>
</template>

<style scoped></style>
