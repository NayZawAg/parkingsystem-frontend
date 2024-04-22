<template>
  <v-main>
    <global-nav :title_menu="title_menu" menulink="/management_menu" />
    <GlobalPageTitle :titleName="title" v-on:click="goPrev" />
    <Divider class="divider-position" />
    <v-card flat>
      <v-card-text>
        <v-container>
          <section class="privacy-settings">
            <p class="privacy-text">
              三次市　駐車場混雑表示サービス（本ウェブサイト）におけるクッキーの使用に同意する場合は、同意するボタンと保存ボタンのクリックをお願いします。
            </p>
            <h4 class="mt-2 mb-2">クッキー使用目的の一例</h4>
            <div>
              <ul class="policy-list">
                <li>
                  本ウェブサイトの利用状況を分析し、ユーザーが使いやすいウェブサイトに改善するため
                </li>
                <li>
                  駐車場混雑表示サービスを提供する三次市の交通関連分野のデータ集計、分析を行うため（※）
                </li>
                <li class="policy-list-text">
                  ※取得情報は匿名、統計加工したうえで本サービス関係者へ共有します。
                </li>
              </ul>
            </div>
            <section class="mt-5 privacy-pc-table">
              <h4 class="mb-2">クッキー使用への同意</h4>
              <table class="policy-table">
                <tbody>
                  <tr>
                    <td class="cookie-options">
                      <div class="d-flex flex-row">
                        <div>
                          <label for="accept-cookies"
                            >クッキー使用に同意する</label
                          >
                        </div>
                        <div style="padding-top: 1px !important">
                          <input
                            type="radio"
                            id="accept-cookies"
                            name="accept-cookies"
                            v-model="cookieSetting"
                            value="accept"
                          />
                        </div>
                      </div>
                    </td>
                    <td class="cookie-options">
                      <div class="d-flex flex-row">
                        <div>
                          <label for="decline-cookies"
                            >クッキー使用に同意しない</label
                          >
                        </div>
                        <div style="padding-top: 1px !important">
                          <input
                            type="radio"
                            id="decline-cookies"
                            name="accept-cookies"
                            v-model="cookieSetting"
                            value="decline"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section class="privacy-sp-table">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <h4>クッキー使用に同意する</h4>
                    </td>
                    <td>
                      <label for="slider-button" class="switch">
                        <input
                          type="checkbox"
                          name="slider-button"
                          id="slider-button"
                          v-model="isChecked"
                        />
                        <span class="slider"></span>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section class="hide-on-mobile">
              <p>
                詳細については、「<a href="/about" class="hyper-text"
                  >三次市　駐車場混雑表示サービスについて</a
                >」をご覧ください。
              </p>
            </section>
            <section class="hide-on-pc privacy-detail-txt-sp">
              <p>詳細については、以下をご覧ください。</p>
              <a href="/about" class="hyper-text"
                >三次市　駐車場混雑表示サービスについて
              </a>
            </section>
            <div class="button-section">
              <v-row justify="center">
                <v-btn
                  class="save-button hide-on-mobile"
                  @click="saveSettingsPc"
                >
                  保存する
                </v-btn>
                <v-btn class="save-button hide-on-pc" @click="saveSettingsSp">
                  保存する
                </v-btn>
              </v-row>
            </div>
          </section>
        </v-container>
      </v-card-text>
    </v-card>
    <GlobalFooter />
  </v-main>
</template>

<script>
import GlobalNav from "@/components/GlobalNavBar";
import GlobalPageTitle from "@/components/template/GlobalPageTitle.vue";
import Divider from "@/components/parts/Divider.vue";
import MediaStyle from "@/styles/globals.scss";
import GlobalFooter from "@/components/template/GlobalFooter";
export default {
  auth: false,
  head() {
    return {
      title: this.title,
    };
  },
  components: {
    GlobalNav,
    MediaStyle,
    GlobalPageTitle,
    Divider,
    GlobalFooter,
  },
  mounted() {
    this.cookieDefault();
    this.initialState();
  },
  data() {
    return {
      title_menu: "内部管理機能メニュー",
      title: "プライバシー設定",
      cookieSetting: null,
      isChecked: false,
    };
  },
  methods: {
    saveSettingsPc() {
      this.cookieSetting === "accept"
        ? this.cookieAccepted()
        : this.cookieDeclined();
    },
    saveSettingsSp() {
      this.isChecked === true ? this.cookieAccepted() : this.cookieDeclined();
    },
    cookieDefault() {
      this.$gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        functionality_storage: "denied",
        personalization_storage: "denied",
        security_storage: "denied",
      });
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
    initialState() {
      if (this.getCookie("acceptCookies") != null) {
        this.cookieSetting =
          this.getCookie("acceptCookies") === "true" ? "accept" : "decline";
        this.isChecked =
          this.getCookie("acceptCookies") === "true" ? true : false;
      } else {
        this.cookieSetting = "decline";
        this.isChecked = false;
      }
    },
    goPrev() {
      // this.$router.push("/");
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.divider-position {
  margin: auto auto 10px auto;
}
.privacy-settings {
  margin-left: 200px;
  margin-right: 200px;
  color: black;
}
.privacy-text {
  margin: 0 50px;
}
.policy-table {
  border-collapse: collapse;
  margin-left: 80px;
  margin-bottom: 25px;
}
.policy-table td {
  border: 1px solid grey;
  padding: 9px 15px;
}
.cookie-options label {
  margin-right: 70px !important;
}
.cookie-options input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: #e2002e;
}
a.hyper-text {
  text-decoration: underline;
  color: #e2002e !important;
}
.button-section {
  margin-top: 90px;
  margin-bottom: 40px;
}
.save-button {
  border-radius: 5px;
  letter-spacing: 0.3rem;
  color: white !important;
  background-color: red !important;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 16px !important;
}
.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 25px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 2.5px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #2db757;
}
input:focus + .slider {
  box-shadow: 0 0 1px #2db757;
}
input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
.privacy-sp-table {
  margin-bottom: 20px;
  border: 1px solid grey;
}
.privacy-sp-table td {
  width: 100% !important;
  margin-bottom: 20px;
  padding: 12px 25px;
}
.privacy-sp-table td h4 {
  display: inline-block;
}
.privacy-detail-txt-sp p {
  margin-bottom: 0;
}
ul.policy-list {
  padding-left: 0;
}
ul.policy-list li {
  position: relative;
  list-style-type: none;
  padding-left: 25px;
  margin-bottom: 10px;
}
ul.policy-list li::before {
  content: "\2714";
  font: 14px;
  margin-right: 8px;
  position: absolute;
  left: 0;
  top: 25%;
  margin-right: 10px;
}
ul li.policy-list-text:before {
  content: "";
}
</style>
