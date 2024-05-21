<template>
  <div class="p-4 flex flex-col gap-2">
    <h2>Primary Color</h2>
    <div class="flex gap-1">
      <div
          v-for="color in primaryColors"
          :key="color.name"
          :style="{ backgroundColor: color.hex }"
          class="color-swatch"
          @click="updatePrimaryColor(color)"
      ></div>
    </div>
    <h2>Secondary Color</h2>
    <div class="flex gap-1">
      <div
          v-for="color in grayColors"
          :key="color.name"
          :style="{ backgroundColor: color.hex }"
          class="color-swatch"
          @click="updateGrayColor(color)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppConfig } from '#app'

const primaryColors = ref([
  { name: 'blue', hex: '#3B82F6' },
  { name: 'red', hex: '#EF4444' },
  { name: 'green', hex: '#10B981' },
  { name: 'yellow', hex: '#F59E0B' },
  { name: 'indigo', hex: '#6366F1' },
  { name: 'purple', hex: '#8B5CF6' }
])

const grayColors = ref([
  { name: 'gray', hex: '#6B7280' },
  { name: 'zinc', hex: '#9CA3AF' },
  { name: 'neutral', hex: '#737373' },
  { name: 'stone', hex: '#78716C' },
  { name: 'blueGray', hex: '#64748B' },
  { name: 'codgray', hex: '#D1D5DB' },
  { name: 'martinique', hex: '#D1D5DB' },
])

// Access and update the app config
const appConfig = useAppConfig()

const updatePrimaryColor = (color) => {
  appConfig.ui.primary = color.name
}

const updateGrayColor = (color) => {
  appConfig.ui.gray = color.name
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