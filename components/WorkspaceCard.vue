<script lang="ts" setup>
  defineProps(['workspace'])
</script>

<template>
  <div class="workspace-card" @click="navigateTo(`workspaces/${ workspace.id }`)">
    <div v-if="workspace" class="workspace-card-image">
      <!-- <img src="~/assets/images/workspace.png"/> -->
      <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
        <rect x="120" y="60" width="50" height="50" fill="rgba(0,0,0,0)" stroke="var(--color-primary)" stroke-width="3" filter="url(#f1)"></rect>
        <polygon points="180,20 220,100 140,100" fill="rgba(0,0,0,0)" stroke="var(--color-accent)" stroke-width="3"/>
        <circle r="35" cx="220" cy="55" fill="rgba(0,0,0,0)" stroke="var(--color-primary)" stroke-width="3"/>
      </svg>
    </div>

    <div v-else class="workspace-card-image">
      <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="160" y1="65" x2="210" y2="65" stroke="var(--color-primary)" stroke-width="10"/>
        <line x1="185" y1="40" x2="185" y2="90" stroke="var(--color-primary)" stroke-width="10"/>
      </svg>
    </div>

    <div v-if="workspace" class="workspace-card-content">
      <h1>{{ workspace.title }}</h1>
      <p>{{ workspace.description }}</p>
    </div>
    <div v-else class="workspace-card-content">
      <h1>Create a workspace</h1>
      <p>Create your new workspace here.</p>
    </div>
  </div>
</template>


<style scoped lang="scss">
@use '~/assets/scss/base';

.workspace-card {
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 360px;
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--color-background-light);

  margin: 1% 0;
  transition: 0.1s;
  box-shadow: 0px 0px 2px 0px var(--color-primary);
  border: 1px solid var(--color-primary);


  &:hover {
    opacity: 90%;
    cursor: pointer;
    scale: 1.02;

    transition: 0.3s;
  }
}
.workspace-card-image {
  height: 130px;
}

.workspace-card-content {
  height: 100%;
  padding: 5%;
  background-color: var(--color-secondary);

  h1 {
    color: var(--color-text);
    margin: 0;
  }

  p {
    color: var(--color-text);
  }
}
</style>
