<template>
  <v-main>
    <global-nav :title_menu="title_menu" menulink="/management_menu" />
    <BreadCrumbs :items="breadCrumbsItems"></BreadCrumbs>
    <div class="hide-on-mobile">
      <GlobalPageTitle :titleName="title" @click="goBack" />
      <GlobalPageDivider />
    </div>
    <div class="hide-on-pc">
      <GlobalPageTitle :titleName="titleMobile" @click="goBack" />
      <GlobalPageDivider />
    </div>
    <v-card outlined color="transparent">
      <v-card-actions class="justify-center v-card-additional">
        <template>
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
                <td class="mobile-view-btn">
                  <template v-if="item.kbn === 1">
                    <v-btn
                      class="edit-vbtn"
                      @click="openFacilityDialog(item.id, item.name)"
                      :disabled="!String(item.authority).includes('003')"
                    >
                      編集する
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      class="edit-vbtn"
                      @click="openLocationDialog(item.id)"
                      :disabled="!String(item.authority).includes('003')"
                    >
                      編集する
                    </v-btn>
                  </template>
                </td>
                <td class="mobile-view-index">
                  <div class="show-table-on-mobile">
                    <AvatarNumber
                      :index="(page - 1) * itemsPerPage + index"
                    ></AvatarNumber>
                  </div>
                  <div class="hide-table-on-mobile avatar-right">
                    <span>{{ (page - 1) * itemsPerPage + index + 1 }}</span>
                  </div>
                </td>
                <td v-if="item.kbn === 1" class="hide-table-on-mobile">
                  施設・イベント会場
                </td>
                <td v-if="item.kbn === 2" class="hide-table-on-mobile">
                  駐車場
                </td>
                <template v-if="item.kbn === 1">
                  <td>
                    <v-icon>mdi-home</v-icon>
                    {{ item.name }}
                  </td>
                </template>
                <template v-else>
                  <td>
                    <v-icon>mdi-car</v-icon>
                    {{ item.name }}
                  </td>
                </template>
                <td class="hide-table-on-mobile">
                  <span v-if="item.outline === null || item.outline === ''"
                    >-</span
                  >
                  <span v-else>{{ item.outline }}</span>
                </td>
                <td class="hide-table-on-mobile">
                  <span v-if="item.address === null || item.address === ''"
                    >-</span
                  >
                  <span v-else>{{ item.address }}</span>
                </td>
                <td class="hide-table-on-mobile align-to-right">
                  <span v-if="item.capacity === null || item.capacity === ''"
                    >-</span
                  >
                  <span v-else>{{ item.capacity }}</span>
                </td>
                <td class="hide-table-on-mobile">
                  <span
                    v-if="
                      item.opening_hours === null || item.opening_hours === ''
                    "
                    >-</span
                  >
                  <span v-else>{{ item.opening_hours }}</span>
                </td>
                <td class="hide-table-on-mobile word-break new-line">
                  <span v-if="item.holiday === null || item.holiday === ''"
                    >-</span
                  >
                  <span v-else>{{ item.holiday }}</span>
                </td>
                <td class="hide-table-on-mobile">
                  <span
                    v-if="
                      item.available_payment === null ||
                      item.available_payment === ''
                    "
                    >-</span
                  >
                  <span v-else>{{ item.available_payment }}</span>
                </td>
                <td class="hide-table-on-mobile">
                  <span
                    v-if="item.offical_url === null || item.offical_url === ''"
                    >-</span
                  >
                  <span v-else>{{ item.offical_url }}</span>
                </td>
                <td class="hide-table-on-mobile word-break new-line">
                  <span
                    v-if="
                      item.related_facilities_events === null ||
                      item.related_facilities_events === ''
                    "
                    >-</span
                  >
                  <span v-else>{{ item.related_facilities_events }}</span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </template>
      </v-card-actions>
    </v-card>
    <Pagination
      :itemsPerPageOptions="itemsPerPageOptions"
      :itemsPerPage="itemsPerPage"
      :page="page"
      :totalPages="totalPages"
      @itemsPerPageChange="handleItemsPerPageChange"
      @handlePagination="handlePagination"
    >
    </Pagination>
    <LocationDialog ref="locationdialog"></LocationDialog>
    <FacilityDialog ref="facilitydialog"></FacilityDialog>
  </v-main>
