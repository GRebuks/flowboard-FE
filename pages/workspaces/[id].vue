<script lang="ts" setup>
import { useWorkspacesStore } from '~/stores/useWorkspacesStore';
import { useBoardsStore } from '~/stores/useBoardsStore';
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

const isDeleteModalOpen = ref(false);

const workspacesStore = useWorkspacesStore();
const boardsStore = useBoardsStore();
const route = useRoute();
if (!boardsStore.boards) {
  await boardsStore.fetchBoards(route.params.id);
}

async function handleDeleteWorkspace(workspaceId: any) {
  await workspacesStore.deleteWorkspace(workspaceId);
  navigateTo('/workspaces');
}

</script>

<template>
  <div class="flex w-full">
    <div class="flex flex-col gap-2 h-full w-[20%] bg-gray-100 dark:bg-gray-900">
      <h1>Boards list:</h1>
      <BoardList v-for="board in boardsStore.boards.data"
        :board="board"
      />
    </div>
    <div class="w-full">
      <p>This page contains information about workspace No. {{ $route.params.id }}</p>
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
                @click="handleDeleteWorkspace($route.params.id)"
                label="Delete"
            />
          </div>
        </div>
      </UModal>
      <TaskBoard></TaskBoard>
    </div>
  </div>
</template>