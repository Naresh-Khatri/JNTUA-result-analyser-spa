<template>
  <q-page padding class="container flex flex-center">
    <!-- :key="pieDataCollection.labels.length" -->
    <div class="leaderboards">
      <div class="flex flex-center">
        <div
          class="q-my-md q-py-md row rounded search-count-container"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
          style="width: 60%"
        >
          <div class="col-8">
            <div class="text-h4 text-center">
              <AnimatedNumber v-if="totalSearches" :number="totalSearches" />
            </div>
          </div>
          <div class="col-4">
            <span class="row text-caption">total</span>
            <span class="row text-caption">searches</span>
          </div>
        </div>
      </div>
      <div
        class="q-my-md q-pa-md rounded"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
        v-if="topColleges.length"
      >
        <div class="text-h4 q-mt-lg q-ml-lg">🏆Leaderboards</div>
        <div class="text-body1 q-ma-md">
          <i class="fas fa-crown" style="color: gold"></i>
          {{ topColleges[0].collegeCode }} - {{ topColleges[0].collegeName }}({{
            topColleges[0].district
          }})
        </div>
        <div class="text-body1 q-ma-md">
          <i class="fas fa-crown" style="color: silver"></i>
          {{ topColleges[1].collegeCode }} - {{ topColleges[1].collegeName }}({{
            topColleges[1].district
          }})
        </div>
        <div class="text-body1 q-ma-md">
          <i class="fas fa-crown" style="color: brown"></i>
          {{ topColleges[2].collegeCode }} - {{ topColleges[2].collegeName }}({{
            topColleges[2].district
          }})
        </div>
      </div>
    </div>

    <div
      class="q-my-md q-py-md rounded pie-container"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
    >
      <div class="text-center text-h6 q-ma-md">
        College code (Searches count)
      </div>
      <VueApexCharts
        :key="$q.dark.isActive"
        ref="charts"
        width="100%"
        height="350"
        type="donut"
        :options="totalSearchesOptions"
        :series="totalSearchesSeries"
      />
      <div class="q-pa-md text-right text-grey-6">
        *Note: Only top 30 colleges out of {{ collegesReached }} are shown
      </div>
    </div>
    <div
      class="flex column rounded q-pa-md q-my-md searches-container"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      style="border-radius: 20px"
    >
      <div class="text-h5">searches per day</div>
      <q-scroll-area
        ref="scrollArea"
        horizontal
        style="height: 400px"
        :thumb-style="{
          bottom: '4px',
          borderRadius: '5px',
          background: '#b0b8b4ff',
          width: '10px',
          opacity: 1,
        }"
        :style="!$q.screen.lt.md ? 'height:400px' : ''"
      >
        <VueApexCharts
          :key="$q.dark.isActive"
          ref="charts"
          width="100%"
          height="350"
          type="area"
          :options="dailySearchesOptions"
          :series="dailySearchesSeries"
        />
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import VueApexCharts from "vue3-apexcharts";
import AnimatedNumber from "../components/AnimatedNumber.vue";
import gsap from "gsap";
import axios from "axios";

import apiRoutes from "../apiRoutes";
import { backgroundColors, borderColors } from "../colors/colors";

const topColleges = ref([]);
const collegesReached = ref(0);
const totalSearches = ref(0);
const tweenedNumber = ref(0);
const timeout = ref(null);
const updateTime = ref(1000);
const scrollArea = ref(null);
const dateChart = ref(null);
const totalSearchesOptions = ref({});
const totalSearchesSeries = ref();
const dailySearchesOptions = ref({
  chart: {
    id: "vuechart-example",
    background: "transparent",
    stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 2,
    dashArray: 0,      
}
    // theme: { palette: "palette1" },
  },
});
const dailySearchesSeries = ref([]);

const $q = useQuasar();

const animatedNumber = computed(() => tweenedNumber.value.toFixed(0));
//update charts theme when app theme changes
watch(
  () => $q.dark.isActive,
  (val) => {
    console.log($q.dark.isActive);
    totalSearchesOptions.value = {
      ...totalSearchesOptions.value,
      theme: { mode: $q.dark.isActive ? "dark" : "" },
    };
    dailySearchesOptions.value = {
      ...dailySearchesOptions.value,
      theme: { mode: $q.dark.isActive ? "dark" : "" },
      
    };
  }
);
onMounted(() => {
  axios
    .get(apiRoutes.stats)
    .then((res) => {
      console.log(res);
      // setTimeout(() => {
      //   this.$refs.scrollArea.setScrollPosition(1000, 1000);
      // }, 500);
      topColleges.value = res.data.topColleges;
      totalSearches.value = res.data.totalSearches;
      collegesReached.value = res.data.searches.length;

      let counter = 0;
      const top30CollegeNames = [];
      const top30CollegeSearchCounts = [];
      res.data.searches.map((item, index) => {
        if (index >= 30) return;
        top30CollegeNames.push(`${item["_id"]} (${item["total"]})`);
        top30CollegeSearchCounts.push(item["total"]);
        counter++;
      });
      console.log(top30CollegeNames);
      console.log(top30CollegeSearchCounts);

      totalSearchesOptions.value = {
        labels: top30CollegeNames,
      };
      totalSearchesSeries.value = top30CollegeSearchCounts;
      console.log(totalSearchesSeries.value);
      console.log(totalSearchesOptions.value);

      // set the line chart color to primary
      const dailySeachesDates = [];
      const dailySeachesCounts = [];
      res.data.searchesArr.map((item, index) => {
        dailySeachesDates.push(item["date"].slice(5, 10));
        dailySeachesCounts.push(item["searchCount"]);
      });
      dailySearchesOptions.value = {
        xaxis: { categories: dailySeachesDates },
      };
      dailySearchesSeries.value = [
        {
          name: "searches this day",
          data: dailySeachesCounts,
        },
      ];
      // dateChart.scrollLeft += 300;
      // setTimeout(() => {
      //   document.querySelector(".dateChart").scrollLeft -=
      //     document.querySelector(".dateChart").scrollWidth;
      // }, 1000);
      // console.log(document.querySelector(".dateChart").scrollWidth);
      // this.pieDataCollection.
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<style>
.apexcharts-legend-text {
  color: white;
}
@media screen and (min-width: 1000px) {
  .container > div {
    width: 1000px;
  }
  .leaderboards {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
  }
  .search-count-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 300px;
    margin: 20px;
    height: 85%;
  }
}
.pie-container {
  width: 100%;
}
.searches-container {
  width: 100%;
}

.rounded {
  position: relative;
  border-radius: 20px;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  /* background-color: rgba(17, 25, 40, 0.75); */
}
/* .rounded::after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;
} */
</style>
