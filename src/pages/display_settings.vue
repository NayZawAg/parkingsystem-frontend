<template>
  <v-main>
    <global-nav :title_menu="titleMenu" menulink="/management_menu" />
    <BreadCrumbs :items="breadCrumbsItems"></BreadCrumbs>
    <div class="hide-on-mobile">
      <GlobalPageTitle :titleName="title" @click="showAlert" />
      <GlobalPageDivider />
    </div>
    <div class="hide-on-pc">
      <GlobalPageTitle :titleName="titleMobile" @click="showAlert" />
      <GlobalPageDivider />
    </div>
    <v-card outlined color="transparent">
      <v-card-actions class="justify-center v-card-additional">
        <v-data-table
          :headers="headers"
          :items="paginatedItems"
          :items-per-page="dynamicItemsPerPage"
          class="table-class"
          mobile-breakpoint="0"
          hide-default-footer
        >
          <template v-slot:item="{ item, index }">
            <tr :class="[item.authority === null ? 'background-gray' : '']">
              <td>
                <div class="show-table-on-mobile">
                  <AvatarNumber
                    :index="(page - 1) * itemsPerPage + index"
                  ></AvatarNumber>
                </div>
                <div class="hide-table-on-mobile index-style">
                  <span>{{ (page - 1) * itemsPerPage + index + 1 }}</span>
                </div>
              </td>
              <td class="hide-table-on-mobile">
                <span v-if="item.kbn === 1">施設・イベント会場</span
                ><span v-else>駐車場</span>
              </td>
              <td v-if="item.kbn === 1" class="td-width-style">
                <v-icon>mdi-home</v-icon>
                {{ item.name }}
              </td>
              <td v-else class="td-width-style">
                <v-icon>mdi-car</v-icon>
                {{ item.name }}
              </td>
              <td class="hide-table-on-mobile">
                {{ item.address }}
              </td>
              <td>
                <v-select
                  :value="item.display_flag"
                  :items="displayFlagItem"
                  label="値を選択"
                  solo
                  outlined
                  dense
                  rounded
                  color="grey"
                  item-text="text"
                  item-value="value"
                  :class="[
                    getDisplayFlagClass(item.display_flag),
                    'my-custom-small-select',
                  ]"
                  v-on:change="updateDisplayFlag(item.id, item.kbn, $event)"
                  :disabled="!String(item.authority).includes('001')"
                ></v-select>
              </td>
              <td>
                <span v-if="item.kbn === 1" class="span-style">-</span>
                <v-select
                  v-else
                  :value="item.crowd_level_display"
                  :items="
                    item.camera_flag === 0
                      ? crowdLevelDisplayItem
                      : crowdLevelDisplayItemForCamera
                  "
                  label="値を選択"
                  solo
                  outlined
                  dense
                  rounded
                  color="grey"
                  item-text="crowdText"
                  item-value="crowdValue"
                  :class="[
                    getCrowdLevelClass(item.crowd_level_display),
                    'my-custom-crowd-select',
                  ]"
                  v-on:change="
                    updateCrowlevelDisplayFlag(item.id, item.kbn, $event)
                  "
                  :disabled="!String(item.authority).includes('002')"
                ></v-select>
              </td>

              <td class="hide-table-on-mobile word-break new-line">
                <span
                  v-if="
                    item.related_facilities_events === null ||
                    item.related_facilities_events === ''
                  "
                  >-</span
                ><span v-else>{{ item.related_facilities_events }}</span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-actions>
      <Pagination
        :itemsPerPageOptions="itemsPerPageOptions"
        :itemsPerPage="itemsPerPage"
        :page="page"
        :totalPages="totalPages"
        @itemsPerPageChange="handleItemsPerPageChange"
        @handlePagination="handlePagination"
      >
      </Pagination>
      <v-card-actions class="justify-center">
        <v-btn
          class="update-btn"
          rounded
          v-on:click="updateDisplaySetting(displaySettings)"
          :disabled="isUpdateButtonDisabled"
        >
          更新する
        </v-btn>
      </v-card-actions>
      <ConfirmationDialog
        ref="confirmDialog"
        title="確認"
        message="変更内容が破棄されます。よろしいでしょうか。<br />変更内容を保存する場合は、「更新する」ボタンを押下して変更内容を保存してください。"
        @execute-method="executeMethod"
      ></ConfirmationDialog>
    </v-card>
  </v-main>
</template>

