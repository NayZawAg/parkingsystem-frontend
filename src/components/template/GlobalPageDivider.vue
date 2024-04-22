<template>
  <div class="hide-divider-on-page">
    <Divider class="divider-position" />
  </div>
</template>

<script>
import MediaStyle from "@/styles/globals.scss";
import Divider from "../../components/parts/Divider.vue";
export default {
  components: {
    MediaStyle,
    Divider,
  },
};
</script>
<style scoped>
.divider-position {
  margin: auto auto 10px auto;
}
</style>
