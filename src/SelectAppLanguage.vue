<template>
  <div class="row align-items-center justify-content-center">
    <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6" style="text-align: center">
      <h3>{{ localizedMessage('selectAnLanguage') }}</h3>
      <button
        class="btn btn-default"
        style="margin-right: 0.5rem"
        type="button"
        v-for="l in languages"
        :key="'lang-' + l"
        @click="setAppLanguage(l)"
      >
        <img :src="'/img/' + l + '.png'" :alt="l" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState(['languages']),
    ...mapGetters(['localizedMessage']),
  },
  methods: {
    ...mapActions(['setAppLanguage']),
  },
};
</script>
