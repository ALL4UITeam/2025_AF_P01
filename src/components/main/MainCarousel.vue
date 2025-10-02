<script setup>
  import { onMounted, ref, nextTick, onBeforeUnmount } from "vue";
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Autoplay, Pagination, Navigation, } from 'swiper/modules'
  const modules = [Autoplay, Pagination, Navigation]
  import 'swiper/css';


  const swiperRef = ref(null);
    const isAutoplay = ref(true);
    const playBtn = ref(null);
    const stopBtn = ref(null);

    const autoplayOptions = ref({
        delay: 5000,
        disableOnInteraction: false,
    });

    const handleDocumentClick = (event) => {
        if (activePopupIndex.value) {
            const isClickedPopup = event.target.closest('.mainCarousel__layerPopup');
            const isClickedOpenButton = event.target.closest('.mainCarousel__layerPopupOpen');
            
            if (!isClickedPopup && !isClickedOpenButton) {
                closeLayerPopup();
            }
        }
    };

    const handleEscKey = (event) => {
        if (event.key === 'Escape' && activePopupIndex.value) {
            closeLayerPopup();
        }
    };

    onMounted(() => {
        playBtn.value = document.querySelector('.swiper__playVisual');
        stopBtn.value = document.querySelector('.swiper__stopVisual');
        
        // 전역 이벤트 리스너 등록
        document.addEventListener('click', handleDocumentClick);
        document.addEventListener('keydown', handleEscKey);
    });

    onBeforeUnmount(() => {
        // 컴포넌트 제거 시 이벤트 리스너 정리
        document.removeEventListener('click', handleDocumentClick);
        document.removeEventListener('keydown', handleEscKey);
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

  const activePopupIndex = ref(null);
  const lastClickedOpenBtn = ref(null);

  const openLayerPopup = async (event) => {
    event.preventDefault();
    const type = event.currentTarget.getAttribute('data-type');
    activePopupIndex.value = type;
    lastClickedOpenBtn.value = event.currentTarget;

    // 팝업이 열릴 때 스와이퍼 정지
    if (swiperRef.value) {
      swiperRef.value.autoplay.stop();
      isAutoplay.value = false;
      if (playBtn.value && stopBtn.value) {
        playBtn.value.style.display = 'inline-block';
        stopBtn.value.style.display = 'none';
      }
    }

    // 팝업이 열린 후 닫기 버튼에 포커스
    await nextTick();
    const closeButton = document.querySelector(`.mainCarousel__layerPopup.type${type} .mainCarousel__closeButton`);
    if (closeButton) {
      closeButton.focus();
    }
  };

  const closeLayerPopup = () => {
    activePopupIndex.value = null;
    
    // 팝업이 닫힐 때 스와이퍼 자동재생 시작
    if (swiperRef.value) {
      swiperRef.value.autoplay.start();
      isAutoplay.value = true;
      if (playBtn.value && stopBtn.value) {
        playBtn.value.style.display = 'none';
        stopBtn.value.style.display = 'inline-block';
      }
    }

    // 이전에 클릭했던 열기 버튼으로 포커스 이동
    if (lastClickedOpenBtn.value) {
      lastClickedOpenBtn.value.focus();
      lastClickedOpenBtn.value = null;
    }
  };

  // 외부 영역 클릭 시 팝업 닫기
  const handleOutsideClick = (event) => {
    if (activePopupIndex.value) {
      const popupInner = event.target.closest('.mainCarousel__layerPopupInner');
      const popupOpenBtn = event.target.closest('.mainCarousel__layerPopupOpen');
      const closeBtn = event.target.closest('.mainCarousel__closeButton');
      
      // 팝업 내부, 열기 버튼, 닫기 버튼이 아닌 영역 클릭 시에만 팝업 닫기
      if (!popupInner && !popupOpenBtn && !closeBtn) {
        closeLayerPopup();
      }
    }
  };

  // 가이드 북 오픈
  const fnClickGuideBook = (idx = 1) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    window.open('/introduction/GuideBook' + '?pageIdx=' + idx, 'popup', `width=${width},height=${height},scrollbars=yes`);
  };

</script>

<template>
    <div class="mainCarouselSwipe__wrap" @click="handleOutsideClick">
      <Swiper
        class="mainCarouselSwipe"
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
            el: '.swiper__paginationVisual',
            clickable: true,
            renderBullet: (index, className) => `<span class='${className}'>${index + 1}번</span>`
        }"
        :modules="modules"
      >
        <SwiperSlide>
          <div class="mainCarousel">
              <div class="mainCarousel__mainContent">
                  <a href="#link1" data-target="#popup1" data-type="01" aria-haspopup="dialog" aria-expanded="false" class="mainCarousel__mainContentLink mainCarousel__layerPopupOpen" title="사물주소 버스정류장의 위치 주소 자세히보기" @click="openLayerPopup($event)" :class="{ active: activePopupIndex === '01'}">
                      <div class="mainCarousel__type">사물주소</div>
                      <p class="mainCarousel__text"><strong>#버스정류장</strong>의<br>위치 주소가 궁금하신가요?</p>
                      <div class="mainCarousel__imageBox type01">
                          <span class="blind">버스정류장 한누리대로4 112,119 신고 시 내 위치는 세종시 한누리대로 4번 버스정류장</span>
                      </div>
                      <div class="mainCarousel__subMore" @click.prevent="fnClickGuideBook(21)"><i aria-hidden="true" class="iconBackground"></i></div>
                  </a>
              </div>
              <ul class="mainCarousel__subContent">
                  <li class="type01">
                      <a href="#link2" data-target="#popup2" data-type="02" aria-haspopup="dialog" aria-expanded="false" class="mainCarousel__mainContentSubLink mainCarousel__layerPopupOpen" title="국가지점번호 상세보기" @click="openLayerPopup($event)" :class="{ active: activePopupIndex === '02'}">
                          <div class="mainCarousel__subType">국가지점번호</div>
                          <p class="mainCarousel__subText"><strong>#설악산 대청봉</strong>의 <span class="str">위치정보가 궁금하신가요?</span></p>
                          <div class="mainCarousel__imageBox type02">
                              <span class="blind">국가지점번호 소방 긴급전화 119</span>
                          </div>
                          <div class="mainCarousel__subMore" @click.prevent="fnClickGuideBook(28)"><i aria-hidden="true" class="iconBackground"></i></div>
                      </a>
                  </li>
                  <li class="type02">
                      <a href="#link3" data-target="#popup3" data-type="03" aria-haspopup="dialog" aria-expanded="false" class="mainCarousel__mainContentSubLink mainCarousel__layerPopupOpen" @click="openLayerPopup($event)" :class="{ active: activePopupIndex === '03'}">
                          <div class="mainCarousel__subType">기초번호</div>
                          <p class="mainCarousel__subText"><strong>#국회대로</strong>의 위치 정보가<span class="str">궁금하신가요?</span></p>
                          <div class="mainCarousel__imageBox type03">
                              <span class="blind">국회대로 758</span>
                          </div>
                          <div class="mainCarousel__subMore" @click.prevent="fnClickGuideBook(29)"><i aria-hidden="true" class="iconBackground"></i></div>
                      </a>
                  </li>
              </ul>
          </div>
          <div class="mainCarousel__layerPopup type01" 
               role="dialog" 
               aria-labelledby="popup-title-01" 
               :style="{ display: activePopupIndex === '01' ? 'block' : 'none' }"
               @click="handleOutsideClick">
              <div class="mainCarousel__layerPopupInner">
                  <dl class="mainCarousel__layerPopupHeader">
                      <dt>사물주소란?</dt>
                      <dd>건물이 아닌 시설물 등에 <strong>사물의 위치를 특정하기 위해</strong> 도로명과 기초번호를 활용하여 부여된 주소</dd>
                  </dl>
                  <ul class="mainCarousel__tagBox">
                      <li class="type01">
                          <div class="mainCarousel__tag"><div class="mainCarousel__tagbg type01">#버스정류장</div></div>
                          <div class="mainCarousel__tag"><div class="mainCarousel__tagbg type02">#공원</div></div>
                      </li>
                      <li class="type02">
                          <div class="mainCarousel__tag"><div class="mainCarousel__tagbg type03">#주차장</div></div>
                          <div class="mainCarousel__tag"><div class="mainCarousel__tagbg type04">#우체통</div></div>
                      </li>
                      <li class="type03">
                          <div class="mainCarousel__tagText">등의 시설물에 주소를 부여</div>
                      </li>
                  </ul>

                  <a href="#" class="mainCarousel__layerPopupMore" @click.prevent="fnClickGuideBook(21)" title="사물주소 새창 열기">자세히보기 <i aria-hidden="true" class="iconBackground"></i></a>

                  <button type="button" class="mainCarousel__closeButton" title="팝업 닫기" aria-label="Close" @click="closeLayerPopup">
                      <i aria-hidden="true" class="iconBackground"></i>
                      <span class="blind">팝업닫기</span>
                  </button>
              </div>
          </div>
          <div class="mainCarousel__layerPopup type02" 
               role="dialog" 
               aria-labelledby="popup-title-02" 
               :style="{ display: activePopupIndex === '02' ? 'block' : 'none' }"
               @click="handleOutsideClick">
              <div class="mainCarousel__layerPopupInner">
                  <dl class="mainCarousel__layerPopupHeader">
                      <dt>국가지점번호란?</dt>
                      <dd>국토와 해양을 격자형으로 기획한 지점마다 부여한 번호</dd>
                      <dd><span class="commonColor01">산악·해안 등에서 긴급상황 발생 시 구조·구급활동의 위치 표시로 활용</span>하는 국민 안전망</dd>
                  </dl>
                  <a href="" class="mainCarousel__layerPopupMore" @click.prevent="fnClickGuideBook(28)" title="국가지점번호 새창열기">자세히보기 <i aria-hidden="true" class="iconBackground"></i></a>

                  <button type="button" class="mainCarousel__closeButton" title="팝업 닫기" aria-label="Close" @click="closeLayerPopup">
                      <i aria-hidden="true" class="iconBackground"></i>
                      <span class="blind">팝업닫기</span>
                  </button>
              </div>
          </div>
          <div class="mainCarousel__layerPopup type03" 
               role="dialog" 
               aria-labelledby="popup-title-03" 
               :style="{ display: activePopupIndex === '03' ? 'block' : 'none' }"
               @click="handleOutsideClick">
                <div class="mainCarousel__layerPopupInner">
                    <dl class="mainCarousel__layerPopupHeader">
                        <dt>기초번호란?</dt>
                        <dd>도로구간의 시작지점부터 끝지점까지 일정한 간격으로 부여한 번호</dd>
                        <dd><span class="commonColor01">건물이 없는 도로,공터 등에서 긴급상황 발생 시 구조·구급활동의 위치 표시로 활용</span>하는 국민 안전망</dd>
                    </dl>
                    <a href="" class="mainCarousel__layerPopupMore" @click.prevent="fnClickGuideBook(29)" title="기초번호 새창열기">자세히보기 <i aria-hidden="true" class="iconBackground"></i></a>

                    <button type="button" class="mainCarousel__closeButton" title="팝업 닫기" aria-label="Close" @click="closeLayerPopup">
                        <i aria-hidden="true" class="iconBackground"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                </div>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div class="mainCarousel">
                <div class="mainCarousel__mainContent">
                    <a href="#link4" data-target="#popup4" data-type="04" aria-haspopup="dialog" aria-expanded="false" class="mainCarousel__mainContentLink mainCarousel__layerPopupOpen" title="입체주소 자세히보기" @click="openLayerPopup($event)" :class="{ active: activePopupIndex === '04'}">
                        <div class="mainCarousel__type">입체주소</div>
                        <p class="mainCarousel__text"><strong>#잠실역중앙통로</strong>의<br> 주소가 궁금하신가요?</p>
                        <div class="mainCarousel__imageBox type04">
                            <span class="blind">세종고가도로1 &gt; 205, 세종로 153, 세종지하도로 1 &gt; 231</span>
                        </div>
                        <div class="mainCarousel__subMore" @click.prevent="fnClickGuideBook(18)"><i aria-hidden="true" class="iconBackground"></i></div>
                    </a>
                </div>
                <ul class="mainCarousel__subContent">
                    <li class="type03">
                        <a href="#link5" data-target="#popup5" data-type="05" aria-haspopup="dialog" aria-expanded="false" class="mainCarousel__mainContentSubLink mainCarousel__layerPopupOpen" title="장소지능정보 자세히보기" @click="openLayerPopup($event)" :class="{ active: activePopupIndex === '05'}">
                            <div class="mainCarousel__subType">장소지능정보</div>
                            <p class="mainCarousel__subText"><strong>#건물 출입구</strong>의 장소 정보가 <span class="str">궁금하신가요?</span></p>
                            <div class="mainCarousel__imageBox type05"></div>
                            <div class="mainCarousel__subMore" @click.prevent="fnClickGuideBook(26)"><i aria-hidden="true" class="iconBackground"></i></div>
                        </a>
                    </li>
                    <li class="type04">
                        <a href="#link6" data-target="#popup6" data-type="06" aria-haspopup="dialog" aria-expanded="false" class="mainCarousel__mainContentSubLink mainCarousel__layerPopupOpen" title="수상시설물 자세히보기" @click="openLayerPopup($event)" :class="{ active: activePopupIndex === '06'}">
                            <div class="mainCarousel__subType">수상시설물</div>
                            <p class="mainCarousel__subText"><strong>#낚시터</strong>의 위치 주소가 <span class="str">궁금하신가요?</span></p>
                            <div class="mainCarousel__imageBox type06"></div>
                            <div class="mainCarousel__subMore" @click.prevent="fnClickGuideBook(27)"><i aria-hidden="true" class="iconBackground"></i></div>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="mainCarousel__layerPopup type04" 
                 role="dialog" 
                 aria-labelledby="popup-title-04" 
                 :style="{ display: activePopupIndex === '04' ? 'block' : 'none' }"
                 @click="handleOutsideClick">
                <div class="mainCarousel__layerPopupInner">
                    <dl class="mainCarousel__layerPopupHeader">
                        <dt>입체주소란?</dt>
                        <dd>고가도, 지하도,지하철역 내부통로 등의 <strong>입체도로</strong><span>*</span>와 건물 각 층의 통로 및 호수 등의<br><strong>내부도로<span>*</span>를 포함하여 구체적으로 위치</strong>를 명시하는 주소 체계</dd>
                    </dl>
                    <ul class="mainCarousel__layerPopupContent">
                        <li>
                            <div class="mainCarousel__layerPopupContentTitle"><span class="commonColor01">*</span>입체도로</div>
                            <ul class="mainCarousel__layerPopupContentText">
                                <li>* <strong class="str">고가도로</strong>: 공중에 설치된 도로 및 통로</li>
                                <li>* <strong class="str">지하도로</strong>: 지하에 설치된 도로 및 통로</li>
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
                    <a href="javascript:void(0);"  @click.prevent="fnClickGuideBook(18)" class="mainCarousel__layerPopupMore" title="입체주소 새창열기">자세히보기 <i aria-hidden="true" class="iconBackground"></i></a>

                    <button type="button" class="mainCarousel__closeButton" title="팝업 닫기" aria-label="Close" @click="closeLayerPopup">
                        <i aria-hidden="true" class="iconBackground"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                </div>
            </div>
            <div class="mainCarousel__layerPopup type05" 
                 role="dialog" 
                 aria-labelledby="popup-title-05" 
                 :style="{ display: activePopupIndex === '05' ? 'block' : 'none' }"
                 @click="handleOutsideClick">
                <div class="mainCarousel__layerPopupInner">
                    <dl class="mainCarousel__layerPopupHeader">
                        <dt>장소지능정보란?</dt>
                        <dd>장소와 관련된 다양한 데이터를 수집하고 분석하여 유용한 정보</dd>
                    </dl>
                    <ul class="mainCarousel__tagBox">
                        <li class="type01">
                            <div class="mainCarousel__tag"><div class="mainCarousel__tagbg type05">#다양한 출입구</div></div>
                            <div class="mainCarousel__tag">
                                <div class="mainCarousel__tagbg type07">#주차장 출입구</div>
                            </div>
                        </li>
                        <li class="type02">
                            <div class="mainCarousel__tag"><div class="mainCarousel__tagbg type06">#별칭정보</div></div>
                            <div class="mainCarousel__tagText">등의 장소 데이타를 수집하여 정확한 위치정보를 제공</div>
                        </li>
                    </ul>
                    <a href="javascript:void(0);"  @click.prevent="fnClickGuideBook(26)" class="mainCarousel__layerPopupMore" title="장소지능정보 새창열기">자세히보기 <i aria-hidden="true" class="iconBackground"></i></a>

                    <button type="button" class="mainCarousel__closeButton" title="팝업 닫기" aria-label="Close" @click="closeLayerPopup">
                        <i aria-hidden="true" class="iconBackground"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                </div>
            </div>
            <div class="mainCarousel__layerPopup type06" 
                 role="dialog" 
                 aria-labelledby="popup-title-06" 
                 :style="{ display: activePopupIndex === '06' ? 'block' : 'none' }"
                 @click="handleOutsideClick">
                <div class="mainCarousel__layerPopupInner">
                    <dl class="mainCarousel__layerPopupHeader">
                        <dt>수상시설물이란?</dt>
                        <dd>항 포구 해안가 인근 각종 수상 시설물에도 도로명 주소 부여</dd>
                    </dl>
                    <ul class="mainCarousel__tagBox">
                        <li class="type01">
                            <div class="mainCarousel__tag"><div class="mainCarousel__tagbg type08">#양식장</div></div>
                            <div class="mainCarousel__tag"><div class="mainCarousel__tagbg type09">#해상팬션</div></div>
                        </li>
                        <li class="type02">
                            <div class="mainCarousel__tag">
                                <div class="mainCarousel__tagbg type10">#해상낚시터</div>
                            </div>
                            <div class="mainCarousel__tagText">등의 수상 시설물에 주소를 부여</div>
                        </li>
                    </ul>
                    <a href="javascript:void(0);"  @click.prevent="fnClickGuideBook(27)" class="mainCarousel__layerPopupMore" title="수상시설물 새창열기">자세히보기 <i aria-hidden="true" class="iconBackground"></i></a>

                    <button type="button" class="mainCarousel__closeButton" title="팝업 닫기" aria-label="Close" @click="closeLayerPopup">
                        <i aria-hidden="true" class="iconBackground"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                </div>
            </div>
        </SwiperSlide>
      </Swiper>
      <div class="swiper__function">
            <!-- 페이지네이션 -->
            <div class="swiper__pagination swiper__paginationVisual"></div>
            <!-- 네비게이터 -->
            <button type="button" title="이전보기" class="swiper__prev swiper__prevVisual">
                <span class="blind">이전</span>
            </button>
            <div class="swiper__controls">
                <button title="자동재생 실행" @click="toggleAutoPlay('play')" class="swiper__play swiper__playVisual" id="playVisual" style="display: none;">
                    <span class="blind">Play</span>
                </button>
                <button title="자동재생 정지" @click="toggleAutoPlay('stop')" class="swiper__stop swiper__stopVisual" id="stopVisual" style="display: inline-block;">
                    <span class="blind">Stop</span>
                </button>
            </div>
            <button type="button" title="다음보기" class="swiper__next swiper__nextVisual">
                <span class="blind">다음</span>
            </button>
        </div>
    </div>

</template>
