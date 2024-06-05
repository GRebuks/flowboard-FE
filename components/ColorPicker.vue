<template>
  <div class="p-4 flex flex-col gap-2">

    <!-- This tag is placed here for a Tailwind workaround -->
    <!-- If I don't define these somewhere in code, the compiler won't recognise these colors -->
    <div class="hidden border-zinc-200 border-neutral-200 border-stone-200 border-codgray-200 border-martinique-200 border-crimson-200 border-slate-200 border-steel-200 border-charcoal-200 border-twilight-200 border-granite-200 border-smoky-200 border-moss-200 border-chestnut-200 border-bluish-dark-200 border-purple-dark-200 border-grayish-dark-200 border-dark-red-200 border-dark-green-200 border-dark-blue-200"></div>

    <div class="hidden border-zinc-800 border-neutral-800 border-stone-800 border-codgray-800 border-martinique-800 border-crimson-800 border-slate-800 border-steel-800 border-charcoal-800 border-twilight-800 border-granite-800 border-smoky-800 border-moss-800 border-chestnut-800 border-bluish-dark-800 border-purple-dark-800 border-grayish-dark-800 border-dark-red-800 border-dark-green-800 border-dark-blue-800"></div>

    <div class="hidden bg-zinc-900 bg-neutral-900 bg-stone-900 bg-codgray-900 bg-martinique-900 bg-crimson-900 bg-slate-900 bg-steel-900 bg-charcoal-900 bg-twilight-900 bg-granite-900 bg-smoky-900 bg-moss-900 bg-chestnut-900 bg-bluish-dark-900 bg-purple-dark-900 bg-grayish-dark-900 bg-dark-red-900 bg-dark-green-900 bg-dark-blue-900"></div>

    <h2>Primary Color</h2>
    <div class="flex gap-1">
      <div
          v-for="color in primaryColors"
          :key="color.name"
          :class="'bg-' + color.name + '-500'"
          class="color-swatch"
          @click="updatePrimaryColor(color)"
      ></div>
    </div>
    <h2>Secondary Color</h2>
    <div class="flex gap-1">
      <div
          v-for="color in grayColors"
          :key="color.name"
          class="color-swatch border"
          :class="['border-' + color.name + '-800', 'bg-' + color.name + '-950']"
          @click="updateGrayColor(color)"
      ></div>
    </div>
    <h2>Color Combinations</h2>
    <p class="text-xs">Notice: some of the color themes below can have unexpected results</p>
    <div class="flex gap-1">
      <div
          v-for="color in betaColors"
          :key="color.name"
          class="color-swatch border"
          :class="['border-' + color.name + '-800', 'bg-' + color.name + '-900']"
          @click="updateGrayColor(color)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppConfig } from '#app'
import { useAuthStore } from '~/stores/useAuthStore';

const primaryColors = ref([
  { name: 'blue' },
  { name: 'red' },
  { name: 'green' },
  { name: 'yellow' },
  { name: 'indigo' },
  { name: 'purple' },
  { name: 'teal' },
])

const grayColors = ref([
  { name: 'zinc' },
  { name: 'neutral' },
  { name: 'stone' },
  { name: 'codgray' },
  { name: 'martinique' },
  { name: 'crimson' },
  { name: 'slate' },
  { name: 'steel' },
  { name: 'charcoal' },
  { name: 'twilight' },
  { name: 'granite' },
  { name: 'smoky' },
  { name: 'moss' },
  { name: 'chestnut' },
]);

const betaColors = ref([
  { name: 'bluish-dark' },
  { name: 'purple-dark' },
  { name: 'grayish-dark' },
  { name: 'dark-red' },
  { name: 'dark-green' },
  { name: 'dark-blue' },
]);

// Access and update the app config
const appConfig = useAppConfig();
const auth = useAuthStore();

const updatePrimaryColor = (color) => {
  auth.setUserPreferences({primary: color.name});
  appConfig.ui.primary = color.name;
}

const updateGrayColor = (color) => {
  auth.setUserPreferences({secondary: color.name});
  appConfig.ui.gray = color.name;
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

.custom-border {
  border-width: 1px !important;
}
</style>