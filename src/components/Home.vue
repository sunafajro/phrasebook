<template>
  <div>
    <v-card :key="item.id" v-for="item in phrases" v-if="phrases.length">
      <v-card-text>
        <b>{{ item.text.cv }}</b> - 
        {{ item.text.ru }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    phrases: {
      required: true,
      type: Array
    }
  }
};
</script>
