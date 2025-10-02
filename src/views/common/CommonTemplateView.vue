<template>
  <div class="row m-3 border-bottom pb-2">
    <h3>캘린더 Template</h3>
    <a class="link-primary" href="https://primevue.org/calendar/">[참고] prime vue calendar</a>
  </div>

  <PrimeVueDatePicker></PrimeVueDatePicker>

  <div class="row m-3 border-bottom pb-2 pt-4">
    <h3>차트 Template</h3>
    <a
      class="link-primary"
      href="https://github.com/ecomfe/vue-echarts#readme/"
    >
      [참고] vue echarts
    </a>
    <a class="link-primary" href="https://echarts.apache.org/en/index.html">
      [참고] apache echarts
    </a>
  </div>

  <!-- Line Chart Template -->
  <div class="row m-3 border-bottom pb-2 pt-4">
    <h3>Line 차트 Template</h3>
  </div>
  <PrimeVueLineChart></PrimeVueLineChart>

  <!-- Bar Chart Template -->
  <div class="row m-3 border-bottom pb-2 pt-4">
    <h3>Bar 차트 Template</h3>
  </div>
  <PrimeVueBarChart></PrimeVueBarChart>

  <!-- Pie Chart Template -->
  <div class="row m-3 border-bottom pb-2 pt-4">
    <h3>Pie 차트 Template</h3>
  </div>
  <PrimeVuePieChart></PrimeVuePieChart>
</template>

<script setup>
import PrimeVueDatePicker from '@/components/template/PrimeVueDatePicker.vue';
import PrimeVueLineChart from '@/components/template/PrimeVueLineChart.vue';
import PrimeVueBarChart from '@/components/template/PrimeVueBarChart.vue';
import PrimeVuePieChart from '@/components/template/PrimeVuePieChart.vue';
defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
