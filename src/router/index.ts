import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("~/views/home/index.vue"),
  },
  {
    path: "/exporter",
    component: () => import("~/views/exporter/index.vue"),
  },
  {
    path: "/404",
    name: "ErrorPage",
    component: () => import("~/views/errorPages/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const index = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
index.beforeEach(() => {
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
});

index.afterEach(() => {
  NProgress.done();
});

export default index;
