<template>
  <form @submit.prevent>
    <div class="field">
      <label for="content" class="label">Treść</label>
      <textarea v-model="content" name="content" />
    </div>

    <div class="field">
      <button @click="addComment">Dodaj Komentarz</button>
    </div>
  </form>
</template>

<script>
import { postComment } from "../service/comment";

export default {
  name: "CommentForm",
  data() {
    return {
      content: "",
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
  width: 25%;
  .field {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
  }
}
</style>
