<template>
    <div class="enSearchBox" :class="{'mainEnSearchBox': searchCurrent}">
        <p class="enSearchBox__title">Do you find <strong>Road Name Address?</strong></p>
        <div class="mainSearchBox enSearchBasic">
            <label for="mainHeaderSearch">
                <span class="blind">Enter search term</span>
            </label>
            <InputText v-model="inqCndParams.keyword" placeholder="Search Address" title="Search Address"
                    id="mainHeaderSearch" autocomplete="off"  @keydown.enter="recentSearchesResultRef"/>
            <button class="clearButton" type="button" title="delete" v-if="inqCndParams.keyword" @click="clearInput">
                <span class="blind">delete</span>
                <i aria-hidden="true" class="bi bi-x"></i>
            </button>
            <button class="searchButton" type="button" title="search" @click="recentSearchesResultRef">
                <i aria-hidden="true" class="bi bi-search"></i>
                <span class="blind">search</span>
            </button>
        </div>

        <div class="enContent">
            <div class="resultLayerPopup main" :class="{'mainResultActive': searchCurrent}">
                <div class="resultLayerPopup__close">
                    <Button class="resultLayerPopup__closeButton" title="close search results" @click="searchCurrentRecentSearches">
                        <i aria-hidden="true" class="bi bi-x" />
                        <span class="blind">close search results</span>
                    </Button>
                </div>

	            <p class="resultLayerPopup__resultText"><strong class="text">{{ pageInfo.totalRecords.toLocaleString() }}</strong> results (search keyword
	                "<strong class="text">{{ searchKeyword }}</strong>")</p>

                <div class="resultLayerPopup__innerWrap" v-if="searchDataList.length > 0">

                    <div class="resultLayerPopup__scrollWrap">
                        <div class="resultLayerPopup__scroll" data-pc-name="scrollpanel" data-pc-section="root">

                            <ul class="resultLayerPopup__list">
                                <li v-for="(item, index) in searchDataList" :key="index">
                                    <div class="resultLayerPopup__detailBox">
                                        <div class="resultLayerPopup__detailBoxNumber">{{ item.rowNumber }}</div>
                                        <div class="resultLayerPopup__listDetail basic">
                                            <div class="resultLayerPopup__listDetailContent moContent">
                                                <span class="number">{{ item.emdCd }}</span>
                                                <button type="button" class="resultLayerPopup__english">영문</button>
                                            </div>
                                            <p class="resultLayerPopup__listDetailTitle">
                                                <strong>Road Name</strong>
                                            </p>
                                            <div class="resultLayerPopup__listDetailContent pcContent">
                                                <div class="resultLayerPopup__innerBox">
                                                    <strong>{{ selectedLanguage === 'English' ? item.schEngRoadNm :
                                                        item.schKorRoadNm }}</strong>
                                                </div>
                                            </div>
                                            <p class="resultLayerPopup__listDetailTitle">Land Lot</p>
                                            <div class="resultLayerPopup__listDetailContent">
                                                <p class="resultLayerPopup__innerBox">{{ selectedLanguage === 'English' ?
                                                    item.schEngJibunNm : item.schKorJibunNm }}</p>
                                            </div>
                                        </div>
                                        <div class="resultLayerPopup__function">
                                            <div class="resultLayerPopup__functionPostalCodeWrap">
                                                <strong class="resultLayerPopup__functionPostalCodeText">
                                                    Zip Code
                                                </strong>
                                                <strong class="resultLayerPopup__functionPostalCodeNumber">
                                                    {{ item.zipCl }}
                                                </strong>
                                            </div>
                                            <button type="button" class="resultLayerPopup__functionButton kr pcContent" title="view in Korea" @click="changeLaguage('Korea')">
                                                Korea
                                            </button>
                                            <button type="button" class="resultLayerPopup__functionButton en pcContent" title="view in English" @click="changeLaguage('English')">
                                                English
                                            </button>
                                            <button type="button" class="resultLayerPopup__functionButton map" title="지도에서 찾기 "@click="mapViewOnShowDialog(item)">
                                                View map
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
	                <TemplatePaginator class="resultLayerPopup__paging" :pageInfo="pageInfo" @reload-list="onPaging" />
	                <!-- 지도에서 찾기 -->
	                <EnMiniMapPopup ref="miniMapPop" />
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>@import url('@scss/contents/en/enMain.scss');</style>
<script setup>
import { ref, onMounted, computed, reactive, nextTick, onActivated } from "vue";
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import RadioButton from "primevue/radiobutton";
import Checkbox from "primevue/checkbox";
import Breadcrumb from 'primevue/breadcrumb'
import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
import CustomInputText from '@components/input_text/CustomInputText.vue';
import CustomPaginator from '@components/paginator/CustomPaginator.vue';
import HeaderTitle from '@components/title/HeaderTitle.vue';
import Scrollpanel from 'primevue/scrollpanel'
import EnMiniMapPopup from "@/components/map/EnMiniMapPopup.vue";
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import axios from 'axios';
import {useUserCountLogStore} from "@/stores/userCountLog";

