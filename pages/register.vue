<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { definePageMeta } from '#imports';
import {z} from "zod";

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

async function handleNewRegister(event: FormSubmitEvent<any>) {
  const {error} = await auth.register(event.data);

  if (!error.value) {
    return navigateTo("/");
  } else {
    errors.value = error.value.data.errors;
  }
}

// Eager validation
const schema = z.object({
  username: z.string().min(5, 'Must be at least 5 characters'),
  email: z.string().email('Invalid e-mail address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((v) => v.password === v.password_confirmation, {
  message: 'Passwords must match',
  path: ['password_confirmation']
});

const state = reactive({
  username: undefined,
  email: undefined,
  password: undefined,
  password_confirmation: undefined,
});

</script>

<template>
  <main>
    <h3 class="text-center mt-[10px]">Register</h3>

    <UForm :schema="schema" :state="state" class="space-y-4 w-[20%] m-auto" @submit="handleNewRegister">
      <UFormGroup label="Username" name="username" eager-validation>
        <UInput v-model="state.username" placeholder="Username" />
      </UFormGroup>
      <UFormGroup label="E-mail" name="email" eager-validation>
        <UInput v-model="state.email" placeholder="test@example.com" />
      </UFormGroup>
      <UFormGroup label="Password" name="password" eager-validation>
        <UInput v-model="state.password" placeholder="Password"  type="password"/>
      </UFormGroup>
      <UFormGroup label="Confirm password" name="password_confirmation" eager-validation>
        <UInput v-model="state.password_confirmation" placeholder="Confirm password" type="password"/>
      </UFormGroup>
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
    </UForm>
  </main>
</template>