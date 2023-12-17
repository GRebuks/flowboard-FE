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
  color: ""
});

const workspaceForm = ref({
  title: "",
  description: "",
});

const errors = ref();

const isDeleteModalOpen = ref(false);
const isBoardAddModalOpen = ref(false);
const isCreateWorkspaceModalOpen = ref(false);
const isBoardEditModalOpen = ref(false);
const isWorkspaceEditModalOpen = ref(false);
const isDeleteBoardModalOpen = ref(false);

const workspacesStore = useWorkspacesStore();
const boardsStore = useBoardsStore();

let workspaceFocus: { id: any; };
let boardFocus: { id: any; };

const currentBoards = ref();
const items = ref([]);

async function reloadWorkspaces() {
  currentBoards.value = {};
  items.value = [];
  await workspacesStore.fetchWorkspaces();
  if (workspacesStore.workspaces) {
    for(let i = 0; i < workspacesStore.workspaces.data.length; i++) {
      let boards = await boardsStore.fetchBoards(workspacesStore.workspaces.data[i].id);
      currentBoards.value[workspacesStore.workspaces.data[i].id] = boards.data;

      const item = {
        label: workspacesStore.workspaces.data[i].title,
        icon: 'i-heroicons-rectangle-group',
        defaultOpen: true,
        description: workspacesStore.workspaces.data[i].description,
        id: workspacesStore.workspaces.data[i].id,
      }
      items.value.push(item);
    }
  }
}

onMounted(await reloadWorkspaces);

async function handleDeleteWorkspace(workspaceId: any) {
  await workspacesStore.deleteWorkspace(workspaceId);
  isDeleteModalOpen.value = false;
  reloadWorkspaces();
}

async function handleCreateBoard(workspaceId: any) {
  const {error} = await boardsStore.createBoard(workspaceId, boardForm.value);

  if (error.value) {
    errors.value = error.value.data.errors;
  } else {
    isBoardAddModalOpen.value = false;
    await reloadWorkspaceBoards(workspaceId);
  }
}

async function reloadWorkspaceBoards(workspaceId: any) {
  let boards = await boardsStore.fetchBoards(workspaceId);
  currentBoards.value[workspaceId] = boards.data;
}

async function handleCreateWorkspace() {
  const {error} = await workspacesStore.createWorkspace(workspaceForm.value);

  if (error.value) {
    errors.value = error.value.data.errors;
  } else {
    isCreateWorkspaceModalOpen.value = false;
    await reloadWorkspaces();
  }
}

async function handleDeleteBoard(workspaceId: any, boardId: any) {
  await boardsStore.deleteBoard(workspaceId, boardId);
  isDeleteBoardModalOpen.value = false;
  await reloadWorkspaces();
}

function textColorCalc(h: any) {
  return (hexToR(h)*0.299 + hexToG(h)*0.587 + hexToB(h)*0.114) > 186 ? "bg-gray-200" : "bg-gray-700";
}

var cutHex= function(h: any) {
  return (h.charAt(0) == "#") ? h.substring(1, 7) : h
};
var hexToR= function(h: any) {
  return parseInt((cutHex(h)).substring(0, 2),16)
};
var hexToG= function(h: any) {
  return parseInt((cutHex(h)).substring(2, 4),16)
};
var hexToB= function(h: any) {
  return parseInt((cutHex(h)).substring(4, 6),16)
};

function updateColor(color: any) {
  boardForm.value.color = color;
}

const colorList = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-gray-800'];

</script>

