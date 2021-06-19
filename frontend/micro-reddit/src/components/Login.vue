<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>{{ welcome }}</h2>
    <form @submit.prevent>
      <input v-model="user.email" placeholder="Email" />
      <input type="password" v-model="user.password" placeholder="Hasło" />
      <button @click="login">Login</button>
    </form>
    <p>Message is: {{ user }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  props: {
    msg: String,
  },
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      welcome: "Have fun",
    };
  },
  methods: {
    async login() {
      const result = await axios
        .post("http://localhost:5000/api/login", this.user, {
          withCredentials: true,
        })
        .catch((err) => err);

      if (result.status === 200) {
        this.welcome = "Logged in";

        const { id, email, isAuthenticated } = result.data;
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("isAuthenticated", isAuthenticated);
      } else {
        this.welcome = "Bad credentials!";
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
