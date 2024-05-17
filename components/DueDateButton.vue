<template>
  <UButton
      v-if="task.due_date"
      :color="calculateDueDateColor(task)"
      :label="formatDate(task.due_date)"
      icon="i-heroicons-calendar-days-20-solid"
      variant="outline"
      @click="task.completed = !task.completed; updateTask(column.id, task)"
  />
</template>

<script lang="ts">
import type {Column, Task} from "~/types";
import { useBoardsStore } from "~/stores/useBoardsStore";

export default {
  name: "DueDateButton",
  props: {
    task: {
      type: Object as () => Task,
      required: true,
    },
    column: {
      type: Object as () => Column,
      required: true,
    },
    route: {}
  },
  methods: {
    formatDate(dateString: string) {
      return new Date(dateString).toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    },
    calculateDueDateColor(task: Task): string {
      const currentDate = new Date();
      if (!task.due_date) {
        return "";
      }
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
  }
}

</script>

<style scoped>

</style>