<template>
  <div class="w-100 d-flex flex-column align-items-center">
    <Post :post="post" />
    <div class="comments">
      <div v-for="com in comments" :key="com.id">
        <div class="card" style="min-width: 100%">
          <div class="card-body">
            <h5 class="card-title">{{ com.author }}</h5>
            <h6 class="card-subtitle mb-2 text-muted"># {{ com.id }}</h6>
            <p class="card-text">
              {{ com.content }}
            </p>
            <button class="btn btn-danger text-right">Usuń</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPostById, getPostComments } from "../service/post";
import Post from "./Post.vue";
// get all comments
// get post
// get is moderator
export default {
  components: { Post },
  name: "PostView",
  data() {
    return {
      id: this.$route.params.id,
      post: {},
      comments: [],
    };
  },
  methods: {
    async getCurrentPost() {
      const req = await getPostById(this.id);

      if (req.status === 200) {
        this.post = req.data;
      }
    },
    async getPostComments() {
      const req = await getPostComments(this.id);

      if (req.status === 200) {
        this.comments = req.data;
      }
    },
  },
  mounted() {
    this.getCurrentPost();
    this.getPostComments();
  },
};
</script>

<style lang="scss" scoped>
.comments {
  width: 80%;
}
</style>
