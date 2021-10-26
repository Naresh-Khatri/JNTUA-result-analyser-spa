<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["yMax"],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: "index",
          intersect: false  //show tooltip according to x hover
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0
              },
              gridLines: {
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
          ]
        }
      }
    };
  },
  mounted() {
    //set the y max if provided
    if (this.yMax) this.options.scales.yAxes[0].ticks.max = this.yMax;
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
