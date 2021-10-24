<template>
  <div class="container">
    <div class="wrapper">
      <!-- <q-dialog v-model="resultNotFoundDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Result Not Found</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          If you think your hall ticket number is correct then go to feedback
          section and provide us the hall ticket number range of your batch like
          this and we'll update our database
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
      <StudentInput class="result-input" @success="setResultID($event)" />
      <div
        class="roll-input q-pa-lg rounded"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      >

      <!-- Roll number input with forward and backward buttons -->
        <div class="flex no-wrap row justify-evenly items-center">
          <q-icon
            name="arrow_back_ios_new"
            style="font-size: 3em;"
            :disabled="!datacollection.datasets"
            @click="changeRoll(-1)"
          />
          <q-input
            filled
            label="Roll Number"
            :color="$q.dark.isActive ? 'white' : 'primary'"
            v-model="rollNo"
          />
          <q-icon
            name="arrow_forward_ios"
            style="font-size: 3em;"
            :disabled="!datacollection.datasets"
            @click="changeRoll(1)"
          />
        </div>
        <!-- Submit button -->
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
      <div class="flex justify-center">
        <q-card
          class="sgpa-container q-px-lg rounded"
          v-if="datacollection.datasets"
          flat
        >
          <div class="flex flex-center q-px-sm">
            <div class="col">
              <div class=" text-center" style="font-size:1.3rem">
                {{ studentName }}
              </div>
            </div>
            <div class="col" style="max-width:150px">
              <q-knob
                readonly
                v-model="studentSGPA"
                show-value
                size="90px"
                :thickness="0.22"
                :max="10"
                color="green"
                track-color="grey-3"
                class=" q-ma-md"
              />
            </div>
          </div>
        </q-card>
        <transition v-if="datacollection.datasets">
          <div style="display:flex; justify-content:center">
            <q-btn
              text-color="white"
              label="Share"
              style="background:#25D366"
              @click="share"
            >
              <img width="50px" src="../assets/whatsapp.svg" />
            </q-btn>
          </div>
        </transition>
      </div>
      <div class="data-container q-mb-xl" v-if="datacollection.datasets">
        <div>
          <Tip
            title="Tip 1"
            desc="Click on the column name to sort the rows accordingly"
          />

          <q-table
            title="Result Table"
            class="q-pt-md"
            dense
            :data="rowData"
            :columns="columns"
            :hide-bottom="true"
            :pagination="pagination"
            row-key="name"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="subject_name" :props="props">
                  {{ props.row.subject_name }}
                </q-td>
                <q-td key="status" :props="props">
                  <q-chip
                    dense
                    size="md"
                    :color="
                      props.row.status == 'Pass' ? 'positive' : 'negative'
                    "
                    class="text-white"
                    >{{ props.row.status }}</q-chip
                  >
                </q-td>
                <q-td dense key="points" :props="props">
                  {{ props.row.points }}
                </q-td>
                <q-td key="grade" :props="props"> {{ props.row.grade }} </q-td>
                <q-td key="credit" :props="props">{{ props.row.credit }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <Tip
          title="Tip 2"
          desc="Here you can choose from various charts like radar,
        line and bar. Also you can tap on any point inside chart to know more"
        />

        <q-tabs
          v-model="chartName"
          indicator-color="primary"
          class="text-primary rounded q-mb-sm q-mx-lg"
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
        >
          <q-tab
            name="radar"
            icon="radar"
            label="Radar"
            :style="$q.dark.isActive ? 'color:white' : ''"
          />
          <q-tab
            name="line"
            icon="show_chart"
            label="Line"
            :style="$q.dark.isActive ? 'color:white' : ''"
          />
          <q-tab
            name="bar"
            icon="bar_chart"
            label="Bar"
            :style="$q.dark.isActive ? 'color:white' : ''"
          />
        </q-tabs>
        <q-tab-panels
          v-model="chartName"
          animated
          class="q-mb-xl shadow-2 rounded"
        >
          <q-tab-panel name="radar" class="rounded">
            <RadarChart :chart-data="datacollection" :key="$q.dark.isActive" />
          </q-tab-panel>

          <q-tab-panel name="line" class="flex flex-center flex-row">
            <LineChart
              style="min-width:90%"
              :chart-data="datacollection"
              :key="$q.dark.isActive"
            />
          </q-tab-panel>

          <q-tab-panel name="bar">
            <BarChart :chart-data="datacollection" :key="$q.dark.isActive" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <div
        v-else
        class="data-container flex flex-center text-h4 text-center text-grey q-mb-xl"
      >
        <q-intersection>
          <q-img
            width="400px"
            src="../assets/sad-emoji.gif"
            style="filter: drop-shadow(0px 0px 4px yellow);"
          />
        </q-intersection>

        Looks so empty here
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import apiRoutes from "../apiRoutes"
import { getShort } from "../utils/utils";
import { backgroundColors, borderColors } from "../colors/colors";

import RadarChart from "../charts/RadarChart.vue";
import BarChart from "../charts/BarChart.vue";
import LineChart from "../charts/LineChart.vue";

import StudentInput from "../components/StudentInput.vue";
import Tip from "../components/Tip.vue";

export default {
  components: {
    RadarChart,
    BarChart,
    LineChart,
    Tip,
    StudentInput
  },
  data() {
    return {
      datacollection: {},
      canSearch: false,
      rollNo: "19fh1a0546",
      resultID: "",
      sem: "1",
      studentName: "",
      chartName: "radar",
      columns: [
        {
          name: "subject_name",
          align: "left",
          label: "Subject Name",
          field: "subject_name",
          sortable: true
        },
        {
          name: "status",
          align: "center",
          label: "Status",
          field: "status",
          sortable: true
        },
        {
          name: "points",
          align: "center",
          label: "Points",
          field: "points",
          sortable: true
        },
        {
          name: "grade",
          align: "center",
          label: "Grade",
          field: "grade",
          sortable: true
        },
        {
          name: "credit",
          align: "center",
          label: "Credits",
          field: "credit",
          sortable: true
        }
      ],
      supply: false,
      studentSGPA: 0,
      rowData: [],
      resultNotFoundDialog: false,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 0,
        rowsPerPage: 0
      },
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
      }
    };
  },
  mounted() {
    // this.resultID = "56736469";
    // this.canSearch = true;
    // this.fillData();
    this.checkQueries();
  },
  methods: {
    setResultID(resultID) {
      this.resultID = resultID;
      this.canSearch = true;
    },
    checkQueries() {
      // console.log(this.$route.query);
      if (!Object.keys(this.$route.query).includes("resultID")) return;
      // console.log(window.location);
      this.rollNoList = this.$route.query.htn;
      this.resultID = this.$route.query.resultID;
      console.log(this.rollNoList, this.resultID);
      this.canSearch = true;
      this.fillData();
    },
    submit() {
      this.fillData();
    },
    share() {
      if (navigator.share) {
        navigator
          .share({
            title: "Hey I compared our results on this cool webApp!",
            url: `${window.location.origin}/#/?resultID=${this.resultID}&rollList=${this.rollNo}`
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
        type: "single",
        htns: [this.rollNo],
        resultID: this.resultID
      });
    },
    changeRoll(val) {
      if (!this.datacollection.datasets) {
        this.$q.notify({
          message: "Please select exam first!",
          type: "info"
        });
        return;
      }
      let chars = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z"
      ];
      //check if roll > 99 by checking whether 2nd from last elem is char
      if (!chars.includes(this.rollNo[this.rollNo.length - 2])) {
        console.log("of");

        var prefix = "";
        for (var i = 0; i < 8; i++) prefix += this.rollNo[i];

        var num = "";
        for (var i = 8; i < this.rollNo.length; i++) num += this.rollNo[i];
        num = parseInt(num);
        num += val;
        //check bounds
        if (num < 1) {
          this.$q.notify({
            message: "Bound reached",
            type: "info"
          });
          return;
        }
        //change roll to a0
        if (num >= 100) {
          this.rollNo = prefix + "a0";
          return;
        }
        // add a 0 in front if num <10
        this.rollNo = prefix + (num < 10 ? `0${num}` : num);
      } else {
        var prefix = "";
        for (var i = 0; i < 8; i++) prefix += this.rollNo[i];
        //TODO
        let char = this.rollNo[8];
        let num = parseInt(this.rollNo[9]);

        num += val;
        if (char.toLowerCase() == "a" && num < 0) {
          char = "9";
          num = 9;
        }
        if (num >= 10) char = chars[chars.indexOf(char) + 1];
        else if (num < 0) {
          num = 9;
          char = chars[chars.indexOf(char) - 1];
        }
        this.rollNo = prefix + char + Math.abs(num % 10);
      }
      this.fillData();
    },
    fillData() {
      var subjectNames = [];
      var subjectGrades = [];
      this.rowData = [];
      axios
        .get(
          `${apiRoutes.singleResult}/${this.resultID}/${this.rollNo}`
        )
        .then(res => {
          // console.log(res);
          if (res.data) {
            this.$q.notify({
              type: "positive",
              message: `Result retrieved`
            });
            res.data.subjects.forEach(sub => {
              this.rowData.push({
                subject_name: getShort(sub["Subject Name"]),
                status: sub["Result Status"] == "P" ? "Pass" : "Failed",
                points: this.g_to_gp[sub["Grades"]],
                grade: sub["Grades"],
                credit: sub["Credits"]
              });
              subjectNames.push(
                `${getShort(sub["Subject Name"])} (${sub["Grades"]})`
              );
              subjectGrades.push(this.g_to_gp[sub["Grades"]]);
            });
            this.studentName = res.data["name"];
            this.studentSGPA = Number.parseFloat(res.data.sgpa);
          }
        })
        .then(() => {
          //scroll bottom
          window.scrollTo(0, document.body.scrollHeight + 100);
        })
        .catch(error => {
          console.log(error);
          this.resultNotFoundDialog = true;

          this.datacollection.datasets = [];
          this.$q.notify({
            type: "negative",
            message: `Result not found`
          });
          this.studentName = "N/A";
          this.studentSGPA = 0;
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
                borderWidth: 1
              }
            ]
          };
        });
    }
  }
};
</script>
<style scoped>
@media screen and (min-width: 1000px) {
  .wrapper {
    display: grid;
    gap: 25px;
    margin-top: 50px;
    width: 60%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      "result-input roll-input"
      "result-input sgpa-container"
      "data-container data-container";
  }
  .sgpa-container {
    grid-area: sgpa-container;
    align-self: center;
    width: 100%;
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
@media screen and (max-width: 1000px) {
  .result-input {
    margin: 20px 10px;
  }
  .roll-input {
    margin: 20px 10px;
  }
  .sgpa-container {
    margin: 20px 10px;
    width: 70%;
  }
  .data-container {
    margin: 20px 10px;
  }
}
.rounded {
  border-radius: 20px;
}
</style>
