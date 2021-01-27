import Vue from "vue";
import VueRouter from "vue-router";
import LeafletMap from "../views/LeafletMap.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: LeafletMap
  }
];

const router = new VueRouter({
  routes
});

export default router;
