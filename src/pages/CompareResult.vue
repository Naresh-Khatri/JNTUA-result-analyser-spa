<template>
  <div class="container">
    <!-- <q-scroll-area ref='scrollArea' style="height:90vh; width:100%"> -->
    <div class="wrapper">
      <StudentInput
        v-model="selection"
        class="result-input"
        @success="setSelection($event)"
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
              :rules="[val => validateRollNo(val)]"
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
            class="q-pa-sm q-ma-md rounded"
            flat
            style="display:flex; flex-wrap:wrap; justify-content:center"
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
                  style="margin-bottom:4px;"
                />
                <div
                  class="text-grey"
                  style="max-width:150px;font-size:1.1em; word-break: break-word;"
                >
                  {{ student.name }}
                </div>
              </div>
            </div>
          </q-card>
        </div>
        <transition>
          <div style="display:flex; justify-content:center">
            <q-btn
              class="text-white"
              label="Share"
              style="background:#25D366"
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
            <RadarChart :key="$q.dark.isActive" :chart-data="datacollection" />
          </q-tab-panel>

          <q-tab-panel name="line" class="flex flex-center flex-row">
            <LineChart
              style="min-width:90%"
              :key="$q.dark.isActive"
              :chart-data="datacollection"
            />
          </q-tab-panel>

          <q-tab-panel name="bar">
            <BarChart :key="$q.dark.isActive" :chart-data="datacollection" />
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
          style="filter: drop-shadow(0px 0px 6px yellow);"
        />
        Looks so empty here
      </div>
    </div>
    <!-- </q-scroll-area> -->
  </div>
</template>

<script>
import axios from "axios";
import { getShort, getBestAttempts } from "../utils/utils";

import { backgroundColors, borderColors } from "../colors/colors";
import StudentInput from "../components/StudentInput.vue";

import RadarChart from "../charts/RadarChart.vue";
import BarChart from "../charts/BarChart.vue";
import LineChart from "../charts/LineChart.vue";

import Tip from "../components/Tip.vue";
import apiRoutes from "src/apiRoutes.js";

