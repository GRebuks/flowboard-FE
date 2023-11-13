<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'auth',
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
    <h3>Login</h3>
    <form @submit.prevent="handleLogin">

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
      <div class="button-group">
        <button type="submit" class="btn btn-auth">Login</button>
      </div>
      <RouterLink to="/register" class="register-link">Don't have an account?</RouterLink>
    </form>
  </main>
</template>

<style scoped lang="scss">
@use '~/assets/scss/base';

h3 {
  text-align: center;
  margin-top: 10px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}

.button-group {
  text-align: center;
  margin-top: 20px;
  width: 100%;
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
.register-link {
  text-align: center;
  display: block;
  margin-top: 3%;
}

</style>
