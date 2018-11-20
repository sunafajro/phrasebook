<template>
  <div>
    <small>{{ labels.termsCount.text }}: <i>{{ totalCount }}</i></small>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button class="btn btn-info" type="button" @click="updateLanguage">{{ current }}</button>
      </div>
      <input class="form-control" type="text" v-model="search" @keyup.enter="startSearch" />
      <div class="input-group-append">
        <button class="btn btn-success" type="button" @click="startSearch"><i class="fas fa-search"></i></button>
      </div>      
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["current", "labels", "totalCount"]),
    search: {
      get() {
        return this.$store.state.search;
      },
      set(value) {
        this.$store.commit("updateSearch", value);
      }
    }
  },
  methods: {
    ...mapActions(["getPhrases", "startSearch", "toggleLang"]),
    ...mapMutations(["updateLanguage"])
  }
};
</script>
