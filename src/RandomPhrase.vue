<template>
  <div>
    <div
      :class="`alert alert-${status.type}`"
      v-if="Object.keys(status).length"
    >{{ localizedMessage('status') }}</div>
    <div class="jumbotron text-center" v-if="!loading && !Object.keys(status).length">
      <h1 class="display-4">{{ randomPhrase['cv'] }}</h1>
      <h1 class="display-4">{{ showTranslation ? randomPhrase[phraseLanguage] : '...' }}</h1>
      <input
        :class="valid === '' ? 'form-control' : valid === true ? 'form-control is-valid' : 'form-control is-invalid'"
        @keyup.enter="checkInput"
        v-model="text"
        v-if="checkTranslation"
      >
      <div style="margin-top: 1rem">
        <button
          :class="!checkTranslation ? 'btn btn-info' : 'btn btn-warning'"
          :disabled="!checkTranslation && showTranslation"
          style="margin-right: 1rem"
          @click="checkInput"
        >{{ !checkTranslation ? localizedMessage("rememberPhrase") : localizedMessage("checkPhrase") }}</button>
        <button
          class="btn btn-danger"
          :disabled="checkTranslation || showTranslation"
          style="margin-right: 1rem"
          @click="displayTranslation"
        >{{ localizedMessage("forgetPhrase") }}</button>
        <button
          class="btn btn-success"
          style="margin-right: 1rem"
          @click="nextPhrase"
          v-if="showTranslation || checkTranslation"
        >{{ localizedMessage('nextPage') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['appLanguage', 'loading', 'randomPhrase', 'status']),
    ...mapGetters(['localizedMessage']),
    phraseLanguage() {
      if (this.randomPhrase) {
        const langs = Object.keys(this.randomPhrase);
        return langs.filter(l => l != 'cv')[0];
      }
      return this.appLanguage;
    },
  },
  data() {
    return {
      checkTranslation: false,
      showTranslation: false,
      text: '',
      valid: '',
    };
  },
  async created() {
    await this.getRandomPhrase();
  },
  methods: {
    ...mapActions(['getRandomPhrase']),
    displayTranslation() {
      this.showTranslation = true;
    },
    async nextPhrase() {
      this.showTranslation = false;
      this.checkTranslation = false;
      this.valid = '';
      await this.getRandomPhrase();
    },
    checkInput() {
      if (!this.checkTranslation) {
        this.checkTranslation = true;
      } else {
        if (this.randomPhrase[this.phraseLanguage] === this.text) {
          this.valid = true;
        } else {
          this.valid = false;
        }
        this.displayTranslation();
      }
    },
  },
};
</script>
