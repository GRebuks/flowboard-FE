<script lang="ts" setup>
import { useAuthStore } from '~/stores/useAuthStore';
const auth = useAuthStore();

async function handleLogout() {
  await auth.logout();
}

</script>

<template>
    <div class="info-bar">
        <h2>Dashboard</h2>
        <nuxt-link v-if="auth.isLoggedIn" @click="handleLogout">Logout</nuxt-link>
    </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/base';
$info-bar-height: 5vh;
.info-bar {
    display: flex;
    justify-content: space-between;
    background-color: var(--bg-color-dark);
    height: $info-bar-height;
    line-height: $info-bar-height;
    padding: 0 2%;

    h2 {
        font-weight: 400;
    }
}
</style>