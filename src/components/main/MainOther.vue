<script setup>
    import { onMounted, ref, onBeforeUnmount, computed ,watch, nextTick } from "vue";

    const isPopupVisible = ref(false);
    const lastClickedLink = ref(null);
    const activeIndex = ref(null);

    // 외부 영역 클릭 이벤트 핸들러
    const handleClickOutside = (event) => {
        if (activeIndex.value !== null) {
            const popup = document.querySelector(`.mainOther__list li:nth-child(${activeIndex.value + 1}) .mainOther__layerPopup`);
            const button = document.querySelector(`.mainOther__list li:nth-child(${activeIndex.value + 1}) .mainOther__link`);
            
            // 팝업과 버튼 영역이 아닌 곳을 클릭했을 때
            if (popup && !popup.contains(event.target) && !button.contains(event.target)) {
                const li = popup.closest('li');
                if (li) {
                    li.classList.remove('active');
                    popup.classList.remove('active');
                    button.setAttribute('title', '레이어팝업 열기');
                }
                isPopupVisible.value = false;
                activeIndex.value = null;
                
                if (lastClickedLink.value) {
                    lastClickedLink.value.focus();
                    lastClickedLink.value = null;
                }
            }
        }
    };

    // 컴포넌트 마운트 시 이벤트 리스너 등록
    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    const togglePopup = async (event, index) => {
        const clickedLi = event.currentTarget.closest('li');
        const popup = clickedLi.querySelector('.mainOther__layerPopup');
        const button = event.currentTarget;
        
        // 이미 활성화된 팝업이 있다면 닫기
        if (activeIndex.value !== null) {
            const prevLi = document.querySelector(`.mainOther__list li:nth-child(${activeIndex.value + 1})`);
            if (prevLi) {
                prevLi.classList.remove('active');
                const prevPopup = prevLi.querySelector('.mainOther__layerPopup');
                const prevButton = prevLi.querySelector('.mainOther__link');
                if (prevPopup) {
                    prevPopup.classList.remove('active');
                }
                if (prevButton) {
                    prevButton.setAttribute('title', '레이어팝업 열기');
                }
            }
        }

        // 같은 버튼을 클릭한 경우 팝업 닫기
        if (activeIndex.value === index) {
            activeIndex.value = null;
            isPopupVisible.value = false;
            if (popup) {
                popup.classList.remove('active');
            }
            button.setAttribute('title', '레이어팝업 열기');
            return;
        }

        // 새로운 팝업 열기
        lastClickedLink.value = event.currentTarget;
        isPopupVisible.value = true;
        activeIndex.value = index;
        clickedLi.classList.add('active');
        if (popup) {
            popup.classList.add('active');
        }
        button.setAttribute('title', '레이어팝업 닫기');
        
        // 팝업이 열린 후 closeButton에 포커스
        await nextTick();
        const closeButton = clickedLi.querySelector('.mainOther__closeButton');
        if (closeButton) {
            closeButton.focus();
        }
    };

    const closePopup = (event) => {
        const clickedLi = event.currentTarget.closest('li');
        if (clickedLi) {
            clickedLi.classList.remove('active');
            const popup = clickedLi.querySelector('.mainOther__layerPopup');
            const button = clickedLi.querySelector('.mainOther__link');
            if (popup) {
                popup.classList.remove('active');
            }
            if (button) {
                button.setAttribute('title', '레이어팝업 열기');
            }
        }
        isPopupVisible.value = false;
        activeIndex.value = null;
        
        // 팝업이 닫힐 때 이전에 클릭했던 버튼으로 포커스 이동
        if (lastClickedLink.value) {
            lastClickedLink.value.focus();
        }
    };
</script>

<template>

<p class="main__title other__header aos-item aos-init aos-animate" data-aos="fade-right">
    <i aria-hidden="true" class="coordinateIcon"></i>
    주소정보 국민 편의에 한발 더 가까이
</p>

