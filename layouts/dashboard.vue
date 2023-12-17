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
    <div class="page-wrapper">
        <DashboardHeader/>
        <div class="content-wrapper">
            <DashboardInfoBar/>
            <div class="content">
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
