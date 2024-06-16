import { useAuthStore } from "~/stores/useAuthStore";
import { useWorkspacesStore } from "~/stores/useWorkspacesStore";

export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore();
    const workspacesStore = useWorkspacesStore();

    console.log("LOAD WORKSPACE PLUGIN IS RUN");
    if (auth.isLoggedIn) {
        console.log("workspace is logged in");
        await workspacesStore.fetchWorkspaces();
    }
    else {
        console.log("workspace is not logged in");
        await workspacesStore.clearWorkspaces();
    }
})
