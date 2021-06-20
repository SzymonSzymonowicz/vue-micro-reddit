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

      <button @click="register" class="btn btn-primary">Utwórz konto</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import { isValidEmail, isErrorObjectNotEmpty } from "@/utils/validationUtils";
import { checkUniqueEmail } from "@/service/account";

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
    async "user.email"(value) {
      this.user.email = value;
      var res = isValidEmail(value);
      if (!res) {
        this.msg["email"] = "Podana wartość nie jest adresem email";
        return;
      }

      let res2 = await checkUniqueEmail(value);

      this.msg["email"] = res2.data ? "" : "Podany email jest już zajęty";
    },
    "user.confirmPassword"(value) {
      this.user.confirmPassword = value;

      if (this.user.confirmPassword !== this.user.password) {
        this.msg["confirmPassword"] = "Hasła się nie zgadzają";
      }
    },
    "user.password"(value) {
      this.user.password = value;

      if (this.user.password === "") {
        this.msg["password"] = "Wypełnij to pole";
      }
    },
    "user.nickname"(value) {
      this.user.nickname = value;

      if (this.user.nickname === "") {
        this.msg["nickname"] = "Wypełnij to pole";
      }
    },
  },
  methods: {
    async register() {
      if (isErrorObjectNotEmpty(this.msg)) {
        console.log("Validation failed!");
        return;
      }

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
