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
        path: "/course/index",
        name: "course",
        component: () => import("./views/course/index"),
      },
      {
        path: "/course/type",
        name: "type",
        component: () => import("./views/course/type"),
      },
    ],
  },
  {
    path: "/schedule",
    component: Home,
    children: [
      {
        path: "/schedule/index",
        name: "schedule",
        component: () => import("./views/schedule/index"),
      },
      {
        path: "/schedule/list",
        name: "list",
        component: () => import("./views/schedule/list"),
      },
    ],
  },
  {
    path: "/people",
    component: Home,
    children: [
      {
        path: "/people/teacher",
        name: "teacher",
        component: () => import("./views/people/teacher"),
      },
      {
        path: "/people/student",
        name: "student",
        component: () => import("./views/people/student"),
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
    path: "/unit",
    component: Home,
    children: [
      {
        path: "/unit/college",
        name: "college",
        component: () => import("./views/unit/college"),
      },
      {
        path: "/unit/major",
        name: "major",
        component: () => import("./views/unit/major"),
      },
      {
        path: "/unit/class",
        name: "class",
        component: () => import("./views/unit/class"),
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
