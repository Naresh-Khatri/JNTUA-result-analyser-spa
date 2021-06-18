<template>
  <div class="flex column bg-white rounded q-pa-lg q-ma-lg">
    <div class="flex flex-col justify-center">
      <q-btn
        style="width:fit-content"
        class="q-mb-sm"
        label="Reset"
        color="primary"
        @click="reset()"
      />
    </div>
    <q-select
      filled
      v-model="selectedReg"
      :options="uniques['reg']"
      outlined
      @input="selectedFn('reg', selectedReg)"
      label="Regulation"
    />
    <q-select
      filled
      v-model="selectedCourse"
      :options="uniques['course']"
      outlined
      label="Course"
      @input="selectedFn('course', selectedCourse)"
      :disable="!selectedReg"
    />
    <q-select
      filled
      v-model="selectedYear"
      :options="uniques['year']"
      outlined
      label="Year"
      @input="selectedFn('year', selectedYear)"
      :disable="!selectedCourse"
    />
    <q-select
      filled
      v-model="selectedSem"
      :options="uniques['sem']"
      outlined
      label="Sem"
      @input="selectedFn('sem', selectedSem)"
      :disable="!selectedYear"
    />
    <q-select
      filled
      v-model="selectedTitle"
      :options="uniques['title']"
      outlined
      label="Title"
      :disable="!selectedYear"
      @input="emitResultID()"
    />
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      selectedReg: "",
      selectedCourse: "",
      selectedYear: "",
      selectedSem: "",
      selectedTitle: "",
      uniques: {},
      resultsList: [],
      backupResultsList: []
    };
  },
  mounted() {
    this.init();
    // this.getLastUniques()
  },
  methods: {
    // getLastUniques(){
    //   console.log(localStorage.getItem('lastUniques'))
    //   const lastUniques = JSON.parse(localStorage.getItem('lastUniques')) || ''
    //   this.selectedReg = lastUniques['reg']
    //   this.selectedCourse = lastUniques['course']
    //   this.selectedYear = lastUniques['year']
    //   this.selectedSem = lastUniques['sem']
    //   console.log(this.uniques)
    // },
    init() {
      axios.get("https://jntua.plasmatch.in/releasedResults").then(res => {
        console.log(res.data);
        this.resultsList = res.data;
        this.backupResultsList = this.resultsList;
        this.updateUniques();
      });
    },
    reset() {
      this.selectedReg = "";
      this.selectedCourse = "";
      this.selectedYear = "";
      this.selectedSem = "";
      this.selectedTitle = "";
      this.resultsList = this.backupResultsList;
      this.updateUniques();
    },
    selectedFn(foo, value) {
      this.resultsList = this.resultsList.filter(obj => obj[foo] == value);
      console.log(this.resultsList);
      this.updateUniques();
      console.log(this.uniques);
    },
    updateUniques() {
      this.uniques = {};
      this.uniques["reg"] = [];
      this.uniques["year"] = [];
      this.uniques["sem"] = [];
      this.uniques["heldOn"] = [];
      this.uniques["course"] = [];
      this.uniques["title"] = [];
      this.resultsList.forEach(result => {
        // console.log(result);
        this.uniques["reg"].push(result["reg"]);
        this.uniques["year"].push(result["year"]);
        this.uniques["sem"].push(result["sem"]);
        this.uniques["heldOn"].push(result["heldOn"]);
        this.uniques["course"].push(result["course"]);
        this.uniques["title"].push(result["title"]);
      });
      this.uniques["reg"] = Array.from(new Set(this.uniques["reg"]));
      this.uniques["course"] = Array.from(new Set(this.uniques["course"]));
      this.uniques["year"] = Array.from(new Set(this.uniques["year"]));
      this.uniques["sem"] = Array.from(new Set(this.uniques["sem"]));
      this.uniques["title"] = Array.from(new Set(this.uniques["title"]));
    },
    emitResultID() {
      // localStorage.setItem('lastUniques', JSON.stringify(this.uniques))
      // if 2 items remain in title then choose accordingly
      let index = 0;
      for (let i = 0; i < this.resultsList.length; i++) {
        if (this.resultsList[i]['title'] == this.selectedTitle){
          index = i;
        } 
      }
      this.$emit("success", this.resultsList[index].resultID);
    }
  }
};
</script>

<style></style>
