<template>
  <div class="container">
    <q-scroll-area
      ref="scrollArea"
      vertical
      style="height: 90vh; width: 100vw"
      :thumb-style="{
        bottom: '4px',
        borderRadius: '5px',
        background: '#ff4d01',
        width: '10px',
        opacity: 0.5,
      }"
    >
      <div style="display: flex; justify-content: center">
        <div style="width: 100vw; max-width: 1000px">
          <StudentInputShort
            class="q-my-md q-mx-sm"
            v-model="selection"
            @success="onInputSuccess"
          />
          <div
            class="roll-input q-pa-lg q-my-md q-mx-sm rounded"
            :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
          >
            <!-- Roll number input with forward and backward buttons -->
            <div class="flex no-wrap row justify-evenly items-center">
              <q-icon
                name="arrow_back_ios_new"
                style="font-size: 3em"
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
                style="font-size: 3em"
                :disabled="!datacollection.datasets"
                @click="changeRoll(1)"
              />
            </div>
            <!-- Submit button -->
            <div class="flex justify-center">
              <q-btn
                style="width: fit-content"
                class="q-mt-sm"
                label="Submit"
                color="primary"
                :disable="!canSearch"
                @click="submit()"
              />
            </div>
          </div>
          <q-card
            v-if="resultsList.length"
            class="relative q-mx-xl q-my-md q-pa-lg rounded"
            flat
          >
            <div class="text-h5 text-center">{{ studentName }}</div>
            <!-- <div class="text-center text-caption">
              backlogs: {{ totalBacklogs }}
            </div>-->
            <div
              v-if="isDetained"
              class="flex flex-center"
              style="
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0px;
                left: 0px;
                background: rgba(200, 0, 0, 0.5);
                border-radius: 20px;
              "
            >
              <q-icon size="xl" color="white" name="block" />
            </div>
          </q-card>
          <div class="row">
            <!-- <q-btn color="brown" label="Button" v-for="n in 7" :key="`xs-${n}`" /> -->
            <div
              class="col-4 flex flex-center q-my-md rounded"
              style="flex-basis: 50%; width: 25%"
              flat
              v-for="(result, index) in resultsList"
              :key="index + rollNo"
              @click="setSemIndex(index)"
            >
              <SgpaTile
                :sgpa="result.sgpa"
                :year="result.year"
                :sem="result.sem"
                :active="index == selectedSemIndex"
              />
            </div>
            <!-- <transition v-if="datacollection.datasets">
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
            </transition>-->
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
                :rows="rowData"
                :columns="columns"
                :hide-bottom="true"
                :pagination="pagination"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td dense auto-width key="subject_name" :props="props">{{
                      props.row.subject_name
                    }}</q-td>
                    <q-td dense auto-width key="status" :props="props">
                      <q-chip
                        auto-width
                        size="md"
                        :color="
                          props.row.status == '✔' ? 'positive' : 'negative'
                        "
                        class="text-white q-pa-xm"
                        >{{ props.row.status }}</q-chip
                      >
                    </q-td>
                    <q-td dense auto-width key="marks" :props="props">
                      <div v-if="!props.row.total" style="font-size: 22px">
                        🤷‍♀️
                      </div>
                      <div v-else>
                        {{ props.row.total }} ({{ props.row.externals }} +
                        {{ props.row.internals }})
                      </div>
                    </q-td>
                    <q-td dense auto-width key="grade" :props="props">{{
                      props.row.grade
                    }}</q-td>
                    <q-td dense auto-width key="points" :props="props">{{
                      props.row.points
                    }}</q-td>
                    <q-td dense auto-width key="credit" :props="props">
                      {{ props.row.credit }}
                    </q-td>
                    <q-td dense auto-width key="month" :props="props">
                      {{ props.row.month }}
                    </q-td>
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
              class="text-primary rounded q-my-md q-mx-lg"
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
                {{ chartName }}
                <VueApexCharts
                  width="100%"
                  height="350"
                  :type="chartName"
                  :options="chartOptions"
                  :series="series"
                />
                <div
                  class="text-right text-grey-6"
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
                <VueApexCharts
                  width="100%"
                  height="350"
                  :type="chartName"
                  :options="chartOptions"
                  :series="series"
                />
                <div
                  class="text-right text-grey-6"
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

              <q-tab-panel name="bar">
                <VueApexCharts
                  width="100%"
                  height="350"
                  :type="chartName"
                  :options="chartOptions"
                  :series="series"
                />
                <div
                  class="text-right text-grey-6"
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
                style="filter: drop-shadow(0px 0px 4px yellow)"
              /> </q-intersection
            >Looks so empty here
          </div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";

