<script lang="ts" setup>
import { useWorkspacesStore } from '~/stores/useWorkspacesStore';
import { useBoardsStore } from '~/stores/useBoardsStore';
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

const boardForm = ref({
  title: "",
  description: "",
});

const errors = ref();

const isDeleteModalOpen = ref(false);
const isBoardAddModalOpen = ref(false);

const workspacesStore = useWorkspacesStore();
const boardsStore = useBoardsStore();
const route = useRoute();

await boardsStore.fetchBoards(route.params.workspace_id);

async function handleDeleteWorkspace(workspaceId: any) {
  await workspacesStore.deleteWorkspace(workspaceId);
  navigateTo('/workspaces');
}

async function handleCreateBoard(workspaceId: any) {
  const {error} = await boardsStore.createBoard(workspaceId, boardForm.value);

  if (error.value) {
    errors.value = error.value.data.errors;
  } else {
    isBoardAddModalOpen.value = false;
  }
}

</script>

<template>
  <main>
    <div class="w-full">
      <p>This page contains information about workspace No. {{ $route.params.workspace_id }}</p>
      <UButton
          color="red"
          variant="outline"
          @click="isDeleteModalOpen = true"
          label="Delete"
      />
      <UModal v-model="isDeleteModalOpen">
        <div class="p-6">
          <p>Are you sure you want to delete this workspace?</p>
          <p>All data will be deleted permanently!</p>
          <div class="flex justify-center gap-8 p-2">
            <UButton
                color="primary"
                variant="outline"
                @click="isDeleteModalOpen = false"
                label="Cancel"
            />
            <UButton
                color="red"
                variant="solid"
                @click="handleDeleteWorkspace($route.params.workspace_id)"
                label="Delete"
            />
          </div>
        </div>
      </UModal>
      <div>
        <h1 class="text-2xl">Board list:</h1>
        <div class="flex flex-wrap justify-evenly" v-if="boardsStore.boards" v-for="board in boardsStore.boards.data">
          <UCard class="m-2 cursor-pointer" @click="navigateTo(`/workspaces/${ route.params.workspace_id }/boards/${ board.id }`)">
            <div class="flex gap-4">
              <h2 class="text-2xl">{{ board.title }}</h2>
              <div class="flex gap-2">
                <UButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    icon="i-heroicons-pencil-square"
                />
                <UButton
                    color="red"
                    variant="outline"
                    square
                    size="sm"
                    icon="i-heroicons-trash"
                />
              </div>
            </div>
          </UCard>
        </div>
        <UCard class="m-2 cursor-pointer" @click="isBoardAddModalOpen = true">
          <div class="flex gap-4">
            <h2 class="text-2xl">Add board</h2>
          </div>
        </UCard>
        <!-- Board creation modal -->
        <UModal v-model="isBoardAddModalOpen">
          <div class="p-4">
            <form @submit.prevent="handleCreateBoard($route.params.workspace_id)">
              <div class="form-group">
                <label for="input-title">Title</label>
                <UInput
                    color="primary"
                    variant="outline"
                    type="text"
                    id="input-title"
                    placeholder="Enter title"
                    v-model="boardForm.title"
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
                    v-model="boardForm.description"
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
    </div>
  </main>
</template>