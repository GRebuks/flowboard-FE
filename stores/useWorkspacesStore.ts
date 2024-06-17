import { defineStore } from "pinia";
import { ref } from "vue";
import type { Workspace } from "~/types";

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

export const useWorkspacesStore = defineStore('workspaces', {
    state: () => {
        return {
            workspaces: ref<Workspace[] | null>(null),
        }
    },
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
        }),
    },
    actions: {
        async fetchWorkspaces() {
            try {
                console.log("Fetching workspaces...");
                const { data, error } = await useApiFetch('/api/workspaces');
                if (error.value) {
                    console.error("Error fetching workspaces:", error.value);
                } else {
                    this.workspaces = data.value;
                    console.log("Workspaces fetched successfully:", this.workspaces);
                }
            } catch (err) {
                console.error("Failed to fetch workspaces:", err);
            }
        },

        async fetchUserWorkspaces(user_id: any) {
            const {data} = await useApiFetch(`/api/users/${user_id}/workspaces`);
            this.workspaces = data.value as Workspace[];
        },

        async createWorkspace(info: WorkspaceCreate) {
            const workspace = await useApiFetch(`/api/workspaces`, {
                method: 'POST',
                body: info,
            });
            await this.fetchWorkspaces();
            return workspace;
        },

        async deleteWorkspace(workspace_id: any) {
            await useApiFetch(`/api/workspaces/${workspace_id}`, {
                method: 'DELETE',
            });
            await this.fetchWorkspaces();
        },

        async clearWorkspaces() {
            this.workspaces = null;
        },

        async addParticipant(workspace_id: any, info: Participant) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/participants/add`, {
                method: 'POST',
                body: { 'user_id': info.id },
            });
        },

        async removeParticipant(workspace_id: any, info: Participant) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/participants/remove`, {
                method: 'POST',
                body: { 'user_id': info.id },
            });
        },
    },
});