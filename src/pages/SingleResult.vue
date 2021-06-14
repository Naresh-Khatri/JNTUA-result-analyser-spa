<template>
  <div>
    <div
      class="flex row flex-center space-between 
      justify-between no-wrap q-pa-lg bg-white 
      rounded q-ma-md"
    >
      <q-dialog v-model="resultNotFoundDialog">
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Result Not Found</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            If you think your hall ticket number is correct then go to feedback
            section and provide us the hall ticket number range of your batch
            like this and we'll update our database
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
      </q-dialog>
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
            <q-checkbox v-model="supply" label="Supply" />
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
      <div class="flex flex-center ">
        <q-card class="q-px-lg q-mx-lg q-mt-md rounded" flat>
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
                class="text-primary q-ma-md"
              />
            </div>
          </div>
        </q-card>
      </div>
      <div class="q-pa-md">
        <Tip
          title="Tip 1"
          desc="Click on the column name to sort the rows accordingly"
        />

        <q-table
          title="Result Table "
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
                  :color="props.row.status == 'Pass' ? 'positive' : 'negative'"
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
        class="text-primary rounded bg-white q-mb-sm q-mx-lg"
      >
        <q-tab name="radar" icon="radar" label="Radar" />
        <q-tab name="line" icon="show_chart" label="Line" />
        <q-tab name="bar" icon="bar_chart" label="Bar" />
      </q-tabs>
      <q-tab-panels v-model="chartName" animated class="shadow-2 rounded">
        <q-tab-panel name="radar" class="rounded">
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
import config from "../api.config.js";
import { Result } from "../utils.mjs";

import { backgroundColors, borderColors } from "../colors/colors";

import RadarChart from "../charts/RadarChart.vue";
import BarChart from "../charts/BarChart.vue";
import LineChart from "../charts/LineChart.vue";

import Tip from "../components/Tip.vue";

export default {
  components: {
    RadarChart,
    BarChart,
    LineChart,
    Tip
  },
  data() {
    return {
      datacollection: {},
      rollNo: "19fh1a0546",
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
      this.rowData = [];
      axios.get('http://localhost:3000/56736424/' + this.rollNo)
      .then(res=>{
        console.log(res)
      })
      axios
        .get(
          `${config.results}?student__id=${this.rollNo}&semester=${this.sem}${
            this.supply ? "a" : ""
          }`
        )
        .then(response => {
          console.log(response.data);
          if (response.data.length > 0) {
            this.$q.notify({
              type: "positive",
              message: `Result retrieved`
            });
          }
          response.data.forEach(ele => {
            //console.log(ele);
            this.rowData.push({
              subject_name: ele.subject.abb,
              status: ele.passed ? "Pass" : "Failed",
              points: this.g_to_gp[ele.grade],
              grade: ele.grade,
              credit: ele.subject.credit
            });
            subjectNames.push(`${ele.subject.abb} (${ele.grade})`);
            subjectGrades.push(this.g_to_gp[ele.grade]);
          });
          this.studentName = response.data[0].student.name;
          this.getsgpa();
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
    },
    getsgpa() {
      axios
        .get(
          `${config.semestergpa}?student__id=${this.rollNo}&semester=${this.sem}`
        )
        .then(response => {
          {
            console.log(response);
            this.studentSGPA = response.data[0].sgpa;
          }
        });
    }
  }
};
</script>
<style scoped>
.rounded {
  border-radius: 20px;
}
</style>
