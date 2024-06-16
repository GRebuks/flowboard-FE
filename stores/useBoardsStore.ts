import { defineStore } from "pinia";
import { ref } from "vue";
import type { Board, BoardData } from "~/types";

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

export const useBoardsStore = defineStore('boards', {
  state: () => {
    return {
      boards: ref<BoardData[] | null>(null),
      etag: ref<string | null>(),
      i: ref(0),
      isFirstRequest: ref(true),
    }
  },
  persist: {
    storage: persistedState.cookiesWithOptions({
      sameSite: 'trict',
    }),
  },
  actions: {
    async fetchBoards(workspace_id: any): Promise<BoardData[]> {
      const {data} = await useApiFetch(`/api/workspaces/${workspace_id}/boards`);
      this.boards = data.value as BoardData[];
      return data.value as BoardData[];
    },

    async fetchBoard(workspace_id: any, board_id: any): Promise<BoardData | null> {
        const headers = this.etag.value? { 'If-None-Match': this.etag.value } : {};
        const {data, error, status} = await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}`, {
            headers
        });

        if (data?.value) {
            // Magic numbers... if it ain't broke don't fix it
            if (this.i > 2) {
                this.etag = data?.value.etag;
            } else this.i++;
        }

        if (error.value) {
            throw error.value;
        }

        return data.value as BoardData;
    },

    // This is pretty bad
    resetEtag() {
        this.etag = '';
        this.i = 0;
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

    // COMMENTS
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

    async deleteComment(workspace_id: any, board_id: any, column_id: any, task_id: any, comment_id: any,) {
      return await useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/columns/${column_id}/tasks/${task_id}/comments/${comment_id}`, {
        method: 'DELETE',
      });
    },

    async saveBoard(workspace_id: any, board_id: any, info: any) {
      return useApiFetch(`/api/workspaces/${workspace_id}/boards/${board_id}/save`, {
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
      })
    },

    async removeTaskParticipant(task_id: any, info: any) {
      return await useApiFetch(`/api/tasks/${task_id}/participants/remove`, {
        method: 'POST',
        body: { 'user_id': info.id },
      })
    },

    async clearBoards() {
      this.boards.value = null;
    }
  }
})