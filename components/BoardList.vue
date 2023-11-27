<script lang="ts" setup>
defineProps(['board'])

</script>

<template>
  <div class="list-element">
    <div class="list-element-content">
      <pre>
        {{ dd(board) }}
      </pre>
      <p>
        {{ board.title }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/base';
.list-element {
  background-color: var(--color-background-highlight);
  color: var(--color-text);

  .list-element-content {
    padding: 2%;
    line-height: 16px;
    font-size: 16px;
    border: 1px solid var(--color-accent);
    border-radius: 5px;

    p {
      margin: 0;
    }
  }
  .list-element-content:hover {
    cursor: pointer;
    background-color: var(--color-background);
  }
}
</style>
