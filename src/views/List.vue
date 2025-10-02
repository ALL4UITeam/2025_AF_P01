<script setup>

	import { ref } from 'vue'
	import { menus as menuData } from '@/constants/menu'

	const menus = ref(menuData)
</script>

<template>
  <pre>
    실행 서브페이지 - npm run dev  
    메인페이지 npm run serve:ssr

    메인 요구조건 캐쉬삭제후 초기로딩 3M



  </pre>
</template>