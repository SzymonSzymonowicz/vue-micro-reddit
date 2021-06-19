<template>
  <div class="account">
    <h2>Edytuj Konto</h2>
    <form @submit.prevent>
      <input v-model="user.email" placeholder="Email" />
      <input v-model="user.nickname" placeholder="Nick" />
      <input type="password" v-model="user.password" placeholder="Hasło" />
      <input
        type="password"
        v-model="user.confirmPassword"
        placeholder="Powtórz hasło"
      />
      <button @click="updateAccount">Zapisz</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Account",
  data() {
    return {
      user: {
        email: "",
        nickname: "",
        oldPassword: "",
        newPassword: "",
      },
    };
  },
  async mounted() {
    const result = await axios.get("http://localhost:5000/api/account", {
      withCredentials: true,
    });
    this.user = result.data;

    // const result = await fetch("http://localhost:5000/api/subreddit", {
    //   method: "POST",
    //   credentials: "include",
    // }).catch((err) => err);
    // const data = await result.json();
    // this.subreddits = data;
  },
};
</script>

<style lang="scss" scoped></style>
