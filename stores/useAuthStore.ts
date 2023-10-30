import { defineStore } from "pinia";
import { useProjectsStore } from "~/stores/useProjectsStore";
import { ref } from "vue";

type User = {
    id: number;
    name: string;
    email: string;
}

type Credentials = {
    email: string;
    password: string;
}

type RegistrationInfo = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const useAuthStore = defineStore('auth', () => {
    const projectsStore = useProjectsStore();

    const user = ref<User | null>(null)
    const isLoggedIn = computed(() => !!user.value);

    async function logout() {
      await useApiFetch("/logout", {method: "POST"});
      user.value = null;
      projectsStore.clearProjects();
      navigateTo("/login");
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
    
      await fetchUser();

      return login;
    }

    async function register(info: RegistrationInfo) {
      await useApiFetch("/sanctum/csrf-cookie");

      const register = await useApiFetch("/register", {
        method: 'POST',
        body: info,
      });
    
      await fetchUser();

      return register;
    }

    return { user, login, isLoggedIn, fetchUser, logout, register }
  })
