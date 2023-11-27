<script lang="ts" setup>
import { useWorkspacesStore } from '~/stores/useWorkspacesStore';
import { useBoardsStore } from '~/stores/useBoardsStore';
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

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
  <div class="page-wrapper">
    <div class="board-list">
      <h1 class="bg-mariner-700">Boards list:</h1>
      <BoardList v-for="board in boardsStore.boards.data"
        :board="board"
      />
    </div>
    <div class="page-content">
      <p>This page contains information about workspace No. {{ $route.params.id }}</p>
      <button @click="handleDeleteWorkspace($route.params.id)">Delete</button>
      <TaskBoard></TaskBoard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-wrapper {
  display: flex;
  flex-direction: row;
}
.board-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: var(--color-background-highlight);
  height: 100%;
  width: 20%;
}
</style>
