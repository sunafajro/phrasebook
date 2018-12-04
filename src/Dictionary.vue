<template>
  <div>
    <search-component/>
    <div>
      <div class="row" style="margin-bottom: 0.5rem">
        <div class="col-4 text-left">
          <button
            class="btn btn-sm"
            @click="prevPage"
            v-if="offset > 0"
          >{{ localizedMessage('previousPage') }}</button>
        </div>
        <div
          class="col-4 text-center"
        >Показано {{ count === 0 ? 0 : offset + 1 }} - {{ (offset + limit) >= count ? count : offset + limit }} из {{ count }}</div>
        <div class="col-4 text-right">
          <button
            class="btn btn-sm"
            @click="nextPage"
            v-if="(phrases.length + offset) < count"
          >{{ localizedMessage('nextPage') }}</button>
        </div>
      </div>
      <div
        :class="`alert alert-${status.type}`"
        v-if="Object.keys(status).length"
      >{{ localizedMessage('status') }}</div>
      <div
        class="card"
        style="margin-bottom: 0.5rem"
        :key="item.id"
        v-for="item in phrases"
        v-if="!loading && phrases.length"
      >
        <div class="card-body">
          <div class="text-block">
            <div style="font-size: 18px">
              <span style="color: #920505;font-size: 20px;font-weight: 600">{{ item.term }},</span>
              {{ " " }}
              <span style="color:#555">{{ item.transcription }},</span>
              {{ " " }}
              <span
                style="color: #0a6482; font-style: italic"
              >{{ item.translation }}</span>
            </div>
            <div style="style: font-size: 14px">
              <span :key="'examples-' + item.id + '-' + i" v-for="(e, i) in item.examples">
                <span style="color:#920505">{{ e[languages[0]] }}</span> —
                <span style="color:#0a6482">{{ e[languages[1]] }}</span>
                {{ ". " }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Search from './Search.vue';

export default {
  components: {
    'search-component': Search,
  },
  computed: {
    ...mapState([
      'count',
      'languages',
      'limit',
      'loading',
      'offset',
      'phrases',
      'status',
    ]),
    ...mapGetters(['localizedMessage']),
  },
  async created() {
    await this.getPhrases();
  },
  methods: {
    ...mapActions(['getPhrases', 'nextPage', 'prevPage']),
  },
};
</script>
