<script lang="ts" setup>
const colorMode = useColorMode();

console.log(colorMode.preference)

</script>

<template>
  <div>
    <AppHeader/>
    <div class="content">
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
    </div>
  </div>
</template>

<style scoped lang="scss">
  .content {
    padding: 1%;
  }
</style>
