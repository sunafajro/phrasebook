import Vue from "vue";
import Router from "vue-router";
import Dictionary from "./Dictionary.vue";
import RandomPhrase from "./RandomPhrase.vue";
import About from "./About.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Dictionary",
      component: Dictionary
    },
    {
      path: "/random",
      name: "RandomPhrase",
      component: RandomPhrase
    },
    {
      path: "/about",
      name: "About",
      component: About
    }
  ]
});
