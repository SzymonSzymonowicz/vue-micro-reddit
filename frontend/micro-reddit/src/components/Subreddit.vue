<template>
  <div class="card item" v-bind:style="{ 'background-color': bgColor }">
    <div class="card-header">{{ name }} #{{ id }}</div>
    <div class="card-body">
      <p class="card-text h4" v-if="isModerator">
        <i class="bi bi-award-fill"></i> Jesteś Moderatorem tego subreddita
      </p>
      <p class="card-text">{{ description }}</p>
      <div class="actions">
        <a to="/" v-if="isIn === 'false'" class="btn btn-primary" @click="join"
          >Dołącz</a
        >
        <router-link :to="{ path: `/r/${name}` }" class="btn btn-secondary"
          >Przeglądaj</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
// import router from "../router";
import { joinSubreddit } from "../service/subreddit";

export default {
  name: "Subreddit",
  data() {
    return {
      bgColor: "",
    };
  },
  props: {
    id: Number,
    name: String,
    description: String,
    isIn: String,
    isModerator: Boolean,
  },
  methods: {
    async join() {
      let req = await joinSubreddit(this.id);

      if (req.status === 200) {
        // maybe emit and update parent? or just router to subreddit
        this.$emit("updateParent");
        // router.push(`/r/${this.name}`);
      }
    },
    setColor() {
      this.bgColor = this.isIn === "true" ? "rgba(255,185,3,0.32)" : "";
    },
  },
  mounted() {
    this.setColor();
  },
  updated() {
    this.setColor();
  },
};
</script>

<style lang="scss" scoped>
.item {
  margin: 20px 0px;
  .actions {
    display: flex;
    justify-content: flex-end;
    a {
      margin-left: 20px;
    }
  }
}

a {
  text-align: right;
}
</style>
