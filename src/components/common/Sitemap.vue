<script setup>
import { ref, onMounted, computed } from "vue";
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb'
import HeaderTitle from '@components/title/HeaderTitle.vue';

// 브레드크럼
const breadcrumbs = [
    {
        label:'메인',
        title:'메인으로 이동',
        url: '/',
    },
    {
        label:'사이트맵',
        title:'사이트맵 이동',
        url: '/',
    },
]

const menus = ref([
    {
        title:'주소정책소개',
        submenus: [
            {
                type:'link',
                label:'도로명주소?',
                action: () => {
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    window.open('/common/sample', 'popup', `width=${width},height=${height},scrollbars=yes`);
                },
            },
            {
                type:'link', 
                label:'사물주소', 
                href:'/common/sample',
                new: true
            },
            {
                type:'link', 
                label:'입체주소', 
                href:'/common/sample',
                new: true
            },
            {
                type:'link', 
                label:'장소지능', 
                href:'/common/sample',
                new: true
            },
            {
                type:'link', 
                label:'BI 소개', 
                href:'/common/sample',
            },
        ],
    },
    {
        title:'주소정보활용',
        submenus: [
            {
                type:'link', 
                label:'통합지도', 
                action: () => {
                    const width = window.innerWidth;
                    const height = window.innerHeight;
                    window.open('/utilization/IntegratedMap', 'popup', `width=${width},height=${height},scrollbars=yes`);
                },
            },
            {
                type:'link',
                label:'주소전환',
                href:'/utilization/AddressConvert',
                tabmenus: [
                    {
                        label:'주소전환',
                        href:'/utilization/AddressConvert',
                    },
                ]
            },
        ]
    },
    {
        title:'주소정보조회',
        submenus: [
            {
                type:'link',
                label:'도로명 주소 조회',
                href:'/inquiry/RoadNameAddress',
            },
            {
                type:'link',
                label:'도로명 정보 조회',
                href:'/inquiry/RoadNameDataList',
            },
            {
                type:'link',
                label:'사물 주소 조회',
                href:'/inquiry/AddressObject',
            },
            {
                type:'link',
                label:'우편 번호 조회',
                href:'/inquiry/PostalCode',
            },
            {
                type:'link',
                label:'지점 번호 조회',
                href:'/inquiry/BranchNumber',
            },
            {
                type:'link',
                label:'입체주소',
                href:'/common/sample',
            },
        ]
    },
    {
        title:'주소이야기',
        submenus: [
            {
                type:'link',
                label:'아름다운 길',
                href:'/story/BackgroundBoardList',
            },
            {
                type:'link',
                label:'홍보자료',
                href:'/story/ReferenceBoardList',
            },
            {
                type:'link',
                label:'우리 집 주소는?',
                href:'/story/InfoMyArea',
            },
            {
                type:'link',
                label:'주소통계',
                href:'/story/StatisMain',
            },
            {
                type:'link',
                label:'인포그래픽',
                href:'/story/Infographic',
            },
            {
                type:'link',
                label:'지자체 안내도',
                href:'/story/GuideMapSidoList',
            },
        ]
    },
    {
        title:'주소소통마당',
        submenus: [
            {
                type:'link',
                label:'공지사항',
                href:'/forum/NoticeBoardList',
            },
            {
                type:'link',
                label:'자주묻는질문(FAQ)',
                href:'/forum/FAQBoardList',
            },
            {
                type:'link',
                label:'주소동일성 영문증명서 발급',
                href:'/forum/AddrIdentityMain',
            },
            {
                type:'link',
                label:'언론보도',
                href:'/forum/NewsBoardList',
            },
            {
                type:'link',
                label:'불편신고',
                href:'/forum/QABoardList',
            },
        ]
    },
    {
        title:'그 밖의 정보',
        submenus: [
            {
                type:'link',
                label:'개인정보처리방침',
                href:'',
            },
            {
                type:'link',
                label:'이용약관',
                href:'',
            },
            {
                type:'link',
                label:'법령정보',
                href:'',
            },
            {
                type:'link',
                label:'담당자 연락처',
                href:'',
            },
            {
                type:'link',
                label:'찾아오시는 길',
                href:'',
            },
        ]
    },
])

</script>

<template>
    <Breadcrumb :model="breadcrumbs" aria-label="네비게이션">
        <template #item="{ item }">
            <a :href="item.url" :title="item.title">{{item.label}}</a>
        </template>
    </Breadcrumb>

    <HeaderTitle title="사이트맵" />

    <div class="common__box siteMap__wrap">
        <ul class="siteMap__list">
            <li v-for="(menu,index) in menus" :key="index">
                <p class="siteMap__listTitle">{{menu.title}}</p>
                <ul class="siteMap__subMenuList">
                    <li v-for="(subMenu, subIndex) in menu.submenus" :key="subIndex">
                        <a class="siteMap___link" v-if="subMenu.type === 'popup'" @click="subMenu.action ? subMenu.action() : null">
                            <div class="siteMap___linkInner">
                                <div class="siteMap___linkHeader">
                                    <p class="siteMap___subMenuName">{{subMenu.label}}
                                        <span class="siteMap___newService" v-if="subMenu.new">신규서비스</span>
                                    </p>
                                    <i aria-hidden="true" class="bi bi-box-arrow-up-right" />
                                </div>
                            </div>
                        </a>
                        <a class="siteMap___link" v-else-if="subMenu.type === 'link'" :href="subMenu.href">
                            <div class="siteMap__linkInner">
                                <div class="siteMap__linkHeader">
                                    <p class="siteMap__subMenuName">{{subMenu.label}}
                                        <span class="header__newService" v-if="subMenu.new">신규서비스</span>
                                    </p>
                                    <i aria-hidden="true" class="bi bi-arrow-right" />
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    
</template>