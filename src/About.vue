<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <h3>О проекте</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6" style="margin-bottom: 0.5rem">
        <div class="card" style="min-height: 386px">
          <div class="card-body text-justify" v-html="about[languages[0]]" v-if="showContactForm === null || showContactForm === 1"></div>
          <form-component v-if="showContactForm === 0" />
        </div>
        <div class="text-center" style="margin-top: 0.5rem">
          <button class="btn btn-success" @click="showForm(0)">Ҫыру ҫыр</button>
        </div>
      </div>
      <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <div class="card" style="min-height: 386px">
          <div class="card-body text-justify" v-html="about[languages[1]]" v-if="showContactForm === null || showContactForm === 0"></div>
          <form-component v-if="showContactForm === 1" />
        </div>
        <div class="text-center" style="margin-top: 0.5rem">
          <button class="btn btn-success" @click="showForm(1)">Написать письмо</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ContactForm from "./ContactForm.vue";

export default {
  computed: mapState(["about", "languages", "showContactForm"]),
  components: {
    "form-component": ContactForm
  },
  methods: {
    showForm(key) {
      this.$store.commit("updateContactForm", { show: key });
    }
  }
};
</script>
