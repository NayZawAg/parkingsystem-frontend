<template>
  <v-row
    class="text-center fill-height"
    style="height: calc(100vh - 58px);"
    align="center">
    <v-col>
      <h1 class="display-2 primary--text">
        404 Not Found
      </h1>
      <v-row>
        <div class="col-6 mx-auto">
          <p class="text-center mb-10">
            <v-icon class="icon-completion">mdi-check</v-icon>
          </p>
          <v-btn @click="$auth.logout()"
            large
            block
          >ログイン画面へ</v-btn>
        </div>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'not_found',
  layout: 'single',
  data() {
    return {
      title: 'Not Found'
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
