<template>
  <div>
    <div :class="`alert alert-${status.type}`" v-if="Object.keys(status).length">{{ status.text }}</div>
    <div class="jumbotron text-center" v-if="!loading">
      <h1 class="display-4">{{ randomPhrase[languages[0]] }}</h1>
      <h1 class="display-4">{{ showTranslation ? randomPhrase[languages[1]] : '&nbsp;' }}</h1>
      <div style="margin-top: 1rem">
        <button class="btn btn-success" style="margin-right: 1rem" @click="nextPhrase">{{ !showTranslation ? "Помню" : "Следующая" }}</button>
        <button class="btn btn-danger" :disabled="showTranslation" @click="displayTranslation">Не помню</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: mapState([
    "labels",
    "languages",
    "loading",
    "randomPhrase",
    "status"
  ]),
  data() {
    return {
      showTranslation: false
    };
  },
  async created() {
    await this.getRandomPhrase();
  },
  methods: {
    ...mapActions(["getRandomPhrase"]),
    displayTranslation() {
      this.showTranslation = true;
    },
    async nextPhrase() {
      this.showTranslation = false;
      await this.getRandomPhrase();
    }
  }
};
</script>
