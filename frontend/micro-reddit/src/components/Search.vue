<template>
  <div class="search">
    <div class="searchbar">
      <form @submit.prevent="searchSubreddits">
        <input v-model="searchValue" placeholder="Wyszukaj" />
        <select v-model="by">
          <option disabled value="">Wybierz opcję wyszukiwania</option>
          <option value="subTitle">Nazwa Subreddita</option>
          <option value="postContent">Treść Postu</option>
        </select>
        <a @click="searchSubreddits"><i class="bi bi-search"></i></a>
      </form>
    </div>
    <div v-if="by === 'subTitle'">
      <Subreddit
        v-for="sub in subreddits"
        :key="sub.id"
        :id="sub.id"
        :name="sub.name"
        :description="sub.description"
        :isIn="sub.isIn"
      />
    </div>
  </div>
</template>

<script>
import { searchSubredditsByName } from "../service/subreddit";
import Subreddit from "./Subreddit.vue";

export default {
  components: { Subreddit },
  name: "Serach",
  data() {
    return {
      by: "",
      searchValue: "",
      subreddits: [],
      posts: [],
    };
  },
  methods: {
    async searchSubreddits() {
      const req = await searchSubredditsByName(this.searchValue);
      console.log(req.data);
      console.log(this.searchValue);
      this.subreddits = req.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  min-height: calc(100% - 100px);
  // height: 100%;
}
.searchbar form {
  margin: 20px 0;
  height: 40px;
  display: flex;
  justify-content: center;
  i {
    font-size: 24px;
    &:hover {
      color: red;
      transition: 0.2s ease-in-out;
      cursor: pointer;
    }
  }
  * {
    margin: 0px 5px;
  }
  input:first-of-type {
    width: 50%;
  }
}
</style>
