<template>
  <v-app>
    {{ error.message }}
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
    }
  },
  head () {
    const title = this.error.statusText
    return {
      title
    }
  }
}
</script>

<style scoped>

