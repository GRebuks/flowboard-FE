import { defineStore } from "pinia";
import { useWorkspacesStore } from "~/stores/useWorkspacesStore";
import { useBoardsStore } from "~/stores/useBoardsStore";
import { ref } from "vue";

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

    return { user, login, isLoggedIn, fetchUser, logout, register }
  })
