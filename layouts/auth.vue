<script lang="ts" setup>
const colorMode = useColorMode();
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>
<template>
  <div class="title-container">
    <span class="header-title">Flowboard</span>
  </div>
  <slot />
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      aria-label="Theme"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<style scoped>
  .header-title {
    font-size: 40px !important;
    text-align: center;
    margin-right: auto;
    margin-left: auto;
    width: 50%;
  }

  .title-container {
    text-align: center;
    margin-top: 100px;
  }
</style>