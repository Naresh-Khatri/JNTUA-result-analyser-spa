<template>
  <q-page padding :key="dataCollection.labels.length">
    <!-- content -->
    <!-- <LineChart
      style="min-width:90%"
      :chart-data="dataCollection"
      :key="$q.dark.isActive"
    /> -->
    <div class="text-center text-h6 q-mt-md">
      College code (Searches count)
    </div>
    <PieChart
      style="height:600px"
      :chart-data="dataCollection"
      :key="$q.dark.isActive"
    />
    <div class="text-h4 q-mt-lg">
      🏆Leaderboards
    </div>
    <div v-for="(college,index) in topColleges" :key="index" class="text-h6 q-ma-md">
    #{{index+1}}.  {{college.collegeCode}} - {{college.collegeName}}({{college.district}})
    </div>
  </q-page>
</template>

<script>
// import data from './data.json'
import PieChart from "../charts/PieChart.vue";
import axios from "axios";

import { backgroundColors, borderColors } from "../colors/colors";

export default {
  // name: 'PageName',
  components: {
    PieChart
  },
  data() {
    return {
      dataCollection: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          }
        ]
      },
      topColleges: []
    };
  },

  mounted() {
    // this.dataCollection.data = data.
    // console.log(data)

    console.log("stats");
    axios
        .get('https://jntua.plasmatch.in/stats/public')
      // .get("http://localhost:3000/stats/public")
      .then(res => {
        console.log(res);
        this.topColleges = res.data.topColleges;
        let counter = 0;
        let arr = Object.entries(res.data.colleges);
        arr.sort(([a, b], [c, d]) => d - b);
        console.log(arr);
        arr.map(item => {
          this.dataCollection.labels.push(`${item[0]} (${item[1]})`);
          this.dataCollection.datasets[0].data.push(item[1]);
          this.dataCollection.datasets[0].backgroundColor.push(
            backgroundColors[counter % 7]
          );
          this.dataCollection.datasets[0].borderColor.push(
            borderColors[counter % 7]
          );
          counter++;
        });

        // this.dataCollection.
      })
      .catch(err => {
        console.log(err);
      });
    console.log(this.dataCollection);
  }
};
</script>
