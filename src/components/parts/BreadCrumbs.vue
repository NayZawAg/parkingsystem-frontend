<template>
  <div>
    <v-breadcrumbs :items="items" class="bread-crumbs-style">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item>
          <router-link :to="item.href">{{ item.text }}</router-link>
        </v-breadcrumbs-item>
      </template>
      <template v-slot:divider>
        <v-icon size="32" class="hide-on-mobile">mdi-chevron-right</v-icon>
        <v-icon size="22" class="hide-on-pc">mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
<style>
.v-breadcrumbs__divider {
  padding: 0 !important;
}
</style>
