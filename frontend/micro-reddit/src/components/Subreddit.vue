<template>
  <div class="card item" v-bind:style="{ 'background-color': bgColor }">
    <div class="card-header">{{ name }} #{{ id }}</div>
    <div class="card-body">
      <p class="card-text h4" v-if="isModerator">
        <i class="bi bi-award-fill"></i> Jesteś Moderatorem tego subreddita
      </p>
      <p class="card-text">{{ description }}</p>
      <div class="actions">
        <a v-if="isIn === 'false'" class="btn btn-primary mx-2" @click="join"
          >Dołącz</a
        >
        <router-link
          v-if="!hideStepInto"
          :to="{ path: `/r/${name}` }"
          class="btn btn-secondary"
          >Przeglądaj</router-link
        >
        <button @click="goToEdit" class="btn btn-primary" v-if="isModerator">
          Edytuj
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import { joinSubreddit } from "../service/subreddit";

export default {
  name: "Subreddit",
  data() {
    return {
      bgColor: "",
      showEditForm: false,
    };
  },
  props: {
    id: Number,
    name: String,
    description: String,
    isIn: String,
    isModerator: Boolean,
    hideStepInto: Boolean,
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
    controlEdit() {
      this.showEditForm = !this.showEditForm;
    },
    goToEdit() {
      router.push(`/edit-subreddit/${this.name}`);
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
