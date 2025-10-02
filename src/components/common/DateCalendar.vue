<template>
    <Calendar :view="view" v-model="date" @update:modelValue="chgHandler" :maxDate="maxDateGetter" :minDate="minDateGetter">
        <template #dropdownicon>
            <i class="bi bi-calendar"></i>
        </template>
        <template #previousicon>
            <i class="bi bi-chevron-left"></i>
        </template>
        <template #nexticon>
            <i class="bi bi-chevron-right"></i>
        </template>
    </Calendar>
</template>

<script setup lang="ts">
import { parse, format } from 'date-fns'
import { ref, watch, computed } from 'vue'
import _ from 'lodash';

interface DateCalendarProps {
    value: String,
    returnFormat?: String,
    view?: String,
    minDate?: String,
    maxDate?: String
}

const props = withDefaults(defineProps<DateCalendarProps>(), {
    returnFormat: 'yyyyMMdd'
});

const emit = defineEmits(['change']);

const date = ref(props.value && parse(props.value, props.returnFormat, new Date()));

watch(() => props.value, value => {
    date.value = value ? parse(value, props.returnFormat, new Date()) : null;
})
const chgHandler = (value) => {
    if (_.isNull(value)) {
        emit('change', null);
    } else {
        emit('change', format(value, props.returnFormat))
    }
}

const minDateGetter = computed(() => props.minDate ? parse(props.minDate, props.returnFormat, new Date()) : null);
const maxDateGetter = computed(() => props.maxDate ? parse(props.maxDate, props.returnFormat, new Date()) : null);
</script>