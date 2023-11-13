import { useAuthStore } from "~/stores/useAuthStore";
import { useWorkspacesStore } from "~/stores/useWorkspacesStore";

export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore();
    const workspacesStore = useWorkspacesStore();

    if (auth.isLoggedIn) {
        await workspacesStore.fetchWorkspaces();
    }
    else {
        await workspacesStore.clearWorkspaces();
    }
})
