<template>
  <v-footer padless absolute class="hide-on-mobile global-footer">
    <v-row class="d-flex flex-row secondary lighten-2 ma-0">
      <v-spacer cols="2"></v-spacer>
      <v-col cols="8" class="text-center pa-0 pt-3">
        <NuxtLink to="/about" class="white--text text-decoration-none">
          三次市 駐車場混雑表示サービスについて
        </NuxtLink>
        <span class="white--text">　|　</span>
        <NuxtLink
          to="/privacypolicy_settings"
          class="white--text text-decoration-none"
        >
          プライバシー設定
        </NuxtLink>
      </v-col>
      <v-col cols="2" class="d-flex justify-end pa-1 pr-7">
        <a href="https://chat.withjorge.jp/jorge/003102" target="_blank">
          <v-img
            :src="hostImageUrl(`/icons/parkingService.png`)"
            width="90"
            contain
            class="white"
          ></v-img>
        </a>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import MediaStyle from "@/styles/globals.scss";
export default {
  components: {
    MediaStyle,
  },
};
</script>

<style scoped>
a.nuxt-link-exact-active {
  font-weight: normal;
}
.global-footer {
  z-index: 1 !important;
}
</style>
