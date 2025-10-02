<script setup>
    import { onMounted, ref, onBeforeUnmount, computed ,watch, nextTick } from "vue";
    import ContentTitle from '@components/title/ContentTitle.vue';
	import Button from 'primevue/button';

    const mainFooterMenu = ref([
        {
            id:1,
            link:'',
            linkTitle:"도로명 보기",
            title:"도로명",
            class:'type01',
            type:'type01',
        },
        {
            id:2,
            link:'',
            linkTitle:"건물번호 보기",
            title:"건물번호",
            class:'type02',
            type:'type02',
        },
        {
            id:3,
            link:'',
            linkTitle:"상세주소 보기",
            title:"상세주소",
            class:'type03',
            type:'type03',
        },
        {
            id:4,
            link:'',
            linkTitle:"주소정보시설 보기",
            title:"주소정보시설",
            class:'type04',
            type:'type04',
        },
        {
            id:5,
            link:'',
            linkTitle:"국가지점번호 보기",
            title:"국가지점번호",
            class:'type05',
            type:'type05',
        },
        {
            id:6,
            link:'',
            linkTitle:"국가기초구역 보기",
            title:"국가기초구역",
            class:'type06',
            type:'type06',
        },
        {
            id:7,
            link:'',
            linkTitle:"입체주소 보기",
            title:"입체주소",
            class:'type07',
            type:'type07',
        },
        {
            id:8,
            link:'',
            linkTitle:"사물주소 보기",
            title:"사물주소",
            class:'type08',
            type:'type08',
        },
    ]);

    const selectedItem = ref(null);
    const isOpen = ref(false)
    const activeIndex = ref(null)

    const openPopup = (item, index) => {
        if (isOpen.value && selectedItem.value.id === item.id) {
            closePopup();
        } else {
            selectedItem.value = item;
            isOpen.value = true;
            activeIndex.value = index;
        }
    }

    const closePopup = () => {
        selectedItem.value = null;
        isOpen.value = false;
        activeIndex.value = null;
    }

</script>

<template>

