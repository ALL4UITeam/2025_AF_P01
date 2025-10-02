<template>
  <Calendar v-model="date" showIcon showButtonBar />
</template>

<script setup>
import Calendar from 'primevue/calendar';
import { ref } from 'vue';

const date = ref(null);
</script>

<style scoped></style>
