<template>
  <header>
    
      <nav class="navbar navbar-expand-lg fixed-top navbar-light" style="background-color: #eeeeee">
        <div class="container">
        <span class="navbar-brand">{{ labels.pageTitle.text }}</span>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li :class="currentRoute === '/' ? 'nav-item active' : 'nav-item'">
              <router-link class="nav-link" to="/">Главная</router-link>
            </li>
            <li :class="currentRoute === '/random' ? 'nav-item active' : 'nav-item'">
              <router-link class="nav-link" to="/random">Случайная фраза</router-link>
            </li>
            <li :class="currentRoute === '/about' ? 'nav-item active' : 'nav-item'">
              <router-link class="nav-link" to="/about">О проекте</router-link>
            </li>
          </ul>
        </div>
        </div>
      </nav>
    
  </header>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["labels"]),
    currentRoute() {
      return this.$route.path;
    }
  }
};
</script>
