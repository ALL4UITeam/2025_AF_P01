<template>
    <div class="mainAddressSearch" :class="{ 'mainDesign': isMainDesign }">
        <div class="resultLayerPopup main">
            <div class="resultLayerPopup__close">
                <button class="resultLayerPopup__closeButton" type="button" title="검색 결과 닫기" v-show="recentSearchesResult" @click="closeSearchResult">
                    <i aria-hidden="true" class="clearIcon"></i>
                    <span class="blind">검색 결과 닫기</span>
                </button>
            </div>
            <div class="mainSearchBoxBasic">
                <div class="mainSearchBoxBasic__glass"><img aria-hidden="true" src="@images/main/img_glass.svg" class="mainSearchBoxBasic__searchAdressImage" alt="돋보기 이미지"></div>
                <div class="mainSearchBoxBasic__wrap">
                    <div id="searchBox" :class="['mainSearchBox', {current : subHeaderIsActiveRecentSearches}]">
                        <label for="mainHeaderSearch">
                            <span class="blind">검색어 입력</span>
                        </label>
                        <div class="inputWrap" id="target">
                            <input 
                                type="text"
                                v-if="!coordinateMode"
                                v-model="inqCndParams.keyword"
                                placeholder="예) 도움6로 42, 국립중앙박물관, 상암동 1595,  초성검색"
                                class="mainSearchBoxBasic__searchAdressTyping ui-autocomplete-input" 
                                name="searchKeyword" 
                                id="mainHeaderSearch" 
                                maxlength="85" title="예) 도움6로 42, 국립중앙박물관, 상암동 1595, 초성검색" 
                                autocomplete="off"
                                @keydown.enter="fnSrch(inqCndParams)"
                                @input="fnSolrAutoComplete"
                                @click.prevent="subHeaderToggleActiveRecentSearches('main')"
                                @focusin="fnIsUseSearchResult"
                                @keydown="handleKeydownKeyword"
                            />
                            <input 
                                type="text"
                                v-if="coordinateMode"
                                v-model="inqCndParams.keyword"
                                placeholder="예) [경위도] 126.8979, 37.5767 / [TM] 946833, 1953210" 
                                class="mainSearchBoxBasic__searchAdressTyping ui-autocomplete-input" 
                                name="searchKeyword" 
                                id="mainHeaderSearch" 
                                maxlength="85" title="예) [경위도] 126.8979, 37.5767 / [TM] 946833, 1953210" 
                                @keydown.enter="fnSrch(inqCndParams)"
                                autocomplete="off"
                                @click.prevent="subHeaderToggleActiveRecentSearches('main')"
                                @focusin="fnIsUseSearchResult"
                                @input="fnHandlerInputPos"
                                @keydown="handleKeydownKeyword"
                            />
                        </div>
                        
                        <button v-if="inqCndParams.keyword" @click.prevent="clearInput()" class="clearButton" title="삭제">
                            <span class="blind">삭제</span>
                            <i aria-hidden="true" class="clearIcon" />
                        </button>
                        
                        <button class="mainSearchBox__recentSearchesButtonMore" :title="subHeaderIsActiveRecentSearches ? '최근검색어 닫기' : '최근검색어 보기'" @click.prevent="subHeaderToggleActiveRecentSearches('view')">
                            <span class="blind">{{ subHeaderIsActiveRecentSearches ? '최근검색어 닫기' : '최근검색어 보기' }}</span>
                            <i aria-hidden="true" :class="['caretIcon', subHeaderIsActiveRecentSearches ? 'active' : '']" style="color:#000;" />
                        </button>
                        <div class="recentSearches" @focusin="handleFocusIn">
                            <div class="recentSearches__box" v-if="autoCompleteDataList.length == 0">
                                <p class="recentSearches__title">{{ searchHistOnOff ? '최근검색어' : '검색이력이 꺼져 있습니다.' }}</p>
                                <ul class="recentSearches__list">
                                    <li v-if="searchHistOnOff && recentSearches" v-for="(item, index) in recentSearches" :key="index">
                                        <button class="recentSearches__text" title="" @click.prevent="setModelValue(item.value)">
                                            <span class="recentSearches__searchText">{{ item.value }}</span>
                                        </button>
                                        <span class="recentSearches__date">{{ item.date }}</span>
                                        <button class="recentSearches__button" title="검색어 삭제" @click.prevent="clearRecentSearches(index)" >
                                            <i aria-hidden="true" class="clearIcon" />
                                            <span class="blind">검색어 삭제</span>
                                        </button>
                                    </li>
                                    <li v-if="searchHistOnOff && recentSearches.length == 0" class="non-result"><span class="no-data">최근검색어 내역이 없습니다.</span></li>
                                </ul>
                            </div>

                            <div class="recentSearches__recentSearchesfunction" v-if="autoCompleteDataList.length == 0">
                                <button class="recentSearches__recentSearchesfunctionButton" @click="clearRecentSearches()">{{ searchHistOnOff ? '전체삭제' : '' }}</button>
                                <div>
                                    <button class="recentSearches__recentSearchesfunctionButton" @click.prevent="subHeaderToggleActiveRecentSearches('toggle')">{{ searchHistOnOff ? '검색이력 끄기' : '검색이력 켜기' }}</button>
                                    <button class="recentSearches__recentSearchesfunctionButton" @click.prevent="subHeaderToggleActiveRecentSearches('view')">닫기</button>
                                </div>
                            </div>

                            <!-- 자동완성 영역 -->
                            <div class="recentSearches__box" v-if="isAutoCompleteOpen && autoCompleteDataList.length > 0 && inqCndParams.keyword">
                                <ul v-if="autoCompleteDataList.length" class="autocomplete__list">
                                    <li v-for="(suggestions, index) in autoCompleteDataList" :key="index">
                                        <button class="recentSearches__text" title="" @click.prevent="selectSuggesion(suggestions.fullAddr)">
                                            <span class="recentSearches__searchText" v-dompurify-html="suggestions.htmlAddr"></span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                        <button class="searchButton" title="검색" @click.prevent="fnSrch(inqCndParams)">
                            <i aria-hidden="true" class="searchIcon" />
                            <span class="irText">검색</span>
                        </button>
                    </div>
                    <div class="resultLayerPopup__headerFunction mainResult">
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
                </div>
            </div>
            <SearchResult v-if="isUseSearchResult" v-show="recentSearchesResult" ref="searchResultRef" @sendRoadNm="fnGetRoadNm" @mapCall="scrollToTop" />
        </div>

        <div :class="['mainSearchBoxBasic__quickMenu', {fixed: isFixed, mobileType: isMobile}]" v-show="!recentSearchesResult">
            <button class="mainSearchBoxBasic__quickButton" title="지도로 찾기 새창열기" @click="scrollToTop">
                <span class="mainSearchBoxBasic__quickText pc">지도로<br>찾을래요.</span>
                <span class="mainSearchBoxBasic__quickText mo">지도보기</span>
            </button>
        </div>
    </div>

