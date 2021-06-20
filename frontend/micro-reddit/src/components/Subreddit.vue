<template>
  <div class="card item" v-bind:style="{ 'background-color': bgColor }">
    <div class="card-header">{{ name }} #{{ id }}</div>
    <div class="card-body">
      <p class="card-text">{{ description }}</p>
      <div class="actions">
        <router-link to="/" v-if="isIn === 'false'" class="btn btn-primary"
          >Dołącz</router-link
        >
        <router-link to="/" class="btn btn-secondary">Przeglądaj</router-link>
      </div>
    </div>
  </div>
</template>

<script>
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
  },
  mounted() {
    this.bgColor = this.isIn === "true" ? "rgba(255,185,3,0.32)" : "";
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
