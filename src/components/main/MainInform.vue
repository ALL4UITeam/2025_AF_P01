<script setup>
import {ref, onMounted, reactive} from "vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation, } from 'swiper/modules'
import { useRouter, useRoute } from "vue-router";
import axios from 'axios';

const router = useRouter();
const route = useRoute();

const modules = [Autoplay, Pagination, Navigation]

const swiperRef = ref(null);
const isAutoplay = ref(true);
const playBtn = ref(null);
const stopBtn = ref(null);

const autoplayOptions = ref({
    delay: 5000,
    disableOnInteraction: false,
});

const toggleAutoPlay = (action) => {
    if (!swiperRef.value) return;

    if (action === 'stop') {
        swiperRef.value.autoplay.stop();
        isAutoplay.value = false;
        if (playBtn.value && stopBtn.value) {
            playBtn.value.style.display = 'inline-block';
            stopBtn.value.style.display = 'none';
        }
    } else {
        swiperRef.value.autoplay.start();
        isAutoplay.value = true;
        if (playBtn.value && stopBtn.value) {
            playBtn.value.style.display = 'none';
            stopBtn.value.style.display = 'inline-block';
        }
    }
};

const onSwiperReady = (swiper) => {
    swiperRef.value = swiper;
};

const bannerItem = ref([
	{
        link:'https://business.juso.go.kr/addrlink/openApi/apiExprn.do?cPath=99JA',
        title:"오픈 API 보기",
        alt:"주소 검색을 더 쉽고 간편하게 오픈 API(새창으로 열림)",
        src:"/src/assets/images/main/img_banner_01.png",
    },
    {
        link:'/ahi/ahiReferCardNewsDetail?prRscntrMgno=118',
        title:"도로명주소법 개정 보기",
        alt:"도로명주소법 개정(2021.6.9시행) 생활속 달라지는 주소제도 바로가기(새창으로 열림)",
        src:"/src/assets/images/main/img_banner_02.png",
    },
    {
        link:'',
        title:"소규모 주소정제 공공서비스 보기",
        alt:"소규모 주소정제 공공서비스 서비스기간: 2024년 7월 15일 ~ 11월 30일",
        src:"/src/assets/images/main/img_banner_03.png",
    },
]);

const mainSubMenu = ref([
	{
		link:'/ahh/ahhNewsBoardList',
		linkTitle:"언론보도 보기",
        type:"Press Release",
        title:"언론보도",
        class:'type01',
    },
    {
        link:'/ahh/ahhFaqBoardList',
        linkTitle:"자주 묻는 질문 보기",
        type:"FAQ",
        title:"자주 묻는 질문",
        class:'type02',
    },
    {
        link:'/ahh/ahhNotifyBoardList',
        linkTitle:"불편 신고 게시판 보기",
        type:"Declaration",
        title:"불편 신고 게시판",
        class:'type03',
    },
]);
    
//검색조건 초기화변수
const inqCndParams = reactive({
	ntcMttrTtlNm: ''
	, ntcMttrCn: ''
	, pageable: {
		page: 0,
		size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE),
	}
});

//검색결과 리스트
const searchNoticeList = ref([]);
    
//검색
const noticeBoardData = async () => {
	axios.post('/api/ahh/selectNoticeList', inqCndParams)
		.then((response) => {
			const data = response.data;
			console.log(data);
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				for (let i=0; i<2; i++) {
					searchNoticeList.value.push(data.results.content[i]);
					searchNoticeList.value[i].link = "/ahh/ahhNoticeBoardDetail?ntcMttrMgno=" + searchNoticeList.value[i].ntcMttrMgno;
				}
			}
		})
		.catch((error) => {
			console.error("error =>", error);
		});
}

//상세 화면 이동
const fnDtlView = (ntcMttrMgno) => {
	router.push({
		path: '/ahh/ahhNoticeBoardDetail',
		query: {
			ntcMttrMgno: ntcMttrMgno,
		} 
	});
};

onMounted(() => {
	noticeBoardData();
    playBtn.value = document.querySelector('.swiper__bannerPlay');
    stopBtn.value = document.querySelector('.swiper__bannerStop');
});
    
</script>

