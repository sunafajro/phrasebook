<template>
  <div class="card-body">
    <form @submit.prevent="onSubmit">
      <b>Ваше имя:</b>
      <input class="form-control form-control-sm" v-model="fromName" />
      <b>Э-почта или телефон:</b>
      <input class="form-control form-control-sm" v-model="fromEmail" />
      <b>Текст:</b>
      <textarea class="form-control form-control-sm" rows="6" v-model="emailText"></textarea>
      <div class="text-right" style="margin-top: 0.5rem">
      <vue-recaptcha
        ref="invisibleRecaptcha"
        @verify="onVerify"
        @expired="onExpired"
        size="invisible"
        :sitekey="sitekey">
      </vue-recaptcha>
      <button class="btn btn-info" :disabled="!fromName || !fromEmail || !emailText" type="submit">Отправить</button>
      </div>
    </form>
  </div>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
import { mapActions, mapState } from "vuex";

export default {
  components: { VueRecaptcha },
  computed: {
    ...mapState(["sitekey"]),
    fromEmail: {
      get() {
        return this.$store.state.fromEmail;
      },
      set(value) {
        this.$store.commit("updateContactForm", { fromEmail: value });
      }
    },
    fromName: {
      get() {
        return this.$store.state.fromName;
      },
      set(value) {
        this.$store.commit("updateContactForm", { fromName: value });
      }
    },
    emailText: {
      get() {
        return this.$store.state.emailText;
      },
      set(value) {
        this.$store.commit("updateContactForm", { emailText: value });
      }
    }
  },
  methods: {
    ...mapActions(["sendingEmail", "showNotification"]),
    async sendEmail() {
      this.sendingEmail();
      this.showNotification({
        message: "Ваш запрос успешно отправлен!",
        type: "success"
      });
    },
    onExpired() {
      // eslint-disable-next-line
      console.log("Expired");
    },
    onSubmit() {
      this.$refs.invisibleRecaptcha.execute();
    },
    onVerify(response) {
      // eslint-disable-next-line
      console.log("Verify: " + response);
      this.sendEmail();
    }
  }
};
</script>
