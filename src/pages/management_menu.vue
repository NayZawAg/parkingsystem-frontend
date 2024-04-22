<template>
  <v-main>
    <global-nav :title_menu="title_menu" menulink="/management_menu" />
    <BreadCrumbs :items="breadCrumbsItems"></BreadCrumbs>
    <GlobalPageTitle :titleName="title" @click="goBack" />
    <GlobalPageDivider />
    <v-card flat class="col-11 col-sm-9 mx-auto">
      <NuxtLink to="/parking_situations">
        <v-btn
          color="#dcdce1"
          large
          block
          class="mb-6 letter-space font-weight-bold v-management-btn"
        >
          データ確認・ダウンロード
        </v-btn>
      </NuxtLink>
      <NuxtLink to="/display_settings">
        <v-btn
          color="#dcdce1"
          large
          block
          class="mb-6 letter-space font-weight-bold v-management-btn"
        >
          駐車場、施設・イベント会場表示設定
        </v-btn>
      </NuxtLink>
      <NuxtLink to="/information_settings">
        <v-btn
          color="#dcdce1"
          large
          block
          class="mb-6 letter-space font-weight-bold v-management-btn"
        >
          駐車場、施設・イベント会場情報編集
        </v-btn>
      </NuxtLink>
      <NuxtLink to="/resets">
        <v-btn
          color="#dcdce1"
          large
          block
          class="letter-space font-weight-bold v-management-btn"
          v-if="userType == '1' && this.loggedIn"
        >
          駐車台数補正
        </v-btn>
      </NuxtLink>
    </v-card>
  </v-main>
</template>

<script>
import GlobalNav from "@/components/GlobalNavBar";
import MediaStyle from "@/styles/globals.scss";
import GlobalPageDivider from "../components/template/GlobalPageDivider.vue";
import GlobalPageTitle from "../components/template/GlobalPageTitle.vue";
import BreadCrumbs from "../components/parts/BreadCrumbs.vue";
export default {
  components: {
    GlobalNav,
    MediaStyle,
    GlobalPageDivider,
    GlobalPageTitle,
    BreadCrumbs,
  },
  data: () => ({
    title: "内部管理機能メニュー",
    title_menu: "内部管理機能メニュー",
    userType: null,
    loggedIn: null,
    breadCrumbsItems: [
      {
        text: "内部管理機能メニュー",
        disabled: true,
        href: "/management_menu",
      },
    ],
  }),
  head() {
    return {
      title: this.title,
    };
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
  },
  async mounted() {
    this.loggedIn = this.$store.state.auth.loggedIn;
    this.loggedIn ? (this.loginShow = false) : (this.loginShow = true);
    if (this.$store.state.auth.user != null) {
      this.userType = this.$store.state.auth.user.user_type;
    }
  },
};
</script>

<style>
.letter-space {
  letter-spacing: 0.2rem;
}
</style>
