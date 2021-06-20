<template>
  <div class="formView">
    <h1>Edytuj Subreddit</h1>
    <form @submit.prevent autocomplete="off">
      <input v-model="name" placeholder="Nazwa Subreddita" />
      <span class="errorMsg">{{ msg.name }}</span>

      <textarea v-model="description" placeholder="Description" />
      <span class="errorMsg">{{ msg.description }}</span>

      <div class="d-flex flex-row justify-content-between">
        <button @click="updateSubreddit" class="btn btn-primary h-100">
          Potwierdź
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { isErrorObjectNotEmpty } from "@/utils/validationUtils";
import {
  putSubreddit,
  checkUniqueSubredditName,
  getSubredditByName,
} from "../service/subreddit";
import router from "../router/index";

export default {
  name: "EditSubreddit",
  data() {
    return {
      id: "",
      name: "",
      prevName: "",
      description: "",
      msg: {},
    };
  },
  methods: {
    async updateSubreddit() {
      if (isErrorObjectNotEmpty(this.msg)) {
        console.log("Validation failed!");
        return;
      }

      let req = await putSubreddit(this.id, this.name, this.description);

      if (req.status === 200) {
        // this.$emit("updateParent");
        // this.$router.go(`/r/${this.name}`);
        // location.reload();
        // this.getSubreddit();
        router.push(`/r/${this.name}`);
      }
    },
    async getSubreddit() {
      let name = this.$route.params.name;
      let req = await getSubredditByName(name);
      if (req.status === 200) {
        const { name, description, id } = req.data;
        this.name = name;
        this.prevName = name;
        this.description = description;
        this.id = id;
      }
    },
  },
  watch: {
    async name(value) {
      this.name = value;

      if (value === this.prevName) {
        return;
      }

      if (value === "") {
        this.msg["name"] = "Wypełnij to pole";
        return;
      }

      let req = await checkUniqueSubredditName(value);

      this.msg["name"] = req.data ? "" : "Podana nazwa subreddita jest zajęta!";
    },
  },
  mounted() {
    this.getSubreddit();
  },
};
</script>
