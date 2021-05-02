<template>
  <div>
    <div class="flex row flex-center no-wrap q-ma-lg">
      <!-- <q-icon
        name="arrow_back_ios_new"
        style="font-size: 3em;"
        @click="decRollNo()"
      /> -->
      <div>
        <div class="flex flex-center">
          <q-radio v-model="sem" val="1" label="Sem 1" /><q-radio
            v-model="sem"
            val="2"
            label="Sem 2"
          />
        </div>
        <div>
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
              <!-- <q-icon
                size="md"
                name="remove_circle"
                color="negative"
                v-show="rollNoList.length > 1"
                @click="rollNoList.splice(index, 1)"
              /> -->
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
              @click="fillData"
            />
          </div>
        </div>
      </div>
      <!-- <q-icon
        name="arrow_forward_ios"
        style="font-size: 3em;"
        @click="incRollNo()"
      /> -->
    </div>
    <div v-if="datasets.length">
      <q-tabs
        v-model="chartName"
        indicator-color="primary"
        class="text-primary"
      >
        <q-tab name="radar" icon="radar" label="Radar" />
        <q-tab name="line" icon="show_chart" label="Line" />
        <q-tab name="bar" icon="bar_chart" label="Bar" />
      </q-tabs>
      <q-tab-panels
        v-model="chartName"
        animated
        class="shadow-2 rounded-borders"
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
    <div v-else class="flex flex-center q-ma-xl text-h4 text-center text-grey">
      Looks so empty here :/
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from '../api.config.js'
import { backgroundColors, borderColors } from "../colors/colors";

import RadarChart from "../charts/RadarChart.vue";
import BarChart from "../charts/BarChart.vue";
import LineChart from "../charts/LineChart.vue";

export default {
  components: {
    RadarChart,
    BarChart,
    LineChart
  },
  data() {
    return {
      datacollection: {},
      rollNoList: ["19fh1a0546", "19fh1a0514", "19fh1a0507"],
      sem: "1",
      studentNameList: [],
      datasets: [],
      chartName: "radar",
      subjectNames: [],
      backgroundColors: backgroundColors,
      borderColors: borderColors,
      g_to_gp: {
        S: 10,
        A: 9,
        B: 8,
        C: 7,
        D: 6,
        E: 5,
        F: 0,
        AB: 0
      }
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    async fillData() {
      this.resetData();
      for (var i = 0; i < this.rollNoList.length; i++) {
        var gradePoints = [];
        axios
          .get(
            `${config.results}?search=${this.rollNoList[i]},${this.sem}`
          )
          .then(response => {
            if (response.data.length <= 20) {
              //if rollNo is left empty then api will send all the rows
              //setting it to large no like 20 helps to detect it
              gradePoints = [];
              console.log(response.data);

              response.data.forEach(ele => {
                //console.log(ele);
                if (this.subjectNames.length < response.data.length)
                  this.subjectNames.push(`${ele.subject.abb}`);
                gradePoints.push(this.g_to_gp[ele.grade]);
              });

              this.studentNameList.push(response.data[0].student.name);
              this.datasets.push({
                label: response.data[0].student.name,
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
          })
          .finally(() => {
            this.drawChart();
          });
      }
    },
    async drawChart() {
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
        "rgba(255, 205, 86, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(201, 203, 207, 0.2)",
        "rgba(255, 99, 132, 0.2)",
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
        "rgb(255, 205, 86)",
        "rgb(54, 162, 235)",
        "rgb(201, 203, 207)",
        "rgb(255, 99, 132)"
      ];
      console.log("colors reset");
      console.log(this.backgroundColors);
      console.log(this.borderColors);
    }
  }
};
</script>
