<script setup>
  import EnHeader from '@/layouts/EnHeader.vue'
  import EnFooter from '@/layouts/EnFooter.vue'
</script>
<template>
  <div class="enLayout">
    <EnHeader />
    <slot />
    <EnFooter />
  </div>
</template>


<style lang="scss" scoped>
@import url('@scss/contents/en/enMain.scss');
</style>
