<template>
  <div class="contentWrapper">
    <h1>{{ `Witaj na /r/ ${this?.$route.params.name}!` }}</h1>
    <Subreddit
      :id="info.id"
      :name="info.name"
      :description="info.description"
      :isIn="info.isIn"
      :isModerator="isModerator"
      :hideStepInto="true"
      @updateParent="getIsIn"
    />
    <PostForm :subredditId="info.id" />
    <div class="contentWrapper alignCenter">
      <Post v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script>
import {
  getSubredditByName,
  getSubredditPostsByName,
  isSubredditModerator,
  isLoggedUserInSubreddit,
} from "../service/subreddit";
import { parsePosts } from "../service/post";
import Post from "./Post.vue";
import Subreddit from "./Subreddit.vue";
import PostForm from "./PostForm.vue";

export default {
  components: { Subreddit, Post, PostForm },
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
        this.posts = parsePosts(req.data);
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