import axios from "axios";
import apiRoutes from "../apiRoutes";
import VueApexCharts from "vue3-apexcharts";

import { getShort, getBestAttempts } from "../utils/utils";
import { backgroundColors, borderColors } from "../colors/colors";

import StudentInputShort from "../components/StudentInputShort.vue";
import SgpaTile from "../components/SgpaTile.vue";
import Tip from "../components/Tip.vue";

const datacollection = ref({});
const canSearch = ref(false);
const rollNo = ref("19fh1a0546");
const selection = ref({});
const releasedResults = ref({});
const studentName = ref("");
const chartName = ref("radar");
const chartOptions = ref({
  chart: { id: "vuechart-example" },
  xaxis: {},
});
const series = ref([]);
const columns = [
  {
    name: "subject_name",
    align: "left",
    label: "Subject",
    field: "subject_name",
    sortable: true,
  },
  {
    name: "status",
    align: "center",
    label: "Status",
    field: "status",
    sortable: true,
  },

  {
    name: "marks",
    align: "center",
    label: "Marks (Ext+Int)",
    field: "marks",
    sortable: true,
  },
  {
    name: "grade",
    align: "center",
    label: "Grade(pts)",
    field: "grade",
    sortable: true,
  },
  {
    name: "credit",
    align: "center",
    label: "Credits",
    field: "credit",
    sortable: true,
  },
  {
    name: "month",
    align: "center",
    label: "Month",
    field: "month",
    sortable: true,
  },
];
const resultsList = ref([]);
const selectedSemIndex = ref(0);
const zeroCredSubs = ref([]);
const isDetained = ref(false);
const isOnCooldown = ref(false);
const totalBacklogs = ref(0);
const rowData = ref([]);
const pagination = {
  sortBy: "name",
  descending: false,
  page: 0,
  rowsPerPage: 0,
};
const g_to_gp = {
  S: 10,
  O: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
  AB: 0,
  Y: 0,
};
const $q = useQuasar();
const onInputSuccess = () => {
  //dont set selection if params passed
  // if (Object.keys(this.$route.query).includes("roll")) return;
  canSearch.value = true;
  fillData();
};
const checkQueries = () => {
  console.log($route.query);
  if (Object.keys($route.query).length > 0) {
    canSearch.value = true;
    selection.value = $route.query;
    fillData();
  }
  if (!Object.keys($route.query).includes("reg")) return;
  console.log(window.location);
  rollNo.value = $route.query.roll;
  // console.log(this.rollNo, this.resultID);
  canSearch.value = true;
  // this.fillData();
};
const submit = () => {
  fillData();
};
const share = () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Hey I compared our results on this cool webApp!",
        url:
          window.location.origin +
          window.location.pathname +
          "#/?reg=" +
          selection.value.reg +
          "&course=" +
          selection.value.course +
          "&sem=" +
          selection.value.sem +
          "&year=" +
          selection.value.year +
          "&roll=" +
          rollNo.value,
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
    type: "single",
    htns: [rollNo.value],
    resultID: resultID.value,
  });
};
const changeRoll = (val) => {
  //limit search
  if (isOnCooldown.value) {
    $q.notify({
      type: "warning",
      message: `calm down bro chill!😤`,
    });
    return;
  }
  isOnCooldown.value = true;
  setTimeout(() => {
    isOnCooldown.value = false;
  }, 500);
  if (!datacollection.datasets) {
    $q.notify({
      message: "Please select exam first!",
      type: "info",
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
    "z",
  ];
  //check if roll > 99 by checking whether 2nd from last elem is char
  if (!chars.includes(rollNo.value[rollNo.value.length - 2])) {
    // console.log("of");

    var prefix = "";
    for (var i = 0; i < 8; i++) prefix += rollNo.value[i];

    var num = "";
    for (var i = 8; i < rollNo.value.length; i++) num += rollNo.value[i];
    num = parseInt(num);
    num += val;
    //check bounds
    if (num < 1) {
      $q.notify({
        message: "Bound reached",
        type: "info",
      });
      return;
    }
    //change roll to a0
    if (num >= 100) {
      rollNo = prefix + "a0";
      return;
    }
    // add a 0 in front if num <10
    rollNo.value = prefix + (num < 10 ? `0${num}` : num);
  } else {
    var prefix = "";
    for (var i = 0; i < 8; i++) prefix += rollNo.value[i];
    //TODO
    let char = rollNo.value[8];
    let num = parseInt(rollNo.value[9]);

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
    rollNo.value = prefix + char + Math.abs(num % 10);
  }
  fillData();
};
const fillData = () => {
  var subjectNames = [];
  var subjectGrade = [];
  rowData.value = [];
  totalBacklogs.value = 0;
  resultsList.value = [];
  isDetained.value = false;
  const promises = [];
  Object.keys(selection.value.yearSemObj).forEach((year) => {
    Object.keys(selection.value.yearSemObj[year]).forEach((sem) => {
      // console.log(year, sem);
      //only add promise if sem isn't null
      if (sem == "null") return;
      promises.push(
        axios.get(
          apiRoutes.singleResultv2 +
            "/" +
            rollNo.value +
            "/" +
            selection.value.reg +
            "/" +
            selection.value.course +
            "/" +
            year +
            "/" +
            sem
        )
      );
    });
  });
  console.log(promises);
  Promise.all(promises)
    .then((res) => {
      console.log(res);
      resultsList.value = [];
      if (res) {
        $q.notify({
          type: "positive",
          message: `${res.length} result retrieved 👀`,
        });
      }
      //set student name
      for (let i = 0; i < res.length; i++) {
        // console.log(result.data.attempts);
        if (res[i].data.attempts == undefined) {
          // this.isDetained = true;
          continue;
        }
        studentName.value = res[i].data.name;
        const bestAttempt = getBestAttempts(res[i].data.attempts);
        //calc totalBacklogs
        // console.log(bestAttempt);
        bestAttempt.forEach((sub) => {
          if (sub["Result Status"].toUpperCase() === "F") totalBacklogs.value++;
        });
        const { sgpa, sem, year } = res[i].data;
        // console.log(result);
        resultsList.value.push({
          sgpa,
          sem,
          year,
          bestAttempt,
        });
      }
      //if no results found then set student name as NA
      if (resultsList.value.length == 0) {
        studentName.value = "NA";
      }
      console.log(resultsList);
      setSemIndex(0);
    })
    .catch((err) => console.log(err));
};
const setSemIndex = (semIndex) => {
  selectedSemIndex.value = semIndex;
  const subjectNames = [];
  const subjectGrades = [];
  rowData.value = [];
  zeroCredSubs.value = [];
  if (resultsList.value[0] == undefined) return;
  resultsList.value[semIndex].bestAttempt.forEach((sub) => {
    rowData.value.push({
      subject_name: getShort(sub["Subject Name"]),
      status: sub["Result Status"] == "P" ? "✔" : "❌",
      grade: sub["Grade"] + " (" + g_to_gp[sub["Grade"]] + ")",
      internals: sub["Internals"],
      externals: sub["Externals"],
      total: sub["Total Marks"],
      credit: sub["Credits"],
      month: sub["month"],
    });
    //dont plot the subjects having 0 credits
    if (sub["Grade"].toUpperCase() != "Y") {
      subjectNames.push(`${getShort(sub["Subject Name"])} (${sub["Grade"]})`);
      subjectGrades.push(g_to_gp[sub["Grade"]]);
    } else {
      zeroCredSubs.value.push(sub["Subject Name"]);
    }
  });
  console.log(rowData.value);
  datacollection.value = {
    labels: subjectNames,
    datasets: [
      {
        label: studentName.value,
        data: subjectGrades,
        backgroundColor: backgroundColors[1],
        borderColor: borderColors[1],
        borderWidth: 1,
      },
    ],
  };
  chartOptions.value.xaxis.categories = subjectNames;
  series.value = [{ name: studentName.value, data: subjectGrades }];
  console.log(chartOptions.value);
  console.log(series.value);
};
</script>
<style scoped></style>
