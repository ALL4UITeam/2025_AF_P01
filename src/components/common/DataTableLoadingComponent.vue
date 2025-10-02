<script setup>
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  width: {
    type: Number,
    default: 50,
  },
  height: {
    type: Number,
    default: 50,
  },
  strokeWidth: {
    type: String,
    default: '5',
  },
  animationDuration: {
    type: Number,
    default: 3,
  }
});
</script>

<template>
  <ProgressSpinner :style="{width: props.width + 'px', height: props.height + 'px'}" :strokeWidth="props.strokeWidth" fill="var(--surface-ground)"
                   :animationDuration="props.animationDuration + 's'" aria-label="Custom ProgressSpinner" />
</template>

<style scoped>

</style>