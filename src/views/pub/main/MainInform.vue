<script setup>
    import { ref, reactive, onMounted } from "vue";
    import ContentTitle from '@components/title/ContentTitle.vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { Swiper, SwiperSlide } from 'swiper/vue';
    import { Autoplay, Pagination, Navigation, } from 'swiper/modules'
    import Button from 'primevue/button';
    const modules = [Autoplay, Pagination, Navigation]
    import 'swiper/swiper-bundle.css';
    const autoplayOptions = ref({
        delay: 5000,
        disableOnInteraction: false,
    })

    const swiperRef = ref(null);
    const isAutoplay = ref(true);

    const toggleAutoPlay = () => {
        if (swiperRef.value) {
        if(isAutoplay.value) {
            swiperRef.value.autoplay.stop();
        } else {
            swiperRef.value.autoplay.start();
        }
        isAutoplay.value = !isAutoplay.value
        }
    }

    const onSwiperReady = (swiper) => {
        swiperRef.value = swiper
    }


    const bannerItem = ref([
        {
            link:'',
            title:"오픈 API 보기",
            alt:"주소 검색을 더 쉽고 간편하게 오픈 API",
            src:"/src/assets/images/main/img-banner.png",
        },
        {
            link:'',
            title:"도로명주소법 개정 보기",
            alt:"생활속 달라지는 주소제도 도로명주소법 개정(2021.6.9시행)",
            src:"/src/assets/images/main/img_banner_02.png",
        },
        {
            link:'',
            title:"소규모 주소정제 공공서비스 보기",
            alt:"소규모 주소정제 공공서비스  서비스기간: 2024년 7월 15일 ~ 11월 30일",
            src:"/src/assets/images/main/img_banner_03.png",
        },
    ]);
  	//라우터
    const router = useRouter();
    
    const notice = ref([
        { 
            link:'',
            title:"주소정보 누리집 상담 시스템 서버 업그레이드 교체 작업안내 서버 업그레이드 교체 작업안내 서버 업그레이드 교체 작업안내",
            date:"2024.08.05",
        },
        {
            link:'',
            title:"주소정보 누리집 상담 시스템 서버 업그레이드 교체 작업안내",
            date:"2024.08.05",
        },
    ]);
    const mainSubMenu = ref([
        {
            link:'',
            linkTitle:"도움센터 보기",
            type:"1588-0061",
            title:"도움센터",
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
      ,ntcMttrCn: ''
      , pageable: {
        page: 0,
        size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE),
      }
    });
    
  //검색
  const noticeBoardData = async () => {
    //목록조회
    axios.post('/api/ahh/selectNoticeList', inqCndParams)
      .then((response) => {
        const data = response.data;
        if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
        	for(let i=0; i<2; i++) {
        		notice.value[i].key = data.results.content[i].ntcMttrMgno;
        		notice.value[i].title = data.results.content[i].ntcMttrTtlNm;
        		var regDt = data.results.content[i].frstRegDt;
        		let formattedDate = regDt.replace(/-/g, ".");
        		notice.value[i].date = formattedDate;
        	}
        	console.log("################ notice -> ", notice);
        } else {
        	console.log("################ data -> ", data);
        }
      })
      .finally(() => {
        //메세지 숨김
      });
  }
  
  //상세이동
  const fnDtlView = (ntcMttrMgno) => {
  	console.log("공지사항 관리번호 : ", ntcMttrMgno);
  	router.push({ 
  		path: '/ahh/ahhNoticeBoardDetail', 
  		query: {ntcMttrMgno: ntcMttrMgno } 
  	});
  };
  
  function noticePage() {
	  window.location.href = "/ahh/ahhNoticeBoardList";
  }
  
  onMounted(() => {
	  noticeBoardData();
  })
    
</script>

<template>

    <ContentTitle title="주소정보누리집이 알려드릴께요." fontSize="45px" marginTop="110px" mobileFontSize="20px" mobileMarginTop="20px" class="mainInform__header" />

    <div class="mainInform__content">
        <div class="mainInform__banner">
            <Swiper
                class="mainBanner"
                :loop="true"
                :spaceBetween="30"
                :centeredSlides="true"
                :autoplay="autoplayOptions"
                @swiper="onSwiperReady"
                :navigation="true"
                :pagination="{ clickable: true }"
                ref="swiperRef"
                :modules="modules"
            >
                <SwiperSlide v-for="(item, index) in bannerItem" :key="index">
                    <a :href="item.link" :title="item.title" class="mainBanner__link">
                        <img :src="item.src" :alt="item.alt" />
                    </a>
                </SwiperSlide>
            </Swiper>
            <Button class="mainBanner__autoplay" @click="toggleAutoPlay" :title="isAutoplay ? '오토플레이 정지' : '오토플레이 시작'">
                <span class="blind">{{isAutoplay ? '오토플레이 정지' : '오토플레이 시작'}}</span>
                <i aria-hidden="true" class="bi bi-pause" />
            </Button>
        </div>
        <div class="mainInform__menu">
            <div class="mainInform__notice">
                <div class="mainInform__noticeHeader">
                    <p class="mainInform__noticeHeaderTitle">공지사항</p>
                    <a href="#" class="mainInform__noticeHeaderLink" title="공지사항 목록 바로가기"  @click="noticePage">
                        <span class="blind">공지사항 목록</span>
                        <i aria-hidden="true" class="bi bi-arrow-right"/>
                    </a>
                </div>
                <ul class="mainInform__noticeContent">
                    <li v-for="(item, index) in notice" :key="index">
                        <a :href="item.link" :title="item.title + '보기'" class="mainInform__noticeContentLink" :class="item.class">
                            <strong class="mainInform__noticeContentTitle" @click.prevent="fnDtlView(item.key)">{{item.title}}</strong>
                            <span class="mainInform__noticeContentDate">{{item.date}}</span>
                        </a>
                    </li>
                </ul>
            </div>
            <ul class="mainInform__list">
                <li v-for="(item, index) in mainSubMenu" :key="index">
                    <a :href="item.link" :title="item.linkTitle" class="mainInform__link" :class="item.class">
                        <span class="mainInform__type">{{item.type}}</span>
                        <strong class="mainInform__title">{{item.title}}</strong>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    
</template>
