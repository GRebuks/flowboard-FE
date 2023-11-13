import { defineStore } from "pinia";
import { ref } from "vue";

type Workspace = {
    id: number;
    title: string;
    description: string;
}

export const useWorkspacesStore = defineStore('workspaces', () => {
    const workspaces = ref<Workspace[] | null>(null);

    async function fetchWorkspaces() {
      const {data} = await useApiFetch(`/api/workspaces`);
      workspaces.value = data.value as Workspace[];
    }

    async function fetchUserWorkspaces(user_id) {
      const {data} = await useApiFetch(`/api/users/${user_id}/workspaces`);
      workspaces.value = data.value as Workspace[];
    }

    async function clearWorkspaces() {
      workspaces.value = null;
    }

    return { fetchWorkspaces, fetchUserWorkspaces, workspaces, clearWorkspaces }
  })