<template>
  <main>
    <div>
      <h1 class="text-2xl text-center">Your workspaces</h1>

      <div>
        <UAccordion
          :items="items"
          multiple
          :ui="{
            item:{
              padding:'pb-10',
              color: 'text-gray-700 dark:text-gray-300'
            }
          }"
          class="mt-4"
        >
          <template #item="{ item }">
            <div class="px-2">
              <h2 class="text-xl">Description:</h2>
              <p>{{ item.description }}</p>
              <br>
              <h2 class="text-xl">Boards:</h2>
              <div class="flex gap-3">
                <div v-for="board in currentBoards[item.id]">
                  <UCard
                      :ui="{
                        body:{
                          background: board.color,
                        }

                      }"
                      class="w-[200px] text-gray-700 dark:text-gray-200 group"
                      @click="boardFocus=board.id"
                  >
                    <div class="flex justify-between items-center">
                      <p class="text-xl cursor-pointer" @click="navigateTo(`/workspaces/${ item.id }/boards/${board.id}`)">{{ board.title }}</p>
                      <div class="gap-3 items-center hidden group-hover:flex">
                        <UButton
                            color="red"
                            variant="solid"
                            size="xs"
                            @click="isDeleteBoardModalOpen = true, boardFocus=board.id, workspaceFocus=item.id"
                            square
                            icon="i-heroicons-trash"
                        />
                        <UButton
                            color="primary"
                            variant="solid"
                            size="xs"
                            @click="isBoardEditModalOpen = true, boardFocus=board.id"
                            square
                            icon="i-heroicons-pencil-square"
                        />
                      </div>
                    </div>
                  </UCard>
                </div>
                <UCard
                    class="w-[200px] cursor-pointer"
                    @click="workspaceFocus=item.id, console.log(workspaceFocus), isBoardAddModalOpen = true"
                >
                  <div class="flex items-center gap-3 text-primary">
                    <p>Create new board</p>
                    <UIcon name="i-heroicons-plus"/>
                  </div>
                </UCard>
              </div>
              <div class="flex gap-3" @click="workspaceFocus=item.id, console.log(workspaceFocus)">
                <UButton
                    color="red"
                    variant="outline"
                    size="lg"
                    @click="isDeleteModalOpen = true"
                    label="Delete"
                    class="mt-3"
                />
                <UButton
                    color="primary"
                    variant="outline"
                    size="lg"
                    @click="isWorkspaceEditModalOpen = true"
                    label="Edit"
                    class="mt-3"
                />
              </div>
            </div>


          </template>
        </UAccordion>
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
                  @click="handleDeleteWorkspace(workspaceFocus)"
                  label="Delete"
              />
            </div>
          </div>
        </UModal>
        <UModal v-model="isBoardAddModalOpen">
          <div class="p-4">
            <form @submit.prevent="handleCreateBoard(workspaceFocus)">
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
              <p class="text-center" id="color-output">Display color</p>
              <div class="grid grid-cols-2 md:grid-cols-5 w-[100px] gap-1 m-auto">
                <div v-for="(color, index) in colorList" :key="index"
                     :class="[color, 'h-4 w-4 rounded-full cursor-pointer']"
                     @click="updateColor(color)"></div>
              </div>
              <p>Selected Color:</p> <div :class="[boardForm.color, 'text-white px-2 py-1 rounded w-full h-[12px]']"></div>
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
        <UModal v-model="isDeleteBoardModalOpen">
          <div class="p-6">
            <p>Are you sure you want to delete this workspace?</p>
            <p>All data will be deleted permanently!</p>
            <div class="flex justify-center gap-8 p-2">
              <UButton
                  color="primary"
                  variant="outline"
                  @click="isDeleteBoardModalOpen = false"
                  label="Cancel"
              />
              <UButton
                  color="red"
                  variant="solid"
                  @click="handleDeleteBoard(workspaceFocus, boardFocus)"
                  label="Delete"
              />
            </div>
          </div>
        </UModal>
      </div>
      <div class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 text-primary-500 dark:text-primary-400 bg-primary-50 hover:bg-primary-100 disabled:bg-primary-50 dark:bg-primary-950 dark:hover:bg-primary-900 dark:disabled:bg-primary-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center mb-1.5 w-full cursor-pointer" @click="isCreateWorkspaceModalOpen = true">
        <span class="i-heroicons-rectangle-group flex-shrink-0 h-5 w-5" aria-hidden="true"></span>
        <span class="">Create a new workspace</span>
        <span class="i-heroicons-plus h-5 w-5 ms-auto"></span>
      </div>

      <UModal v-model="isCreateWorkspaceModalOpen">
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
                  v-model="workspaceForm.title"
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
                  v-model="workspaceForm.description"
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
  </main>
</template>
