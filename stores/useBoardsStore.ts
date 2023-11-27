import { defineStore } from "pinia";
import { ref } from "vue";

type Board = {
    id: number;
    title: string;
    description: string;
}

type BoardCreate = {
  title: string;
  description: string;
}

export const useBoardsStore = defineStore('boards', () => {
    const boards = ref<Board[] | null>(null);

    async function fetchBoards(workspace_id: any) {
      const {data} = await useApiFetch(`/api/workspaces/${workspace_id}/boards`);
      boards.value = data.value as Board[];
    }


    async function createBoard(workspace_id: any, info: BoardCreate) {
      const board = await useApiFetch(`/api/workspaces/${workspace_id}/boards`, {
        method: 'POST',
        body: info,
      });
      await fetchBoards(workspace_id);
      return board;
    }

    async function deleteBoard(workspace_id: any, board_id: any) {
      const board = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
        method: 'DELETE',
      });
      await fetchBoards(workspace_id);
      return board;
    }

    async function clearBoards() {
      boards.value = null;
    }

    return { fetchBoards, createBoard, boards, clearBoards, deleteBoard }
  })
