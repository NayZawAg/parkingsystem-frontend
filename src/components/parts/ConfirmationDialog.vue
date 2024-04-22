<template>
  <v-dialog v-model="confirmDialog" persistent width="auto">
    <v-card>
      <v-toolbar>
        <v-toolbar-title>
          <p class="pt-4 letter-space font-weight-bold">{{ title }}</p>
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text class="confirm-text pt-7">
        <p v-html="message"></p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="returnTrue()">
          はい
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="returnFalse()">
          いいえ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      confirmDialog: false,
    };
  },
  props: {
    title: {
      type: String,
      default: "確認",
    },
    message: {
      type: String,
      default: "変更内容が破棄されます。よろしいでしょうか。",
    },
  },
  methods: {
    openDialog() {
      this.confirmDialog = true;
    },
    closeDialog() {
      this.confirmDialog = false;
    },
    returnFalse() {
      this.$emit("execute-method", false);
    },
    returnTrue() {
      this.$emit("execute-method", true);
    },
  },
};
</script>

<style scoped>
.letter-space {
  letter-spacing: 0.2rem;
}
.confirm-text {
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>
