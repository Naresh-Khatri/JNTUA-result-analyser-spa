<template>
  <div
    class="flex column rounded q-pa-lg "
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
  >
    <!-- <div class="text-h6">Sected your batch</div> -->
    <div style="display:flex; flex-direction:row-reverse">
      <q-btn
        dense
        style="width:130px; "
        label="clear all"
        @click="clearStorage"
      />
    </div>
    <q-select
      :color="$q.dark.isActive ? 'white' : 'primary'"
      filled
      v-model="selectedReg"
      :options="regsOpts"
      outlined
      @input="selectedFn('reg', selectedReg)"
      label="Regulation/Curriculum"
      clearable
    />
    <q-select
      :color="$q.dark.isActive ? 'white' : 'primary'"
      filled
      v-model="selectedCourse"
      :options="coursesOpts"
      outlined
      label="Course"
      @input="selectedFn('course', selectedCourse)"
      clearable
      :disable="!selectedReg"
    />
    <q-select
      :color="$q.dark.isActive ? 'white' : 'primary'"
      filled
      v-model="selectedYear"
      :options="yearOpts"
      outlined
      label="Year"
      @input="selectedFn('year', selectedYear)"
      clearable
      :disable="!selectedCourse"
    />
    <q-select
      :color="$q.dark.isActive ? 'white' : 'primary'"
      filled
      v-model="selectedSem"
      :options="semOpts"
      outlined
      label="Sem"
      @input="selectedFn('sem', selectedSem)"
      clearable
      :disable="!selectedYear"
    />
    <q-select
      :color="$q.dark.isActive ? 'white' : 'primary'"
      filled
      v-model="selectedTitle"
      :options="titleOpts"
      outlined
      label="Title"
      :disable="!selectedYear"
      clearable
      @input="selectedFn('title', selectedTitle)"
    />
  </div>
</template>