<template>
    <div data-aos="fade-up" data-aos-delay="100">
        <p class="main__title mainInform__header aos-item aos-init aos-animate" data-aos="fade-right">
            <i aria-hidden="true" class="bellShakeIcon"></i>
            주소정보누리집이 알려드릴게요.
        </p>

        <div class="mainInform__content">
            <div class="mainInform__banner" data-aos="fade-right" data-aos-delay="200">
                <Swiper
                    class="mainBanner"
                    :loop="true"
                    :space-between="30"
                    :centered-slides="true"
                    :autoplay="autoplayOptions"
                    @swiper="onSwiperReady"
                    :navigation="{
                        prevEl: '.swiper__prev',
                        nextEl: '.swiper__next'
                    }"
                    :pagination="{
                        el: '.swiper___bannerPagination',
                        clickable: true,
                        renderBullet: (index, className) => `<span class='${className}'>${index + 1}번</span>`
                    }"
                    :modules="modules"
                >
                    <SwiperSlide v-for="(item, index) in bannerItem" :key="index">
                        <a :href="item.link" :title="item.title" class="mainBanner__link" target="_blank">
                            <img :src="item.src" :alt="item.alt" />
                        </a>
                    </SwiperSlide>
                </Swiper>
                <div class="swiper__bannerFunction">
                    <div class="swiper__pagination swiper___bannerPagination"></div>
                    <button class="swiper__prev" title="이전 슬라이드">
                        <span class="blind">이전</span>
                    </button>
                    <button class="swiper__play swiper__bannerPlay" 
                            @click="toggleAutoPlay('play')" 
                            title="자동재생 실행" 
                            style="display: none;">
                        <span class="blind">Play</span>
                    </button>
                    <button class="swiper__stop swiper__bannerStop" 
                            @click="toggleAutoPlay('stop')" 
                            title="자동재생 정지" 
                            style="display: inline-block;">
                        <span class="blind">Stop</span>
                    </button>
                    <button class="swiper__next" title="다음 슬라이드">
                        <span class="blind">다음</span>
                    </button>
                </div>
            </div>
            <div class="mainInform__menu" data-aos="fade-left" data-aos-delay="300">
                <div class="mainInform__notice">
                    <div class="mainInform__noticeHeader">
                        <p class="mainInform__noticeHeaderTitle">공지사항</p>
                        <a href="/ahh/ahhNoticeBoardList" class="mainInform__noticeHeaderLink" title="공지사항 목록 바로가기">
                            <span class="blind">공지사항 목록</span>
                            <i aria-hidden="true" class="iconBackground" />
                        </a>
                    </div>
                    <ul class="mainInform__noticeContent">
                        <li v-for="(item, index) in searchNoticeList" :key="index">
                            <a :href="item.link" :title="item.ntcMttrTtlNm + '보기'" class="mainInform__noticeContentLink" :class="item.class">
                                <strong class="mainInform__noticeContentTitle">{{ item.ntcMttrTtlNm }}</strong>
                                <span class="mainInform__noticeContentDate">{{ item.frstRegDt.replace(/-/g, '.') }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <ul class="mainInform__list">
                    <li v-for="(item, index) in mainSubMenu" :key="index">
                        <a :href="item.link" :title="item.linkTitle" class="mainInform__link" :class="item.class">
                            <span class="mainInform__type">{{ item.type }}</span>
                            <strong class="mainInform__title">{{ item.title }}</strong>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>



<style scoped>
.mainInform__content {overflow: hidden;display: flex;margin-top: 60px;gap: 36px;}
.mainInform__banner {overflow: hidden;position: relative;width: 50%;max-width: 710px;}
.mainInform__banner img {width:100%;}
.mainInform__banner .swiper-pagination {position: absolute;right: 0;bottom: 0;}
.mainInform__menu {display: flex;flex-direction: column;gap: 30px;width: 80%;max-width: 835px;}
.mainInform__notice {height: 288px;padding: 26px 44px 22px;border-radius: 30px;background: #274084;}
.mainInform__noticeHeader {display: flex;align-items: center;justify-content: space-between;}
.mainInform__noticeHeaderTitle {color: #fff;font-size: 27px;font-weight: bold;}
.mainInform__noticeHeaderLink {position: relative;display: flex;align-items: center;justify-content: center;width: 50px;height: 50px;border-radius: 50%;background: #111;}
.mainInform__noticeHeaderLink i {display:block;color:#fff;font-size:24px;}
.mainInform__noticeHeaderLink i::after {top:-7px;left:-9px;width: 20px;height: 13px;background-position:-127px -26px;zoom:0.9;}
.mainInform__noticeContent {margin-top: 18px;}
.mainInform__noticeContent li {margin-top: 15px;}
.mainInform__noticeContent li:first-child {margin: 0;}
.mainInform__noticeContentLink {display: flex;align-items: center;justify-content: space-between;width: 100%;padding: 21px 28px;border-radius: 20px;background: #1f336a;}
.mainInform__noticeContentTitle {overflow: hidden;width: 100%;max-width: 700px;white-space: nowrap;color: #fff;font-size: 18px;font-weight: normal;text-overflow: ellipsis;}
.mainInform__noticeContentDate {color: #c0c8dd;font-size: 16px;}
.mainInform__list {display: flex;align-items: center;gap: 28px;}
.mainInform__list li {flex: 1;}
.mainInform__link {display: block;height: 118px;padding: 30px 0 0 40px;border-radius: 30px;}
.mainInform__link.type01 {background: #fff url("@images/main/img_pressrelease01.png") no-repeat right 36px bottom 33px/54px;}
.mainInform__link.type02 {background: #fff url("@images/main/ic-faq.png") no-repeat right 32px bottom 32px/72px;}
.mainInform__link.type03 {background: #fff url("@images/main/ic-siren.png") no-repeat right 36px bottom 32px/41px;}
.mainInform__link:hover {border: 2px solid #2b6ae5;transform: scale(0.9);transition: transform 1s;}
.mainInform__type {display: block;color: #2b6ae5;font-size: 15px;}
.mainInform__title {display: block;margin-top: 12px;color: #000;font-size: 18px;}

@media (max-width: 1755px) {
  .mainInform__header {margin-top: 69px;}
  .mainInform__menu {overflow: hidden;justify-content: space-between;}
}
@media (max-width: 1580px) {
  .mainInform__link {padding:30px 20px 0;background: #fff !important;}
}

@media (max-width: 1280px) {
  .mainInform__content {margin-top:19px;gap:20px;}
  .mainInform__menu {gap:20px;}
  .mainInform__banner  {width: 341px;min-width: 341px;}
  .swiper__bannerFunction {background: none;}
  .mainInform__noticeHeaderTitle {font-size:23px;}
  .mainInform__noticeContentTitle {font-size:14px;}
  .mainInform__noticeContentDate {font-size:14px;}
  .mainInform__noticeContentLink {padding: 9px 17px;border-radius: 8px;}
  .mainInform__noticeContent li {margin-top:5px;}
  .mainInform__noticeHeaderLink {width: 36px;height: 36px;}
  .mainInform__noticeHeaderLink i {font-size:18px;}
  .mainInform__notice {border-radius: 16px;padding: 24px 20px 20px;}
  .mainInform__link {border-radius: 16px;}
  .mainInform__list {gap:20px;}
  .mainInform__notice {height: auto;}
  .mainInform__title {font-size:16px;}
}

@media (max-width: 1023px) {
  .mainInform__menu {gap:10px;}
  .mainInform__type {font-size:15px;}
  .mainInform__title {font-size:14px}
  .mainInform__list {gap:10px;}
  .swiper__bannerFunction {background: url("@images/main/img-minus-bg-banner.png") no-repeat right bottom /165px 50px;}
  .mainInform__link {height: auto;padding: 22px 20px 23px;border-radius: 10px;}
}

@media (max-width: 900px) {
  .mainInform__header {height: 21px;margin-top: 34px;background-size: 19px;}
  .mainInform__content {display: flex;align-items: center;flex-direction: column;width: 100%;margin-top: 19px;gap: 37px;}
  .mainInform__banner {position: relative;width: 100%;max-width: 100%;height: auto;min-width: auto;}
  .mainInform__banner .swiper-pagination {position: absolute;right: 0;bottom: 0;}
  .mainInform__menu {display: flex;flex-direction: column;gap: 16px;width: 100%;max-width: 100%;}
  .mainInform__notice {height: auto;padding: 16px;border-radius: 10px;background: #274084;}
  .mainInform__noticeHeader {display: flex;align-items: center;justify-content: space-between;}
  .mainInform__noticeHeaderTitle {color: #fff;font-size: 17px;font-weight: bold;}
  .mainInform__noticeHeaderLink {display: flex;align-items: center;justify-content: center;width: 28px;height: 28px;border-radius: 50%;background: #111;}
  .mainInform__noticeHeaderLink i {width: auto;height: auto;color: #fff;font-size: 12px;}
  .mainInform__noticeContent {margin-top: 10px;}
  .mainInform__noticeContent li {margin-top: 10px;}
  .mainInform__noticeContent li:first-child {margin: 0;}
  .mainInform__noticeContentLink {display: flex;align-items: center;justify-content: space-between;width: 100%;padding: 14px;border-radius: 10px;background: #1f336a;}
  .mainInform__noticeContentTitle {overflow: hidden;width: 100%;max-width: 700px;white-space: nowrap;color: #fff;font-size: 14px;font-weight: normal;text-overflow: ellipsis;}
  .mainInform__noticeContentDate {color: #c0c8dd;font-size: 13px;}
  .mainInform__list {display: flex;align-items: center;gap: 10px;}
  .mainInform__list li {flex: 1;}
  .mainInform__link {display: block;height: 107px;padding: 15px 0 0 11px;border-radius: 10px;}
  .mainInform__link.type01 {background: #fff url("@images/main/ic-helpcall.png") no-repeat right 11px bottom 11px/38px;}
  .mainInform__link.type02 {background: #fff url("@images/main/ic-faq.png") no-repeat right 13px bottom 14px/37px;}
  .mainInform__link.type03 {background: #fff url("@images/main/ic-siren.png") no-repeat right 13px bottom 14px/28px;}
  .mainInform__link:hover {border: 2px solid #2b6ae5;transform: scale(0.9);transition: transform 1s;}
  .mainInform__type {display: block;color: #2b6ae5;font-size: 14px;}
  .mainInform__title {display: block;margin-top: 7px;color: #000;font-size: 18px;}
}
@media (max-width: 600px) {
  .mainInform__type {font-size:12px;}
  .mainInform__title {font-size: 13px;}
  .mainInform__link {height: 68px;}
}
</style>