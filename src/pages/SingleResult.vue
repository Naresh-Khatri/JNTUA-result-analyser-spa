<template>
  <div class="container">
    <q-scroll-area
      ref="scrollArea"
      vertical
      style="height:90vh; width:100vw"
      :thumb-style="{
        bottom: '4px',
        borderRadius: '5px',
        background: '#ff4d01',
        width: '10px',
        opacity: 0.5
      }"
    >
      <div style="display:flex; justify-content:center;">
        <div class="wrapper" style="width:100%; max-width:1000px">
          <StudentInput
            class="result-input"
            v-model="selection"
            @success="setSelection($event)"
          />
          <div
            class="roll-input q-pa-lg rounded glass"
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
                :rules="[
                  val =>
                    val.length == 10 ||
                    'Enter first 8 charaters of your full roll no.'
                ]"
                @keydown.enter="submit()"
                @keydown.up="changeRoll(-1)"
                @keydown.down="changeRoll(1)"
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
                :style="submitBtnStyle"
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
              class="sgpa-container q-px-lg rounded glass"
              v-if="datacollection.datasets"
              flat
              ><transition
                appear
                enter-active-class="animated bounceIn"
                mode="out-in"
              >
                <div class="flex flex-center q-px-sm" :key="studentName">
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
                      :style="knobStyle"
                      track-color="grey-3"
                      class=" q-ma-md"
                    ></q-knob>
                  </div>
                </div>
              </transition>
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
                  <q-tr :props="props" style="width:10px">
                    <q-td dense auto-width key="subject_name" :props="props">
                      {{ props.row.subject_name }}
                    </q-td>
                    <q-td dense auto-width key="status" :props="props">
                      <q-chip
                        dense
                        auto-width
                        size="md"
                        :color="
                          props.row.status == '✔' ? 'positive' : 'negative'
                        "
                        :style="
                          props.row.status == '✔'
                            ? 'filter: drop-shadow(0 0 0.5rem #25D366)'
                            : 'filter: drop-shadow(0 0 0.5rem #FF4D01)'
                        "
                        class="text-white q-pa-xm"
                        >{{ props.row.status }}</q-chip
                      >
                    </q-td>

                    <q-td
                      dense
                      auto-width
                      style="padding:0px"
                      key="marks"
                      :props="props"
                    >
                      <!-- 25 + 50 = 75 -->
                      <div v-if="!props.row.total" style="font-size:22px;">
                        🤷‍♀️
                      </div>
                      <div v-else>
                        {{ props.row.total }} ({{ props.row.externals }} +
                        {{ props.row.internals }})
                      </div>
                    </q-td>
                    <q-td dense auto-width key="grade" :props="props">
                      {{ props.row.grade }}
                    </q-td>
                    <!-- <q-td dense auto-width key="points" :props="props">
                      {{ props.row.points }}
                    </q-td> -->
                    <q-td dense auto-width key="credit" :props="props">{{
                      props.row.credit
                    }}</q-td>
                    <q-td dense auto-width key="month" :props="props">{{
                      props.row.month
                    }}</q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
            <!-- sub full forms -->
            <div class="flex justify-center q-mt-sm">
              <q-card
                class="sgpa-container q-px-lg rounded glass"
                style="width:90%"
                v-if="datacollection.datasets"
                flat
              >
                <q-expansion-item
                  v-model="fullFormsExpanded"
                  label="sub full forms"
                >
                  <div v-for="(row, index) in fullFormsArr" :key="index">
                    <span class="text-h6"> {{ row.shortForm }}</span
                    >: <span class="text-caption">{{ row.fullForm }}</span>
                    <q-separator />
                  </div> </q-expansion-item
              ></q-card>
            </div>
            <Tip
              title="Tip 2"
              desc="Here you can choose from various charts like radar,
        line and bar. Also you can tap on any point inside chart to know more"
            />

            <q-tabs
              v-model="chartName"
              indicator-color="primary"
              class="text-primary rounded q-mt-md q-mb-sm q-mx-lg"
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
                <RadarChart
                  :chart-data="datacollection"
                  :key="$q.dark.isActive"
                />
                <div
                  class="text-right  text-grey-6"
                  v-if="zeroCredSubs.length > 0"
                >
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
                <LineChart
                  style="min-width:90%"
                  :chart-data="datacollection"
                  :key="$q.dark.isActive"
                />
              </q-tab-panel>

              <q-tab-panel name="bar">
                <BarChart
                  :chart-data="datacollection"
                  :key="$q.dark.isActive"
                />
              </q-tab-panel>
              sdfdsfsdfasdf
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
    </q-scroll-area>
    <Footer />
  </div>
</template>

<script>
import axios from "axios";
import apiRoutes from "../apiRoutes";
import { getShort, getBestAttempts } from "../utils/utils";
import G2GP from "../utils/G2GP";
import { backgroundColors, borderColors } from "../colors/colors";

import RadarChart from "../charts/RadarChart.vue";
import BarChart from "../charts/BarChart.vue";
import LineChart from "../charts/LineChart.vue";

import StudentInput from "../components/StudentInput.vue";
import Tip from "../components/Tip.vue";
import Footer from "../components/Footer.vue";

