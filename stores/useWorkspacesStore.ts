import {defineStore} from "pinia";
import {ref} from "vue";
import type {Workspace} from "~/types";
//
// type Workspace = {
//     id: number;
//     title: string;
//     description: string;
// }

type WorkspaceCreate = {
    title: string;
    description: string;
}

type Participant = {
    icon: string;
    id: number;
    label: string;
    suffix: string;
}

export const useWorkspacesStore = defineStore('workspaces', () => {
    const workspaces = ref<Workspace[] | null>(null);

    async function fetchWorkspaces() {
      const {data} = await useApiFetch(`/api/workspaces`);
      workspaces.value = data.value as Workspace[];
    }

    async function fetchUserWorkspaces(user_id: any) {
      const {data} = await useApiFetch(`/api/users/${user_id}/workspaces`);
      workspaces.value = data.value as Workspace[];
    }

    async function createWorkspace(info: WorkspaceCreate) {
      const workspace = await useApiFetch(`/api/workspaces`, {
        method: 'POST',
        body: info,
      });
      await fetchWorkspaces();
      return workspace;
    }

    async function deleteWorkspace(workspace_id: any) {
      await useApiFetch(`/api/workspaces/${workspace_id}`, {
        method: 'DELETE',
      });
      await fetchWorkspaces();
    }

    async function clearWorkspaces() {
      workspaces.value = null;
    }

    async function addParticipant(workspace_id: any, info: Participant) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/participants/add`, {
            method: 'POST',
            body: { 'user_id': info.id },
        });
    }

    async function removeParticipant(workspace_id: any, info: Participant) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/participants/remove`, {
            method: 'POST',
            body: { 'user_id': info.id },
        });
    }

    return {
        hydrate(initialState: any) {
            Object.assign(this, initialState)
        },
        fetchWorkspaces, fetchUserWorkspaces, workspaces, clearWorkspaces, createWorkspace, deleteWorkspace, addParticipant, removeParticipant }
  })
