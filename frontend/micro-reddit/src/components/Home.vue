<template>
  <div class="home">
    <button @click="sortById" class="btn btn-primary mt-3">
      Sortuj po NEW
    </button>
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="header">
        <div class="title">{{ post.title }} # {{ post.id }}</div>
        <div class="auth">Autor: {{ post.authorId }}</div>
      </div>
      <div class="details">
        <div class="subreddit">Subreddit: {{ post.subreddit_id }}</div>
        <div class="date">
          {{ post.creation_date }}
        </div>
      </div>
      <div class="image">
        <img :src="post.image_path" />
      </div>
      <div class="content">{{ post.content }}</div>
      <div class="video" v-if="post.video_url">
        <iframe width="640" height="360" :src="post.video_url" />
      </div>
    </div>
  </div>
</template>

<script>
import { getMyPosts } from "../service/post";

export default {
  name: "Home",
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    async sortById() {
      let req = await getMyPosts("date");

      if (req.status === 200) {
        this.posts = this.parsePosts(req.data);
      }
    },
    parsePosts(posts) {
      const regex = /watch\?v=/;

      return posts?.map((post) => {
        let { video_url, creation_date, ...rest } = post;

        video_url = video_url?.replace(regex, "embed/");
        creation_date = new Date(creation_date).toLocaleString();

        return { video_url, creation_date, ...rest };
      });
    },
  },
  async mounted() {
    let req = await getMyPosts();

    if (req.status === 200) {
      this.posts = this.parsePosts(req.data);
    }
  },
};
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .post {
    width: 80%;
    min-width: 200px;
    margin: 20px 0px;
    padding: 20px;
    border: black 2px solid;
    // border-radius: 10px;
    .title {
      font-size: 36px;
    }
    .header {
      display: flex;
      flex-direction: column;
    }
    .content {
      margin: 20px 0px;
    }
    .image {
      display: flex;
      justify-content: center;
      img {
        width: 80%;
        height: 80%;
      }
    }
    .video {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
