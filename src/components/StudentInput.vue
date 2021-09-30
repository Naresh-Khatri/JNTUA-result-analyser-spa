<template>
  <div
    class="flex column rounded q-pa-lg "
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
  >
    <!--<div class="flex flex-col justify-center">
         <q-btn
        style="width:fit-content"
        class="q-mb-sm"
        label="Reset"
        color="primary"
        @click="reset()"
      />
    </div>-->
    <!-- <div class="text-h6">Sected your batch</div> -->
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
    // //testing to add feedback request dialog
    //   $q.dialog({
    //     title: 'Confirm',
    //     message: 'Would you like to turn on the wifi?',
    //     cancel: true,
    //     persistent: true
    //   }).onOk(() => {
    //     // console.log('>>>> OK')
    //   }).onOk(() => {
    //     // console.log('>>>> second OK catcher')
    //   }).onCancel(() => {
    //     // console.log('>>>> Cancel')
    //   }).onDismiss(() => {
    //     // console.log('I am triggered on both OK and Cancel')
    //   })
  },
  methods: {
    init() {
      axios.get("https://jntua.plasmatch.in/releasedResults").then(res => {
        // console.log(res.data);
        this.resultObj = res.data;
        this.regsOpts = Object.keys(res.data);
      });
    },
    reset(selectVal) {
      if (selectVal == "reg") {
        this.selectedCourse = "";
        this.selectedYear = "";
        this.selectedSem = "";
        this.selectedTitle = "";
      } else if (selectVal == "course") {
        this.selectedYear = "";
        this.selectedSem = "";
        this.selectedTitle = "";
      } else if (selectVal == "year") {
        this.selectedSem = "";
        this.selectedTitle = "";
      } else if (selectVal == "sem") {
        this.selectedTitle = "";
      } else {
        this.selectedCourse = "";
        this.selectedYear = "";
        this.selectedSem = "";
        this.selectedTitle = "";
      }
    },
    selectedFn(foo, value) {
      console.log(foo, value);
      this.reset(foo);
      if (foo == "reg") {
        this.coursesOpts = Object.keys(this.resultObj[this.selectedReg]);
      } else if (foo == "course") {
        this.yearOpts = Object.keys(
          this.resultObj[this.selectedReg][this.selectedCourse]
        );
      } else if (foo == "year") {
        this.semOpts = Object.keys(
          this.resultObj[this.selectedReg][this.selectedCourse][
            this.selectedYear
          ]
        );
      } else if (foo == "sem") {
        //loop through and create new array for title
        let opts = [];
        this.resultObj[this.selectedReg][this.selectedCourse][
          this.selectedYear
        ][this.selectedSem].forEach(ele => {
          opts.push({ label: ele.title, value: ele.resultID });
        });
        console.log(opts);
        this.titleOpts = opts;
      }
    },
    emitResultID() {
      // localStorage.setItem('lastUniques', JSON.stringify(this.uniques))
      console.log(this.selectedTitle);
      this.$emit("success", this.selectedTitle.value);
    }
  }
};
</script>

<style></style>
