<template>
  <div class="home">
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
  computed: {
    // parsedDate(stringDate) {
    // const date = new Date(stringDate);
    //
    // return date;
    // },
  },
  async mounted() {
    let req = await getMyPosts();

    const regex = /watch\?v=/;

    if (req.status === 200) {
      this.posts = req.data.map((post) => {
        let { video_url, ...rest } = post;

        video_url = video_url?.replace(regex, "embed/");

        return { video_url, ...rest };
      });
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
