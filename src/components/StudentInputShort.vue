<template>
  <div
    class="flex column rounded q-pa-lg glass"
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
  >
    <!-- <div class="text-h6">Sected your batch</div> -->
    <div style="display:flex; flex-direction:row-reverse">
      <q-btn
        dense
        flat
        style="width:130px; "
        icon="close"
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
  </div>
</template>

<script>
import axios from "axios";
import apiRoutes from "../apiRoutes";
export default {
  props: { value: Object },
  data() {
    return {
      selectedReg: "",
      selectedCourse: "",
      uniques: {},
      resultsList: [],
      resultObj: {},
      regsOpts: [],
      coursesOpts: [],
      backupResultsList: []
    };
  },
  mounted() {
    this.init();
    console.log(this.value);
  },
  watch: {
    async value(val) {
      console.log(val);
    }
  },
  methods: {
    setQueries() {
      setTimeout(() => {
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
            await this.sleep(150);
          });
      });
    },
    init() {
      axios.get(apiRoutes.releasedResults).then(async res => {
        // console.log(res.data);
        this.resultObj = res.data;
        this.regsOpts = Object.keys(res.data);
        //check if parent passed selection
        if (Object.keys(this.value).length > 0) {
          // console.log("setting params");
          await this.sleep(150);
          this.selectedReg = this.value.reg;
          this.selectedFn("reg", this.value.reg);
          await this.sleep(150);
          this.selectedCourse = this.value.course;
          this.selectedFn("course", this.value.course);
          await this.sleep(150);
        } else this.loadStorage();
      });
    },
    reset(option) {
      if (option == "reg") {
        this.selectedCourse = "";
      } else if (option == "course") {
      }
    },
    selectedFn(option, value) {
      //listen to when reset
      // if (value == null) return this.reset(option);
      // console.log(option, value);
      this.save(option, value);
      this.reset(option);
      //if clicked on clear dont select anything and return
      if (value == null) return;
      if (option == "reg")
        this.coursesOpts = Object.keys(this.resultObj[this.selectedReg]);
      else if (option == "course") this.emitSelection();
    },
    clearStorage() {
      localStorage.setItem("reg", "");
      localStorage.setItem("course", "");

      this.selectedReg = "";
      this.selectedCourse = "";
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
      // if (localStorage.getItem("title")) {
      //   await this.sleep(500);
      //   console.log(localStorage.getItem("title"));
      //   this.selectedTitle = localStorage.getItem("title").label;
      //   this.selectedFn("title", localStorage.getItem("title"));
      // }
    },
    emitSelection() {
      // localStorage.setItem('lastUniques', JSON.stringify(this.uniques))
      this.$emit("success", {
        reg: this.selectedReg,
        course: this.selectedCourse
      });
    }
  }
};
</script>

<style></style>
