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
            This take a second or two🙋‍♀️
          </div>
        </q-img>
      </transition>
    </div>
    <div class="wrapper">
      <StudentInput
        class="result-input"
        v-model="selection"
        @success="setSelection($event)"
      />
      <div
        class="roll-input flex column rounded q-pa-lg"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      >
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
            :max="350"
            drag-range
          />
          <q-badge color="secondary" class="q-mb-lg text-subtitle2">
            Selected : {{ rollPrefix }}
            <span class="text-h5">{{ rollWithPrefix(range.min) }} </span> -
            {{ rollPrefix }}
            <span class="text-h5">{{ rollWithPrefix(range.max) }} </span> 
          </q-badge>
        </div>
        <div class="flex justify-center">
          <q-btn
            style="width:150px"
            color="primary"
            :loading="loading"
            :disable="!(canSearch && rollPrefix.length == 8)"
            @click="submit()"
          >
            Submit
            <template v-slot:loading>
              <q-spinner-gears class="on-left" />
              Fetching...
            </template>
          </q-btn>
        </div>
      </div>
      <div class="data-container" v-if="Object.keys(datacollection).length > 0">
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

        <q-card class="sgpa-container q-pa-md rounded" flat>
          <div class="flex flex-center q-px-sm">
            <div class="col">
              <div class=" text-center" style="font-size:1.3em; font-weight:4000">
                Toppers 😒
                <q-separator class="q-my-md" spaced="true"/>

                <i class="fas fa-crown" style="color:gold"> </i>
                {{ datacollection.labels[0] }}(
                {{ datacollection.datasets[0].data[0] }}
                )
                <br />
                <i class="fas fa-crown" style="color:silver"> </i>
                {{ datacollection.labels[1] }}(
                {{ datacollection.datasets[0].data[1] }}
                )
                <br />
                <i class="fas fa-crown" style="color:brown"> </i>
                {{ datacollection.labels[2] }}(
                {{ datacollection.datasets[0].data[2] }}
                )
              </div>
            </div>
            <!-- <div class="col" style="max-width:150px">
                  <q-knob
                    readonly
                    show-value
                    size="90px"
                    :thickness="0.22"
                    :max="10"
                    color="green"
                    track-color="grey-3"
                    class=" q-ma-md"
                  ></q-knob>
                </div> -->
          </div>
        </q-card>
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
        <div
          style="overflow-x: auto;padding:20px; border-radius:25px;margin:20px 0px"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
        >
          <q-scroll-area
            horizontal
            style="height:550px;"
            :thumb-style="{
              bottom: '4px',
              borderRadius: '5px',
              background: '#b0b8b4ff',
              width: '10px',
              opacity: 1
            }"
            :style="!$q.screen.lt.md ? 'height:700px' : ''"
          >
            <LineChart
              style="height:550px; width:1300px"
              :style="!$q.screen.lt.md ? 'height:700px' : ''"
              :chart-data="datacollection"
              :yMax="10"
              :key="$q.dark.isActive"
            />
          </q-scroll-area>
        </div>
        <Tip
          title="Important"
          desc="Students who are failed even in 1 subject wont be plotted!"
        />
      </div>
      <div
        v-else
        class="data-container flex flex-center text-h4 text-center text-grey q-mb-xl"
      >
        <q-intersection>
          <q-img
            width="400px"
            src="../assets/sad-emoji.gif"
            style="filter: drop-shadow(0px 0px 6px yellow);"
          />
        </q-intersection>

        Looks so empty here
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import LineChart from "../charts/LineChart.vue";
import Tip from "../components/Tip.vue";
import StudentInput from "../components/StudentInput.vue";
import apiRoutes from "src/apiRoutes";

import rollsArray from '../utils/rolls'

export default {
  components: {
    StudentInput,
    LineChart,
    Tip
  },
  data() {
    return {
      canSearch: false,
      rollPrefix: "209E1A05",
      selection: {},
      loading: false,
      range: {
        min: 1,
        max: 50
      },
      datacollection: {},
      selectionInput: {}
    };
  },
  mounted() {
    // this.resultID = "56736469";
    // this.canSearch = true;
    this.checkQueries();

    //to show Under Development
    if (false)
      this.$q.dialog({
        title: "Under Development",
        html: true,
        persistent: true,
        message: `This feature is still under development. Please check back later!`
      });
  },
  methods: {
    rollWithPrefix(roll) {
      return rollsArray[roll].toUpperCase()
      // if (roll < 10) return `0${roll}`;
      // else return roll;
    },
    setSelection(selection) {
      this.selectionInput = selection;
      this.canSearch = true;
    },
    checkQueries() {
      if (!Object.keys(this.$route.query).includes("reg")) return;

      // console.log(Object.keys(this.$route.query).includes("resultID"));
      this.selectionInput = this.$route.query;
      this.selection = this.$route.query;
      // console.log(this.$route.query);
      this.resultID = this.$route.query.resultID;
      this.range.rollPrefix = this.$route.query.prefix;
      this.range.min = this.$route.query.min;
      this.range.max = this.$route.query.max;

      // console.log(window.location);
      this.submit();
    },
    share() {
      if (navigator.share) {
        navigator
          .share({
            title: "Hey I saw our entire batch result on this cool webApp!",
            url:
              window.location.origin +
              window.location.pathname +
              "#/batch-result?reg=" +
              this.selectionInput.reg +
              "&course=" +
              this.selectionInput.course +
              "&sem=" +
              this.selectionInput.sem +
              "&year=" +
              this.selectionInput.year +
              "&roll=" +
              this.rollPrefix +
              "&min=" +
              this.range.min +
              "&max=" +
              this.range.max
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
        type: "batch",
        htns: [
          this.rollPrefix + this.rollWithPrefix(this.range.min),
          this.rollPrefix + this.rollWithPrefix(this.range.max)
        ],
        resultID: this.resultID
      });
    },
    submit() {
      this.loading = true;
      var studentNames = [];
      var studentSGPAs = [];

      axios
        .get(
          apiRoutes.batchResultsv2 +
            "/" +
            this.rollPrefix +
            "/" +
            this.range.min +
            "/" +
            this.range.max +
            "/" +
            this.selectionInput.reg +
            "/" +
            this.selectionInput.course +
            "/" +
            this.selectionInput.year +
            "/" +
            this.selectionInput.sem
        )
        .then(res => {
          this.loading = false;
          console.log(res);
          // res.data.map(s => console.log(s.sgpa));
          res.data.sort((a, b) => {
            return b.sgpa - a.sgpa;
          });
          // res.data.map(s => console.log(s.sgpa));

          res.data.forEach(ele => {
            studentNames.push(`${ele["name"]} (${ele["htn"].slice(-2)})`);
            studentSGPAs.push(ele["sgpa"]);
            // console.log(ele.sgpa, ele.name, ele.htn);
          });
        })
        .then(() => {
          //scroll bottom
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight - 1000);
          }, 300);
        })
        .finally(() => {
          this.datacollection = {
            labels: studentNames,
            datasets: [
              {
                data: studentSGPAs,
                backgroundColor: "#ff4d0155",
                borderColor: "#ff4d01"
              }
            ]
          };
        });
    }
  }
};
</script>

<style scoped>
@media screen and (min-width: 1024px) {
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
  .loading-img {
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
