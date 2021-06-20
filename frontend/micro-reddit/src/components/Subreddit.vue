<template>
  <div class="card item">
    <div class="card-header">{{ name }} #{{ id }}</div>
    <div class="card-body">
      <p class="card-text">{{ description }}</p>
      <div class="actions">
        <router-link to="/" v-if="isIn === 'true'" class="btn btn-primary"
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
  props: {
    id: Number,
    name: String,
    description: String,
    isIn: String,
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
