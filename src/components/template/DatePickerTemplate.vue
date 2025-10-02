<template>
  <!-- single -->
  <div class="row mb-3">
    <div class="col-sm-3">
      <DatePicker v-model="date" :popover="defaultPopover">
        <template #default="{ inputValue, inputEvents }">
          <input
            type="text"
            class="form-control"
            :value="inputValue"
            v-on="inputEvents"
            name="aotName"
            required
          />
        </template>
      </DatePicker>
    </div>
  </div>

  <!-- range -->
  <div class="row mb-3">
    <div class="col-sm-6">
      <DatePicker v-model.range="range" :popover="defaultPopover">
        <template #default="{ inputValue, inputEvents }">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              :value="inputValue.start"
              v-on="inputEvents.start"
              name="startDate"
            />
            <span class="input-group-text">~</span>
            <input
              type="text"
              class="form-control"
              :value="inputValue.end"
              v-on="inputEvents.end"
              name="endDate"
            />
          </div>
        </template>
      </DatePicker>
    </div>
  </div>
</template>

<script setup>
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { ref } from 'vue';
import { subMonths } from 'date-fns';

const date = ref(new Date());

const currentDate = new Date();
const oneMonthAgo = subMonths(currentDate, 1);

const range = ref({
  start: oneMonthAgo,
  end: currentDate,
});

const defaultPopover = {
  visibility: 'click',
};
</script>

<style scoped></style>
