<template>
  <v-dialog v-model="dialog" max-width="820" persistent>
    <v-card class="dialog-display">
      <v-card-title class="hide-on-mobile">
        <v-row>
          <v-col cols="12" md="3">
            <BackButton @click="dialog = false" />
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="text-center letter-space font-weight-bold pt-4 parking-title-font"
          >
            {{ parking_location.name }}
            <v-divider
              v-if="parking_location.camera_flag == 1"
              width="390px"
              color="#e2002e"
              class="text-decoration"
            ></v-divider>
            <v-divider
              v-else
              width="270px"
              color="#e2002e"
              class="text-decoration"
            ></v-divider>
          </v-col>
          <v-col cols="12" md="3"> </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="mobile-dialog">
        <v-row class="mr-0">
          <v-col cols="12" md="4" lg="4" class="pr-0">
            <v-img
              :src="hostImageUrl(`/${parking_location.image}`)"
              :transition="'none'"
              class="v-packing-img"
            >
              <BackButton
                @click="dialog = false"
                class="hide-on-pc text-capitalize packing-back-btn"
              />
            </v-img>
          </v-col>
          <v-col cols="12" class="hide-on-pc py-0 pr-0">
            <v-card-text
              class="text--secondary text-caption detail-title"
              v-if="openDataType == 'facility' || openDataType == 'event'"
            >
              Facility/Event Details
            </v-card-text>
            <v-card-text
              class="text--secondary text-caption detail-title"
              v-else
            >
              Parking Details
            </v-card-text>
            <v-card-title class="parking-title">
              {{ parking_location.name }}
            </v-card-title>
            <GlobalDialogDivider />
            <v-card-text
              v-if="openDataType == 'facility' || openDataType == 'event'"
              class="text-center info-title"
              >施設・イベント会場情報</v-card-text
            >
            <v-card-text v-else class="text-center info-title"
              >駐車場情報</v-card-text
            >
          </v-col>
          <v-col cols="12" md="8" lg="8" class="pr-0">
            <v-row class="mr-0">
              <v-col cols="12" class="stop-vehicles pr-0">
                <table
                  class="parking-info-tbl"
                  v-if="openDataType == 'facility' || openDataType == 'event'"
                >
                  <tr>
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold">住所</span>
                        <span>：</span>
                      </div>
                    </td>
                    <td class="pl-0 word-break">
                      {{ parking_location.address }}
                    </td>
                  </tr>
                  <tr>
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold">営業時間</span>
                        <span>：</span>
                      </div>
                    </td>
                    <td class="pl-0 word-break">
                      {{ parking_location.opening_hours }}
                    </td>
                  </tr>
                  <tr>
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold">定休日</span>
                        <span>：</span>
                      </div>
                    </td>
                    <td
                      class="pl-0 word-break new-line"
                      v-text="parking_location.holiday"
                    ></td>
                  </tr>
                  <tr>
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold">利用可能決済</span>
                        <span>：</span>
                      </div>
                    </td>
                    <td class="pl-0 word-break">
                      {{ parking_location.available_payment }}
                    </td>
                  </tr>
                  <tr>
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold">公式サイト</span>
                        <span>：</span>
                      </div>
                    </td>
                    <td class="pl-0">
                      <a
                        :href="parking_location.offical_url"
                        target="_blank"
                        class="link-default word-break"
                        style="
                          color: #337ab7 !important;
                          text-decoration: underline;
                        "
                        >{{ parking_location.offical_url }}</a
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold"
                          >施設・イベント<br />会場概要</span
                        >
                        <span class="mx-0 my-auto">：</span>
                      </div>
                    </td>
                    <td class="pl-0 word-break">
                      {{ parking_location.outline }}
                    </td>
                  </tr>
                </table>
                <table class="parking-info-tbl" v-else>
                  <tr class="hide-on-mobile">
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold">利用状況</span>
                        <span>：</span>
                      </div>
                    </td>
                    <td class="pl-0">
                      <span :class="getCrowdDisplayClass(status)">{{
                        statusDetail[status]
                      }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold">住所</span>
                        <span>：</span>
                      </div>
                    </td>
                    <td class="pl-0 word-break">
                      {{ parking_location.address }}
                    </td>
                  </tr>
                  <tr>
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold">駐車可能台数</span>
                        <span>：</span>
                      </div>
                    </td>
                    <td class="pl-0" v-if="parking_location.capacity == null">
                      -
                    </td>
                    <td class="pl-0" v-else>
                      最大{{ parking_location.capacity }} 台　<span
                        v-if="status === '空車あり'"
                        >駐車可能</span
                      >
                    </td>
                  </tr>
                  <tr class="hide-on-pc">
                    <td class="pr-0">
                      <div class="d-flex parking-info-tbl-title">
                        <span class="font-weight-bold">利用状況</span>
                        <span>：</span>
                      </div>
                    </td>
                    <td class="pl-0 status-detail word-break">
                      {{ statusDetail[status] }}
                    </td>
                  </tr>
                </table>
              </v-col>
            </v-row>
            <!-- data type select -->
            <Select
              v-if="parking_location.camera_flag == 1"
              ref="select"
              :parking_location="parking_location"
            ></Select>
          </v-col>
        </v-row>
        <v-row class="mr-0" style="height: 50px">
          <v-col class="d-flex justify-center get-direction-btn">
            <v-btn
              class="update-btn"
              style="color: white !important"
              :href="`https://www.google.com/maps/dir/?api=1&destination=${this.latlng}&travelmode=driving`"
              target="_blank"
              absolute
              bottom
            >
              行き方を見る
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Select from "@/components/DayTypeSelect.vue";
import BackButton from "@/components/parts/BackButton.vue";
import GlobalDialogDivider from "@/components/template/GlobalDialogDivider.vue";
import MediaStyle from "@/styles/globals.scss";
export default {
  components: {
    Select,
    BackButton,
    GlobalDialogDivider,
    MediaStyle,
  },
  data() {
    return {
      latlng: "",
      dialog: false,
      parking_location: {},
      status: "",
      openDataType: "parking",
      statusDetail: {
        2: "空車あり",
        3: "ほぼ満車",
        4: "満車",
        98: "―",
        99: "調整中",
      },
    };
  },
  computed: {
    // get congestion rates
    congestion_rates() {
      return this.$store.getters["CongestionRates/congestion_rates"];
    },
    congestion_rates_status() {
      return this.$store.getters["CongestionRates/status"];
    },
    congestion_rates_error() {
      return this.$store.getters["CongestionRates/error"];
    },
  },
  methods: {
    // open dialog
    open(status, parking_location) {
      this.latlng = parking_location.lat + ", " + parking_location.lng;
      if (parking_location.facility_location_kbn == 1) {
        // 1：施設、2：イベント
        if (parking_location.facility_event_type == 1)
          this.openDataType = "facility";
        if (parking_location.facility_event_type == 2)
          this.openDataType = "event";
      } else {
        this.openDataType = "parking";
      }
      // congestion rates
      if (parking_location.camera_flag == 1)
        this.congestionRates(parking_location);

      this.dialog = true;
      this.parking_location = parking_location;
      this.status = status;
    },

    async congestionRates(parking_location) {
      let location_params = {
        id: parking_location.id,
        day_type: "holiday",
      };
      // call get congestion rates of store
      await this.$store.dispatch(
        "CongestionRates/getCongestionRates",
        location_params
      );
      if (this.congestion_rates_status == "success") {
        // change chart data of congestion rates chart
        this.$root.$emit("ChangeChartData");
        // set select default item of select
        this.$refs.select.selectItem = "休日・祝日";
      } else if (this.congestion_rates_status == "error") {
        // error page
        this.errorPage(this.congestion_rates_error);
      }
    },
    getCrowdDisplayClass(status) {
      switch (status) {
        case 1:
          return "status-font background-auto";
        case 2:
          return "status-font background-empty";
        case 3:
          return "status-font background-almostfull";
        case 4:
          return "status-font background-full";
        case 99:
          return "status-font background-underadjustment";
        default:
          return "";
      }
    },
    errorPage(error) {
      if (error.status == 400) {
        // Go to bad_request page
        this.$router.push({
          name: "bad_request",
        });
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
  },
};
</script>
<style lang="scss">
.condition {
  font-size: 21px;
  color: black;
}
.status-font {
  padding: 8px 11px 8px 11px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 20px;
}
.background-auto {
  background-color: $bg-color-auto !important;
}
.background-empty {
  color: $txt-color-empty !important;
  background-color: $bg-color-empty !important;
}
.background-full {
  color: $txt-color-full !important;
  background-color: $bg-color-full !important;
}
.background-almostfull {
  color: $txt-color-almostfull;
  background-color: $bg-color-almostfull !important;
}
.background-underadjustment {
  background-color: $bg-color-underadjustment !important;
}
.under-adjustment {
  font-size: 18px;
  margin-left: 10px;
}
.dialog-title {
  font-size: 18px;
  color: #000;
}
.parking-title {
  font-size: 14px;
  line-height: 1;
  font-weight: 700 !important;
  letter-spacing: 2px !important;
  padding-bottom: 18px !important;
}
.detail-title {
  padding: 0px 16px !important;
  line-height: 1rem !important;
}
.info-title {
  font-weight: 600 !important;
  letter-spacing: 3px;
  font-size: 0.75rem;
  font-family: "Roboto", sans-serif !important;
  padding: 0px 16px !important;
  line-height: 0.8rem;
}
.parking-title-font {
  font-size: 1.125rem !important;
}
.status-detail {
  letter-spacing: 3px;
}
.stop-vehicles {
  padding-top: 10px;
}
.parking-info-tbl tr td:first-child {
  min-width: 130px;
}
.theme--light.v-btn:hover::before {
  opacity: 0 !important;
}
.v-packing-img > .v-responsive__sizer {
  flex: none !important;
  padding-bottom: 0% !important;
}
.parking-info-tbl-title {
  justify-content: space-between;
}
.word-break {
  word-break: break-all;
}
.new-line {
  white-space: pre-wrap;
}
.get-direction-btn a {
  color: #fff !important;
}
</style>