//검색결과창 토글 변수
const searchCurrent = ref(false);

//검색 수행 후 키워드 담는 변수
const searchKeyword = ref("");

//검색결과 변수
const searchDataList = ref([]);

//페이지변수
const pageSize = ref(5);
const currentPage = ref(0);

//검색조건 초기화변수
const inqCndParams = reactive({
    keyword: ''
    , strSearchType: "HSTRY"
    , strFirstSort: "none"
    , strAblYn: "N"
    , strAotYn: "N"
    , strSynnYn: null
    , strHstryYn: "Y"
    , reqFrom: "RN_SEARCH_KOR_WEB"
    , checkMoblieYn: "N"
    , strFunctionName: "Y"
    , pageable: {
        page: currentPage.value,
        size: pageSize.value,
    }
});

//페이징 변수
const pageInfo = reactive({
	first: 0
    , totalRecords: 0     		 // 전체 데이터 수
    , currentRecords: 0    		 // 현재 보여지는 데이터 수
    , totalPages: 0        	     // 전체 페이지 수
    , page: currentPage.value	 // 현재 페이지
    , size: pageSize.value 		 // 한 페이지당 데이터 수
    , orders: [{
        property: ''               // 정렬할 속성 이름
        , direction: ''            // 정렬 방향 (ASC 또는 DESC)
    }]
});

//검색어 삭제
const clearInput = () => {
	inqCndParams.keyword = '';

    setTimeout(() => {
        const inputElement = document.querySelector('.mainSearchBox input');
        if (inputElement) {
            inputElement.focus();
        }
    }, 0);
};

const recentSearchesResultRef = () => {
    if (!inqCndParams.keyword) {
        alert('검색키워드는 2자리 이상 입력해 주시기 바랍니다.');
        return false;
    } else if (inqCndParams.keyword.length < 2) {
        alert('검색키워드는 2자리 이상 입력해 주시기 바랍니다.');
        return false;
    } else {
        // 조회 실행
        inqCndParams.pageable.page = 0;
        axiosCall();
        if (!searchCurrent.value) searchCurrent.value = !searchCurrent.value;
    }
}

//검색
async function axiosCall() {
    if (inqCndParams.strAotYn === "N") {
        axios.post('/api/solr/solrKeywordSearch', inqCndParams)
            .then((response) => {
                const data = response.data;
                if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
                    const totalElements = data.results.totalElements;
                    const pageSize = data.results.size;
                    const currentPage = data.results.pageable.pageNumber;
                    searchDataList.value = data.results.content.map((item, index) => {
                        const rowNumber = currentPage * pageSize + index + 1;
                        return {
                            ...item,
                            rowNumber: rowNumber
                        }
                    })
                    pageInfo.totalRecords = data.results.totalElements;
                    pageInfo.currentRecords = data.results.numberOfElements;
                    pageInfo.totalPages = data.results.totalPages;
                } else {
                	searchDataList.value.splice(0);
                    pageInfo.totalRecords = 0;
                    pageInfo.currentRecords = 0;
                    pageInfo.totalPages = 0;
                }
            })
			.catch(error => {
				console.error("error =>", error);
			});
    }
    searchKeyword.value = inqCndParams.keyword;
}

//검색 버튼 클릭
const onPaging = params => {
    pageInfo.page = params.page !== undefined ? params.page + 1 : 1;
    pageInfo.size = params.rows ? params.rows : pageInfo.size;

    inqCndParams.pageable.page = pageInfo.page - 1;
    inqCndParams.pageable.size = pageInfo.size;

    axiosCall();
}

//한글 영문 변환
const selectedLanguage = ref('English')
const changeLaguage = (language) => {
    selectedLanguage.value = language
}

//미니맵 변수
const miniMapPop = ref(null);
const mapViewOnShowDialog = (item) => {
    miniMapPop.value.show(item);

}

//검색결과창 토글
const searchCurrentRecentSearches = () => {
    searchCurrent.value = !searchCurrent.value;
}

// 접속자수 통계 세부분류 추가
// 연결통계유형코드 WK00:웹(국문), WE00:웹(영문), MK00:모바일(국문), ME00:모바일(영문)
// 웹/모바일 구분은 백엔드에서 추가됨
const fnUserCountLog = () => {
  const userCountLog = useUserCountLogStore();
  userCountLog.callUserCountLog('E00');
}

// 로드 함수
onMounted(() => {
  // 접속자수 통계 로그
  fnUserCountLog();
});
</script>