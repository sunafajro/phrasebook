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
      loadingData: {
        text: "Идет загрузка...",
        type: "info"
      },
      nextPage: {
        text: "Вперед"
      },
      notFound: {
        text: "Совпадений не найдено",
        type: "warning"
      },
      pageTitle: {
        text: "500 основных чувашских корней"
      },
      previousPage: {
        text: "Назад"
      },
      termsCount: {
        text: "Количество фраз на сайте"
      },
      typeSearchText: {
        text: "Наберите произвольный текст для поиска",
        type: "info"
      }
    },
    languages: ["cv", "ru"],
    limit: 10,
    loading: false,
    offset: 0,
    phrases: [],
    randomPhrase: {},
    search: "",
    started: false,
    status: {
      text: "Загрузка приложения",
      type: "info"
    },
    totalCount: 0
  },
  mutations: {
    updateAppState(state, data) {
      state.totalCount = data.totalCount;
      state.labels = data.labels;
      state.languages = data.languages;
      state.started = true;
      state.status = data.labels.typeSearchText;
    },
    updateCount(state, data) {
      state.count = data;
    },
    updateLanguage(state, data) {
      state.current = data;
    },
    updateLoading(state, data) {
      state.loading = data;
      state.status = data ? state.labels.loadingData : {};
    },
    updatePaging(state, data) {
      state.limit = data.limit;
      state.offset = data.offset;
    },
    updatePhrases(state, data) {
      state.loading = data.loading;
      state.phrases = data.phrases;
      state.status = data.status;
    },
    updateRandomPhrase(state, data) {
      state.loading = data.loading;
      state.randomPhrase = data.phrase;
      state.status = data.status;
    },
    updateSearch(state, data) {
      state.search = data;
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
      commit("updateLoading", true);
      try {
        let url = `/phrases`;
        let urlParams = [];
        if (state.current) {
          urlParams.push(`language=${state.current}`);
        }
        if (state.limit) {
          urlParams.push(`limit=${state.limit}`);
        }
        if (state.offset) {
          urlParams.push(`offset=${state.offset}`);
        }
        if (state.search) {
          urlParams.push(`search=${state.search}`);
        }
        if (urlParams.length) {
          url = url + "?" + urlParams.join("&");
        }
        const { data } = await axios.get(url);
        if (data.hasOwnProperty("count")) {
          commit("updateCount", parseInt(data.count, 10));
        }
        if (Array.isArray(data.phrases)) {
          if (data.phrases.length) {
            commit("updatePhrases", {
              loading: false,
              phrases: data.phrases,
              status: {}
            });
          } else {
            commit("updatePhrases", {
              loading: false,
              phrases: [],
              status: state.labels.notFound
            });
          }
        } else {
          commit("updatePhrases", {
            loading: false,
            phrases: [],
            status: state.labels.typeSearchText
          });
        }
      } catch (e) {
        commit("updatePhrases", {
          loading: false,
          phrases: [],
          status: state.labels.errorOccurs
        });
      }
    },
    async getRandomPhrase({ commit, state }) {
      commit("updateLoading", true);
      try {
        const { data } = await axios.get("/random");
        if (data.hasOwnProperty("card")) {
          commit("updateRandomPhrase", {
            loading: false,
            phrase: data.card,
            status: {}
          });
        } else {
          commit("updateRandomPhrase", {
            loading: false,
            phrase: {},
            status: state.labels.notFound
          });
        }
      } catch (e) {
        commit("updateRandomPhrase", {
          loading: false,
          phrase: {},
          status: state.labels.errorOccurs
        });
      }
    },
    async nextPage({ commit, dispatch, state }) {
      commit("updatePaging", {
        limit: state.limit,
        offset: state.offset + state.limit
      });
      await dispatch("getPhrases");
    },
    async prevPage({ commit, dispatch, state }) {
      commit("updatePaging", {
        limit: state.limit,
        offset: state.offset - state.limit
      });
      await dispatch("getPhrases");
    },
    async startSearch({ commit, dispatch, state }) {
      commit("updatePaging", {
        limit: state.limit,
        offset: 0
      });
      await dispatch("getPhrases");
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
