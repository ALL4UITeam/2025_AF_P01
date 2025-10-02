<script setup>
import DateUtils from "@/common/dateUtils";
import Calendar from 'primevue/calendar';
import { ref, watch } from 'vue';

const props = defineProps({
  date: {
    type: String,
    default: DateUtils.getToday()
  }
})

const emit = defineEmits(['updateDate']);

const dateValue = ref(props.date);

watch(dateValue, (newVal) => {
  emit('updateDate', DateUtils.getDateFormat(newVal));
})

</script>

<template>
  <Calendar v-model="dateValue" dateFormat="yy-mm-dd" show-icon>
  </Calendar>
</template>