<template>
  <div class="container-fluid">
    <small>Количество фраз на сайте: <i>{{ phrasesCount }}</i></small>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button class="btn btn-info" type="button" @click="toggleLang">{{ lang }}</button>
      </div>
      <input class="form-control" type="text" v-model="searchText" @keyup.enter="submit" />
      <div class="input-group-append">
        <button class="btn btn-success" type="button" @click="submit">Go</button>
      </div>      
    </div>
    <div>
      <div :class="'alert alert-' + status.type" v-if="Object.keys(status).length">{{ status.text }}</div>
      <div class="card" style="margin-bottom: 0.5rem" :key="item.id" v-for="item in phrases" v-if="phrases.length">
        <div class="card-body">
          <b>{{ item.text.cv }}</b> - {{ item.text.ru }}
          <button type="button" class="btn btn-info tag">{{ item.tags }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  async created() {
    try {
      const { data } = await this.getPhrasesCount();
      this.phrasesCount = parseInt(data.count, 10);
    } catch (e) {
      this.status = {
        text: "Произошла ошибка.",
        type: "danger"
      };
    }
  },
  data() {
    return {
      lang: "cv",
      phrases: [],
      phrasesCount: 0,
      searchText: "",
      status: {
        text: "Наберите произвольный текст для поиска.",
        type: "info"
      }
    };
  },
  methods: {
    getPhrasesCount() {
      return axios.get("/phrases/count");
    },
    async submit() {
      if (this.searchText) {
        try {
          const { data } = await axios.get(
            `/phrases?q=${this.searchText}&lang=${this.lang}`
          );
          this.phrasesCount = data.count;
          if (Array.isArray(data.phrases)) {
            if (data.phrases.length) {
              this.phrases = data.phrases;
              this.status = {};
            } else {
              this.phrases = data.phrases;
              this.status = {
                text: "Совпадений не найдено.",
                type: "warning"
              };
            }
          } else {
            this.status = {
              text: "Произошла ошибка.",
              type: "danger"
            };
          }
        } catch (e) {
          this.status = {
            text: "Произошла ошибка.",
            type: "danger"
          };
        }
      }
    },
    toggleLang() {
      this.lang = this.lang === "cv" ? "ru" : "cv";
    }
  }
};
</script>

<style>
body {
  padding-top: 30px;
}
</style>
