<script lang="ts" setup>
import { useWorkspacesStore } from '~/stores/useWorkspacesStore';
import { useBoardsStore } from '~/stores/useBoardsStore';
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

const isBoardDeleteModalOpen = ref(false);

const boardsStore = useBoardsStore();
const route = useRoute();

const board = ref(await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id));

// === UI ELEMENTS === //
const boardItems = [{
  slot: 'kanban',
  label: 'Kanban'
}, {
  slot: 'timeline',
  label: 'Timeline'
}, {
  slot: 'calendar',
  label: 'Calendar',
}]

async function handleDeleteBoard() {
  await boardsStore.deleteBoard(route.params.workspace_id, route.params.board_id);
  navigateTo('/workspaces/');
}

</script>

<template>
<!--  <main>-->
    <h1 class="text-2xl">Board No. {{ $route.params.board_id }} - '{{ board.data.title }}'</h1>

    <!-- Board deletion -->
    <UButton
        color="red"
        variant="outline"
        @click="isBoardDeleteModalOpen = true"
        label="Delete"
    />
    <UModal v-model="isBoardDeleteModalOpen">
      <div class="p-6">
        <p>Are you sure you want to delete this workspace?</p>
        <p>All data will be deleted permanently!</p>
        <div class="flex justify-center gap-8 p-2">
          <UButton
              color="primary"
              variant="outline"
              @click="isBoardDeleteModalOpen = false"
              label="Cancel"
          />
          <UButton
              color="red"
              variant="solid"
              @click="handleDeleteBoard()"
              label="Delete"
          />
        </div>
      </div>
    </UModal>

    <div class="w-full">
      <UTabs :items="boardItems">
        <template #kanban="{ item }">
          <Kanban></Kanban>
        </template>
        <template #timeline="{ item }">
          <Timeline></Timeline>
        </template>
        <template #calendar="{ item }">
          <Calendar></Calendar>
        </template>
      </UTabs>
    </div>
<!--  </main>-->
</template>
<style scoped>

</style>