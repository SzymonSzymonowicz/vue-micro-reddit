<template>
  <div>
    <h1>Rejestracja</h1>
    <h2 v-if="message">{{ message }}</h2>
    <form @submit.prevent>
      <input v-model="email" placeholder="Email" />
      <span v-if="msg.email">{{ msg.email }}</span>
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
// import { isValidEmail } from "@/utils/validationUtils";

export default {
  data() {
    return {
      email: "",
      user: {
        email: "",
        nickname: "",
        password: "",
        confirmPassword: "",
      },
      message: "",
      msg: {},
    };
  },
  watch: {
    async email(value) {
      // binding this to the data value in the email input
      this.email = value;
      // var res = isValidEmail(value);
      // if (res) {
      //   this.msg["email"] = res === true ? "" : res;
      // }

      let res2 = await axios
        .get(`http://localhost:5000/api/account/unique?email=${value}`, {
          withCredentials: true,
        })
        .catch((err) => console.log(err));

      console.log(res2);

      this.msg["email"] = res2.data ? "" : "Podany email jest już zajęty";
    },
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

<style lang="scss">
div {
  h1 {
    color: $orange;
  }
}
</style>
