import Vue from 'vue';
import Vuex from 'vuex';
import { get as getVal } from 'lodash';
import axios from 'axios';
import Noty from 'noty';
import { getCSRF } from './utils';
import defaultLabels from './defaultLabels';

Vue.use(Vuex);
const storage = window.localStorage;

export default new Vuex.Store({
  state: {
    about: {},
    appLanguage: '',
    count: 0,
    current: '',
    emailText: '',
    fromEmail: '',
    fromName: '',
    labels: {
      errorOccurs: {
        text: { ...defaultLabels.errorOccurs },
        type: 'danger',
      },
      loadingData: {
        text: { ...defaultLabels.loadingData },
        type: 'info',
      },
    },
    languages: [],
    limit: 10,
    loading: false,
    offset: 0,
    phrases: [],
    randomPhrase: {},
    search: '',
    showContactForm: null,
    sitekey: '6LesQHwUAAAAAPQ9vmkR5zWSYS_cjvto0u7YZrK5',
    started: false,
    status: {
      text: { ...defaultLabels.loadingData },
      type: 'info',
    },
    totalCount: 0,
  },
  getters: {
    localizedMessage: state => code => {
      const lang = state.appLanguage ? state.appLanguage : 'en';
      if (code === 'status') {
        return getVal(state, 'status.text.' + lang, '');
      } else {
        return getVal(state, 'labels.' + code + '.text.' + lang, '');
      }
    },
  },
  mutations: {
    updateAppLanguage(state, language) {
      state.appLanguage = language;
    },
    updateAppState(state, data) {
      state.about = data.about;
      state.appLanguage = data.appLanguage;
      state.current = data.current;
      state.labels = data.labels;
      state.languages = data.languages;
      state.started = true;
      state.status = data.labels.typeSearchText;
      state.totalCount = data.totalCount;
    },
    updateContactForm(state, data) {
      if (data.hasOwnProperty('emailText')) {
        state.emailText = data.emailText;
      }
      if (data.hasOwnProperty('fromEmail')) {
        state.fromEmail = data.fromEmail;
      }
      if (data.hasOwnProperty('fromName')) {
        state.fromName = data.fromName;
      }
      if (data.hasOwnProperty('show')) {
        state.showContactForm =
          data.show !== state.showContactForm ? data.show : null;
        state.fromEmail = '';
        state.fromName = '';
        state.emailText = '';
      }
    },
    updateCount(state, data) {
      state.count = data;
    },
    updateLanguage(state, language) {
      state.current = language;
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
    },
  },
  actions: {
    async getAppState({ commit, state }) {
      try {
        const { data } = await axios.get('/state');
        if (storage) {
          // get app language from loalStorage if exists
          const appLanguage = await storage.getItem('appLanguage');
          if (appLanguage) {
            data.appLanguage = appLanguage;
            if (appLanguage === 'cv') {
              const index = data.languages.indexOf('cv');
              data.current =
                index === -1 || index > 0
                  ? data.languages[0]
                  : data.languages[index + 1];
            } else {
              data.current = appLanguage;
            }
          }
        }
        commit('updateAppState', data);
      } catch (e) {
        commit('updateStatus', state.labels.errorOccurs);
      }
    },
    async getPhrases({ commit, state }) {
      commit('updateLoading', true);
      try {
        let url = `/phrases`;
        let urlParams = [];
        if (state.current) {
          urlParams.push(`language=${state.current}`);
        }
        if (state.appLanguage) {
          urlParams.push(`dictionary=${state.appLanguage}`);
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
          url = url + '?' + urlParams.join('&');
        }
        const { data } = await axios.get(encodeURI(url));
        if (data.hasOwnProperty('count')) {
          commit('updateCount', parseInt(data.count, 10));
        }
        if (Array.isArray(data.phrases)) {
          if (data.phrases.length) {
            commit('updatePhrases', {
              loading: false,
              phrases: data.phrases,
              status: {},
            });
          } else {
            commit('updatePhrases', {
              loading: false,
              phrases: [],
              status: state.labels.notFound,
            });
          }
        } else {
          commit('updatePhrases', {
            loading: false,
            phrases: [],
            status: state.labels.typeSearchText,
          });
        }
      } catch (e) {
        commit('updatePhrases', {
          loading: false,
          phrases: [],
          status: state.labels.errorOccurs,
        });
      }
    },
    async getRandomPhrase({ commit, state }) {
      commit('updateLoading', true);
      try {
        let url = `/random`;
        let urlParams = [];
        if (state.appLanguage) {
          urlParams.push(`dictionary=${state.appLanguage}`);
        }
        if (urlParams.length) {
          url = url + '?' + urlParams.join('&');
        }
        const { data } = await axios.get(encodeURI(url));
        if (data.hasOwnProperty('card') && data.card) {
          commit('updateRandomPhrase', {
            loading: false,
            phrase: data.card,
            status: {},
          });
        } else {
          commit('updateRandomPhrase', {
            loading: false,
            phrase: {},
            status: state.labels.notFound,
          });
        }
      } catch (e) {
        commit('updateRandomPhrase', {
          loading: false,
          phrase: {},
          status: state.labels.errorOccurs,
        });
      }
    },
    async nextPage({ commit, dispatch, state }) {
      commit('updatePaging', {
        limit: state.limit,
        offset: state.offset + state.limit,
      });
      await dispatch('getPhrases');
    },
    async prevPage({ commit, dispatch, state }) {
      commit('updatePaging', {
        limit: state.limit,
        offset: state.offset - state.limit,
      });
      await dispatch('getPhrases');
    },
    async sendingEmail({ commit, dispatch, state }) {
      try {
        const { data: token } = await getCSRF();
        await axios.post(
          '/send-email',
          {
            fromEmail: state.fromEmail,
            fromName: state.fromName,
            emailText: state.emailText,
          },
          {
            credentials: 'same-origin',
            headers: {
              'CSRF-Token': token._csrf,
            },
          }
        );
        commit('updateContactForm', {
          emailText: null,
          fromEmail: null,
          fromName: null,
          show: null,
        });
        dispatch('showNotification', state.labels.emailSendedSuccess);
      } catch (e) {
        dispatch('showNotification', state.labels.emailSendedError);
      }
    },
    async setAppLanguage({ commit, dispatch, state }, payload) {
      if (storage) {
        await storage.setItem('appLanguage', payload);
      }
      commit('updateAppLanguage', payload);
      if (payload === 'cv') {
        const index = state.languages.indexOf('cv');
        commit(
          'updateLanguage',
          index === -1 || index > 0
            ? state.languages[0]
            : state.languages[index + 1]
        );
      } else {
        commit('updateLanguage', payload);
      }
      await dispatch('getPhrases');
    },
    setSearchLanguage({ commit, dispatch, state }, payload) {
      commit('updateLanguage', payload);
      if (state.appLanguage === 'cv') {
        dispatch('getPhrases');
      }
    },
    showNotification(context, payload) {
      new Noty({
        theme: 'bootstrap-v4',
        text: payload.text,
        timeout: 2000,
        type: payload.type,
      }).show();
    },
    async startSearch({ commit, dispatch, state }) {
      commit('updatePaging', {
        limit: state.limit,
        offset: 0,
      });
      await dispatch('getPhrases');
    },
  },
});
