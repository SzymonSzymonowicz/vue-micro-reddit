<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/register">Rejestracja</router-link>
  </div>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style lang="scss">
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
