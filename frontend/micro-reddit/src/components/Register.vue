<template>
  <div class="login">
    <h1>Rejestracja</h1>
    <form @submit.prevent>
      <input v-model="user.email" placeholder="Email" />
      <span class="errorMsg">{{ msg.email }}</span>

      <input v-model="user.nickname" placeholder="Nick" />
      <span class="errorMsg">{{ msg.nickname }}</span>

      <input type="password" v-model="user.password" placeholder="Hasło" />
      <span class="errorMsg">{{ msg.password }}</span>

      <input
        type="password"
        v-model="user.confirmPassword"
        placeholder="Powtórz hasło"
      />
      <span class="errorMsg">{{ msg.confirmPassword }}</span>

      <button @click="register">Utwórz konto</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import { isValidEmail } from "@/utils/validationUtils";

export default {
  data() {
    return {
      user: {
        email: "",
        nickname: "",
        password: "",
        confirmPassword: "",
      },
      msg: {},
    };
  },
  watch: {
    async email(value) {
      // binding this to the data value in the email input
      this.user.email = value;
      var res = isValidEmail(value);
      if (!res) {
        this.msg["email"] = "Podana wartość nie jest adresem email";
        return;
      }

      let res2 = await axios
        .get(`http://localhost:5000/api/account/unique?email=${value}`, {
          withCredentials: true,
        })
        .catch((err) => console.log(err));

      this.msg["email"] = res2.data ? "" : "Podany email jest już zajęty";
    },
  },
  methods: {
    async register() {
      let res = await axios
        .post("http://localhost:5000/api/register", this.user)
        .catch((err) => err);

      if (res.status === 200) {
        router.push("/");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
  *:nth-child(2n) {
    margin-bottom: 20px;
  }
  input {
    text-align: center;
  }
}

div {
  h1 {
    color: $orange;
  }
}

.errorMsg {
  color: red;
}
</style>
