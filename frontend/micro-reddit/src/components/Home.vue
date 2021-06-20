<template>
  <div class="home">
    <button @click="sortById" class="btn btn-primary mt-3">
      Sortuj po NEW
    </button>
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="header">
        <div class="title">{{ post.title }} # {{ post.id }}</div>
        <div class="auth">Autor: {{ post.author }}</div>
      </div>
      <div class="details">
        <div class="subreddit">
          Subreddit:
          <router-link :to="{ path: `/r/${post.subreddit}` }">{{
            post.subreddit
          }}</router-link>
        </div>
        <div class="date">
          {{ post.creationDate }}
        </div>
      </div>
      <div class="image" v-if="post.imagePath">
        <img :src="post.imagePath" />
      </div>
      <div class="content">{{ post.content }}</div>
      <div class="video" v-if="post.videoUrl">
        <iframe width="640" height="360" :src="post.videoUrl" />
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
        let { videoUrl, creationDate, ...rest } = post;

        videoUrl = videoUrl?.replace(regex, "embed/");
        creationDate = new Date(creationDate).toLocaleString();

        return { videoUrl, creationDate, ...rest };
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

<style lang="scss" scoped>
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
    background: lightgray;
    border-radius: 10px;
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
