<template>
  <div class="formView">
    <h1>Nowy Subreddit</h1>
    <form @submit.prevent autocomplete="off">
      <input v-model="name" placeholder="Nazwa Subreddita" />
      <span class="errorMsg">{{ msg.name }}</span>

      <textarea v-model="description" placeholder="Opis" />
      <span class="errorMsg">{{ msg.description }}</span>

      <button @click="createSubreddit" class="btn btn-primary">
        Utwórz Subreddit
      </button>
    </form>
  </div>
</template>

<script>
import router from "../router";
import { isErrorObjectNotEmpty } from "@/utils/validationUtils";
import { postSubreddit, checkUniqueSubredditName } from "../service/subreddit";

export default {
  data() {
    return {
      name: "",
      description: "",
      msg: {},
    };
  },
  methods: {
    async createSubreddit() {
      if (isErrorObjectNotEmpty(this.msg)) {
        console.log("Validation failed!");
        return;
      }

      let req = await postSubreddit(this.name, this.description);

      if (req.status === 200) {
        router.push(`/r/${this.name}`);
      }
    },
  },
  watch: {
    async name(value) {
      this.name = value;

      if (value === "") {
        this.msg["name"] = "Wypełnij to pole";
        return;
      }

      let req = await checkUniqueSubredditName(value);

      this.msg["name"] = req.data ? "" : "Podana nazwa subreddita jest zajęta!";
    },
  },
};
</script>
