export interface Comment {
    id: number;
    author: {
        id: number;
        name: string;
    };
    content: string;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    color: string | null;
    created_at: string;
    board_column_id: number;
    order: number;
    due_date: string | null;
    completed: boolean;
    comments: Comment[];
}

export interface Column {
    id: number;
    title: string;
    order: number;
    tasks: Task[];
}

export interface Board {
    id: number;
    title: string;
    description: string | null;
    color: string;
    columns: Column[];
}

// Wrap in data
export interface BoardData {
    data: Board;
}

export interface DropResult {
    addedIndex: number | null,
    removedIndex: number | null,
    payload: any | null,
    droppedElement: any | null,
}

export interface Workspace {
    id: number;
    title: string;
    description: string | null;
    color: string | null;
}

export interface WorkspaceData {
    data: Workspace;
}