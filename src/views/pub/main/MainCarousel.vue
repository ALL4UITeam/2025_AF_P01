<script setup>
  import { onMounted, ref, nextTick } from "vue";
	import Button from 'primevue/button';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Autoplay, Pagination, Navigation, } from 'swiper/modules'
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


const activePopup = ref(null);
let lastButton = ref(null);

const openPopup = (type, event) => {
  activePopup.value = type;
  swiperRef.value.autoplay.stop();

  lastButton.value = event.target.closest('button');


  console.log(lastButton.value);

  const mainCarouselWrap = event.target.closest('.mainCarousel');
  if (mainCarouselWrap) {
    mainCarouselWrap.style.display = 'none';
  }

  event.target.focus();
}

const closePopup = () => {

  activePopup.value = null;

  
  document.querySelectorAll('.mainCarousel').forEach(wrap => {
    wrap.style.display = 'flex';
  })

  if (lastButton.value) {
    lastButton.value.focus();
  }

  swiperRef.value.autoplay.start();

}
</script>

<template>
    <div class="mainCarouselSwipe__wrap">
      <Swiper
        class="mainCarouselSwipe"
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
        <SwiperSlide>
          <div class="mainCarousel">
            <div class="mainCarousel__mainContent">
              <a href="" class="mainCarousel__mainContentLink" title="사물주소 버스정류장의 위치 주소 자세히보기">
                  <div class="mainCarousel__type">사물주소</div>
                  <p class="mainCarousel__text"><strong>#버스정류장</strong>의<br />위치 주소가 궁금하신가요?</p>
                  <div class="mainCarousel__image">
                    <img src="@/assets/images/main/img-object-addr.png" alt="버스정류장 한누리대로4 112,119 신고 시 내 위치는 세종시 한누르대로 4번 버스정류장" />
                  </div>
                  <div class="mainCarousel__more" aria-hidden="true">자세히 보기
                    <i aria-hidden="true" class="bi bi-arrow-right" />
                    <!-- <span aria-hidden="true" class="after"></span>
                    <span aria-hidden="true" class="before"></span> -->
                  </div>
              </a>
              <Button class="mainCarousel__button" title="사물주소 상세설명보기" @click="openPopup('type01', $event)">
                <i aria-hidden="true" class="bi bi-exclamation-lg" />
                <span class="blind">사물주소 상세설명보기</span>
              </Button>
            </div>
            <ul class="mainCarousel__subContent">
              <li>
                <a href="" class="mainCarousel__mainContentSubLink" title="국가지점번호 자세히보기">
                    <div class="mainCarousel__subType">국가지점번호</div>
                    <p class="mainCarousel__subText"><strong>#지리봉</strong>의 위치 정보가<br />궁금하신가요?</p>
                    <div class="mainCarousel__subImage">
                      <img src="@/assets/images/main/img-country-num.png" alt="국가지점번호 소방 긴급전화 119" />
                    </div>
                    <div class="mainCarousel__subMore"><i aria-hidden="true" class="bi bi-arrow-right" /></div>
                </a>
                <Button class="mainCarousel__button" title="국가지점번호 상세정보보기" @click="openPopup('type02', $event)">
                  <i aria-hidden="true" class="bi bi-exclamation-lg" />
                  <span class="blind">국가지점번호 상세설명보기</span>
                </Button>
              </li>
              <li class="type01">
                <a href="" class="mainCarousel__mainContentSubLink" title="기초번호 자세히보기">
                    <div class="mainCarousel__subType">기초번호</div>
                    <p class="mainCarousel__subText"><strong>#국회대로</strong>의 위치 정보가<br />궁금하신가요?</p>
                    <div class="mainCarousel__subImage type01">
                      <img src="@/assets/images/main/img-roadname-addr.png" alt="국회대로 758" />
                    </div>
                    <div class="mainCarousel__subMore"><i aria-hidden="true" class="bi bi-arrow-right" /></div>
                </a>
                <Button class="mainCarousel__button" title="기초번호 상세설명보기" @click="openPopup('type03', $event)">
                  <i aria-hidden="true" class="bi bi-exclamation-lg" />
                  <span class="blind">국가지점번호 상세설명보기</span>
                </Button>
              </li>
            </ul>
          </div>
          <div class="mainCarousel__layerPopup type01" v-show="activePopup === 'type01'">
            <div class="mainCarousel__layerPopupInner">

              <dl class="mainCarousel__layerPopupHeader">
                <dt>사물주소란?</dt>
                <dd>건물이 아닌 시설물 등에 <strong>사물의 위치를 특정하기 위해</strong>'도로명주소'법에 따라 부여된 주소</dd>
              </dl>
              <ul class="mainCarousel__tagBox">
                  <li><div class="mainCarousel__tag"><div class="mainCarousel__tagbg type01">#무더위심터</div></div></li>
                  <li><div class="mainCarousel__tag"><div class="mainCarousel__tagbg type02">#CCTV</div></div></li>
                  <li>
                    <div class="mainCarousel__tag">
                      <div class="mainCarousel__tagbg type03">#무인민원발급기</div>
                    </div>
                    <div class="mainCarousel__tagText">동의 시설물에 주소를 부여</div>
                  </li>
              </ul>
              
              <a href="#" class="mainCarousel__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

              <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                  <i aria-hidden="true" class="bi bi-x" />
                  <span class="blind">팝업닫기</span>
              </Button>
            </div>
          </div>
          <div class="mainCarousel__layerPopup type02" v-show="activePopup === 'type02'">
            <div class="mainCarousel__layerPopupInner">
              <dl class="mainCarousel__layerPopupHeader">
                <dt>국가지점번호란?</dt>
                <dd>국토와 해양을 격자형으로 기획한 지점마다 부여한 번호</dd>
                <dd class="type01"><span class="commonColor01">산악·해안 등에서 긴급상황 발생 시 구조·구급활동의 위치 표시로 활용</span>하는 국민 안전망</dd>
              </dl>
              <a href="#" class="mainCarousel__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

              <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                  <i aria-hidden="true" class="bi bi-x" />
                  <span class="blind">팝업닫기</span>
              </Button>
            </div>
          </div>
          <div class="mainCarousel__layerPopup type03" v-show="activePopup === 'type03'">
            <div class="mainCarousel__layerPopupInner">
              <dl class="mainCarousel__layerPopupHeader">
                <dt>기초번호란?</dt>
                <dd>도로구간의 시작지점부터 끝지점가지 일정한 간격으로 부여한 번호</dd>
                <dd class="type01"><span class="commonColor01">건물이 없는 도로,공터 등에서 긴급상황 발생 시 구조·구급활동의 위치 표시로 활용</span>하는 국민 안전망</dd>
              </dl>
              <a href="#" class="mainCarousel__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

              <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                  <i aria-hidden="true" class="bi bi-x" />
                  <span class="blind">팝업닫기</span>
              </Button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div class="mainCarousel">
            <div class="mainCarousel__mainContent">
              <a href="" class="mainCarousel__mainContentLink" title="입체주소 자세히보기">
                  <div class="mainCarousel__type">입체주소</div>
                  <p class="mainCarousel__text"><strong>#잠실역중앙통로</strong>의<br /> 주소가 궁금하신가요?</p>
                  <div class="mainCarousel__image02">
                    <img src="@/assets/images/main/img-3-d-addr.png" alt="세종고가도로1 > 205, 세종로 153, 세종지하도로 1 > 231" />
                  </div>
                  <div class="mainCarousel__more" aria-hidden="true">자세히 보기
                    <i aria-hidden="true" class="bi bi-arrow-right" />
                  </div>
              </a>
              <Button class="mainCarousel__button" title="입체주소 상세설명보기" @click="openPopup('type04', $event)">
                <i aria-hidden="true" class="bi bi-exclamation-lg" />
                <span class="blind">입체주소 상세설명보기</span>
              </Button>
            </div>
            <ul class="mainCarousel__subContent">
              <li class="type02">
                <a href="" class="mainCarousel__mainContentSubLink" title="장소지능정보 자세히보기">
                    <div class="mainCarousel__subType">장소지능정보</div>
                    <p class="mainCarousel__subText"><strong>#건물 출입구</strong>의 장소 정보가<br />궁금하신가요?</p>
                    <div class="mainCarousel__subImage">
                      <img src="@/assets/images/main/img-location-info.png" alt="건물 출입구 정보" />
                    </div>
                    <div class="mainCarousel__subMore"><i aria-hidden="true" class="bi bi-arrow-right" /></div>
                </a>
                <Button class="mainCarousel__button" title="장소지능정보 상세설명보기" @click="openPopup('type05', $event)">
                  <i aria-hidden="true" class="bi bi-exclamation-lg" />
                  <span class="blind">장소지능정보 상세설명보기</span>
                </Button>
              </li>
              <li class="type03">
                <a href="" class="mainCarousel__mainContentSubLink" title="수상시설물 자세히보기">
                    <div class="mainCarousel__subType">수상시설물</div>
                    <p class="mainCarousel__subText"><strong>#낚시터</strong>의 위치 주소가<br />궁금하신가요?</p>
                    <div class="mainCarousel__subImage">
                      <img src="@/assets/images/main/img-water-facilities.png" alt="낚시터 이미지" />
                    </div>
                    <div class="mainCarousel__subMore"><i aria-hidden="true" class="bi bi-arrow-right" /></div>
                </a>
                <Button class="mainCarousel__button" title="수상시설물 상세설명보기" @click="openPopup('type06', $event)">
                  <i aria-hidden="true" class="bi bi-exclamation-lg" />
                  <span class="blind">수상시설물 상세설명보기</span>
                </Button>
              </li>
            </ul>
          </div>

          <div class="mainCarousel__layerPopup type04" v-show="activePopup === 'type04'">
            <div class="mainCarousel__layerPopupInner">
              <dl class="mainCarousel__layerPopupHeader">
                <dt>입체주소란?</dt>
                <dd>고가도, 지하도,지하철역 내부통로 등의 <strong>입체도로</strong><span>*</span>와 건물 각 층의 통로 및 호수 등의<br /><strong>내부도로<span>*</span>를 포함하여 구체적으로 위치</strong>를 명시하는 주소 체계</dd>
              </dl>
              <ul class="mainCarousel__layerPopupContent">
                  <li>
                      <div class="mainCarousel__layerPopupContentTitle"><span class="commonColor01">*</span>입체도로</div>
                      <ul class="mainCarousel__layerPopupContentText">
                          <li>* <strong class="str">고가도로</strong>: 공중에 설치된 도로 빛 통로</li>
                          <li>* <strong class="str">지하도로</strong>: 지하에 설치된 도로 빛 통로</li>
                      </ul>
                  </li>
                  <li>
                      <div class="mainCarousel__layerPopupContentTitle"><span>*</span>내부도로</div>
                      <ul class="mainCarousel__layerPopupContentText">
                          <li>* 건물의 내부에 설치된 도로 및 통로</li>
                          <li>* 건물이 아닌 구조물의 내부에 설치된 도로 및 통로</li>
                      </ul>
                  </li>
              </ul>
              <a href="#" class="mainCarousel__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

              <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                  <i aria-hidden="true" class="bi bi-x" />
                  <span class="blind">팝업닫기</span>
              </Button>
            </div>
          </div>
          <div class="mainCarousel__layerPopup type05" v-show="activePopup === 'type05'">
            <div class="mainCarousel__layerPopupInner">
              <dl class="mainCarousel__layerPopupHeader">
                <dt>장소지능정보란?</dt>
                <dd>장소와 관련된 다양한 데이터를 수집하고 분석하여 유영한 정보를 제공하는 기술 및 시스템</dd>
              </dl>
              <ul class="mainCarousel__tagBox">
                  <li><div class="mainCarousel__tag"><div class="mainCarousel__tagbg type04">#출입구</div></div></li>
                  <li><div class="mainCarousel__tag"><div class="mainCarousel__tagbg type05">#별칭정보</div></div></li>
                  <li>
                    <div class="mainCarousel__tag">
                      <div class="mainCarousel__tagbg type06">#주차장 출입구</div>
                    </div>
                    <div class="mainCarousel__tagText">등의 장소 데이타를 수집하여 정확한 위치정보를 제공</div>
                  </li>
              </ul>
              <a href="#" class="mainCarousel__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

              <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                  <i aria-hidden="true" class="bi bi-x" />
                  <span class="blind">팝업닫기</span>
              </Button>
            </div>
          </div>
          <div class="mainCarousel__layerPopup type06" v-show="activePopup === 'type06'">
            <div class="mainCarousel__layerPopupInner">
              <dl class="mainCarousel__layerPopupHeader">
                <dt>수상시설물이란?</dt>
                <dd>항 포구 해안가 내 각종 수상 시설물에도 도로명 장소 부여</dd>
              </dl>
              <ul class="mainCarousel__tagBox">
                  <li><div class="mainCarousel__tag"><div class="mainCarousel__tagbg type07">#양식장</div></div></li>
                  <li><div class="mainCarousel__tag"><div class="mainCarousel__tagbg type08">#해상팬션</div></div></li>
                  <li>
                    <div class="mainCarousel__tag">
                      <div class="mainCarousel__tagbg type09">#해상낚시터</div>
                    </div>
                    <div class="mainCarousel__tagText">등의 수상 시설물에 주소를 부여</div>
                  </li>
              </ul>
              <a href="#" class="mainCarousel__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

              <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                  <i aria-hidden="true" class="bi bi-x" />
                  <span class="blind">팝업닫기</span>
              </Button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <Button class="mainCarouselSwipe__autoplay" @click="toggleAutoPlay" :title="isAutoplay ? '오토플레이 정지' : '오토플레이 시작'">
        <span class="blind">{{isAutoplay ? '오토플레이 정지' : '오토플레이 시작'}}</span>
        <i aria-hidden="true" class="bi bi-pause" />
      </Button>
    </div>

</template>
