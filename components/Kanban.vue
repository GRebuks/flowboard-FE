<script lang="ts" setup>
import {ref} from 'vue';
import {useBoardsStore} from '~/stores/useBoardsStore';
import {Container, Draggable} from 'vue3-smooth-dnd';
import type {BoardData, DropResult} from "~/types";

const boardsStore = useBoardsStore();
const route = useRoute();

const board = ref<BoardData | null>(null);
board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);

console.log(board.value);
const columnForm = ref({
  title: "",
  description: "",
});

const taskForm = ref({
  title: "",
  description: "",
});

const commentForm = ref({
  content: "",
});

const errors = ref();

const isColumnDeleteModalOpen = ref(false);
const isColumnAddModalOpen = ref(false);

const isTaskAddModalOpen = ref(false);
const isTaskEditModalOpen = ref(false);

const columnFocus = ref();
const taskFocus = ref();
const commentFocus = ref();

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
      handleDeleteTask(columnFocus.value.id, taskFocus.value.id);
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

const commentItems = [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
    click: () => {
      console.log('Edit')
    }
  }],

  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    shortcuts: ['⌘', 'D'],
    click: () => {
      handleDeleteComment(columnFocus.value.id, taskFocus.value.id, commentFocus.value.id);
    }
  }]
]

function calculateDueDateColor(task: any): string {
  const currentDate = new Date();
  const dueDate = new Date(task.due_date);
  const timeDifference: number = dueDate.getTime() - currentDate.getTime();

  if (task.completed) {
    return 'green';
  } else if (timeDifference <= 0) {
    return 'red';
  } else if (timeDifference < 24 * 60 * 60 * 1000) {
    return 'yellow';
  } else {
    return 'primary';
  }
}

function formatDate(dateString: any) {
  return new Date(dateString).toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
}

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

async function handleUpdateTask(columnId: any, taskId: any) {
  let title = document.getElementById('task-editable-title');
  let description = document.getElementById('task-editable-description');

  let titleText = "";
  let descriptionText = "";

  if (title) titleText = title.innerText;
  if (description) descriptionText = description.innerText;

  if (titleText === taskFocus.value.title && descriptionText === taskFocus.value.description) return;

  const {error} = await boardsStore.updateTask(route.params.workspace_id, route.params.board_id, columnId, taskId, {
    title: titleText,
    description: taskFocus.value.description
  });
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);

  if (error.value) {
    errors.value = error.value.data.errors;
  }

  updateFocusedElements(columnId, taskId);
}

async function updateTask(columnId: any, task: any) {
  const {error} = await boardsStore.updateTask(route.params.workspace_id, route.params.board_id, columnId, task.id, task);
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);

  if (error.value) {
    errors.value = error.value.data.errors;
  }
}

async function handleDeleteTask(columnId: any, taskId: any) {
  await boardsStore.deleteTask(route.params.workspace_id, route.params.board_id, columnId, taskId);
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);
}

// COMMENTS
async function handleCreateComment(columnId: any, taskId: any) {
  const {error} = await boardsStore.createComment(route.params.workspace_id, route.params.board_id, columnId, taskId, commentForm.value);
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);

  if (error.value) {
    errors.value = error.value.data.errors;
  }

  updateFocusedElements(columnId, taskId);
}

async function handleDeleteComment(columnId: any, taskId: any, commentId: any) {
  await boardsStore.deleteComment(route.params.workspace_id, route.params.board_id, columnId, taskId, commentId);
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);

  updateFocusedElements(columnId, taskId);
}

function updateFocusedElements(columnId: any, taskId: any) {
  const currentColumn = board.value?.data.columns.find(column => column.id === columnId);
  if (currentColumn) {
    taskFocus.value = currentColumn.tasks?.find(task => task.id === taskId);
  }
}

