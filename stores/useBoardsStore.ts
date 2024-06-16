import {defineStore} from "pinia";
import {ref} from "vue";
import type {Board, BoardData} from "~/types";

// type Board = {
//     id: number;
//     title: string;
//     description: string;
// }

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
    data: Board,
    etag: string,
}

export const useBoardsStore = defineStore('boards', () => {
    const boards = ref<BoardData[] | null>(null);
    const etag = ref<string | null>();
    let i = 0;
    let isFirstRequest = true;

    async function fetchBoards(workspace_id: any): Promise<BoardData[]> {
      const {data} = await useApiFetch(`/api/workspaces/${workspace_id}/boards`);
      boards.value = data.value as BoardData[];
      return data.value as BoardData[];
    }

    async function fetchBoard(workspace_id: any, board_id: any): Promise<BoardData | null> {
        const headers = etag.value ? { 'If-None-Match': etag.value } : {};
        const {data, error, status} = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
            headers
        });

        if (data?.value) {
            // Magic numbers... if it ain't broke don't fix it
            if (i > 2) {
                etag.value = data?.value.etag;
            } else i++;
        }

        if (error.value) {
            throw error.value;
        }

        return data.value as BoardData;
    }

    // This is pretty bad
    const resetEtag = () => {
        etag.value = '';
        i = 0;
    };

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

    // COMMENTS
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

    async function deleteComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any,) {
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
        })
    }

    async function removeTaskParticipant(task_id: any, info: any) {
        return await useApiFetch(`/api/tasks/${task_id}/participants/remove`, {
            method: 'POST',
            body: { 'user_id': info.id },
        })
    }


    async function clearBoards() {
      boards.value = null;
    }

    return {
        fetchBoards, fetchBoard, clearBoards, saveBoard,
        createBoard, deleteBoard,
        createColumn, deleteColumn,
        createTask, updateTask, deleteTask, reorderTask,
        createComment, updateComment, deleteComment,
        addTaskParticipant, removeTaskParticipant,
        boards, resetEtag,
    }
  })
