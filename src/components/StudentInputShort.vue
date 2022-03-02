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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import axios from "axios";
import apiRoutes from "../apiRoutes";

const props = defineProps({ modelValue: Object })
const emit = defineEmits(['update:modelValue', 'success'])

const selectedReg = ref("")
const selectedCourse = ref("")
const resultObj = ref({})
const regsOpts = ref([])
const coursesOpts = ref([])
onMounted(() => {
  init();
  // console.log(this.value);
});
const setQueries = () => {
  setTimeout(() => {
    axios
      .get(apiRoutes.resIDDetails + "/" + receivedResID)
      .then(async res => {
        // console.log(res.data);
        selectedReg.value = res.data.reg;
        await this.sleep(150);
        selectedFn("reg", res.data.reg);
        selectedCourse.value = res.data.course;
        await this.sleep(150);
        selectedFn("course", res.data.course);
        await this.sleep(150);
      });
  });
};
const init = () => {
  axios.get(apiRoutes.releasedResults).then(async res => {
    // console.log(res.data);
    resultObj.value = res.data;
    regsOpts.value = Object.keys(res.data);
    //check if parent passed selection
    if (Object.keys(resultObj.value).length > 0) {
      // console.log("setting params");
      await sleep(150);
      selectedReg.value = props.modelValue.reg;
      selectedFn("reg", localStorage.getItem('reg'));
      await sleep(150);

      selectedCourse.value = props.modelValue.course;
      selectedFn("course", localStorage.getItem('course'));
      await sleep(150);
    } else loadStorage();
  });
};
const reset = (option) => {
  if (option == "reg") {
    selectedCourse.value = "";
  } else if (option == "course") {
  }
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
  else if (option == "course") {
    selectedCourse.value = value
    emitSelection();
    emit('success')
  }
  emitSelection()
};
const clearStorage = () => {
  localStorage.setItem("reg", "");
  localStorage.setItem("course", "");

  selectedReg.value = "";
  selectedCourse.value = "";
};
const save = (option, value) => {
  if (value == undefined) {
    // console.log('wont save undefined, returning...')
    return
  }
  localStorage.setItem(option, value);
  // console.log("saving ", option, " as ", localStorage.getItem(option));
};
const sleep = (ms) => {
  return new Promise(r => {
    setTimeout(() => r(), ms);
  });
};
const loadStorage = async () => {
  if (localStorage.getItem("reg")) {
    selectedReg.value = localStorage.getItem("reg");
    await sleep(150);
    selectedFn("reg", localStorage.getItem("reg"));
  }
  if (localStorage.getItem("course")) {
    selectedCourse = localStorage.getItem("course");
    await this.sleep(150);
    selectedFn("course", localStorage.getItem("course"));
  }
};
const emitSelection = () => {
  //selection is the object of the selected course
  emit('update:modelValue', {
    reg: selectedReg.value,
    course: selectedCourse.value,
    yearSemObj: resultObj.value[selectedReg.value][selectedCourse.value]
  })
  // console.log('emitting success')
}
const showStorage = () => {
  console.log(localStorage.getItem('reg'))
  console.log(localStorage.getItem('course'))
}
</script>

<style></style>
