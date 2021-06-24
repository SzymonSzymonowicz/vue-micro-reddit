<template>
  <form @submit.prevent enctype="multipart/form-data">
    <div class="field">
      <label for="title" class="label">Tytuł</label>
      <input v-model="title" name="title" />
      <span class="errorMsg">{{ msg.title }}</span>
    </div>

    <div class="field">
      <label for="content" class="label">Opis</label>
      <textarea v-model="content" name="content" />
      <span class="errorMsg">{{ msg.content }}</span>
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
import { newPost, uploadImage } from "../service/post";
import { isErrorObjectNotEmpty } from "@/utils/validationUtils";

export default {
  name: "PostForm",
  data() {
    return {
      file: "",
      title: "",
      content: "",
      imagePath: "",
      videoUrl: "",
      msg: {},
      touched: false,
    };
  },
  props: {
    subredditId: Number,
  },
  watch: {
    title(value) {
      this.touchedByUser();
      this.title = value;
      this.msg["title"] = value === "" ? "Wypełnij to pole" : "";
    },
    content(value) {
      this.touchedByUser();
      this.content = value;
      this.msg["content"] = value === "" ? "Wypełnij to pole" : "";
    },
  },
  methods: {
    touchedByUser() {
      this.touched = true;
    },
    selectFile() {
      this.file = this.$refs.file.files[0];
    },
    async sendFile() {
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        const file = await uploadImage(formData);
        console.log(file.data.file);
        return file.data.file;
      } catch (err) {
        console.log(err);
      }
    },
    async creatPost() {
      if (!this.touched) {
        alert("Nie wypełniono formularza.");
        return;
      }

      if (isErrorObjectNotEmpty(this.msg)) {
        console.log("Validation failed!");
        return;
      }

      const img = await this.sendFile();
      const imgUrl = "/static/" + img;
      this.imagePath = imgUrl;

      let req = await newPost(
        this.title,
        this.content,
        this.imagePath,
        this.videoUrl,
        this.subredditId
      );
      if (req.status === 200) {
        console.log("Successfuly added new post.");
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
  width: 50%;
  .field {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
  }
}
</style>