<script>
import MediaStyle from "@/styles/globals.scss";
import GlobalNav from "@/components/GlobalNavBar";
import GlobalPageDivider from "../components/template/GlobalPageDivider.vue";
import GlobalPageTitle from "../components/template/GlobalPageTitle.vue";
import ConfirmationDialog from "../components/parts/ConfirmationDialog.vue";
import AvatarNumber from "../components/parts/AvatarNumber.vue";
import Pagination from "../components/parts/Pagination.vue";
import BreadCrumbs from "../components/parts/BreadCrumbs.vue";
export default {
  components: {
    GlobalNav,
    MediaStyle,
    GlobalPageDivider,
    GlobalPageTitle,
    ConfirmationDialog,
    AvatarNumber,
    Pagination,
    BreadCrumbs,
  },

  computed: {
    displaySettings() {
      return this.$store.getters["DisplaySettings/displaySettings"];
    },
    status() {
      return this.$store.getters["DisplaySettings/status"];
    },
    displaySettingsError() {
      return this.$store.getters["DisplaySettings/error"];
    },
    isUpdateButtonDisabled() {
      const output = this.displaySettings.every(
        (item) => item.authority === null
      );
      if (output) {
        return output;
      } else {
        const isSameData = this.areArraysEqual(
          this.originalDisplaySetting,
          this.displaySettings
        );
        return isSameData;
      }
    },
    totalPages() {
      return Math.ceil(this.displaySettings.length / this.itemsPerPage);
    },
    dynamicItemsPerPage() {
      const totalItems = this.displaySettings.length;
      return totalItems <= this.itemsPerPage ? totalItems : this.itemsPerPage;
    },
  },

  async mounted() {
    this.getDisplaySettings();
  },

  methods: {
    showAlert() {
      const isSameData = this.areArraysEqual(
        this.originalDisplaySetting,
        this.displaySettings
      );

      if (!isSameData) {
        this.$refs.confirmDialog.openDialog();
      } else {
        this.goBack();
      }
    },
    areArraysEqual(arr1, arr2) {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    },
    goBack() {
      this.$router.push("/management_menu");
    },
    async getDisplaySettings() {
      await this.$store.dispatch("DisplaySettings/getDisplaySettings");
      this.originalDisplaySetting = JSON.parse(
        JSON.stringify(this.displaySettings)
      );
    },
    updateDisplayFlag(itemId, itemKbn, newDisplayFlag) {
      this.$store.dispatch("DisplaySettings/updateDisplayFlagItem", {
        id: itemId,
        kbn: itemKbn,
        displayFlag: newDisplayFlag,
      });
    },
    updateCrowlevelDisplayFlag(dataId, dataKbn, newCrowdLevelDisplay) {
      this.$store.dispatch("DisplaySettings/updateCrowdLevelDisplayItem", {
        crowdId: dataId,
        crowdKbn: dataKbn,
        crowdLevelDisplay: newCrowdLevelDisplay,
      });
    },
    async updateDisplaySetting(displaySetting) {
      await this.$store.dispatch("DisplaySettings/updateDisplaySettingData", {
        setting_data: displaySetting,
      });
    },
    getCrowdLevelClass(crowdLevelDisplay) {
      switch (crowdLevelDisplay) {
        case 1:
          return "custom-font custom-background-auto";
        case 2:
          return "custom-font custom-background-empty";
        case 3:
          return "custom-font custom-background-almostfull";
        case 4:
          return "custom-font custom-background-full";
        case 98:
          return "custom-font custom-background-notcamera";
        case 99:
          return "custom-font custom-background-underadjustment";
        default:
          return "custom-font";
      }
    },
    getDisplayFlagClass(displayFlag) {
      switch (displayFlag) {
        case 0:
          return "custom-font custom-background-display";
        default:
          return "custom-font";
      }
    },
    executeMethod(ret) {
      if (ret) {
        this.goBack();
      } else {
        this.$refs.confirmDialog.closeDialog();
      }
    },
    handleItemsPerPageChange(updatedItemsPerPage) {
      this.page = 1;
      this.itemsPerPage = updatedItemsPerPage;
      this.updatePaginatedItems();
    },
    handlePagination(pageNumber) {
      this.page = pageNumber;
      this.updatePaginatedItems();
    },
    updatePaginatedItems() {
      const startIndex = (this.page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedItems = this.displaySettings.slice(startIndex, endIndex);
    },
  },
  watch: {
    page() {
      this.updatePaginatedItems();
    },
    itemsPerPage() {
      this.updatePaginatedItems();
    },
    displaySettings() {
      this.updatePaginatedItems();
    },
  },

  data() {
    return {
      titleMenu: "内部管理機能メニュー",
      title: "駐車場、施設・イベント会場表示設定",
      titleMobile: "駐車場、施設・イベント会場<br/>表示設定",
      originalDisplaySetting: null,
      headers: [
        {
          text: "#",
          sortable: false,
          width: "40px",
          class: "header-style",
        },
        {
          text: "駐車場 / 施設・イベント会場",
          sortable: false,
          width: "258px",
          class: "header-style",
        },
        {
          text: "駐車場、施設・イベント会場名",
          sortable: false,
          width: "260px",
          class: "header-style",
        },
        {
          text: "住所",
          sortable: false,
          width: "280px",
          class: "header-style",
        },
        {
          text: "表示/非表示",
          sortable: false,
          width: "170px",
          class: "header-unique-style",
        },
        {
          text: "混雑表示",
          sortable: false,
          width: "190px",
          class: "header-unique-style",
        },
        {
          text: "関連施設・イベント会場",
          sortable: false,
          width: "240px",
          class: "header-style",
        },
      ],
      displayFlagItem: [
        { value: 1, text: "表示" },
        { value: 0, text: "非表示" },
      ],
      crowdLevelDisplayItemForCamera: [
        { crowdValue: 1, crowdText: "自動" },
        { crowdValue: 2, crowdText: "空車あり" },
        { crowdValue: 3, crowdText: "ほぼ満車" },
        { crowdValue: 4, crowdText: "満車" },
        { crowdValue: 99, crowdText: "調整中" },
      ],
      crowdLevelDisplayItem: [
        { crowdValue: 98, crowdText: "―" },
        { crowdValue: 2, crowdText: "空車あり" },
        { crowdValue: 3, crowdText: "ほぼ満車" },
        { crowdValue: 4, crowdText: "満車" },
        { crowdValue: 99, crowdText: "調整中" },
      ],
      paginatedItems: [],
      itemsPerPage: 10,
      page: 1,
      itemsPerPageOptions: [100, 50, 20, 10],
      breadCrumbsItems: [
        {
          text: "内部管理機能メニュー",
          disabled: false,
          href: "/management_menu",
        },
        {
          text: "駐車場、施設・イベント会場表示設定",
          disabled: true,
          href: "/display_settings",
        },
      ],
    };
  },
  head() {
    return {
      title: this.title,
    };
  },
};
</script>

<style lang="scss">
.v-data-table.table-class {
  border: none !important;
}
.header-style {
  background-color: #747480 !important;
  font-weight: bold !important;
  font-size: 16px !important;
  color: white !important;
}
.header-unique-style {
  background-color: #d6d6e8 !important;
  color: #59599f !important;
  font-weight: bold !important;
  font-size: 16px !important;
}
.custom-background-display .v-input__control > .v-input__slot {
  background-color: $bg-color-underadjustment !important;
}
.custom-background-auto .v-input__control > .v-input__slot {
  background-color: $bg-color-auto !important;
}
.custom-background-full .v-input__control > .v-input__slot {
  background-color: $bg-color-full !important;
}
.custom-background-full .v-select__selection {
  color: $txt-color-full !important;
}
.custom-background-empty .v-input__control > .v-input__slot {
  background-color: $bg-color-empty !important;
}
.custom-background-empty .v-select__selection {
  color: $txt-color-empty !important;
}
.custom-background-almostfull .v-input__control > .v-input__slot {
  background-color: $bg-color-almostfull !important;
}
.custom-background-almostfull .v-select__selection {
  color: $txt-color-almostfull !important;
}
.custom-background-underadjustment .v-input__control > .v-input__slot {
  background-color: $bg-color-underadjustment !important;
}
.custom-background-notcamera .v-input__control > .v-input__slot {
  background-color: $bg-color-notcamera !important;
}
.custom-font {
  font-weight: bold !important;
}
.background-gray {
  background-color: lightgray !important;
}
.span-style {
  display: block;
  text-align: center;
}
.custom-font .v-input__control {
  height: 40px !important;
}
.theme--light.v-input {
  padding: 5px 0px !important;
  justify-content: center !important;
}
.index-style {
  float: right !important;
}
.v-input--dense > .v-input__control > .v-input__slot {
  margin: 0px;
}
.v-text-field.v-text-field--enclosed .v-text-field__details {
  padding: 0px;
}
.word-break {
  word-break: break-all;
}
.new-line {
  white-space: pre-wrap;
}
</style>