async function handleColumnDrop(dropResult: any) {
  if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
    // Item was dragged within the same container
    if (dropResult.removedIndex !== dropResult.addedIndex) {
      const columns = board.value?.data.columns;
      if (columns) {
        const movedColumn = columns[dropResult.removedIndex];
        movedColumn.order = dropResult.addedIndex + 1;

        if (dropResult.addedIndex > dropResult.removedIndex) {
          // Items that were shifted to the right
          for (let i = dropResult.removedIndex + 1; i <= dropResult.addedIndex; i++) {
            columns[i].order -= 1;
          }
        } else if (dropResult.addedIndex < dropResult.removedIndex) {
          // Items that were shifted to the left
          for (let i = dropResult.addedIndex; i < dropResult.removedIndex; i++) {
            columns[i].order += 1;
          }
        }


        columns.splice(dropResult.removedIndex, 1); // Remove from the old position
        columns.splice(dropResult.addedIndex, 0, movedColumn); // Insert at the new position

        if (board.value) {
          board.value.data.columns = columns;
        }

        await boardsStore.saveBoard(route.params.workspace_id, route.params.board_id, board);
      }
    }
  }
}

async function handleTaskDrop(columnActive: any, dropResult: DropResult) {
  if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
    // Item was dragged within the same container
    if (dropResult.removedIndex !== dropResult.addedIndex) {
      const tasks = columnActive.tasks;
      console.log(columnActive);
      const movedTask = tasks[dropResult.removedIndex];
      movedTask.order = dropResult.addedIndex + 1;

      if (dropResult.addedIndex > dropResult.removedIndex) {
        // Items that were shifted to the right
        for (let i = dropResult.removedIndex + 1; i <= dropResult.addedIndex; i++) {
          tasks[i].order -= 1;
        }
      } else if (dropResult.addedIndex < dropResult.removedIndex) {
        // Items that were shifted to the left
        for (let i = dropResult.addedIndex; i < dropResult.removedIndex; i++) {
          tasks[i].order += 1;
        }
      }

      tasks.splice(dropResult.removedIndex, 1); // Remove from the old position
      tasks.splice(dropResult.addedIndex, 0, movedTask); // Insert at the new position

      const boardColumnActive = board.value?.data.columns.find(column => column.id === columnActive.id);
      if (boardColumnActive) {
        boardColumnActive.tasks = tasks;
      }

      await boardsStore.saveBoard(route.params.workspace_id, route.params.board_id, board);
    }
  } else if (dropResult.addedIndex !== null) {
    // Task is moved from one column to another

    const oldIndex = columnFocus.value.tasks.indexOf(taskFocus.value);

    // Subtract order by 1 on all elements after the removed task
    for (let i = oldIndex; i < columnFocus.value.tasks.length; i++) {
      columnFocus.value.tasks[i].order -= 1;
    }

    // Remove old task from column
    columnFocus.value.tasks.splice(oldIndex, 1);

    // Add the old task into the new column
    columnActive.tasks.splice(dropResult.addedIndex, 0, taskFocus.value);

    // Set the order number of the new task inside the new column to the addedIndex value
    columnActive.tasks[dropResult.addedIndex].order = dropResult.addedIndex + 1;

    // Raise order by 1 on all elements after the inserted task
    for (let i = dropResult.addedIndex + 1; i < columnActive.tasks.length; i++) {
      columnActive.tasks[i].order += 1;
    }

    // Change the BelongsTo relation of the task to the new column id
    await boardsStore.reorderTask(route.params.workspace_id, route.params.board_id, {
      taskId: taskFocus.value.id,
      newColumnId: columnActive.id
    })
    columnActive.tasks[dropResult.addedIndex].board_column_id = columnActive.id;

    // Update the tasks for each used board column
    const boardColumnFocus = board.value?.data.columns.find(column => column.id === columnFocus.value.id);
    if (boardColumnFocus) {
      boardColumnFocus.tasks = columnFocus.value.tasks;
    }

    const boardColumnActive = board.value?.data.columns.find(column => column.id === columnActive.id);
    if (boardColumnActive) {
      boardColumnActive.tasks = columnActive.tasks;
    }

    await boardsStore.saveBoard(route.params.workspace_id, route.params.board_id, board);
  }
}

