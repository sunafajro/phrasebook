<template>
  <div class="card-body">
    <form @submit.prevent="onSubmit">
      <b>{{ localizedMessage('yourName') }}:</b>
      <input class="form-control form-control-sm" v-model="fromName">
      <b>{{ localizedMessage('emailOrPhone') }}:</b>
      <input class="form-control form-control-sm" v-model="fromEmail">
      <b>{{ localizedMessage('letterText') }}:</b>
      <textarea class="form-control form-control-sm" rows="6" v-model="emailText"></textarea>
      <div class="text-right" style="margin-top: 0.5rem">
        <vue-recaptcha ref="recaptcha" @verify="onVerify" @expired="onExpired" :sitekey="sitekey"></vue-recaptcha>
        <button
          class="btn btn-info"
          :disabled="!fromName || !fromEmail || !emailText || !verified"
          type="submit"
        >{{ localizedMessage('sendEmail') }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  components: { VueRecaptcha },
  computed: {
    ...mapState(['sitekey']),
    ...mapGetters(['localizedMessage']),
    fromEmail: {
      get() {
        return this.$store.state.fromEmail;
      },
      set(value) {
        this.$store.commit('updateContactForm', { fromEmail: value });
      },
    },
    fromName: {
      get() {
        return this.$store.state.fromName;
      },
      set(value) {
        this.$store.commit('updateContactForm', { fromName: value });
      },
    },
    emailText: {
      get() {
        return this.$store.state.emailText;
      },
      set(value) {
        this.$store.commit('updateContactForm', { emailText: value });
      },
    },
  },
  data() {
    return {
      responseToken: '',
      verified: false,
    };
  },
  methods: {
    ...mapActions(['sendingEmail']),
    onExpired() {
      this.$refs.recaptcha.reset();
    },
    onSubmit() {
      this.sendingEmail(this.responseToken);
      this.verified = false;
      this.responseToken = '';
      this.$refs.recaptcha.reset();
    },
    onVerify(e) {
      // eslint-disable-next-line
      this.responseToken = e;
      this.verified = true;
    },
  },
};
</script>
