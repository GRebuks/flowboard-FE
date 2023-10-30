<script lang="ts" setup>
import { useAuthStore } from '~/stores/useAuthStore';
const auth = useAuthStore();

async function handleLogout() {
  await auth.logout();
}

</script>

<template>
    <header>
        <nuxt-link to="/" class="title">PMS</nuxt-link>
        <div class="navbar">

            <ul class="nav-btns">
                <li>
                    <nuxt-link to="/auth-only">Auth-protected</nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/guest-only">Guest-protected</nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/dashboard">Dashboard</nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/projects">Projects</nuxt-link>
                </li>
            </ul>

            <ul class="auth-btns">
                <li v-if="!auth.isLoggedIn" class="register-btn">
                    <nuxt-link to="/register">Register</nuxt-link>
                </li>
                <li v-if="!auth.isLoggedIn" class="login-btn">
                    <nuxt-link to="/login">Log in</nuxt-link>
                </li>
                <li v-if="auth.isLoggedIn">
                    <nuxt-link @click="handleLogout">Logout</nuxt-link>
                </li>
            </ul>

        </div>
    </header>
</template>

<style scoped lang="scss">
@use '~/assets/scss/base';

$header-height: 8vh;

header {
  display: flex;
  width: 100%;
  height: $header-height;
}

.title {
  width: 10%;

  line-height: $header-height;
  height: $header-height;

  background-color: var(--color-accent-black-dark);
  color: var(--color-accent-white);

  text-align: center;
  font-size: 30px;
  font-weight: 600;
  text-decoration: none;
}

.navbar {
  display: flex;
  width: 100%;

  line-height: $header-height;
  height: $header-height;

  font-size: 18px;
  background-color: var(--color-accent-black);

    ul {
        list-style: none;
        display: flex;
        padding: 0;

        li {
            padding: 0 3%;
            background-color: var(--color-accent-black);

            &:hover {
                background-color: var(--color-accent-black-light);
            }

            a {
                color: var(--color-accent-white);
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
}

.nav-btns {
    width: 75%;
}

.auth-btns {
    margin-left: auto;
    width: 25%;
    justify-content: flex-end;
    gap: 8%;

    height: calc($header-height / 2);
    line-height: calc($header-height / 2);
    margin: calc($header-height / 4) 0;

    &::after {
        content: "";
    }

    li {
        background-color: var(--color-accent-orange) !important;
        width: 25%;
        text-align: center;
    }

    .register-btn {
        background-color: rgba($color: #FFF, $alpha: 0) !important;
        border: 1px solid var(--color-accent-blue);
    }
}


</style>