<template>
  <q-page padding :key="pieDataCollection.labels.length">
    <!-- content -->
    <!-- <LineChart
      style="min-width:90%"
      :chart-data="pieDataCollection"
      :key="$q.dark.isActive"
    /> -->
    <div
      class="flex column rounded q-pa-md q-my-md"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      style="border-radius:20px"
    >
      <div class="text-h5">Unique searches per day</div>
      <q-scroll-area
        ref="scrollArea"
        horizontal
        style="height:400px;"
        :thumb-style="{
          bottom: '4px',
          borderRadius: '5px',
          background: '#b0b8b4ff',
          width: '10px',
          opacity: 1
        }"
        :style="!$q.screen.lt.md ? 'height:400px' : ''"
      >
        <LineChart
          style="width:1300px"
          :chart-data="lineDataCollection"
          :key="$q.dark.isActive"
        />
      </q-scroll-area>
    </div>
    <div
      class="q-my-md q-py-md"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      style="border-radius:20px"
    >
      <div class="text-center text-h6 q-ma-md">
        College code (Searches count)
        <!-- <div class="row q-col-gutter-none">
          <q-chip
            v-for="(d, i) in pieDataCollection.labels"
            :key="i"
            dense
            class="col-2"
            :style="
              `background: ${backgroundColors[i % 7]};border: 2px solid ${
                borderColors[i % 7]
              }; opacity:.7`
            "
            style="font-size:11px; font-weight:400;display:flex; justify-content:center; align-items:center;height:20px;padding:5px"
            :label="d"
          >
            <span>
              <div
                :style="
                  `background: ${backgroundColors[i % 7]};border: 2px solid ${
                    borderColors[i % 7]
                  }; opacity:.7`
                "
                style="width:10px; height:10px "
              ></div>
            </span>
            <span style="font-size:11px; font-weight:300">
              {{ d }}
            </span>
          </q-chip> 
        </div> -->
      </div>
      <PieChart
        style="height:600px"
        :chart-data="pieDataCollection"
        :key="$q.dark.isActive"
      />
    </div>
    <div
      class="q-my-md q-py-md"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      style="border-radius:20px"
    >
      <div class="text-h4 q-mt-lg q-ml-lg">
        🏆Leaderboards
      </div>
      <div
        v-for="(college, index) in topColleges"
        :key="index"
        class="text-body1 q-ma-md"
      >
        #{{ index + 1 }}. {{ college.collegeCode }} -
        {{ college.collegeName }}({{ college.district }})
      </div>
    </div>
  </q-page>
</template>

<script>
// import data from './data.json'
import PieChart from "../charts/PieChart.vue";
import LineChart from "../charts/LineChart.vue";
import axios from "axios";

import apiRoutes from "../apiRoutes";

import { backgroundColors, borderColors } from "../colors/colors";

export default {
  // name: 'PageName',
  components: {
    PieChart,
    LineChart
  },
  data() {
    return {
      backgroundColors: backgroundColors,
      borderColors: borderColors,
      pieDataCollection: {
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
      lineDataCollection: {
        labels: [],
        datasets: [
          {
            label: "Search Count",
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
    // this.pieDataCollection.data = data.
    // console.log(data)
    setTimeout(() => {
      console.log(this.pieDataCollection);
    }, 1000);
    axios
      .get(apiRoutes.stats)
      .then(res => {
        console.log(res);
        setTimeout(() => {
          this.$refs.scrollArea.setScrollPosition(1000, 1000);
        }, 500);
        this.topColleges = res.data.topColleges;
        let counter = 0;
        let arr = Object.entries(res.data.colleges);
        arr.sort(([a, b], [c, d]) => d - b);
        // console.log(arr);
        arr.map(item => {
          this.pieDataCollection.labels.push(`${item[0]} (${item[1]})`);
          this.pieDataCollection.datasets[0].data.push(item[1]);
          this.pieDataCollection.datasets[0].backgroundColor.push(
            backgroundColors[counter % 7]
          );
          this.pieDataCollection.datasets[0].borderColor.push(
            borderColors[counter % 7]
          );
          counter++;
        });
        arr = Object.entries(res.data.searchDates);
        this.lineDataCollection.datasets[0].backgroundColor.push(
          backgroundColors[counter % 7]
        );
        this.lineDataCollection.datasets[0].borderColor.push(
          borderColors[counter % 7]
        );
        arr.map(item => {
          this.lineDataCollection.labels.push(item[0]);
          this.lineDataCollection.datasets[0].data.push(item[1]);
          counter++;
        });
        // this.$refs.dateChart.scrollLeft += 300;
        // setTimeout(() => {
        //   document.querySelector(
        //     ".dateChart"
        //   ).scrollLeft -= document.querySelector(".dateChart").scrollWidth;
        // }, 1000);
        // console.log(document.querySelector(".dateChart").scrollWidth);
        // this.pieDataCollection.
      })
      .catch(err => {
        console.log(err);
      });
    // console.log(this.pieDataCollection);
  },
  methods: {}
};
</script>
