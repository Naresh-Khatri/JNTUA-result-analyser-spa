<template>
  <div class="container">
    <div
      v-if="loading"
      style="
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 2;
        backdrop-filter: blur(2.5px);
        cursor: pointer;
      "
    >
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <q-img class="loading-img" src="../assets/loading-head.gif">
          <div class="absolute-bottom-right text-subtitle2 flex flex-center">
            This takes around 10 second...🙋‍♀️
          </div>
        </q-img>
      </transition>
    </div>
    <div class="wrapper">
      <StudentInput
        class="result-input"
        v-model="selection"
        @success="onInputSuccess"
      />
      <div
        class="roll-input flex column rounded q-pa-md"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      >
        <q-input
          class="q-mb-md"
          filled
          v-model="rollPrefix"
          bottom-slots
          :rules="[
            (val) =>
              val.length == 8 ||
              'Enter first 8 charaters of your full roll no.',
          ]"
          label="Roll no prefix"
          clearable
        >
          <template v-slot:hint>Example: 19fh1a05</template>
        </q-input>
        <div class="q-pa-md">
          <q-range v-model="range" :min="1" :max="350" drag-range />
          <q-badge color="secondary" class="q-mb-lg text-subtitle2">
            Selected : {{ rollPrefix }}
            <span class="text-h5">{{ rollWithPrefix(range.min) }}</span>
            -
            {{ rollPrefix }}
            <span class="text-h5">{{ rollWithPrefix(range.max) }}</span>
          </q-badge>
        </div>
        <q-expansion-item
          expand-separator
          expand-icon-toggle
          class="q-ma-md"
          icon="add"
          label="Extra Rolls"
        >
          <q-card>
            <q-card-section>
              <div v-for="(rollNo, index) in extraRolls" :key="index">
                <div class="flex flex-center">
                  <q-input
                    filled
                    ref="rollInput"
                    label="Roll Number"
                    :color="$q.dark.isActive ? 'white' : 'primary'"
                    :rules="[(val) => validateRollNo(val)]"
                    v-model="extraRolls[index]"
                  >
                    <template v-slot:append>
                      <q-btn
                        round
                        dense
                        flat
                        icon="remove_circle"
                        color="negative"
                        v-show="extraRolls.length > 1"
                        @click="removeRollNo(index)"
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
                  @click="addExtraRoll"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <div class="flex justify-center">
          <q-btn
            style="width: 150px"
            color="primary"
            :loading="loading"
            :disable="!(canSearch && rollPrefix.length == 8)"
            @click="submit()"
          >
            Submit
            <template v-slot:loading>
              <q-spinner-gears class="on-left" />Fetching...
            </template>
          </q-btn>
        </div>
      </div>
      <div
        class="data-container"
        v-if="Object.keys(sgpaDataCollection).length > 0"
      >
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
        </div>-->

        <q-card class="sgpa-container q-pa-md rounded glass" flat>
          <div class="flex flex-center q-px-sm">
            <div class="col">
              <div
                class="text-center"
                style="font-size: 1.3em; font-weight: 4000"
              >
                Toppers 😒
                <q-separator class="q-my-md" spaced="true" />

                <i class="fas fa-crown" style="color: gold"></i>
                {{ sgpaDataCollection.labels[0].slice(0, -7) }}(
                {{ sgpaDataCollection.datasets[0].data[0] }}
                )
                <br />
                <i class="fas fa-crown" style="color: silver"></i>
                {{ sgpaDataCollection.labels[1].slice(0, -7) }}(
                {{ sgpaDataCollection.datasets[0].data[1] }}
                )
                <br />
                <i class="fas fa-crown" style="color: brown"></i>
                {{ sgpaDataCollection.labels[2].slice(0, -7) }}(
                {{ sgpaDataCollection.datasets[0].data[2] }}
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
            </div>-->
          </div>
        </q-card>
        <div style="display: flex; justify-content: center">
          <q-btn
            class="text-white"
            label="Share"
            style="background: #25d366"
            @click="share"
          >
            <img width="50px" src="../assets/whatsapp.svg" />
          </q-btn>
        </div>
        <Tip
          title="Info"
          desc="This graph contains all the student with their SPGAs,
                            Tap on any point to know more"
        />
        <div
          style="
            overflow-x: auto;
            padding: 20px;
            border-radius: 25px;
            margin: 20px 0px;
          "
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
        >
          <q-tabs
            v-model="sortBy"
            indicator-color="primary"
            class="text-primary rounded q-mt-md q-mx-lg"
            :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
          >
            <q-tab
              name="sgpa"
              icon="show_chart"
              label="SGPA wise"
              :style="$q.dark.isActive ? 'color:white' : ''"
            />
            <q-tab
              name="sub"
              icon="book"
              label="SUB wise"
              :style="$q.dark.isActive ? 'color:white' : ''"
            />
          </q-tabs>
          <div class="flex justify-end items-center">
            <q-btn
              icon="zoom_out"
              flat
              round
              @click="chartWidth -= 100"
              :disable="chartWidth < 1300"
            />
            {{ chartWidthPercentage }}%
            <q-btn
              icon="zoom_in"
              flat
              round
              @click="chartWidth += 100"
              :disable="chartWidth > 5000"
            />
          </div>
          <q-tab-panels v-model="sortBy" animated class="q-mb-xl">
            <q-tab-panel name="sgpa" class="rounded">
              <q-scroll-area
                horizontal
                style="height: 500px"
                :thumb-style="{
                  bottom: '4px',
                  borderRadius: '5px',
                  background: '#b0b8b4ff',
                  width: '10px',
                  opacity: 1,
                }"
                :style="!$q.screen.lt.md ? '' : ''"
              >
                <VueApexCharts
                  width="1000"
                  height="350"
                  type="line"
                  :options="chartOptions"
                  :series="series"
                  :key="series"
                />
                <!-- <LineChart
                  :style="'height:500px; width:' + chartWidth + 'px'"
                  :chart-data="sgpaDataCollection"
                  :yMax="10"
                  :key="$q.dark.isActive"
                /> -->
              </q-scroll-area>
            </q-tab-panel>
            <q-tab-panel name="sub" class="rounded">
              <q-select
                :options="subjectList"
                v-model="selectedSubject"
                @update:model-value="changeSort"
                label="Select sub"
              />
              <q-scroll-area
                horizontal
                style="height: 500px"
                :thumb-style="{
                  bottom: '4px',
                  borderRadius: '5px',
                  background: '#b0b8b4ff',
                  width: '10px',
                  opacity: 1,
                }"
                :style="!$q.screen.lt.md ? 'height:700px' : ''"
              >
                <VueApexCharts
                  :width="chartWidthPercentage"
                  height="350"
                  type="line"
                  :options="subChartOptions"
                  :series="subSeries"
                />
                <!-- <LineChart
                  :style="'height:500px; width:' + chartWidth + 'px'"
                  :chart-data="subDataCollection"
                  :yMax="10"
                  :key="$q.dark.isActive"
                /> -->
              </q-scroll-area>
            </q-tab-panel>
          </q-tab-panels>
        </div>
        <Tip
          title="Important"
          desc="Students who are failed even in 1 subject wont be plotted!"
        />
        <q-card class="sgpa-container q-pa-md rounded glass" flat>
          <div class="q-px-sm">
            <div class="text-h5 text-center">
              <i class="fas fa-download"></i> Download XL sheet
            </div>
            <div class="row q-mt-lg flex flex-center">
              <!-- <div class="flex flex-center col"> -->
              <q-btn
                flat
                label="XLSX file"
                icon="download"
                @click="downloadSheet"
                style="background: #25d366"
              />
              <!-- </div> -->
              <!-- <div class="flex flex-center col">
                <q-btn
                  flat
                  label="Sub wise"
                  icon="download"
                  @click="downloadSheet('sub')"
                  style="background:#25D366"
                />
              </div>-->
            </div>
          </div>
        </q-card>
      </div>
      <div
        v-else
        class="data-container flex flex-center text-h4 text-center text-grey q-mb-xl"
      >
        <q-intersection>
          <q-img
            width="400px"
            src="../assets/sad-emoji.gif"
            style="filter: drop-shadow(0px 0px 6px yellow)"
          /> </q-intersection
        >Looks so empty here
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";

