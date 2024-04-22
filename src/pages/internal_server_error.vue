<template>
  <v-row
    class="text-center fill-height"
    style="height: calc(100vh - 58px);"
    align="center">
    <v-col>
      <h1 class="display-2 primary--text">
        500 Internal Server Error
      </h1>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'internal_server_error',
  layout: 'single',
  data() {
    return {
      title: 'Internal Server Error'
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
