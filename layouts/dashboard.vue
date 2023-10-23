<script lang="ts" setup>
import DashboardInfoBar from '../components/DashboardInfoBar.vue';
const colorMode = useColorMode();

console.log(colorMode.preference)

</script>

<template>
    <div class="page-wrapper">
        <DashboardHeader/>
        <div class="content-wrapper">
            <DashboardInfoBar/>
            <div class="content">
                <slot />
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
.page-wrapper {
    display: flex;
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.content {
    padding: 1%;
}

</style>