<div class="mainOther aos-item aos-init aos-animate" data-aos="zoom-in-up">
    <ul class="mainOther__list">
        <li class="">
            <button type="button" title="레이어팝업 열기" class="mainOther__link type01" @click="togglePopup($event, 0)">
                <span class="mainOther__linkInner">도로명주소</span>
            </button>
            <div class="mainOther__layerPopup type01" v-show="activeIndex === 0">
                <div class="mainOther__layerPopupInner">
                    <button class="mainOther__closeButton" type="button" title="팝업 닫기" @click="closePopup($event)">
                        <i aria-hidden="true" class="bi bi-x"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                    <dl class="mainOther__layerPopupHeader">
                        <dt>도로명주소란?</dt>
                        <dd>도로명<span class="commonColor01">*</span> + 건물번호로 이루어져있습니다.</dd>
                    </dl>
                    <div class="mainOther__layerPopupContent02">
                        <div class="mainOther__layerPopupContentTitle02"><span class="commonColor01">*</span>도로명</div>
                        <p class="mainOther__layerPopupContentText02">도로구간마다 부여한 이름으로<br>명사+도로별 구분기준(대로/로/길)으로 구성</p>
                    </div>
                    <a href="#" class="mainOther__layerPopupMore type01">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </li>
        <li class="">
            <button type="button" title="레이어팝업 열기" class="mainOther__link type02" @click="togglePopup($event, 1)">
                <span class="mainOther__linkInner">건물번호</span>
            </button>
            <div class="mainOther__layerPopup type02" v-show="activeIndex === 1">
                <div class="mainOther__layerPopupInner">
                    <button class="mainOther__closeButton" type="button" title="팝업 닫기" @click="closePopup($event)">
                        <i aria-hidden="true" class="bi bi-x"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                    <dl class="mainOther__layerPopupHeader">
                        <dt>건물번호란?</dt>
                        <dd class="type04">건물의 위치를 식별하기 위해 부여된 숫자나 문자입니다.</dd>
                    </dl>
                    <p class="mainOther__subText02">건물번호는 도로 시작지점에서 20m간격으로 부여합니다.<br>건물번호표기는 <span class="commonColor01">도로구간의 왼쪽에 홀수</span>, <span class="commonColor01">오른쪽에 짝수</span>를 부여합니다.</p>
                    <a href="#" class="mainOther__layerPopupMore type01">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </li>
        <li class="">
            <button type="button" title="레이어팝업 열기" class="mainOther__link type03" @click="togglePopup($event, 2)">
                <span class="mainOther__linkInner">상세주소</span>
            </button>
            <div class="mainOther__layerPopup type03" v-show="activeIndex === 2">
                <div class="mainOther__layerPopupInner">
                    <button class="mainOther__closeButton" type="button" title="팝업 닫기" @click="closePopup($event)">
                        <i aria-hidden="true" class="bi bi-x"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                    <dl class="mainOther__layerPopupHeader">
                        <dt>상세주소란?</dt>
                        <dd class="type02">상세주소는 도로명주소의 <span class="commonColor01">건물번호 뒤에 표시되는 동·층·호<br>정보</span>입니다.</dd>
                    </dl>
                    <a href="#" class="mainOther__layerPopupMore type02">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </li>
        <li class="">
            <button type="button" title="레이어팝업 열기" class="mainOther__link type04" @click="togglePopup($event, 3)">
                <span class="mainOther__linkInner">주소정보시설</span>
            </button>
            <div class="mainOther__layerPopup type04" v-show="activeIndex === 3">
                <div class="mainOther__layerPopupInner">
                    <button class="mainOther__closeButton" type="button" title="팝업 닫기" @click="closePopup($event)">
                        <i aria-hidden="true" class="bi bi-x"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                    <dl class="mainOther__layerPopupHeader">
                        <dt>주소정보시설을 확인해보세요</dt>
                        <dd class="type03">
                            <strong>알고 계셨나요?</strong>
                            <ol class="mainOther__addressTipList">
                                <li>강남대로의 길이는 <span class="commonColor01">6.99Km</span> = 699(기초번호)x10m(기초간격)입니다.</li>
                                <li>중앙로는 <span class="commonColor01">짝수길</span>입니다. 맞은 편에는 홀수길이 있습니다.</li>
                                <li><span class="commonColor01">앞쪽방향</span>으로 사임당로가 이어집니다.</li>
                            </ol>
                        </dd>
                    </dl>
                </div>
            </div>
        </li>
        <li class="">
            <button type="button" title="레이어팝업 열기" class="mainOther__link type05" @click="togglePopup($event, 4)">
                <span class="mainOther__linkInner">국가지점번호</span>
            </button>
            <div class="mainOther__layerPopup type05" v-show="activeIndex === 4">
                <div class="mainOther__layerPopupInner">
                    <button class="mainOther__closeButton" type="button" title="팝업 닫기" @click="closePopup($event)">
                        <i aria-hidden="true" class="bi bi-x"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                    <dl class="mainOther__layerPopupHeader">
                        <dt>국가지점번호란?</dt>
                        <dd class="type02">국토와 해양을 격자형으로 구획한 지점마다 부여한 번호입니다.</dd>
                    </dl>
                    <p class="mainOther__subText"><span class="commonColor01">산악·해안 등에서 긴급상황 발생 시 구조·구급활동의 위치 표시로 활용</span>하는<span class="type01">국민 안정망입니다.</span></p>
                    <a href="#" class="mainOther__layerPopupMore type01">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </li>
        <li class="">
            <button type="button" title="레이어팝업 열기" class="mainOther__link type06" @click="togglePopup($event, 5)">
                <span class="mainOther__linkInner">국가기초구역</span>
            </button>
            <div class="mainOther__layerPopup type06" v-show="activeIndex === 5">
                <div class="mainOther__layerPopupInner">
                    <button class="mainOther__closeButton" type="button" title="팝업 닫기" @click="closePopup($event)">
                        <i aria-hidden="true" class="bi bi-x"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                    <dl class="mainOther__layerPopupHeader">
                        <dt>국가기초구역이란?</dt>
                        <dd class="type02">각종 관할구역 (통계, 우편, 소방, 경찰 등)을 관리하기 위해 나눈 단위 구역입니다.</dd>
                    </dl>
                    <p class="mainOther__subText">국가기초구역번호는<span class="commonColor01">우편번호</span>로 사용됩니다.</p>
                    <a href="#" class="mainOther__layerPopupMore type01">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </li>
        <li class="">
            <button type="button" title="레이어팝업 열기" class="mainOther__link type07" @click="togglePopup($event, 6)">
                <span class="mainOther__linkInner">입체주소</span>
            </button>
            <div class="mainOther__layerPopup type07" v-show="activeIndex === 6">
                <div class="mainOther__layerPopupInner">
                    <button class="mainOther__closeButton" type="button" title="팝업 닫기" @click="closePopup($event)">
                        <i aria-hidden="true" class="bi bi-x"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                    <dl class="mainOther__layerPopupHeader">
                        <dt>입체주소란?</dt>
                        <dd class="type01">
                            고가도, 지하도,지하철역 내부통로 등의
                            <strong>입체도로</strong>
                            <span class="commonColor01">*</span>와 
                            <div>
                                건물 각 층의 통로 및 호수 등의
                                <strong>내부도로<span class="commonColor01">*</span>를 포함하여 구체적으로 위치</strong>를 명시하는 주소 체계
                            </div>
                        </dd>
                    </dl>
                    <ul class="mainOther__layerPopupContent">
                        <li>
                            <div class="mainOther__layerPopupContentTitle"><span class="commonColor01">*</span>입체도로</div>
                            <ul class="mainOther__layerPopupContentText">
                                <li>* <strong class="str">고가도로</strong>: 공중에 설치된 도로 및 통로</li>
                                <li>* <strong class="str">지하도로</strong>: 지하에 설치된 도로 및 통로</li>
                            </ul>
                        </li>
                        <li>
                            <div class="mainOther__layerPopupContentTitle"><span>*</span>내부도로</div>
                            <ul class="mainOther__layerPopupContentText">
                                <li>* 건물의 내부에 설치된 도로 및 통로</li>
                                <li>* 건물이 아닌 구조물의 내부에 설치된 도로 및 통로</li>
                            </ul>
                        </li>
                    </ul>
                    <a href="#" class="mainOther__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </li>
        <li class="">
            <button type="button" title="레이어팝업 열기" class="mainOther__link type08" @click="togglePopup($event, 7)">
                <span class="mainOther__linkInner">사물주소</span>
            </button>
            <div class="mainOther__layerPopup type08" v-show="activeIndex === 7">
                <div class="mainOther__layerPopupInner">
                    <button class="mainOther__closeButton" type="button" title="팝업 닫기" @click="closePopup($event)">
                        <i aria-hidden="true" class="bi bi-x"></i>
                        <span class="blind">팝업닫기</span>
                    </button>
                    <dl class="mainOther__layerPopupHeader">
                        <dt>사물주소란?</dt>
                        <dd>건물이 아닌 시설물 등에 <strong>사물의 위치를 특정하기 위해</strong> 도로명과 기초번호를 활용하여 부여된 주소</dd>
                    </dl>
                    <ul class="mainOther__tagBox">
                        <li><span class="mainOther__tag type01">#버스정류장</span></li>
                        <li><span class="mainOther__tag type02">#공원</span></li>
                        <li><span class="mainOther__tag type03">#주차장</span></li>
                        <li><span class="mainOther__tag type04">#우체통</span></li>
                    </ul>
                    <div class="mainOther__text">등의 시설물에 주소를 부여</div>
                    <a href="#" class="mainOther__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </li>
    </ul>
