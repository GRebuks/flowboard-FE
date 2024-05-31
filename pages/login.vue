<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { definePageMeta } from '#imports';
import {z} from "zod";

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

async function handleNewLogin(event: FormSubmitEvent<any>) {
  if (auth.isLoggedIn) {
    return navigateTo("/workspaces");
  }

  const {error} = await auth.login(event.data);

  if (error) {
    errors.value = error.value.data.errors;
  } else {
    return navigateTo("/workspaces");
  }
}

const schema = z.object({
  email: z.string().email('Invalid e-mail address'),
  password: z.string(),
});

const state = reactive({
  email: undefined,
  password: undefined,
});

</script>

<template>
  <main>
    <h3 class="text-center mt-[10px]">Login</h3>
    <UForm :schema="schema" :state="state" class="space-y-4 w-[20%] m-auto" @submit="handleNewLogin">
      <div v-if="errors" class="bg-red-300/70 dark:bg-red-950/50 border border-red-300 dark:border-red-700 w-full p-8 m-2 rounded-lg">
        <ul class="color-gray-200 text-center">
          <div v-for="error in errors" class="" role="alert">
            <div v-for="message in error">
              <li>{{ message }}</li>
            </div>
          </div>
        </ul>
      </div>
      <UFormGroup label="E-mail" name="email" eager-validation>
        <UInput v-model="state.email" placeholder="test@example.com" />
      </UFormGroup>
      <UFormGroup label="Password" name="password" eager-validation>
        <UInput v-model="state.password" placeholder="Password"  type="password"/>
      </UFormGroup>
      <div class="text-center mt-[20px] w-full">
        <UButton
            size="xl"
            type="submit"
            label="Login"
        />
      </div>
      <UButton
          color="primary"
          variant="ghost"
          label="Don't have an account?"
          to="/login"
          class="justify-center w-full"
      />
    </UForm>
  </main>
</template>

