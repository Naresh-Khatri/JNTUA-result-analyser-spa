<script>
import { Pie, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Pie,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              usePointStyle: true
            }
          }
        },
        maintainAspectRatio: false,
        scales: {}
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