import ApexCharts from "apexcharts";
import VueApexCharts from "vue3-apexcharts";

import axios from "axios";
import XLSX from "xlsx";
import apiRoutes from "src/apiRoutes";

import Tip from "../components/Tip.vue";
import StudentInput from "../components/StudentInput.vue";
import Footer from "../components/Footer.vue";

import { getBestAttempts } from "../utils/utils";
import rollsArray from "../utils/rolls";
import G2GP from "src/utils/G2GP";

const canSearch = ref(false);
const chartWidth = ref(1300);
const rollPrefix = ref("19fh1a05");
const loading = ref(false);
const sortBy = ref("sgpa");
const range = ref({
  min: 1,
  max: 65,
});
const extraRolls = ref(["19fh1a0546"]);
const chartOptions = ref({
  xaxis: {},
  yaxis: {
    min: 0,
    max: 10,
  },
});
const series = ref([
  {
    name: "Grade Point",
    data: [],
  },
]);
const subChartOptions = ref({
  chart: { id: "vuechart-example" },
  xaxis: {},
});
const subSeries = ref([]);
const sgpaDataCollection = ref({});
const subDataCollection = ref({});
const studentsResultsArr = ref([]);
const subjectList = ref([]);
const selectedSubject = ref("");
const selection = ref({ reg: "", course: "", year: "", sem: "" });
const rollInput = ref(null);

