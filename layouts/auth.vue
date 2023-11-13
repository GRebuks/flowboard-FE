<script lang="ts" setup>
const colorMode = useColorMode();
</script>
<template>
  <div class="title-container">
    <span class="header-title">Flowboard</span>
  </div>
  <slot />
  <div>
    <h1>Color mode: {{ colorMode.value }}</h1>
    <select v-model="colorMode.preference">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="test">Test</option>
    </select>
  </div>
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