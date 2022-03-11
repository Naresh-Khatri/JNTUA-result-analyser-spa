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
        <div class="wrapper" style="width: 100vw; max-width: 1000px">
          <StudentInput
            class="result-input"
            v-model="selection"
            @success="onInputSuccess"
          />
          <!-- @success="setSelection($event)" -->
          <div
            class="roll-input q-pa-lg rounded glass"
            :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
          >
            <!-- Roll number input with forward and backward buttons -->
            <div class="flex no-wrap row justify-evenly items-center">
              <q-icon
                name="arrow_back_ios_new"
                style="font-size: 3em"
                :disabled="!!!series.length"
                @click="changeRoll(-1)"
              />
              <q-input
                filled
                label="Roll Number"
                :color="$q.dark.isActive ? 'white' : 'primary'"
                :hide-hint="rollNo != '19fh1a0546'"
                v-model="rollNo"
                :rules="[
                  (val) =>
                    val.length == 10 ||
                    'Enter first 8 charaters of your full roll no.',
                ]"
                @keydown.enter="submit()"
                @keydown.up="changeRoll(-1)"
                @keydown.down="changeRoll(1)"
              />
              <q-icon
                name="arrow_forward_ios"
                style="font-size: 3em"
                :disabled="!!!series.length"
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
          <div class="flex" style="flex-direction: column;align-items: center;">
            <q-card
              class="sgpa-container q-px-lg rounded glass"
              :style="studentName.toUpperCase() == 'NARESH' ? 'bg-cyan-8' : ''"
              v-if="!!series.length"
              flat
            >
              <transition
                appear
                enter-active-class="animated bounceIn"
                mode="out-in"
              >
                <div class="flex flex-center q-px-sm" :key="studentName">
                  <div class="col">
                    <div class="text-center" style="font-size: 1.3rem">
                      {{ studentName }}
                    </div>
                    <q-chip
                      style="float: right"
                      :label="viewCount"
                      icon="visibility"
                      size="sm"
                    />
                  </div>
                  <div class="col" style="max-width: 150px">
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
                      class="q-ma-md"
                    ></q-knob>
                  </div>
                </div>
              </transition>
            </q-card>
            <div
              v-if="!!series.length"
              style="display: flex; justify-content: center"
            >
              <q-btn
                text-color="white"
                label="Share"
                style="background: #25d366"
                @click="share"
              >
                <img width="50px" src="../assets/whatsapp.svg" />
              </q-btn>
            </div>
          </div>
          <div class="data-container q-mb-xl" v-if="!!series.length">
            <div>
              <Tip
                title="Tip 1"
                desc="Click on the column name to sort the rows accordingly"
              />

              <q-table
                title="Result Table"
                :rows="rowData"
                :columns="columns"
                row-key="name"
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
            <!-- sub full forms -->
            <div class="flex justify-center q-mt-sm">
              <q-card
                class="sgpa-container q-px-lg rounded glass"
                style="width: 90%"
                v-if="!!series.length"
                flat
              >
                <q-expansion-item
                  v-model="fullFormsExpanded"
                  label="sub full forms"
                >
                  <div v-for="(row, index) in fullFormsArr" :key="index">
                    <span class="text-h6">{{ row.shortForm }}</span
                    >:
                    <span class="text-caption">{{ row.fullForm }}</span>
                    <q-separator />
                  </div>
                </q-expansion-item>
              </q-card>
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
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";
import apiRoutes from "../apiRoutes";
import { getShort, getBestAttempts } from "../utils/utils";
import G2GP from "../utils/G2GP";
import { backgroundColors, borderColors } from "../colors/colors";

