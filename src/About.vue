<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <h3>О проекте</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6" style="margin-bottom: 0.5rem">
        <div class="card">
          <div class="card-body" v-html="about[languages[0]]"></div>
        </div>
        <div class="text-center" style="margin-top: 0.5rem">
          <button class="btn btn-success">Ҫыру ҫыр</button>
        </div>
      </div>
      <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <div class="card">
          <div class="card-body text-justify" v-html="about[languages[1]]"></div>
        </div>
        <div class="text-center" style="margin-top: 0.5rem">
          <button class="btn btn-success">Написать письмо</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["about", "languages"])
};
</script>
