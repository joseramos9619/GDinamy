import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/respaldos" },
  {
    path: "/conexiones",
    name: "conexiones",
    component: () => import("@/components/conexiones/Index.vue"),
  },
  {
    path: "/respaldos",
    name: "respaldos",
    component: () => import("@/components/respaldos/Index.vue"),
  },
  {
    path: "/restauracion",
    name: "restauracion",
    component: () => import("@/components/restauracion/Index.vue"),
  },
  {
    path: "/historial",
    name: "historial",
    component: () => import("@/components/historial/Index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
