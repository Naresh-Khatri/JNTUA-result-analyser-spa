<template>
  <div class="container">
    <!-- <q-scroll-area ref='scrollArea' style="height:90vh; width:100%"> -->
    <div class="wrapper">
      <StudentInput
        v-model="selection"
        class="result-input"
        @success="onInputSuccess"
      />
      <div
        class="roll-input q-pa-lg rounded"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      >
        <div v-for="(rollNo, index) in rollNoList" :key="index">
          <div class="flex flex-center">
            <q-input
              filled
              ref="rollInput"
              label="Roll Number"
              :color="$q.dark.isActive ? 'white' : 'primary'"
              :rules="[(val) => validateRollNo(val)]"
              v-model="rollNoList[index]"
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="remove_circle"
                  color="negative"
                  v-show="rollNoList.length > 1"
                  @click="removeRollNo(index)"
                />
              </template>
            </q-input>
          </div>
        </div>
        <div class="flex flex-center">
          <q-btn
            icon="add"
            round
            class="q-mt-sm"
            color="primary"
            size="md"
            @click="addRoll"
          />
        </div>
        <div class="flex flex-center">
          <q-btn
            label="Search"
            class="q-mt-lg"
            color="primary"
            size="md"
            :disable="!canSearch"
            @click="fillData()"
          />
        </div>
      </div>
      <div class="data-container q-mb-xl" v-if="datasets.length">
        <div class="flex flex-center">
          <q-card
            class="q-pa-sm q-ma-md rounded glass"
            flat
            style="display: flex; flex-wrap: wrap; justify-content: center"
          >
            <div v-for="(student, index) in studentsList" :key="index">
              <div class="text-center">
                <q-knob
                  readonly
                  :value="student.sgpa"
                  show-value
                  size="90px"
                  label="dsf"
                  :thickness="0.22"
                  :max="10"
                  color="green"
                  track-color="grey-3"
                  class="q-ma-lg"
                  style="margin-bottom: 4px"
                />
                <div
                  class="text-grey"
                  style="
                    max-width: 150px;
                    font-size: 1.1em;
                    word-break: break-word;
                  "
                >
                  {{ student.name }}
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <transition>
          <div style="display: flex; justify-content: center">
            <q-btn
              class="text-white"
              label="Share"
              style="background: #25d366"
              @click="share"
            >
              <img width="50px" src="../assets/whatsapp.svg" />
            </q-btn>
          </div>
        </transition>
        <Tip
          title="Tip"
          desc="You can click on any student's name label to remove them from the chart"
        />
        <q-tabs
          v-model="chartName"
          indicator-color="primary"
          class="text-primary rounded q-mb-sm q-mx-lg"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
        >
          <q-tab
            :style="$q.dark.isActive ? 'color:white' : ''"
            name="radar"
            icon="radar"
            label="Radar"
          />
          <q-tab
            :style="$q.dark.isActive ? 'color:white' : ''"
            name="line"
            icon="show_chart"
            label="Line"
          />
          <q-tab
            :style="$q.dark.isActive ? 'color:white' : ''"
            name="bar"
            icon="bar_chart"
            label="Bar"
          />
        </q-tabs>
        <q-tab-panels
          v-model="chartName"
          animated
          class="q-mx-sm shadow-2 rounded"
        >
          <q-tab-panel name="radar">
            <VueApexCharts
              width="100%"
              height="350"
              :type="chartName"
              :options="chartOptions"
              :series="series"
            />
            <div class="text-right text-grey-6" v-if="zeroCredSubs.length > 0">
              *Note not including zero cred subs.
              <div
                v-for="(sub, index) in zeroCredSubs"
                :key="index"
                class="q-px-md text-right text-white"
              >
                {{ sub }}
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="line" class="flex flex-center flex-row">
            <VueApexCharts
              width="100%"
              height="350"
              :type="chartName"
              :options="chartOptions"
              :series="series"
            />
          </q-tab-panel>

          <q-tab-panel name="bar">
            <VueApexCharts
              width="100%"
              height="350"
              :type="chartName"
              :options="chartOptions"
              :series="series"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div
        v-else
        class="data-container flex flex-center text-h4 text-center text-grey q-mb-xl"
      >
        <q-img
          width="400px"
          src="../assets/sad-emoji.gif"
          style="filter: drop-shadow(0px 0px 6px yellow)"
        />Looks so empty here
      </div>
    </div>
    <Footer />
    <!-- </q-scroll-area> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import VueApexCharts from "vue3-apexcharts";