</template>
<script setup>
import {onMounted, ref, reactive, onBeforeUnmount, defineAsyncComponent} from "vue";
import { useRouter } from 'vue-router';
import axios from 'axios';

const SearchResult = defineAsyncComponent(() => import('@components/main/SearchResult.vue'));
const isUseSearchResult = ref(false);
const fnIsUseSearchResult = () => {
  if (!isUseSearchResult.value){
    isUseSearchResult.value = true;
  }
};
//SearchResult.vue 컴포넌트
const searchResultRef = ref(null);

//페이징 변수
const pageSize = ref(5);
const currentPage = ref(0);

//좌표 검색 구분
const coordinateMode = ref(false);

const isFixed = ref(false);

const isMobile = ref(false);


//검색조건 초기화변수
const inqCndParams = reactive({
	keyword : ''
	, strSearchType : "HSTRY"				//검색구분
	, strFirstSort : "none"					//정렬구분
	, strAblYn : "N"						//폐지여부
	, strAotYn : "N"						//사물주소여부
	, strSynnYn : null
	, strHstryYn : "Y"
	, reqFrom :  "RN_SEARCH_KOR_WEB"
	, checkMoblieYn : "N"
	, strFunctionName : "Y"
	, pageable : {
		page : currentPage.value,
		size : pageSize.value,
	}
});

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
	if(label === "자동완성 사용 안함") {
		const isChecked = selectedCategoriesResult.value.includes(label);
		if(isChecked) {
			isAutoCompleteOpen.value = false;
			localStorage.setItem('isAutoComplete', 'N');
		} else {
			isAutoCompleteOpen.value = true;
			localStorage.setItem('isAutoComplete', 'Y');
		}
	}

	if(label === "사물주소 검색") {
		const isChecked = selectedCategoriesResult.value.includes(label);
		if(isChecked) {
			inqCndParams.strAotYn = "Y"
		} else {
			inqCndParams.strAotYn = "N"
		}
	}

	if(label === "폐지된 주소정보 포함") {
		const isChecked = selectedCategoriesResult.value.includes(label);
		if(isChecked) {
			inqCndParams.strAblYn = "Y";
		} else {
			inqCndParams.strAblYn = "N";
		}
	}
	
	if(label === "좌표 검색") {
		const isChecked = selectedCategoriesResult.value.includes(label);
		if(isChecked) {
			coordinateMode.value = true;
			inqCndParams.strSearchType = "COORDINATE";
		} else {
			coordinateMode.value = false;
			inqCndParams.strSearchType = "HSTRY";
		}
		inqCndParams.keyword = "";
	}
}

