<template>
  <div class="contentWrapper">
    <Subreddit
      v-for="subreddit in subreddits"
      :key="subreddit.id"
      :id="subreddit.id"
      :name="subreddit.name"
      :description="subreddit.description"
      :isIn="subreddit.isIn"
      @updateParent="getSubreddits"
    />
  </div>
</template>

<script>
import { getAllSubreddits } from "../service/subreddit";
import Subreddit from "./Subreddit.vue";

export default {
  components: { Subreddit },
  name: "SubredditsList",
  data() {
    return {
      subreddits: [],
    };
  },
  methods: {
    async getSubreddits() {
      const result = await getAllSubreddits();
      this.subreddits = result.data;
    },
  },
  async mounted() {
    await this.getSubreddits();
  },
};
</script>

<style lang="scss" scoped></style>
