<script lang="ts" setup>

import { useWorkspacesStore } from '~/stores/useWorkspacesStore';
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

const workspacesStore = useWorkspacesStore();

if (!workspacesStore.workspaces) {
  await workspacesStore.fetchWorkspaces();
}
</script>

<template>
  <main>
    <div>
      <h1 class="text-2xl text-center">Your workspaces</h1>
      <div class="flex flex-wrap justify-center gap-[2%] my-auto">
      </div>
    </div>
  </main>
</template>
