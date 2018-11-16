<template>
  <div>
    <h2>{{ labels.pageTitle.text }}</h2>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["labels"])
};
</script>
