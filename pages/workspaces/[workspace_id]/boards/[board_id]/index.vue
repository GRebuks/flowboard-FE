<script lang="ts" setup>
import { useBoardsStore } from '~/stores/useBoardsStore';
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

const toast = useToast()

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

const searchAllExceptLoggedIn = async (query: string) => {
  const response = await useApiFetch(`/api/users/search?${query}`);
  return response.data;
};

const searchWorkspaceParticipants = async (query: string) => {
  const workspaceId = route.params.workspace_id;
  const response = await useApiFetch(`/api/workspaces/${workspaceId}/participants?${query}`);
  return response.data;
};

const searchWorkspaceParticipantsExcludingLoggedIn = async (query: string) => {
  const workspaceId = route.params.workspace_id;
  const response = await useApiFetch(`/api/workspaces/${workspaceId}/search-excluding-logged-in?${query}`);
  return response.data;
};

const groups = [{
  key: 'users',
  label: (q: string) => q && `Users matching “${q}”...`,
  search: async (q: string) => {
    if (!q) {
      return []
    }
    const queryParams = new URLSearchParams({ q });
    const users = await searchAllExceptLoggedIn(queryParams.toString())
    //const users = await searchWorkspaceParticipants(queryParams.toString());
    //prefix: user.role.name
    return users.value.data.map(user => ({ id: user.id, label: user.username, suffix: user.email, icon: "i-heroicons-user-plus-16-solid"}))
  }
}]

const onSelect = (option: any) => {
  console.log(option)
  toast.add({title: option.label + " has been added", icon: "i-heroicons-check-badge", color:"primary"});
}

const isUserAddModalOpen = ref(false);

const closeModal = (event) => {
  event.stopPropagation();
  isModalOpen.value = false;
};

</script>

<template>
<!--  <main>-->
  <div>
    <h1 class="text-2xl">Board No. {{ $route.params.board_id }} - '{{ board?.data.title }}'</h1>

  </div>

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
  <UButton @click="isUserAddModalOpen = true"></UButton>
  <UModal v-model="isUserAddModalOpen" @click="closeModal">
    <div class="p-6" @click.stop>
      <p>Add a new user</p>
      <UCommandPalette :groups="groups" :autoselect="false" @update:model-value="onSelect" />
    </div>
  </UModal>
<!--  </main>-->
</template>
<style scoped>

</style>