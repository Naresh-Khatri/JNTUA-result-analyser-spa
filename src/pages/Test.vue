<template>
    <div>
        <VueApexCharts width="500" type="bar" :options="chartOptions" :series="series" />okay
    </div>
</template>
<script setup>
import VueApexCharts from 'vue3-apexcharts'
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'

onMounted(async () => {
    const res = await axios.get('http://localhost:3000/singleResultv2/19fh1a0546/R19/B.TECH/I/I')
    console.log(res)
})


const chartOptions = ref({
    chart: { id: "vuechart-example", },
    xaxis: {
        categories: [2994, 1995, 1996, 1997, 1998],
    },
});
const series = ref([
    {
        name: "series-1",
        data: [30, 40, 35, 50, 49, 60, 70, 100],
    },
])
</script>
<style>
</style>
