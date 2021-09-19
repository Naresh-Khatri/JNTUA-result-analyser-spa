<script>
import { Radar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Radar,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        legend: {},
        maintainAspectRatio: false,
        scale: {
          ticks: {
            backdropColor: "rgba(255,255,255,0)"
          },
          gridLines: {
            color: this.$q.dark.isActive ? "#444" : "#eee"
          }
        }
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
