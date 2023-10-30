<script lang="ts" setup>
  defineProps(['project'])
</script>

<template>
  <div class="project-card">
    <div v-if="project" class="project-card-image">
      <!-- <img src="~/assets/images/project.png"/> -->
      <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
        <rect x="120" y="60" width="50" height="50" fill="rgba(0,0,0,0)" stroke="var(--color-accent-red)" stroke-width="3" filter="url(#f1)"></rect>
        <polygon points="180,20 220,100 140,100" fill="rgba(0,0,0,0)" stroke="var(--color-accent-blue)" stroke-width="3"/>
        <circle r="35" cx="220" cy="55" fill="rgba(0,0,0,0)" stroke="var(--color-accent-orange)" stroke-width="3"/>
      </svg>
    </div>

    <div v-else class="project-card-image">
      <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
        <line x1="160" y1="65" x2="210" y2="65" stroke="var(--text-color-primary)" stroke-width="10"/>
        <line x1="185" y1="40" x2="185" y2="90" stroke="var(--text-color-primary)" stroke-width="10"/>
      </svg>
    </div>

    <div v-if="project" class="project-card-content">
      <h1>{{ project.title }}</h1>
      <p>{{ project.description }}</p>
    </div>
    <div v-else class="project-card-content">
      <h1>Create a project</h1>
      <p>Create your new project here.</p>
    </div>
  </div>
</template>


<style scoped lang="scss">
@use '~/assets/scss/base';

.project-card {
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 360px;
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--bg-color-lighter);

  margin: 1% 0;
  transition: 0.1s;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);


  &:hover {
    opacity: 90%;
    cursor: pointer;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
    scale: 1.02;

    transition: 0.15s;
  }
}
.project-card-image {
  height: 130px;
}

.project-card-content {
  height: 100%;
  padding: 5%;
  background-color: var(--bg-color-light);

  h1 {
    color: var(--text-color-primary);
  }

  p {
    color: var(--text-color-secondary);
  }
}
</style>
