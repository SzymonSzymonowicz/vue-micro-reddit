<template>
  <div id="nav">
    <div class="item">
      <router-link to="/">Home</router-link>
    </div>
    <div class="item">
      <router-link to="/register">Rejestracja</router-link>
    </div>
    <div class="item">
      <router-link
        to="/"
        v-if="showLogoutAction"
        v-on:click="logout"
        style="color: white"
        >Wyloguj</router-link
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Navbar",
  props: {
    showLogoutAction: String,
  },
  computed: {},
  methods: {
    async logout() {
      const result = await axios.post("http://localhost:5000/api/logout", "", {
        withCredentials: true,
      });
      // const result = fetch("http://localhost:5000/api/logout", {
      //   method: "POST",
      //   credentials: true,
      // });

      if (result.status === 200) {
        console.log("Logging out");

        // clear localStorage
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("isAuthenticated");

        this.$emit("hideLogout");
      }
    },
  },
};
</script>

<style lang="scss">
#nav {
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: $orange;
  padding: 20px;
  color: $lightgray;

  .item {
    margin: 0px 20px;
  }

  .item:first-of-type {
    margin-right: auto;
  }

  a {
    font-weight: bold;
    color: white;
    text-decoration: none;
    &:hover {
      color: black;
      transition: ease-out 1s;
    }
    &:last-of-type {
      text-align: right;
    }
  }

  a.router-link-exact-active {
    color: black;
  }
}
</style>
