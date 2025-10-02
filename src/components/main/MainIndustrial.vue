<script setup>
    import {ref} from "vue";

    const mainSubMenu = ref([
        {
            link:'',
            linkTitle:"주소 DB 제공 새창 열기",
            type:"Provide DB",
            title:"주소 DB 제공",
            class:'type01',
        },
        {
            link:'',
            linkTitle:"주소 DB 연계 새창 열기",
            type:"DB Linkage",
            title:"주소 DB 연계",
            class:'type02',
        },
        {
            link:'',
            linkTitle:"오픈 API 새창 열기",
            type:"Open API",
            title:"오픈 API",
            class:'type03',
        },
        {
            link:'',
            linkTitle:"주소 검색솔루션 새창 열기",
            type:"Solution",
            title:"주소 검색솔루션",
            class:'type04',
        },
    ]);
</script>

<template>

    <p class="main__title mainIndustrial__header aos-item aos-init aos-animate" data-aos="fade-right">
        <i aria-hidden="true" class="handIcon"></i>
        <i aria-hidden="true" class="handBallIcon"></i>
		다양한 산업 서비스를 지원합니다.
    </p>

    <ul class="mainIndustrial__list">
        <li v-for="(item, index) in mainSubMenu" :key="index">
            <a :href="item.link" :title="item.linkTitle" class="mainIndustrial__link" :class="item.class">
                <span class="mainIndustrial__type">{{item.type}}</span>
                <strong class="mainIndustrial__title">{{item.title}}</strong>
            </a>
        </li>
    </ul>

</template>

