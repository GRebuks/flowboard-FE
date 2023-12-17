<template>
  <UCard class="m-2">
    <div class="flex gap-4">
      <h2 class="text-2xl">Board name</h2>
      <div class="flex gap-2">
        <UButton
            color="primary"
            variant="outline"
            square
            size="sm"
            icon="i-heroicons-pencil-square"
        />
        <UButton
            color="red"
            variant="outline"
            square
            size="sm"
            icon="i-heroicons-trash"
        />
      </div>
    </div>
  </UCard>
</template>

<script>
export default {
  name: "BoardCard.vue"
}
</script>

<style scoped>

</style>