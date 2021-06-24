<template>
  <div class="login">
    <h2>Logowanie</h2>
    <form @submit.prevent>
      <input v-model="user.email" placeholder="Email" />
      <input type="password" v-model="user.password" placeholder="Hasło" />
      <button @click="doLogin" class="btn btn-primary">Login</button>
    </form>
    <h4 id="errorMessage" v-if="errorMessage">{{ errorMessage }}</h4>
  </div>
</template>

<script>
import router from "../router/index";
import { login } from "@/service/account";

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
    async doLogin() {
      const result = await login(this.user).catch((err) => err);

      if (result.status === 200) {
        const { id, email, isAuthenticated } = result.data;
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("isAuthenticated", isAuthenticated);

        this.$emit("showLogout");
        router.push("/home");
      } else {
        this.errorMessage = "Nieprawidłowe dane!";
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
