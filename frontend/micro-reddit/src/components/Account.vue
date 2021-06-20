<template>
  <div class="formView">
    <h2>Edytuj Konto</h2>
    <form @submit.prevent autocomplete="off">
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

      <button @click="updateAccount" class="btn btn-primary">Zapisz</button>
    </form>
    <span v-if="message">{{ message }}</span>
  </div>
</template>

<script>
import axios from "axios";
import { isErrorObjectNotEmpty } from "@/utils/validationUtils";
import { updateAccount } from "@/service/account";

export default {
  name: "Account",
  data() {
    return {
      user: {
        nickname: "",
        password: "",
        confirmPassword: "",
      },
      msg: {},
      message: "",
    };
  },
  async mounted() {
    const result = await axios.get("http://localhost:5000/api/account", {
      withCredentials: true,
    });

    const { nickname } = result.data;

    this.user = { nickname };
  },
  watch: {
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
    async updateAccount() {
      if (isErrorObjectNotEmpty(this.msg)) {
        console.log("Validation failed!");
        return;
      }

      let res = await updateAccount(this.user).catch((err) => err);

      if (res.status === 200) {
        this.message = "Pomyślna edycja";
        setTimeout(() => {
          this.message = "";
        }, 3000);
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
