import { useAuthStore } from "~/stores/useAuthStore";
import { useProjectsStore } from "~/stores/useProjectsStore";

export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore();
    const projectsStore = useProjectsStore();

    if (auth.isLoggedIn) {
        await projectsStore.fetchProjects();
    }
    else {
        await projectsStore.clearProjects();
    }
})
