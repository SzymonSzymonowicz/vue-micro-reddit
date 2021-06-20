<template>
  <div class="wrapper">
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
import axios from "axios";
import Subreddit from "./Subreddit.vue";
// axios.defaults.withCredentials = true;

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
      const result = await axios.get("http://localhost:5000/api/subreddits", {
        withCredentials: true,
      });
      this.subreddits = result.data;
    },
  },
  async mounted() {
    await this.getSubreddits();

    // const result = await fetch("http://localhost:5000/api/subreddit", {
    //   method: "POST",
    //   credentials: "include",
    // }).catch((err) => err);
    // const data = await result.json();
    // this.subreddits = data;
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  height: fit-content;
}
</style>
