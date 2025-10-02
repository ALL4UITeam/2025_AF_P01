<script setup>
import ProgressSpinner from 'primevue/progressspinner';
import { useLoadingStore } from '@/stores/ui.loading';

const loadingStore = useLoadingStore();
const props = defineProps({
  isArea: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="progress-container" v-if="props.isArea ? props.isArea :  loadingStore.visible">
    <div class="progress-wrapper">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
                       animationDuration="3s" aria-label="Custom ProgressSpinner" />
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.progress-wrapper {
  text-align: center;
}
</style>