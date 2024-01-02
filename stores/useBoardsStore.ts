import { defineStore } from "pinia";
import { ref } from "vue";

type Board = {
    id: number;
    title: string;
    description: string;
}

type TaskCreate = {
    title: string;
    description: string;
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

export const useBoardsStore = defineStore('boards', () => {
    const boards = ref<Board[] | null>(null);

    async function fetchBoards(workspace_id: any) {
      const {data} = await useApiFetch(`/api/workspaces/${workspace_id}/boards`);
      boards.value = data.value as Board[];
      return data.value as Board[];
    }

    async function fetchBoard(workspace_id: any, board_id: any) {
        const {data} = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`);
        return data.value;
    }


    async function createBoard(workspace_id: any, info: BoardCreate) {
      const board = await useApiFetch(`/api/workspaces/${workspace_id}/boards`, {
        method: 'POST',
        body: info,
      });
      await fetchBoards(workspace_id);
      return board;
    }

    async function createColumn(workspace_id: any, board_id: any, info: ColumnCreate) {
        const column = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns`, {
            method: 'POST',
            body: info,
        });
        await fetchBoards(workspace_id);
        return column;
    }

    async function createTask(workspace_id: any, board_id: any, column_id: any, info: TaskCreate) {
        const task = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks`, {
            method: 'POST',
            body: info,
        });
        await fetchBoards(workspace_id);
        return task;
    }

    async function updateTask(workspace_id: any, board_id: any, column_id: any, task_id: any, info: TaskCreate) {
        const task = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}`, {
            method: 'PATCH',
            body: info,
        });
        await fetchBoards(workspace_id);
        return task;
    }

    async function deleteBoard(workspace_id: any, board_id: any) {
      const board = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
        method: 'DELETE',
      });
      await fetchBoards(workspace_id);
      return board;
    }

    async function deleteColumn(workspace_id: any, board_id: any, column_id: any) {
        const column = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}`, {
            method: 'DELETE',
        });
        await fetchBoards(workspace_id);
        return column;
    }

    async function deleteTask(workspace_id: any, board_id: any, column_id: any, task_id: any) {
        const task = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}`, {
            method: 'DELETE',
        });
        await fetchBoards(workspace_id);
        return task;
    }

    // COMMENTS
    async function createComment(workspace_id: any, board_id: any, column_id: any, task_id: any, info: Comment) {
        const comment = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments`, {
            method: 'POST',
            body: info,
        });
        await fetchBoards(workspace_id);
        return comment;
    }

    async function updateComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any, info: Comment) {
        const comment = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments/${comment_id}`, {
            method: 'PATCH',
            body: info,
        });
        await fetchBoards(workspace_id);
        return comment;
    }

    async function deleteComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any,) {
        const comment = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments/${comment_id}`, {
            method: 'DELETE',
        });
        await fetchBoards(workspace_id);
        return comment;
    }

    async function clearBoards() {
      boards.value = null;
    }

    return {
        fetchBoards, fetchBoard, clearBoards,
        createBoard, deleteBoard,
        createColumn, deleteColumn,
        createTask, updateTask, deleteTask,
        createComment, updateComment, deleteComment,

        boards,
    }
  })
