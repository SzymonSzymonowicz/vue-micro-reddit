<template>
  <div class="post">
    <div class="header">
      <div class="title">{{ post.title }} # {{ post.id }}</div>
      <div class="auth">Autor: {{ post.author }}</div>
    </div>
    <div class="details">
      <div class="subreddit">
        Subreddit:
        <router-link :to="{ path: `/r/${post.subreddit}` }"
          >{{ post.subreddit }}
        </router-link>
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
</template>
<script>
export default {
  name: "Post",
  props: {
    post: {},
  },
};
</script>

<style lang="scss" scoped>
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
      width: 50%;
      height: 50%;
    }
  }
  .video {
    display: flex;
    justify-content: center;
  }
}
</style>
