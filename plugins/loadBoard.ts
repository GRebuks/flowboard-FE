import { useAuthStore } from "~/stores/useAuthStore";
import { useBoardsStore } from "~/stores/useBoardsStore";

export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuthStore();
    const boardsStore = useBoardsStore();
    const route = useRoute();

    if (auth.isLoggedIn) {
        console.log(!!route.params.workspace_id);
        if(route.params.workspace_id) {
            await boardsStore.fetchBoards(route.params.workspace_id);
        }
    }
    else {
        await boardsStore.clearBoards();
    }
})
