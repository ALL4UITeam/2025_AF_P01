<template>
<ul id="skipArea" class="skip__navi">
  <li><a href="#gnb" title="메인메뉴 바로가기">메인메뉴 바로가기</a></li>
  <li><a class="outline_light" href="#content" title="본문 바로가기">본문 바로가기</a></li>
</ul>
<div class="headerHeight subHeaderHeight">
  <div class="header__wrap" :class="{ fixed: isOpen }">
    <div class="header__inner">
      <div class="header">
        <h1 class="header__logo"><a href="/"><img src="@/assets/images/common/img-logo@2x.png" alt="행정안전부 로고" /></a></h1>
        <div class="header__menu">
          <Button class="header__menuFunction" @click="toggle">
            <span class="blind">{{ isOpen ? '메뉴닫기' : '메뉴열기' }}</span>
          </Button>
        </div>
        <div class="header__gnb">
          <div class="header__mobileHeader">
            <h1 class="header__logo"><a href="/"><img src="@/assets/images/common/img-logo@2x.png" alt="행정안전부 로고" /></a></h1>
            <Button class="header__mobileHeaderClear" @click="toggle">
              <i aria-hidden="true" class="bi bi-x-lg" />
              <span class="blind">{{ isOpen ? '메뉴열기' : '메뉴닫기' }}</span>
            </Button>
          </div>
          <div class="header__etc">
            <CertificationDuration/>
            <div class="header__etcFunction">
              <Button class="language" title="영문사이트보기" @click.prevent="router.push({path: '/main/engMain'})">EN</Button>
              <a href="www.주소기반.co.kr" class="link" title="주소기반산업지원서비스 새창 이동하기"><span class="widthAlign">주소기반산업지원서비스</span> </a>
            </div>
          </div>
          <HeaderMenu />
        </div>
      </div>
    </div>
    <div class="header__utility">
      <div class="header__function">
        <HeaderSearchBox ref="headerSearchBoxRef" @sendParams="fnGetParams" :isValid="isValid" @focusin="fnIsUseSearchResult"/>
      </div>
    </div>
  </div>
</div>

<div class="resultLayerPopup" v-show="showResultPopup">
  <div class="resultLayerPopup__headerFunction">
    <div class="resultLayerPopup__functionList" v-for="checkList of categoriesResult" :key="checkList.key">
        <input type="checkbox" 
            v-model="selectedCategoriesResult" 
            :id="`checkbox-${checkList.key}`" 
            name="checkListResult" 
            :value="checkList.label"
            @change="chgCheckBox(checkList.label)" 
        />
        <label class="resultLayerPopup__functionLabel" :for="`checkbox-${checkList.key}`">
            {{ checkList.label }}
        </label>
    </div>
  </div>
  <SearchResult v-if="isUseSearchResult" ref="searchResultRef" @sendRoadNm="fnGetRoadNm" call="header"/>

  <div class="resultLayerPopup__close">
      <button class="resultLayerPopup__closeButton" type="button" title="검색 결과 닫기" v-show="recentSearchesResult" @click="closeSearchResult">
          <i aria-hidden="true" class="bi bi-x"></i>
          <span class="blind">검색 결과 닫기</span>
      </button>
  </div>
</div>

