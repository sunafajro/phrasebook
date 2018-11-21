<template>
  <footer class="footer">
    <div class="container">
      <span class="text-muted">{{ labels.footerLabel.text }}</span>
    </div>
  </footer>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["labels"])
  }
};
</script>
