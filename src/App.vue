<template>
  <div>
    <div :class="`alert alert-${status.type}`" v-if="!started">{{ status.text }}</div>
    <nav-component v-if="started" />
    <div class="container-fluid" style="padding-top: 64px;" v-if="started">
      <header-component />
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Header from "./Header.vue";
import Navigation from "./Navigation.vue";

export default {
  components: {
    "header-component": Header,
    "nav-component": Navigation
  },
  computed: mapState(["started", "status"]),
  async created() {
    await this.getAppState();
  },
  methods: {
    ...mapActions(["getAppState"])
  }
};
</script>
