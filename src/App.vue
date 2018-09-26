<template>
  <div>
    <form @submit.prevent="onSubmit">
      <button type="button" @click.prevent="toggleLang">{{ lang }}</button>
      <input v-model="searchText" />
      <button type="submit">искать</button>      
    </form>
    <div>
      <div :key="item.id" v-for="item in phrases" v-if="phrases.length">
        <p>
          <b>{{ item.text.cv }}</b> - {{ item.text.ru }}
        </p>
      </div>
      <div v-if="!phrases.length">Нет фраз или ошибка в запросе...</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      lang: 'cv',
      phrases: [],
      searchText: ""
    };
  },
  methods: {
    async onSubmit() {
      if (this.searchText) {
        const { data } = await axios.get(`/phrases?q=${this.searchText}&lang=${this.lang}`);
        this.phrases = data;
      }
    },
    toggleLang() {
      this.lang = this.lang === 'cv' ? 'ru' : 'cv';
    }
  }
};
</script>
