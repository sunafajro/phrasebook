<template>
  <div class="container-fluid">
    <small>Количество фраз на сайте: <i>{{ count }}</i></small>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button class="btn btn-info" type="button" @click="toggleLang">{{ language }}</button>
      </div>
      <input class="form-control" type="text" :value="search" @input="inputSearchText" @keyup.enter="getPhrases" />
      <div class="input-group-append">
        <button class="btn btn-success" type="button" @click="getPhrases"><i class="fas fa-search"></i></button>
      </div>      
    </div>
    <div>
      <div :class="'alert alert-' + status.type" v-if="Object.keys(status).length">{{ status.text }}</div>
      <div class="card" style="margin-bottom: 0.5rem" :key="item.id" v-for="item in phrases" v-if="phrases.length">
        <div class="card-body">
          <div class="text-block">
            <div style="font-size: 18px">
              <span style="color: #920505;font-size: 20px;font-weight: 600">{{ item.term }},</span>
              {{ " " }}
              <span style="color:#555">{{ item.transcription }},</span>
              {{ " " }}
              <span style="color: #0a6482; font-style: italic">{{ item.translation }}</span>
            </div>
            <div style="style: font-size: 14px">
              <span :key="'examples-' + item.id + '-' + i" v-for="(e, i) in item.examples">
                <span style="color:#920505">{{ e.cv }}</span> — <span style="color:#0a6482">{{ e.ru }}</span>{{ ". " }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: mapState([
    "language",
    "started",
    "loading",
    "phrases",
    "count",
    "search",
    "status"
  ]),
  created() {
    this.getPhrasesCount();
  },
  methods: {
    ...mapActions([
      "getPhrases",
      "getPhrasesCount",
      "setSearchText",
      "toggleLang"
    ]),
    inputSearchText(e) {
      this.setSearchText(e.target.value);
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
