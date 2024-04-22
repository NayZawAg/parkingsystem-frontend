<template>
  <v-card-title class="letter-space font-weight-bold card-style">
    <v-row justify="center" align-content="center">
      <v-col class="d-flex justify-start btn-style custom-row-for-title">
        <BackButton @click="click"></BackButton>
      </v-col>
      <v-col class="d-flex justify-center pa-0 custom-row-for-title">
        <div v-if="titleName !== ''" class="information-title pa-3" v-html="titleName">
        </div>
      </v-col>
      <v-col class="hide-row-for-title pa-0"> </v-col>
    </v-row>
  </v-card-title>
</template>

<script>
import MediaStyle from "@/styles/globals.scss";
import BackButton from "../../components/parts/BackButton.vue";
export default {
  props: {
    titleName: {
      type: String,
      default: "",
    },
  },
  components: {
    MediaStyle,
    BackButton,
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
.letter-space {
  letter-spacing: 0.2rem;
}
.btn-style {
  padding: 5px 12px 12px 5px;
}
.card-style{
  padding-top: 10px !important;
}
</style>
