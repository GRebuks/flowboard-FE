<script setup lang="ts">
  import { useAuthStore } from '~/stores/useAuthStore';
  const auth = useAuthStore();
</script>

<template>
    <main class="flex justify-between max-w-[1440px]">
      <div class="flex w-full items-center justify-between">
        <div class="flex flex-col gap-[20px]">
          <h1 class="leading-10">
            <span class="font-bold text-7xl">Welcome to <span class="text-transparent bg-gradient-to-r from-primary to-primary-600 bg-clip-text">Flowboard</span></span>
            <br>
            <span class="font-light text-4xl pl-[5px]">Your Ultimate Project Management Companion</span>
          </h1>
          <div class="flex gap-[10px]" v-if="!auth.isLoggedIn">
            <RouterLink to="/login" class="py-[10px] px-[60px] rounded-[14px] font-medium text-2xl flex items-center text-center transition-[0.3s] text-white dark:text-black bg-primary hover:scale-[1.04]">Login</RouterLink>
            <RouterLink to="/about" class="py-[10px] px-[50px] rounded-[14px] font-medium text-2xl flex items-center text-center transition-[0.3s] border-4 border-primary bg-transparent hover:scale-[1.04]">About us</RouterLink>
          </div>
          <div class="flex" v-else>
            <RouterLink to="/workspaces" class="py-[10px] px-[60px] rounded-[14px] font-medium text-2xl flex items-center text-center transition-[0.3s] text-white dark:text-black bg-primary hover:scale-[1.04]">
              Workspaces
            </RouterLink>
          </div>
        </div>
        <img src="@/assets/images/landing_page.svg" class="select-none w-[600px]" alt="illustrative image">
      </div>
    </main>
</template>

<style scoped>
  main {
    height: calc(100vh - 60px);
  }
</style>