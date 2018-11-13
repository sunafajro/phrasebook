import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    current: "cv",
    labels: {
      errorOccurs: {
        text: "Произошла ошибка",
        type: "danger"
      },
      notFound: {
        text: "Совпадений не найдено",
        type: "warning"
      },
      pageTitle: "500 основных чувашских корней",
      termsCount: "Количество фраз на сайте",
      typeSearchText: {
        text: "Наберите произвольный текст для поиска",
        type: "info"
      }
    },
    languages: ["cv", "ru"],
    loading: false,
    phrases: [],
    search: "",
    started: false,
    status: {
      text: "Загрузка приложения",
      type: "info"
    }
  },
  mutations: {
    updateCount(state, data) {
      state.count = data;
    },
    updateLanguage(state, data) {
      state.current = data;
    },
    updatePhrases(state, data) {
      state.phrases = data;
    },
    updateSearch(state, data) {
      state.search = data;
    },
    updateAppState(state, data) {
      state.count = data.count;
      state.labels = data.labels;
      state.languages = data.languages;
      state.started = true;
      state.status = data.labels.typeSearchText;
    },
    updateStatus(state, { text, type }) {
      state.status = { text, type };
    }
  },
  actions: {
    async getAppState({ commit, state }) {
      try {
        const { data } = await axios.get("/state");
        commit("updateAppState", data);
      } catch (e) {
        commit("updateStatus", state.labels.errorOccurs);
      }
    },
    async getPhrases({ commit, state }) {
      try {
        const { data } = await axios.get(
          `/phrases?q=${state.search}&lang=${state.current}`
        );
        if (data.hasOwnProperty("count")) {
          commit("updateCount", parseInt(data.count, 10));
        }
        if (Array.isArray(data.phrases)) {
          if (data.phrases.length) {
            commit("updatePhrases", data.phrases);
            commit("updateStatus", {});
          } else {
            commit("updatePhrases", []);
            commit("updateStatus", state.labels.notFound);
          }
        } else {
          commit("updatePhrases", []);
          commit("updateStatus", state.labels.typeSearchText);
        }
      } catch (e) {
        commit("updatePhrases", []);
        commit("updateStatus", state.labels.errorOccurs);
      }
    },
    setSearchText({ commit }, payload) {
      commit("updateSearch", payload);
    },
    toggleLang({ commit, state }) {
      const i = state.languages.indexOf(state.current);
      commit(
        "updateLanguage",
        i === 0 ? state.languages[1] : state.languages[0]
      );
    }
  }
});
