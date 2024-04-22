<template>
  <v-main>
    <global-nav :title_menu="title_menu" menulink="/management_menu" />
    <BreadCrumbs :items="breadCrumbsItems"></BreadCrumbs>
    <GlobalPageTitle titleName="" @click="goBack" />
    <v-container fluid>
      <!-- <global-nav :title_menu="title_menu" menulink="/management_menu"/> -->
      <!-- <GlobalPageTitle titleName="" @click="goBack" class="parking-situations-container"/> -->
      <v-row class="pa-0 pt-3">
        <div class="col-9 mx-auto">
          <v-card class="fill-height grey lighten-3">
            <v-card-title class="justify-center">
              {{ title }}
            </v-card-title>
            <v-card-text class="mt-7">
              <v-form @submit.prevent="onSubmit" ref="form" id="parking_form">
                <v-row class1="d-flex flex-wrap">
                  <v-sheet class="ml-3 mr-2 no-background parking-lbl">
                    駐車場:
                  </v-sheet>
                  <v-sheet class="mr-3 no-background mr-rt3">
                    <v-select
                      :items="locations"
                      item-text="name"
                      solo
                      v-model="selected_location"
                      return-object
                      min-width="auto"
                    ></v-select>
                  </v-sheet>
                  <v-sheet class="mr-2 no-background time-lbl"> 期間: </v-sheet>
                  <v-sheet class="no-background">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                      single-line
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="from_date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          class="mt-0 py-0"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="from_date"
                        no-title
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-sheet>
                  <v-sheet class="no-background">
                    <p class="text-h6">～</p>
                  </v-sheet>
                  <v-sheet class="no-background">
                    <v-menu
                      v-model="menu3"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                      single-line
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="to_date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          class="mt-0 py-0"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="to_date"
                        no-title
                        @input="menu3 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-sheet>
                  <div class="ml-2 py-0 mr-lf7">
                    <v-btn
                      width="121px"
                      color="primary"
                      form="parking_form"
                      @click="onSubmit"
                    >
                      表示する
                    </v-btn>
                  </div>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </div>
      </v-row>
      <v-row v-if="showDetailTable">
        <div class="col-9 mx-auto mb-4">
          <v-row>
            <v-col cols="6" sm="2"> 入庫:　{{ in_count }}件 </v-col>
            <v-col cols="6" sm="7"> 出庫:　{{ out_count }}件 </v-col>
            <v-col class="hide-on-mobile">
              <span></span>
            </v-col>
            <v-col>
              <v-btn color="primary" @click="downloadCSV()">
                データダウンロード
              </v-btn>
            </v-col>
          </v-row>
          <v-row> </v-row>
          <v-simple-table dense class="mt-2" item-key="name">
            <template>
              <thead>
                <tr>
                  <template v-for="(header, index) in headers">
                    <th
                      class="text-center"
                      v-if="index === 0"
                      :rowspan="2"
                      width="5%"
                      :key="index"
                    >
                      {{ header.text }}
                    </th>
                    <th
                      class="text-center"
                      v-if="index === 1"
                      :rowspan="2"
                      width="15%"
                      :key="index"
                    >
                      {{ header.text }}
                    </th>
                    <th
                      class="text-center"
                      v-if="index === 2"
                      :rowspan="2"
                      width="15%"
                      :key="index"
                    >
                      {{ header.text }}
                    </th>
                    <th
                      class="text-center"
                      v-if="index === 3"
                      :colspan="2"
                      width="25%"
                      :key="index"
                    >
                      {{ header.text }}
                    </th>
                    <th
                      class="text-center"
                      v-if="index === 6"
                      :colspan="2"
                      width="40%"
                      :key="index"
                    >
                      {{ header.text }}
                    </th>
                  </template>
                </tr>
                <tr>
                  <template v-for="(header, index) in headers">
                    <th
                      class="text-center"
                      v-if="index === 4"
                      width="15%"
                      :key="index"
                    >
                      {{ header.text }}
                    </th>
                    <th
                      class="text-center"
                      v-if="index === 5"
                      width="10%"
                      :key="index"
                    >
                      {{ header.text }}
                    </th>
                    <th
                      class="text-center"
                      v-if="index === 7"
                      width="5%"
                      :key="index"
                    >
                      {{ header.text }}
                    </th>
                    <th
                      class="text-center"
                      v-if="index === 8"
                      width="35%"
                      :key="index"
                    >
                      {{ header.text }}
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <template>
                  <tr
                    v-for="(parking, index) in parking_situations"
                    :key="index"
                  >
                    <td class="text-center">
                      {{ per_page * page - per_page + index + 1 }}
                    </td>
                    <td class="text-center">
                      {{ parking.in_out_flg == false ? "入庫" : "出庫" }}
                    </td>
                    <td class="text-center">{{ parking.parking_time }}</td>
                    <td class="text-center">{{ parking.car_number }}</td>
                    <td class="text-center">{{ parking.car_area }}</td>
                    <td class="text-center">{{ parking.camera_id }}</td>
                    <td class="text-left">{{ parking.camera_name }}</td>
                  </tr>
                </template>
              </tbody>
            </template>
          </v-simple-table>
          <v-row
            id="app"
            class="mt-2 justify-center"
            v-if="parking_situations.length > 0"
          >
            <div class="items-select-box mt-2">
              <div class="subtitle-2 font-weight-regular">
                <span>表示行数:</span>
              </div>
              <div class="pl-3" style="width: 50% !important">
                <v-select
                  dense
                  single-line
                  label="10"
                  :items="pages"
                  v-model="per_page"
                  @change="handlePerPage"
                  class="custom-select"
                ></v-select>
              </div>
            </div>
            <div class="text-center">
              <v-pagination
                class="custom"
                v-model="page"
                :length="meta.total_pages"
                :total-visible="7"
                @input="handlePagination"
              ></v-pagination>
            </div>
          </v-row>
        </div>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import GlobalNav from "@/components/GlobalNavBar";