export default {
  components: {
    RadarChart,
    BarChart,
    LineChart,
    StudentInput,
    Tip,
    Footer
  },
  data() {
    return {
      datacollection: {},
      canSearch: false,
      rollNo: "19fh1a0546",
      selection: {},
      sem: "1",
      studentName: "",
      chartName: "radar",
      zeroCredSubs: [],
      columns: [
        {
          name: "subject_name",
          align: "left",
          label: "Subject",
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
          name: "marks",
          align: "center",
          label: "Marks (Ext+Int)",
          field: "marks",
          sortable: true
        },
        {
          name: "grade",
          align: "center",
          label: "Grade(pts)",
          field: "grade",
          sortable: true
        },
        {
          name: "credit",
          align: "center",
          label: "Credits",
          field: "credit",
          sortable: true
        },
        {
          name: "month",
          align: "center",
          label: "Month",
          field: "month",
          sortable: true
        }
      ],
      studentSGPA: 0,
      rowData: [],
      fullFormsExpanded: false,
      fullFormsArr: [],
      pagination: {
        sortBy: "name",
        descending: false,
        page: 0,
        rowsPerPage: 0
      },
      G2GP: G2GP,
      selectionInput: {},
      totalAttempts: 0
    };
  },
  computed: {
    submitBtnStyle() {
      return `${
        this.canSearch
          ? "width:fit-content; filter: drop-shadow(0 0 0.5rem #ff4d01)"
          : ""
      }`;
    },
    knobStyle() {
      return `filter: drop-shadow(0 0 0.5rem ${
        this.studentSGPA > 0 ? "green" : "red"
      });`;
    }
  },
  mounted() {
    // this.resultID = "56736469";
    // this.canSearch = true;
    // this.fillData();
    this.checkQueries();
  },
  methods: {
    setSelection(selection) {
      //dont set selection if params passed
      // if (Object.keys(this.$route.query).includes("roll")) return;
      this.selectionInput = selection;
      this.canSearch = !!this.selectionInput.sem;
    },
    checkQueries() {
      console.log(this.$route.query);
      if (Object.keys(this.$route.query).length > 0) {
        this.canSearch = true;
        //set local selection and forward to selection component
        this.selectionInput = this.$route.query;
        this.selection = this.$route.query;
        this.rollNo = this.selection.roll;
        this.fillData();
      }
      if (!Object.keys(this.$route.query).includes("reg")) return;
      console.log(window.location);
      this.rollNo = this.$route.query.roll;
      // console.log(this.rollNo, this.resultID);
      this.canSearch = true;
      // this.fillData();
    },
    submit() {
      this.fillData();
    },
    share() {
      if (navigator.share) {
        navigator
          .share({
            title: "Hey I analysed my results on this cool website!",
            url:
              window.location.origin +
              window.location.pathname +
              "#/?reg=" +
              this.selectionInput.reg +
              "&course=" +
              this.selectionInput.course +
              "&sem=" +
              this.selectionInput.sem +
              "&year=" +
              this.selectionInput.year +
              "&roll=" +
              this.rollNo
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
      var subjectsGrades = [];
      this.rowData = [];
      (this.zeroCredSubs = []),
        axios
          .get(
            apiRoutes.singleResultv2 +
              "/" +
              this.rollNo +
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
            if (res.data) {
              this.$q.notify({
                type: "positive",
                message: `Result retrieved`
              });
              console.log(res.data);
              console.log("Best Attempt = ");
              // console.log(getBestAttempts(res.data.attempts));
              const bestAttempts = getBestAttempts(res.data.attempts);
              console.log(bestAttempts);

              //calc total attempts
              this.totalAttempts = 0;
              res.data.attempts.forEach(attempt => {
                if (Object.keys(attempt).length > 0) this.totalAttempts++;
              });
              console.log("attempts count", this.totalAttempts);
              this.fullFormsArr = [];
              bestAttempts.forEach(sub => {
                //push to full forms array
                this.fullFormsArr.push({
                  shortForm: getShort(sub["Subject Name"]),
                  fullForm: sub["Subject Name"]
                });
                //push to subject names rowData array
                this.rowData.push({
                  subject_name: getShort(sub["Subject Name"]),
                  status: sub["Result Status"] == "P" ? "✔" : "❌",
                  grade: sub["Grade"] + " (" + this.G2GP[sub["Grade"]] + ")",
                  internals: sub["Internals"],
                  externals: sub["Externals"],
                  total: sub["Total Marks"],
                  credit: sub["Credits"],
                  month: sub["month"]
                });

                //dont plot the subjects having 0 credits
                if (sub["Grade"].toUpperCase() != "Y") {
                  subjectNames.push(
                    `${getShort(sub["Subject Name"])} (${sub["Grade"]})`
                  );
                  subjectsGrades.push(this.G2GP[sub["Grade"]]);
                } else {
                  this.zeroCredSubs.push(sub["Subject Name"]);
                }
              });
              this.studentName = res.data["name"];
              this.studentSGPA = Number.parseFloat(res.data.sgpa);
            }
          })
          .then(() => {
            //scroll bottom
            // window.scrollTo(0, document.body.scrollHeight);
            this.$refs.scrollArea.setScrollPosition(350, 200);
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
                  data: subjectsGrades,
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
</style>
