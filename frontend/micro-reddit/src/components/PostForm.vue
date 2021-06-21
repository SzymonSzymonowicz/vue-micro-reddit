<template>
  <form @submit.prevent enctype="multipart/form-data">
    <div class="field">
      <label for="title" class="label">Tytuł</label>
      <input v-model="title" name="title" />
    </div>

    <div class="field">
      <label for="content" class="label">Zawartość</label>
      <textarea v-model="content" name="content" />
    </div>

    <div class="field">
      <label for="file" class="label">Dodaj zdjęcie</label>
      <input type="file" name="file" ref="file" @change="selectFile" />
    </div>

    <div class="field">
      <label for="video" class="label">Film (URL)</label>
      <input v-model="videoUrl" name="video" />
    </div>

    <div class="field">
      <button @click="creatPost">Utwórz post</button>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import { newPost } from "../service/post";

export default {
  name: "PostForm",
  data() {
    return {
      file: "",
      title: "",
      content: "",
      imagePath: "",
      videoUrl: "",
    };
  },
  props: {
    subredditId: Number,
  },
  methods: {
    selectFile() {
      this.file = this.$refs.file.files[0];
    },
    async sendFile() {
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        const file = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          {
            withCredentials: true,
          }
        );
        console.log(file.data.file);
        return file.data.file;
      } catch (err) {
        console.log(err);
      }
    },
    async creatPost() {
      const img = await this.sendFile();
      const imgUrl = "http://localhost:5000/static/" + img;
      this.imagePath = imgUrl;

      let req = await newPost(
        this.title,
        this.content,
        this.imagePath,
        this.videoUrl,
        this.subredditId
      );
      if (req.status === 200) {
        console.log("sukces");
        // router.go(-1);
        this.$emit("getSubredditPosts");
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
