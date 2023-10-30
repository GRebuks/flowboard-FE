<script lang="ts" setup>
import { useProjectsStore } from '~/stores/useProjectsStore';

const projectsStore = useProjectsStore();
await projectsStore.fetchProjects();

</script>

<template>
  <div>
    <h1>Your projects</h1>
    <div class="project-card-list">
      <ProjectCard v-if="projectsStore.projects" v-for="project in projectsStore.projects.data"
        :key="project.id"
        :project="project"
      />
      <ProjectCard/>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .project-card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2%;
    margin: 0 auto;
  }
</style>
