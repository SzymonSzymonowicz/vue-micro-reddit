<template>
  <div>
    <h1>{{ `Witaj na /r/ ${this.$route.params.name}!` }}</h1>
    <Subreddit
      :id="info.id"
      :name="info.name"
      :description="info.description"
      :isIn="info.isIn"
      @updateParent="getIsIn"
    />
    <p>info: {{ info }}</p>
    <p>posts: {{ posts.length }}</p>
    <p>isModerator: {{ isModerator }}</p>
  </div>
  <!-- <i class="bi bi-award-fill"></i> -->
</template>

<script>
import {
  getSubredditByName,
  getSubredditPostsByName,
  isSubredditModerator,
  isLoggedUserInSubreddit,
} from "../service/subreddit";
import Subreddit from "./Subreddit.vue";

export default {
  components: { Subreddit },
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
    async getIsIn() {
      let name = this.$route.params.name;
      let req = await isLoggedUserInSubreddit(name);
      if (req.status === 200) {
        this.info.isIn = req.data + "";
      }
    },
  },
  async mounted() {
    await this.getSubreddit();
    await this.getSubredditPosts();
    await this.getIsModerator();
    await this.getIsIn();
  },
};
</script>

<style lang="scss" scoped></style>
