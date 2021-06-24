<template>
  <div class="search">
    <div class="searchbar">
      <form @submit.prevent="searchSubreddits">
        <input
          v-model="searchValue"
          v-on:change.capture="search"
          placeholder="Wyszukaj"
        />
        <select v-model="by">
          <option disabled value="">Wybierz opcję wyszukiwania</option>
          <option value="subTitle">Nazwa Subreddita</option>
          <option value="postContent">Treść Postu</option>
        </select>
        <a @click="search"><i class="bi bi-search"></i></a>
      </form>
    </div>
    <div class="result">
      <div v-if="by === 'subTitle'" class="subs">
        <Subreddit
          v-for="sub in subreddits"
          :key="sub.id"
          :id="sub.id"
          :name="sub.name"
          :description="sub.description"
          :isIn="sub.isIn"
        />
      </div>
      <div v-if="by === 'postContent'">
        <Post v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>
  </div>
</template>

<script>
import { searchSubredditsByName } from "../service/subreddit";
import { searchPostsByContent, parsePosts } from "../service/post";
import Subreddit from "./Subreddit.vue";
import Post from "./Post.vue";

export default {
  components: { Subreddit, Post },
  name: "Serach",
  data() {
    return {
      by: "",
      searchValue: "",
      subreddits: [],
      posts: [],
    };
  },
  watch: {
    by(value) {
      this.by = value;
      if (this.by === "subTitle") {
        this.posts = [];
        return;
      } else if (this.by === "postContent") {
        this.subreddits = [];
        return;
      }
    },
  },
  methods: {
    async searchSubreddits() {
      const req = await searchSubredditsByName(this.searchValue);
      this.subreddits = req.data;
    },
    async searchPosts() {
      const req = await searchPostsByContent(this.searchValue);
      this.posts = parsePosts(req.data);
    },
    search() {
      if (this.by === "subTitle") {
        this.searchSubreddits();
        return;
      } else if (this.by === "postContent") {
        this.searchPosts();
        return;
      }

      return;
    },
  },
};
</script>

<style lang="scss">
.search {
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 100px);
  width: 100%;
  // height: 100%;
}
.result {
  // for some reason this is the only working thing to center results
  text-align: -webkit-center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .subs {
    width: 80%;
  }
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
