import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./views/home";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("./views/login/index.vue"),
  },
  {
    path: "/",
    component: Home,
    redirect: '/home'
  },
  {
    path: "/home",
    component: Home,
    children: [
      {
        path: "",
        name: "index",
        component: () => import("./views/index"),
      },
    ],
  },
  {
    path: "/course",
    component: Home,
    children: [
      {
        path: "",
        name: "course",
        component: () => import("./views/course"),
      },
    ],
  },
  {
    path: "/classArea",
    component: Home,
    children: [
      {
        path: "/classArea/building",
        name: "building",
        component: () => import("./views/classroom/building"),
      },
      {
        path: "/classArea/room",
        name: "room",
        component: () => import("./views/classroom/room"),
      },
    ],
  },
  {
    path: "/setting",
    component: Home,
    children: [
      {
        path: "/setting/user",
        name: "user",
        component: () => import("./views/setting/user"),
      },
      {
        path: "/setting/menu",
        name: "menu",
        component: () => import("./views/setting/menu"),
      },
      {
        path: "/setting/role",
        name: "role",
        component: () => import("./views/setting/role"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
