<template>
  <ol>
    <li v-for="subreddit in subreddits" v-bind:key="subreddit.id">
      {{ subreddit }}
    </li>
  </ol>
</template>

<script>
import axios from "axios";
// axios.defaults.withCredentials = true;

export default {
  name: "Subreddit",
  data() {
    return {
      subreddits: [],
    };
  },
  async mounted() {
    const result = await axios.post(
      "http://localhost:5000/api/subreddit",
      {},
      {
        withCredentials: true,
      }
    );
    this.subreddits = result.data;

    // const result = await fetch("http://localhost:5000/api/subreddit", {
    //   method: "POST",
    //   credentials: "include",
    // }).catch((err) => err);
    // const data = await result.json();
    // this.subreddits = data;
  },
};
</script>
