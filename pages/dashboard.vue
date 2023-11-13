<script lang="ts" setup>
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})
</script>

<template>
  <div>
    Page: dashboard
    <NuxtPage />
  </div>
</template>

<style scoped></style>
