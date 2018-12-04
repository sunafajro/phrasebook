<template>
  <footer class="footer">
    <div class="container">
      <span class="text-muted">{{ localizedMessage('footerLabel') }}</span>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['localizedMessage']),
  },
};
</script>
