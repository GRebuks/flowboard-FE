<script lang="ts" setup>
import { ref } from 'vue';
import { useBoardsStore } from '~/stores/useBoardsStore';

const boardsStore = useBoardsStore();
const route = useRoute();

const board = ref(await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id));

const columnForm = ref({
  title: "",
  description: "",
});

const taskForm = ref({
  title: "",
  description: "",
});

const errors = ref();

const isColumnDeleteModalOpen = ref(false);
const isColumnAddModalOpen = ref(false);

const isTaskAddModalOpen = ref(false);
const isTaskEditModalOpen = ref(false);

let columnFocus: { id: any; };
let taskFocus: { id: any; };

// === UI ELEMENTS === //
const taskItems = [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
    click: () => {
      isTaskEditModalOpen.value = true;
    }
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid',
    shortcuts: ['D'],
    disabled: true
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    shortcuts: ['⌘', 'D'],
    click: () => {
      handleDeleteTask(columnFocus.id, taskFocus.id);
    }
  }]
]

const columnItems = [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
    click: () => {
      console.log('Edit')
    }
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid',
    shortcuts: ['D'],
    disabled: true
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    shortcuts: ['⌘', 'D'],
    click: () => {
      isColumnDeleteModalOpen.value = true
    }
  }]
]

const date = ref(new Date())
const dateLabel = computed(() => date.value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))

async function handleCreateColumn() {
  const {error} = await boardsStore.createColumn(route.params.workspace_id, route.params.board_id, columnForm.value);
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);

  if (error.value) {
    errors.value = error.value.data.errors;
  } else {
    isColumnAddModalOpen.value = false;
  }
}

async function handleDeleteColumn(columnId: any) {
  await boardsStore.deleteColumn(route.params.workspace_id, route.params.board_id, columnId);
  isColumnDeleteModalOpen.value = false;
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);
}

async function handleCreateTask(columnId: any) {
  const {error} = await boardsStore.createTask(route.params.workspace_id, route.params.board_id, columnId, taskForm.value);
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);

  if (error.value) {
    errors.value = error.value.data.errors;
  } else {
    isTaskAddModalOpen.value = false;
  }
}

async function handleDeleteTask(columnId: any, taskId: any) {
  await boardsStore.deleteTask(route.params.workspace_id, route.params.board_id, columnId, taskId);
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);
}

</script>

<template>
  <div class="flex gap-3 overflow-auto m-[1%] p-[1%]">
    <div v-if="board.data.columns.length > 0" v-for="column in board.data.columns">
      <div class="flex flex-col gap-3 group">
        <!-- COLUMN CARD -->
        <UCard class="w-[300px] cursor-pointer">
          <template #header>
            <div class="flex flex-row justify-between items-center">
              <p class="text-xl">{{ column.title }}</p>
              <UDropdown :items="columnItems" :popper="{ placement: 'right-start' }" >
                <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-ellipsis-horizontal-20-solid"
                    @click="columnFocus = column"
                />
              </UDropdown>
            </div>
          </template>

          <!-- TASK CARD -->
          <div v-if="column.tasks.length > 0" class="flex flex-col gap-3">
            <div v-for="task in column.tasks">
              <UCard class="w-[250px] cursor-pointer" :ui="{header: { background: 'bg-primary-700' }, body: { padding: 'sm:p-4' } }">
                <template #header></template>
                <div class="flex flex-row justify-between items-center">
                  <p class="text-lg">{{ task.title }}</p>
                  <UDropdown :items="taskItems" :popper="{ placement: 'right-start' }" >
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-bars-3-20-solid"
                        @click="columnFocus = column, taskFocus = task"
                    />
                  </UDropdown>
                </div>
                <UButton color="red" variant="outline" icon="i-heroicons-calendar-days-20-solid" :label="dateLabel" />
              </UCard>
            </div>
          </div>

          <!-- CREATE A NEW TASK -->
          <template #footer>
            <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-plus-solid"
                label="Add a task"
                @click="isTaskAddModalOpen = true, columnFocus = column"
                class="w-[250px]"
            />
          </template>
        </UCard>
      </div>
    </div>
    <div>
      <div
          class="flex flex-row justify-between items-center px-4 py-5 rounded-lg cursor-pointer ring-1 ring-gray-200 dark:ring-gray-700 w-[250px] h-[80px]"
          @click="isColumnAddModalOpen = true"
      >
        <p class="text-xl">Add column</p>
        <UIcon name="i-heroicons-plus-solid" size="2xl" />
      </div>
    </div>
    <!-- Column creation modal -->
    <UModal v-model="isColumnAddModalOpen">
      <div class="p-4">
        <form @submit.prevent="handleCreateColumn()">
          <h2>Add column...</h2>
          <div class="form-group">
            <label for="input-title">Title</label>
            <UInput
                color="primary"
                variant="outline"
                type="text"
                id="input-title"
                placeholder="Enter title"
                v-model="columnForm.title"
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
                v-model="columnForm.description"
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

    <!-- Column deletion modal -->
    <UModal v-model="isColumnDeleteModalOpen">
      <div class="p-4">
        <div class="p-6">
          <h2 class="text-2xl">Delete <span class="text-bold">{{ columnFocus.title }}</span> column</h2>
          <br>
          <p>Are you sure you want to delete this column?</p>
          <p>All tasks belonging to this column will be deleted permanently!</p>
          <div class="flex justify-center gap-8 p-2">
            <UButton
                color="primary"
                variant="outline"
                @click="isColumnDeleteModalOpen = false"
                label="Cancel"
            />
            <UButton
                color="red"
                variant="solid"
                @click="handleDeleteColumn(columnFocus.id)"
                label="Delete"
            />
          </div>
        </div>
      </div>
    </UModal>

    <!-- Task creation modal -->
    <UModal v-model="isTaskAddModalOpen">
      <div class="p-4">
        <form @submit.prevent="handleCreateTask(columnFocus.id)">
          <h2>Add task...</h2>
          <div class="form-group">
            <label for="input-title">Title</label>
            <UInput
                color="primary"
                variant="outline"
                type="text"
                id="input-title"
                placeholder="Enter title"
                v-model="taskForm.title"
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
                v-model="taskForm.description"
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

    <!-- Task editing modal -->
    <UModal v-model="isTaskEditModalOpen" :ui="{width: 'w-full sm:max-w-[80%]'}">
      <div class="p-4">
        <form @submit.prevent="handleCreateTask(columnFocus.id)">
          <h2 class="text-2xl">{{ taskFocus.title }}</h2>
          <div class="form-group">
            <label for="input-title">Title</label>
            <UInput
                color="primary"
                variant="outline"
                type="text"
                id="input-title"
                placeholder="Enter title"
                v-model="taskForm.title"
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
                v-model="taskForm.description"
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

<style scoped></style>
