<template>
  <div class="login">
    <h2>Logowanie</h2>
    <form @submit.prevent>
      <input v-model="user.email" placeholder="Email" />
      <input type="password" v-model="user.password" placeholder="Hasło" />
      <button @click="login">Login</button>
    </form>
    <h4 id="errorMessage" v-if="errorMessage">{{ errorMessage }}</h4>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router/index";

export default {
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      errorMessage: undefined,
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
        const { id, email, isAuthenticated } = result.data;
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);
        localStorage.setItem("isAuthenticated", isAuthenticated);

        this.$emit("showLogout");
        router.push("/test");
      } else {
        this.errorMessage = "Niepoprawne dane!";
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: calc(100% - 100px);
}

form {
  align-content: center;
  width: 25%;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  * {
    margin-bottom: 20px;
  }
  input {
    text-align: center;
  }
}

#errorMessage {
  color: red;
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
