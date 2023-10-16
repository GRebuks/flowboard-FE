<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";


const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
})

const auth = useAuthStore();

async function handleRegister() {
  const {error} = await auth.register(form.value);
  if (!error.value) {
    navigateTo("/");
  }
}

</script>

<template>
  <form @submit.prevent="handleRegister">

    <label for="name">
      Name
      <input v-model="form.name" type="text" id="name" name="name">
    </label>

    <label for="email">
      E-mail
      <input v-model="form.email" type="email" id="email" name="email">
    </label>

    <label for="password">
      Password
      <input v-model="form.password" type="password" id="password" name="password">
    </label>

    <label for="password_confirmation">
      Confirm password
      <input v-model="form.password_confirmation" type="password" id="password_confirmation" name="password_confirmation">
    </label>

    <button type="submit">Register</button>

  </form>
</template>

<style scoped></style>