import MediaStyle from "@/styles/globals.scss";
import GlobalPageTitle from "../components/template/GlobalPageTitle.vue";
import BreadCrumbs from "../components/parts/BreadCrumbs.vue";
export default {
  components: {
    GlobalNav,
    MediaStyle,
    GlobalPageTitle,
    BreadCrumbs,
  },
  props: ["sample"],
  data: () => ({
    title_menu: "内部管理機能メニュー",
    title: "駐車場利用状況データ",
    error: null,
    success: null,
    text_box_error: null,
    from_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    to_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    modal: false,
    menu2: false,
    menu3: false,
    showDetailTable: false,
    headers: [
      { text: "No", align: "start", sortable: false, value: "id" },
      { text: "入庫／出庫", sortable: false, value: "in_out" },
      { text: "入出庫日時", sortable: false, value: "parking_time" },
      { text: "ナンバープレート", sortable: false, value: "number_plate" },
      { text: "数字", sortable: false, value: "car_number" },
      { text: "登録地", sortable: false, value: "car_area" },
      { text: "カメラ", sortable: false, value: "camera" },
      { text: "ID", sortable: false, value: "camera_id" },
      { text: "名称", sortable: false, value: "camera_name" },
    ],
    pages: [100, 50, 20, 10],
    selected_location: { id: 0, name: "" },
    page: 1,
    per_page: 10,
    breadCrumbsItems: [
      {
        text: "内部管理機能メニュー",
        disabled: false,
        href: "/management_menu",
      },
      {
        text: "データ確認・ダウンロード",
        disabled: true,
        href: "/parking_situations",
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
      return this.$store.getters["LocationsName/status"];
    },
    locations() {
      return this.$store.getters["LocationsName/locations"];
    },
    reset_error() {
      return this.$store.getters["LocationsName/error"];
    },
    in_count() {
      return this.$store.getters["ParkingSituations/in_count"];
    },
    out_count() {
      return this.$store.getters["ParkingSituations/out_count"];
    },
    parking_situations() {
      return this.$store.getters["ParkingSituations/parkings"];
    },
    meta() {
      return this.$store.getters["ParkingSituations/meta"];
    },
    parking_situations_csv() {
      return this.$store.getters["ParkingSituations/parkings_csv"];
    },
  },
  async mounted() {
    this.getLocationsName().catch(() => {});
  },
  methods: {
    async getLocationsName() {
      await this.$store.dispatch("LocationsName/getName");
      if (this.status == "error") {
        this.errorPage(this.reset_error);
      } else if (this.status == "success") {
        this.text_box_error = null;
        this.error = null;
        this.success = "ok";
      }
    },
    errorPage(error) {
      if (error.status == 401) {
        this.$router.push({
          name: "unauthorized",
        });
      } else {
        this.$router.push({
          name: "internal_server_error",
        });
      }
    },
    async getParkingSituations(from_date, to_date) {
      let params = {
        location_name: this.selected_location.name,
        from_date: from_date,
        to_date: to_date,
        page: this.page,
        per_page: this.per_page,
      };
      await this.$store.dispatch("ParkingSituations/getParkings", params);
    },
    async handlePerPage() {
      this.page = 1;
      this.getParkingSituations(this.from_date, this.to_date);
    },
    async handlePagination() {
      this.getParkingSituations(this.from_date, this.to_date);
    },
    async onSubmit() {
      this.page = 1;
      this.getParkingSituations(this.from_date, this.to_date);
      this.showDetailTable = true;
      // do google analytics event
      this.$gtag("event", "parking_data_view_btn_click", {
        location_name: this.selected_location.name,
        from_date: this.from_date,
        to_date: this.to_date,
      });
    },
    async Back() {
      this.$router.push("/");
    },
    async downloadCSV() {
      try {
        const current = new Date();
        const current_date = current.toJSON().slice(0, 10).replace(/-/g, "");
        const current_time =
          current.getHours() +
          "" +
          current.getMinutes() +
          "" +
          current.getSeconds();
        let params = {
          location_name: this.selected_location.name,
          from_date: this.from_date,
          to_date: this.to_date,
        };
        await this.$store.dispatch("ParkingSituations/getParkingsCsv", params);

        let csv =
          "\ufeff" +
          "No,入庫/出庫,入出庫日時,数字,登録地,カメラID,カメラ名称\n";
        this.parking_situations_csv.forEach((el, index) => {
          let no = index + 1;
          let in_out_flg = el["in_out_flg"] == true ? "出庫" : "入庫";
          let car_number = el["car_number"] == null ? "" : el["car_number"];
          let car_area = el["car_area"] == null ? "" : el["car_area"];
          let line =
            no +
            "," +
            in_out_flg +
            "," +
            el["parking_time"] +
            "," +
            car_number +
            "," +
            car_area +
            "," +
            el["camera_id"] +
            "," +
            el["camera_name"] +
            "\n";
          csv += line;
        });
        let blob = new Blob([csv], { type: "text/csv" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `駐車場利用状況データ_${current_date}${current_time}.csv`;
        link.click();
        // do google analytics event
        this.$gtag("event", "csv_download_btn_click", {
          location_name: this.selected_location.name,
          from_date: this.from_date,
          to_date: this.to_date,
        });
      } catch (error) {
        console.log("error");
      }
    },
    goBack() {
      // this.$router.push("/login");
      this.$router.go(-1);
    },
  },
};
</script>
<style>
.no-background {
  background: none !important;
}
.v-input__slot {
  min-height: 10px;
  margin-top: -5px;
}
.date_picker {
  margin-top: 0;
  padding: 0;
}
.v-application .elevation-1 {
  box-shadow: none !important;
}
.custom .v-pagination__item {
  font-size: 0.85rem;
}
.custom-select {
  font-size: 12px;
}
.v-data-table {
  line-height: 1.5;
  max-width: 100%;
  border: 1px solid lightgray;
}
.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  color: black;
  font-size: 16px !important;
  font-weight: bold;
}
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr:first-child
  > th {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
}
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr:last-child
  > th {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
}
/* .parking-situations-container {
  padding: 0px !important;
} */
</style>
