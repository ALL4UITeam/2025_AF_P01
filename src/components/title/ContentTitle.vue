<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#333'
  },
  fontSize: {
    type: String,
    default: '16px'
  },
  fontWeight: {
    type: String,
    default: 'bold'
  },
  marginTop: {
    type: String,
    default: '20px'
  },
  icon: {
    type: String,
    default: ''
  },
  mobileFontSize: {
    type: String,
    default: '14px'
  },
  mobileMarginTop: {
    type: String,
    default: '14px'
  }
});

const windowWidth = ref(window.innerWidth);

const titleStyle = computed(() => {
  const baseFontSize = windowWidth.value <= 1023 ? props.mobileFontSize : props.fontSize
  const baseMarginTop = windowWidth.value <= 1023 ? props.mobileMarginTop : props.marginTop
  return {
    color: props.color,
    fontSize: baseFontSize,
    fontWeight: props.fontWeight,
    marginTop: baseMarginTop,
  }
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
<template>
  <p :style="titleStyle">
    <i aria-hidden="true" v-if="icon" :class="icon"/>
    {{ title }}
  </p>
</template>

<style lang="scss" scoped>
.bi {
  margin-right: 5px;
}
</style>