
<template>
  <div>
    <h2>{{ labels.pageTitle.text }}</h2>
    <small>{{ labels.termsCount.text }}: <i>{{ totalCount }}</i></small>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button class="btn btn-info" type="button" @click="toggleLang">{{ current }}</button>
      </div>
      <input class="form-control" type="text" :value="search" @input="inputSearchText" @keyup.enter="startSearch" />
      <div class="input-group-append">
        <button class="btn btn-success" type="button" @click="startSearch"><i class="fas fa-search"></i></button>
      </div>      
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: mapState(["current", "labels", "search", "totalCount"]),
  methods: {
    ...mapActions(["getPhrases", "setSearchText", "startSearch", "toggleLang"]),
    inputSearchText(e) {
      this.setSearchText(e.target.value);
    }
  }
};
</script>
