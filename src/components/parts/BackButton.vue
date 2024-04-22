<template>
  <v-btn text @click="click">
    <v-icon left large> mdi-chevron-left </v-icon>
    Back
  </v-btn>
</template>

<script>
export default {
  methods: {
    click() {
      this.$emit('click');
    }
  }
}
</script>