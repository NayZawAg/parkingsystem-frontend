<template>
  <canvas
    id="congestion_chart"
    v-if="windowWidth > 768"
    :width="510"
    :height="168"
  ></canvas>
  <!-- <canvas id="congestion_chart" v-if="windowWidth > 768" :width="580" :height="168"></canvas> -->
  <canvas id="congestion_chart" v-else :width="325" :height="149"></canvas>
</template>
<script>
import { Line } from "vue-chartjs";
import Chart from "chart.js/auto";

export default {
  extends: Line,
  props: ["parking_location"],
  data() {
    return {
      chartData: {},
      line: null,
      formatted_congestion_rates: [],
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 20,
            callback: (rate) => {
              return rate + "%";
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            maxTicksLimit: 12,
          },
        },
      },
    };
  },
  mounted() {
    this.showChart(),
      this.$root.$on("ChangeChartData", () => {
        this.showChart();
      });
  },
  computed: {
    windowWidth() {
      return window.innerWidth;
    },
    congestion_rates() {
      return this.$store.getters["CongestionRates/congestion_rates"];
    },
  },
  methods: {
    showChart() {
      const labels = [];
      const congestion_rate_arr = [];
      this.congestion_rates.forEach((c) => {
        labels.push(c.parking_time);
        congestion_rate_arr.push(c.congestion_rate);
      });
      let c_chart = document
        .getElementById("congestion_chart")
        .getContext("2d");
      var existingChart = Chart.getChart("congestion_chart");
      if (existingChart) {
        existingChart.destroy();
      }
      if (c_chart != null) {
        this.line = new Chart(c_chart, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                borderColor: "yellow",
                borderWidth: 4,
                pointRadius: 2,
                pointBackgroundColor: "#1DA0F7",
                pointHoverRadius: 4,
                hoverBorderColor: "white",
                fill: false,
                data: congestion_rate_arr,
              },
            ],
          },
          options: {
            scales: this.scales,
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                usePointStyle: true,
                backgroundColor: "#FAFAFA",
                borderColor: "white",
                borderWidth: 1,
                titleColor: "black",
                bodyColor: "black",
                boxWidth: 6,
                boxPadding: 5,
                shadowColor: "black",
                shadowBlur: 12,
                callbacks: {
                  label: function (context) {
                    return "混雑率:   " + context.parsed.y + "%";
                  },
                  labelColor: function (context) {
                    return {
                      borderColor: "#1DA0F7",
                      backgroundColor: "#1DA0F7",
                    };
                  },
                },
              },
            },
          },
        });
      }
    },
  },
};
</script>
