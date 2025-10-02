<script setup>
    import {ref} from "vue";
    import ContentTitle from '@components/title/ContentTitle.vue';

    const mainSubMenu = ref([
        {
            link:'',
            linkTitle:"주소 DB 제공 보기",
            type:"Procide DB",
            title:"주소 DB 제공",
            class:'type01',
        },
        {
            link:'',
            linkTitle:"주소 DB 연계 보기",
            type:"DB Association",
            title:"주소 DB 연계",
            class:'type02',
        },
        {
            link:'',
            linkTitle:"오픈 API 보기",
            type:"Open API",
            title:"오픈 API",
            class:'type03',
        },
        {
            link:'',
            linkTitle:"주소 검색솔루션 보기",
            type:"Solution",
            title:"주소 검색솔루션",
            class:'type04',
        },
    ]);
</script>

<template>

    <p class="main__title mainIndustrial__header">다양한 산업 서비스를 지원합니다.</p>

    <ul class="mainIndustrial__list">
        <li v-for="(item, index) in mainSubMenu" :key="index">
            <a :href="item.link" :title="item.linkTitle" class="mainIndustrial__link" :class="item.class">
                <span class="mainIndustrial__type">{{item.type}}</span>
                <strong class="mainIndustrial__title">{{item.title}}</strong>
                <i aria-hidden="true" class="bi bi-arrow-up-right" />
            </a>
        </li>
    </ul>

</template>
