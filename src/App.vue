<template>
  <div class="container-fluid">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      lang: "cv",
      phrases: [],
      searchText: "",
      status: {
        text: "Наберите произвольный текст для поиска.",
        type: "info"
      }
    };
  },
  methods: {
    async submit() {
      if (this.searchText) {
        const { data } = await axios.get(
          `/phrases?q=${this.searchText}&lang=${this.lang}`
        );
        
        if (Array.isArray(data)) {
          if (data.length) {
            this.phrases = data;
            this.status = {};
          } else {
            this.phrases = data;
            this.status = {
              text: "Совпадений не найдено.",
              type: "warning"
            }
          }
        } else {
          this.status = {
            text: "Произошла ошибка.",
            type: "danger"
          } 
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
