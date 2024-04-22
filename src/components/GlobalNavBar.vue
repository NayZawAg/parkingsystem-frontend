<template>
  <div>
    <v-app-bar
      app
      color="#e2002e"
      flat
      height="50px"
      class="v-app-bar-nav-position"
    >
      <NuxtLink to="/">
        <div
          class="icon mr-2 white--text font-weight-bold text-truncate v-nav-title"
          @click="pageReload"
        >
          三次市駐車場混雑表示サービス
        </div>
      </NuxtLink>
      <div text class="hide-on-mobile" v-if="this.loggedIn">
        <span
          class="d-inline-block mx-2 hide-on-mobile icon white--text font-weight-bold"
          >/</span
        >
        <NuxtLink :to="menulink">
          <a class="icon white--text font-weight-bold">{{ title_menu }}</a>
        </NuxtLink>
      </div>
      <v-spacer></v-spacer>
      <v-row justify="end">
        <div
          class="openbtn v-nav-icon-display"
          :class="{ active: drawer }"
          @click="toggleDrawer"
        >
          <span></span><span></span><span></span>
        </div>
      </v-row>
      <v-responsive class="hide-on-mobile" max-width="110" v-if="this.loggedIn">
        <v-btn @click="logout" depressed> ログアウト </v-btn>
      </v-responsive>
      <v-responsive class="hide-on-mobile" max-width="180" v-else>
        <v-btn @click="login" class="mr-5">
          <v-icon color="blue-grey darken-2"> mdi-lock </v-icon>内部管理機能
        </v-btn>
      </v-responsive>
    </v-app-bar>
    <v-navigation-drawer
      absolute
      right
      v-model="drawer"
      class="v-nav-icon-display v-app-bar-nav-position"
      color="rgba(66, 66, 66, 0.60)"
      :style="{ width: drawer ? '256px' : '0px' }"
    >
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="text--accent-4"
          class="pt-16"
        >
          <v-list-item class="pt-9" style="pointer-events: none !important">
            <v-list-item-title></v-list-item-title>
          </v-list-item>
          <v-list-item style="pointer-events: none !important">
            <v-list-item-title
              class="font-weight-medium white--text menu-title"
            >
              MENU
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="loginShow">
            <div class="custom-menu-list-style"></div>
            <a href="https://chat.withjorge.jp/jorge/003102" target="_blank">
              <v-list-item-title class="font-weight-bold white--text menu-font">
                観光チャットボット
              </v-list-item-title>
            </a>
          </v-list-item>
          <v-list-item v-if="loginShow">
            <div
              class="custom-menu-list-style"
              style="position: absolute; top: 0"
            ></div>
            <v-list-item-title>
              <NuxtLink
                to="/about"
                class="white--text text-decoration-none about-link font-weight-bold menu-font"
                style="display: block; padding-left: 20px"
              >
                三次市 駐車場混雑表示<br />
                サービスについて
              </NuxtLink>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="loginShow">
            <div class="custom-menu-list-style"></div>
            <v-list-item-title>
              <NuxtLink
                to="/privacypolicy_settings"
                class="white--text text-decoration-none font-weight-bold menu-font"
              >
                プライバシー設定
              </NuxtLink>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="this.loggedIn" @click="logout">
            <div class="custom-menu-list-style"></div>
            <v-list-item-title class="font-weight-bold white--text menu-font"
              >ログアウト</v-list-item-title
            >
          </v-list-item>
          <v-list-item v-else @click="login">
            <div class="custom-menu-list-style"></div>
            <v-list-item-title class="font-weight-bold white--text menu-font"
              ><v-icon color="white" small style="letter-spacing: 5px">
                mdi-lock </v-icon
              >内部管理機能</v-list-item-title
            >
          </v-list-item>
          <v-list-item v-if="this.loggedIn" @click="menuPage">
            <div class="custom-menu-list-style"></div>
            <v-list-item-title class="font-weight-bold white--text menu-font"
              >内部管理機能メニュー</v-list-item-title
            >
          </v-list-item>
          <v-list-item v-if="loginShow">
            <a href="https://chat.withjorge.jp/jorge/003102" target="_blank">
              <v-list-item-title
                class="font-weight-bold white--text mt-12 chatbot-info"
              >
                三次観光案内チャットボット
              </v-list-item-title>
              <div class="pl-4">
                <v-img
                  src="/images/parkingService.png"
                  width="150"
                  contain
                  class="white"
                ></v-img>
              </div>
            </a>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import MediaStyle from "@/styles/globals.scss";
export default {
  props: {
    title_menu: {
      type: String,
      default: "",
    },
    menulink: {
      type: String,
      default: "",
    },
  },
  components: {
    MediaStyle,
  },
  data: () => ({
    nuxt_link: "",
    loggedIn: null,
    drawer: false,
    group: null,
    loginShow: false,
  }),
  watch: {
    group() {
      this.drawer = false;
    },
  },
  async mounted() {
    this.loggedIn = this.$store.state.auth.loggedIn;
    this.loggedIn ? (this.loginShow = false) : (this.loginShow = true);
  },
  methods: {
    pageReload() {
      if (this.$route.path === "/") this.$router.go();
    },
    logout() {
      this.$auth.logout();
      this.$router.push("/login");
      // do google analytics event
      this.$gtag("event", "logout_btn_click", {
        logout_username: this.$store.state.auth.user.username,
      });
    },
    login() {
      this.$router.push("/login");
    },
    menuPage() {
      this.$router.push("/management_menu");
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style>
a.nuxt-link-exact-active {
  font-weight: bold;
}
a.nuxt-link-exact-active.icon {
  font-weight: normal;
}
a,
a:visited {
  text-decoration: none;
  color: inherit;
}

.v-application a {
  color: black !important;
}

.icon {
  font-size: 18px;
  letter-spacing: 2px !important;
}
.about-link {
  font-weight: 600;
  font-size: 10px !important;
  letter-spacing: 1px !important;
}
.custom-menu-list-style {
  display: list-item !important;
  list-style-position: inside !important;
  color: #fff !important;
  margin: 0px 4px 0px 7px !important;
  width: 11px !important;
  font-size: 14px !important;
}
.menu-title {
  font-size: 20px !important;
  letter-spacing: 5px !important;
}
.menu-font {
  font-size: 0.75rem !important;
  letter-spacing: 5px !important;
  font-family: "Roboto", sans-serif !important;
}
.chatbot-info {
  font-size: 10px !important;
  letter-spacing: 5px;
  font-family: "Roboto", sans-serif !important;
  min-height: 20px !important;
}

/* ハンバーガーメニュー */
.openbtn {
  position: relative;
  cursor: pointer;
  width: 50px;
  height: 45px;
  border-radius: 5px;
}
.openbtn span {
  display: inline-block;
  transition: all 0.4s;
  position: absolute;
  left: 12px;
  height: 2px;
  border-radius: 2px;
  background: #fff;
  width: 40%;
}
.openbtn span:nth-of-type(1) {
  top: 15px;
}
.openbtn span:nth-of-type(2) {
  top: 20px;
}
.openbtn span:nth-of-type(3) {
  top: 25px;
}
.openbtn.active span:nth-of-type(1) {
  top: 13px;
  left: 16px;
  transform: translateY(6px) rotate(-135deg);
  width: 40%;
}
.openbtn.active span:nth-of-type(2) {
  opacity: 0;
}
.openbtn.active span:nth-of-type(3) {
  top: 25px;
  left: 16px;
  transform: translateY(-6px) rotate(135deg);
  width: 40%;
}
</style>