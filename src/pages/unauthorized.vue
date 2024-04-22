<template>
  <v-row
    class="text-center fill-height"
    style="height: calc(100vh - 58px);"
    align="center">
    <v-col>
      <h1 class="display-2 primary--text">
        401 Unauthorized
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
  name: 'unauthorized',
  layout: 'single',
  data() {
    return {
      title: 'Unauthorized'
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
