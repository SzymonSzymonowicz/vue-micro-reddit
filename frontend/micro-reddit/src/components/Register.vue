<template>
  <div class="formView">
    <h1>Rejestracja</h1>
    <form @submit.prevent autocomplete="off">
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
import router from "../router";
import { isValidEmail, isErrorObjectNotEmpty } from "@/utils/validationUtils";
import { checkUniqueEmail, registerAccount } from "@/service/account";

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

      if (value === "") {
        this.msg["email"] = "Wypełnij to pole";
        return;
      }

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
      this.msg["confirmPassword"] =
        this.user.confirmPassword !== this.user.password
          ? "Hasła się nie zgadzają"
          : "";
    },
    "user.password"(value) {
      this.user.password = value;

      this.msg["password"] =
        this.user.password === "" ? "Wypełnij to pole" : "";
    },
    "user.nickname"(value) {
      this.user.nickname = value;

      this.msg["nickname"] =
        this.user.nickname === "" ? "Wypełnij to pole" : "";
    },
  },
  methods: {
    async register() {
      if (isErrorObjectNotEmpty(this.msg)) {
        console.log("Validation failed!");
        return;
      }

      const res = await registerAccount(this.user);

      if (res.status === 200) {
        router.push("/");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  h1 {
    color: $orange;
  }
}
</style>
