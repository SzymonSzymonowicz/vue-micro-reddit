<template>
  <div class="wrapper">
    <div id="nav">
      <div class="item">
        <router-link :to="{ path: '/' }">Home</router-link>
      </div>

      <div class="item" v-if="showLogoutAction">
        <router-link to="/" @click="logout" style="color: white"
          >Wyloguj</router-link
        >
      </div>
      <div class="nav" v-else>
        <div class="item">
          <router-link to="/register">Rejestracja</router-link>
        </div>
        <div class="item">
          <router-link to="/" @click="logout">Zaloguj</router-link>
        </div>
      </div>
    </div>
    <div>
      
    </div>
    <router-view @showLogout="showLogout" />
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
import axios from "axios";

export default {
  data() {
    return {
      showLogoutAction: true,
    };
  },
  methods: {
    showLogout() {
      this.showLogoutAction = true;
    },
    logout: async function logout() {
      const result = await axios.post(
        "http://localhost:5000/api/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (result.status === 200) {
        console.log("Logging out");

        // clear localStorage
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("isAuthenticated");
        this.showLogoutAction = false;
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
