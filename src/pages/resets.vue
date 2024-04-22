<template>
  <v-main>
    <global-nav :title_menu="titleMenu" menulink="/management_menu" />
    <BreadCrumbs :items="breadCrumbsItems"></BreadCrumbs>
    <GlobalPageTitle :titleName="title" @click="goBack" />
    <GlobalPageDivider />
    <v-card outlined color="transparent" v-if="this.status == 'success'">
      <v-row class="mr-0">
        <v-col cols="12" class="pr-0">
          <v-sheet class="pa-2">
            <v-alert v-if="error != null" type="error" border="left">
              {{ error }}
            </v-alert>
            <v-alert v-if="success != null" type="success" border="left">
              {{ success }}
            </v-alert>
            <v-simple-table class="resets-table-border">
              <template v-slot:default>
                <thead class="resets-border">
                  <tr class="resets-title">
                    <th colspan="4">駐車場情報</th>
                    <th colspan="3" class="before-resets-content">
                      【参考値】<br />前回補正情報
                    </th>
                    <th colspan="3" class="border-hide">今回補正内容</th>
                  </tr>
                  <tr class="resets-item">
                    <th>番号</th>
                    <th>駐車場の名前</th>
                    <th>駐車可能台数<br />（Webサイト表示用）</th>
                    <th class="resets-content">駐車可能台数<br />（計算用）</th>
                    <th class="before-resets-content">補正日時</th>
                    <th class="before-resets-content">
                      現在駐車台数<br />（補正前の値）
                    </th>
                    <th class="before-resets-content">
                      現在駐車台数<br />（補正後の値）
                    </th>
                    <th class="resets-content">現在駐車台数</th>
                    <th class="resets-content">
                      現在駐車台数<br />（補正後の値）
                    </th>
                    <th class="border-hide">補正実行</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in reset_parkings"
                    :key="item.location_id"
                  >
                    <td>{{ ++index }}</td>
                    <td>{{ item.name }}</td>
                    <td v-if="item.capacity == null">-</td>
                    <td v-else>{{ item.capacity }}</td>
                    <td
                      v-if="item.capacity_calculation == null"
                      class="resets-content"
                    >
                      -
                    </td>
                    <td class="resets-content" v-else>
                      {{ item.capacity_calculation }}
                    </td>
                    <td
                      v-if="item.pre_reset_datetime == null"
                      class="before-resets-content"
                    >
                      -
                    </td>
                    <td class="before-resets-content" v-else>
                      {{ item.pre_reset_datetime | datetime }}
                    </td>
                    <td
                      v-if="item.pre_total_in_count == null"
                      class="before-resets-content"
                    >
                      -
                    </td>
                    <td class="before-resets-content" v-else>
                      {{ Number(item.pre_total_in_count) }}
                    </td>
                    <td
                      v-if="item.pre_reset_in_count == null"
                      class="before-resets-content"
                    >
                      -
                    </td>
                    <td class="before-resets-content" v-else>
                      {{ Number(item.pre_reset_in_count) }}
                    </td>
                    <td class="resets-content" v-if="item.current_total_in_count == null">
                    </td>
                    <td class="resets-content" v-else>
                      {{ Number(item.current_total_in_count) }}
                    </td>
                    <td class="resets-content">
                      <v-text-field
                        :id="`reset_in_count-${item.id}`"
                        :class="
                          text_box_error != null && item.id == text_box_id
                            ? 'my-text-style'
                            : 'normal'
                        "
                        type="number"
                        value=""
                        min="1"
                      >
                      </v-text-field>
                      <span
                        v-if="text_box_error != null && item.id == text_box_id"
                        class="red--text caption"
                      >
                        {{ text_box_error }}
                      </span>
                    </td>
                    <td>
                      <v-btn color="primary" @click="resetParking(item)">
                        補正
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-sheet>
        </v-col>
      </v-row>
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
  middleware: "stats",
  components: {
    GlobalNav,
    MediaStyle,
    GlobalPageDivider,
    GlobalPageTitle,
    BreadCrumbs,
  },
  data: () => ({
    titleMenu: "内部管理機能メニュー",
    title: "駐車台数補正",
    error: null,
    success: null,
    text_box_error: null,
    text_box_id: null,
    breadCrumbsItems: [
      {
        text: "内部管理機能メニュー",
        disabled: false,
        href: "/management_menu",
      },
      {
        text: "駐車台数補正",
        disabled: true,
        href: "/resets",
      },
    ],
  }),
  head() {
    return {
      title: this.title,
    };
  },
  computed: {
    status() {
      return this.$store.getters["ResetParkings/status"];
    },
    reset_parkings() {
      return this.$store.getters["ResetParkings/reset_parkings"];
    },
    reset_error() {
      return this.$store.getters["ResetParkings/error"];
    },
  },
  async mounted() {
    // get resets
    this.getResets();
  },
  methods: {
    async resetParking(parking_reset_params) {
      const elements = document.getElementById(
        `reset_in_count-${parking_reset_params.id}`
      );
      let reset_count = elements == undefined ? "" : elements.value;
      // text box blank
      if (reset_count == "" || reset_count < 0) {
        this.text_box_error = "必須項目です";
        this.text_box_id = parking_reset_params.id;
        this.success = null;
      } else if (reset_count > 2147483647) {
        this.text_box_error = "2147483647以下で入力してください。";
        this.text_box_id = parking_reset_params.id;
        this.success = null;
      } else {
        parking_reset_params.reset_in_count = reset_count;
        // call get reset parking of store
        await this.$store.dispatch(
          "ResetParkings/resetParking",
          parking_reset_params
        );
        // return if errors have
        if (this.status == "error") {
          // error page
          this.errorPage(this.reset_error);
        } else if (this.status == "success") {
          this.text_box_error = null;
          // get resets
          this.clearTextBox();
          this.getResets();
          this.error = null;
          this.success =
            parking_reset_params.name + "の駐車台数補正が完了しました";
        }
      }
    },
    async getResets() {
      // call get parking resets of store
      await this.$store.dispatch("ResetParkings/getResets");
      this.clearTextBox();
      if (this.status == "error") {
        // error page
        this.errorPage(this.reset_error);
      }
    },
    clearTextBox() {
      //resets textbox clear
      const reset_elements = document.querySelectorAll(
        '[id^="reset_in_count-"]'
      );
      reset_elements.forEach((element) => {
        element.value = null;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      });
    },
    errorPage(error) {
      if (error.status == 422) {
        this.success = null;
        this.error = error.data.errors[0];
      } else if (error.status == 404) {
        // Go to not_found_error page
        this.$router.push({
          name: "not_found",
        });
      } else if (error.status == 401) {
        // Go to unauthorized page
        this.$router.push({
          name: "unauthorized",
        });
      } else {
        // Go to internal_server_error page
        this.$router.push({
          name: "internal_server_error",
        });
      }
    },
    goBack() {
      this.$router.push("/management_menu");
    },
  },
};
</script>

<style scoped>
.my-text-style >>> .v-text-field__slot input {
  background-color: #f5b7b1;
}
.v-text-field {
  /* max-width: 75px; */
  width: 75px;
}
.my-text-style >>> .v-input__control {
  height: 33px;
}
.resets-border > .resets-title > th {
  border-bottom: 1px solid lightgray;
  font-size: 16px !important;
  color: #000 !important;
  font-weight: bold;
  text-align: center !important;
  white-space: nowrap;
}
.resets-border > .resets-item > th {
  border-right: 1px solid lightgray;
  font-size: 14px !important;
  text-align: center !important;
  font-weight: normal;
  color: #000 !important;
  white-space: nowrap;
  font-family: "Roboto", sans-serif !important;
}
.resets-table-border {
  border: 1px solid lightgray;
}
.border-hide {
  border-right: 0px !important;
}
.resets-content {
  background-color: #ffe5e5;
}
.before-resets-content {
  background-color: #afafb3;
}
</style>
