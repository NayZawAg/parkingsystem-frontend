<template>
  <v-dialog v-model="dialog" max-width="680px" persistent>
    <v-card>
      <v-card-title>
        <v-row justify="center" align-content="center">
          <v-col cols="12" sm="3">
            <BackButton @click="showConfirm()"></BackButton>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            class="d-flex justify-center letter-space font-weight-bold two-columns"
          >
            {{ locationsDetails.name }}
          </v-col>
          <v-col cols="12" sm="3"> </v-col>
        </v-row>
      </v-card-title>
      <GlobalDialogDivider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit" ref="form" id="location_edit_form">
          <v-alert v-if="error != null" type="error" border="left">
            {{ error }}
          </v-alert>
          <v-row class="pt-7">
            <!-- For Desktop View -->
            <v-col cols="6" class="justify-start location-edit-dialog">
              <v-img
                :src="hostImageUrl(`/${locationsDetails.image}`)"
                max-width="280"
                height="187"
              ></v-img>
            </v-col>
            <v-col col="6" class="location-label">
              <v-row>
                <v-col cols="12" xs="12" class="location-edit-dialog">
                  <v-text-field
                    label="駐車場名"
                    id="name"
                    type="text"
                    v-model="form.name"
                    required
                    :rules="getNameRules()"
                    @input="handleNameChange"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" class="location-edit-dialog">
                  <v-text-field
                    label="住所"
                    id="address"
                    type="text"
                    v-model="form.address"
                    :rules="getAddressRules()"
                    @input="handleAddressChange"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" class="location-edit-dialog">
                  <v-text-field
                    label="駐車可能台数"
                    id="capacity"
                    type="text"
                    v-model="form.capacity"
                    required
                    :rules="getCapacityRules()"
                    @input="handleCapacityChange"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" class="location-edit-dialog">
                  <v-textarea
                    label="関連施設・イベント会場"
                    id="related_facilities_events"
                    type="text"
                    v-model="form.related_facilities_events"
                    :rules="getRelatedFacilityEventRules()"
                    @input="handleRelatedFacilityEventChange"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn
                class="upd-vbtn"
                type="submit"
                form="location_edit_form"
                :disabled="!checkAction()"
              >
                更新する
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
    <ConfirmationDialog
      ref="confirmDialog"
      @execute-method="executeMethod"
    ></ConfirmationDialog>
  </v-dialog>
</template>

<script>
import MediaStyle from "@/styles/globals.scss";
import BackButton from "../components/parts/BackButton.vue";
import ConfirmationDialog from "../components/parts/ConfirmationDialog.vue";
import GlobalDialogDivider from "./template/GlobalDialogDivider.vue";

export default {
  components: {
    MediaStyle,
    BackButton,
    ConfirmationDialog,
    GlobalDialogDivider,
  },
  data() {
    return {
      isSmallScreen: false,
      dialog: false,
      confirmDialog: false,
      id: 0,
      maxLength: 255,
      error: null,
      hasChanges: {
        name: false,
        address: false,
        capacity: false,
        related_facilities_events: false,
      },
      form: {
        name: null,
        address: null,
        capacity: null,
        related_facilities_events: null,
      },
      originalData: {},
      getNameRules() {
        return [
          (value) => !!value || "駐車場名は必須項目です。",
          (value) => this.rules.counter("駐車場名", value),
        ];
      },
      getAddressRules() {
        return [(value) => this.rules.counter("住所", value)];
      },
      getCapacityRules() {
        return [
          (value) => {
            const numericValue = Number(value);
            const maxValue = 2147483647;
            const isNumeric = !isNaN(numericValue);
            const isWithinRange =
              Number.isInteger(numericValue) &&
              numericValue >= 0 &&
              numericValue <= maxValue;

            if (!isNumeric) {
              return "駐車可能台数は数字のみ入力してください。";
            }
            if (!isWithinRange) {
              return `駐車可能台数は ${maxValue}以下で入力してください。`;
            }
            return true;
          },
        ];
      },
      getRelatedFacilityEventRules() {
        return [(value) => this.rules.counter("関連・施設イベント", value)];
      },
      rules: {
        counter: (fieldName, value) => {
          if (!value || value.length <= this.maxLength) {
            return true;
          }
          return (
            fieldName + "は" + this.maxLength + " 文字以内で入力してください。"
          );
        },
      },
    };
  },
  computed: {
    locationsDetails() {
      return this.$store.getters["LocationsName/locationsDetails"];
    },
  },
  watch: {
    locationsDetails: {
      handler(newVal) {
        if (newVal) {
          this.form.name = newVal.name;
          this.form.address = newVal.address;
          this.form.capacity = newVal.capacity;
          this.form.related_facilities_events =
            newVal.related_facilities_events;
        }
      },
      immediate: true,
    },
  },
  methods: {
    showConfirm() {
      if (Object.values(this.hasChanges).includes(true)) {
        this.$refs.confirmDialog.openDialog();
      } else {
        this.dialog = false;
      }
    },
    checkAction() {
      return (this.actionFlg = Object.values(this.hasChanges).some(
        (value) => value === true
      ));
    },
    okConfirmClick() {
      this.dialog = false;
      const chkFlg = Object.values(this.hasChanges).some(
        (value) => value === true
      );
      if (chkFlg) {
        Object.keys(this.hasChanges).forEach((key) => {
          this.hasChanges[key] = false;
        });
      }
    },
    async getNameDetail(id) {
      await this.$store.dispatch("LocationsName/getNameDetail", id);
      this.originalData = JSON.parse(JSON.stringify(this.locationsDetails));
    },
    // open dialog
    open(id) {
      this.dialog = true;
      this.id = id;
      this.getNameDetail(id);
    },
    async updateLocationDetail(
      id,
      name,
      address,
      capacity,
      related_facilities_events
    ) {
      await this.$store.dispatch(
        "LocationsName/updateLocationNameDetail",
        id,
        name,
        address,
        capacity,
        related_facilities_events
      );
    },
    async onSubmit() {
      if (this.$refs.form.validate()) {
        try {
          this.updateLocationDetail({
            id: this.id,
            name: this.form.name,
            address: this.form.address,
            capacity: this.form.capacity,
            related_facilities_events: this.form.related_facilities_events,
          });
          this.$router.go(0);
        } catch (error) {
          console.log("error");
        }
      } else {
        return;
      }
    },
    handleNameChange() {
      this.hasChanges.name = this.form.name !== this.originalData.name;
    },
    handleAddressChange() {
      this.hasChanges.address = this.form.address !== this.originalData.address;
    },
    handleCapacityChange() {
      this.originalData.capacity =
        this.originalData.capacity != null ? this.originalData.capacity : "";
      const formCapacity = String(this.form.capacity);
      const originalCapacity = String(this.originalData.capacity);
      this.hasChanges.capacity = formCapacity !== originalCapacity;
    },
    handleRelatedFacilityEventChange() {
      this.hasChanges.related_facilities_events =
        JSON.stringify(this.form.related_facilities_events) !==
        JSON.stringify(
          this.originalData.related_facilities_events.replace(/\r/g, "")
        );
    },
    executeMethod(ret) {
      if (ret) {
        this.okConfirmClick();
      } else {
        this.$refs.confirmDialog.closeDialog();
      }
    },
  },
};
</script>
<style scoped>
.upd-vbtn {
  color: white !important;
  border-radius: 15px !important;
  background-color: red !important;
  font-size: small !important;
  text-align: center !important;
}
.confirm-text {
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>
