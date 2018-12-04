<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <h3>{{ localizedMessage('aboutProject') }}</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <div class="card" style="min-height: 386px">
          <div class="card-body text-justify" v-html="about[appLanguage]" v-if="!showContactForm"></div>
          <form-component v-if="showContactForm"/>
        </div>
        <div class="text-center" style="margin-top: 0.5rem">
          <button class="btn btn-success" @click="showForm(1)">{{ localizedMessage('writeLetter') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ContactForm from './ContactForm.vue';

export default {
  computed: {
    ...mapState(['about', 'appLanguage', 'languages', 'showContactForm']),
    ...mapGetters(['localizedMessage']),
  },
  components: {
    'form-component': ContactForm,
  },
  methods: {
    showForm(key) {
      this.$store.commit('updateContactForm', { show: key });
    },
  },
};
</script>
