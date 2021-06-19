<template>
  <div class="home">
    <Login v-bind="$attrs" />
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "./Login.vue";

export default {
  name: "Home",
  inheritAttrs: false,
  components: {
    Login,
  },
};
</script>

<style lang="scss">
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
