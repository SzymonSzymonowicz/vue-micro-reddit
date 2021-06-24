<template>
  <div class="wrapper">
    <div id="nav">
      <div class="item">
        <span id="logo">Micro-Reddit</span>
      </div>
      <div class="nav" v-if="showLogoutAction">
        <div class="item">
          <router-link to="/home">Home</router-link>
        </div>
        <div class="item">
          <router-link to="/subreddits">Wszystkie subreddity</router-link>
        </div>
        <div class="item">
          <router-link to="/new-subreddit">Nowy subreddit</router-link>
        </div>
        <div class="item">
          <router-link to="/search"><i class="bi bi-search"></i></router-link>
        </div>
      </div>

      <!-- //subreddits -->

      <div class="nav growLeft" v-if="showLogoutAction">
        <div class="item">
          <router-link to="/account">Konto</router-link>
        </div>
        <div class="item">
          <router-link to="/" @click="logout">Wyloguj</router-link>
        </div>
      </div>
      <div class="nav growLeft" v-else>
        <div class="item">
          <router-link to="/register">Rejestracja</router-link>
        </div>
        <div class="item">
          <router-link to="/">Zaloguj</router-link>
        </div>
      </div>
    </div>
    <div></div>
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
import { logoutUser } from "./service/account";

export default {
  data() {
    return {
      showLogoutAction: localStorage.getItem("isAuthenticated"),
    };
  },
  methods: {
    showLogout() {
      this.showLogoutAction = localStorage.getItem("isAuthenticated");
    },
    logout: async function logout() {
      const result = await logoutUser().catch(() => {
        console.log("Session with backend got deleted.");
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("isAuthenticated");
        this.showLogoutAction = false;
      });
      const status = result.status;
      if (status === 200 || status === 401) {
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

  .growLeft {
    margin-left: auto;
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

#logo {
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 5px;
}
</style>
