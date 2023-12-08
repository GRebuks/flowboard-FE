<script lang="ts" setup>
defineProps(['board'])

</script>

<template>
  <div>
    <div class="p-2 text-normal border border-primary rounded-[5px] hover:cursor-pointer">
      <pre>
        {{ dd(board) }}
      </pre>
      <p class="m-0">
        {{ board.title }}
      </p>
    </div>
  </div>
</template>
