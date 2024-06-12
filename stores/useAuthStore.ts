import { defineStore } from "pinia";
import { useWorkspacesStore } from "~/stores/useWorkspacesStore";
import { useBoardsStore } from "~/stores/useBoardsStore";
import { ref } from "vue";
import {info} from "sass";
import {useAppConfig} from "#app";

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
    const BoardsStore = useBoardsStore();

    const user = ref<User | null>(null)
    const isLoggedIn = computed(() => !!user.value);

    async function logout() {
      await useApiFetch("/logout", {method: "POST"});
      user.value = null;
      await workspacesStore.clearWorkspaces();
      await BoardsStore.clearBoards();
      localStorage.removeItem('primary');
      localStorage.removeItem('secondary');
      const appConfig = useAppConfig();
      appConfig.ui.primary = 'mariner';
      appConfig.ui.gray = 'slate';
      navigateTo("/");
    }

    async function fetchUser() {
      const {data} = await useApiFetch("/api/user");
      user.value = data.value as User;
    }

    async function login(credentials: Credentials) {
      await useApiFetch("/sanctum/csrf-cookie");

      const login = await useApiFetch("/login", {
        method: 'POST',
        body: credentials
      });

      if(!login.error.value) {
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

        if(!register.error.value) {
            await fetchUser();
        }

      return register;
    }

    async function getUserPreferences() {
        const {data} = await useApiFetch(`/api/user/preferences`, {
            method: 'GET',
        });
        console.log(data.value.data)
        updateUserPreferences(data.value.data);
        return data;
    }

    async function setUserPreferences(info: any) {
        const {data} = await useApiFetch(`/api/user/preferences`, {
            method: 'POST',
            body: info,
        });
        return data;
    }

    function updateUserPreferences(data: any) {
        const appConfig = useAppConfig();
        console.log(data)
        appConfig.ui.primary = data.primary? data.primary : 'mariner';
        appConfig.ui.gray = data.secondary? data.secondary : 'slate';
        localStorage.setItem('primary', appConfig.ui.primary);
        localStorage.setItem('secondary', appConfig.ui.gray);
    }

    return { user, login, isLoggedIn, fetchUser, logout, register, getUserPreferences, setUserPreferences }
  })
