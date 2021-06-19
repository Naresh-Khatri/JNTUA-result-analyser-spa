<template>
  <div class="container">
    <div class="wrapper">
      <StudentInput class="result-input" @success="setResultID($event)" />

      <div class="roll-input q-pa-lg bg-white rounded">
        <div v-for="(rollNo, index) in rollNoList" :key="index">
          <div class="flex flex-center">
            <q-input filled label="Roll Number" v-model="rollNoList[index]">
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="remove_circle"
                  color="negative"
                  v-show="rollNoList.length > 1"
                  @click="rollNoList.splice(index, 1)"
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
            @click="rollNoList.push('')"
          />
        </div>
        <div class="flex flex-center">
          <q-btn
            label="Search"
            class="q-mt-lg"
            color="primary"
            size="md"
            :disable="!canSearch"
            @click="fillData"
          />
        </div>
      </div>
      <!-- <div
        class="flex row flex-center no-wrap q-mt-md q-pa-lg q-mx-lg bg-white rounded"
      > -->
      <!-- <q-icon
        name="arrow_back_ios_new"
        style="font-size: 3em;"
        @click="decRollNo()"
      /> -->
      <!-- <q-dialog v-model="resultNotFoundDialog">
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Result Not Found</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            If you think your hall ticket number is correct then go to feedback
            section and provide us the hall ticket number range of your batch
            like this and we'll update our database
            <q-space />
            <div class="flex flex-center " style="flex-direction:column">
              <div class="row">
                <q-chip label="19fh1a0501" /> - <q-chip label="19fh1a0562" />
              </div>
              <q-btn
                label="Feedback"
                class="q-ma-md"
                color="primary"
                size="md"
                to="feedback"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog> -->
      <!-- </div> -->
      <div class="data-container" v-if="datasets.length">
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
                  class="text-primary q-ma-lg"
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
        <Tip
          title="Tip"
          desc="You can click on any student's name label to remove them from the chart"
        />
        <q-tabs
          v-model="chartName"
          indicator-color="primary"
          class="text-primary rounded bg-white q-mb-sm q-mx-lg"
        >
          <q-tab name="radar" icon="radar" label="Radar" />
          <q-tab name="line" icon="show_chart" label="Line" />
          <q-tab name="bar" icon="bar_chart" label="Bar" />
        </q-tabs>
        <q-tab-panels
          v-model="chartName"
          animated
          class="q-mx-sm shadow-2 rounded"
        >
          <q-tab-panel name="radar">
            <RadarChart
              :chart-data="datacollection"
              :options="{
                responsive: true,
                maintainAspectRatio: false,
                scale: {
                  ticks: {
                    beginAtZero: true,
                    max: 10
                  }
                }
              }"
            />
          </q-tab-panel>

          <q-tab-panel name="line" class="flex flex-center flex-row">
            <LineChart
              style="max-width:500px"
              :chart-data="datacollection"
              :options="{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 10
                      }
                    }
                  ]
                }
              }"
            />
          </q-tab-panel>

          <q-tab-panel name="bar">
            <BarChart
              :chart-data="datacollection"
              :options="{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 10
                      }
                    }
                  ]
                }
              }"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div
        v-else
        class="data-container flex flex-center q-ma-xl text-h4 text-center text-grey"
      >
        Looks so empty here :/
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../api.config.js";
import { getShort } from "../utils/utils";

import { backgroundColors, borderColors } from "../colors/colors";
import StudentInput from "../components/StudentInput.vue";

import RadarChart from "../charts/RadarChart.vue";
import BarChart from "../charts/BarChart.vue";
import LineChart from "../charts/LineChart.vue";

import Tip from "../components/Tip.vue";

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
      ResultID: "",
      studentNameList: [],
      datasets: [],
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
        Y:0
      }
    };
  },
  mounted() {
    //this.fillData();
    this.generateRandRolls();
  },
  methods: {
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
    setResultID(resultID) {
      this.canSearch = true;
      this.resultID = resultID;
      this.fillData();
    },
    async fillData() {
      this.resetData();
      for (var i = 0; i < this.rollNoList.length; i++) {
        var gradePoints = [];
        axios
          .get(
            `https://jntua.plasmatch.in/${this.resultID}/${this.rollNoList[i]}`
          )
          .then(res => {
            console.log(res);
            if (res.data) {
              this.$q.notify({
                type: "positive",
                message: `Result retrieved`
              });
              gradePoints = [];
              res.data.subjects.forEach(sub => {
                if (this.subjectNames.length < res.data["subjects"].length)
                  this.subjectNames.push(getShort(sub["Subject Name"]));
                gradePoints.push(this.g_to_gp[sub["Grades"]]);
              });
              this.studentNameList.push(res.data["name"]);
              this.studentsList.push({
                id: res.data["htn"],
                name: res.data["name"],
                sgpa: res.data["sgpa"]
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
          })
          .catch(error => {
            console.log(error);
            this.resultNotFoundDialog = true;
            this.$q.notify({
              type: "negative",
              message: `Result not found`
            });
          })
          .finally(() => {
            this.drawChart();
          });
        {
          //   axios
          //     .get(
          //       `${config.results}?student__id=${this.rollNoList[i]}&semester=${
          //         this.sem
          //       }${this.supply ? "a" : ""}`
          //     )
          //     .then(response => {
          //       console.log(response);
          //       if (response.data.length > 0) {
          //         this.$q.notify({
          //           type: "positive",
          //           message: `Result retrieved`
          //         });
          //       }
          //       if (response.data.length <= 20) {
          //         //if rollNo is left empty then api will send all the rows
          //         //setting it to large no like 20 helps to detect it
          //         gradePoints = [];
          //         response.data.forEach(ele => {
          //           //console.log(ele);
          //           if (this.subjectNames.length < response.data.length)
          //             this.subjectNames.push(`${ele.subject.abb}`);
          //           gradePoints.push(this.g_to_gp[ele.grade]);
          //         });
          //         this.studentNameList.push(response.data[0].student.name);
          //         this.addToSGPAList(response.data[0].student.id);
          //         this.datasets.push({
          //           label: response.data[0].student.name,
          //           data: gradePoints,
          //           backgroundColor: this.backgroundColors[0],
          //           borderColor: this.borderColors[0],
          //           borderWidth: 1
          //         });
          //         this.borderColors.splice(0, 1);
          //         this.backgroundColors.splice(0, 1);
          //       }
          //     })
          //     .catch(error => {
          //       console.log(error);
          //       this.resultNotFoundDialog = true;
          //       this.$q.notify({
          //         type: "negative",
          //         message: `Result not found`
          //       });
          //     })
          //     .finally(() => {
          //       this.drawChart();
          //     });
          // }
        }
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
    },
    addToSGPAList(rollNo) {
      axios
        .get(`${config.semestergpa}?student__id=${rollNo}&semester=${this.sem}`)
        .then(async response => {
          {
            this.studentsList.push(
              Object.assign(response.data[0].student, {
                sgpa: response.data[0].sgpa
              })
            );
          }
        });
    },
    removeEmptyRoll() {}
  }
};
</script>
<style>
@media screen and (min-width: 768px) {
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
@media screen and (max-width: 768px) {
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