</div>

</template>

<style lang="scss" scoped>
.mainOther__layerPopup {
    display: none;
    &[v-show] {
        display: block;
    }
    
    &.active {
        // 레이어 팝업이 active 상태일 때의 스타일 추가
        animation: fadeIn 0.3s ease-in-out;
    }
}

</style>



<style lang="scss" scoped>
.mainOther__layerPopup {
  display: none;
  &[v-show] {
    display: block;
  }

  &.active {
    animation: fadeIn 0.3s ease-in-out;
  }
}
/* 주소정보 국민 편의에 한발 더 가까이 */
.mainOther {position: relative;margin-top: 0;background: url("@images/main/img-pattern.png") no-repeat right 67px top 0;z-index: 1;}
.mainOther__header {height: 61px;padding-left: 84px;background: url("@images/main/ic-notice.png") no-repeat 0 0;color: #000 !important;}
.mainOther__list {display: flex;align-items: center;flex-wrap: wrap;margin-top: 22px;padding-bottom:40px;gap: 25px;}
.mainOther__list > li {width: 25%;max-width: 328px;border-radius: 30px;}
.mainOther__list > li .mainOther__layerPopup.active {display: block !important;}
.mainOther__link {display: block;width: 100%;height: 177px;border-radius: 30px;background: #fff;}
.mainOther__link.type01 .mainOther__linkInner {background: url("@images/main/ic-road-name.png") no-repeat 31px 28px /130px;}
.mainOther__link.type02 .mainOther__linkInner {background: url("@images/main/ic-building-num.png") no-repeat 31px 28px /130px;}
.mainOther__link.type03 .mainOther__linkInner {background: url("@images/main/ic-detail-addr.png") no-repeat 31px 28px /130px;}
.mainOther__link.type04 .mainOther__linkInner {background: url("@images/main/ic-facilities.png") no-repeat 31px 28px /130px;}
.mainOther__link.type05 .mainOther__linkInner {background: url("@images/main/ic-country-num.png") no-repeat 31px 28px /130px;}
.mainOther__link.type06 .mainOther__linkInner {background: url("@images/main/ic-country-area.png") no-repeat 31px 28px /130px;}
.mainOther__link.type07 .mainOther__linkInner {background: url("@images/main/ic-solid-addr.png") no-repeat 31px 28px /130px;}
.mainOther__link.type08 .mainOther__linkInner {background: url("@images/main/ic-object-addr.png") no-repeat 31px 28px /130px;}
.mainOther__list li.active .mainOther__link {background: linear-gradient(to top, #2b6ae5, #5a5de8);}
.mainOther__link.active, .mainOther__link:hover {transform: scale(0.9);transition: transform 1s;background: linear-gradient(to top, #2b6ae5, #5a5de8);}
.mainOther__list li.active .mainOther__link .mainOther__linkInner,
.mainOther__link.active .mainOther__linkInner,
.mainOther__linkInner,
.mainOther__link:hover .mainOther__linkInner {color: #fff;}
.mainOther__linkInner {display: flex;align-items: center;width: 100%;height: 100%;padding-left: 172px;color: #111;font-size: 22px;}
.mainOther__layerPopup {display: none;position: absolute;align-items: flex-start;flex-direction: column;width: 100%;max-width: 950px;height: 330px;border-radius: 30px;border: 4px solid transparent;background-origin: border-box;background-clip: content-box, border-box;background-image: linear-gradient(#fff, #fff), linear-gradient(to top, #2b6ae5 0%, #5a5de8 100%);box-shadow: 0 15px 24px 0 rgba(0, 0, 0, 0.01);z-index: 10;}
.mainOther__layerPopup::after {content: "";position: absolute;right: 200px;top: -18px;display: block;width: 0;height: 0;border-left: 7px solid transparent;border-right: 7px solid transparent;border-bottom: 14px solid #2b6ae5;}
.mainOther__layerPopup.type01 {top: 192px;left: 0;}
.mainOther__layerPopup.type01::after {left: 148px;top: -17px;}
.mainOther__layerPopup.type01 .mainOther__layerPopupInner {background: url("@images/main/img-roadinfo-01.png") no-repeat right bottom / 428px;}
.mainOther__layerPopup.type02 {top: 192px;left: 0;}
.mainOther__layerPopup.type02::after {left: 504px;top: -17px;}
.mainOther__layerPopup.type02 .mainOther__layerPopupInner {background: url("@images/main/img-roadinfo-02.png") no-repeat right bottom/ 406px;}
.mainOther__layerPopup.type03 {top: 192px;right: 0;}
.mainOther__layerPopup.type03::after {right: 524px;top: -17px;}
.mainOther__layerPopup.type03 .mainOther__layerPopupInner {background: url("@images/main/img-roadinfo-03.png") no-repeat right bottom/ 406px;}
.mainOther__layerPopup.type04 {top: 192px;right: 0;}
.mainOther__layerPopup.type04::after {right: 160px;top: -17px;}
.mainOther__layerPopup.type04 .mainOther__layerPopupInner {background: url("@images/main/img-roadinfo-04.png") no-repeat right bottom/ 406px;}
.mainOther__layerPopup.type05 {bottom: 232px;left: 0;}
.mainOther__layerPopup.type05::after {left: 148px;top:auto;bottom:-17px;border-top: 14px solid #2b6ae5;border-bottom:none;}
.mainOther__layerPopup.type05 .mainOther__layerPopupInner {background: url("@images/main/img-roadinfo-05.png") no-repeat right bottom/ 406px;}
.mainOther__layerPopup.type06 {bottom: 232px;left: 0;}
.mainOther__layerPopup.type06::after {left: 504px;top:auto;bottom:-17px;border-top: 14px solid #2b6ae5;border-bottom:none;}
.mainOther__layerPopup.type06 .mainOther__layerPopupInner {background: url("@images/main/img-roadinfo-06.png") no-repeat right bottom / 360px;}
.mainOther__layerPopup.type07 {height: 390px;bottom: 232px;right: 0;}
.mainOther__layerPopup.type07::after {right: 524px;top:auto;bottom:-17px;border-top: 14px solid #2b6ae5;border-bottom:none;}
.mainOther__layerPopup.type07 .mainOther__layerPopupInner {background: url("@images/main/img-roadinfo-07.png") no-repeat right bottom /430px;}
.mainOther__layerPopup.type08 {bottom: 232px;right: 0;}
.mainOther__layerPopup.type08::after {right: 160px;top:auto;bottom:-17px;border-top: 14px solid #2b6ae5;border-bottom:none;}
.mainOther__layerPopup.type08 .mainOther__layerPopupInner {background: url("@images/main/img-roadinfo-08.png") no-repeat right bottom /406px;}
.mainOther__layerPopupInner {position: relative;width: 100%;height: 100%;padding: 46px;}
.mainOther__layerPopupHeader dt {color: #111;font-size: 26px;font-weight: bold;}
.mainOther__layerPopupHeader dd {margin-top: 22px;color: #111;font-size: 16px;line-height: 1.56;}
.mainOther__layerPopupHeader dd.type01 {margin-top: 19px;font-size: 15px;}
.mainOther__layerPopupHeader dd.type02 {margin-top: 27px;font-size: 18px;}
.mainOther__layerPopupHeader dd.type03 {margin-top: 25px;font-size: 16px;font-weight: 500;}
.mainOther__layerPopupHeader dd.type04 {margin-top: 27px;font-size: 18px;}
.mainOther__addressTipList {width: 100%;margin-top: 20px;}
.mainOther__addressTipList li {font-size: 15px;line-height: 1.53;}
.mainOther__subText {margin-top: 27px;font-size: 15px;}
.mainOther__subText .type01 {display: block;}
.mainOther__subText02 {margin-top: 33px;font-size: 15px;line-height: 1.53;}
.mainOther__layerPopupContent {display: flex;flex-direction: column;margin-top: 23px;gap: 15px;}
.mainOther__layerPopupContent > li {display: flex;width: 100%;gap: 16px;}
.mainOther__layerPopupContent02 {display: flex;margin-top: 35px;gap: 16px;}
.mainOther__layerPopupContentTitle {display: inline-flex;align-items: center;justify-content: center;min-width: 100px;height: 40px;border-radius: 20px;background-image: linear-gradient(to top, rgba(43, 106, 229, 0.1019607843), rgba(90, 93, 232, 0.1019607843));color: #222;font-size: 14px;}
.mainOther__layerPopupContentTitle02 {display: inline-flex;align-items: center;justify-content: center;min-width: 100px;height: 46px;border-radius: 25px;background-image: linear-gradient(to top, rgba(43, 106, 229, 0.1019607843), rgba(90, 93, 232, 0.1019607843));color: #222;font-size: 16px;}
.mainOther__layerPopupContentText {display: flex;flex-direction: column;color: #555;font-size: 13px;gap: 5px;}
.mainOther__layerPopupContentText li {display: flex;width: 100%;}
.mainOther__layerPopupContentText .str {color: #111;font-weight: 500;}
.mainOther__layerPopupContentText02 {display: flex;flex-direction: column;color: #555;font-size: 15px;line-height: 1.53;gap: 5px;}
.mainOther__tagBox {display: flex;margin-top: 17px;gap: 8px;}
.mainOther__tagBox li {display: inline-flex;align-items: center;width: auto;height: 42px;border-radius: 21px;background-image: linear-gradient(to top, rgba(43, 106, 229, 0.1019607843), rgba(90, 93, 232, 0.1019607843));}
.mainOther__tag {display: block;display: inline-flex;align-items: center;height: 100%;color: #222;font-size: 14px;padding: 0 49px 0 18px;}
.mainOther__tag.type01 {background: url("@images/main/ic-tag-1-1.png") no-repeat right 12px top 50%;}
.mainOther__tag.type02 {background: url("@images/main/ic-tag-1-2.png") no-repeat right 12px top 50%;}
.mainOther__tag.type03 {background: url("@images/main/ic-tag-1-3.png") no-repeat right 12px top 50%;}
.mainOther__tag.type04 {background: url("@images/main/ic-tag-1-4.png") no-repeat right 12px top 50%;}
.mainOther__text {margin-top: 10px;color: #555;font-size: 15px;}
.mainOther__layerPopupMore {display: flex;align-items: center;margin-top: 17px;gap: 13px;color: #111;font-size: 16px;}
.mainOther__layerPopupMore i {display: flex;align-items: center;justify-content: center;width: 46px;height: 46px;border-radius: 50%;background: #111;color: #fff;font-size: 18px;}
.mainOther__closeButton {display: flex;align-items: center;justify-content: center;position: absolute;top: 26px;right: 26px;width:36px;height: 36px;border-radius: 50%;background: #111;z-index: 10;}
.mainOther__closeButton i{width: auto;height: auto;color:#fff;font-size:18px;}

@media (max-width: 1755px) {
  .mainOther {background-position:  right 50% top 0;}
  .mainOther__list {display: flex;align-items: center;flex-wrap: wrap;width: 100%;margin-top: 32px;padding:0;gap: 18px;}
  .mainOther__list > li {width: calc(50% - 10px);max-width: calc(50% - 5px);border-radius: 30px;}
  .mainOther__link {display: block;height: 180px;border-radius: 20px;background: #fff;}
  .mainOther__linkInner {padding-left: 170px;font-size: 22px;}
  .mainOther__layerPopup.type01 {top: 194px;left: 0;}
  .mainOther__layerPopup.type01::after {left: 198px;top: -17px;}
  .mainOther__layerPopup.type02 {top: 194px;left: auto;right: 0;}
  .mainOther__layerPopup.type02::after {left: auto;right: 198px;top: -17px;}
  .mainOther__layerPopup.type03 {top: 391px;left: 0;}
  .mainOther__layerPopup.type03::after {left: 198px;top: -17px;}
  .mainOther__layerPopup.type04 {top: 391px;right: 0;}
  .mainOther__layerPopup.type04::after {right: 198px;top: -17px;}
  .mainOther__layerPopup.type05 {bottom: -176px;left: 0;}
  .mainOther__layerPopup.type05::after {left: 198px;top: -17px;border-top: none;border-bottom: 14px solid #2b6ae5;}
  .mainOther__layerPopup.type06 {bottom: -176px;left: auto;right: 0;}
  .mainOther__layerPopup.type06::after {left: auto;right: 198px;top: -17px;border-top: none;border-bottom: 14px solid #2b6ae5;}
  .mainOther__layerPopup.type07 {height: 390px;bottom: 194px;right: auto;left: 0;}
  .mainOther__layerPopup.type07::after {left: 198px;top:auto;bottom: -17px;}
  .mainOther__layerPopup.type08 {bottom: 194px;right: 0;}
  .mainOther__layerPopup.type08::after {left: auto;right: 198px;top:auto;bottom: -17px;}
  .mainOther__layerPopup.type08 .mainOther__layerPopupInner {background-size: 450px;}
  .mainOther__layerPopupInner {padding: 50px;}
  .mainOther__layerPopupHeader dt {font-size: 26px;}
  .mainOther__layerPopupHeader dd {margin-top: 22px;font-size: 16px;line-height: 1.56;}
  .mainOther__layerPopupHeader dd.type01 {margin-top: 19px;font-size: 15px;}
  .mainOther__layerPopupHeader dd.type02 {margin-top: 27px;padding-right:400px;font-size: 18px;}
  .mainOther__layerPopupHeader dd.type03 {margin-top: 25px;font-size: 16px;}
  .mainOther__layerPopupHeader dd.type04 {margin-top: 27px;font-size: 18px;}
  .mainOther__addressTipList {width: 100%;margin-top: 18px;}
  .mainOther__addressTipList li {font-size: 15px;line-height: 1.53;}
  .mainOther__subText {margin-top: 27px;font-size: 15px;}
  .mainOther__subText02 {margin-top: 33px;font-size: 15px;line-height: 1.43;}
  .mainOther__layerPopupContentTitle {min-width: 100px;height: 40px;border-radius: 20px;font-size: 14px;}
  .mainOther__layerPopupContentTitle02 {min-width: 110px;height: 50px;font-size: 16px;}
  .mainOther__layerPopupContentText {font-size: 13px;}
  .mainOther__layerPopupContentText02 {font-size: 15px;line-height: 1.43;gap: 5px;}
  .mainOther__tagBox {margin-top: 17px;}
  .mainOther__tagBox li {height: 36px;border-radius: 21px;}
  .mainOther__tag {font-size: 13px;padding: 0 40px 0 18px;}
  .mainOther__tag.type01 {background-size: 20px;}
  .mainOther__tag.type02 {background-size: 20px;}
  .mainOther__tag.type03 {background-size: 22px;}
  .mainOther__tag.type04 {background-size: 22px;}
  .mainOther__layerPopupMore {margin-top: 19px;gap: 13px;font-size: 16px;}
  .mainOther__layerPopupMore i {width: 50px;height: 50px;font-size: 18px;}
  .mainOther__closeButton {position: absolute;top: 30px;right: 30px;}
  .mainOther__closeButton i {color: #fff;font-size: 18px;}
}

@media (max-width: 1023px) {
  .mainOther {margin-top: 13px;background: none;}
  .mainOther__list {margin-top: 24px;gap: 10px;}
  .mainOther__list > li {width: calc(50% - 5px);max-width: calc(50% - 5px);border-radius: 10px;}
  .mainOther__link {height: 68px;border-radius: 10px;}
  .mainOther__link.type01 .mainOther__linkInner {background-position: 12px 50%;background-size: 43px;}
  .mainOther__link.type02 .mainOther__linkInner {background-position: 12px 50%;background-size:43px;}
  .mainOther__link.type03 .mainOther__linkInner {background-position: 12px 50%;background-size:43px;}
  .mainOther__link.type04 .mainOther__linkInner {background-position: 12px 50%;background-size:43px;}
  .mainOther__link.type05 .mainOther__linkInner {background-position: 12px 50%;background-size:43px;}
  .mainOther__link.type06 .mainOther__linkInner {background-position: 12px 50%;background-size:43px;}
  .mainOther__link.type07 .mainOther__linkInner {background-position: 12px 50%;background-size:43px;}
  .mainOther__link.type08 .mainOther__linkInner {background-position: 12px 50%;background-size:43px;}
  .mainOther__linkInner {padding-left: 65px;font-size: 16px;}
  .mainOther__layerPopup {height: 230px;border-radius: 10px;}
  .mainOther__layerPopup::after {display: none;}
  .mainOther__layerPopup.type01 {top: 77px;left: 0;}
  .mainOther__layerPopup.type01::after {left: 198px;top: -18px;}
  .mainOther__layerPopup.type01 .mainOther__layerPopupInner {background-size: 300px;}
  .mainOther__layerPopup.type02 {top: 77px;left: auto;right: 0;}
  .mainOther__layerPopup.type02 .mainOther__layerPopupInner {background-size: 300px;}
  .mainOther__layerPopup.type03 {top: 155px;left: 0;}
  .mainOther__layerPopup.type03 .mainOther__layerPopupInner {background-size: 300px;}
  .mainOther__layerPopup.type04 {top: 155px;right: 0;}
  .mainOther__layerPopup.type04 .mainOther__layerPopupInner {background-size: 300px;}
  .mainOther__layerPopup.type05 {top: 230px;bottom: auto;left: 0;}
  .mainOther__layerPopup.type05 .mainOther__layerPopupInner {background-size: 300px;}
  .mainOther__layerPopup.type06 {top: 230px;bottom: auto;left: auto;right: 0;}
  .mainOther__layerPopup.type06 .mainOther__layerPopupInner {background-size: 300px;}
  .mainOther__layerPopup.type07 {height: 290px;top: 310px;bottom: auto;right: auto;left: 0;}
  .mainOther__layerPopup.type07 .mainOther__layerPopupInner {background-size: 300px;}
  .mainOther__layerPopup.type08 {bottom: -238px;right: 0;}
  .mainOther__layerPopup.type08::after {left: auto;right: 198px;top: -18px;}
  .mainOther__layerPopup.type08 .mainOther__layerPopupInner {background-size: 300px;}
  .mainOther__layerPopupInner {padding: 18px;}
  .mainOther__layerPopupHeader dt {font-size: 16px;}
  .mainOther__layerPopupHeader dd {margin-top: 6px;font-size: 13px;line-height: 1.46;}
  .mainOther__layerPopupHeader dd.type01 {margin-top: 10px;font-size: 14px;}
  .mainOther__layerPopupHeader dd.type02 {margin-top: 10px;font-size: 14px;}
  .mainOther__layerPopupHeader dd.type03 {margin-top: 10px;font-size: 14px;}
  .mainOther__layerPopupHeader dd.type04 {margin-top: 10px;font-size: 14px;}
  .mainOther__addressTipList {margin-top: 10px;}
  .mainOther__addressTipList li {font-size: 14px;line-height: 1.43;}
  .mainOther__subText {margin-top: 13px;font-size: 12px;}
  .mainOther__subText02 {margin-top: 13px;font-size: 12px;line-height: 1.43;}
  .mainOther__layerPopupContent {margin-top: 20px;gap: 10px;}
  .mainOther__layerPopupContent > li {gap: 10px;}
  .mainOther__layerPopupContent02 {margin-top: 15px;gap: 10px;}
  .mainOther__layerPopupContentTitle {min-width: 90px;height: 24px;border-radius: 10px;font-size: 14px;}
  .mainOther__layerPopupContentTitle02 {min-width: 70px;height: 24px;border-radius: 15px;font-size: 14px;}
  .mainOther__layerPopupContentText {font-size: 14px;gap: 5px;}
  .mainOther__layerPopupContentText02 {font-size: 14px;line-height: 1.43;gap: 5px;}
  .mainOther__tagBox {margin-top: 4px;gap: 8px;}
  .mainOther__tagBox li {height: 28px;border-radius: 10px;}
  .mainOther__tag {height: 20px;color: #222;font-size: 14px;padding: 0 40px 0 10px;}
  .mainOther__tag.type01 {background-position: right 10px top 50%;background-size:20px;}
  .mainOther__tag.type02 {background-position: right 10px top 50%;background-size:20px;}
  .mainOther__tag.type03 {background-position: right 10px top 50%;background-size:20px;}
  .mainOther__text {font-size:14px;}
  .mainOther__layerPopupMore {position: absolute;bottom: 18px;left: 18px;margin-top: 0;gap: 11px;font-size: 18px;}
  .mainOther__layerPopupMore i {width: 30px;height: 30px;font-size: 18px;}
  .mainOther__closeButton {top: 15px;right: 15px;width: 24px;height: 24px;}
  .mainOther__closeButton i {width: 24px;height: 24px;font-size: 18px;}
}

@media (max-width: 800px) {
  .mainOther__layerPopup.type01 .mainOther__layerPopupInner {background-size: 280px;}
  .mainOther__layerPopup.type02 .mainOther__layerPopupInner {background-size: 280px;}
  .mainOther__layerPopup.type03 .mainOther__layerPopupInner {background-size: 280px;}
  .mainOther__layerPopup.type04 .mainOther__layerPopupInner {background-size: 280px;}
  .mainOther__layerPopup.type05 .mainOther__layerPopupInner {background-size: 280px;}
  .mainOther__layerPopup.type06 .mainOther__layerPopupInner {background-size: 280px;}
  .mainOther__layerPopup.type07 .mainOther__layerPopupInner {background-size: 258px;}
  .mainOther__layerPopup.type08 .mainOther__layerPopupInner {background-size: 280px;}
  .mainOther__addressTipList li {padding-right:270px;}
  .mainOther__layerPopupHeader dd.type02 {padding-right:270px;}
  .mainOther__subText {padding-right:270px;}
  .mainOther__subText .type01 {display:inline-block;}
  .mainOther__subText02 {padding-right:270px;}
  .mainOther__layerPopupContent {display: flex;flex-direction: column;margin-top: 20px;gap: 10px;}
  .mainOther__layerPopupContent > li {display: flex;width: 100%;gap: 10px;}
  .mainOther__layerPopupContent02 {display: flex;margin-top: 15px;gap: 10px;}
  .mainOther__layerPopupContentTitle {min-width: 100px;border-radius: 10px;font-size: 12px;}
  .mainOther__layerPopupContentTitle02 {min-width: 80px;border-radius: 15px;font-size: 12px;}
  .mainOther__layerPopupContentText {font-size: 12px;gap: 5px;}
  .mainOther__layerPopupContentText02 {color: #555;font-size: 12px;line-height: 1.53;gap: 5px;}
  .mainOther__tagBox {margin-top: 6px;gap: 8px;}
  .mainOther__tagBox li {width: auto;height: 32px;border-radius: 10px;}
  .mainOther__tag {height: 16px;font-size: 12px;padding: 0 38px 0 12px;}
  .mainOther__tag.type01 {background-position:  right 12px top 50%;background-size:20px;}
  .mainOther__tag.type02 {background-position:  right 12px top 50%;background-size:20px;}
  .mainOther__tag.type03 {background-position:  right 12px top 50%;background-size: 20px;}
  .mainOther__tag.type04 {background-position:  right 12px top 50%;background-size: 20px;}
  .mainOther__text {margin-top: 12px;font-size: 13px;}
  .mainOther__layerPopupMore {position: absolute;bottom: 20px;left: 20px;margin-top: 0;gap: 13px;color: #111;font-size: 16px;}
  .mainOther__layerPopupMore i {width: 30px;height: 30px;font-size: 15px;}
}
@media (max-width: 700px) {
  .mainOther__layerPopup.type08 .mainOther__layerPopupInner {background-size: 240px;}
}

@media (max-width: 640px) {
  .mainOther__layerPopup.type01 .mainOther__layerPopupInner {background-size: 240px;}
  .mainOther__layerPopup.type02 .mainOther__layerPopupInner {background-size: 240px;}
  .mainOther__layerPopup.type03 .mainOther__layerPopupInner {background-size: 240px;}
  .mainOther__layerPopup.type04 .mainOther__layerPopupInner {background-size: 240px;}
  .mainOther__layerPopup.type05 .mainOther__layerPopupInner {background-size: 240px;}
  .mainOther__layerPopup.type06 .mainOther__layerPopupInner {background-size: 240px;}
  .mainOther__layerPopup.type07 .mainOther__layerPopupInner {background-size: 240px;}
  .mainOther__layerPopup.type08 .mainOther__layerPopupInner {background-size: 230px;}

  .mainOther__layerPopup.type04 .mainOther__addressTipList li {font-size:12px}
  .mainOther__layerPopupHeader dd.type01 { font-size: 12px;}
  .mainOther__layerPopupHeader dd.type02 { font-size: 12px;}
  .mainOther__layerPopupHeader dd.type03 { font-size: 12px;}
  .mainOther__layerPopupHeader dd.type04 { font-size: 12px;}
  .mainOther__layerPopupHeader dd {font-size: 12px;}

  .mainOther__addressTipList{font-size: 12px;}
}

@media (max-width: 600px) {
  .mainOther__linkInner {font-size:14px;}
  .mainOther__layerPopupMore {bottom:10px;}
  .mainOther__layerPopup.type01 .mainOther__layerPopupInner {background:none;}
  .mainOther__layerPopup.type02 .mainOther__layerPopupInner {background:none;}
  .mainOther__subText,
  .mainOther__subText02 {padding-right: 0;}
  .mainOther__layerPopup.type03 {height: auto;}
  .mainOther__layerPopup.type03 .mainOther__layerPopupInner {padding: 20px 20px 72px;background: none; }
  .mainOther__layerPopupHeader dd.type02 {padding-right: 0; font-size: 12px;}
  .mainOther__layerPopup.type04 {height: 200px;}
  .mainOther__layerPopup.type04 .mainOther__layerPopupInner {background:none;}
  .mainOther__addressTipList li {padding-right:0;}
  .mainOther__layerPopup.type05 .mainOther__layerPopupInner {background:none;}
  .mainOther__layerPopup.type06 .mainOther__layerPopupInner {background:none;}
  .mainOther__layerPopupContent > li {gap:5px;}
  .mainOther__layerPopupContentTitle {min-width: 72px;}
  .mainOther__layerPopup.type07 .mainOther__layerPopupInner {background:none;}
  .mainOther__tagBox {flex-wrap: wrap;}
  .mainOther__layerPopup.type08 {height: 256px;bottom: -258px;}
  .mainOther__layerPopup.type08 .mainOther__layerPopupInner {background:none;}
}
</style>

