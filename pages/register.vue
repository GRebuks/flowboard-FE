<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})

const form = ref({
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
})

const errors = ref();

const auth = useAuthStore();

async function handleRegister() {
  const {error} = await auth.register(form.value);

  if (!error.value) {
    return navigateTo("/");
  } else {
    errors.value = error.value.data.errors;
  }
}
</script>

<template>
  <main>
    <h3 class="text-center mt-[10px]">Register</h3>
    <form @submit.prevent="handleRegister" class="flex flex-col items-center max-w-[350px] w-full ml-auto mr-auto mt-[20px]">
      <div v-if="errors" class="bg-red-400/50 dark:bg-red-950/50 border border-red-700 dark:border-red-700 w-full p-8 m-2 rounded-lg">
        <ul>
          <div v-for="error in errors" class="alert alert-danger" role="alert">
            <div v-for="message in error">
              <li>{{ message }}</li>
            </div>
          </div>
        </ul>
      </div>
      <div class="w-60">
        <label for="input-username">Username</label>
        <UInput
            :ui="{rounded: 'rounded-lg'}"
            color="primary"
            variant="outline"
            size="l"
            type="text"
            id="input-username"
            placeholder="Enter username"
            v-model="form.username"
        />
      </div>
      <br>
      <div class="w-60">
        <label for="input-email">Email address</label>
        <UInput
            :ui="{rounded: 'rounded-lg'}"
            color="primary"
            variant="outline"
            size="l"
            type="email"
            id="input-email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            v-model="form.email"
        />
      </div>
      <br>
      <div class="w-60">
        <label for="input-password">Password</label>
        <UInput
            :ui="{rounded: 'rounded-lg'}"
            color="primary"
            variant="outline"
            size="l"
            type="password"
            class="form-control"
            id="input-password"
            placeholder="Password"
            v-model="form.password"
        />
      </div>

      <br>
      <div class="w-60">
        <label for="input-password-confirmation">Confirm password</label>
        <UInput
            :ui="{rounded: 'rounded-lg'}"
            color="primary"
            variant="outline"
            size="l"
            type="password"
            class="form-control"
            id="input-password-confirmation"
            placeholder="Confirm password"
            v-model="form.password_confirmation"
        />
      </div>
      <div class="text-center mt-[20px] w-full">
        <UButton
            size="xl"
            type="submit"
            label="Register"
        />
      </div>
      <UButton
          color="primary"
          variant="ghost"
          label="Already have an account?"
          to="/login"
      />
    </form>
  </main>
</template>