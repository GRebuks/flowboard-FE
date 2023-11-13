<script lang="ts" setup>

import { useAuthStore } from "~/stores/useAuthStore";
import { definePageMeta } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'profile',
})

import { useWorkspacesStore } from '~/stores/useWorkspacesStore';

const workspacesStore = useWorkspacesStore();
if (!workspacesStore.workspaces) {
  await workspacesStore.fetchWorkspaces();
}

</script>

<template>
  <main>
    <div>
      <h1>Your workspaces</h1>
      <div class="workspace-card-list">
        <WorkspaceCard v-if="workspacesStore.workspaces" v-for="workspace in workspacesStore.workspaces.data"
          :key="workspace.id"
          :workspace="workspace"
        />
        <WorkspaceCard/>
      </div>
    </div>

    <!--
      Workspace creation form

    <form @submit.prevent="submit">
      <div v-if="errors.length > 0">
        <div v-for="(error, index) in errors" :key="index" class="alert alert-danger" role="alert">
          {{ error }}
        </div>
      </div>
      <div class="form-group">
        <label for="exampleInputTitle">Title</label>
        <input
            type="text"
            class="form-control"
            id="exampleInputTitle"
            placeholder="Enter title"
            v-model="form.title"
        >
      </div>
      <div class="form-group mt-2">
        <label for="exampleTextareaDescription">Description</label>
        <textarea
            type="text"
            class="form-control"
            id="exampleTextareaDescription"
            placeholder="Enter description"
            v-model="form.description"
        />
      </div>
      <div class="button-group w-100 mt-3">
        <button type="submit" class="btn btn-primary">add +</button>
      </div>
    </form> -->
  </main>
</template>

<!-- <script>
export default {
  data () {
    return {
      workspaces: [],
      errors: [],
      form: {
        title: null,
        description: null
      }
    }
  },
  mounted () {
    this.axios.get('/workspaces').then((response) => {
      this.workspaces = response.data.data
      console.log(response)
    })
  },
  methods: {
    submit () {
      this.errors = []
      this.axios.post('/workspaces', this.form).then((response) => {
        this.workspaces.push(response.data.data)
      }).catch((error) => {
        if(error.response.data.message) {
          this.errors.push(error.response.data.message)
          return 0
        }
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          this.errors.push(value[0])
        })
      })
    }
  }
}
</script> -->


<style scoped lang="scss">
  .workspace-card-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2%;
    margin: 0 auto;
  }
</style>