<div class="mainOther">
    <ContentTitle title="도로명 국민 편의에 한발 더 가까이" fontSize="45px" marginTop="30px" mobileFontSize="20px" mobileMarginTop="20px" class="mainOther__header" />

    <ul class="mainOther__list">
        <li v-for="(item, index) in mainFooterMenu" :key="index" :class="{ active: activeIndex === index}">
            <a 
                href="javascript:void(0)" 
                @click="openPopup(item, index)" 
                :title="isOpen && selectedItem?.id === item.id ? '레이어팝업닫기': '레이어팝업열기'" 
                class="mainOther__link" 
                :class="item.class"
            >
                <div class="mainOther__linkInner">
                    {{item.title}}
                </div>
            </a>
            <div v-if="isOpen" >
        
                <div class="mainOther__layerPopup type01" v-if="selectedItem.type === 'type01'">
                    <div class="mainOther__layerPopupInner">
                        <dl class="mainOther__layerPopupHeader">
                            <dt>도로명주소란?</dt>
                            <dd>도로명주소는 도로명<span class="commonColor01">*</span> + 건물번호로 이루어져있습니다.</dd>
                        </dl>
                        <div class="mainOther__layerPopupContent02">
                            <div class="mainOther__layerPopupContentTitle02"><span class="commonColor01">*</span>입체도로</div>
                            <p class="mainOther__layerPopupContentText02">도로구간마다 부여한 이름으로<br />명사+도로별 구분기준(대로/로/길)으로 구성</p>
                        </div>
                        <a href="#" class="mainOther__layerPopupMore type01">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

                        <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                            <i aria-hidden="true" class="bi bi-x" />
                            <span class="blind">팝업닫기</span>
                        </Button>
                    </div>
                </div>

                <div class="mainOther__layerPopup type02" v-else-if="selectedItem.type === 'type02'">
                    <div class="mainOther__layerPopupInner">
                        <dl class="mainOther__layerPopupHeader">
                            <dt>건물번호란?</dt>
                            <dd class="type04">건물의 위치를 식별하기 위해 부여된 숫자나 문자입니다.</dd>
                        </dl>
                        <p class="mainOther__subText02">건물번호는 도로 시작지점에서 20m간격으로 부여합니다.<br />건물번호표기는 <span class="commonColor01">도로구간의 왼쪽에 홀수</span>, <span class="commonColor01">오른쪽에 짝수</span>를 부여합니다.</p>
                        <a href="#" class="mainOther__layerPopupMore type01">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

                        <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                            <i aria-hidden="true" class="bi bi-x" />
                            <span class="blind">팝업닫기</span>
                        </Button>
                    </div>
                </div>

                <div class="mainOther__layerPopup type03" v-else-if="selectedItem.type === 'type03'">
                    <div class="mainOther__layerPopupInner">
                        <dl class="mainOther__layerPopupHeader">
                            <dt>상세주소란?</dt>
                            <dd class="type02">상세주소는 도로명주소의 <span class="commonColor01">건물번호 뒤에 표시되는 동·충·호<br />정보</span>입니다.</dd>
                        </dl>
                        <a href="#" class="mainOther__layerPopupMore type02">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

                        <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                            <i aria-hidden="true" class="bi bi-x" />
                            <span class="blind">팝업닫기</span>
                        </Button>
                    </div>
                </div>

                <div class="mainOther__layerPopup type04" v-else-if="selectedItem.type === 'type04'">
                    <div class="mainOther__layerPopupInner">
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
                        <a href="#" class="mainOther__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

                        <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                            <i aria-hidden="true" class="bi bi-x" />
                            <span class="blind">팝업닫기</span>
                        </Button>
                    </div>
                </div>

                <div class="mainOther__layerPopup type05" v-else-if="selectedItem.type === 'type05'">
                    <div class="mainOther__layerPopupInner">
                        <dl class="mainOther__layerPopupHeader">
                            <dt>국가지점번호란?</dt>
                            <dd class="type02">국토와 해양을 격자형으로 구획한 지점마다 부여한 번호입니다.</dd>
                        </dl>
                        <p class="mainOther__subText"><span class="commonColor01">산악·해안 등에서 긴급상황 발생 시 구조·구급활동의 위치 표시로 활용</span><br />하는 국민 안정망입니다.</p>
                        <a href="#" class="mainOther__layerPopupMore type01">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

                        <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                            <i aria-hidden="true" class="bi bi-x" />
                            <span class="blind">팝업닫기</span>
                        </Button>
                    </div>
                </div>
                
                <div class="mainOther__layerPopup type06" v-else-if="selectedItem.type === 'type06'">
                    <div class="mainOther__layerPopupInner">
                        <dl class="mainOther__layerPopupHeader">
                            <dt>국가기초구역이란?</dt>
                            <dd class="type02">각종 관할구역 (통계, 우편, 소방, 경찰 등)을 관리하기 위해 나눈<br /> 단위 구역입니다.</dd>
                        </dl>
                        <p class="mainOther__subText">국가기초구역번호는<span class="commonColor01">우편번호</span>로 사용됩니다.</p>
                        <a href="#" class="mainOther__layerPopupMore type01">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

                        <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                            <i aria-hidden="true" class="bi bi-x" />
                            <span class="blind">팝업닫기</span>
                        </Button>
                    </div>
                </div>
                
                <div class="mainOther__layerPopup type07" v-else-if="selectedItem.type === 'type07'">
                    <div class="mainOther__layerPopupInner">
                        <dl class="mainOther__layerPopupHeader">
                            <dt>입체주소란?</dt>
                            <dd class="type01">고가도, 지하도,지하철역 내부통로 등의 <strong>입체도로</strong><span class="commonColor01">*</span>와 건물 각 층의 통로 및 호수 등의<br /><strong>내부도로<span class="commonColor01">*</span>를 포함하여 구체적으로 위치</strong>를 명시하는 주소 체계</dd>
                        </dl>
                        <ul class="mainOther__layerPopupContent">
                            <li>
                                <div class="mainOther__layerPopupContentTitle"><span class="commonColor01">*</span>입체도로</div>
                                <ul class="mainOther__layerPopupContentText">
                                    <li>* <strong class="str">고가도로</strong>: 공중에 설치된 도로 빛 통로</li>
                                    <li>* <strong class="str">지하도로</strong>: 지하에 설치된 도로 빛 통로</li>
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
                        <a href="#" class="mainOther__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>
                        <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                            <i aria-hidden="true" class="bi bi-x" />
                            <span class="blind">팝업닫기</span>
                        </Button>
                    </div>
                </div>

                <div class="mainOther__layerPopup type08" v-else-if="selectedItem.type === 'type08'">
                    <div class="mainOther__layerPopupInner">
                        <dl class="mainOther__layerPopupHeader">
                            <dt>사물주소란?</dt>
                            <dd>건물이 아닌 시설물 등에 <strong>사물의 위치를 특정하기 위해</strong>'도로명주소'법에 따라 부여된 주소</dd>
                        </dl>
                        <ul class="mainOther__tagBox">
                            <li><span class="mainOther__tag type01">#무더위심터</span></li>
                            <li><span class="mainOther__tag type02">#CCTV</span></li>
                            <li><span class="mainOther__tag type03">#무인민원발급기</span></li>
                        </ul>
                        <div class="mainOther__text">동의 시설물에 주소를 부여</div>
                        <a href="#" class="mainOther__layerPopupMore">자세히보기 <i aria-hidden="true" class="bi bi-arrow-right" /></a>

                        <Button class="mainOther__closeButton" title="팝업 닫기" @click="closePopup">
                            <i aria-hidden="true" class="bi bi-x" />
                            <span class="blind">팝업닫기</span>
                        </Button>
                    </div>
                </div>
            </div>

        </li>
    </ul>

</div>

</template>