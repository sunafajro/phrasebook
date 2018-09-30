<template>
  <div class="container-fluid">
    <small>Количество фраз на сайте: <i>{{ phrasesCount }}</i></small>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button class="btn btn-info" type="button" @click="toggleLang">{{ lang }}</button>
      </div>
      <input class="form-control" type="text" v-model="searchText" @keyup.enter="getPhrases()" />
      <div class="input-group-append">
        <button class="btn btn-success" type="button" @click="getPhrases"><i class="fas fa-search"></i></button>
      </div>      
    </div>
    <div>
      <div :class="'alert alert-' + status.type" v-if="Object.keys(status).length">{{ status.text }}</div>
      <div class="card" style="margin-bottom: 0.5rem" :key="item.id" v-for="item in phrases" v-if="phrases.length">
        <div class="card-body">
          <div class="text-block"><b>{{ item.text.cv }}</b> - {{ item.text.ru }}</div>
          <span class="badge badge-warning tag-custom-style" :key="`term-tag-${index}`" v-for="(tag, index) in item.tags" @click="getPhrases(tag)">{{ tag }}</span>
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
    async getPhrases(tag = null) {
      if (this.searchText || (tag && typeof tag === "string")) {
        let result;
        try {
          if (tag && typeof tag === "string") {
            result = await axios.get(`/phrases?tag=${tag}`);
            this.searchText = "";
          } else {
            result = await axios.get(
              `/phrases?q=${this.searchText}&lang=${this.lang}`
            );
          }
          if (
            result.hasOwnProperty("data") &&
            result.data.hasOwnProperty("count")
          ) {
            this.phrasesCount = result.data.count;
          }
          if (
            result.hasOwnProperty("data") &&
            result.data.hasOwnProperty("phrases") &
              Array.isArray(result.data.phrases)
          ) {
            if (result.data.phrases.length) {
              this.phrases = result.data.phrases;
              this.status = {};
            } else {
              this.phrases = result.data.phrases;
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
.tag-custom-style {
  cursor: pointer;
  margin-right: 0.5rem;
}
</style>