export default {
  components: {
    StudentInput,
    RadarChart,
    BarChart,
    LineChart,
    Tip
  },
  data() {
    return {
      datacollection: {},
      rollNoList: [],
      canSearch: false,
      // resultID: "",
      studentNameList: [],
      datasets: [],
      shareText: "",
      chartName: "radar",
      subjectNames: [],
      studentsList: [],
      resultNotFoundDialog: false,
      backgroundColors: backgroundColors,
      borderColors: borderColors,
      g_to_gp: {
        S: 10,
        O: 10,
        A: 9,
        B: 8,
        C: 7,
        D: 6,
        E: 5,
        F: 0,
        AB: 0,
        Y: 0
      },
      selectionInput: {},
      selection: {}
    };
  },
  mounted() {
    // this.setResultID("56736469");
    //this.fillData();
    this.checkQueries();
    // console.log(window.location.href.split("#")[0] + "#/");
  },
  methods: {
    checkQueries() {
      console.log(this.$route.query);
      console.log(Object.keys(this.$route.query).includes("reg"));
      if (!Object.keys(this.$route.query).includes("reg")) {
        this.generateRandRolls();
        return;
      }
      console.log(window.location);
      this.rollNoList = this.$route.query.rollList.split(",");
      this.resultID = this.$route.query.resultID;
      console.log(this.rollNoList, this.resultID);
      this.canSearch = true;
      this.selectionInput = this.$route.query;
      this.selection = this.$route.query;
      this.fillData();
    },
    addRoll() {
      this.rollNoList.push(this.rollNoList[0].slice(0, -2));
      //setTimeout is used to wait for the input to be rendered
      setTimeout(() => {
        this.$refs.rollInput.slice(-1)[0].focus();
      });
      console.log("added new roll");
      this.canSearch = false;
    },
    removeRollNo(index) {
      this.rollNoList.splice(index, 1);
      this.canSearch = true;
    },
    validateRollNo(roll) {
      if (roll.length != 10) {
        this.$q.notify({
          color: "negative",
          message: "Roll no length should be 10"
        });
        this.canSearch = false;
        return "Roll no length should be 10";
      }
      this.canSearch = true;
      return true;
    },
    generateRandRolls() {
      for (let i = 0; i < 3; i++) {
        this.rollNoList.push("19fh1a05" + this.getRandom(60));
      }
    },
    getRandom(max) {
      let num = Math.ceil(Math.random() * max);
      let numStr = "";
      if (num < 10) numStr = "0" + num;
      else numStr = num;
      return numStr;
    },
    setSelection(selection) {
      this.selectionInput = selection;
      this.canSearch = true;
    },
    share() {
      if (navigator.share) {
        navigator
          .share({
            title: "Hey I compared our results on this cool webApp!",
            url:
              window.location.origin + window.location.pathname+
              "#/compare-result?reg=" +
              this.selectionInput.reg +
              "&course=" +
              this.selectionInput.course +
              "&sem=" +
              this.selectionInput.sem +
              "&year=" +
              this.selectionInput.year +
              "&rollList=" +
              this.rollNoList.toString()
          })
          .then(() => {
            this.sendSharedInfoToDB();
            console.log("Thanks for sharing!");
            this.$q.notify({
              type: "positive",
              message: `Thanks for sharing this page! 😀😁`
            });
          })
          .catch(console.error);
      } else {
        // fallback
      }
    },
    sendSharedInfoToDB() {
      axios.post(apiRoutes.share, {
        type: "compare",
        htns: this.rollNoList,
        resultID: this.resultID
      });
    },
    async fillData() {
      if (!this.canSearch) return;
      this.resetData();
      try {
        const results = await Promise.all(
          this.rollNoList.map(roll =>
            axios.get(
              apiRoutes.singleResultv2 +
                "/" +
                roll +
                "/" +
                this.selectionInput.reg +
                "/" +
                this.selectionInput.course +
                "/" +
                this.selectionInput.year +
                "/" +
                this.selectionInput.sem
            )
          )
        );
        var gradePoints = [];
        results.forEach(res => {
          // console.log(res.status);
          if (res.status === 200) {
            this.$q.notify({
              type: "positive",
              message: `Result retrieved`
            });
            // console.log(res);
            console.log("Best Attempt = ");
            // console.log(getBestAttempts(res.data.attempts));
            gradePoints = [];

            const bestAttempts = getBestAttempts(res.data.attempts);
            console.log(bestAttempts);
            bestAttempts.forEach(sub => {
              if (this.subjectNames.length < bestAttempts.length)
                this.subjectNames.push(getShort(sub["Subject Name"]));
              gradePoints.push(this.g_to_gp[sub["Grade"]]);
            });
            //get last 2 chars of roll
            let shortRoll = `(${res.data["htn"][res.data["htn"].length - 2]}${
              res.data["htn"][res.data["htn"].length - 1]
            })`;
            this.studentNameList.push(res.data["name"]);
            this.studentsList.push({
              id: res.data["htn"],
              name: res.data["name"] + shortRoll,
              sgpa: Number.parseFloat(res.data["sgpa"])
            });
            this.datasets.push({
              label: res.data["name"],
              data: gradePoints,
              backgroundColor: this.backgroundColors[0],
              borderColor: this.borderColors[0],
              borderWidth: 1
            });
            this.borderColors.splice(0, 1);
            this.backgroundColors.splice(0, 1);
          }
        });
        this.drawChart();
        setTimeout(() => {
          // this.$refs.scrollArea.setScrollPosition(750, 500);
          window.scrollTo(0, 740);
          console.log('scrolled')
        }, 700);
        // console.log(document.body.scrollHeight )
      } catch (error) {
        console.log(error);
        this.resultNotFoundDialog = true;
        this.$q.notify({
          type: "negative",
          message: `Result not found`
        });
        //scroll bottom
      }
    },
    drawChart() {
      this.datacollection = {
        labels: this.subjectNames,
        datasets: this.datasets
      };
    },
    resetData() {
      this.subjectNames = [];
      this.datasets = [];
      this.backgroundColors = [
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
        "rgb(54, 162, 235)"
      ];
      this.borderColors = [
        "rgb(75, 192, 192)",
        "rgb(255, 159, 64)",
        "rgb(153, 102, 255)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)",
        "rgb(255, 99, 132)",
        "rgb(201, 203, 207)"
      ];
      this.studentsList = [];
    }
  }
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
