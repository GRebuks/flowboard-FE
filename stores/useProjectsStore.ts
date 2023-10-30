import { defineStore } from "pinia";
import { ref } from "vue";

type Project = {
    id: number;
    title: string;
    description: string;
}

export const useProjectsStore = defineStore('projects', () => {
    const projects = ref<Project[] | null>(null);
    const publicProjects = ref<Project[] | null>(null);

    async function fetchProjects() {
      const {data} = await useApiFetch(`/api/projects`);
      projects.value = data.value as Project[];
    }

    async function fetchUserProjects(user_id) {
      const {data} = await useApiFetch(`/api/users/${user_id}/projects`);
      projects.value = data.value as Project[];
    }

    async function fetchPublicProjects() {
      const {data} = await useApiFetch("/api/public-projects");
      publicProjects.value = data.value as Project[];
    }

    async function clearProjects() {
      projects.value = null;
    }

    return { fetchProjects, fetchUserProjects, fetchPublicProjects, projects, publicProjects, clearProjects }
  })
