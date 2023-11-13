<script lang="ts" setup>
import { useAuthStore } from "~/stores/useAuthStore";
import { useWorkspacesStore } from '~/stores/useWorkspacesStore';
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

const workspacesStore = useWorkspacesStore();

async function handleDeleteWorkspace(workspaceId) {
  const {error} = await workspacesStore.deleteWorkspace(workspaceId);
  if(!error.value) {
    navigateTo('/workspaces');
  }
  else {
    console.log(error.value);
  }
}

</script>

<template>
  <div>
    This page contains information about workspace No. {{ $route.params.id }}
    <button @click="handleDeleteWorkspace($route.params.id)">Delete</button>
  </div>
</template>

<style scoped></style>
