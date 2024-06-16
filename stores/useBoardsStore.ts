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
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedBoards = localStorage.getItem('boards');
        if (storedBoards) {
            boards.value = JSON.parse(storedBoards);
        }

        const storedEtag = localStorage.getItem('etag');
        if (storedEtag) {
            etag.value = storedEtag;
        }
    }

    async function fetchBoards(workspace_id: any): Promise<BoardData[]> {
        try {
            const { data } = await useApiFetch(`/api/workspaces/${workspace_id}/boards`);
            boards.value = data.value as BoardData[];

            // Save boards to localStorage if available
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('boards', JSON.stringify(data.value));
            }

            return data.value as BoardData[];
        } catch (error) {
            console.error("Error fetching boards:", error);
            throw error;
        }
    }

    async function fetchBoard(workspace_id: any, board_id: any): Promise<BoardData | null> {
        try {
            const headers = etag.value ? { 'If-None-Match': etag.value } : {};
            const { data, error } = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
                headers
            });

            if (data?.value) {
                etag.value = data?.value.etag;

                // Save etag to localStorage if available
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem('etag', data.value.etag);
                }
            }

            if (error.value) {
                throw error.value;
            }

            return data.value as BoardData;
        } catch (error) {
            console.error("Error fetching board:", error);
            throw error;
        }
    }

    async function createBoard(workspace_id: any, info: BoardCreate) {
        try {
            const board = await useApiFetch(`/api/workspaces/${workspace_id}/boards`, {
                method: 'POST',
                body: info,
            });

            await fetchBoards(workspace_id); // Update local state and localStorage
            return board;
        } catch (error) {
            console.error("Error creating board:", error);
            throw error;
        }
    }

    async function createColumn(workspace_id: any, board_id: any, info: ColumnCreate) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns`, {
                method: 'POST',
                body: info,
            });
        } catch (error) {
            console.error("Error creating column:", error);
            throw error;
        }
    }

    async function createTask(workspace_id: any, board_id: any, column_id: any, info: TaskCreate) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks`, {
                method: 'POST',
                body: info,
            });
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }
    }

    async function updateTask(workspace_id: any, board_id: any, column_id: any, task_id: any, info: TaskCreate) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}`, {
                method: 'PATCH',
                body: info,
            });
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    }

    async function deleteBoard(workspace_id: any, board_id: any) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error("Error deleting board:", error);
            throw error;
        }
    }

    async function deleteColumn(workspace_id: any, board_id: any, column_id: any) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error("Error deleting column:", error);
            throw error;
        }
    }

    async function deleteTask(workspace_id: any, board_id: any, column_id: any, task_id: any) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    }

    async function createComment(workspace_id: any, board_id: any, column_id: any, task_id: any, info: Comment) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments`, {
                method: 'POST',
                body: info,
            });
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    }

    async function updateComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any, info: Comment) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments/${comment_id}`, {
                method: 'PATCH',
                body: info,
            });
        } catch (error) {
            console.error("Error updating comment:", error);
            throw error;
        }
    }

    async function deleteComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments/${comment_id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }

    async function saveBoard(workspace_id: any, board_id: any, info: any) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/save`, {
                method: 'POST',
                body: info,
            });
        } catch (error) {
            console.error("Error saving board:", error);
            throw error;
        }
    }

    async function reorderTask(workspace_id: any, board_id: any, info: any) {
        try {
            return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/reorder`, {
                method: 'POST',
                body: info,
            });
        } catch (error) {
            console.error("Error reordering task:", error);
            throw error;
        }
    }

    async function addTaskParticipant(task_id: any, info: any) {
        try {
            return await useApiFetch(`/api/tasks/${task_id}/participants/add`, {
                method: 'POST',
                body: { 'user_id': info.id },
            });
        } catch (error) {
            console.error("Error adding task participant:", error);
            throw error;
        }
    }

    async function removeTaskParticipant(task_id: any, info: any) {
        try {
            return await useApiFetch(`/api/tasks/${task_id}/participants/remove`, {
                method: 'POST',
                body: { 'user_id': info.id },
            });
        } catch (error) {
            console.error("Error removing task participant:", error);
            throw error;
        }
    }

    async function clearBoards() {
        boards.value = null;

        // Remove from localStorage if available
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('boards');
            localStorage.removeItem('etag');
        }
    }

    return {
        hydrate(initialState: any) {
            Object.assign(this, initialState);
        },
        fetchBoards,
        fetchBoard,
        clearBoards,
        createBoard,
        deleteBoard,
        createColumn,
        deleteColumn,
        createTask,
        updateTask,
        deleteTask,
        createComment,
        updateComment,
        deleteComment,
        saveBoard,
        reorderTask,
        addTaskParticipant,
        removeTaskParticipant,
        boards,
        etag,
    };
});
