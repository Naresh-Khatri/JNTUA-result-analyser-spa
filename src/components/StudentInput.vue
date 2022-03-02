<template>
  <div class="flex column rounded q-pa-lg glass" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
    <!-- <div class="text-h6">Sected your batch</div> -->
    <div style="display:flex; flex-direction:row-reverse">
      <q-btn dense flat style="width:130px; " icon="close" label="clear all" @click="clearStorage" />
    </div>
    <q-select
      :color="$q.dark.isActive ? 'white' : 'primary'"
      filled
      v-model="selectedReg"
      :options="regsOpts"
      outlined
      @update:model-value="selectedFn('reg', selectedReg)"
      label="Regulation/Curriculum"
      clearable
    />
    <!-- @input-value="selectedFn('reg', selectedReg)" -->
    <q-select
      :color="$q.dark.isActive ? 'white' : 'primary'"
      filled
      v-model="selectedCourse"
      :options="coursesOpts"
      outlined
      label="Course"
      @update:model-value="selectedFn('course', selectedCourse)"
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
      @update:model-value="selectedFn('year', selectedYear)"
      clearable
      :disable="!selectedCourse"
    />
    <q-select
      :color="$q.dark.isActive ? 'white' : 'primary'"
      filled
      v-model="selectedSem"
      :options="semOpts"
      label="Sem"
      @update:model-value="selectedFn('sem', selectedSem)"
      clearable
      :disable="!selectedYear"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from "axios";
import apiRoutes from "../apiRoutes";

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'success'])
const selectedReg = ref("");
const selectedCourse = ref("");
const selectedYear = ref("");
const selectedSem = ref("");
const selectedResultID = ref("");
const uniques = ref({});
const resultsList = ref([]);
const resultObj = ref({});
const regsOpts = ref([]);
const coursesOpts = ref([]);
const yearOpts = ref([]);
const semOpts = ref([]);
const backupResultsList = ref([]);
// const selectedValue = ref(props.modelValue.value)
onMounted(() => {
  // console.log(props.modelValue)
  init()
  // console.log(value);
});
const setQueries = () => {
  setTimeout(() => {
    axios
      .get(apiRoutes.resIDDetails + "/" + this.receivedResID)
      .then(async res => {
        // console.log(res.data);
        selectedReg.value = res.data.reg;
        await sleep(150);
        selectedFn("reg", res.data.reg);
        selectedCourse.value = res.data.course;
        await sleep(150);
        selectedFn("course", res.data.course);
        selectedYear.value = res.data.year;
        await sleep(150);
        selectedFn("year", res.data.year);
        selectedSem.value = res.data.sem;
        await sleep(150);
        selectedFn("sem", res.data.sem);
      });
  });
};
const init = () => {
  axios.get(apiRoutes.releasedResults).then(async res => {
    // console.log(res.data);
    resultObj.value = res.data;
    regsOpts.value = Object.keys(res.data);
    //check if parent passed selection
    if (props.modelValue.sem.length > 0) {
      console.log("setting params");
      await sleep(150);
      selectedReg.value = props.modelValue.reg;
      selectedFn("reg", props.modelValue.reg);
      await sleep(150);
      selectedCourse.value = props.modelValue.course;
      selectedFn("course", props.modelValue.course);
      await sleep(150);
      selectedYear.value = props.modelValue.year;
      selectedFn("year", props.modelValue.year);
      await sleep(150);
      selectedSem.value = props.modelValue.sem;
      selectedFn("sem", props.modelValue.sem);
    } else loadStorage();
  });
};
const reset = (option) => {
  // console.warn('resetting', option)
  if (option == "reg") {
    selectedCourse.value = "";
    selectedYear.value = "";
    selectedSem.value = "";
    // localStorage.setItem("course", "");
    // localStorage.setItem("year", "");
    // localStorage.setItem("sem", "");
  } else if (option == "course") {
    selectedYear.value = "";
    selectedSem.value = "";
    // localStorage.setItem("year", "");
    // localStorage.setItem("sem", "");
  } else if (option == "year")
    selectedSem.value = "";
  // localStorage.setItem("sem", "");
};
const selectedFn = (option, value) => {
  // console.log(option, value);
  //listen to when reset
  reset(option);
  save(option, value);
  //if clicked on clear dont select anything and return
  if (value == null) return;
  if (option == "reg") {
    selectedReg.value = value
    coursesOpts.value = Object.keys(resultObj.value[selectedReg.value]);
  }
  else if (option == "course")
    yearOpts.value = Object.keys(
      resultObj.value[selectedReg.value][selectedCourse.value]
    );
  else if (option == "year")
    semOpts.value = Object.keys(
      resultObj.value[selectedReg.value][selectedCourse.value][
      selectedYear.value
      ]
    );
  else if (option == "sem") {
    emitSelection();
    emit('success')
  }
  emitSelection();
};
const clearStorage = () => {
  localStorage.setItem("reg", "");
  localStorage.setItem("course", "");
  localStorage.setItem("year", "");
  localStorage.setItem("sem", "");

  selectedReg.value = "";
  selectedCourse.value = "";
  selectedYear.value = "";
  selectedSem.value = "";
};
const save = (option, value) => {
  localStorage.setItem(option, value);
  // console.log("saving", option, "as", localStorage.getItem(option));
};
const sleep = (ms) => {
  return new Promise(r => { setTimeout(() => r(), ms); });
};
const loadStorage = async () => {

  if (localStorage.getItem("reg")) {
    selectedReg.value = localStorage.getItem("reg");
    await sleep(150);
    selectedFn("reg", localStorage.getItem("reg"));
  }
  if (localStorage.getItem("course")) {
    selectedCourse.value = localStorage.getItem("course");
    console.log('setting course')
    await sleep(150);
    selectedFn("course", localStorage.getItem("course"));
  }
  if (localStorage.getItem("year")) {
    selectedYear.value = localStorage.getItem("year");
    await sleep(150);
    selectedFn("year", localStorage.getItem("year"));
  }
  if (localStorage.getItem("sem")) {
    selectedSem.value = localStorage.getItem("sem");
    await sleep(150);
    selectedFn("sem", localStorage.getItem("sem"));
  }
}
const emitSelection = () => {
  // localStorage.setItem('lastUniques', JSON.stringify(this.uniques))
  emit("update:modelValue", {
    reg: selectedReg.value,
    course: selectedCourse.value,
    year: selectedYear.value,
    sem: selectedSem.value
  });
}
const test = (val) => {
  console.log(val)
}
</script>

<style></style>
