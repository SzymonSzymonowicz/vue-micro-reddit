import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const io = require("socket.io-client");
const con = io();

const app = createApp(App).provide("io", con).use(router).mount("#app");
// const app = createApp(App).use(router).mount("#app");
// app.config.globalProperties.$io = con;




