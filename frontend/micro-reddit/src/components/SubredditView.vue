<template>
  <div>
    <h1>{{ `Witaj na /r/ ${this.$route.params.name}` }}</h1>
    <p>info: {{ info }}</p>
    <p>posts: {{ posts.length }}</p>
    <p>isModerator: {{ isModerator }}</p>
  </div>
</template>

<script>
import {
  getSubredditByName,
  getSubredditPostsByName,
  isSubredditModerator,
} from "../service/subreddit";

export default {
  name: "SubredditView",
  data() {
    return {
      info: {},
      posts: [],
      isModerator: false,
    };
  },
  methods: {
    async getSubreddit() {
      let name = this.$route.params.name;
      let req = await getSubredditByName(name);
      if (req.status === 200) {
        this.info = req.data;
      }
    },
    async getSubredditPosts() {
      let name = this.$route.params.name;
      let req = await getSubredditPostsByName(name);
      if (req.status === 200) {
        this.posts = req.data;
      }
    },
    async getIsModerator() {
      let name = this.$route.params.name;
      let req = await isSubredditModerator(name);
      if (req.status === 200) {
        this.isModerator = req.data;
      }
    },
  },
  async mounted() {
    await this.getSubreddit();
    await this.getSubredditPosts();
    await this.getIsModerator();
  },
};
</script>

<style lang="scss" scoped></style>
