<template>
  <div>
    <div :class="`alert alert-${status.type}`" v-if="!started">{{ status.text }}</div>
    <nav-component v-if="started" />
    <div class="container" style="padding-top: 64px;" v-if="started">
      <router-view />
    </div>
    <footer-component v-if="started"/>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Navigation from "./Navigation.vue";
import Footer from "./Footer.vue";

export default {
  components: {
    "nav-component": Navigation,
    "footer-component": Footer
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
