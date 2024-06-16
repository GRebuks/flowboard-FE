import { defineStore } from "pinia";
import { ref } from "vue";
import type { BoardData } from "~/types";

type TaskCreate = {
    title: string;
    description: string | null;
    color: string | null;
}

type BoardCreate = {
    title: string;
    description: string;
}

type ColumnCreate = {
    title: string;
    description: string;
}

type Comment = {
    content: string;
}

type FetchWithEtag = {
    data: BoardData;
    etag: string;
}

export const useBoardsStore = defineStore('boards', () => {
    const boards = ref<BoardData[] | null>(null);
    const etag = ref<string | null>(null);

    // Initialize boards and etag from localStorage if available
    const storedBoards = localStorage.getItem('boards');
    if (storedBoards) {
        boards.value = JSON.parse(storedBoards);
    }

    const storedEtag = localStorage.getItem('etag');
    if (storedEtag) {
        etag.value = storedEtag;
    }

    async function fetchBoards(workspace_id: any): Promise<BoardData[]> {
        const { data } = await useApiFetch(`/api/workspaces/${workspace_id}/boards`);
        boards.value = data.value as BoardData[];

        // Save boards to localStorage
        localStorage.setItem('boards', JSON.stringify(data.value));
        return data.value as BoardData[];
    }

    async function fetchBoard(workspace_id: any, board_id: any): Promise<BoardData | null> {
        const headers = etag.value ? { 'If-None-Match': etag.value } : {};
        const { data, error } = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
            headers
        });

        if (data?.value) {
            etag.value = data?.value.etag;
            localStorage.setItem('etag', data.value.etag);
        }

        if (error.value) {
            throw error.value;
        }

        return data.value as BoardData;
    }

    async function createBoard(workspace_id: any, info: BoardCreate) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards`, {
            method: 'POST',
            body: info,
        });
    }

    async function createColumn(workspace_id: any, board_id: any, info: ColumnCreate) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns`, {
            method: 'POST',
            body: info,
        });
    }

    async function createTask(workspace_id: any, board_id: any, column_id: any, info: TaskCreate) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks`, {
            method: 'POST',
            body: info,
        });
    }

    async function updateTask(workspace_id: any, board_id: any, column_id: any, task_id: any, info: TaskCreate) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}`, {
            method: 'PATCH',
            body: info,
        });
    }

    async function deleteBoard(workspace_id: any, board_id: any) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
            method: 'DELETE',
        });
    }

    async function deleteColumn(workspace_id: any, board_id: any, column_id: any) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}`, {
            method: 'DELETE',
        });
    }

    async function deleteTask(workspace_id: any, board_id: any, column_id: any, task_id: any) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}`, {
            method: 'DELETE',
        });
    }

    async function createComment(workspace_id: any, board_id: any, column_id: any, task_id: any, info: Comment) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments`, {
            method: 'POST',
            body: info,
        });
    }

    async function updateComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any, info: Comment) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments/${comment_id}`, {
            method: 'PATCH',
            body: info,
        });
    }

    async function deleteComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments/${comment_id}`, {
            method: 'DELETE',
        });
    }

    function saveBoard(workspace_id: any, board_id: any, info: any) {
        return useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/save`, {
            method: 'POST',
            body: info,
        });
    }

    async function reorderTask(workspace_id: any, board_id: any, info: any) {
        return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/reorder`, {
            method: 'POST',
            body: info,
        });
    }

    async function addTaskParticipant(task_id: any, info: any) {
        return await useApiFetch(`/api/tasks/${task_id}/participants/add`, {
            method: 'POST',
            body: { 'user_id': info.id },
        });
    }

    async function removeTaskParticipant(task_id: any, info: any) {
        return await useApiFetch(`/api/tasks/${task_id}/participants/remove`, {
            method: 'POST',
            body: { 'user_id': info.id },
        });
    }

    async function clearBoards() {
        boards.value = null;
        localStorage.removeItem('boards');
        etag.value = null;
        localStorage.removeItem('etag');
    }

    return {
        hydrate(initialState: any) {
            Object.assign(this, initialState);
        },
        fetchBoards,
        fetchBoard,
        clearBoards,
        saveBoard,
        createBoard,
        deleteBoard,
        createColumn,
        deleteColumn,
        createTask,
        updateTask,
        deleteTask,
        reorderTask,
        createComment,
        updateComment,
        deleteComment,
        addTaskParticipant,
        removeTaskParticipant,
        boards,
        etag,
        resetEtag: () => { // resetEtag doesn't need to be async
            etag.value = null;
            localStorage.removeItem('etag');
        },
    };
});