import axios from "axios";
import { getShort, getBestAttempts } from "../utils/utils";
import G2GP from "../utils/G2GP";

import { backgroundColors, borderColors } from "../colors/colors";
import StudentInput from "../components/StudentInput.vue";

import Footer from "../components/Footer.vue";
import Tip from "../components/Tip.vue";
import apiRoutes from "src/apiRoutes.js";

const datacollection = ref({});
const rollNoList = ref([]);
const canSearch = ref(false);
const studentNameList = ref([]);
const datasets = ref([]);
const zeroCredSubs = ref([]);
const chartName = ref("radar");
const chartOptions = ref({
  chart: { id: "vuechart-example" },
  xaxis: {},
});
const series = ref([]);
const subjectNames = ref([]);
const studentsList = ref([]);
const resultNotFoundDialog = ref(false);
const selection = ref({ reg: "", course: "", year: "", sem: "" });

const $route = useRoute();
const $q = useQuasar();

onMounted(() => {
  // this.setResultID("56736469");
  //this.fillData();
  checkQueries();
  // console.log(window.location.href.split("#")[0] + "#/");
});
const checkQueries = () => {
  console.log($route.query);
  console.log(Object.keys($route.query).includes("reg"));
  if (!Object.keys($route.query).includes("reg")) {
    generateRandRolls();
    return;
  }
  console.log(window.location);
  rollNoList.value = $route.query.rollList.split(",");
  resultID.value = $route.query.resultID;
  console.log(rollNoList.value, resultID.value);
  canSearch.value = true;
  selectionInput.value = $route.query;
  selection.value = $route.query;
  fillData();
};
const addRoll = () => {
  rollNoList.value.push(rollNoList.value[0].slice(0, -2));
  //setTimeout is used to wait for the input to be rendered
  setTimeout(() => {
    $refs.rollInput.slice(-1)[0].focus();
  });
  console.log("added new roll");
  canSearch.value = false;
};
const removeRollNo = (index) => {
  rollNoList.value.splice(index, 1);
  canSearch.value = true;
};
const validateRollNo = (roll) => {
  if (roll.length != 10) {
    $q.notify({
      color: "negative",
      message: "Roll no length should be 10",
    });
    canSearch.value = false;
    return "Roll no length should be 10";
  }
  canSearch.value = true;
  return true;
};
const generateRandRolls = () => {
  for (let i = 0; i < 3; i++) {
    rollNoList.value.push("19fh1a05" + getRandom(60));
  }
};
const getRandom = (max) => {
  let num = Math.ceil(Math.random() * max);
  let numStr = "";
  if (num < 10) numStr = "0" + num;
  else numStr = num;
  return numStr;
};
const onInputSuccess = () => {
  // selectionInput.value = selection;
  canSearch.value = true;
};
const share = () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Hey I compared our results on this cool webApp!",
        url:
          window.location.origin +
          window.location.pathname +
          "#/compare-result?reg=" +
          selection.value.reg +
          "&course=" +
          selection.value.course +
          "&sem=" +
          selection.value.sem +
          "&year=" +
          selection.value.year +
          "&rollList=" +
          rollNo.value.toString(),
      })
      .then(() => {
        sendSharedInfoToDB();
        console.log("Thanks for sharing!");
        $q.notify({
          type: "positive",
          message: `Thanks for sharing this page! 😀😁`,
        });
      })
      .catch(console.error);
  } else {
    // fallback
  }
};
const sendSharedInfoToDB = () => {
  axios.post(apiRoutes.share, {
    type: "compare",
    htns: rollNoList.value,
    resultID: resultID.value,
  });
};
const fillData = async () => {
  zeroCredSubs.value = [];

  if (!canSearch.value) return;
  resetData();
  try {
    //create promises representing every student's result
    const promises = rollNoList.value.map((roll) =>
      axios.get(
        apiRoutes.singleResultv2 +
          "/" +
          roll +
          "/" +
          selection.value.reg +
          "/" +
          selection.value.course +
          "/" +
          selection.value.year +
          "/" +
          selection.value.sem
      )
    );
    const results = await Promise.all(promises);
    var gradePoints = [];
    console.log(results)
    results.forEach((res) => {
      // console.log(res.status);
      if (res.status === 200) {
        $q.notify({
          type: "positive",
          message: `Result retrieved`,
        });
        // console.log(res);
        console.log("Best Attempt = ");
        // console.log(getBestAttempts(res.data.attempts));
        gradePoints = [];

        const bestAttempts = getBestAttempts(res.data.attempts);
        console.log(bestAttempts);
        bestAttempts.forEach((sub) => {
          if (subjectNames.value.length < bestAttempts.length)
            subjectNames.value.push(getShort(sub["Subject Name"]));
          gradePoints.push(G2GP[sub["Grade"]]);
        });
        //get last 2 chars of roll
        let shortRoll = `(${res.data["htn"][res.data["htn"].length - 2]}${
          res.data["htn"][res.data["htn"].length - 1]
        })`;
        studentNameList.value.push(res.data["name"]);
        studentsList.value.push({
          id: res.data["htn"],
          name: res.data["name"] + shortRoll,
          sgpa: Number.parseFloat(res.data["sgpa"]),
        });
        datasets.value.push({
          label: res.data["name"],
          data: gradePoints,
          backgroundColor: backgroundColors[0],
          borderColor: borderColors[0],
          borderWidth: 1,
        });
        borderColors.splice(0, 1);
        backgroundColors.splice(0, 1);
        chartOptions.value.xaxis.categories = subjectNames.value
        series.value.push({name: res.data.name, data:[...bestAttempts.map(sub => G2GP[sub.Grade])]})
      }
      console.log(series.value)
    });
    drawChart();
    setTimeout(() => {
      // this.$refs.scrollArea.setScrollPosition(750, 500);
      window.scrollTo(0, 740);
      console.log("scrolled");
    }, 700);
    // console.log(document.body.scrollHeight )
  } catch (error) {
    console.log(error);
    resultNotFoundDialog.value = true;
    $q.notify({
      type: "negative",
      message: `Result not found`,
    });
    //scroll bottom
  }
};
const drawChart = () => {
  datacollection.value = {
    labels: subjectNames.value,
    datasets: datasets.value,
  };
};
const resetData = () => {
  series.value = []
  subjectNames.value = [];
  datasets.value = [];
  backgroundColors.value = [
    "rgba(75, 192, 192, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(201, 203, 207, 0.2)",
    "rgba(255, 99, 132, 0.2)",
    "rgba(255, 205, 86, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgb(255, 99, 132)",
    "rgb(75, 192, 192)",
    "rgb(255, 205, 86)",
    "rgb(201, 203, 207)",
    "rgb(54, 162, 235)",
  ];
  borderColors.value = [
    "rgb(75, 192, 192)",
    "rgb(255, 159, 64)",
    "rgb(153, 102, 255)",
    "rgb(54, 162, 235)",
    "rgb(255, 205, 86)",
    "rgb(255, 99, 132)",
    "rgb(201, 203, 207)",
  ];
  studentsList.value = [];
};
</script>
<style>
@media screen and (min-width: 1024px) {
  .wrapper {
    display: grid;
    gap: 25px;
    margin-top: 50px;
    width: 70%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "result-input roll-input"
      "data-container data-container";
  }
  .sgpa-container {
    grid-area: sgpa-container;
    align-self: center;
  }
  .roll-input {
    grid-area: roll-input;
  }
  .result-input {
    grid-area: result-input;
  }
  .data-container {
    grid-area: data-container;
  }
  .container {
    display: grid;
    justify-items: center;
  }
}
@media screen and (max-width: 1024px) {
  .result-input {
    margin: 20px 10px;
  }
  .roll-input {
    margin: 20px 10px;
  }
  .sgpa-container {
    margin: 20px 10px;
  }
  .data-container {
    margin: 20px 10px;
  }
}
.rounded {
  border-radius: 20px;
}
</style>
