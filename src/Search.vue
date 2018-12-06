<template>
  <div>
    <small>
      {{ localizedMessage('termsCount') }}:
      <i>{{ totalCount }}</i>
    </small>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button
          class="btn btn-info dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >{{ current }}</button>
        <div class="dropdown-menu">
          <a
            class="dropdown-item"
            href="#"
            :key="'select-current-' + l"
            v-for="l in dropdownItems"
            @click="setSearchLanguage(l)"
            v-if="l !== current"
          >{{ l }}</a>
        </div>
      </div>
      <input class="form-control" type="text" v-model="search" @keyup.enter="startSearch">
      <div class="input-group-append">
        <button class="btn btn-success" type="button" @click="startSearch">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['appLanguage', 'current', 'languages', 'totalCount']),
    ...mapGetters(['localizedMessage']),
    dropdownItems() {
      if (this.appLanguage === 'cv') {
        return this.languages.filter(l => l !== 'cv');
      } else {
        return ['cv', this.appLanguage];
      }
    },
    search: {
      get() {
        return this.$store.state.search;
      },
      set(value) {
        this.$store.commit('updateSearch', value);
      },
    },
  },
  methods: {
    ...mapActions(['setSearchLanguage', 'startSearch']),
  },
};
</script>
