import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      requiresAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Home.vue"),
  },
  {
    path: "/register",
    name: "Register",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../components/RegisterAccount.vue"
      ),
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
    component: () => import("../components/EditAccount.vue"),
  },
  {
    path: "/r/:name",
    name: "SubredditView",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../components/SubredditView.vue"),
  },
  {
    path: "/new-subreddit",
    name: "SubredditForm",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../components/SubredditForm.vue"),
  },
  {
    path: "/edit-subreddit/:name",
    name: "EditSubreddit",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../components/EditSubreddit.vue"),
  },
  {
    path: "/search",
    name: "Search",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../components/Search.vue"),
  },
  {
    path: "/post/:id",
    name: "PostView",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../components/PostView.vue"),
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