<script>
import axios from "axios";
import apiRoutes from "../apiRoutes";
export default {
  props: ["receivedResID"],
  data() {
    return {
      selectedReg: "",
      selectedCourse: "",
      selectedYear: "",
      selectedSem: "",
      selectedTitle: "",
      selectedResultID: "",
      uniques: {},
      resultsList: [],
      resultObj: {},
      regsOpts: [],
      coursesOpts: [],
      yearOpts: [],
      semOpts: [],
      titleOpts: [],
      backupResultsList: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    setQueries() {
      setTimeout(() => {
        // console.log(this.receivedResID);
        axios
          .get(apiRoutes.resIDDetails + "/" + this.receivedResID)
          .then(async res => {
            // console.log(res.data);
            this.selectedReg = res.data.reg;
            await this.sleep(150);
            this.selectedFn("reg", res.data.reg);
            this.selectedCourse = res.data.course;
            await this.sleep(150);
            this.selectedFn("course", res.data.course);
            this.selectedYear = res.data.year;
            await this.sleep(150);
            this.selectedFn("year", res.data.year);
            this.selectedSem = res.data.sem;
            await this.sleep(150);
            this.selectedFn("sem", res.data.sem);
            this.selectedTitle = res.data.title;
            await this.sleep(150);
            this.selectedFn("title", {
              label: res.data.title,
              resultID: this.receivedResID
            });
          }, 200);
      });
    },
    init() {
      axios
        .get(apiRoutes.releasedResults)
        .then(res => {
          // console.log(res.data);
          this.resultObj = res.data;
          this.regsOpts = Object.keys(res.data);
        })
        .then(() => {
          setTimeout(() => {
            if (this.receivedResID) this.setQueries();
            else this.loadStorage();
          }, 100);
        });
    },
    reset(option) {
      if (option == "reg") {
        this.selectedCourse = "";
        this.selectedYear = "";
        this.selectedSem = "";
        this.selectedTitle = "";
        // localStorage.setItem("course", "");
        // localStorage.setItem("year", "");
        // localStorage.setItem("sem", "");
        // localStorage.setItem("title", "");
      } else if (option == "course") {
        this.selectedYear = "";
        this.selectedSem = "";
        this.selectedTitle = "";
        // localStorage.setItem("year", "");
        // localStorage.setItem("sem", "");
        // localStorage.setItem("title", "");
      } else if (option == "year") {
        this.selectedSem = "";
        this.selectedTitle = "";
        // localStorage.setItem("sem", "");
        // localStorage.setItem("title", "");
      } else if (option == "sem") {
        this.selectedTitle = "";
        // localStorage.setItem("title", "");
      }
    },
    selectedFn(option, value) {
      //listen to when reset
      // if (value == null) return this.reset(option);
      // console.log(option, value);
      this.save(option, value);
      this.reset(option);
      if (option == "reg")
        this.coursesOpts = Object.keys(this.resultObj[this.selectedReg]);
      else if (option == "course")
        this.yearOpts = Object.keys(
          this.resultObj[this.selectedReg][this.selectedCourse]
        );
      else if (option == "year")
        this.semOpts = Object.keys(
          this.resultObj[this.selectedReg][this.selectedCourse][
            this.selectedYear
          ]
        );
      else if (option == "sem") {
        //loop through and create new array for title
        let opts = [];
        this.resultObj[this.selectedReg][this.selectedCourse][
          this.selectedYear
        ][this.selectedSem].forEach(ele => {
          opts.push({ label: ele.title, resultID: ele.resultID });
        });
        console.log(opts);
        this.titleOpts = opts;
      } else if (option == "title") {
        // console.log(value);
        this.selectedTitle = value.label;
        this.selectedResultID = value.resultID;
        //dont emit if parent already has resID
        // if (!this.receivedResID)
         this.emitResultID();
      }
    },
    clearStorage() {
      localStorage.setItem("reg", "");
      localStorage.setItem("course", "");
      localStorage.setItem("year", "");
      localStorage.setItem("sem", "");
      localStorage.setItem("title", "");
      this.selectedReg = "";
      this.selectedCourse = "";
      this.selectedYear = "";
      this.selectedSem = "";
      this.selectedTitle = "";
    },
    save(option, value) {
      // console.log("saving ", option, " as ", value);
      localStorage.setItem(option, value);
    },
    sleep(ms) {
      return new Promise(r => {
        setTimeout(() => r(), ms);
      });
    },
    async loadStorage() {
      // console.log(localStorage.getItem("reg"));
      // console.log(localStorage.getItem("course"));
      // console.log(localStorage.getItem("year"));
      // console.log(localStorage.getItem("sem"));
      // console.log(JSON.parse(localStorage.getItem("title")));
      if (localStorage.getItem("reg")) {
        this.selectedReg = localStorage.getItem("reg");
        await this.sleep(150);
        this.selectedFn("reg", localStorage.getItem("reg"));
      }
      if (localStorage.getItem("course")) {
        this.selectedCourse = localStorage.getItem("course");
        await this.sleep(150);
        this.selectedFn("course", localStorage.getItem("course"));
      }
      if (localStorage.getItem("year")) {
        this.selectedYear = localStorage.getItem("year");
        await this.sleep(150);
        this.selectedFn("year", localStorage.getItem("year"));
      }
      if (localStorage.getItem("sem")) {
        this.selectedSem = localStorage.getItem("sem");
        await this.sleep(150);
        this.selectedFn("sem", localStorage.getItem("sem"));
      }
      // if (localStorage.getItem("title")) {
      //   await this.sleep(500);
      //   console.log(localStorage.getItem("title"));
      //   this.selectedTitle = localStorage.getItem("title").label;
      //   this.selectedFn("title", localStorage.getItem("title"));
      // }
    },
    emitResultID() {
      // localStorage.setItem('lastUniques', JSON.stringify(this.uniques))
      // console.log(this.selectedTitle);
      this.$emit("success", this.selectedResultID);
    }
  }
};
</script>

<style></style>
