<template>
  <div>
    <h1>Rejestracja</h1>
    <h2 v-if="message">{{ message }}</h2>
    <form @submit.prevent>
      <input v-model="user.email" placeholder="Email" />
      <input v-model="user.nickname" placeholder="Nick" />
      <input type="password" v-model="user.password" placeholder="Hasło" />
      <input
        type="password"
        v-model="user.confirmPassword"
        placeholder="Powtórz hasło"
      />
      <button @click="register">Utwórz konto</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        email: "",
        nickname: "",
        password: "",
        confirmPassword: "",
      },
      message: "",
    };
  },
  methods: {
    async register() {
      let res = await axios
        .post("http://localhost:5000/api/register", this.user)
        .catch((err) => err);

      if (res.status === 200) {
        this.message = "Zarejestrowano";
      } else {
        this.message = "Wystąpił błąd";
      }
    },
  },
};
</script>
