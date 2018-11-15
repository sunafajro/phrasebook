<template>
  <div class="container-fluid">
    <div :class="'alert alert-' + status.type" v-if="!started">{{ status.text }}</div>
    <div v-if="started">
      <header-component />
      <div>
        <div class="row" style="margin-bottom: 0.5rem">
          <div class="col-4 text-left"><button class="btn btn-sm" @click="prevPage" v-if="offset > 0">{{ labels.previousPage.text }}</button></div>
          <div class="col-4 text-center"> Показано {{ count === 0 ? 0 : offset + 1 }} - {{ (offset + limit) >= count ? count : offset + limit  }} из {{ count }}</div>
          <div class="col-4 text-right"><button class="btn btn-sm" @click="nextPage" v-if="(phrases.length + offset) < count">{{ labels.nextPage.text }}</button></div>
        </div>
        <div :class="'alert alert-' + status.type" v-if="Object.keys(status).length">{{ status.text }}</div>
        <div class="card" style="margin-bottom: 0.5rem" :key="item.id" v-for="item in phrases" v-if="!loading && phrases.length">
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
                  <span style="color:#920505">{{ e[languages[0]] }}</span> — <span style="color:#0a6482">{{ e[languages[1]] }}</span>{{ ". " }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Header from "./Header.vue";

export default {
  components: {
    "header-component": Header
  },
  computed: mapState([
    "count",
    "current",
    "labels",
    "languages",
    "limit",
    "loading",
    "offset",
    "phrases",
    "search",
    "started",
    "status"
  ]),
  async created() {
    await this.getAppState();
    await this.getPhrases();
  },
  methods: {
    ...mapActions(["getAppState", "getPhrases", "nextPage", "prevPage"])
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
