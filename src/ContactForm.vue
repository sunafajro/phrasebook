<template>
  <div class="card-body">
    <b>Ваше имя:</b>
    <input class="form-control form-control-sm" v-model="fromName" />
    <b>Э-почта или телефон:</b>
    <input class="form-control form-control-sm" v-model="fromEmail" />
    <b>Текст:</b>
    <textarea class="form-control form-control-sm" rows="6" v-model="emailText"></textarea>
    <div class="text-right" style="margin-top: 0.5rem">
      <vue-recaptcha sitekey="6LesQHwUAAAAAPQ9vmkR5zWSYS_cjvto0u7YZrK5">
        <button class="btn btn-info" :disabled="!fromName || !fromEmail || !emailText" @click="sendEmail">Отправить</button>
      </vue-recaptcha>
    </div>
  </div>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
import { mapActions } from "vuex";

export default {
  components: { VueRecaptcha },
  computed: {
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
    ...mapActions(["showNotification"]),
    sendEmail() {
      // eslint-disable-next-line
      console.log("sended!");
      this.showNotification({
        message: "Ваш запрос успешно отправлен!",
        type: "success"
      });
      this.$store.commit("updateContactForm", {
        emailText: null,
        fromEmail: null,
        fromName: null,
        show: null
      });
    }
  }
};
</script>
