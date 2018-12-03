<template>
  <div class="row align-items-center">
    <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6" style="text-align: center">
      <button class="btn btn-default" style="margin-right: 0.5rem" type="button" v-for="l in languages" :key="'lang-' + l" @click="updateAppLanguage(l)"><img :src="'/img/' + l + '.png'" /></button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['appLanguage', 'languages']),
  },
  methods: {
    ...mapMutations(['updateAppLanguage']),
  },
};
</script>
