<script setup>
  import { computed } from "vue";

  const props = defineProps({
      title: {
        type: String,
        required : true
      },
      marginTop: {
        type: String,
        default : ''
      },
  });

  const titleStyle = computed(() => ({
    color: props.color,
    marginTop: props.marginTop,
  }))
</script>
<template>
<h3 class="headerTitle" :style="titleStyle">
    {{title}}
</h3>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/_mixin';
.headerTitle {
  margin-top:20px;
  color:#000;
  font-size:30px;
  font-weight: 500;
  letter-spacing: -2.5px;
}
@include mixin.breakpoint-tablet {
  .headerTitle {
    margin-top:17px;
    font-size:24px;
    letter-spacing: -1.2px;
  }
}
</style>