<template>
  <div>
    <small>
      {{ localizedMessage('termsCount') }}:
      <i>{{ totalCount }}</i>
    </small>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button
          class="btn btn-info"
          type="button"
          @click="updateLanguage"
        >{{ current ? current : appLanguage }}</button>
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
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['appLanguage', 'current', 'totalCount']),
    ...mapGetters(['localizedMessage']),
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
    ...mapActions(['startSearch']),
    ...mapMutations(['updateLanguage']),
  },
};
</script>