import StudentInput from "../components/StudentInput.vue";
import Tip from "../components/Tip.vue";
import Footer from "../components/Footer.vue";
import { fill } from "src/utils/rolls";
const $route = useRoute();
const $q = useQuasar();
const canSearch = ref(false);
const studentName = ref("");
const rollNo = ref("19fh1a0546");
const viewCount = ref(0);
const selection = ref({ reg: "", course: "", year: "", sem: "" });
const chartName = ref("radar");
const zeroCredSubs = ref([]);
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
const studentSGPA = ref(0);
const rowData = ref([]);
const fullFormsExpanded = ref(false);
const fullFormsArr = ref([]);
const pagination = {
  sortBy: "name",
  descending: false,
  page: 0,
  rowsPerPage: 0,
};
const totalAttempts = ref(0);
const chartOptions = ref({
  chart: { id: "vuechart-example" },
  xaxis: {},
});
const series = ref([]);
const scrollArea = ref(null);
const submitBtnStyle = computed(
  () =>
    `${
      canSearch.value
        ? "width:fit-content; filter: drop-shadow(0 0 0.5rem #ff4d01)"
        : ""
    }`
);
const knobStyle = computed(
  () =>
    `filter: drop-shadow(0 0 0.5rem ${studentSGPA.value > 0 ? "green" : "red"}`
);
onMounted(() => {
  // this.resultID = "56736469";
  // this.canSearch = true;
  // this.fillData();
  checkQueries();
});
const checkQueries = () => {
  // console.log($route.query);
  if (Object.keys($route.query).length > 0) {
    canSearch.value = true;
    //set local selection and forward to selection component
    selection.value = $route.query;
    rollNo.value = selection.value.roll;
    fillData();
  }
  if (!Object.keys($route.query).includes("reg")) return;
  console.log(window.location);
  rollNo.value = $route.query.roll;
  // console.log(rollNo.value, this.resultID);
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
        title: "Hey I analysed my results on this cool website!",
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
  console.log(series.value.length);
  if (!!!series.value.length) {
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
    console.log("of");
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
      rollNo.value = prefix + "a0";
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
const onInputSuccess = () => {
  //can search if sem is emited
  canSearch.value = !!selection.value.sem;
  fillData();
};
const fillData = () => {
  var subjectNames = [];
  var subjectsGrades = [];
  rowData.value = [];
  zeroCredSubs.value = [];
  axios
    .get(
      apiRoutes.singleResultv2 +
        "/" +
        rollNo.value +
        "/" +
        selection.value.reg +
        "/" +
        selection.value.course +
        "/" +
        selection.value.year +
        "/" +
        selection.value.sem
    )
    .then((res) => {
      viewCount.value = res.data.viewCount;
      // console.log(res.data.viewCount);
      if (res.data) {
        $q.notify({
          type: "positive",
          message: `Result retrieved`,
        });
        console.log(res.data);
        console.log("Best Attempt = ");
        // console.log(getBestAttempts(res.data.attempts));
        const bestAttempts = getBestAttempts(res.data.attempts);
        console.log(bestAttempts);
        //calc total attempts
        totalAttempts.value = 0;
        res.data.attempts.forEach((attempt) => {
          if (Object.keys(attempt).length > 0) totalAttempts.value++;
        });
        console.log("attempts count", totalAttempts.value);
        fullFormsArr.value = [];
        bestAttempts.forEach((sub) => {
          //push to full forms array
          fullFormsArr.value.push({
            shortForm: getShort(sub["Subject Name"]),
            fullForm: sub["Subject Name"],
          });
          //push to subject names rowData array
          rowData.value.push({
            subject_name: getShort(sub["Subject Name"]),
            status: sub["Result Status"] == "P" ? "✔" : "❌",
            grade: sub["Grade"] + " (" + G2GP[sub["Grade"]] + ")",
            internals: sub["Internals"],
            externals: sub["Externals"],
            total: sub["Total Marks"],
            credit: sub["Credits"],
            month: sub["month"],
          });
          //dont plot the subjects having 0 credits
          if (sub["Grade"].toUpperCase() != "Y") {
            subjectNames.push(
              `${getShort(sub["Subject Name"])} (${sub["Grade"]})`
            );
            subjectsGrades.push(G2GP[sub["Grade"]]);
            console.log();
          } else {
            zeroCredSubs.value.push(sub["Subject Name"]);
          }
        });
        studentName.value = res.data["name"];
        studentSGPA.value = Number.parseFloat(res.data.sgpa);
        console.log(rowData.value);
      }
    })
    .then(() => {
      //scroll bottom
      // window.scrollTo(0, document.body.scrollHeight);
      scrollArea.value.setScrollPosition(350, 200);
    })
    .catch((error) => {
      console.log(error);
      resultNotFoundDialog.value = true;
      $q.notify({
        type: "negative",
        message: `Result not found`,
      });
      studentName.value = "N/A";
      studentSGPA.value = 0;
    })
    .finally(() => {
      chartOptions.value.xaxis.categories = subjectNames;
      series.value = [{ name: studentName.value, data: subjectsGrades }];
    });
  const test = (e) => {
    console.log(e);
  };
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
