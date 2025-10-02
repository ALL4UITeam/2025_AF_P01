<script setup>
import { ref } from 'vue'
import DefaultHeader from '@/layouts/DefaultHeader.vue'
import Footer from '@components/common/Footer.vue';

</script>
<template>
<!-- searchResultType -->
	<div class="layout" >
		<DefaultHeader />
		<div class="content" id="content">
      <slot />
    </div>
    <Footer />
  </div>
</template>
<style lang="scss" scoped>

</style>
