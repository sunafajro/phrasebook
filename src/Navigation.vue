<template>
  <header>
    <nav class="navbar navbar-expand-lg fixed-top navbar-light" style="background-color: #eeeeee">
      <div class="container">
        <span class="navbar-brand">{{ localizedMessage('pageTitle') }}</span>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li :class="currentRoute === '/' ? 'nav-item active' : 'nav-item'">
              <router-link class="nav-link" to="/">{{ localizedMessage('homePage') }}</router-link>
            </li>
            <li :class="currentRoute === '/random' ? 'nav-item active' : 'nav-item'">
              <router-link class="nav-link" to="/random">{{ localizedMessage('randomPhrase') }}</router-link>
            </li>
            <li :class="currentRoute === '/about' ? 'nav-item active' : 'nav-item'">
              <router-link class="nav-link" to="/about">{{ localizedMessage('aboutProject') }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['localizedMessage']),
    currentRoute() {
      return this.$route.path;
    },
  },
};
</script>
