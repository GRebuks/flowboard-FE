import { defineStore } from "pinia";
import { ref } from "vue";
import type { BoardData } from "~/types";

type TaskCreate = {
    title: string;
    description: string | null;
    color: string | null;
};

type BoardCreate = {
    title: string;
    description: string;
};

type ColumnCreate = {
    title: string;
    description: string;
};

type Comment = {
    content: string;
};

export const useBoardsStore = defineStore('boards', {
    state: () => ({
        boards: null as BoardData[] | null,
        etag: null as string | null,
    }),
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
        }),
    },
    actions: {
        async fetchBoards(workspace_id: any): Promise<BoardData[]> {
            const { data } = await useApiFetch(`/api/workspaces/${workspace_id}/boards`);
            this.boards = data.value as BoardData[];
            return data.value as BoardData[];
        },

        async fetchBoard(workspace_id: any, board_id: any): Promise<BoardData | null> {
            const headers = this.etag ? { 'If-None-Match': this.etag } : {};
            const { data, error } = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
                headers
            });

            if (data?.value) {
                if (data.value.etag) {
                    this.etag = data.value.etag;
                }
            }

            if (error.value) {
                throw error.value;
            }

            return data.value as BoardData;
        },

        async createBoard(workspace_id: any, info: BoardCreate) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards`, {
                method: 'POST',
                body: info,
            });
        },

        async createColumn(workspace_id: any, board_id: any, info: ColumnCreate) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns`, {
                method: 'POST',
                body: info,
            });
        },

        async createTask(workspace_id: any, board_id: any, column_id: any, info: TaskCreate) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks`, {
                method: 'POST',
                body: info,
            });
        },

        async updateTask(workspace_id: any, board_id: any, column_id: any, task_id: any, info: TaskCreate) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}`, {
                method: 'PATCH',
                body: info,
            });
        },

        async deleteBoard(workspace_id: any, board_id: any) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
                method: 'DELETE',
            });
        },

        async deleteColumn(workspace_id: any, board_id: any, column_id: any) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}`, {
                method: 'DELETE',
            });
        },

        async deleteTask(workspace_id: any, board_id: any, column_id: any, task_id: any) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}`, {
                method: 'DELETE',
            });
        },

        async createComment(workspace_id: any, board_id: any, column_id: any, task_id: any, info: Comment) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments`, {
                method: 'POST',
                body: info,
            });
        },

        async updateComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any, info: Comment) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments/${comment_id}`, {
                method: 'PATCH',
                body: info,
            });
        },

        async deleteComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments/${comment_id}`, {
                method: 'DELETE',
            });
        },

        async saveBoard(workspace_id: any, board_id: any, info: any) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/save`, {
                method: 'POST',
                body: info,
            });
        },

        async reorderTask(workspace_id: any, board_id: any, info: any) {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/reorder`, {
                method: 'POST',
                body: info,
            });
        },

        async addTaskParticipant(task_id: any, info: any) {
            return await useApiFetch(`/api/tasks/${task_id}/participants/add`, {
                method: 'POST',
                body: { 'user_id': info.id },
            });
        },

        async removeTaskParticipant(task_id: any, info: any) {
            return await useApiFetch(`/api/tasks/${task_id}/participants/remove`, {
                method: 'POST',
                body: { 'user_id': info.id },
            });
        },

        resetEtag() {
            this.etag = null;
        },

        clearBoards() {
            this.boards = null;
        },
    },
});
