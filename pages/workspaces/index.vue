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
      <h1>Your workspaces</h1>
      <div class="flex flex-wrap justify-center gap-[2%] my-auto">
        <WorkspaceCard v-if="workspacesStore.workspaces" v-for="workspace in workspacesStore.workspaces.data"
          :key="workspace.id"
          :workspace="workspace"
        />
        <WorkspaceCard/>
      </div>
    </div>
  </main>
</template>
