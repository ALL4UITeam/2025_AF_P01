<script setup>
import {ref, onMounted, watch} from "vue";
import Dropdown from 'primevue/dropdown';

const props = defineProps({
  options: Array,
  modelValue: [String, Number, Object],
  title: String,
  optionLabel: {
    type: String,
    default: 'label'
  },
  inputId: {
    type: String,
    required: true
  },
  scrollHeight: {
    type: String,
    default: '14rem'
  }
});

const customDropdown = ref(null);

const emit = defineEmits(['update:modelValue']);

const updateValue = (newValue) => {
  emit('update:modelValue', newValue);
};

onMounted(() => {
  if (props.title && customDropdown.value) {
    customDropdown.value.$el.setAttribute('title', props.title);
  }
});

watch(() => props.title, (newTitle) => {
  if (customDropdown.value) {
    customDropdown.value.$el.setAttribute('title', newTitle);
  }
})

</script>

<template>
  <Dropdown :inputId="inputId" :options="options" :optionLabel="optionLabel" :model-value="modelValue" :scroll-height="scrollHeight"
            @update:model-value="updateValue" ref="customDropdown" />
</template>


<style lang="scss" scoped>

</style>