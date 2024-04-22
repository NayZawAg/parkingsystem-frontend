<template>
  <v-avatar class="avatar-number avatar-number-position">
    {{ incrementedIndex }}
  </v-avatar>
</template>

<script>
export default {
  props: {
    index: Number,
  },
  computed: {
    incrementedIndex() {
      return this.index + 1;
    },
  },
};
</script>

<style scoped>
.avatar-number {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 21px !important;
  min-width: 21px !important;
  width: 21px !important;
  font-size: xx-small !important;
  border: 1px solid rgba(0, 0, 0, 0.87) !important;
}
.avatar-number-position {
  float: right !important;
}
</style>
