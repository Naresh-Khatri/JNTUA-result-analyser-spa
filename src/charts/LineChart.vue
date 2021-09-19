<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0,
                max: 10
              },   gridLines: {
                color: this.$q.dark.isActive ? "#444" : "#eee"
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                color: this.$q.dark.isActive ? "#444" : "#eee"
              }
            }
          ]}
      }
    };
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    Chart.defaults.global.defaultFontColor = this.$q.dark.isActive
      ? "#eee"
      : "#444";
    this.renderChart(this.chartData, this.options);
  }
};
</script>
<style scoped></style>
