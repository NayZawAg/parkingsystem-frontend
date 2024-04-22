<template>
  <v-footer absolute v-if="initialCookie" class="banner-bg v-footer-cookie">
    <v-row class="ma-0">
      <v-spacer cols="1"></v-spacer>
      <v-col cols="7" sm="8" class="pa-0 pt-3 banner-txt">
        <p class="hide-on-mobile">
          このサイトでは、ユーザーの利用状況の把握、及び利便性の向上を目的としてCookieを使用しています。同意ボタンをクリックすると、
          ユーザーはこのサイトでのCookieの使用に同意したことになります。詳細については、「<NuxtLink
            to="/about"
            class="hyper-text"
            >三次市　駐車場混雑表示サービスについて</NuxtLink
          >」をご覧ください。
        </p>
        <p class="hide-on-pc">
          Cookie使用にご同意いただける場合は、同意ボタンをクリックしてください。<NuxtLink
            to="/about"
            class="hyper-text"
            >詳細を見る</NuxtLink
          >
        </p>
      </v-col>
      <v-col cols="4" sm="3" class="pa-1 pr-9">
        <v-row justify="center" class="d-flex flex-column">
          <v-btn class="cancel-btn d-flex" @click="cookieDeclined">
            <v-icon aria-hidden="false" class="icon-cancel-btn"
              >mdi-close</v-icon
            >
          </v-btn>
          <v-btn class="consent-btn white--text" @click="cookieAccepted">
            同意する
          </v-btn>
        </v-row>
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
  data() {
    return {
      initialCookie: false,
    };
  },
  mounted() {
    this.displayBanner();
  },
  methods: {
    displayBanner() {
      if (this.getCookie("acceptCookies") === null) {
        this.initialCookie = true;
      } else {
        this.initialCookie = false;
      }
    },
    cookieAccepted() {
      this.$gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "granted",
        functionality_storage: "granted",
        personalization_storage: "denied",
        security_storage: "denied",
      });
      this.setCookie("acceptCookies", "true");
    },
    cookieDeclined() {
      this.$gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        functionality_storage: "denied",
        personalization_storage: "denied",
        security_storage: "denied",
      });
      this.setCookie("acceptCookies", "false");
    },
    setCookie(key, value) {
      document.cookie = key + "=" + (value || "") + "; path=/";
      this.$router.go();
    },
    getCookie(name) {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
          return cookieValue;
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
a.hyper-text {
  text-decoration: underline;
  color: #ffe600 !important;
}
</style>
