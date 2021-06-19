<template>
  <div class="container">
    <div
      v-if="loading"
      style="position: fixed;width: 100vw;height: 100vh;
                 top: 0;left: 0;right: 0;bottom: 0;
                 background-color: rgba(0,0,0,0.5);z-index: 2;
                cursor: pointer; "
    >
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <q-img class="loading-img" src="../assets/loading-head.gif">
          <div class="absolute-bottom-right text-subtitle2 flex flex-center">
            This might take a minute
          </div>
        </q-img>
      </transition>
    </div>
    <div class="wrapper">
      <StudentInput class="result-input" @success="setResultID($event)" />
      <div class="roll-input flex column bg-white rounded q-pa-lg">
        <q-input
          class="q-mb-md"
          filled
          v-model="rollPrefix"
          bottom-slots
          :rules="[
            val =>
              val.length == 8 || 'Enter first 8 charaters of your full roll no.'
          ]"
          label="Roll no prefix"
        >
          <template v-slot:hint>
            Example: 19fh1a05
          </template></q-input
        >
        <div class="q-pa-md">
          <q-range
            v-model="range"
            :min="1"
            :max="99"
            label
            drag-range
            label-always
          />
          <q-badge color="secondary" class="q-mb-lg text-subtitle2">
            Selected : {{ rollPrefix + rollWithPrefix(range.min) }} -
            {{ rollPrefix + rollWithPrefix(range.max) }}
          </q-badge>
        </div>
        <div class="flex justify-center">
          <q-btn
            style="width:fit-content"
            class="q-mt-sm"
            label="Submit"
            color="primary"
            :disable="!canSearch"
            @click="submit()"
          />
        </div>
      </div>
      <div class="data-container" v-if="Object.keys(datacollection).length">
        <Tip
          title="Info"
          desc="This graph contains all the student with their SPGAs,
                            Tap on any point to know more"
        />
        <!-- <div class="flex flex-center q-mt-lg">
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
    </div> -->

        <div style="overflow-x: auto;">
          <LineChart
            style="height:650px; width:1300px"
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
        <Tip
          title="Important"
          desc="Students who are failed even in 1 subject wont be plotted!"
        />
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

import LineChart from "../charts/LineChart.vue";
import config from "../api.config.js";
import Tip from "../components/Tip.vue";
import StudentInput from "../components/StudentInput.vue";

export default {
  components: {
    StudentInput,
    LineChart,
    Tip
  },
  data() {
    return {
      canSearch: false,
      rollPrefix: "19fh1a05",
      resultID: "",
      loading: false,
      range: {
        min: 1,
        max: 50
      },
      datacollection: {},
      sem: 1
    };
  },
  mounted() {
    //this.fillData();
  },
  methods: {
    rollWithPrefix(roll) {
      if (roll < 10) return `0${roll}`;
      else return roll;
    },
    setResultID(resultID) {
      this.canSearch = true;
      this.resultID = resultID;
    },
    // changeSem(sem) {
    //   this.sem = sem;
    //   this.fillData();
    // },
    submit() {
      this.loading = true;
      var studentNames = [];
      var studentSGPAs = [];

      axios
        .get(
          `https://jntua.plasmatch.in/semResults/${this.resultID}/${this.rollPrefix}/${this.range.min}/${this.range.max}`
        )
        .then(res => {
          this.loading = false;
          console.log(res);
          res.data.sort((a, b) => {
            return b.sgpa - a.sgpa;
          });
          res.data.forEach(ele => {
            studentNames.push(ele["name"]);
            studentSGPAs.push(ele["sgpa"]);
            // console.log(ele.sgpa, ele.name, ele.htn);
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
    },
    fillData() {
      var studentNames = [];
      var studentSGPAs = [];

      axios
        .get(`${config.semestergpa}?ordering=-sgpa&semester=${this.sem}`)
        .then(response => {
          console.log(response.data);
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

<style scoped>
@media screen and (min-width: 768px) {
  .wrapper {
    display: grid;
    gap: 25px;
    margin-top: 50px;
    width: 60%;
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
  .loading-img {
    width: 500px;
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
  .loading-img{
  width: 80%;

  }
}
.loading-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  color: white;
  border-radius: 25px;
}
.rounded {
  border-radius: 20px;
}
</style>
