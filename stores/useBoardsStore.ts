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

export const useBoardsStore = defineStore('boards', () => {
    const boards = ref<Board[] | null>(null);

    async function fetchBoards(workspace_id: any) {
      const {data} = await useApiFetch(`/api/workspaces/${workspace_id}/boards`);
      boards.value = data.value as Board[];
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
        const column = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks`, {
            method: 'POST',
            body: info,
        });
        await fetchBoards(workspace_id);
        return column;
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

    async function clearBoards() {
      boards.value = null;
    }

    return { fetchBoards, createBoard, boards, clearBoards, deleteBoard, fetchBoard, createColumn, deleteColumn, createTask, deleteTask }
  })