/*----------------------------------------------------------------------- 최근검색어 관련 */

//최근검색어 리스트 변수
const recentSearches = ref([]);

//최근검색어 활성화 여부
const subHeaderIsActiveRecentSearches = ref(false);

//검색이력끄기 토글
const searchHistOnOff = ref(true);

//최근검색어 저장
const historyKeywordSave = () => {
	if (inqCndParams.keyword.trim() === '') return;

	const newSearch = {
		value : inqCndParams.keyword,
		date : new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
	};

	// 검색어 중복 체크
	recentSearches.value.some((item, idx, arr) => {
		if (item.value === newSearch.value) {
			arr.splice(idx, 1);
			return true;
		} else {
			return false;
		}
	});

	recentSearches.value.unshift(newSearch);

	if(recentSearches.value.length > 10) recentSearches.value.pop();
	localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
}

//최근검색어 삭제
const clearRecentSearches = (index) => {
	if(index == 0 || index != undefined) {
		recentSearches.value.splice(index, 1);
		localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
	} else {
		recentSearches.value = [];
		localStorage.removeItem('recentSearches');
	}
}

//검색영역 최근검색어 토글기능
const subHeaderToggleActiveRecentSearches = (mode) => {
	//검색input박스 클릭evt
	if (mode == "main") {
		if(searchHistOnOff.value) {
			subHeaderIsActiveRecentSearches.value = !subHeaderIsActiveRecentSearches.value;
		} else {
			subHeaderIsActiveRecentSearches.value = false;
		}
	//최근검색어 토클버튼, 닫기버튼 클릭evt
	} else if (mode == "view") {
		subHeaderIsActiveRecentSearches.value = !subHeaderIsActiveRecentSearches.value;
	//검색이력on/off 클릭evt
	} else if (mode == "toggle") {
		searchHistOnOff.value = !searchHistOnOff.value;
		if (!searchHistOnOff.value) {
			subHeaderIsActiveRecentSearches.value = !subHeaderIsActiveRecentSearches.value;
		}
		localStorage.setItem('searchHistToggle', subHeaderIsActiveRecentSearches.value);
	}
}

//최근검색어 화면 제어
const handleMouseDown = (event) => {
    const recentSearchesArea = document.querySelector('.recentSearches');
    const clickedElement = event.target;
    const mainSearchBox = document.querySelector('.mainSearchBox');
    
    if (clickedElement.closest('input') || 
        clickedElement.closest('.mainSearchBox__recentSearchesButtonMore')) {
        return;
    }
    
    if (recentSearchesArea && clickedElement) {
        if (recentSearchesArea.contains(clickedElement) || 
            clickedElement.closest('.mainSearchBox')) {
            subHeaderIsActiveRecentSearches.value = true;
        } else {
            subHeaderIsActiveRecentSearches.value = false;
        }
    }
}

//최근검색어 검색어 클릭시 검색창으로 값 바인딩 후 검색수행
const setModelValue = (value) => {
	inqCndParams.keyword = value;
	fnSrch(inqCndParams);
}

//검색수행
const fnSrch = async(param) => {
	let isValid = true;
	isValid = await searchResultRef.value.recentSearchesResultRef(param);
	if (isValid != false) {
		historyKeywordSave();
		isAutoCompleteOpen.value = false;
		isMainDesign.value = true;
		subHeaderIsActiveRecentSearches.value = false;
		recentSearchesResult.value = true;
	}
}

/*----------------------------------------------------------------------- 자동완성 관련 */

