<template>
  <div class="p-4 flex flex-col gap-2">
    <h2>Card Color</h2>
    <div class="flex gap-1">
      <div
          v-for="color in colors"
          :key="color.name"
          :style="{ backgroundColor: color.hex }"
          class="color-swatch dark:border-gray-800 border-2"
          @click="updateColor(color)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['color'])


const colors = ref([
  { name: '', hex: 'primary' },
  { name: 'blue', hex: '#3B82F6' },
  { name: 'red', hex: '#EF4444' },
  { name: 'green', hex: '#10B981' },
  { name: 'yellow', hex: '#F59E0B' },
  { name: 'indigo', hex: '#6366F1' },
  { name: 'purple', hex: '#8B5CF6' }
])

const updateColor = (color: {name: string, hex: string}) => {
  emit('color', color)
}
</script>

<style scoped>
.color-picker {
  display: flex;
  gap: 10px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 4px;
}
</style>