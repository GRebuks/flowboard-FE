import { defineStore } from "pinia";
import { useWorkspacesStore } from "~/stores/useWorkspacesStore";
import { useBoardsStore } from "~/stores/useBoardsStore";
import { ref, computed } from "vue";
import { useAppConfig } from "#app";
import { persistedState } from "pinia-plugin-persistedstate";

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

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            user: null as User | null,
        }
    },
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
        }),
    },
    actions: {
        async logout() {
            await useApiFetch("/logout", { method: "POST" });
            this.user = null;
            await useWorkspacesStore().clearWorkspaces();
            await useBoardsStore().clearBoards();
            localStorage.removeItem('primary');
            localStorage.removeItem('secondary');
            const appConfig = useAppConfig();
            appConfig.ui.primary = 'ariner';
            appConfig.ui.gray = 'late';
            navigateTo("/");
        },

        async fetchUser() {
            const { data } = await useApiFetch("/api/user");
            this.user = data.value as User;
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
            console.log(data.value.data)
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
            console.log(data)
            appConfig.ui.primary = data.primary? data.primary : 'ariner';
            appConfig.ui.gray = data.secondary? data.secondary : 'late';
            localStorage.setItem('primary', appConfig.ui.primary);
            localStorage.setItem('secondary', appConfig.ui.gray);
        },
    },
    getters: {
        isLoggedIn: (state) =>!!state.user,
    },
})