</template>
<script setup>
import CertificationDuration from '@/components/common/CertificationDuration.vue';
import HeaderMenu from '@/components/common/HeaderMenu.vue';
import HeaderSearchBox from '@/components/search_box/HeaderSearchBox.vue';
import router from "@/router";
import Button from 'primevue/button';
import { defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';

const SearchResult = defineAsyncComponent(() => import('@components/main/SearchResult.vue'));
const isUseSearchResult = ref(false);
const fnIsUseSearchResult = () => {
	  if (!isUseSearchResult.value){
	    isUseSearchResult.value = true;
	  }
};

/*----------------------------------------------------------------------- 검색 관련 
 * (자식)HeaderSearchBox.vue 컴포넌트에서 검색어 파라미터를 받아오고 (fnGetParams)
 * (자식)SearchResult.vue 컴포넌트로 다시 파라미터를 전송하여 검색을 수행합니다.
 *   - searchResultRef.value.recentSearchesResultRef(inqCndParams);
 */

//SearchResult.vue 컴포넌트
const searchResultRef = ref(null);

//HeaderSearchBox.vue 컴포넌트
const headerSearchBoxRef = ref(null);

//검색영역 토글
const recentSearchesResult = ref(false);
const showResultPopup = ref(false);

//검색 파라미터
const inqCndParams = reactive({});

const isValid = ref(true);

//검색 수행
const fnGetParams = async(params) => {
	isValid.value = await searchResultRef.value.recentSearchesResultRef(params);
	if (isValid.value != false) {
		recentSearchesResult.value = true; // 검색 결과 표시
		showResultPopup.value = true;
	
		const contentElement = document.querySelector('.content');
	    const headerInnerElement = document.querySelector('.header__inner');
	    const subHeaderHeightElement = document.querySelector('.subHeaderHeight');
	    
	    if (contentElement.style.display == "") {
			contentElement.style.display = 'none';
	    }
	    if (headerInnerElement.style.display == "") {
			headerInnerElement.style.display = 'none';
	    }
	    if (!subHeaderHeightElement.classList.contains('add')) {
			subHeaderHeightElement.classList.toggle('add');
	    }
	} else {
		return false;
	}
}

//검색 결과 닫기 함수
const closeSearchResult = () => {
	recentSearchesResult.value = false;
	showResultPopup.value = false;  // 팝업도 함께 닫기
	headerSearchBoxRef.value.refreshParam();
	
	selectedCategoriesResult.value.splice(0);
	selectedCategoriesResult.value = [];
  
	//content와 header__inner 클래스 원래대로 복구
	const contentElement = document.querySelector('.content');
	const headerInnerElement = document.querySelector('.header__inner');
	const subHeaderHeightElement = document.querySelector('.subHeaderHeight');
  
	if (contentElement) {
		contentElement.style.display = '';
	}
	if (headerInnerElement) {
		headerInnerElement.style.display = '';
	}
	if (subHeaderHeightElement) {
		subHeaderHeightElement.classList.remove('add');
	}
};

//필터검색시 검색 컴포넌트로 검색값 전송
const fnGetRoadNm = (sendParams) => {
	// 검색어
	if(sendParams.keyword){
		headerSearchBoxRef.value.fnGetKeyword(sendParams);
	}
	// 검색구분
	if(sendParams.strSearchType){
		if(sendParams.strSearchType === 'COORDINATE' && !selectedCategoriesResult.value.includes("좌표 검색")) {
			selectedCategoriesResult.value.push("좌표 검색");
		} else if(sendParams.strSearchType === 'HSTRY' && selectedCategoriesResult.value.includes("좌표 검색")){
			selectedCategoriesResult.value = selectedCategoriesResult.value.filter(item => item !== "좌표 검색");
		}
	}
	// 폐지여부
	if(sendParams.strAblYn){
		if(sendParams.strAblYn === 'Y' && !selectedCategoriesResult.value.includes("폐지된 주소정보 포함")) {
			selectedCategoriesResult.value.push("폐지된 주소정보 포함");
		} else if(sendParams.strAblYn === 'N' && selectedCategoriesResult.value.includes("폐지된 주소정보 포함")){
			selectedCategoriesResult.value = selectedCategoriesResult.value.filter(item => item !== "폐지된 주소정보 포함");
		}
	}
	// 사물주소여부
	if(sendParams.strAotYn){
		if(sendParams.strAotYn === 'Y' && !selectedCategoriesResult.value.includes("사물주소 검색")) {
			selectedCategoriesResult.value.push("사물주소 검색");
		} else if(sendParams.strAotYn === 'N' && selectedCategoriesResult.value.includes("사물주소 검색")){
			selectedCategoriesResult.value = selectedCategoriesResult.value.filter(item => item !== "사물주소 검색");
		}
	}
}

//자동완성 사용 안함 체크 상태로 초기화
const selectedCategoriesResult = ref([]);

//체크박스 리스트
const categoriesResult = ref([
	{ key: 'address', label: '사물주소 검색' },
	{ key: 'abolition', label: '폐지된 주소정보 포함' },
	{ key: 'coordinate', label: '좌표 검색' },
	{ key: 'auto', label: '자동완성 사용 안함' }
]);

//체크박스 선택 이벤트
const chgCheckBox = (label) => {
	const isChecked = selectedCategoriesResult.value.includes(label);
	//검색박스 컴포넌트로 파라미터 전송
	headerSearchBoxRef.value.fnGetParameter(label, isChecked);
}

/*----------------------------------------------------------------------- 헤더 관련 */

//햄버거메뉴
const isOpen = ref(false);

const toggle = () => {
	if (window.innerWidth <= 1280) {
		isOpen.value = !isOpen.value;

		nextTick(() => {
			const header = document.querySelector('.header__wrap');

			if(header) {
				header.classList.toggle('fixed', isOpen.value);
			}

			const focusableElements = document.querySelectorAll('.skip__navi a, .content a, .content button, .content input, .footer__wrap a, .footer__wrap button, .footer__wrap input');
			focusableElements.forEach(element => {
				element.setAttribute('tabindex', isOpen.value ? '-1' : '' );
			})
		})
	}
}

function headerHistoryHandler() {}

onMounted(() => {
	window.addEventListener('popstate', headerHistoryHandler);
	
	categoriesResult.value.forEach((category) => {
		const checkboxBox = document.querySelector(`#${category.key}`);

		if (checkboxBox && category.title) {
			checkboxBox.setAttribute('title', category.title);
		}
	})
	
	//자동완성 사용 유무
	const autoComplete = localStorage.getItem('isAutoComplete');
	if (autoComplete === 'Y') {
		selectedCategoriesResult.value = [];
	} else {
		selectedCategoriesResult.value = ['자동완성 사용 안함'];
	}
})

onBeforeUnmount(() => {
	if (recentSearchesResult.value) {
		window.removeEventListener('popstate');
	}
})

</script>

<style lang="scss" scoped>
@use '@/assets/scss/_mixin';
</style>