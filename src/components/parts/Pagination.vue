<template>
  <div class="div-container">
    <v-row class="flex-container">
      <div class="items-select-box mt-5">
        <div class="subtitle-2 font-weight-regular">
          <span>表示行数:</span>
        </div>
        <div class="pl-3" style="width: 50% !important">
          <v-select
            dense
            single-line
            label="10"
            :items="itemsPerPageOptions"
            v-model="localItemsPerPage"
            @change="handleItemsPerPageChange"
            class="custom-select"
          ></v-select>
        </div>
      </div>
      <v-pagination
        class="custom"
        :value="page"
        :length="totalPages"
        :total-visible="7"
        @input="handlePagination"
      ></v-pagination>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      localItemsPerPage: this.itemsPerPage,
    };
  },
  props: {
    itemsPerPageOptions: {
      type: Array,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  watch: {
    localItemsPerPage(newValue) {
      this.$emit("itemsPerPageChange", newValue);
    },
  },
  methods: {
    handleItemsPerPageChange() {
      this.$emit("itemsPerPageChange", this.localItemsPerPage);
    },
    handlePagination(value) {
      this.$emit("handlePagination", value);
    },
  },
};
</script>

<style>
.items-select-box {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.custom .v-pagination__item {
  font-size: 0.85rem;
}
.custom-select {
  width: 50% !important;
  font-size: 12px !important;
  margin-right: 8px !important;
}
.div-container {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px !important;
}
.flex-container {
  display: flex;
  align-items: center;
  justify-content: center !important;
}
</style>