const $q = useQuasar();
const $route = useRoute();

watch(
  () => $q.dark.isActive,
  (val) => {
    console.log($q.dark.isActive);
    subChartOptions.value = {
      ...subChartOptions.value,
      theme: { mode: $q.dark.isActive ? "dark" : "" },
    };
    subChartOptions.value = {
      ...subChartOptions.value,
      theme: { mode: $q.dark.isActive ? "dark" : "" },
    };
    console.log(subChartOptions.value);

  }
);

onMounted(() => {
  // this.$q.dialog({
  //   title: "Section Currently disabled😢😭",
  //   html: true,
  //   persistent: true,
  //   message: `This feature is disabled due to a bug . Please check back later!`,
  // })
  //   .onOk(() => {
  //     this.$router.push("/");
  //   })
  // return
  // this.resultID = "56736469";
  // this.canSearch = true;
  checkQueries();
  //to show Under Development
  if (false)
    $q.dialog({
      title: "Under Development",
      html: true,
      persistent: true,
      message: `This feature is still under development. Please check back later!`,
    });
});
const chartWidthPercentage = computed(() =>
  ((chartWidth.value / 1300) * 100).toFixed()
);
const rollWithPrefix = (roll) => rollsArray[roll].toUpperCase();
const onInputSuccess = () => {
  canSearch.value = true;
  console.log(selection.value);
};
const removeRollNo = (index) => {
  extraRolls.value.splice(index, 1);
  canSearch.value = true;
};
const addExtraRoll = () => {
  extraRolls.value.push(extraRolls.value[0].slice(0, -2));
  setTimeout(() => {
    rollInput.value.slice(-1)[0].focus();
  });
  console.log("added new roll");
  canSearch.value = false;
};
const validateRollNo = (roll) => {
  if (roll.length != 10) {
    $q.notify({
      color: "negative",
      message: "Roll no length should be 10",
    });
    canSearch.value = false;
    return "Roll no length should be 10";
  }
  canSearch.value = true;
  return true;
};
const checkQueries = () => {
  if (!Object.keys($route.query).includes("reg")) return;

  // console.log(Object.keys(this.$route.query).includes("resultID"));
  selection.value = $route.query;
  console.log(selection.value);
  rollPrefix.value = selection.value.roll;
  range.value.min = selection.value.min;
  range.value.max = selection.value.max;
  // console.log(this.$route.query);
  resultID.value = $route.query.resultID;
  range.value.rollPrefix = $route.query.prefix;
  range.value.min = $route.query.min;
  range.value.max = $route.query.max;

  // console.log(window.location);
  this.submit();
};
const share = () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Hey I saw our entire batch result on this cool webApp!",
        url:
          window.location.origin +
          window.location.pathname +
          "#/batch-result?reg=" +
          selection.value.reg +
          "&course=" +
          selection.value.course +
          "&sem=" +
          selection.value.sem +
          "&year=" +
          selection.value.year +
          "&roll=" +
          rollPrefix.value +
          "&min=" +
          range.value.min +
          "&max=" +
          range.value.max,
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
    type: "batch",
    htns: [
      rollPrefix.value + rollWithPrefix(range.value.min),
      rollPrefix.value + rollWithPrefix(range.value.max),
    ],
    resultID: resultID.value,
  });
};
const changeSort = () => {
  console.log("chaning sub");
  let studentsResults = [];
  console.log(studentsResultsArr.value);
  studentsResultsArr.value.forEach((student) => {
    studentsResults.push({
      name: student.name,
      htn: student.htn,
      bestAttempt: getBestAttempts(student.attempts),
    });
  });
  //sort studentResults
  const subIndex = getBestAttempts(
    studentsResultsArr.value[0].attempts
  ).findIndex((sub) => sub["1"] === selectedSubject.value.value);
  // console.log(subIndex);
  studentsResults.sort((a, b) => {
    return (
      G2GP[b.bestAttempt[subIndex].Grade.toUpperCase()] -
      G2GP[a.bestAttempt[subIndex].Grade.toUpperCase()]
    );
  });
  console.log(studentsResults);
  let rank = 1;
  const studentNames = [];
  const studentSubGrade = [];
  for (let i = 0; i < studentsResults.length; i++) {
    // console.log(studentsResults[i]);
    //only add rank if not failed
    studentNames.push(
      `${studentsResults[i]["name"]}(${studentsResults[i]["htn"].slice(-2)}) #${
        G2GP[studentsResults[i].bestAttempt[subIndex].Grade.toUpperCase()] > 0
          ? rank
          : "na"
      }`
    );
    studentSubGrade.push(
      G2GP[studentsResults[i].bestAttempt[subIndex].Grade.toUpperCase()]
    );
    if (studentsResults[i + 1])
      if (
        G2GP[studentsResults[i].bestAttempt[subIndex].Grade.toUpperCase()] !=
        G2GP[studentsResults[i + 1].bestAttempt[subIndex].Grade.toUpperCase()]
      )
        rank++;
  }
  subChartOptions.value.xaxis.categories = studentNames;
  subSeries.value = [{ name: "Grade Point", data: studentSubGrade }];
  console.log("changing sort");
  console.log(subChartOptions.value);
  console.log(subSeries.value);
  subDataCollection.value = {
    labels: studentNames,
    datasets: [
      {
        data: studentSubGrade,
        backgroundColor: "#ff4d0155",
        borderColor: "#ff4d01",
      },
    ],
  };
};
const submit = () => {
  loading.value = true;
  var studentNames = [];
  var studentSGPAs = [];

  axios
    .get(
      apiRoutes.batchResultsv2 +
        "/" +
        rollPrefix.value +
        "/" +
        range.value.min +
        "/" +
        range.value.max +
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
      loading.value = false;
      console.log(res);
      // res.data.map(s => console.log(s.sgpa));

      //get subject list
      subjectList.value = [];
      getBestAttempts(res.data[0].attempts).forEach((s) => {
        subjectList.value.push({ value: s["1"], label: s["Subject Name"] });
      });
      selectedSubject.value = subjectList.value[0];
      // console.log(this.subjectList)
      res.data.sort((a, b) => {
        return b.sgpa - a.sgpa;
      });
      // res.data.map(s => console.log(s.sgpa));
      studentsResultsArr.value = res.data;
      let rank = 1;
      for (let i = 0; i < studentsResultsArr.value.length; i++) {
        //only add rank if not failed
        studentNames.push(
          `${studentsResultsArr.value[i]["name"]} (${studentsResultsArr.value[
            i
          ]["htn"].slice(-2)}) #${
            studentsResultsArr.value[i].sgpa > 0 ? rank : "na"
          }`
        );
        studentSGPAs.push(studentsResultsArr.value[i].sgpa);
        if (studentsResultsArr.value[i + 1])
          if (
            studentsResultsArr.value[i].sgpa !=
            studentsResultsArr.value[i + 1].sgpa
          )
            rank++;
      }
      // res.data.forEach((ele,i) => {
      //   studentNames.push(`${ele["name"]} (${ele["htn"].slice(-2)}) #${i+1}`);
      //   studentSGPAs.push(ele["sgpa"]);
      //   if()
      //   // console.log(ele.sgpa, ele.name, ele.htn);
      // });
    })
    .then(() => {
      //scroll bottom
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight - 1500);
      }, 300);
    })
    .finally(() => {
      chartOptions.value.xaxis.categories = studentNames;
      series.value = [{ name: "SGPA", data: studentSGPAs }];
      console.log(chartOptions.value);
      console.log(series.value);
      //create sgpaDataCollection then create subDataCollection
      sgpaDataCollection.value = {
        labels: studentNames,
        datasets: [
          {
            data: studentSGPAs,
            backgroundColor: "#ff4d0155",
            borderColor: "#ff4d01",
          },
        ],
      };
      changeSort();
    });
  console.log(sgpaDataCollection.value);
};
const downloadSheet = (option) => {
  //get students in asc order of htn
  const students = studentsResultsArr.value;
  students.sort((a, b) => {
    return a.htn.slice(-2) - b.htn.slice(-2);
  });
  //get best attempts of each student
  students.forEach((s) => {
    const bestAttempt = getBestAttempts(s.attempts);
    //loop through each subject in best attempt
    bestAttempt.forEach((attempt) => {
      s["cred-" + attempt["Subject Name"]] = attempt["Credits"];
      s["grade-" + attempt["Subject Name"]] = attempt["Grade"];
      s["status-" + attempt["Subject Name"]] = attempt["Result Status"];
      s["passingMonth-" + attempt["Subject Name"]] = attempt["month"];
      delete s.attempts;
      delete s.collegeCode;
      delete s.lastViewed;
      delete s.reg;
      delete s.course;
      delete s.year;
      delete s.sem;
      delete s.viewCount;
      delete s._id;
      delete s.__v;
    });
  });
  const batchOverall = {
    Registered: students.length,
    attended: students.filter((s) => s.sgpa != 0).length,
    absent: students.filter((s) => s.sgpa == 0).length,
    passed: students.filter((s) => s.sgpa > 0).length,
    failed: students.filter((s) => s.sgpa == -1).length,
    sgpa:
      students.reduce((acc, s) => acc + s.sgpa, 0) /
      students.filter((s) => s.sgpa > 0).length,
    passPercentage:
      (students.filter((s) => s.sgpa > 0).length /
        students.filter((s) => s.sgpa != 0).length) *
      100,
    failPercentage:
      (students.filter((s) => s.sgpa == -1).length /
        students.filter((s) => s.sgpa != 0).length) *
      100,
  };

  const fileName =
    selection.value.reg +
    "-" +
    selection.value.course +
    "-" +
    selection.value.year +
    "-" +
    selection.value.sem +
    "-" +
    rollPrefix.value +
    range.value.min +
    "-" +
    rollPrefix.value +
    range.value.max +
    "-sgpa.xlsx";
  const wb = {};
  wb.SheetNames = ["Students", "overall"];
  wb.Sheets = {};
  console.log(students, batchOverall);
  wb.Sheets["Students"] = XLSX.utils.json_to_sheet(students);
  wb.Sheets["overall"] = XLSX.utils.json_to_sheet([batchOverall]);
  XLSX.writeFile(wb, fileName);
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
