<script lang="ts" setup>
  import { useWorkspacesStore } from '~/stores/useWorkspacesStore';

  defineProps(['workspace']);
  const isOpen = ref(false);
  const errors = ref();

  const form = ref({
    title: "",
    description: "",
  });

  const workspacesStore = useWorkspacesStore();

  async function handleCreateWorkspace() {
    const {error} = await workspacesStore.createWorkspace(form.value);

    if (error.value) {
      errors.value = error.value.data.errors;
    } else {
      isOpen.value = false;
    }
  }
</script>

<template>
  <div class="flex flex-col h-[300px] w-[360px] rounded-[10px] overflow-hidden bg-transparent mx-[1%] transition-[1s] shadow shadow-primary border border-primary hover:opacity-90 hover:cursor-pointer hover:scale-[1.02] hover:transition-[0.3s] my-5" @click="navigateTo(`/workspaces/${ workspace.id }`)">

    <div v-if="workspace" class="h-[130px]">
      <!-- <img src="~/assets/images/workspace.png"/> -->
      <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
        <rect x="120" y="60" width="50" height="50" fill="rgba(0,0,0,0)" class="stroke-primary" stroke-width="3" filter="url(#f1)"></rect>
        <polygon points="180,20 220,100 140,100" fill="rgba(0,0,0,0)" class="stroke-primary" stroke-width="3"/>
        <circle r="35" cx="220" cy="55" fill="rgba(0,0,0,0)" class="stroke-primary" stroke-width="3"/>
      </svg>
    </div>

    <div v-else class="h-[130px]">
      <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="160" y1="65" x2="210" y2="65" class="stroke-primary" stroke-width="10"/>
        <line x1="185" y1="40" x2="185" y2="90" class="stroke-primary" stroke-width="10"/>
      </svg>
    </div>

    <div v-if="workspace" class="h-full p-[5%] bg-gray-200 dark:bg-gray-900">
      <h1>{{ workspace.title }}</h1>
      <p>{{ workspace.description }}</p>
    </div>
    <div v-else class="h-full p-[5%] bg-gray-200 dark:bg-gray-900" @click="isOpen = true">
      <h1 class="m-0">Create a workspace</h1>
      <p>Create your new workspace here.</p>
    </div>
    <UModal v-model="isOpen">
      <div class="p-4">
        <form @submit.prevent="handleCreateWorkspace">
          <div class="form-group">
            <label for="input-title">Title</label>
            <UInput
                color="primary"
                variant="outline"
                type="text"
                id="input-title"
                placeholder="Enter title"
                v-model="form.title"
            />
          </div>
          <div class="form-group mt-2">
            <label for="textarea-description">Description</label>
            <UTextarea
                color="primary"
                variant="outline"
                type="text"
                id="textarea-description"
                placeholder="Enter description"
                v-model="form.description"
            />
          </div>
          <div class="button-group w-100 mt-3">
            <UButton
                color="primary"
                variant="solid"
                type="submit"
                label="Add"
            />
          </div>
        </form>
      </div>
    </UModal>
  </div>
</template>
