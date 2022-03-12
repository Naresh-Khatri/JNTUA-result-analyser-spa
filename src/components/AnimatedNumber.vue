<template>
  <div>
    {{ animatedNumber }}
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps(["number"]);
const animatedNumber = ref(props.number);
onMounted(() => { 
  randomlyIncreaseNumber();
  console.log(props.number);
});
const randomlyIncreaseNumber = async () => {
  console.log("okay");
  let updateTime = 1;
  while (true) {
    await sleep(3000);
    console.log("next update in: ", updateTime);
    animatedNumber.value++;
    updateTime = Math.random() * 7000;
  }
};
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
</script>
