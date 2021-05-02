<template>
  <div>
    <div class="flex row flex-center no-wrap q-ma-lg">
      <q-icon
        name="arrow_back_ios_new"
        style="font-size: 3em;"
        v-show="datacollection.datasets"
        @click="decRollNo()"
      />
      <div>
        <div>
          <q-input filled label="Roll Number" v-model="rollNo" />
          <div>
            <q-radio v-model="sem" val="1" label="Sem 1" /><q-radio
              v-model="sem"
              val="2"
              label="Sem 2"
            />
          </div>
          <div class="flex flex-center">
            <q-btn label="Search" color="primary" size="md" @click="fillData" />
          </div>
        </div>
      </div>
      <q-icon
        name="arrow_forward_ios"
        style="font-size: 3em;"
        v-show="datacollection.datasets"
        @click="incRollNo()"
      />
    </div>
    <div v-if="datacollection.datasets">
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
      rollNo: "19fh1a0546",
      sem: "1",
      studentName: "",
      chartName: "radar",
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
  methods: {
    incRollNo() {
      var prefix = "";
      for (var i = 0; i < 7; i++) prefix += this.rollNo[i];
      var num = "";
      for (var i = 7; i < this.rollNo.length; i++) num += this.rollNo[i];
      num = parseInt(num);
      num++;
      this.rollNo = prefix + num;
      this.fillData();
    },
    decRollNo() {
      var prefix = "";
      for (var i = 0; i < 7; i++) prefix += this.rollNo[i];
      var num = "";
      for (var i = 7; i < this.rollNo.length; i++) num += this.rollNo[i];
      num = parseInt(num);
      num--;
      this.rollNo = prefix + num;
      this.fillData();
    },
    fillData() {
      var subjectNames = [];
      var subjectGrades = [];
      axios
        .get(
          `${config.results}?search=${this.rollNo},${this.sem}`
        )
        .then(response => {
          response.data.forEach(ele => {
            //console.log(ele);
            subjectNames.push(`${ele.subject.abb} (${ele.grade})`);
            subjectGrades.push(this.g_to_gp[ele.grade]);
          });
          this.studentName = response.data[0].student.name;
        })
        .catch(error => {
          console.log(error);
          this.datacollection.datasets=[]
          this.$q.notify({
            type: "negative",
            message: `Undefined student Roll No`
          });
        })
        .finally(() => {
          this.datacollection = {
            labels: subjectNames,
            datasets: [
              {
                label: this.studentName,
                data: subjectGrades,
                backgroundColor: backgroundColors[1],
                borderColor: borderColors[1],
              borderWidth:1
              },
            ]
          };
        });
    }
  }
};
</script>