</script>

<template>
  <Container class="flex gap-3 overflow-auto m-[1%] p-[1%]" orientation="horizontal" @drop="handleColumnDrop">
    <Draggable v-for="column in board.data.columns" v-if="board.data.columns.length > 0">
      <div class="flex flex-col gap-3 group">
        <!-- COLUMN CARD -->
        <UCard class="w-[300px] cursor-pointer">
          <template #header>
            <div class="flex flex-row justify-between items-center">
              <p class="text-xl">{{ column.title }}</p>
              <UDropdown :items="columnItems" :popper="{ placement: 'right-start' }">
                <UButton
                    color="gray"
                    icon="i-heroicons-ellipsis-horizontal-20-solid"
                    variant="ghost"
                    @click="columnFocus = column"
                />
              </UDropdown>
            </div>
          </template>

          <!-- TASK CARD -->
          <Container
              :drop-placeholder="{ className:
                `bg-primary bg-opacity-20
                border-dotted border-2
                border-primary rounded-lg mt-3`,
              animationDuration: '200',
              showOnTop: true }"
              :shouldAcceptDrop="(e) =>  (e.groupName === 'col-items')"
              class="flex flex-col gap-3"
              drag-class="
                transition duration-100 ease-in z-50
                transform scale-110 rotate-[10deg] opacity-75"

              drop-class="transition duration-100
                ease-in z-50 transform
                -rotate-2 scale-90 opacity-100"

              group-name="col-items"

              @drop="handleTaskDrop(column, $event)">
            <Draggable v-for="task in column.tasks" @mousedown="taskFocus = task; columnFocus = column">
              <UCard :ui="{header: { background: `bg-${task.color}-500` }, body: { padding: 'sm:p-4' } }"
                     class="w-[250px] cursor-pointer">
                <template v-if="task.color" #header></template>
                <div class="flex flex-row justify-between items-center">
                  <p class="text-lg">{{ task.title }}</p>
                  <UDropdown :items="taskItems" :popper="{ placement: 'right-start' }">
                    <UButton
                        color="gray"
                        icon="i-heroicons-bars-3-20-solid"
                        variant="ghost"
                        @click="columnFocus = column; taskFocus = task"
                    />
                  </UDropdown>
                </div>
                <div v-if="task.due_date">
                  <UButton
                      :color="calculateDueDateColor(task)"
                      :label="formatDate(task.due_date)"
                      icon="i-heroicons-calendar-days-20-solid"
                      variant="outline"
                      @click="task.completed = !task.completed; updateTask(column.id, task)"
                  />
                </div>
              </UCard>
            </Draggable>
          </Container>

          <!-- CREATE A NEW TASK -->
          <template #footer>
            <UButton
                class="w-[250px]"
                color="gray"
                icon="i-heroicons-plus-solid"
                label="Add a task"
                variant="ghost"
                @click="isTaskAddModalOpen = true; columnFocus = column"
            />
          </template>
        </UCard>
      </div>
    </Draggable>
    <div>
      <div
          class="flex flex-row justify-between items-center px-4 py-5 rounded-lg cursor-pointer ring-1 ring-gray-200 dark:ring-gray-700 w-[250px] h-[80px]"
          @click="isColumnAddModalOpen = true"
      >
        <p class="text-xl">Add column</p>
        <UIcon name="i-heroicons-plus-solid" size="2xl"/>
      </div>
    </div>
  </Container>
  <!-- Column creation modal -->
  <UModal v-model="isColumnAddModalOpen">
    <div class="p-4">
      <form @submit.prevent="handleCreateColumn()">
        <h2>Add column...</h2>
        <div class="form-group">
          <label for="input-title">Title</label>
          <UInput
              id="input-title"
              v-model="columnForm.title"
              color="primary"
              placeholder="Enter title"
              type="text"
              variant="outline"
          />
        </div>
        <div class="form-group mt-2">
          <label for="textarea-description">Description</label>
          <UTextarea
              id="textarea-description"
              v-model="columnForm.description"
              color="primary"
              placeholder="Enter description"
              type="text"
              variant="outline"
          />
        </div>
        <div class="button-group w-100 mt-3">
          <UButton
              color="primary"
              label="Add"
              type="submit"
              variant="solid"
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
              label="Cancel"
              variant="outline"
              @click="isColumnDeleteModalOpen = false"
          />
          <UButton
              color="red"
              label="Delete"
              variant="solid"
              @click="handleDeleteColumn(columnFocus.id)"
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
              id="input-title"
              v-model="taskForm.title"
              color="primary"
              placeholder="Enter title"
              type="text"
              variant="outline"
          />
        </div>
        <div class="form-group mt-2">
          <label for="textarea-description">Description</label>
          <UTextarea
              id="textarea-description"
              v-model="taskForm.description"
              color="primary"
              placeholder="Enter description"
              type="text"
              variant="outline"
          />
        </div>
        <div class="button-group w-100 mt-3">
          <UButton
              color="primary"
              label="Add"
              type="submit"
              variant="solid"
          />
        </div>
      </form>
    </div>
  </UModal>

  <!-- Task editing/view modal -->
  <UModal v-model="isTaskEditModalOpen" :ui="{width: 'w-full sm:max-w-[80%]'}">
    <div class="p-4">
      <div class="flex flex-col gap-2">
        <h2 id="task-editable-title" class="text-2xl outline-none dark:focus:bg-gray-800 focus:bg-gray-200 p-1 rounded"
            contenteditable="true" spellcheck="false" @blur="handleUpdateTask(columnFocus.id, taskFocus.id)">
          {{ taskFocus.title }}</h2>
        <UTextarea
            id="task-editable-description"
            v-model="taskFocus.description"
            class="w-full p-1"
            placeholder="Add a description"
            ui="{variant: {none: 'bg-gray-200 dark:bg-gray-800'} }"
            variant="none"
            @blur="handleUpdateTask(columnFocus.id, taskFocus.id)"
        />
      </div>

      <form @submit.prevent="handleCreateComment(columnFocus.id, taskFocus.id)">
        <div class="form-group mt-2">
          <label for="textarea-description">Comment</label>
          <UTextarea
              id="textarea-content"
              v-model="commentForm.content"
              color="gray"
              placeholder="Enter content"
              type="text"
              variant="outline"
          />
        </div>

        <div class="button-group w-100 mt-3">
          <UButton
              color="primary"
              label="Comment"
              type="submit"
              variant="solid"
          />
        </div>
      </form>
      <div v-for="comment in taskFocus.comments">
        <UCard>
          <div class="flex gap-2">
            <UAvatar></UAvatar>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-1">
                <p><span class="cursor-pointer">{{ comment.author.name }}</span> <span
                    class="text-xs text-gray-300 cursor-default">at {{
                    new Date(comment.created_at).toLocaleString()
                  }}</span></p>
                <UDropdown :items="commentItems" :popper="{ placement: 'right-start' }">
                  <UButton
                      color="gray"
                      icon="i-heroicons-ellipsis-vertical"
                      size="xs"
                      variant="ghost"
                      @click="commentFocus = comment"
                  />
                </UDropdown>
              </div>
              <p class="text-sm">{{ comment.content }}</p>
            </div>
          </div>
        </UCard>
      </div>
      <!-- COMMENTS -->
    </div>
  </UModal>
</template>

<style scoped>
.smooth-dnd-container.horizontal {
  display: flex !important;
}

.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper {
  overflow: visible !important;
}
</style>
