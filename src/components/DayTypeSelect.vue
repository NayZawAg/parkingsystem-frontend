<template>
  <v-container fluid>
    <v-row class="mr-0">
      <v-col cols="12" md="8" lg="8" class="ma-md-0 ma-lg-0 ma-xl-0 mt-n3 pr-0">
        <span class="font-weight-bold text-subtitle-2 hide-on-mobile">混雑の傾向：</span>
        <span class="font-weight-bold text-caption hide-on-pc">混雑の傾向：</span>
        <v-select
          v-model="selectItem"
          :items="items"
          menu-props="auto"
          label="Select"
          hide-details
          single-line
          solo
          v-on:change="changeSelect"
          dense
          class="select-item-width"
        ></v-select>
      </v-col>
    </v-row>
    <v-row class="mr-0">
      <CongestionRatesChart ref="chart" :parking_location="parking_location" />
    </v-row>
  </v-container>
</template>
<script>
import CongestionRatesChart from '@/components/CongestionRatesChart.vue'
export default {
  components: {
    CongestionRatesChart
  },
  data() {
    return {
      items: ['休日・祝日', '平日'],
      selectItem: '休日・祝日'
    }
  },
  computed: {
    congestion_rates_status() {
      return this.$store.getters['CongestionRates/status']
    },
    congestion_rates_error() {
      return this.$store.getters['CongestionRates/error']
    },
  },
  props: {
    parking_location: {
      type: Object
    }
  },
  methods: {
    async changeSelect(selectItem) {
      let day_type = ''
      day_type = selectItem == '休日・祝日'? 'holiday' : 'business'

      let location_params = {
        id: this.parking_location.id,
        day_type: day_type
      }
      // call get congestion rates of store
      await this.$store.dispatch('CongestionRates/getCongestionRates', location_params)
      if (this.congestion_rates_status == 'success') {
        // call change chart data
        this.$refs.chart.showChart()
      } else if (this.congestion_rates_status == 'error') {
        // error page
        this.errorPage(this.congestion_rates_error)
      }
    },
    errorPage(error) {
      if (error.status == 400) {
        // Go to bad_request page
        this.$router.push({
          name: 'bad_request'
        })
      } else if (error.status == 404) {
        // Go to not_found_error page
        this.$router.push({
          name: 'not_found'
        })
      } else if (error.status == 401) {
        // Go to unauthorized page
        this.$router.push({
          name: 'unauthorized'
        })
      } else {
        // Go to internal_server_error page
        this.$router.push({
          name: 'internal_server_error',
        })
      }
    }
  }
}
</script>