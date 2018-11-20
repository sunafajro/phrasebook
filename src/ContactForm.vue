<template>
  <div class="card-body">
    <b>Ваше имя:</b>
    <input class="form-control form-control-sm" v-model="fromName" />
    <b>Э-почта или телефон:</b>
    <input class="form-control form-control-sm" v-model="fromEmail" />
    <b>Текст:</b>
    <textarea class="form-control form-control-sm" rows="6" v-model="emailText"></textarea>
  </div>
</template>

<script>
export default {
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
  }
};
</script>
