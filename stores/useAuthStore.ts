import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useWorkspacesStore } from "~/stores/useWorkspacesStore";
import { useBoardsStore } from "~/stores/useBoardsStore";
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

    // Initialize user from localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user.value = JSON.parse(storedUser);
        }
    }

    async function logout() {
        try {
            await useApiFetch("/logout", { method: "POST" });
            user.value = null;
            await workspacesStore.clearWorkspaces();
            await boardsStore.clearBoards();

            // Clear from localStorage if available
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.removeItem('user');
            }

            const appConfig = useAppConfig();
            appConfig.ui.primary = 'mariner';
            appConfig.ui.gray = 'slate';
            navigateTo("/");
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }

    async function fetchUser() {
        try {
            const { data } = await useApiFetch("/api/user");
            user.value = data.value as User;

            // Save user to localStorage if available
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('user', JSON.stringify(data.value));
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

    async function login(credentials: Credentials) {
        try {
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
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    async function register(info: RegistrationInfo) {
        try {
            await useApiFetch("/sanctum/csrf-cookie");

            const register = await useApiFetch("/register", {
                method: 'POST',
                body: info,
            });

            if (!register.error.value) {
                await fetchUser();
            }

            return register;
        } catch (error) {
            console.error("Error registering:", error);
            throw error;
        }
    }

    async function getUserPreferences() {
        try {
            const { data } = await useApiFetch(`/api/user/preferences`, {
                method: 'GET',
            });

            updateUserPreferences(data.value.data);
            return data;
        } catch (error) {
            console.error("Error fetching user preferences:", error);
            throw error;
        }
    }

    async function setUserPreferences(info: any) {
        try {
            const { data } = await useApiFetch(`/api/user/preferences`, {
                method: 'POST',
                body: info,
            });
            return data;
        } catch (error) {
            console.error("Error setting user preferences:", error);
            throw error;
        }
    }

    function updateUserPreferences(data: any) {
        const appConfig = useAppConfig();
        appConfig.ui.primary = data.primary ? data.primary : 'mariner';
        appConfig.ui.gray = data.secondary ? data.secondary : 'slate';

        // Save preferences to localStorage if available
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('primary', appConfig.ui.primary);
            localStorage.setItem('secondary', appConfig.ui.gray);
        }
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