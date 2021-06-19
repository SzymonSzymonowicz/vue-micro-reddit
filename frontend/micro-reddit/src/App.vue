<template>
  <div class="wrapper">
    <Navbar
      :showLogoutAction="this.showLogoutAction"
      v-on:hideLogout="hideLogout"
    />
    <router-view v-on:showLogout="showLogout" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: block;
  height: 100%;
}
html,
body,
.wrapper {
  height: 100%;
}
</style>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  data() {
    return {
      showLogoutAction: false,
    };
  },
  components: {
    Navbar,
  },
  method: {
    showLogout() {
      this.showLogoutAction = true;
    },
    hideLogout() {
      this.showLogoutAction = false;
    },
  },
};
</script>