//자동완성 조회 파라미터
const autoParams = reactive({
	keyword : ''
	, autoStart : 0
	, autoRow : 30
	, type : 'AUTO'
})

//자동완성 여부
const isAutoCompleteOpen = ref(true);

//자동완성 결과 변수
const autoCompleteDataList = ref([]);

//자동완성 조회
const fnSolrAutoComplete = (event) => {
	if(isAutoCompleteOpen.value) {
		if(event.target.value.length > 0) {
			autoParams.keyword = event.target.value;
			axios.post('/api/solr/solrAutocomplete', autoParams)
				.then((response) => {
					//검색을 수행했지만 사용자가 그 전에 다시 키워드를 삭제한 경우 예외처리
					if (!inqCndParams.keyword) {
						return;
					}
					
					const data = response.data;
					if (data.results != undefined && data.results.length > 0) {
						autoCompleteDataList.value = data.results.map(item => {
							return {
								'fullAddr' : item.autoComplete,
								'htmlAddr' : item.autoComplete.replace(autoParams.keyword, '<span class="commonColor01">'+autoParams.keyword+'</span>')
							};
			            });
						subHeaderIsActiveRecentSearches.value = true;
					} else {
						autoCompleteDataList.value.splice(0);
					}
				})
				.catch(error => {
					console.error("error =>", error);
				});
		} else {
			autoCompleteDataList.value.length = 0;
		}
	}
};

let handleKeywordDown = 0;

//자동완성 리스트 키다운 이벤트
const handleKeydownKeyword = (event) => {
	if (isAutoCompleteOpen && autoCompleteDataList.value.length > 0) {
		//자동완성
		if (event.key == "ArrowDown") {
			if (handleKeywordDown == autoCompleteDataList.value.length) {
				handleKeywordDown = 0;
			} else {
				inqCndParams.keyword = autoCompleteDataList.value[handleKeywordDown++].fullAddr;
			}
		} else if (event.key == "ArrowUp") {
			if (handleKeywordDown == 0) {
				handleKeywordDown = autoCompleteDataList.value.length;
			}
			inqCndParams.keyword = autoCompleteDataList.value[--handleKeywordDown].fullAddr;
		}
	} else if (searchHistOnOff && recentSearches.value.length > 0) {
		//최근검색어
		if (event.key == "ArrowDown") {
			if (handleKeywordDown == recentSearches.value.length) {
				handleKeywordDown = 0;
			} else {
				inqCndParams.keyword = recentSearches.value[handleKeywordDown++].value;
			}
		} else if (event.key == "ArrowUp") {
			if (handleKeywordDown == 0) {
				handleKeywordDown = recentSearches.value.length;
			}
			inqCndParams.keyword = recentSearches.value[--handleKeywordDown].value;
		}
	}
}

//자동완성 선택 시
const selectSuggesion = (val) => {
	inqCndParams.pageable.page = 0;
	inqCndParams.keyword = val;
	fnSrch(inqCndParams);
}

//좌표 입력 타입
const fnHandlerInputPos = (evt) => {
	const key  = evt.data;
	const regex = /[0-9.,]/;
	if (coordinateMode.value) {
		if(inqCndParams.keyword !== '' && !regex.test(key)){
			inqCndParams.keyword = inqCndParams.keyword.replace(/[^0-9.,\s]/g, '');
		}
	}
}

/*----------------------------------------------------------------------- 기타 화면 변수 및 함수 */

//mainDesign 클래스 상태 관리를 위한 ref 추가
const isMainDesign = ref(false);

//검색결과 토글
const recentSearchesResult = ref(false);
const closeSearchResult = () => {
	recentSearchesResult.value = false;
	isMainDesign.value = false;
	inqCndParams.keyword = '';
}

