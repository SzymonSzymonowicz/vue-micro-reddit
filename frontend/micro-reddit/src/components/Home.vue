<template>
  <div class="home">
    <Login msg="Welcome to Micro-reddit" />
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "./Login.vue";

export default {
  name: "Home",
  components: {
    Login,
  },
};
</script>
