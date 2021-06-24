<template>
  <form @submit.prevent>
    <div class="card my-2" style="min-width: 100%">
      <div class="card-body">
        <h5 class="card-title">Nowy Komentarz</h5>
        <div class="card-text">
          <div class="field">
            <label for="content" class="label">Treść</label>
            <textarea v-model="content" name="content" class="form-control" />
          </div>
        </div>
        <div class="field">
          <button class="btn btn-primary my-4" @click="addComment">
            Dodaj Komentarz
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { postComment } from "../service/comment";
import io from "socket.io-client";

export default {
  name: "CommentForm",
  data() {
    return {
      content: "",
      socket: io(process.env.VUE_APP_BACKEND_URL || ""),
    };
  },
  props: {
    postId: Number,
  },
  methods: {
    async addComment() {
      console.log(this.postId);

      let req = await postComment(this.postId, this.content);

      if (req.status === 200) {
        console.log("sukces");
        this.socket.emit("COMMENTS_UPDATED", {
          user: "default",
          message: "default",
        });
        this.$emit("getPostComments");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  align-self: center;
  min-width: 200px;
  width: 100%;
  .field {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
  }
}
</style>
