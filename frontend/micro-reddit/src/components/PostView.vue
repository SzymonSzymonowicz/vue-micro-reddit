<template>
  <!-- <span>fsda</span> -->
  <div>
    <Post :post="post" />
    <ol>
      <li v-for="com in comments" :key="com.id">
        {{ com }}
      </li>
    </ol>
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

<style lang="scss" scoped></style>
