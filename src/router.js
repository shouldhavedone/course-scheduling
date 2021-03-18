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
    path: "/major",
    component: Home,
    children: [
      {
        path: "",
        name: "major",
        component: () => import("./views/major"),
      },
    ],
  },
  {
    path: "/college",
    component: Home,
    children: [
      {
        path: "",
        name: "college",
        component: () => import("./views/college"),
      },
    ],
  },
  {
    path: "/class",
    component: Home,
    children: [
      {
        path: "",
        name: "class",
        component: () => import("./views/class"),
      },
    ],
  },
  {
    path: "/semester",
    component: Home,
    children: [
      {
        path: "/semester/index",
        name: "semester",
        component: () => import("./views/semester/index"),
      },
      {
        path: "/semester/schoolyear",
        name: "schoolyear",
        component: () => import("./views/semester/schoolyear"),
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
