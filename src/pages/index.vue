<template>
  <v-main class="index-main">
    <v-container
      class="pa-md-3 pa-lg-3 pa-xl-3 index-main-container"
      fluid
      v-if="this.status == 'success'"
    >
      <global-nav
        title_menu="内部管理機能メニュー"
        menulink="/management_menu"
      />
      <v-row class="index-fill-height d-flex" fluid>
        <v-col
          cols="12"
          md="12"
          class="index-pa-3 index-order-sm-1 index-order-md-3"
          :style="touchSwiperMap"
        >
          <div class="d-flex d-flex-row">
            <div style="width: 320px" class="hide-on-mobile">
              <v-card class="facility-sidebar" flat>
                <v-list two-line class="v-facility-list">
                  <v-list-item-group
                    :mandatory="clicked ? '' : null"
                    v-model="facility_event_selected"
                    active-class="red--text"
                  >
                    <template v-for="(facility, index) in facilities_list">
                      <v-list-item
                        v-if="facility.display_flag == 1"
                        :key="index"
                        @click="
                          handleClick(
                            facility.lat,
                            facility.lng,
                            facility.scale,
                            facility.name,
                            facility.gtag_event_card_name
                          )
                        "
                        class="rounded-list ma-md-1"
                      >
                        <template>
                          <v-list-item-content>
                            <div class="d-md-flex flex-md-row">
                              <v-img
                                :src="
                                  hostImageUrl(`/icons/${facility.icon}.png`)
                                "
                                width="22"
                                max-height="32"
                              ></v-img>
                              <v-list-item-title
                                class="facility-name-text font-weight-bold"
                                style="margin-left: 10px"
                              >
                                {{ facility.name }}
                              </v-list-item-title>
                            </div>
                            <v-img
                              :src="hostImageUrl(`/${facility.image}`)"
                              max-width="170"
                              height="110"
                              style="margin: 0px auto !important"
                            >
                            </v-img>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </div>
            <div class="gmap-container" :class="gmapContainerClass">
              <div
                class="swipe-divider-area-bottom hide-on-pc ma-0"
                @touchstart="touchStartMap"
                @touchmove="touchMoveMap"
                @touchend="touchEndMap"
                v-if="swipeDownMap"
              >
                <v-divider
                  class="swipe-divider ma-4 poyoyon is-animated"
                  width="70px"
                  color="#404040"
                >
                </v-divider>
              </div>
              <GmapMap
                map-type-id="roadmap"
                ref="gmp"
                :center="center_location"
                :zoom="zoom"
                :style="{
                  width: '100%',
                  height: '100%',
                }"
                :options="{
                  streetViewControl: false,
                  styles: [],
                  backgroundColor: 'white',
                  zoomControl: true,
                  zoomControlOptions: {
                    position: 3,
                  },
                }"
              >
                <gmap-polygon
                  :paths="[polygon.outerPaths, polygon.innerPaths]"
                  :options="polygon.polygonOptions"
                  ref="google_map_polygon"
                >
                </gmap-polygon>
                <GmapMarker
                  :key="index"
                  v-for="(parking_location, index) in parking_locations"
                  :title="parking_location.name"
                  :position="parking_location.position"
                  :clickable="true"
                  :draggable="false"
                  :visible="true"
                  :icon="{
                    url: hostImageUrl(`/icons/${parking_location.icon}.png`),
                    scaledSize:
                      parking_location.facility_location_kbn === 1
                        ? { width: 40, height: 60, f: 'px', b: 'px' }
                        : { width: 73, height: 81, f: 'px', b: 'px' },
                  }"
                  class=""
                  @click="onClickMarker(parking_location)"
                >
                </GmapMarker>
              </GmapMap>
              <!-- dialog -->
              <Dialog ref="dialog"></Dialog>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="12"
          class="index-order-sm-2 index-order-md-1 hide-on-mobile"
        >
          <v-row>
            <div
              class="index-title-container-left"
              style="display: flex; align-items: flex-end"
            >
              <div class="mr-8">
                <p
                  class="mb-1 index-ml-7 facility-list-decoration font-weight-bold"
                >
                  施設・イベント会場一覧
                </p>
              </div>
            </div>
            <div class="index-title-container-center">
              <h2 class="show-on-lg title-size text-center title-space mt-5">
                三次市駐車場混雑表示サービス
              </h2>
              <h2 class="hide-on-lg title-size text-center title-space mt-5">
                三次市駐車場混雑表示<br />サービス
              </h2>
              <v-divider
                color="#e2002e"
                class="title-divider text-decoration"
              ></v-divider>
              <p class="text-center sub-title pt-1 mb-0">
                地図内のアイコンをクリックしてください。<br />
                施設・イベント会場の情報や駐車場の混雑状況が確認できます。
              </p>
            </div>
            <div class="facility-list-legend index-title-container-right">
              <!-- PC 凡例の地図デザイン -->
              <table class="table-border table-position-right mt-3 mr-3 px-1">
                <tbody>
                  <tr>
                    <td class="td-camera-off-pc-style">
                      <v-img
                        :src="hostImageUrl(`/icons/camera_on_available.png`)"
                        width="34"
                        max-height="32"
                      ></v-img>
                    </td>
                    <td class="font-weight-bold legend-text pl-2">
                      ：駐車場（入出庫自動カウント有）
                    </td>
                  </tr>
                  <tr>
                    <td class="td-camera-off-pc-style">
                      <v-img
                        :src="hostImageUrl(`/icons/camera_off_available.png`)"
                        width="34"
                        max-height="22"
                        style="margin-left: 2px"
                      ></v-img>
                    </td>
                    <td class="font-weight-bold legend-text pl-2">：駐車場</td>
                  </tr>
                  <tr>
                    <td class="facility-icon-style">
                      <v-img
                        :src="hostImageUrl(`/icons/facility.png`)"
                        width="20"
                      ></v-img>
                    </td>
                    <td class="font-weight-bold text-overline pl-2">
                      ：施設・イベント会場
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- PC 凡例の地図デザイン -->
            </div>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          md="12"
          class="facility-list-area index-order-sm-2 index-order-md-1 hide-on-pc"
          :style="touchSwiper"
          v-if="!swipeDownMap"
          ref="swipe"
        >
          <div class="swipe-divider-area-top-parent pa-3">
            <div
              class="swipe-divider-area-top-child"
              @touchstart="touchStart"
              @touchmove="touchMove"
              @touchend="touchEnd"
            >
              <v-divider
                class="swipe-divider ma-6"
                width="70px"
                color="#404040"
              >
              </v-divider>
            </div>
          </div>
          <v-row class="ml-0 mr-0">
            <div
              class="facility-list-title index-title-container-left"
              style="display: flex; align-items: flex-end"
            >
              <div>
                <p class="text--secondary mb-1 text-caption">
                  Facility/Event list
                </p>
                <p
                  class="mb-1 index-ml-7 facility-list-decoration font-weight-bold"
                >
                  施設・イベント会場一覧
                </p>
              </div>
            </div>
            <div class="index-title-container-right" v-if="!swipeUp">
              <!-- SP 凡例の地図デザイン -->
              <table
                class="table-border table-position-right mt-3 mr-3 mb-4 legend-sm px-1"
              >
                <tbody>
                  <tr>
                    <td class="td-camera-off-sp-style">
                      <v-img
                        :src="hostImageUrl(`/icons/camera_on_available.png`)"
                        width="16"
                      ></v-img>
                    </td>
                    <td
                      class="font-weight-bold pl-1"
                      style="text-wrap: nowrap !important"
                    >
                      ：駐車場（入出庫自動カウント有）
                    </td>
                  </tr>
                  <tr>
                    <td class="td-camera-off-sp-style">
                      <v-img
                        :src="hostImageUrl(`/icons/camera_off_available.png`)"
                        width="16"
                      ></v-img>
                    </td>
                    <td class="font-weight-bold pl-1">：駐車場</td>
                  </tr>
                  <tr>
                    <td class="facility-icon-sp-style">
                      <v-img
                        :src="hostImageUrl(`/icons/facility.png`)"
                        width="9"
                      ></v-img>
                    </td>
                    <td class="font-weight-bold pl-1">：施設・イベント会場</td>
                  </tr>
                </tbody>
              </table>
              <!-- SP 凡例の地図デザイン -->
            </div>
          </v-row>
        </v-col>
        <!-- SP Sidebarデザイン -->
        <v-col
          cols="12"
          md="2"
          class="facility-sidebar-area pt-0 pb-0 index-order-sm-3 index-order-md-2 hide-on-pc"
          :style="facilitySidebar"
          v-if="!swipeDownMap"
        >
          <v-card flat>
            <v-list three-line>
              <v-list-item-group
                v-model="facility_event_selected"
                :mandatory="clicked ? '' : null"
                active-class="red--text"
              >
                <v-divider></v-divider>
                <template v-for="(facility, index) in facilities_list">
                  <v-list-item
                    v-if="facility.display_flag == 1"
                    :key="index"
                    @click="
                      onClickHandler(
                        facility.lat,
                        facility.lng,
                        facility.scale,
                        facility.name,
                        facility.gtag_event_card_name
                      )
                    "
                  >
                    <div class="pl-0 mr-2">
                      <v-img
                        :src="hostImageUrl(`/${facility.image}`)"
                        width="114"
                        height="74"
                      >
                      </v-img>
                    </div>
                    <div>
                      <v-img
                        :src="hostImageUrl(`/icons/${facility.icon}.png`)"
                        width="20"
                        max-height="30"
                      ></v-img>
                    </div>
                    <v-list-item-content>
                      <v-list-item-title
                        class="facility-name-text font-weight-bold"
                        style="margin-left: 10px"
                      >
                        {{ facility.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider
                    v-if="index < facilities_list.length - 1"
                    :key="`D${index}`"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
        <!-- SP Sidebarデザイン -->
      </v-row>
    </v-container>
    <GlobalFooter />
    <CookieBanner />
  </v-main>
</template>

<script>
import Dialog from "@/components/ParkingDialog.vue";
import GlobalNav from "@/components/GlobalNavBar";
import MediaStyle from "@/styles/globals.scss";
import CookieBanner from "@/components/template/CookieBanner";
import GlobalFooter from "@/components/template/GlobalFooter";
import MiyoshiBoundaries from "@/assets/MiyoshiBoundaries.json";
export default {
  name: "MapPage",
  components: {
    Dialog,
    GlobalNav,
    MediaStyle,
    CookieBanner,
    GlobalFooter,
    MiyoshiBoundaries,
  },
  data() {
    return {
      title: "三次市　駐車場混雑表示サービス",
      indexCounter: 1,
      // gmapmap
      center_location: {
        lat: 0,
        lng: 0,
      },
      polygon: {
        outerPaths: [
          { lng: -180, lat: 90 },
          { lng: 180, lat: 90 },
          { lng: 180, lat: -90 },
          { lng: 0, lat: -90 },
          { lng: -180, lat: -90 },
        ],
        innerPaths: [],
        polygonOptions: {
          strokeColor: "#000000ff",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#8a8a8a",
          fillOpacity: 0.35,
        },
      },
      zoom: 13.0,
      parking_locations: [],
      facility_event_selected: null,
      facilities_list: [],
      url_slug_type: null,
      url_slug: null,
      facility_event_type: null,
      gmapContainerStyle: {
        height: "calc(100svh - 55svh) !important",
      },
      gmapContainerClass: "",
      height: 0,
      position: 0,
      swiperHeight: 0,
      startY: 0,
      moveY: 0,
      swipeDownMap: false,
      clicked: false,
      swipeUp: false,
      touchSwiperMap: { transform: "translate3d(0, 0, 0)" },
      touchSwiper: { transform: "translate3d(0, 0, 0)", top: "45svh" },
      facilitySidebar: {
        transform: "translate3d(0, 0, 0)",
        top: "calc(45svh + 104px)",
        maxHeight: "calc(100svh - 50px - 104px - 45svh)",
        overflowY: "auto !important",
      },
      numberType: 1, // 0:auto, 1:manual
      gtagFlag: false,
    };
  },
  head() {
    return {
      titleTemplate: "",
      title: this.title,
      timer: "",
    };
  },
  watch: {
    center_location(newCenter) {
      this.$refs.gmp.panTo(newCenter);
    },
  },
  created() {
    this.setQuery();
    this.getCoordinates();
  },
  computed: {
    locations() {
      return this.$store.getters["Locations/locations"];
    },
    status() {
      return this.$store.getters["Locations/status"];
    },
    location_error() {
      return this.$store.getters["Locations/error"];
    },
    facilities() {
      return this.$store.getters["FacilitiesEvent/facilities"];
    },
    facilities_status() {
      return this.$store.getters["FacilitiesEvent/status"];
    },
    facilities_error() {
      return this.$store.getters["FacilitiesEvent/error"];
    },
  },
  async mounted() {
    this.getLocations(true);

    //reflex
    this.timer = setInterval(() => {
      // call get locations
      this.getLocations(false);
    }, 30000);

    this.calculateViewportHeight();
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    getCookieState(name) {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
          return cookieValue;
        }
      }
      return null;
    },
    getCoordinates() {
      const innerPaths = [];
      MiyoshiBoundaries.features.forEach((feature) => {
        const coordinatesObjectArrs = feature.geometry.coordinates[0][0];
        coordinatesObjectArrs.forEach((coordinatesObjectArr) => {
          innerPaths.push({
            lng: coordinatesObjectArr[0],
            lat: coordinatesObjectArr[1],
          });
        });
      });
      this.polygon.innerPaths = [
        innerPaths[0],
        ...innerPaths.slice(1).reverse(),
      ];
    },
    calculateViewportHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },
    handleResize() {
      this.calculateViewportHeight();
    },
    touchStartMap(e) {
      this.startY = e.touches[0].pageY;
    },
    touchMoveMap(e) {
      this.moveY = e.touches[0].pageY - this.startY;
    },
    touchEndMap() {
      if (this.moveY < -10) {
        this.swipeDownMap = false;
        this.gmapContainerClass = "swipe-up";
      }
    },
    touchStart(e) {
      this.startY = e.touches[0].pageY;
      this.swiperHeight = this.$refs.swipe.offsetHeight;
    },
    touchMove(e) {
      this.moveY = e.touches[0].pageY - this.startY;
    },
    touchEnd() {
      if (this.moveY < -10) {
        this.swipeUp = true;
        this.touchSwiperMap.position = "relative";
        this.touchSwiper.position = this.facilitySidebar.position = "absolute";
        this.touchSwiper.top = "35px";
        this.facilitySidebar.top = "105px";
        this.facilitySidebar.maxHeight = "calc(100svh - 50px - 104px)";
        this.facilitySidebar.transition = this.touchSwiper.transition =
          "top 500ms";
      } else if (this.moveY > 10) {
        if (this.swiperHeight > 79) {
          this.swipeDownMap = true;
          this.gmapContainerClass = "swipe-down";
          this.touchSwiper.position = this.facilitySidebar.position = "initial";
        } else {
          this.swipeUp = false;
          this.touchSwiper.top = "45svh";
          this.facilitySidebar.top = "calc(45svh + 104px)";
          this.facilitySidebar.maxHeight =
            "calc(100svh - 50px - 104px - 45svh)";
          this.touchSwiper.zIndex = this.facilitySidebar.zIndex = "199";
        }
      }
    },
    setQuery() {
      const facility_params = this.$route.query.facility || "";
      const event_params = this.$route.query.event || "";
      if (facility_params != "") {
        this.url_slug_type = "facility";
        this.url_slug = facility_params;
        this.facility_event_type = 1;
      } else if (event_params != "") {
        this.url_slug_type = "event";
        this.url_slug = event_params;
        this.facility_event_type = 2;
      }
    },
    async getLocations(centerLocationFlag) {
      await Promise.all([
        // call get locations of store
        this.$store.dispatch("Locations/getLocations"),
        // call get facilities of store
        this.$store.dispatch("FacilitiesEvent/getFacilities"),
      ]);
      if (this.status == "success") {
        // call set locations
        this.setLocations(centerLocationFlag);

        // call set facilities
        this.setFacilities(centerLocationFlag);
      } else if (this.status == "error") {
        // error page
        this.errorPage(this.location_error);
      }
    },
    setLocations(centerLocationFlag) {
      if (this.locations) {
        this.locations.map((location) => {
          if (location.display_flag == 1) {
            location.facility_location_kbn = 2;
            let remainParkingSpace =
              location.capacity_calculation - location.current_total_count;
            switch (location.crowd_level_display) {
              case 1:
                if (remainParkingSpace < 3) {
                  location.status = "nearlyFull";
                  location.icon = location.camera_flag
                    ? "camera_on_full"
                    : "camera_off_full";
                  if (location.icon_revert_flag == 1) {
                    location.icon = location.camera_flag
                      ? "camera_on_full"
                      : "camera_off_full";
                  }
                } else if (remainParkingSpace > 5) {
                  location.status = "nearlyEmpty";
                  location.icon = location.camera_flag
                    ? "camera_on_available"
                    : "camera_off_available";
                  if (location.icon_revert_flag == 1) {
                    location.icon = location.camera_flag
                      ? "camera_on_available"
                      : "camera_off_available";
                  }
                } else if (3 <= remainParkingSpace && remainParkingSpace <= 5) {
                  location.status = "available";
                  location.icon = location.camera_flag
                    ? "camera_on_nearly_full"
                    : "camera_off_nearly_full";
                  if (location.icon_revert_flag == 1) {
                    location.icon = location.camera_flag
                      ? "camera_on_nearly_full"
                      : "camera_off_nearly_full";
                  }
                }
                break;
              case 2:
                location.icon = location.camera_flag
                  ? "camera_on_available"
                  : "camera_off_available";
                if (location.icon_revert_flag == 1) {
                  location.icon = location.camera_flag
                    ? "camera_on_available"
                    : "camera_off_available";
                }
                break;
              case 3:
                location.icon = location.camera_flag
                  ? "camera_on_nearly_full"
                  : "camera_off_nearly_full";
                if (location.icon_revert_flag == 1) {
                  location.icon = location.camera_flag
                    ? "camera_on_nearly_full"
                    : "camera_off_nearly_full";
                }
                break;
              case 4:
                location.icon = location.camera_flag
                  ? "camera_on_full"
                  : "camera_off_full";
                if (location.icon_revert_flag == 1) {
                  location.icon = location.camera_flag
                    ? "camera_on_full"
                    : "camera_off_full";
                }
                break;
              case 98:
              case 99:
                location.icon = location.camera_flag
                  ? "camera_on_adjustment"
                  : "camera_off_adjustment";
                if (location.icon_revert_flag == 1) {
                  location.icon = location.camera_flag
                    ? "camera_on_adjustment"
                    : "camera_off_adjustment";
                }
                break;
            }

            location.position = {
              lat: Number(location.lat),
              lng: Number(location.lng),
            };
            this.parking_locations.push(location);
          }
        });
      }
      // center location
      if (centerLocationFlag) this.centerLocation();
    },
    // set facilities
    setFacilities(centerLocationFlag) {
      if (this.facilities) {
        let indexNumber = 1;
        this.facilities_list = [];
        this.facilities.forEach((facility, index) => {
          if (facility.display_flag == 1) {
            facility.facility_location_kbn = 1;
            let iconNumber = (
              "000" +
              (this.numberType === 1
                ? facility.facilitiy_event_number
                : indexNumber)
            ).slice(-3);
            facility.icon = "facility" + iconNumber;
            if (facility.icon_revert_flag == 1) {
              facility.icon = "facility_revert" + iconNumber;
            }
            if (iconNumber === "000") {
              facility.icon = "facility";
            }
            facility.position = {
              lat: Number(facility.lat),
              lng: Number(facility.lng),
            };
            this.parking_locations.push(facility);
            this.facilities_list.push(facility);

            indexNumber = indexNumber + 1;
          }
        });
      }
      // center location
      if (centerLocationFlag) this.centerLocation();
    },
    centerLocation() {
      let lat = 0;
      let lng = 0;
      let showFacilityEvent = null;
      if (this.url_slug != null && this.url_slug != "") {
        showFacilityEvent = this.facilities_list.find(
          (facility) =>
            facility.slug == this.url_slug &&
            facility.facility_event_type == this.facility_event_type
        );
      }
      if (showFacilityEvent) {
        this.gtagFlag = false;
        this.onClickFacilityEvent(
          showFacilityEvent.lat,
          showFacilityEvent.lng,
          showFacilityEvent.scale
        );
      } else {
        if (this.parking_locations.length != 0) {
          lat = this.parking_locations.reduce(
            (sum, location) => sum + Number(location.lat),
            0
          );
          lng = this.parking_locations.reduce(
            (sum, location) => sum + Number(location.lng),
            0
          );
          this.center_location = {
            lat: lat / this.parking_locations.length,
            lng: lng / this.parking_locations.length,
          };
        }
        if (this.facilities_list.length != 0) {
          lat =
            lat +
            this.facilities_list.reduce(
              (sum, facility) => sum + Number(facility.lat),
              0
            );
          lng =
            lng +
            this.facilities_list.reduce(
              (sum, facility) => sum + Number(facility.lng),
              0
            );
          this.center_location = {
            lat:
              lat /
              (this.facilities_list.length + this.parking_locations.length),
            lng:
              lng /
              (this.facilities_list.length + this.parking_locations.length),
          };
        }
        if (
          this.parking_locations.length === 0 &&
          this.facilities_list.length === 0
        ) {
          this.center_location = {
            lat: 0,
            lng: 0,
          };
        }
      }
    },
    onClickTouchSwiper() {
      if (this.swiperHeight >= 104) {
        this.swipeUp = false;
        this.touchSwiper.top = "45svh";
        this.facilitySidebar.top = "calc(45svh + 104px)";
        this.facilitySidebar.maxHeight = "calc(100svh - 50px - 104px - 45svh)";
        this.touchSwiper.zIndex = this.facilitySidebar.zIndex = "199";
      }
    },
    // facility_event icon location center
    handleClick(lat, lng, scale, name, gtag_event_card_name) {
      this.clicked = true;
      this.gtagFlag = true;
      this.onClickFacilityEvent(lat, lng, scale, name, gtag_event_card_name);
    },
    onClickFacilityEvent(lat, lng, scale, name, gtag_event_card_name) {
      let gtagEventCardName = "facility_card_click";
      if (gtag_event_card_name != null) {
        gtagEventCardName = gtag_event_card_name;
      }
      if (this.getCookieState("acceptCookies") === "true" && this.gtagFlag) {
        this.$gtag("event", gtagEventCardName, {
          parking_name: name,
        });
      }
      (this.center_location = {
        lat: Number(lat),
        lng: Number(lng),
      }),
        (this.zoom = Number(scale));
    },
    async onClickMarker(parking_location) {
      // do google analytics event
      this.gtagFlag = true;
      let gtagEventName = "parking_icon_click";
      if (parking_location.gtag_event_name != null) {
        gtagEventName = parking_location.gtag_event_name;
      }
      if (this.getCookieState("acceptCookies") === "true" && this.gtagFlag) {
        this.$gtag("event", gtagEventName, {
          parking_name: parking_location.name,
          parking_status: parking_location.status,
        });
      }
      // dialog
      let status = "";
      if (parking_location.crowd_level_display == 1) {
        if (parking_location.status == "nearlyEmpty") {
          status = 2;
        } else if (parking_location.status == "available") {
          status = 3;
        } else if (parking_location.status == "nearlyFull") {
          status = 4;
        }
      } else {
        status = parking_location.crowd_level_display;
      }
      // open dialog
      await this.$refs.dialog.open(status, parking_location);
    },
    errorPage(error) {
      if (error.status == 401) {
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
    onClickHandler(lat, lng, scale, name, gtag_event_card_name) {
      this.clicked = true;
      this.gtagFlag = true;
      this.onClickFacilityEvent(lat, lng, scale, name, gtag_event_card_name);
      this.onClickTouchSwiper();
    },
  },
};
</script>

<style>
.v-application--wrap {
  min-height: 100svh !important;
}
.chatbox-text {
  font-size: 10px;
}
.title-text {
  font-size: 12px;
  letter-spacing: 3px;
}
.title-space {
  letter-spacing: 8px;
  line-height: 1.3;
}
.text-decoration {
  border-width: 1.8px !important;
  margin: auto auto auto auto;
}
.facility-name-text {
  font-size: 12px !important;
  letter-spacing: 1px !important;
  text-wrap: wrap !important;
}
.v-avatar-index {
  border: 1px solid black;
}
.v-list-item-group .v-list-item--active .v-avatar-index {
  border: 1px solid red;
}
.rounded-list {
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  box-shadow: 4px 3px 3px #e0e0e0;
}
.table-border {
  border: 1px solid #d3d3d3;
}
.table-position-right {
  margin: 0 0 0 auto;
}
.sub-title {
  font-weight: 400;
  font-size: 0.715rem;
  line-height: 1.2rem;
  letter-spacing: 0.0333333333em !important;
  font-family: "Roboto", sans-serif !important;
}
.legend-text {
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.25rem;
  letter-spacing: 0.0333333333em !important;
  font-family: "Roboto", sans-serif !important;
}
.legend-sm {
  font-size: 0.46875rem !important;
  line-height: 0.875rem !important;
}
.swipe-divider-area-top-parent {
  position: relative;
}
.swipe-divider-area-top-child {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
}
.swipe-divider-area-bottom {
  position: absolute;

  z-index: 998;
  bottom: 0px;
  width: 100% !important;
  background-color: white !important;
  border-radius: 50px 50px 0 0 !important;
}
.swipe-divider-area-bottom hr {
  z-index: 1000;
}
.swipe-divider-area-bottom hr.poyoyon.is-animated {
  margin: 16px auto !important;
}
.swipe-divider {
  border-width: 2.8px !important;
}
div.facility-list-area {
  border-radius: 50px 50px 0 0;
  padding: 12px 0 12px 0;
  background-color: white;
}
div.facility-list-legend {
  padding-right: 12px !important;
}
div.facility-list-title {
  padding-left: 12px !important;
}
div.facility-sidebar-area {
  padding: 0 !important;
}
div.facility-sidebar-area > div > div > div > hr {
  margin: 0 12px !important;
}
div.facility-sidebar-area > div > div > div > div {
  padding: 0 28px !important;
}
.v-facility-list {
  width: 270px !important;
}
.poyoyon.is-animated {
  animation: poyoyon 1s cubic-bezier(0.12, 0, 0.39, 0) 1 forwards;
}
@keyframes poyoyon {
  0% {
    transform: translateY(10px);
  }
  30% {
    transform: translateY(0);
  }
  45% {
    transform: translateY(6px);
  }
  60% {
    transform: translateY(0);
  }
  80% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(0);
  }
  0%,
  100% {
    opacity: 1;
  }
}
.facility-icon-style {
  padding-left: 8px !important;
}
.facility-icon-sp-style {
  padding-left: 4px !important;
}
.td-camera-off-pc-style {
  max-height: 30px !important;
  display: flex;
}
.td-camera-off-sp-style {
  max-height: 14px !important;
  display: flex;
}
</style>
