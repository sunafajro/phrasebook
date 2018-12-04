<template>
  <div>
    <div :class="`alert alert-${status.type}`" v-if="!started">{{ localizedMessage('status') }}</div>
    <nav-component v-if="started && appLanguage"/>
    <div class="container" style="padding-top: 64px;" v-if="started">
      <select-app-language v-if="!appLanguage"/>
      <router-view v-if="appLanguage"/>
    </div>
    <footer-component v-if="started"/>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Footer from './Footer.vue';
import Navigation from './Navigation.vue';
import SelectAppLanguage from './SelectAppLanguage.vue';

export default {
  components: {
    'footer-component': Footer,
    'nav-component': Navigation,
    'select-app-language': SelectAppLanguage,
  },
  computed: {
    ...mapState(['appLanguage', 'started', 'status']),
    ...mapGetters(['localizedMessage']),
  },
  async created() {
    await this.getAppState();
  },
  methods: {
    ...mapActions(['getAppState']),
  },
};
</script>
