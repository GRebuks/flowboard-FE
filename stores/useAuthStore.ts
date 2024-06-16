import { defineStore } from "pinia";
import { useWorkspacesStore } from "~/stores/useWorkspacesStore";
import { useBoardsStore } from "~/stores/useBoardsStore";
import { ref, computed } from "vue";
import { useAppConfig } from "#app";
import { useApiFetch } from "@/api";

type User = {
    id: number;
    username: string;
    email: string;
};

type Credentials = {
    email: string;
    password: string;
};

type RegistrationInfo = {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        isLoggedIn: false,
    }),

    actions: {
        async logout() {
            await useApiFetch("/logout", { method: "POST" });
            this.user = null;
            this.isLoggedIn = false;
            await this.workspacesStore.clearWorkspaces();
            await this.boardsStore.clearBoards();
            localStorage.removeItem('primary');
            localStorage.removeItem('secondary');
            const appConfig = useAppConfig();
            appConfig.ui.primary = 'mariner';
            appConfig.ui.gray = 'slate';
            navigateTo("/");
        },

        async fetchUser() {
            const { data } = await useApiFetch("/api/user");
            this.user = data.value as User;
            this.isLoggedIn = true;
            localStorage.setItem('user', JSON.stringify(this.user));
            localStorage.setItem('isLoggedIn', 'true');
        },

        async login(credentials: Credentials) {
            await useApiFetch("/sanctum/csrf-cookie");

            const login = await useApiFetch("/login", {
                method: 'POST',
                body: credentials
            });

            if (!login.error.value) {
                await this.fetchUser();
                await this.getUserPreferences();
            }

            return login;
        },

        async register(info: RegistrationInfo) {
            await useApiFetch("/sanctum/csrf-cookie");

            const register = await useApiFetch("/register", {
                method: 'POST',
                body: info,
            });

            if (!register.error.value) {
                await this.fetchUser();
            }

            return register;
        },

        async getUserPreferences() {
            const { data } = await useApiFetch(`/api/user/preferences`, {
                method: 'GET',
            });
            this.updateUserPreferences(data.value.data);
            return data;
        },

        async setUserPreferences(info: any) {
            const { data } = await useApiFetch(`/api/user/preferences`, {
                method: 'POST',
                body: info,
            });
            return data;
        },

        updateUserPreferences(data: any) {
            const appConfig = useAppConfig();
            appConfig.ui.primary = data.primary ? data.primary : 'mariner';
            appConfig.ui.gray = data.secondary ? data.secondary : 'slate';
            localStorage.setItem('primary', appConfig.ui.primary);
            localStorage.setItem('secondary', appConfig.ui.gray);
        },
    },

    // Enable persistence for this store
    persist: true,

    // Access other stores if needed
    getters: {
        workspacesStore: () => useWorkspacesStore(),
        boardsStore: () => useBoardsStore(),
    },

    // Hydration method
    hydrate(initialState: any) {
        Object.assign(this, initialState);
    },

    // Computed property
    isLoggedIn: computed(() => !!this.user),
});
