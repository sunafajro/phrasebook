<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-form ref="form" @submit.prevent="onSubmit" v-model="valid">
          <v-text-field
            append-icon="search"
            v-model="searchText"
            :rules="searchTextRules"
            :counter="30"
            label="Введите текст..."
            @click:append="onSubmit"
            required
          ></v-text-field>
        </v-form>
        <router-view :phrases="phrases"></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      phrases: [],
      searchText: "",
      searchTextRules: [
        v => !!v || "Необходимо указать текст для поиска!",
        v => v.length <= 30 || "Текст должен содежаь не более 30 знаков!"
      ],
      valid: false
    };
  },
  methods: {
    async onSubmit() {
      if (this.$refs.form.validate()) {
        const { data } = await axios.get(`/phrases?q=${this.searchText}`);
        this.phrases = data;
      }
    }
  }
};
</script>
