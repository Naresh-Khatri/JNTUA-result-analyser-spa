<template>
  <div>
    <div class="flex flex-center q-mt-lg">
      <q-btn-group
        ><q-btn
          label="Sem 1"
          color="primary"
          size="lg"
          :disable="sem == 1"
          @click="changeSem(1)"
        />
        <q-btn
          label="Sem 2"
          color="primary"
          size="lg"
          :disable="sem == 2"
          @click="changeSem(2)"
        />
      </q-btn-group>
    </div>
    <Tip title="Info" desc="This graph contains all the student with their SPGAs,
                            Tap on any point to know more"/>
    <div
      style="overflow-x: auto;">
      <LineChart
        style="height:70vh; width:1600px"
        :chart-data="datacollection"
        :options="{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: 40
          },
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
    </div>
  </div>
</template>

<script>
import axios from "axios";

import LineChart from "../charts/LineChart.vue";
import config from "../api.config.js";
import Tip from '../components/Tip.vue'

export default {
  components: {
    LineChart,
    Tip,
  },
  data() {
    return {
      datacollection: {},
      sem: 1
    };
  },
  mounted() {
    this.fillData();
  },
  updated() {},
  methods: {
    changeSem(sem) {
      this.sem = sem;
      this.fillData();
    },
    fillData() {
      var studentNames = [];
      var studentSGPAs = [];
      axios
        .get(`${config.semestergpa}?ordering=-sgpa&semester=${this.sem}`)
        .then(response => {
          console.log(response.data)
          response.data.forEach(ele => {
            studentNames.push(ele.student.name);
            studentSGPAs.push(ele.sgpa);
          });
        })
        .finally(() => {
          this.datacollection = {
            labels: studentNames,
            datasets: [
              {
                data: studentSGPAs,
                backgroundColor: "#b0b8b4ff",
                borderColor: "#184a45ff"
              }
            ]
          };
        });
    }
  }
};
</script>

<style></style>