</template>

<script>
import GlobalNav from "@/components/GlobalNavBar";
import MediaStyle from "@/styles/globals.scss";
import LocationDialog from "@/components/LocationEditDialog.vue";
import FacilityDialog from "@/components/FacilityEditDialog.vue";
import GlobalPageDivider from "../components/template/GlobalPageDivider.vue";
import GlobalPageTitle from "../components/template/GlobalPageTitle.vue";
import AvatarNumber from "../components/parts/AvatarNumber.vue";
import Pagination from "../components/parts/Pagination.vue";
import BreadCrumbs from "../components/parts/BreadCrumbs.vue";
export default {
  components: {
    GlobalNav,
    LocationDialog,
    FacilityDialog,
    MediaStyle,
    GlobalPageDivider,
    GlobalPageTitle,
    AvatarNumber,
    Pagination,
    BreadCrumbs,
  },
  data() {
    return {
      title_menu: "内部管理機能メニュー",
      title: "駐車場、施設・イベント会場情報編集",
      titleMobile: "駐車場、施設・イベント会場<br/>情報編集",
      headers: [
        {
          text: "編集",
          sortable: false,
          width: "100px",
          class: "info-custom-header-btn",
        },
        {
          text: "＃",
          sortable: false,
          width: "60px",
          class: "info-custom-header",
        },
        {
          text: "駐車場/施設・イベント会場",
          sortable: false,
          width: "232px",
          class: "info-custom-header",
        },
        {
          text: "駐車場、施設・イベント会場名",
          sortable: false,
          width: "258px",
          class: "info-custom-header",
        },
        {
          text: "駐車場、施設・イベント会場概要",
          sortable: false,
          width: "275px",
          class: "info-custom-header",
        },
        {
          text: "住所",
          sortable: false,
          width: "230px",
          class: "info-custom-header",
        },
        {
          text: "駐車可能台数",
          sortable: false,
          width: "140px",
          class: "info-custom-header",
        },
        {
          text: "営業時間",
          sortable: false,
          width: "120px",
          class: "info-custom-header",
        },
        {
          text: "定休日",
          sortable: false,
          width: "120px",
          class: "info-custom-header",
        },
        {
          text: "利用可能決済",
          sortable: false,
          width: "140px",
          class: "info-custom-header",
        },
        {
          text: "公式サイト",
          sortable: false,
          width: "260px",
          class: "info-custom-header",
        },
        {
          text: "関連施設・イベント会場",
          sortable: false,
          width: "240px",
          class: "info-custom-header",
        },
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
          text: "駐車場、施設・イベント会場情報編集",
          disabled: true,
          href: "/information_settings",
        },
      ],
    };
  },

  head() {
    return {
      title: this.title,
    };
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
    openFacilityDialog(id, name) {
      this.$refs.facilitydialog.open(id, name);
    },
    openLocationDialog(id) {
      this.$refs.locationdialog.open(id);
    },
    goBack() {
      this.$router.go(-1);
    },
    async getDisplaySettings() {
      await this.$store.dispatch("DisplaySettings/getDisplaySettings");
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
};
</script>

<style>
.edit-vbtn {
  color: white !important;
  border-radius: 15px !important;
  background-color: red !important;
  font-size: small !important;
  text-align: center !important;
}
.background-gray {
  background-color: lightgray !important;
}
.avatar-right {
  float: right !important;
}
.align-to-right {
  text-align: right !important;
}
.word-break {
  word-break: break-all;
}
.new-line {
  white-space: pre-wrap;
}
</style>
