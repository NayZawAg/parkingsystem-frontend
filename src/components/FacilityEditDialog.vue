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
            class="d-flex justify-center letter-space font-weight-bold"
          >
            {{ facilitiesDetail.name }}
          </v-col>
          <v-col cols="12" sm="3"> </v-col>
        </v-row>
      </v-card-title>
      <GlobalDialogDivider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit" ref="form" id="facility_edit_form">
          <v-alert v-if="error != null" type="error" border="left">
            {{ error }}
          </v-alert>
          <v-row class="pt-7">
            <v-col cols="6" class="justify-start facility-edit-dialog">
              <v-img
                :src="hostImageUrl(`/${facilitiesDetail.image}`)"
                max-width="280"
                height="187"
              ></v-img>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="12" class="facility-label">
                  <v-text-field
                    label="住所"
                    id="address"
                    type="text"
                    v-model="form.address"
                    :rules="getAddressRules()"
                    @input="handleAddressChange"
                  ></v-text-field>
                  <v-text-field
                    label="営業時間"
                    id="opening_hours"
                    type="text"
                    v-model="form.opening_hours"
                    :rules="getOpeningHourRules()"
                    @input="handleOpeningHourChange"
                  ></v-text-field>
                  <v-textarea
                    label="定休日"
                    rows="2"
                    id="holiday"
                    type="text"
                    v-model="form.holiday"
                    :rules="getHolidayRules()"
                    @input="handleHolidayChange"
                  ></v-textarea>
                  <v-text-field
                    label="利用可能決済"
                    id="available_payment"
                    type="text"
                    v-model="form.available_payment"
                    :rules="getPaymentRules()"
                    @input="handlePaymentChange"
                  ></v-text-field>
                  <v-text-field
                    label="公式サイト"
                    id="offical_url"
                    type="text"
                    v-model="form.offical_url"
                    :rules="getUrlRules()"
                    @input="handleUrlChange"
                  ></v-text-field>
                  <v-textarea
                    label="施設・イベント会場概要"
                    id="outline"
                    type="text"
                    v-model="form.outline"
                    :rules="getOutlineRules()"
                    @input="handleOutlineChange"
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
                form="facility_edit_form"
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
      dialog: false,
      confirmDialog: false,
      id: 0,
      maxLength: 255,
      error: null,
      actionFlg: false,
      hasChanges: {
        address: false,
        opening_hours: false,
        holiday: false,
        available_payment: false,
        offical_url: false,
        outline: false,
      },
      form: {
        address: null,
        opening_hours: null,
        holiday: null,
        available_payment: null,
        offical_url: null,
        outline: null,
      },
      originalData: {},
      getAddressRules() {
        return [(value) => this.rules.counter("住所", value)];
      },
      getOpeningHourRules() {
        return [(value) => this.rules.counter("営業時間", value)];
      },
      getHolidayRules() {
        return [(value) => this.rules.counter("定休日", value)];
      },
      getPaymentRules() {
        return [(value) => this.rules.counter("利用可能決済", value)];
      },
      getUrlRules() {
        return [
          (value) => this.rules.counter("公式サイト", value),
          (value) =>
            !value ||
            /^(http|https):\/\/[^ "]+$/.test(value) ||
            "公式サイトの形式が不正です。",
        ];
      },
      getOutlineRules() {
        return [(value) => this.rules.counter("施設概要", value)];
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
    facilitiesDetail() {
      return this.$store.getters["FacilitiesEvent/facilitiesDetail"];
    },
  },
  watch: {
    facilitiesDetail: {
      handler(newVal) {
        if (newVal) {
          this.form.address = newVal.address;
          this.form.opening_hours = newVal.opening_hours;
          this.form.holiday = newVal.holiday;
          this.form.available_payment = newVal.available_payment;
          this.form.offical_url = newVal.offical_url;
          this.form.outline = newVal.outline;
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleAddressChange() {
      this.hasChanges.address = this.form.address !== this.originalData.address;
    },
    handleOpeningHourChange() {
      this.hasChanges.opening_hours =
        this.form.opening_hours !== this.originalData.opening_hours;
    },
    handleHolidayChange() {
      this.hasChanges.holiday =
        JSON.stringify(this.form.holiday) !==
        JSON.stringify(this.originalData.holiday.replace(/\r/g, ""));
    },
    handlePaymentChange() {
      this.originalData.available_payment =
        this.originalData.available_payment != null
          ? this.originalData.available_payment
          : "";
      this.hasChanges.available_payment =
        this.form.available_payment !== this.originalData.available_payment;
    },
    handleUrlChange() {
      this.hasChanges.offical_url =
        this.form.offical_url !== this.originalData.offical_url;
    },
    handleOutlineChange() {
      this.originalData.outline =
        this.originalData.outline != null ? this.originalData.outline : "";
      this.hasChanges.outline = this.form.outline !== this.originalData.outline;
    },
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

    // open dialog
    open(id, name) {
      this.dialog = true;
      this.id = id;
      this.name = name;
      this.getFacilitiesDetail(id);
    },
    async getFacilitiesDetail(id) {
      await this.$store.dispatch("FacilitiesEvent/getFacilitiesDetail", id);
      this.originalData = JSON.parse(JSON.stringify(this.facilitiesDetail));
    },
    async updateFacilitiesDetail(
      id,
      name,
      address,
      opening_hours,
      holiday,
      available_payment,
      offical_url,
      outline
    ) {
      await this.$store.dispatch(
        "FacilitiesEvent/updateFacilitiesDetail",
        id,
        name,
        address,
        opening_hours,
        holiday,
        available_payment,
        offical_url,
        outline
      );
    },
    async onSubmit() {
      const actionFlg = Object.values(this.hasChanges).some(
        (value) => value === true
      );
      if (this.$refs.form.validate() && actionFlg) {
        try {
          this.updateFacilitiesDetail({
            id: this.id,
            name: this.name,
            address: this.form.address,
            opening_hours: this.form.opening_hours,
            holiday: this.form.holiday,
            available_payment: this.form.available_payment,
            offical_url: this.form.offical_url,
            outline: this.form.outline,
          });
          this.$router.go(0);
        } catch (error) {
          console.log("error");
        }
      } else {
        return;
      }
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
<style>
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
