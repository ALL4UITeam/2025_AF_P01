<script setup>
    import { ref, reactive, computed } from "vue";
    import Button from 'primevue/button'
    import MainCarousel from '@components/main/MainCarousel.vue';
    import MainSearchBox from '@components/main/MainSearchBox.vue';
    import MainIndustrial from '@components/main/MainIndustrial.vue';
    import MainInform from '@components/main/MainInform.vue';
    import MainOther from '@components/main/MainOther.vue';
    import MainEventPopup from '@components/main/MainEventPopup.vue';

</script>

<template>

<router-link style="color:#3399ff;position:fixed;top:0;left:0;z-index:999;" to="/guide/pages">완료 페이지 보기 ></router-link>

    <MainEventPopup />
    
    <MainCarousel />
    
    <MainSearchBox /> 

    <!-- 산업서비스 -->
    <MainIndustrial />

    <!-- 주소정보누리집이 알려드릴게요. -->
    <MainInform />

    <!-- 도로명 국민 편의에 한발 더 가까이 -->
    <MainOther />
    
</template>


<style lang="scss" scoped>

</style>