<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useBoardsStore } from '~/stores/useBoardsStore';

const boardsStore = useBoardsStore();
const route = useRoute();

const board = ref(await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id));
const tasks = ref([] as any);
tasks.value = [];

board.value.data.columns.forEach((column: any) => {
  column.tasks.forEach((task: any) => {
    tasks.value.push(task);
  });
})

let columnFocus: { id: any; };
let taskFocus: { id: any; };

// UI ELEMENTS //
const taskItems = [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
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
      handleDeleteTask(columnFocus, taskFocus.id);
    }
  }]
];

async function handleDeleteTask(columnId: any, taskId: any) {
  await boardsStore.deleteTask(route.params.workspace_id, route.params.board_id, columnId, taskId);
  board.value = await boardsStore.fetchBoard(route.params.workspace_id, route.params.board_id);
  tasks.value = [];
  board.value.data.columns.forEach((column: any) => {
    column.tasks.forEach((task: any) => {
      tasks.value.push(task);
    });
  })
}

const currentDate = ref(new Date());
const selectedDate = ref(new Date());

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const currentMonth = computed(() => currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

const daysInMonth = ref([] as number[]);
const blanks = ref([] as any[]);

onMounted(() => {
  updateCalendar();
});

function updateCalendar() {
  daysInMonth.value = calculateDaysInMonth();
  blanks.value = calculateBlanks();
}

function calculateDaysInMonth() {
  const firstDayOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);

  const days = [];
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push(i);
  }

  return days;
}

function calculateBlanks() {
  const firstDayOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
  return new Array(firstDayOfMonth.getDay()).fill(null);
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  nextTick(updateCalendar);
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  nextTick(updateCalendar);
}

function selectDate(date: any) {
  selectedDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), date);
}

function areDatesEqual(date1: Date, date2: Date): boolean {
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  const day1 = date1.getDate();

  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();

  return year1 === year2 && month1 === month2 && day1 === day2;
}

function hasTaskOnDate(date: any) {
  const selectedDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), date);
  return tasks.value.some((task: any) => {
    return areDatesEqual(new Date(task.due_date), selectedDate);
  });
}

function getTasksForDate(date: any) {
  return tasks.value.filter((task: any) => {
    const taskDate = new Date(task.due_date);
    const targetDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), date);
    return areDatesEqual(taskDate, targetDate)
  });
}
</script>

<template>
  <div class="w-[80%] m-auto">
    <div class="flex items-center justify-between mb-[10px] w-[250px] m-auto">
      <button @click="previousMonth">&lt;</button>
      <h2 class="text-2xl">{{ currentMonth }}</h2>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="grid grid-cols-7 gap-4">
      <div v-for="day in daysOfWeek" :key="day" class="text-center">
        <UCard :ui="{ body: { padding: 'px-1 py-1 sm:py-4' } }"
        >
          <h2>{{ day }}</h2>
        </UCard>
      </div>
      <div v-for="blank in blanks" :key="blank" class="text-center"></div>
      <div v-for="date in daysInMonth" :key="date" class="day" @click="selectDate(date)">
        <UCard :ui="{ header: { padding: 'sm:py-2 sm:px-3' }, footer: { padding: 'sm:py-3 sm:px-2' } }" class="min-h-[250px]">
          <template #header>
            <h2 class="text-2xl">{{ date }}</h2>
          </template>
          <template #footer>
            <div v-if="hasTaskOnDate(date)" class="flex flex-col gap-3 p-1 overflow-y-auto max-h-[180px]">
              <div v-for="task in getTasksForDate(date)">
                <UCard :ui="{body: { padding: 'px-2 py-3 sm:p-3' }, header: { background: `bg-${task.color}-500` } }" class="cursor-pointer overflow-hidden">
                  <template v-if="task.color" #header></template>
                  <div class="flex flex-row justify-between items-center">
                    <p class="text-sm">{{ task.title }}</p>
                    <UDropdown :items="taskItems" :popper="{ placement: 'right-start' }" >
                      <UButton
                          color="gray"
                          variant="ghost"
                          icon="i-heroicons-bars-3-20-solid"
                          @click="columnFocus = task.board_column_id, taskFocus = task"
                      />
                    </UDropdown>
                  </div>
                  <!--                <UBadge color="red" variant="solid">Svarīgs</UBadge>-->
                </UCard>
              </div>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </div>
</template>
