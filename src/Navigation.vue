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
          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >{{ appLanguage }}</a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a
                  class="dropdown-item"
                  href="#"
                  :key="l"
                  v-for="l in languages"
                  @click.prevent="setAppLanguage(l)"
                  v-if="l !== appLanguage"
                >{{ l }}</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['appLanguage', 'languages']),
    ...mapGetters(['localizedMessage']),
    currentRoute() {
      return this.$route.path;
    },
  },
  methods: {
    ...mapActions(['setAppLanguage']),
  },
};
</script>
