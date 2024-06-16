import { defineStore } from "pinia";
import { useWorkspacesStore } from "~/stores/useWorkspacesStore";
import { useBoardsStore } from "~/stores/useBoardsStore";
import { ref, computed } from "vue";
import { useAppConfig } from "#app";

type User = {
    id: number;
    username: string;
    email: string;
}

type Credentials = {
    email: string;
    password: string;
}

type RegistrationInfo = {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const useAuthStore = defineStore('auth', () => {
    const workspacesStore = useWorkspacesStore();
    const boardsStore = useBoardsStore();

    const user = ref<User | null>(null);
    const isLoggedIn = computed(() => !!user.value);

    // Initialize user state from localStorage if available
    if (localStorage.getItem('user')) {
        user.value = JSON.parse(localStorage.getItem('user')!);
    }

    async function logout() {
        await useApiFetch("/logout", { method: "POST" });
        user.value = null;
        await workspacesStore.clearWorkspaces();
        await boardsStore.clearBoards();
        localStorage.removeItem('user');
        const appConfig = useAppConfig();
        appConfig.ui.primary = 'mariner';
        appConfig.ui.gray = 'slate';
        navigateTo("/");
    }

    async function fetchUser() {
        const { data } = await useApiFetch("/api/user");
        user.value = data.value as User;
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(data.value));
    }

    async function login(credentials: Credentials) {
        await useApiFetch("/sanctum/csrf-cookie");

        const login = await useApiFetch("/login", {
            method: 'POST',
            body: credentials
        });

        if (!login.error.value) {
            await fetchUser();
            await getUserPreferences();
        }

        return login;
    }

    async function register(info: RegistrationInfo) {
        await useApiFetch("/sanctum/csrf-cookie");

        const register = await useApiFetch("/register", {
            method: 'POST',
            body: info,
        });

        if (!register.error.value) {
            await fetchUser();
        }

        return register;
    }

    async function getUserPreferences() {
        const { data } = await useApiFetch(`/api/user/preferences`, {
            method: 'GET',
        });
        updateUserPreferences(data.value.data);
        return data;
    }

    async function setUserPreferences(info: any) {
        const { data } = await useApiFetch(`/api/user/preferences`, {
            method: 'POST',
            body: info,
        });
        updateUserPreferences(data);
        return data;
    }

    function updateUserPreferences(data: any) {
        const appConfig = useAppConfig();
        appConfig.ui.primary = data.primary ? data.primary : 'mariner';
        appConfig.ui.gray = data.secondary ? data.secondary : 'slate';
        localStorage.setItem('primary', appConfig.ui.primary);
        localStorage.setItem('secondary', appConfig.ui.gray);
    }

    return {
        hydrate(initialState: any) {
            Object.assign(this, initialState);
        },
        user,
        login,
        isLoggedIn,
        fetchUser,
        logout,
        register,
        getUserPreferences,
        setUserPreferences
    };
});