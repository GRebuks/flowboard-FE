<script lang="ts" setup>
import { useBoardsStore } from '~/stores/useBoardsStore';
import { useWorkspacesStore} from "~/stores/useWorkspacesStore";
import { definePageMeta } from '#imports';
import {ref} from "vue";

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

const toast = useToast()

const isBoardDeleteModalOpen = ref(false);
const isUserRemoveModalOpen = ref(false);

const boardsStore = useBoardsStore();
const workspacesStore = useWorkspacesStore();
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

const searchAllExceptLoggedInAndWorkspaceParticipants = async (query: string) => {
  const response = await useApiFetch(`/api/workspaces/${route.params.workspace_id}/nonparticipants?${query}`);
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
    const users = await searchAllExceptLoggedInAndWorkspaceParticipants(queryParams.toString())
    //const users = await searchWorkspaceParticipants(queryParams.toString());
    //prefix: user.role.name
    return users.value.data.map(user => ({ id: user.id, label: user.username, suffix: user.email, icon: "i-heroicons-user-plus-16-solid"}))
  }
}]

const participantGroups = ref([]);

const openUserRemoveModal = async () => {
  isUserRemoveModalOpen.value = true;
  const participants = await searchWorkspaceParticipants('');
  participantGroups.value = participants.value.data.map((user: any) => ({ id: user.id, label: user.username, suffix: user.email, icon: "i-heroicons-user-plus-16-solid"}));
}

const onParticipantRemoveSelect = (option: any) => {
  workspacesStore.removeParticipant(route.params.workspace_id, option);
  toast.add({title: option.label + " has been removed", icon: "i-heroicons-check-badge", color:"primary"});
}

const onSelect = (option: any) => {
  workspacesStore.addParticipant(route.params.workspace_id, option);
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
  <div class="flex justify-between w-full px-10">
    <h1 class="text-2xl">Board No. {{ $route.params.board_id }} - '{{ board?.data.title }}'</h1>
    <div class="flex flex-wrap justify-evenly gap-10 p-5">
      <div class="flex flex-col items-center gap-3">
        <h2>Board</h2>
        <div class="flex gap-2">
          <UButton
              color="red"
              variant="outline"
              @click="isBoardDeleteModalOpen = true"
              label="Delete"
          />
        </div>
      </div>
      <UDivider orientation="vertical"></UDivider>
      <div class="flex flex-col items-center gap-3">
        <h2>Participants</h2>
        <div class="flex gap-2">
          <UButton @click="isUserAddModalOpen = true">Add</UButton>
          <UButton @click="openUserRemoveModal" color="red" variant="outline">Remove</UButton>
        </div>
      </div>
    </div>

  </div>

    <!-- Board deletion -->
    <UModal v-model="isBoardDeleteModalOpen">
      <div class="p-6">
        <p>Are you sure you want to delete this board?</p>
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
  <UModal v-model="isUserAddModalOpen" @click="closeModal">
    <div class="p-6" @click.stop>
      <p>Add a participant</p>
      <UCommandPalette :groups="groups" :autoselect="false" @update:model-value="onSelect" nullable />
    </div>
  </UModal>
  <UModal v-model="isUserRemoveModalOpen" @click="closeModal">
    <div class="p-6" @click.stop>
      <p>Remove a participant</p>
      <UCommandPalette :groups="[{ key: 'people', commands: participantGroups }]" :autoselect="false" @update:model-value="onParticipantRemoveSelect" nullable />
    </div>
  </UModal>
<!--  </main>-->
</template>
<style scoped>

</style>