<script lang="ts" setup>

import { useAuthStore } from "~/stores/useAuthStore";
import { useWorkspacesStore } from '~/stores/useWorkspacesStore';
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

const form = ref({
  title: "",
  description: "",
})

const workspacesStore = useWorkspacesStore();

if (!workspacesStore.workspaces) {
  await workspacesStore.fetchWorkspaces();
}

async function handleCreateWorkspace() {
  const {error} = await workspacesStore.createWorkspace(form.value);

  if (error.value) {
    errors.value = error.value.data.errors;
  }
}

</script>

<template>
  <main>
    <div>
      <h1>Your workspaces</h1>
      <div class="workspace-card-list">
        <WorkspaceCard v-if="workspacesStore.workspaces" v-for="workspace in workspacesStore.workspaces.data"
          :key="workspace.id"
          :workspace="workspace"
        />
        <WorkspaceCard/>
      </div>
    </div>

    
    <form @submit.prevent="handleCreateWorkspace">
      <!-- <div v-if="errors.length > 0">
        <div v-for="(error, index) in errors" :key="index" class="alert alert-danger" role="alert">
          {{ error }}
        </div>
      </div> -->
      <div class="form-group">
        <label for="input-title">Title</label>
        <input
            type="text"
            class="form-control"
            id="input-title"
            placeholder="Enter title"
            v-model="form.title"
        >
      </div>
      <div class="form-group mt-2">
        <label for="textarea-description">Description</label>
        <textarea
            type="text"
            class="form-control"
            id="textarea-description"
            placeholder="Enter description"
            v-model="form.description"
        />
      </div>
      <div class="button-group w-100 mt-3">
        <button type="submit" class="btn btn-primary">add +</button>
      </div>
    </form>


  </main>
</template>

<style scoped lang="scss">
  .workspace-card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2%;
    margin: 0 auto;
  }
</style>