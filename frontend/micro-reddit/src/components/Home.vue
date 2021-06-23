<template>
  <div class="home">
    <button @click="sortById" class="btn btn-primary my-3 w-80">
      Sortuj po NEW
    </button>
    <Post v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script>
import { getMyPosts } from "../service/post";
import Post from "@/components/Post";

export default {
  name: "Home",
  components: { Post },
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

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
