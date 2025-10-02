<template>
	<div :class="['searchBox', {current : subHeaderIsActiveRecentSearches}]">
		<label for="headerSearch">
			<span class="blind">검색어 입력</span>
		</label>
		<InputText 
			v-if="!coordinateMode"
            v-model="inqCndParams.keyword"
            placeholder="예) 도움6로 42, 국립중앙박물관, 상암동 1595,  초성검색"
            id="headerSearch" 
            maxlength="85" title="예) 도움6로 42, 국립중앙박물관, 상암동 1595, 초성검색" 
            autocomplete="off"
            @input="fnSolrAutoComplete"
            @keydown.enter="fnSrch(inqCndParams)"
            @click.prevent="subHeaderToggleActiveRecentSearches('main')"
            @keydown="handleKeydownKeyword"
		/>
        <InputText 
			v-if="coordinateMode"
			v-model="inqCndParams.keyword"
			placeholder="예) [경위도] 126.8979, 37.5767 / [TM] 946833, 1953210" 
			id="headerSearch" 
			maxlength="85" title="예) [경위도] 126.8979, 37.5767 / [TM] 946833, 1953210" 
			autocomplete="off"
			@keydown.enter="fnSrch(inqCndParams)"
			@click.prevent="subHeaderToggleActiveRecentSearches('main')"
            @keydown="handleKeydownKeyword"
		/>
        
	    <Button v-if="inqCndParams.keyword" @click.prevent="clearInput()" class="clearButton" title="삭제">
	      <span class="blind">삭제</span>
	      <i aria-hidden="true" class="bi bi-x" />
	    </Button>
    
	    <Button class="searchBox__recentSearchesButtonMore" :title="subHeaderIsActiveRecentSearches ? '최근검색어 닫기' : '최근검색어 보기'" @click.prevent="subHeaderToggleActiveRecentSearches('view')">
	        <span class="blind">{{ subHeaderIsActiveRecentSearches ? '최근검색어 보기' : '최근검색어 닫기' }}</span>
	        <i aria-hidden="true" :class="['bi', subHeaderIsActiveRecentSearches ? 'bi-caret-up-fill' : 'bi-caret-down-fill']" style="color:#000;" />
		</Button>
		<div class="recentSearches" >
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

      <!-- 자동완성 영역 -->
			<div class="recentSearches__box" v-if="isAutoCompleteOpen && autoCompleteDataList.length > 0 && inqCndParams.keyword">
				<ul v-if="autoCompleteDataList.length" class="autocomplete__list">
					<li v-for="(suggestions, index) in autoCompleteDataList" :key="index">
            <Button class="recentSearches__text" title="" @click.prevent="selectSuggesion(suggestions.fullAddr)">
              <span class="recentSearches__searchText" v-dompurify-html="suggestions.htmlAddr"></span>
            </Button>
					</li>
		    	</ul>
			</div>
	        
      <div class="recentSearches__recentSearchesfunction" v-if="autoCompleteDataList.length == 0">
        <button class="recentSearches__recentSearchesfunctionButton" @click="clearRecentSearches()">{{ searchHistOnOff ? '전체삭제' : '' }}</button>
        <div>
          <button class="recentSearches__recentSearchesfunctionButton" @click.prevent="subHeaderToggleActiveRecentSearches('toggle')">{{ searchHistOnOff ? '검색이력 끄기' : '검색이력 켜기' }}</button>
          <button class="recentSearches__recentSearchesfunctionButton" @click.prevent="subHeaderToggleActiveRecentSearches('view')">닫기</button>
        </div>
      </div>
	    </div>
	    <Button class="searchButton" title="검색" @click.prevent="fnSrch(inqCndParams)">
	      <i aria-hidden="true" class="bi bi-search" />
	      <span class="irText">검색</span>
	    </Button>
	</div>
</template>
<script setup>
import { onMounted, ref, reactive, onBeforeUnmount, computed ,watch, nextTick, defineExpose } from "vue";
import InputText from 'primevue/inputtext'
import Button from 'primevue/button';
import axios from 'axios';

const props = defineProps({
    isValid : {
      type: Boolean
    }
});

//페이징 변수
const pageSize = ref(5);
const currentPage = ref(0);

