import { createRouter, createWebHistory } from "vue-router";
// import Home from "../components/Home.vue";
import Login from "../components/Login.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Register.vue"),
  },
  {
    path: "/subreddits",
    name: "SubredditsList",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../components/SubredditsList.vue"),
  },
  {
    path: "/account",
    name: "Account",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../components/Account.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("isAuthenticated")) {
      next();
    } else {
      next({
        path: "/",
      });
    }
  } else {
    next();
  }
});

export default router;
