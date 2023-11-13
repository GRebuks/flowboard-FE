<script setup lang="ts">
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'profile',
})

</script>

<template>
  <h2>Boards page</h2>
    <!-- <main>
      <h2 v-if="workspace?.title">{{ workspace.title }} boards</h2>

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
        <div class="form-group">
          <label for="exampleInputTitle">Color</label>
          <input
              type="color"
              class="form-control"
              id="exampleInputTitle"
              placeholder="Enter title"
              v-model="form.color"
          >
        </div>

        <div class="button-group w-100 mt-3">
          <button type="submit" class="btn btn-primary">add +</button>
        </div>
      </form>

      <br>
      <br>
      <div class="d-flex flex-column" style="gap: 30px">
        <div v-for="(board, index) in boards" :key="index" class="card" style="width: 18rem;" :style="{'border-left': '4px solid ' +  board.color}">
          <div class="card-body">
            <h5 class="card-title">{{ board.title }}</h5>
            <a href="#" class="btn btn-primary">Open</a>
          </div>
        </div>
      </div>
    </main> -->
</template>

<!-- <script>
import ProfileLayout from "@/layouts/ProfileLayout.vue";
export default {
  components: {ProfileLayout},
  data () {
    return {
      boards: [],
      workspace: null,
      form: {
        title: null,
        description: null,
        color: null
      },
      errors: []
    }
  },
  mounted () {
    this.axios.get('/workspaces/' + this.$route.params.workspaceid).then((response) => {
      this.workspace = response.data.data
      console.log(this.workspace)
    })
    this.axios.get('/workspaces/' + this.$route.params.workspaceid + '/boards').then((response) => {
      this.boards = response.data.data
    })
  },
  methods: {
    submit () {
      this.errors = []
      this.axios.post('/workspaces/' + this.$route.params.workspaceid + '/boards' , this.form).then((response) => {
        this.boards.push(response.data.data)
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


<style scoped>
  main {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    text-align: center;
    margin-top: 10px;
  }

</style>