//좌표 검색 구분
const coordinateMode = ref(false);

//검색조건 초기화변수
const inqCndParamsInfo = {
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
};

const inqCndParams = reactive({});

//부모 컴포넌트에서 체크박스 상태 받아오기
const fnGetParameter = (label, isChecked) => {
	if(label === "자동완성 사용 안함") {
		if(isChecked) {
			isAutoCompleteOpen.value = false;
			localStorage.setItem('isAutoComplete', 'N');
		} else {
			isAutoCompleteOpen.value = true;
			localStorage.setItem('isAutoComplete', 'Y');
		}
	}

	if(label === "사물주소 검색") {
		if(isChecked) {
			inqCndParams.strAotYn = "Y"
		} else {
			inqCndParams.strAotYn = "N"
		}
	}

	if(label === "폐지된 주소정보 포함") {
		if(isChecked) {
			inqCndParams.strAblYn = "Y";
		} else {
			inqCndParams.strAblYn = "N";
		}
	}
	
	if(label === "좌표 검색") {
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

let handleKeywordDown = 0;

//자동완성 리스트 키다운 이벤트
const handleKeydownKeyword = (event) => {
	if (isAutoCompleteOpen && autoCompleteDataList.value.length > 0) {
		//자동완성
		if (event.key == "ArrowDown") {
			if (handleKeywordDown == autoCompleteDataList.value.length) {
				handleKeywordDown = 0;
				inqCndParams.keyword = autoCompleteDataList.value[handleKeywordDown++].fullAddr;
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
				inqCndParams.keyword = recentSearches.value[handleKeywordDown++].value;
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
	//최근검색어 토글버튼, 닫기버튼 클릭evt
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
	console.log('mode ->', mode, '?', subHeaderIsActiveRecentSearches.value);
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

//자동완성 선택 시
const selectSuggesion = (val) => {
	inqCndParams.pageable.page = 0;
	inqCndParams.keyword = val;
	fnSrch(inqCndParams);
}

const emit = defineEmits(['sendParams']);

//검색 수행
const fnSrch = (param) => {
	subHeaderIsActiveRecentSearches.value = false;
	isAutoCompleteOpen.value = false;
	//부모 컴포넌트로 파라미터 전송
	emit('sendParams', param);
	historyKeywordSave();
}

//검색결과창 종료시 세팅값 초기화
const refreshParam = () => {
	Object.assign(inqCndParams, inqCndParamsInfo);
	if (coordinateMode.value) coordinateMode.value = false;
	// if (isAutoCompleteOpen.value) isAutoCompleteOpen.value = false;
}

const fnGetKeyword = (sendParams) => {

  // 검색어
  if(sendParams.keyword){
    inqCndParams.keyword = sendParams.keyword;
  }

  // 검색구분
  if(sendParams.strSearchType){
    inqCndParams.strSearchType = sendParams.strSearchType;
    inqCndParams.strSearchType === "COORDINATE" ? coordinateMode.value = true : coordinateMode.value = false;
  }

  // 폐지여부
  if(sendParams.strAblYn){
    inqCndParams.strAblYn = sendParams.strAblYn;
  }

  // 사물주소여부
  if(sendParams.strAotYn){
    inqCndParams.strAotYn = sendParams.strAotYn;
  }

	historyKeywordSave();
}

//부모 컴포넌트에서 자식 컴포넌트 호출
defineExpose({
	fnGetParameter,
	refreshParam,
	fnGetKeyword,
})
  
onMounted(() => {
	Object.assign(inqCndParams, inqCndParamsInfo);
	document.addEventListener('mousedown', handleMouseDown);
	
    //검색이력on/off
   	var sht = localStorage.getItem('searchHistToggle');
    if (sht == "false") {
   		searchHistOnOff.value = false;
   	} else {
   		searchHistOnOff.value = true;
   	}
    
	//최근검색어 로드
 	const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
 	recentSearches.value = savedSearches;

	// 자동완성 사용 유무
	const autoComplete = localStorage.getItem('isAutoComplete');
	if (autoComplete === 'Y') {
		isAutoCompleteOpen.value = true;
	} else {
		isAutoCompleteOpen.value = false;
	}
})

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleMouseDown);
});

</script>