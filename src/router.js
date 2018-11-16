import Vue from "vue";
import Router from "vue-router";
import Dictionary from "./Dictionary.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Dictionary",
      component: Dictionary
    }
  ]
});
