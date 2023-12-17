<script setup lang="ts">
import { ref, computed } from 'vue';

const currentDate = ref(new Date());
const firstDayOfMonth = ref(new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1));
const lastDayOfMonth = ref(new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0));

const timeDifference = ref(lastDayOfMonth.value.getTime() - currentDate.value.getTime());
const daysDifference = computed(() => Math.ceil(timeDifference.value / (1000 * 60 * 60 * 24)));

function formatDayWithSuffix(date: any) {
  const day = date.getDate();
  const suffix = (day >= 11 && day <= 13) ? 'th' :
      (day % 10 === 1) ? 'st' :
      (day % 10 === 2) ? 'nd' :
      (day % 10 === 3) ? 'rd' : 'th';

  return `${day}${suffix}`;
}

function addDay(day: any) {
  const newDate = new Date(firstDayOfMonth.value);
  newDate.setDate(newDate.getDate() + day);
  return newDate;
}

function dateToString(date: any) {
  return formatDayWithSuffix(date) + ', ' + date.toLocaleDateString('en-US', { weekday: 'long' });
}

function nextMonth() {
  const nextDay = new Date(lastDayOfMonth.value);
  nextDay.setDate(nextDay.getDate() + 1);

  firstDayOfMonth.value = new Date(nextDay.getFullYear(), nextDay.getMonth(), 1)
  lastDayOfMonth.value = new Date(nextDay.getFullYear(), nextDay.getMonth() + 1, 0);
  if (currentDate.value.getMonth() === nextDay.getMonth()){
    timeDifference.value = lastDayOfMonth.value.getTime() - currentDate.value.getTime();
  } else {
    timeDifference.value = lastDayOfMonth.value.getTime() - firstDayOfMonth.value.getTime();
  }
}

function prevMonth() {
  const nextDay = new Date(firstDayOfMonth.value);
  nextDay.setDate(nextDay.getDate() - 1);

  firstDayOfMonth.value = new Date(nextDay.getFullYear(), nextDay.getMonth(), 1)
  lastDayOfMonth.value = new Date(nextDay.getFullYear(), nextDay.getMonth() + 1, 0);
  timeDifference.value = lastDayOfMonth.value.getTime() - firstDayOfMonth.value.getTime();
}

function areDatesEqual(date1: any, date2: any) {
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  const day1 = date1.getDate();

  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();
  const day2 = date2.getDate();

  return year1 === year2 && month1 === month2 && day1 === day2;
}
</script>

<template>
  <div class="bg-gray-200 dark:bg-gray-800 p-1 flex flex-row gap-1 overflow-auto">
    <div class="bg-white dark:bg-gray-900 p-4 ring-gray-200">
      <p class="border border-gray-200 dark:border-gray-700 p-1 text-2xl">{{ firstDayOfMonth.toLocaleDateString('en-US', { month: 'long' }) }}</p>
      <div class="flex">
        <div v-for="day in daysDifference + 1" class="w-[150px] border border-gray-200 dark:border-gray-700 p-1">
          <div>
            <p>{{ dateToString(addDay(day - 1)) }}</p>
            <p v-if="areDatesEqual(addDay(day - 1), currentDate)">Astagfirullah</p>
          </div>
          <div class="w-[150px] h-[150px] border border-gray-200 dark:border-gray-700">

          </div>
        </div>
      </div>
      <button @click="prevMonth()">Prev Month</button>
      <button @click="nextMonth()">Next Month</button>
    </div>
  </div>
</template>

<style scoped>

</style>