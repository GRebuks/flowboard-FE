<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'auth',
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
    <h3>Register</h3>
    <form @submit.prevent="handleRegister">
      <div v-if="errors" class="error-container">
        <ul>
          <div v-for="error in errors" class="alert alert-danger" role="alert">
            <div v-for="message in error">
              <li>{{ message }}</li>
            </div>
          </div>
        </ul>
      </div>
      <div class="form-group form-group-auth">
        <label for="input-username">Username</label>
        <input
            type="text"
            class="form-control"
            id="input-username"
            placeholder="Enter username"
            v-model="form.username"
        >
      </div>
      <br>
      <div class="form-group form-group-auth">
        <label for="input-email">Email address</label>
        <input
            type="email"
            class="form-control"
            id="input-email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            v-model="form.email"
        >
      </div>
      <br>
      <div class="form-group form-group-auth">
        <label for="input-password">Password</label>
        <input
            type="password"
            class="form-control"
            id="input-password"
            placeholder="Password"
            v-model="form.password"
        >
      </div>

      <br>
      <div class="form-group form-group-auth">
        <label for="input-password-confirmation">Confirm password</label>
        <input
            type="password"
            class="form-control"
            id="input-password-confirmation"
            placeholder="Confirm password"
            v-model="form.password_confirmation"
        >
      </div>
      <div class="button-group w-100">
        <button type="submit" class="btn btn-primary btn-auth">Register</button>
      </div>
      <RouterLink to="/login" class="login-link">Already have an account?</RouterLink>
    </form>
  </main>
</template>

<style scoped lang="scss">

h3 {
  text-align: center;
  margin-top: 10px;
}

form {
  max-width: 350px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}

.button-group {
  text-align: center;
  margin-top: 20px;
}

.button-group > button {
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}
a:link, a:visited {
  color: #0C68DF !important;
  text-decoration: underline;
}
.login-link {
  text-align: center;
  display: block;
  margin-top: 3%;
}
</style>