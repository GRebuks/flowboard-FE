<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
});

const form = ref({
  email: 'test@example.com',
  password: 'password',
});

const errors = ref();

const auth = useAuthStore();

async function handleLogin() {
  if (auth.isLoggedIn) {
    return navigateTo("/workspaces");
  }

  const {error} = await auth.login(form.value);
  
  if (!error.value) {
    return navigateTo("/workspaces");
  } else {
    errors.value = error.value.data.errors;
  }
}

</script>

<template>
  <main>
    <h3 class="text-center mt-[10px]">Login</h3>
    <form @submit.prevent="handleLogin" class="flex flex-col items-center max-w-[350px] w-full ml-auto mr-auto mt-[20px]">

      <div v-if="errors" class="bg-red-400/50 dark:bg-red-950/50 border border-red-700 dark:border-red-700 w-full p-8 m-2 rounded-lg">
        <ul class="list-disc">
          <div v-for="error in errors" class="" role="alert">
            <div v-for="message in error">
              <li>{{ message }}</li>
            </div>
          </div>
        </ul>
      </div>

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
            id="input-password"
            placeholder="Password"
            v-model="form.password"
        />
      </div>
      <div class="text-center mt-[20px] w-full">
        <UButton
          size="xl"
          type="submit"
        >Login</UButton>
      </div>
      <UButton
          color="primary"
          variant="ghost"
          label="Don't have an account?"
          to="/register"
      />
    </form>
  </main>
</template>

