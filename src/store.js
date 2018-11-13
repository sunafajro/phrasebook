import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    started: true,
    labels: {},
    language: "cv",
    loading: false,
    phrases: [],
    count: 0,
    search: "",
    status: {}
  },
  mutations: {
    updateCount(state, data) {
      state.count = data;
    },
    updateLanguage(state, data) {
      state.language = data;
    },
    updatePhrases(state, data) {
      state.phrases = data;
    },
    updateSearch(state, data) {
      state.search = data;
    },
    updateStatus(state, data) {
      state.status = data;
    }
  },
  actions: {
    async getPhrases({ commit, state }) {
      try {
        const { data } = await axios.get(
          `/phrases?q=${state.search}&lang=${state.language}`
        );
        if (data.hasOwnProperty("count")) {
          commit("updateCount", parseInt(data.count, 10));
        }
        if (data.phrases.length) {
          commit("updatePhrases", data.phrases);
          commit("updateStatus", {});
        } else {
          commit("updatePhrases", []);
          commit("updateStatus", {
            text: state.labels.notFound,
            type: "warning"
          });
        }
      } catch (e) {
        commit("updatePhrases", []);
        commit("updateStatus", {
          text: state.labels.errorOccurs,
          type: "danger"
        });
      }
    },
    async getPhrasesCount({ commit, state }) {
      try {
        const { data } = await axios.get("/phrases/count");
        commit("updateCount", parseInt(data.count, 10));
      } catch (e) {
        commit("updateStatus", {
          text: state.labels.errorOccurs,
          type: "danger"
        });
      }
    },
    setSearchText({ commit }, payload) {
      commit("updateSearch", payload);
    },
    toggleLang({ commit, state }) {
      commit("updateLanguage", state.language === "cv" ? "ru" : "cv");
    }
  }
});