//지도로 찾을래요
const scrollToTop = (item) => {
  let url = '/map/totalMapView';
	console.log("mapcall", item);
  if(item.sidoList?.length && item.sidoList[0].sigunguList.length) {
    const rdMgtSn = item.sidoList[0].sigunguList[0].roadSigCd;
    const rdNm = item.rdNm ?? '';
    const bdMaSn = item.bdMaSn ?? '';
    const bdSlno = item.bdSlno ?? '';
    const rdNmIdx = item.rdNmidx ?? '';

    url += `?searchType=basicNum&rnCd=${rdMgtSn.slice(5)}&sigCd=${rdMgtSn.slice(0, 5)}&rdNm=${rdNm}&rdNmIdx=${rdNmIdx}&bdMaSn=${bdMaSn}&bdSlno=${bdSlno}`;
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
  window.scrollTo({top:0, behavior: 'smooth'});
}

//검색어 초기화
const clearInput = () => {
	inqCndParams.keyword = '';
	autoParams.keyword = '';
	autoCompleteDataList.value.splice(0);
	console.log("autoCompleteDataList.length", autoCompleteDataList.value.length)
	subHeaderToggleActiveRecentSearches("view");
    setTimeout(() => {
	    const inputElement = document.querySelector('.mainSearchBox input');
	    if (inputElement) {
	        inputElement.focus();
	    }
    }, 0);
};

// 검색 키워드 전달
const fnGetRoadNm = (sendParams) => {
  // 검색어
  if(sendParams.keyword){
	  inqCndParams.keyword = sendParams.keyword;
  }
  // 검색구분
  if(sendParams.strSearchType){
	  inqCndParams.strSearchType = sendParams.strSearchType;
    if(sendParams.strSearchType === 'COORDINATE' && !selectedCategoriesResult.value.includes("좌표 검색")) {
      selectedCategoriesResult.value.push("좌표 검색");
    } else if(sendParams.strSearchType === 'HSTRY' && selectedCategoriesResult.value.includes("좌표 검색")){
      selectedCategoriesResult.value = selectedCategoriesResult.value.filter(item => item !== "좌표 검색");
    }
  }
  // 폐지여부
  if(sendParams.strAblYn){
	  inqCndParams.strAblYn = sendParams.strAblYn;
    if(sendParams.strAblYn === 'Y' && !selectedCategoriesResult.value.includes("폐지된 주소정보 포함")) {
      selectedCategoriesResult.value.push("폐지된 주소정보 포함");
    } else if(sendParams.strAblYn === 'N' && selectedCategoriesResult.value.includes("폐지된 주소정보 포함")){
      selectedCategoriesResult.value = selectedCategoriesResult.value.filter(item => item !== "폐지된 주소정보 포함");
    }
  }
  // 사물주소여부
  if(sendParams.strAotYn){
	  inqCndParams.strAotYn = sendParams.strAotYn;
    if(sendParams.strAotYn === 'Y' && !selectedCategoriesResult.value.includes("사물주소 검색")) {
      selectedCategoriesResult.value.push("사물주소 검색");
    } else if(sendParams.strAotYn === 'N' && selectedCategoriesResult.value.includes("사물주소 검색")){
      selectedCategoriesResult.value = selectedCategoriesResult.value.filter(item => item !== "사물주소 검색");
    }
  }
}

const handleScroll = () => {
	isFixed.value = window.scrollY > 20;
}

const checkWindowSize = () => {
  isMobile.value = window.innerWidth <= 1080;
}

onMounted(() => {
    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('scroll', handleScroll);
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    
    //검색이력on/off
   	const sht = localStorage.getItem('searchHistToggle');
    if (sht == "false") {
   		searchHistOnOff.value = false;
   	} else {
   		searchHistOnOff.value = true;
   	}

   	//최근검색어 로드
 	const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
 	recentSearches.value = savedSearches;

	//자동완성 사용 유무
	const autoComplete = localStorage.getItem('isAutoComplete');
	if (autoComplete === 'Y') {
		isAutoCompleteOpen.value = true;
	    selectedCategoriesResult.value = [];
	} else {
		isAutoCompleteOpen.value = false;
	    selectedCategoriesResult.value = ['자동완성 사용 안함'];
	}
})

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', checkWindowSize);
    isUseSearchResult.value = false;
});

</script>

<style lang="scss" scoped>
.mainSearchBox {
    position: relative;
    
    .recentSearches {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: #fff;
        border: 1px solid #ddd;
        border-top: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1000;
    }

    &.current {
        .recentSearches {
            display: block;
        }
    }
}

.recentSearches {
    &__box {
        padding: 15px;
    }

    &__title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    &__list {
        list-style: none;
        padding: 0;
        margin: 0;

        .non-result {
            text-align: center;
            color: #666;
            padding: 20px 0;
        }
    }

    &__recentSearchesfunction {
        display: flex;
        justify-content: space-between;
        padding: 10px 15px;
        border-top: 1px solid #eee;

        button {
            font-size: 12px;
            color: #666;
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;

            &:hover {
                color: #000;
            }
        }
    }
}

</style>

