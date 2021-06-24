<template>
  <div class="w-100 d-flex flex-column align-items-center">
    <Post :post="post" :initShowDelete="true" />
    <button class="w-75 btn btn-danger mt-2 mb-5" @click="deletePost">
      Usuń
    </button>
    <div class="comments">
      <div v-for="com in comments" :key="com.id">
        <div class="card my-2" style="min-width: 100%">
          <div class="card-body">
            <h5 class="card-title">{{ com.author }}</h5>
            <h6 class="card-subtitle mb-2 text-muted"># {{ com.id }}</h6>
            <p class="card-text">
              {{ com.content }}
            </p>
            <button
              @click="deleteComment(com.id)"
              class="btn btn-danger text-right"
            >
              Usuń
            </button>
          </div>
        </div>
      </div>
    </div>
    <CommentForm
      class="commentForm"
      :postId="post.id"
      @getPostComments="getPostComments"
    />
  </div>
</template>

<script>
import {
  getPostById,
  getPostComments,
  deletePostById,
  parseSinglePost,
} from "../service/post";
import { deleteCommentById } from "../service/comment";
import Post from "./Post.vue";
import router from "../router";
import CommentForm from "./CommentForm.vue";
import io from "socket.io-client";

export default {
  components: { Post, CommentForm },
  name: "PostView",
  data() {
    return {
      id: this.$route.params.id,
      post: {},
      comments: [],
      socket: io(process.env.VUE_APP_BACKEND_URL || ""),
    };
  },
  methods: {
    async getCurrentPost() {
      const req = await getPostById(this.id);

      if (req.status === 200) {
        this.post = parseSinglePost(req.data);
      }
    },
    async getPostComments() {
      const req = await getPostComments(this.id);

      if (req.status === 200) {
        this.comments = req.data;
      }
    },
    async deleteComment(id) {
      console.log(id);
      const req = await deleteCommentById(id);
      if (req.status === 200) {
        await this.getPostComments();
        this.socket.emit("COMMENTS_UPDATED", {
          user: "default",
          message: "default",
        });
      }
    },
    async deletePost(event) {
      event.preventDefault();
      let req = await deletePostById(this.post.id).catch((err) =>
        console.log(err)
      );

      if (req.status === 200) {
        this.socket.emit("DELETED_POST", {
          user: "default",
          message: "default",
        });
        router.go(-1);
      }
    },
  },
  mounted() {
    this.getCurrentPost();
    this.getPostComments();
    this.socket.on("MESSAGE", () => {
      this.getPostComments();
    });
    this.socket.on("DELETED_POST", () => {
      router.go(-1);
    });
  },
};
</script>

<style lang="scss" scoped>
.comments,
.commentForm {
  width: 80%;
}
</style>
