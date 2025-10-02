<script setup>
import { ref, onMounted, nextTick, reactive } from "vue";
import Button from 'primevue/button'
import Scrollpanel from 'primevue/scrollpanel'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import TabMenu from 'primevue/tabmenu'
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import RadioButton from "primevue/radiobutton";
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import CustomInputText from '@/components/input_text/CustomInputText.vue';
import MapEditor from "daip-map-component";
import _ from 'lodash';
import axios from "axios";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import Cluster from "ol/source/Cluster";
import Overlay from "ol/Overlay";
import { getCenter } from "ol/extent";
import { sidoDataLoad, sggDataLoad, emdDataLoad, stliDataLoad } from '@/common/jusoCommon.ts'
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import mapUtils from "@/common/mapUtils";
import mapStyles from "@/common/mapStyles";
import Measure from "@/common/measure";
import common from "@/common/common";
import { Feature } from "ol";
import { useRoute } from "vue-router";
import ImageLyr from "ol/layer/Image";
import ImageSource from "ol/source/ImageWMS";
import Draw from "ol/interaction/Draw";
import { MultiLineString, MultiPoint } from "ol/geom";
import html2canvas from "html2canvas";
import {DragPan} from "ol/interaction";
import * as turf from '@turf/turf';
import Point from "ol/geom/Point";

/************ 개발용 **************/
// map apikey
const MAP_APIKEY = mapUtils.MAP_SERVER_APIKEY;
// 그리기 모드
let drawInteraction = null;
// map에 포인터 이동 유무
let isPointerMove = true;
// 접속위치 버튼 표출 유무
const currentPointButton = ref(false);
// 사물주소 레이어 호출 유무
let isKadtAotMngLayer = false;
// 민원행정기관 레이어 호출 유무
let isHahuFcltsLayer = false;
// 국가지점번호판 레이어 호출 유무
let isKargSsnpLayer = false;
let tempKargSsnpSsn = '';
// 건물/건물군 레이어
let buldEqbLayer = null;
// 도로구간 레이어
let sprdManageLayer = null;
// 기초구간 레이어
let sprdIntrvlLayer = null;
// 포인트 아이콘 레이어
let pointIconLayer = null;
// 사물주소 레이어
let aotLayer = null;
// 우편번호 레이어
let postLayer = null;
// 지점번호 레이어
let ssnpLayer = null;

// 최근검색어 관련
const modelValue = ref('');
const recentSearches = ref([]);
const isActiveRecentSearches = ref(false);


const measure = new Measure();

const route = useRoute();

// 주소검색용 오버레이
const addrInfoMouseOverElmt = document.createElement('div');
const addrInfoMouseOver = new Overlay({
  id: 'addrInfoMouseOverOverlay',
  element: addrInfoMouseOverElmt,
  offset: [0, -12],
  positioning: 'bottom-center',
});
const addrInfoMouseClickElmt = document.createElement('div');
const addrInfoMouseClick = new Overlay({
  id: 'addrInfoMouseClickOverlay',
  element: addrInfoMouseClickElmt,
  offset: [50, 0],
  positioning: 'top-left',
});
let addrInfoMouseClickPosition = null;

// 민원행정기관용 오버레이
const govMachMouseOverElmt = document.createElement('div');
const govMachMouseOver = new Overlay({
  id: 'govMachMouseOverOverlay',
  element: govMachMouseOverElmt,
  offset: [20, 0],
  positioning: 'top-left',
});
const govMachMouseClickElmt = document.createElement('div');
const govMachMouseClick = new Overlay({
  id: 'govMachMouseClickOverlay',
  element: govMachMouseClickElmt,
  offset: [20, 0],
  positioning: 'top-left',
});

// 사물주소용 오버레이
const aotAddrMouseOverElmt = document.createElement('div');
const aotAddrMouseOver = new Overlay({
  id: 'aotAddrMouseOverOverlay',
  element: aotAddrMouseOverElmt,
  offset: [20, 0],
  positioning: 'top-left',
});
const aotAddrMouseClickElmt = document.createElement('div');
const aotAddrMouseClick = new Overlay({
  id: 'aotAddrMouseClickOverlay',
  element: aotAddrMouseClickElmt,
  offset: [20, 0],
  positioning: 'top-left',
});

// 국가지점번호판용 오버레이
const kargSsnpMouseOverElmt = document.createElement('div');
const kargSsnpMouseOver = new Overlay({
  id: 'kargSsnpMouseOverOverlay',
  element: kargSsnpMouseOverElmt,
  offset: [0, -30],
  positioning: 'bottom-center',
});
const kargSsnpMouseClickElmt = document.createElement('div');
const kargSsnpMouseClick = new Overlay({
  id: 'kargSsnpMouseClickOverlay',
  element: kargSsnpMouseClickElmt,
  offset: [0, -50],
  positioning: 'bottom-center',
});

// 기초번호용 오버레이
const sprdIntrvlMouseClickElmt = document.createElement('div');
const sprdIntrvlMouseClick = new Overlay({
  id: 'sprdIntrvlMouseClickOverlay',
  element: sprdIntrvlMouseClickElmt,
  offset: [0, -40],
  positioning: 'bottom-center',
});

// 통합검색
const totalSearch = reactive({
  is_search_aot_addr: false,
  is_searched: false,
  search_keyword: '',
  search_result: [],
  result_count: 0,
  result_msg: '검색결과',
});

// 상세검색
const detailSearch = reactive({
  // tab00 파라미터 정보(도로명주소)
  tab00_params_sido_val: null, // 시도
  tab00_params_sido_data: [],
  tab00_params_sgg_val: null,  // 시군구
  tab00_params_sgg_data: [],
  tab00_params_start_char: null, // 초성
  tab00_params_road_name: null,// 도로명
  tab00_params_road_data: [],
  tab00_params_bnmn: '',       // 건물번호 본번
  tab00_params_bnsn: '',       // 건물번호 부번
  tab00_search_keyword: '',
  tab00_search_result: [],
  tab00_result_count: 0,
  tab00_pageInfo: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 10 		              // 한 페이지당 데이터 수
    , orders: [{
      property: ''              // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  },

  // tab01 파라미터 정보(지번)
  tab01_params_sido_val: null, // 시도
  tab01_params_sido_data: [],
  tab01_params_sgg_val: null,  // 시군구
  tab01_params_sgg_data: [],
  tab01_params_emd_val: null,  // 읍면동
  tab01_params_emd_data: [],
  tab01_params_tli_val: null,  // 리
  tab01_params_tli_data: [],
  tab01_params_mtn_se_cd: false,  // 산 구분 유무
  tab01_params_mno: '',       // 번지 본번
  tab01_params_sno: '',       // 번지 부번
  tab01_search_keyword: '',
  tab01_search_result: [],
  tab01_result_count: 0,
  tab01_pageInfo: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 10 		              // 한 페이지당 데이터 수
    , orders: [{
      property: ''              // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  },

  // tab02 파라미터 정보(건물명)
  tab02_params_sido_val: null,
  tab02_params_sido_data: [],
  tab02_params_sgg_val: null,
  tab02_params_sgg_data: [],
  tab02_params_emd_val: null,
  tab02_params_emd_data: [],
  tab02_params_buld_nm: '',
  tab02_search_keyword: '',
  tab02_search_result: [],
  tab02_result_count: 0,
  tab02_pageInfo: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 10 		              // 한 페이지당 데이터 수
    , orders: [{
      property: ''              // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  },

  // tab03 파라미터 정보(기초번호)
  tab03_params_sido_val: null,
  tab03_params_sido_data: [],
  tab03_params_sgg_val: null,
  tab03_params_sgg_data: [],
  tab03_params_start_char: null, // 초성
  tab03_params_road_name: null,  // 도로명
  tab03_params_road_data: [],
  tab03_params_bnmn: '',       // 건물번호 본번
  tab03_params_bnsn: '',       // 건물번호 부번
  tab03_search_keyword: '',
  tab03_search_result: [],
  tab03_result_count: 0,
  tab03_pageInfo: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 10 		              // 한 페이지당 데이터 수
    , orders: [{
      property: ''              // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  },
});

// 기초구역
const basicDistrict = reactive({
  params_sido_val: null,
  params_sido_data: [],
  params_sgg_val: null,
  params_sgg_data: [],
  search_result: [],
  result_count: 0,
  result_offset: 0,
  // lgvReplcCd : '451102',
  ctpvCd: '',
  lgvReplcCd: '',
  districtNo: '',
  pageable: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 10		              // 한 페이지당 데이터 수
    , orders: [{
      property: ''            // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  }
});

// xy좌표
const xyPosition = reactive({
  search_result: [],
  result_count: 0,
  result_offset: 0,
  xPosition: '',
  yPosition: '',
  pageable: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 10		              // 한 페이지당 데이터 수
    , orders: [{
      property: ''            // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  }
});

// 맵 중앙 주소
const mapCenterAddr = reactive({
  params_sido_val: null, // 시도
  params_sido_data: [],
  params_sgg_val: null,  // 시군구
  params_sgg_data: [],
  params_emd_val: null,  // 읍면동
  params_emd_data: [],
});

const pageTotal = ref();
const pageSize = ref(10);
const currentPage = ref(0);

//페이징변수
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
  , pageTotal: pageTotal
  , pageable: {
    page: currentPage.value,
    size: pageSize.value,
  }
});

//도로명 초성 선택
const roadItemsList = ref([
  { label: 'ㄱ', value: '가' },
  { label: 'ㄴ', value: '나' },
  { label: 'ㄷ', value: '다' },
  { label: 'ㄹ', value: '라' },
  { label: 'ㅁ', value: '마' },
  { label: 'ㅂ', value: '바' },
  { label: 'ㅅ', value: '사' },
  { label: 'ㅇ', value: '아' },
  { label: 'ㅈ', value: '자' },
  { label: 'ㅊ', value: '차' },
  { label: 'ㅋ', value: '카' },
  { label: 'ㅌ', value: '타' },
  { label: 'ㅍ', value: '파' },
  { label: 'ㅎ', value: '하' },
]);

/************ 개발용 **************/

const isActive = ref(false);
const thingsIsActive = ref(false);
const civilAffairsIsActive = ref(false);
const comMapEditor = ref(null);
// 출력용 지도
const isVisiblePrintMap = ref(false);
const copyMapObj = ref(null);
const descText = ref('');
const descTextCnt = ref(0);
// 정보조회 팝업용
let bdInfo_isEngRdNm = false;
// 정보조회 팝업->도로구간 탭 정보
const searchInfoPopupResult = reactive({
  roadInfoData: null,
  historyInfoData: null,
});

const toggleActive = () => {
  isActive.value = !isActive.value;
  scrollToSelectedAll()
}

/**
 * 최근검색어
 */
//검색어 이력 true/false 구분 (기본값 true)
const isHistoryEnabled = ref(true)

//검색에 localStorage(recentSearches) 저장
const historyKeywordSave = (keyword) => {
  modelValue.value = keyword
  if (modelValue.value.trim() === '') return;

  const newSearch = {
    value: modelValue.value,
    date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
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

  if (recentSearches.value.length > 10) recentSearches.value.pop();
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
}
//최근검색어 삭제
const removeSearch = (index) => {
  recentSearches.value.splice(index, 1);
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
}
//최근검색어 영역 닫기
const toggleRecentSearches = () => {
  isActiveRecentSearches.value = !isActiveRecentSearches.value;
}
//전체삭제
const clearRecentSearches = () => {
  recentSearches.value = [];
  localStorage.removeItem('recentSearches');
}
//최근검색어 클릭 시 클릭한 검색어 입력
const setModelValue = (value) => {
  totalSearch.search_keyword = value;
  isActiveRecentSearches.value = false;
}

//검색결과 토글
const isActiveResultList = ref(false);
const toggleActiveResultList = () => {
  isActiveResultList.value = !isActiveResultList.value;
}

//검색영역 최근검색어 토글기능
const toggleActiveRecentSearches = () => {
  isActiveRecentSearches.value = !isActiveRecentSearches.value;
}

//검색영역 최근검색어 활성화
const activeRecentSearches = () => {
  if(!totalSearch.is_searched){
    isActiveRecentSearches.value = true;
  }
}

const saveSearchHistoryState = () =>{
  localStorage.setItem('isHistoryEnabled', isHistoryEnabled.value ? 'true' : 'false')
}

//검색이력 상태 불러오기
const loadSearchHistoryState = () =>{
  const storedState = localStorage.getItem('isHistoryEnabled');
  if(storedState !== null){
    isHistoryEnabled.value = storedState === 'true';
  }
}

//검색이력 끄기 켜기
const toggleSearchHistory = () => {
  isHistoryEnabled.value = !isHistoryEnabled.value;
  saveSearchHistoryState()
  if (isHistoryEnabled.value == false) {
    recentSearches.value = [];
    localStorage.removeItem('recentSearches');
  }
}
/**
 * 최근검색어 끝
 */


// 사물주소 버튼 클릭
const toggleThingsActive = () => {
  thingsIsActive.value = !thingsIsActive.value;

  if (thingsIsActive.value) {
    // 피쳐 클릭 추가
    comMapEditor.value.getMap().on('pointermove', fnAotAddrOverlay);
    comMapEditor.value.getMap().on('singleclick', fnAddAotAddrInfo);
  } else {
    // 피쳐 클릭 삭제
    comMapEditor.value.getMap().un('pointermove', fnAotAddrOverlay);
    comMapEditor.value.getMap().un('singleclick', fnAddAotAddrInfo);
  }
}

// 민원행정기관 버튼 클릭
const toggleCivilAffairsActive = () => {
  civilAffairsIsActive.value = !civilAffairsIsActive.value;

  if (civilAffairsIsActive.value) {
    // 피쳐 클릭 추가
    comMapEditor.value.getMap().on('pointermove', fnGovMachOverlay);
    comMapEditor.value.getMap().on('singleclick', fnAddGovMachInfo);
  } else {
    // 피쳐 클릭 삭제
    comMapEditor.value.getMap().un('pointermove', fnGovMachOverlay);
    comMapEditor.value.getMap().un('singleclick', fnAddGovMachInfo);
  }
}

const closeLayer = () => {
  isActive.value = false;
}


const clearInput = () => {
  totalSearch.search_keyword = '';

  setTimeout(() => {
    const inputElement = document.querySelector('.integratedMap__searchInput');
    if (inputElement) {
      inputElement.focus();
    }
  }, 0);
};

//메뉴동작
const activeLayerPopup = ref(null);

// 상단 메뉴 검색
const toogleLayerPopup = (popupNumber) => {
  activeLayerPopup.value = activeLayerPopup.value === popupNumber ? null : popupNumber
  if (activeLayerPopup.value === null || activeLayerPopup.value === 1) {
    const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('TBL_KARB_SBD_LAYER');
    if (searchLayer) {
      comMapEditor.value.getMap().removeLayer(searchLayer);
    }
  } else {
    fnCallKarbSbd();
  }
}

const closeLayerPopup = () => {
  activeLayerPopup.value = null;
}



const active = ref(0);
const tabItems = ref([
  { label: '도로명주소' },
  { label: '지번' },
  { label: '건물명' },
  { label: '기초번호' },
  { label: 'XY좌표' },
]);

const onTabChange = (e) => {
  active.value = e.index;
}

//모달팝업
const dialogVisible = ref(false);

const showDialog = () => {
  dialogVisible.value = true;
}
const closeDialog = () => {
  dialogVisible.value = false;
}
const onShowDialog = async () => {
  await nextTick();
  const dialogElement = document.querySelector('#close');
  if (dialogElement) {
    dialogElement.focus();
  }
}
const onHideDialog = () => {
  document.querySelector('#dialogFocusSave').focus();
}

//범례
const legendDialogVisible = ref(false);

const legendShowDialog = () => {
  legendDialogVisible.value = true;
}
const legendCloseDialog = () => {
  legendDialogVisible.value = false;
}
const legendOnShowDialog = async () => {
  await nextTick();
  const dialogElement = document.querySelector('#legendClose');
  if (dialogElement) {
    dialogElement.focus();
  }
}
const legendOnHideDialog = () => {
  document.querySelector('#legend').focus();
}

const activeInquiry02 = ref(false);

const toggleActiveInquiry02 = () => {
  activeInquiry02.value = !activeInquiry02.value;
}

//기초구역
const baseAreaDialogVisible = ref(false);

const baseAreaShowDialog = () => {
  baseAreaDialogVisible.value = true;
}
const baseAreaCloseDialog = () => {
  baseAreaDialogVisible.value = false;
}
const baseAreaOnShowDialog = async () => {
  await nextTick();
  const dialogElement = document.querySelector('#baseAreaClose');
  if (dialogElement) {
    dialogElement.focus();
  }
}
const baseAreaOnHideDialog = () => {
  document.querySelector('#baseArea').focus();
}

//기초번호
const baseNumberDialogVisible = ref(false);

const baseNumberShowDialog = () => {
  baseNumberDialogVisible.value = true;
}
const baseNumberCloseDialog = () => {
  baseNumberDialogVisible.value = false;
}
const baseNumberOnShowDialog = async () => {
  await nextTick();
  const dialogElement = document.querySelector('#baseNumberClose');
  if (dialogElement) {
    dialogElement.focus();
  }
}
const baseNumberOnHideDialog = () => {
  document.querySelector('#dialogFocusSave').focus();
}

const isModal = ref(window.innerWidth < 1280);
const handleModalResize = () => {
  isModal.value = window.innerWidth < 1280;
}

const selectedCategories = ref('png');
const categories = ref([
  { label: '지도화면 PNG로 저장하기', bgColor: "#4e40db", icon: "bi bi-filetype-png", title: "지도화면 PNG로 저장하기", value: "PNG" },
  { label: '지도화면 JPG로 저장하기', bgColor: "#2a51c7", icon: "bi bi-filetype-jpg", title: "지도화면 JPG로 저장하기", value: "JPEG" },
  { label: '지도화면 PDF로 저장하기', bgColor: "#d93f4a", icon: "bi bi-filetype-pdf", title: "지도화면 PDF로 저장하기", value: "PDF" },
]);

onMounted(async () => {
  categories.value.forEach((category) => {
    const checkboxBox = document.querySelector(`#${category.key}`);

    if (checkboxBox && category.title) {
      checkboxBox.setAttribute('title', category.title);
    }
  })

  //시도 데이터 (jusoCommon.ts)
  let data = await sidoDataLoad();
  data = [{ label: '선택', value: null }, ...data];
  detailSearch.tab00_params_sido_data = [...data];
  detailSearch.tab01_params_sido_data = [...data];
  detailSearch.tab02_params_sido_data = [...data];
  detailSearch.tab03_params_sido_data = [...data];
  basicDistrict.params_sido_data = [...data];
  mapCenterAddr.params_sido_data = [...data];

})

const fnPrintMapPopup = () => {
  // const width = 904;
  // const height = 879;
  // const left = (window.innerWidth - width) / 2;
  // const top = (window.innerHeight - height) / 2;
  // const newWindow = window.open(
  //   '/ahu/ahuPrintMapPopup',
  //   'newWindow',
  //   `width=${width},height=${height},top=${top},left=${left}`
  // );
  isVisiblePrintMap.value = true;


}
// 최근검색어 fasle시 최근검색어 삭제 , true시 최근검색어 가져옴
const stdgCd = ref('');
loadSearchHistoryState()
if (!isHistoryEnabled.value) {
  recentSearches.value = []
  localStorage.removeItem('recnetSearches');
}else if(isHistoryEnabled.value) {
  const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  recentSearches.value = savedSearches;
}

/**
 * 왼쪽 하단 로고 영역에 시도, 시군구, 읍면동 정보
 * */

const getCenterPos = () => {
  // var urlL = API_URL+"/wfs.do";
  var mapCenter = comMapEditor.value.getMap().getView().getCenter();
  const mapX = mapCenter[0];
  const mapY = mapCenter[1];

  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&APIKEY=" + MAP_APIKEY
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_scco_emd"
    + "&VERSION=1.1.1"
    + "&cql_filter=CONTAINS(geom,POINT(" + mapX + "%20" + mapY + "))";

  axios.get(url)
  .then((res) => {
    if (res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          // stdgCd.value = ft.id_.replace(/.*\./,"");
          stdgCd.value = ft.get('emd_cd');
          // test.value = new URLSearchParams(stdgCd.value).toString;
          //나중에 값추출할때 사용
          // console.log('ft---->' , ft.values_.emd_kor_nm)
          // 전북특별자치도 데이터 변경으로 인한 임시 수정
          if(stdgCd.value.substring(0, 2) === '52') {
            stdgCd.value = '45' + stdgCd.value.substring(2);
          }

          mapCenterDataLoad(stdgCd.value)
        });
      }
    }
  });
}

//value값, index값 객체 생성
function createOption (valueKey, labelKey, data){
  return {
    value : data[valueKey],
    label : data[labelKey]
  }
}

const ctpvData = ref([]);
const lgvData = ref([]);
const emdData = ref([]);

//시도, 시군구, 읍면동 선택 시 active 적용 변수
const activeCity = ref(null);
const activeCounty = ref(null);
const activeTown = ref(null);
//시도, 시군구, 읍면동 선택시 label값 변수
// const mapCenterCity = ref('');
// const mapCenterCounty = ref('');
// const mapCenterTown = ref('');
// 전북특별자치도로 임시 세팅(추후 서울특별시 - 중구- 태평로2가로 세팅)
const mapCenterCity = ref('전북특별자치도');
const mapCenterCounty = ref('전주시 완산구');
const mapCenterTown = ref('효자동3가');


//맵 이동시 스크롤 데이터
const scrollCity = ref(null);
const scrollCounty = ref(null);
const scrollTown = ref(null);

//시도,시군구,읍면동 선택한 데이터 (확인클릭시 detailSearch의 각각데이터에 적용)
const imsiCity = ref('');
const imsiCounty = ref('');
const imsiTown = ref('');

const imsiactiveCity = ref('')
const imsiactiveCounty = ref('')
const imsiactiveTown = ref('')

const mapCenterDataLoad = (stdgCd) => {
    axios.post('/api/jusoCommon/selectMapCenterPoint',{stdgCd : String(stdgCd)},{
      headers:{
        'Content-Type' :'application/json',
      }
    })
    .then(async(response) => {
      if(response.data !== null) {
        const dataList = response.data
   
        ctpvData.value = [createOption('ctpvCd', 'ctpvNm', dataList)]
        lgvData.value = [createOption('lgvCd', 'sggNm', dataList)]
        emdData.value = [createOption('emdCd', 'emdNm', dataList)]

        await fnSearchSggData("mapCenterAddrSgg", ctpvData.value[0]);
        await fnSearchEmdData("mapCenterAddrEmd", lgvData.value[0]);

        //지도 이동 시 시도, 시군구, 읍면동 value값 적용
        mapCenterAddr.params_sido_val = ctpvData.value[0].value
        mapCenterAddr.params_sgg_val = lgvData.value[0].value
        mapCenterAddr.params_emd_val = emdData.value[0].value

        imsiCity.value = ctpvData.value[0].value
        imsiCounty.value = lgvData.value[0].value
        imsiTown.value = emdData.value[0].value

        //지도 이동 시 시도, 시군구, 읍면동 label값 적용
        mapCenterCity.value = ctpvData.value[0].label
        mapCenterCounty.value = lgvData.value[0].label
        mapCenterTown.value = emdData.value[0].label

        
        
        //style active를 위해 index값 추출
        const activeIndexCity = mapCenterAddr.params_sido_data.findIndex(item => item.value === ctpvData.value[0].value)
        const activeIndexCounty = mapCenterAddr.params_sgg_data.findIndex(item => item.value === lgvData.value[0].value)
        const activeIndexTown = mapCenterAddr.params_emd_data.findIndex(item => item.value === emdData.value[0].value)
        activeCity.value = activeIndexCity
        activeCounty.value = activeIndexCounty
        activeTown.value = activeIndexTown

        //데이터, value 값 비교하여 index값 추출 후 스크롤 변수에 적용
        if(activeIndexCity !== -1){
          scrollCity.value = activeIndexCity 
        }
        if (activeIndexCounty !== -1) {
          scrollCounty.value = activeIndexCounty;
        }
        if (activeIndexTown !== -1) {
          scrollTown.value = activeIndexTown;
        }
        scrollToSelectedAll();
      }else {
        // console.error ('Data is not an array:' , dataArray)
        return [];
      // }      
      }
    })
}

// scroll태그 ref값으로 시도, 시군구, 읍면동 구분
const scrollContainerCity = ref(null);
const scrollContainerCounty = ref(null);
const scrollContainerTown = ref(null);

//시도, 시군구, 읍면동 index 위치로 스크롤 이동
const scrollToSelectedItem = (container, selectedIndex)=>{
  nextTick(()=> {
    const targetItem = container?.querySelector(`#item-${selectedIndex}`);
    if (targetItem) {
      targetItem.scrollIntoView({behavior : 'auto', block:'center'})    
    }
  });
};
//시도, 시군구, 읍면동 index 위치로 스크롤 이동 (시도, 시군구,읍면동)
const scrollToSelectedAll = () => {
      scrollToSelectedItem(scrollContainerCity.value?.$el, scrollCity.value)
      scrollToSelectedItem(scrollContainerCounty.value?.$el, scrollCounty.value)
      scrollToSelectedItem(scrollContainerTown.value?.$el, scrollTown.value)
}

//#####맵 중심 점 코드


//맵 중심 포인트 type에 변수에 데이터 적용 
const mapCenterLocation = (item, type, index) => {

  if (type === 'mapCenterCity') {
    activeCity.value = index;
    activeCounty.value = null;
    activeTown.value = null;
    imsiCity.value = item.value
    imsiCounty.value = null
    imsiTown.value  = null
    fnSearchSggData("mapCenterAddrSgg", imsiCity)
  }
  if (type === 'mapCenterCounty') {
    activeCounty.value = index;
    activeTown.value = null;
    imsiCounty.value = item.value
    imsiTown.value = null
    fnSearchEmdData("mapCenterAddrSearchEmd", imsiCounty)
  }
  if (type === 'mapCenterTown') {
    activeTown.value = index;
    imsiTown.value = item.value
  }

}

//지역선택 팝업 확인 버튼 
const mapCenterPointOkButton = () => {
  if (imsiCity.value === null) {
    alert('시도를 선택하세요.')
  }else if (imsiCounty.value === null){
    alert('시군구를 선택하세요.')
  }else if (imsiTown.value === null){
    alert('읍면동을 선택하세요.')
  }else{
    mapCenterAddr.params_sido_val = imsiCity.value
    mapCenterAddr.params_sgg_val = imsiCounty.value
    mapCenterAddr.params_emd_val = imsiTown.value

    isActive.value = false;
    const emdCd = `${mapCenterAddr.params_sgg_val}${mapCenterAddr.params_emd_val}`
    moveCenterPoint(emdCd)
  }
}

// 시도, 시군구, 읍면동 닫기 버튼
const mapCentetPointCloseButton = () => {
  if (mapCenterCity.value === '' || mapCenterCounty.value === '' || mapCenterTown.value === '') {
    activeCity.value = null;
    activeCounty.value = null;
    activeTown.value = null;
    mapCenterAddr.params_sido_val = null
    mapCenterAddr.params_sgg_val = null
    mapCenterAddr.params_emd_val = null
    mapCenterAddr.params_sgg_data = null
    mapCenterAddr.params_emd_data = null
    isActive.value = false;
   }else if (mapCenterTown.value != '')
    activeCity.value = mapCenterAddr.params_sido_data.findIndex(city => city.label === mapCenterCity.value);
    activeCounty.value = mapCenterAddr.params_sgg_data.findIndex(city => city.label === mapCenterCounty.value);
    activeTown.value = mapCenterAddr.params_emd_data.findIndex(city => city.label === mapCenterTown.value);
    isActive.value = false;
}

/**
 * 읍면동 코드 활용해서 맵 중심으로 이동
 */
const geomX = ref('');
const geomY = ref('');
const moveCenterPoint = (emdCd) => {
      axios.post('/api/totalMap/selectMoveMapCenterPoint',{emdCd : String(emdCd)},{
      headers:{
        'Content-Type' :'application/json',
      }
    })
    .then((response) => {
      if(response.data !== null) {
        const dataList = response.data
        geomX.value = dataList.geomX
        geomY.value = dataList.geomY
        comMapEditor.value.getMap().getView().setCenter([geomX.value, geomY.value]);
        comMapEditor.value.getMap().getView().setZoom(8);
      }else {
        // console.error ('Data is not an array:' , dataArray)
        return [];
      // }      
      }
    })
}
/**
 * 중심점 끝
 */

////////////////////////////////////////개발 영역///////////////////////////////////////////////////

/**
 *  Map 정보 호출 후 실행
 */
const fnMapLoaded = () => {

  comMapEditor.value.getMap().on('moveend', (evt) => {
    if (isHahuFcltsLayer && evt.frameState.viewState.zoom < 10) {
      alert('시설물정보는 읍면동(10레벨) 이상에서 조회가 가능합니다.');
      isHahuFcltsLayer = false;
      const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_HAHU_FCLTS_LAYER');
      if (searchLayer) {
        comMapEditor.value.getMap().removeLayer(searchLayer);
      }
    } else if (isKargSsnpLayer && evt.frameState.viewState.zoom < 8) {
      alert('국가지점번호판은 시군구(8레벨) 이상에서 조회가 가능합니다.');
      isKargSsnpLayer = false;
      const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_KARG_SSNP_LAYER');
      if (searchLayer) {
        comMapEditor.value.getMap().removeLayer(searchLayer);
      }
    }

    if(isKargSsnpLayer){
      const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_KARG_SSNP_LAYER');
      if (searchLayer) {
        if (evt.frameState.viewState.zoom < 10) {
          searchLayer.getSource().setDistance(200);
        } else {
          searchLayer.getSource().setDistance(1);
        }
      }
    }
  });

  fnAddAddrOverlay();
  fnAddSearchAddrInfo();

  fnInitLayer();

  comMapEditor.value.getMap().addOverlay(addrInfoMouseOver);
  comMapEditor.value.getMap().addOverlay(addrInfoMouseClick);
  comMapEditor.value.getMap().addOverlay(govMachMouseOver);
  comMapEditor.value.getMap().addOverlay(govMachMouseClick);
  comMapEditor.value.getMap().addOverlay(aotAddrMouseOver);
  comMapEditor.value.getMap().addOverlay(aotAddrMouseClick);
  comMapEditor.value.getMap().addOverlay(kargSsnpMouseOver);
  comMapEditor.value.getMap().addOverlay(kargSsnpMouseClick);
  comMapEditor.value.getMap().addOverlay(sprdIntrvlMouseClick);

  // 건물/건물군
  if (route.query?.searchType?.includes('spbd')) {
    if (route.query?.adrMngNo) {
      axios.post('/api/solr/solrGetBuldJusoInfo', {query : 'adrMngNo:' + route.query.adrMngNo})
      .then((res) => {
        if (res.status === 200) {
          if (res.data?.length) {
            fnClickSearchSpbd(res.data[0]);
          }
        }
      });
    }
    totalSearch.search_keyword = route.query.rdNm;
    fnTotalSearch();
  // 도로명
  } else if (route.query?.searchType?.includes('roadNm')) {
    if (route.query?.rdCd) {
      totalSearch.search_keyword = route.query.rdNm;
      fnTotalSearch();
      fnSearchRoadNameInfo({rnCd:route.query.rdCd, sigCd:route.query.sigCd});
    }
  // 우리집 주소는
  } else if (route.query?.searchType && route.query.searchType === 'myArea') {
    if (route.query?.rdMgtSn) {
      totalSearch.search_keyword = route.query.rdNm;
      fnTotalSearch();
      fnSearchMyArea({'rdMgtSn' : route.query.rdMgtSn});
    }
  // 사물주소
  } else if (route.query?.searchType && route.query.searchType === 'aot') {
    if (route.query?.thngMgno) {
      totalSearch.is_search_aot_addr = true;
      totalSearch.search_keyword = route.query.aotNm;
      fnTotalSearch();
      fnSearchAot({'thngMgno' : route.query.thngMgno});
    }
  // 우편번호
  } else if (route.query?.searchType && route.query.searchType === 'post') {
    if (route.query?.sbdno) {
      fnSearchPostNo({'sbdno' : route.query.sbdno});
    }
  // 지점번호
  } else if (route.query?.searchType && route.query.searchType === 'ssnp') {
    if (route.query?.ssn) {
      fnSearchSsnp({'ssn' : route.query.ssn});
    }
  } else {
    // comMapEditor.value.getMap().getView().setCenter([949219.3, 1947495.6]);
    comMapEditor.value.getMap().getView().setCenter([964688.3002607946, 1758248.4936671325]);// 전주
    // comMapEditor.value.getMap().getView().setCenter([1002442.364, 1813212.333]);// 국가지점번호판 테스트
    // comMapEditor.value.getMap().getView().setCenter([974948.7390899544, 1895721.4479178444]);// 민원행정기관 테스트
    comMapEditor.value.getMap().getView().setZoom(8);
  }

  measure.init(comMapEditor.value.fnGetMapClass());
}

/**
 * Map 정보 호출 후 실행
 */
const fnLoadCopyMap = () => {

  const copyMap = copyMapObj.value.getMap();
  const originMap = comMapEditor.value.getMap();

  copyMapObj.value.getMap().getView().setCenter(originMap.getView().getCenter());
  copyMapObj.value.getMap().getView().setZoom(originMap.getView().getZoom());

  // 레이어 복사
  originMap.getAllLayers().forEach(lyr => {
    if (lyr && lyr.get('layerName')) {
      if (lyr instanceof VectorLayer) {
        // 벡터 레이어 추가
        const option = {};

        option.wrapX = false;
        if (lyr.getSource().getUrl()) option.url = lyr.getSource().getUrl();
        if (lyr.getSource().getFormat()) option.format = lyr.getSource().getFormat();
        if (lyr.getSource().getFeatures()) option.features = lyr.getSource().getFeatures();

        const vectorSource = new VectorSource(option);
        const vectorLayer = new VectorLayer({
          layerName: lyr.get('layerName') ?? '',
          source: vectorSource,
          style: lyr.getStyleFunction.length ? lyr.getStyleFunction : lyr.getStyle(),
          zIndex: lyr.getZIndex(),
          visible: lyr.getVisible(),
          opacity: lyr.getOpacity(),
          minZoom: lyr.getMinZoom(),
          maxZoom: lyr.getMaxZoom(),
        });
        copyMap.addLayer(vectorLayer);
      } else if (lyr instanceof ImageLyr) {
        // 이미지 레이어 추가
        const imageSource = new ImageSource({
          url: lyr.getSource().getUrl(),
          params: lyr.getSource().getParams(),
          crossOrigin: 'anonymous',
        });

        const imageLayer = new ImageLyr({
          layerName: lyr.get('layerName') ?? '',
          source: imageSource,
          zIndex: lyr.getZIndex(),
        });
        copyMap.addLayer(imageLayer);
      }
    }
  });

  // 오버레이 복사
  originMap.getOverlays().forEach(ovly => {
    if (ovly) {
      const newElement = document.createElement('div');
      newElement.className = ovly.getElement().classList.value;
      // if (ovly.getElement() && ovly.getElement().innerHTML()) {
      //   newElement.innerHTML = ovly.getElement().innerHTML();
      // }
      const newOverlay = new Overlay({
        element: newElement,
        offset: ovly.getOffset(),
        position: ovly.getPosition(),
        positioning: ovly.getPositioning(),
        stopEvent: false,
        insertFirst: false,
        zIndex: 40000,
      });
      copyMap.addOverlay(newOverlay);
    }
  });

  copyMap.getControls().forEach(ctrl => {
    if (ctrl) {
      copyMap.removeControl(ctrl);
    }
  });
}

/**
 * 지도 테스트 개수 확인
 */
const fnKeyUpPrintText = () => {
  descTextCnt.value = descText.value.length;
}

/**
 * 지도 출력
 */
const fnPrint = () => {

  const copyMap = copyMapObj.value.fnGetMapClass();
  const copyMapId = copyMapObj.value.fnGetMapId();

  // 인쇄
  copyMap.getMap().once('rendercomplete', async () => {

    const mapCanvas = document.createElement('canvas');
    const size = copyMap.getMap().getSize();
    if (size) {
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
    }
    const mapContext = mapCanvas.getContext('2d');

    // 지도 레이어의 캔버스를 순회하며 내보내기 캔버스에 그립니다.
    Array.prototype.forEach.call(
      copyMap.getMap().getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
      function (canvas) {
        if (canvas.width > 0) {
          const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

          // 배경색이 있는 경우, 배경색을 적용합니다.
          const backgroundColor = canvas.parentNode.style.backgroundColor;
          if (backgroundColor) {
            mapContext.fillStyle = backgroundColor;
            mapContext.fillRect(0, 0, canvas.width, canvas.height);
          }

          let matrix;
          const transform = canvas.style.transform;
          if (transform) {
            // 스타일의 변환 행렬에서 변환 매개 변수를 가져옵니다.
            matrix = transform
              // eslint-disable-next-line no-useless-escape
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
          } else {
            matrix = [parseFloat(canvas.style.width) / canvas.width, 0, 0, parseFloat(canvas.style.height) / canvas.height, 0, 0];
          }

          // 내보내기 지도 컨텍스트에 변환을 적용합니다.
          CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
          mapContext.drawImage(canvas, 0, 0);
        }
      },
    );
    mapContext.globalAlpha = 1;

    // 오버레이 추가
    document.querySelectorAll('#' + copyMapId.value + ' .ol-overlay-container').forEach(async (elmt) => {
      if (elmt.querySelector('.ol-tooltip.ol-tooltip-static')) {
        await html2canvas(elmt.querySelector('.ol-tooltip.ol-tooltip-static'), {
          allowTaint: true,
          // foreignObjectRendering: true,
        }).then(scaleImg => {
          const matrix = new WebKitCSSMatrix(window.getComputedStyle(elmt).transform);
          mapContext.drawImage(scaleImg, matrix.e, matrix.f);
        });
      }
    });

    // 스케일 추가 유무
    if (document.querySelector('#' + copyMapId.value + ' .ol-scale-line .ol-scale-line-inner')) {
      await html2canvas(document.querySelector('#' + copyMapId.value + ' .ol-scale-line .ol-scale-line-inner'), {
        allowTaint: true,
        // foreignObjectRendering: true,
      }).then(scaleImg => {
        mapContext.drawImage(scaleImg, 20, mapCanvas.height - 30);
      });
    }

    if (navigator.msSaveBlob) {
      // link download attribute does not work on MS browsers
      navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
    } else {
      let dataUrl = mapCanvas.toDataURL();

      const iframe = document.createElement('iframe');

      // Make it hidden
      iframe.style.height = 0;
      iframe.style.visibility = 'hidden';
      iframe.style.width = 0;
      iframe.style.position = 'fixed';

      iframe.setAttribute('srcdoc', `
        <!DOCTYPE html>
        <html lang="ko">
          <body>
            <div style="width: 100vw;height: 99vh;text-align: center; vertical-align: middle;display:'inline-block';border:white solid 1px;">
              <div style="display:'inline-block';border:black solid 0px; ">
                <h3>안내도 출력</h3>
                <img src="${dataUrl}">
                <textarea style="width: 86%; height: 200px; border: 1px solid #c6c6c6; border-radius: 15px; padding: 5px;" > ${descText.value} </textarea>
              </div>
            </div>
          </body>
        </html>
      `);

      document.body.appendChild(iframe);

      iframe.addEventListener('load', function () {
        const body = iframe.contentDocument.body;
        body.style.textAlign = 'center';
        body.style.padding = 0;
        body.style.margin = 0;

        const image = iframe.contentDocument.getElementsByTagName('img')[0];
        image.style.maxWidth = '98%'; // 100%일 경우 2장에 인쇄됨
        //image.style.maxHeight = '50%';    // 적용안됨

        iframe.contentWindow.print();
      });

      iframe.contentWindow.addEventListener('afterprint', function () {
        iframe.parentNode.removeChild(iframe);
        fnClosePrintMapPopup();
      });
    }
  });
  copyMap.getMap().renderSync();
}

/**
 * 지도 출력 팝업 닫기
 */
const fnClosePrintMapPopup = () => {
  // 지도 초기화
  descText.value = '';
  descTextCnt.value = 0;
  isVisiblePrintMap.value = false;
}

/**
 *  Map 레이어 초기화
 */
const fnInitLayer = () => {

  buldEqbLayer = new VectorLayer({
    layerName: 'buldEqbLayer',
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetBasicStyle(ft, {
      icon: '/src/assets/images/mapEditor/icon/ico-ent.png',
      anchor: [0.5, 0.5],
      scale: 0.5,

    })
  });

  sprdManageLayer = new VectorLayer({
    layerName: 'sprdManageLayer',
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetSprdManageStyle(ft, { strokeColor: 'rgba(243,64,164,0.8)', strokeWidth: 5 }),
  });

  sprdIntrvlLayer = new VectorLayer({
    layerName: 'sprdIntrvlLayer',
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    zIndex: 1003,
    style: (ft, rslt) => mapStyles.fnGetSprdIntrvlStyle(ft, {}, rslt),
  });

  pointIconLayer = new VectorLayer({
    layerName: 'pointIconLayer',
    source: new VectorSource({
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetBasicStyle(ft, {
      scale: 1,
      anchor: [0.5, 1]
    }),
  });

  aotLayer = new VectorLayer({
    layerName: 'aotLayer',
    source: new VectorSource({
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetAotStyle(ft, {
      scale: 1.5,
      anchor: [0.5, 1.2]
    }),
  });

  postLayer = new VectorLayer({
    layerName: 'postLayer',
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetPostStyle(ft, {}),
  });

  ssnpLayer = new VectorLayer({
    layerName: 'ssnpLayer',
    source: new VectorSource({
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetBasicStyle(ft, {
      icon: '/src/assets/images/mapEditor/icon/ico-yellow-pin.png',
      scale : 1,
      anchor : [0.5, 1]
    }),
  });

  comMapEditor.value.getMap().addLayer(buldEqbLayer);
  comMapEditor.value.getMap().addLayer(sprdManageLayer);
  comMapEditor.value.getMap().addLayer(sprdIntrvlLayer);
  comMapEditor.value.getMap().addLayer(pointIconLayer);
  comMapEditor.value.getMap().addLayer(aotLayer);
  comMapEditor.value.getMap().addLayer(postLayer);
  comMapEditor.value.getMap().addLayer(ssnpLayer);
  //맵 이동 감지 
  comMapEditor.value.getMap().on('moveend', getCenterPos)
}

/**
 *  Map Zoom In
 */
const fnMapZoomIn = () => {
  comMapEditor.value.fnZoomIn();
}

/**
 *  Map Zoom Out
 */
const fnMapZoomOut = () => {
  comMapEditor.value.fnZoomOut();
}

/**
 *  Map 이미지 저장
 */
const fnSaveMap = () => {
  const imageType = selectedCategories.value;
  comMapEditor.value.fnSaveMap({ mimeType: imageType });
}

/**
 *  Map 거리 측정
 */
const fnMeasureDistance = () => {
  measure.start('LineString');
}

/**
 *  Map 면적 측정
 */
const fnMeasureArea = () => {
  measure.start('Polygon');
}

/**
 *  Map 측정 초기화
 */
const fnClearMeasure = () => {
  measure.stop();
  measure.clear();

  // 기초번호 버튼 초기화
  drawInteraction = null;
  // 레이어 초기화
  buldEqbLayer.getSource().clear();
  sprdManageLayer.getSource().clear();
  sprdIntrvlLayer.getSource().clear();
  pointIconLayer.getSource().clear();
  aotLayer.getSource().clear();
  postLayer.getSource().clear();
  ssnpLayer.getSource().clear();
  // 오버레이 초기화
  addrInfoMouseOverElmt.innerHTML = '';
  addrInfoMouseOver.setPosition(undefined);
  addrInfoMouseClickElmt.innerHTML = '';
  addrInfoMouseClick.setPosition(undefined);
  govMachMouseOverElmt.innerHTML = '';
  govMachMouseOver.setPosition(undefined);
  govMachMouseClickElmt.innerHTML = '';
  govMachMouseClick.setPosition(undefined);
  aotAddrMouseOverElmt.innerHTML = '';
  aotAddrMouseOver.setPosition(undefined);
  aotAddrMouseClickElmt.innerHTML = '';
  aotAddrMouseClick.setPosition(undefined);
  kargSsnpMouseOverElmt.innerHTML = '';
  kargSsnpMouseOver.setPosition(undefined);
  kargSsnpMouseClickElmt.innerHTML = '';
  kargSsnpMouseClick.setPosition(undefined);
  sprdIntrvlMouseClickElmt.innerHTML = '';
  sprdIntrvlMouseClick.setPosition(undefined);
}

/**
 * 그리기 모드 비활성화
 */
const fnDeactiveDrawMode = () => {
  if (drawInteraction) {
    comMapEditor.value.getMap().removeInteraction(drawInteraction);
    drawInteraction = null;
  }
}

/**
 * 그리기 모드 활성화
 */
const fnActiveDrawMode = (type) => {
  drawInteraction = new Draw({
    type: type,
    geometryFunction: (coord) => {
      fnSearchSprdIntrvl(coord);
    },
  });

  // 그리기 종료 후 비활성화
  drawInteraction.on('drawend', (ft) => {
    fnDeactiveDrawMode();
  });

  comMapEditor.value.getMap().addInteraction(drawInteraction);
}

/**
 * 기초번호 버튼 클릭
 */
const fnClickSprdIntrvl = () => {
  fnActiveDrawMode('Point');
}

// 포인트와 라인 거리 측정
const fnPointToLineDistance = (point, line) => {
  let pointGeometry = point.getGeometry();
  let lineGeometry = null;

  // 멀티라인스트링인 경우
  if(line.getGeometry() instanceof MultiLineString) {
    line.getGeometry().getLineStrings().forEach(geom => {
      lineGeometry = geom;
    });
  } else {
    lineGeometry = line.getGeometry();
  }

  const turfPoint = turf.point(pointGeometry.getCoordinates());
  const turfLine = turf.lineString(lineGeometry.getCoordinates());

  // 해당 feature를 wgs84로 컨버팅
  const cvtPoint = turf.toWgs84(turfPoint);
  const cvtLine = turf.toWgs84(turfLine);

  const distance = turf.pointToLineDistance(cvtPoint, cvtLine, {units: 'kilometers'});

  // km -> m로 변환
  return Math.round(distance * 1000 * 100) / 100;
}

/**
 *  기초번호 반경 조회
 */
const fnSearchSprdIntrvl = async (coord) => {

  if (coord) {
    const bufferPoint = 'Point(' + coord[0] + ' ' + coord[1] + ')';
    const encodeparam = encodeURIComponent('DWITHIN(geom,' + bufferPoint + ',50,meters)');

    const url = mapUtils.MAP_SERVER_URL + "/wfs?"
      + "SERVICE=WFS"
      + "&APIKEY=" + MAP_APIKEY
      + "&VERSION=1.1.1"
      + "&REQUEST=GetFeature"
      + "&outputFormat=application/json"
      + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_sprd_intrvl"
      + "&cql_filter="+encodeparam;

    // 클릭한 지점의 포인트 피쳐
    const picPoint = new Feature(new Point([...coord]));
    // 거리 비교용(50m 거리 제한)
    let chkDsts = 50;
    // 최소거리의 피쳐 임시 저장
    let chkFt = null;

    const res = await axios.get(url);
    if (res.status === 200) {
      if (res.data?.features?.length) {
        // 레이어 초기화
        sprdManageLayer.getSource().clear();
        sprdIntrvlLayer.getSource().clear();

        const format = new GeoJSON();
        const fts = format.readFeatures(res.data);

        fts.forEach(lft => {
          const distance = fnPointToLineDistance(picPoint, lft);
          if (distance < chkDsts) {
            chkDsts = distance;
            chkFt = lft;
          }
        });

        if (chkFt) {
          // const ft = format.readFeature(res.data.features[0]);
          const cql_filter = "sig_cd='" + chkFt.get('sig_cd') + "' and rds_man_no='" + chkFt.get('rds_man_no') + "'";

          // 기초구간 생성
          const resVal = await fnSearchSprdRoad(cql_filter);
          let rdNm = '';

          if (resVal && resVal.length) {
            // 도로구간 생성
            const sprdFt = format.readFeature(resVal[0]);
            sprdManageLayer.getSource().addFeature(sprdFt);
            rdNm = resVal[0].properties?.rn ?? '';
          }

          sprdIntrvlMouseClickElmt.innerHTML = `
            <div class="integratedMap__basicLayerPopup" >
              <div class="integratedMap__basicLayerPopupHeader">
                <p class="integratedMap__basicLayerPopupTitle">기초번호</p>
                <Button class="integratedMap__basicLayerPopupButton" id="sprdIntrvlInfoPopCloseBtn">
                  <span class="blind">팝업닫기</span>
                  <i aria-hidden="true" class="bi bi-x-lg"></i>
                </Button>
              </div>
              <div class="integratedMap__basicLayerPopupContent">
                ${rdNm} ${(chkFt.get('odd_bsi_sl') > 0 ? chkFt.get('odd_bsi_mn') + '-' + chkFt.get('odd_bsi_sl') : chkFt.get('odd_bsi_mn')) + ', '}
                ${(chkFt.get('eve_bsi_sl') > 0 ? chkFt.get('eve_bsi_mn') + '-' + chkFt.get('eve_bsi_sl') : chkFt.get('eve_bsi_mn'))}
              </div>
            </div>
          `;
          // 기초번호 조회 닫기 버튼 맵핑
          document.getElementById("sprdIntrvlInfoPopCloseBtn").addEventListener('click', () => {
            // 초기화
            sprdIntrvlMouseClickElmt.innerHTML = '';
            sprdIntrvlMouseClick.setPosition(undefined);
            // 레이어 초기화
            sprdManageLayer.getSource().clear();
            sprdIntrvlLayer.getSource().clear();
          });

          if (chkFt.getGeometry() instanceof MultiLineString && chkFt.getGeometry().getLineStrings().length) {
            sprdIntrvlMouseClick.setPosition(chkFt.getGeometry().getLineStrings()[0].getCoordinateAt(0.5));
            comMapEditor.value.getMap().getView().setCenter(chkFt.getGeometry().getLineStrings()[0].getCoordinateAt(0.5));
            comMapEditor.value.getMap().getView().setZoom(14);
          } else {
            sprdIntrvlMouseClick.setPosition(chkFt.getGeometry().getCoordinateAt(0.5));
            comMapEditor.value.getMap().getView().setCenter(chkFt.getGeometry().getCoordinateAt(0.5));
            comMapEditor.value.getMap().getView().setZoom(14);
          }
        }
      } else {
        alert('50m 반경 내에 가까운 기초번호를 찾을 수 없습니다.');
      }
    }
  }
}

/**
 * 시군구 데이터
 * @param type
 * @param ctpvCd
 */
const fnSearchSggData = async (type, ctpvCd) => {
  try {
    if (ctpvCd) {
      let data = await sggDataLoad(ctpvCd.value);
      data = [{ label: '선택', value: null }, ...data];

      if (type === 'detailSearchTab00Sgg') {
        detailSearch.tab00_params_sgg_data = data;
        detailSearch.tab00_params_sgg_val = null;
      } else if (type === 'detailSearchTab01Sgg') {
        detailSearch.tab01_params_sgg_data = data;
        detailSearch.tab01_params_sgg_val = null;
        detailSearch.tab01_params_emd_data = [];
        detailSearch.tab01_params_emd_val = null;
        detailSearch.tab01_params_tli_data = [];
        detailSearch.tab01_params_tli_val = null;
      } else if (type === 'detailSearchTab02Sgg') {
        detailSearch.tab02_params_sgg_data = data;
        detailSearch.tab02_params_sgg_val = null;
        detailSearch.tab02_params_emd_data = [];
        detailSearch.tab02_params_emd_val = null;
      } else if (type === 'detailSearchTab03Sgg') {
        detailSearch.tab03_params_sgg_data = data;
        detailSearch.tab03_params_sgg_val = null;
        detailSearch.tab03_params_start_char = '가';
        detailSearch.tab03_params_road_name = null;
        detailSearch.tab03_params_road_data = [];
      } else if (type === 'basicDistrictSgg') {
        basicDistrict.params_sgg_data = data;
        basicDistrict.params_sgg_val = null;
      } else if (type === 'mapCenterAddrSgg') {
        mapCenterAddr.params_sgg_data = data;
        mapCenterAddr.params_sgg_val = null;
        mapCenterAddr.params_emd_data = [];
        mapCenterAddr.params_emd_val = null;
      }
    }
  } catch (error) {
    // console.log('Error loading Sgg data', error);
  }
}

/**
 * 읍면동 데이터
 * @param type
 * @param lgvCd
 */
const fnSearchEmdData = async (type, lgvCd) => {
  try {
    if (lgvCd) {
      let data = await emdDataLoad(lgvCd.value);
      data = [{ label: '선택', value: null }, ...data];
      // console.log('######################type==>>'+type);
      if (type === 'detailSearchTab01Emd') {
        detailSearch.tab01_params_emd_data = data;
        detailSearch.tab01_params_emd_val = null;
        detailSearch.tab01_params_tli_data = [];
        detailSearch.tab01_params_tli_val = null;
      } else if (type === 'detailSearchTab02Emd') {
        detailSearch.tab02_params_emd_data = data;
        detailSearch.tab02_params_emd_val = null;
      } else if (type === 'mapCenterAddrEmd') {
        mapCenterAddr.params_emd_data = data;
        mapCenterAddr.params_emd_val = null;
      }
    }
  } catch (error) {
    // console.log('Error loading Emd data', error);
  }
}

/**
 * 리 데이터
 * @param type
 * @param emdCd
 */
const fnSearchTliData = async (type, emdCd) => {
  try {
    if (emdCd) {
      let data = await tliDataLoad(emdCd.value);
      data = [{ label: '선택', value: null }, ...data];
      if (type === 'detailSearchTab01Tli') {
        detailSearch.tab01_params_tli_data = data;
        detailSearch.tab01_params_tli_val = null;
      }
    }
  } catch (error) {
    // console.log('Error loading Tli data', error);
  }
}

/**
 * 도로명 데이터
 * @param type
 * @param lgvCd
 */
const fnSearchRoadNameData = async (type, lgvCd) => {
  try {
    if (lgvCd) {
      const params = {
        lgvCd: lgvCd.value
      }

      if (type === 'detailSearchTab00RoadName01') {
        params.startChar = '가';
        detailSearch.tab00_params_start_char = '가';
      } else if (type === 'detailSearchTab00RoadName02') {
        params.startChar = detailSearch.tab00_params_start_char.value;
      } else if (type === 'detailSearchTab03RoadName01') {
        params.startChar = '가';
        detailSearch.tab03_params_start_char = '가';
      } else if (type === 'detailSearchTab03RoadName02') {
        params.startChar = detailSearch.tab03_params_start_char.value;
      }

      let chosungData = null;
      let resData = await axios.post('/api/ahu/selectRoadNameChose', params);

      if (resData.data && Array.isArray(resData.data)) {
        chosungData = resData.data.map((item) => ({
          value: item.CHOSUNG_NM_CD,
          label: item.CHOSUNG_NM,
        }));
        chosungData = [{ label: '선택', value: null }, ...chosungData];
      } else {
        chosungData = [];
      }

      if (type.includes('detailSearchTab00RoadName')) {
        detailSearch.tab00_params_road_name = null;
        detailSearch.tab00_params_road_data = chosungData;
      } else {
        detailSearch.tab03_params_road_name = null;
        detailSearch.tab03_params_road_data = chosungData;
      }
    }
  } catch (error) {
    // console.log('Error loading Road Name data', error);
  }
}

/**
 * WFS Layer 호출
 * @param options (schema, layerName, zIndex, layerStyle, cqlFilter, featureId)
 */
const fnAddWfsLayer = async (options = {}) => {
  // 이미 존재하는 레이어인지 체크
  const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName(options.layerName + '_LAYER');

  if (searchLayer) {
    comMapEditor.value.getMap().removeLayer(searchLayer);
    if (options.isReturn) return;
  }

  const params = {
    SERVICE: 'WFS',
    version: '1.1.1',
    REQUEST: 'GetFeature',
    outputFormat: 'application/json',
    TYPENAME: options.schema + ':' + options.layerName,
  }

  //필터 사용시
  if (options.cqlFilter) params.cql_filter = options.cqlFilter;
  if (options.featureId) params.featureID = options.featureId;

  const sourceLayer = await new VectorSource({
    format: new GeoJSON(),
    loader: (extent, resolution, projection) => {
      const proj = projection.getCode();
      if (options.layerName === 'VBL_KARG_SSNP') {
        params.cql_filter = `((XCRD_VL / 0.3 - 333333) > ${extent[0]} and (XCRD_VL / 0.3 - 333333) < ${extent[2]}) and ((YCRD_VL / 0.3 - 333333) > ${extent[1]} and (YCRD_VL / 0.3 - 333333) < ${extent[3]})`;
      } else {
        params.BBOX = extent.join(',') + ',' + proj;
      }

      let url = options.url ?? mapUtils.MAP_SERVER_URL + '/wfs';
      url += '?SERVICE=WFS'
        + '&apikey='+ MAP_APIKEY
        + '&version=1.1.1'
        + '&REQUEST=GetFeature'
        + '&outputFormat=application/json'
        + '&TYPENAME=' + params.TYPENAME
        + (params.featureID ? '&featureID=' + params.featureID : '')
        + (params.cql_filter ? '&cql_filter=' + params.cql_filter : '')
        + ((params.BBOX && options.layerName !== 'VBL_KARG_SSNP')? '&BBOX=' + extent.join(',') + ',' + proj : '');

      // axios.post('/api/proxy/kais/wfs', params, {
      axios.get(url).then((res) => {
        if (res.status === 200) {
          if (res.data?.features) {
            const features = sourceLayer.getFormat().readFeatures(res.data);
            sourceLayer.addFeatures(features);
          }
        }
      });
    },
    strategy: bboxStrategy,
  });

  const vectorLayer = new VectorLayer({
    layerName: options.layerName + '_LAYER',
    source: sourceLayer,
    style: (ft) => {
      return options.style(ft);
    },
  });

  if (options.zIndex) vectorLayer.setZIndex(options.zIndex);
  if (options.minZoom) vectorLayer.setMinZoom(options.minZoom);
  if (options.maxZoom) vectorLayer.setMaxZoom(options.maxZoom);

  comMapEditor.value.getMap().addLayer(vectorLayer);

  return vectorLayer;
}

/**
 * WMS Layer 호출
 * @param options (schema, layerName, cqlFilter, featureId, zIndex, minZoom, maxZoom)
 */
const fnWmsView = (options = {}) => {
  const params = {
    'apikey': MAP_APIKEY,
    'LAYERS': options.schema + ':' + options.layerName, // 레이어 이름
    'VERSION': '1.1.1', // WMS 버전
    'FORMAT': 'image/png', // 이미지 포맷
    'CRS': 'EPSG:5179', //좌표계 설정
  };

  if (options.cqlFilter) params['CQL_FILTER'] = options.cqlFilter;
  if (options.featureId) params['featureID'] = options.featureId;

  const wmsSource = new ImageSource({
    url: mapUtils.MAP_SERVER_URL + '/wms', // WMS 서비스의 URL
    params: params,
  });

  const wmsLayer = new ImageLyr({
    layerName: options.layerName + '_LAYER',
    source: wmsSource,
  });

  if (options.zIndex) wmsLayer.setZIndex(options.zIndex);
  if (options.minZoom) wmsLayer.setMinZoom(options.minZoom);
  if (options.maxZoom) wmsLayer.setMaxZoom(options.maxZoom);

  comMapEditor.value.getMap().addLayer(wmsLayer);

  return wmsLayer;
};

/**
 *  기초구역 호출
 */
const fnCallKarbSbd = async () => {
  fnAddWfsLayer({
    schema: mapUtils.MAP_SERVER_SCHEMA,
    layerName: 'TBL_KARB_SBD',
    isReturn: true,
    url: mapUtils.MAP_SERVER_URL + '/wfs',
    style: (ft) => {
      const styleArr = [];
      let geometry = ft.getGeometry();

      styleArr.push(
        new Style({
          stroke: new Stroke({
            color: 'rgba(60,142,185,0.5)',
            width: 2,
          }),
        })
      );

      styleArr.push(
        new Style({
          geometry: () => {
            return geometry.getInteriorPoints();
          },
          text: new Text({
            text: ft.get('SBDNO') ? ft.get('SBDNO').toString() : '',
            font: 'bold 9px sans-serif',
            textAlign: 'center',
            fill: new Fill({
              color: 'rgba(60,142,185,0.7)',
            }),
            stroke: new Stroke({
              color: 'white',
              width: 1,
            }),
            rotateWithView: true,
          })
        })
      );

      return styleArr;
    },
    zIndex: 1001,
    minZoom: 7,
  });
}

/**
 *  행정구역 호출
 */
const fnCallGEmdBndry = async () => {
  // 이미 존재하는 레이어인지 체크
  const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('daip_emd_h_LAYER');

  if (searchLayer) {
    comMapEditor.value.getMap().removeLayer(searchLayer);
    return;
  } else {
    fnWmsView({
      schema: mapUtils.MAP_SERVER_SCHEMA,
      layerName: 'daip_emd_h',
      zIndex: 1002,
    });
  }
}

/**
 *  법정구역 호출
 */
const fnCallEmdBndry = async () => {
  // 이미 존재하는 레이어인지 체크
  const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('daip_emd_b_LAYER');

  if (searchLayer) {
    comMapEditor.value.getMap().removeLayer(searchLayer);
    return;
  } else {
    fnWmsView({
      schema: mapUtils.MAP_SERVER_SCHEMA,
      layerName: 'daip_emd_b',
      zIndex: 1002,
    });
  }
}

/**
 * 사물주소 조회
 * @param type
 */
const fnCallAotAddrPoint = async (type) => {

  if (comMapEditor.value.getMap().getView().getZoom() < 10) {
    if (confirm('시설물정보는 읍면동(10레벨) 이상에서 조회가 가능합니다.\n조회하시겠습니까?')) {
      comMapEditor.value.getMap().getView().setZoom(10);
    } else {
      return;
    }
  }

  // 지도 이벤트용
  isKadtAotMngLayer = true;

  fnAddWfsLayer({
    schema: mapUtils.MAP_SERVER_SCHEMA,
    layerName: 'VBL_KADT_AOT_MNG',
    cqlFilter: "THNG_TYPE_CD='" + type + "'",
    url: mapUtils.MAP_SERVER_URL + '/wfs',
    style: (ft) => {
      const styleArr = [];
      let iconImg = null;
      const thType = _.trim(ft.get('THNG_TYPE_CD'));

      // // 육교승강기
      // case "T30101" :
      // // 드론배달점
      // case "T10901" :
      // // 둔치주차장
      // case "T30201" :
      // // 지진옥외대피장소
      // case "T30301" :
      // // 버스정류장
      // case "T10401" :
      // // 택시승강장
      // case "T10402" :
      // // 졸음쉼터
      // case "T30601" :
      // // 지진해일긴급대피장소
      // case "T30302" :
      // // 소공원
      // case "T30501" :
      // // 비상급수시설
      // case "T10301" :
      // // 인명구조함
      // case "T10302" :
      // // 주차장
      // case "T30202" :
      // // 전기차충전소
      // case "T30701" :
      // // 공중전화
      // case "T10801" :
      // // 우체통
      // case "T10802" :
      // // 전동휠체어급속충전기
      // case "T10701" :
      // // 자전거거치대
      // case "T30801" :
      // // 비상소화장치
      // case "T10303" :
      // // 무더위쉼터
      // case "T10601" :
      // // 어린이 놀이시설
      // case "T30802" :
      // // 푸드트럭 허가구역
      // case "T31201" :
      // // 어린이공원
      // case "T30502" :

      if (type === thType) {
        iconImg = "/src/assets/images/mapEditor/icon/ico-aot-" + type + ".svg";
        // iconImg = "/src/assets/images/mapEditor/icon/ico-aot-T10302.svg";
      }

      if (iconImg) {
        styleArr.push(
          new Style({
            geometry: ft.getGeometry(),
            image: new Icon({
              src: iconImg,
              anchor: [0.5, 0.5],
              scale: 1,
            }),
          })
        );
      }
      return styleArr;
    },
    zIndex: 1003,
    minZoom: 9,
  });
}

/**
 * 민원행정기관 조회
 * @param type
 */
const fnCallGovMachPoint = async (type) => {

  if (comMapEditor.value.getMap().getView().getZoom() < 10) {
    if (confirm('시설물정보는 읍면동(10레벨) 이상에서 조회가 가능합니다.\n조회하시겠습니까?')) {
      comMapEditor.value.getMap().getView().setZoom(10);
    } else {
      return;
    }
  }

  // 지도 이벤트용
  isHahuFcltsLayer = true;

  fnAddWfsLayer({
    schema: mapUtils.MAP_SERVER_SCHEMA,
    layerName: 'VBL_HAHU_FCLTS',
    url: mapUtils.MAP_SERVER_URL + '/wfs',
    style: (ft) => {
      const styleArr = [];
      let iconImg = null;
      const bdType = _.trim(ft.get('FCLTS_LCLSF_CD')) + _.trim(ft.get('FCLTS_MCLSF_CD'));
      if (type === 'police' && ['1010', '1110', '1210', '1310'].some((rdNm) => rdNm === bdType)) {
        // 경찰서
        iconImg = '/src/assets/images/mapEditor/icon/ico-minwon-police.svg';
      } else if (type === 'school' && ['1020', '1120', '1220', '1320'].some((rdNm) => rdNm === bdType)) {
        // 학교
        iconImg = '/src/assets/images/mapEditor/icon/ico-minwon-school.svg';
      } else if (type === 'post' && ['1011', '1111', '1211', '1311'].some((rdNm) => rdNm === bdType)) {
        // 우체국
        iconImg = '/src/assets/images/mapEditor/icon/ico-minwon-post.svg';
      } else if (type === 'adm' && ['1012', '1112', '1212', '1312', '1412', '1013', '1113', '1213', '1313', '1413', '1513', '1014'].some((rdNm) => rdNm === bdType)) {
        // 관공서
        iconImg = '/src/assets/images/mapEditor/icon/ico-minwon-gov.svg';
      } else if (type === 'hospital' && ['1015', '1115', '1215', '1315', '1415'].some((rdNm) => rdNm === bdType)) {
        // 보건소
        iconImg = '/src/assets/images/mapEditor/icon/ico-minwon-hospital.svg';
      } else if (type === 'court' && ['1016', '1116', '1216', '1316', '1017', '1117', '1217'].some((rdNm) => rdNm === bdType)) {
        // 법원/병무
        iconImg = '/src/assets/images/mapEditor/icon/ico-minwon-court.svg';
      } else if (type === 'customs' && ['1018', '1118', '1019', '1119', '1219'].some((rdNm) => rdNm === bdType)) {
        // 관세/국세
        iconImg = '/src/assets/images/mapEditor/icon/ico-minwon-tax.svg';
      }

      if (iconImg) {
        styleArr.push(
          new Style({
            geometry: ft.getGeometry(),
            image: new Icon({
              src: iconImg,
              anchor: [0.5, 0.5],
              scale: 1,
            }),
          })
        );
      }
      return styleArr;
    },
    zIndex: 1003,
    minZoom: 9,
  });
}

/**
 * 국가지점번호판
 */
const fnCallKargSsnp = async () => {
  if (comMapEditor.value.getMap().getView().getZoom() < 8) {
    if (confirm('국가지점번호판은 시군구(8레벨) 이상에서 조회가 가능합니다.\n조회하시겠습니까?')) {
      comMapEditor.value.getMap().getView().setZoom(8);
    } else {
      return;
    }
  }

  // 지도 이벤트용
  isKargSsnpLayer = true;

  // 이미 존재하는 레이어인지 체크
  const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_KARG_SSNP_LAYER');

  if (searchLayer) {
    comMapEditor.value.getMap().removeLayer(searchLayer);
    // 피쳐 이벤트 삭제
    comMapEditor.value.getMap().un('pointermove', fnKargSsnpOverlay);
    comMapEditor.value.getMap().un('singleclick', fnAddKargSsnpInfo);
    return;
  }

  // 피쳐 이벤트 추가
  comMapEditor.value.getMap().on('pointermove', fnKargSsnpOverlay);
  comMapEditor.value.getMap().on('singleclick', fnAddKargSsnpInfo);


  const sourceLayer = await new VectorSource({
    format: new GeoJSON(),
    loader: (extent, resolution, projection) => {
      // const proj = projection.getCode();
      // params.BBOX = extent.join(',') + ',' + proj;

      const url = mapUtils.MAP_SERVER_URL + "/wfs?"
        + "SERVICE=WFS"
        + "&APIKEY=" + MAP_APIKEY
        + "&VERSION=1.1.1"
        + "&REQUEST=GetFeature"
        + "&outputFormat=application/json"
        + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":VBL_KARG_SSNP"
        + "&cql_filter=" + `(XCRD_VL > ${extent[0]} and XCRD_VL < ${extent[2]}) and (YCRD_VL  > ${extent[1]} and YCRD_VL  < ${extent[3]})`;

      axios.get(url)
      .then((res) => {
        if (res.status === 200) {
          if (res.data) {
            const features = sourceLayer.getFormat().readFeatures(res.data);
            sourceLayer.addFeatures(features);
          }
        }
      });
    },
    strategy: bboxStrategy,
  });

  const styleCache = {};
  const clusterSource = new Cluster({
    distance: 100,
    source: sourceLayer,
  });

  const vectorLayer = new VectorLayer({
    layerName: 'VBL_KARG_SSNP_LAYER',
    source: clusterSource,
    style: mapStyles.fnGetNatPoiNumStyle,
    zIndex: 1003,
    minZoom: 7,
  });

  comMapEditor.value.getMap().addLayer(vectorLayer);
}

/**
 * 통합검색 초기화
 */
const fnResetSearchInfo = () => {
  // 초기화
  fnInitAddrInfo();
  buldEqbLayer.getSource().clear();
}

/**
 * 통합검색
 */
const fnTotalSearch = (pageParams) => {

  if (totalSearch.search_keyword.length < 2) {
    alert("검색어는 두글자 이상 입력되어야 합니다.");
    return;
  } else {
    // 페이징 유무 체크
    if (pageParams) {
      inqCndParams.pageable.page = pageParams.page;
      // {page: params.page , size: params.rows, first: params.first}
    }

    // solr 호출
    inqCndParams.keyword = totalSearch.search_keyword;
    inqCndParams.strFirstSort = "none";

    if (isHistoryEnabled.value === true) {
      historyKeywordSave(inqCndParams.keyword);
    }

    isActiveRecentSearches.value = false;
    if (totalSearch.is_search_aot_addr) {
      inqCndParams.strAotYn = 'Y';
      axios.post('/api/solr/solrAotSearch', inqCndParams)
        .then((response) => {
          totalSearch.is_searched = true;
          const data = response.data;
          // console.log("############# result ->> ", data);
          if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
            totalSearch.search_result = data.results.content;
            pageInfo.totalRecords = data.results.totalElements;
            pageInfo.currentRecords = data.results.numberOfElements;
            pageInfo.totalPages = data.results.totalPages;
            totalSearch.result_count = data.results.totalElements;
          } else {
            totalSearch.search_result = data.results.content;
            pageInfo.totalRecords = 0;
            pageInfo.currentRecords = 0;
            pageInfo.totalPages = 0;
            totalSearch.result_count = 0;
          }
        })
        .finally(() => {
          //메세지 숨김
        });
    } else {
      inqCndParams.strAotYn = 'N';
      axios.post('/api/solr/solrKeywordSearch', inqCndParams)
        .then((response) => {
          totalSearch.is_searched = true;
          const data = response.data;
          // console.log("############# result ->> ", data);
          if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
            totalSearch.search_result = data.results.content;
            pageInfo.totalRecords = data.results.totalElements;
            pageInfo.currentRecords = data.results.numberOfElements;
            pageInfo.totalPages = data.results.totalPages;
            totalSearch.result_count = data.results.totalElements;
            if (data.results.content[0].schMode === 'SOLR') {
              totalSearch.result_msg = '검색결과';
            } else {
              totalSearch.result_msg = '검색결과가 없어 주변 주소로 검색한 결과';
            }
          } else {
            totalSearch.search_result = data.results.content;
            pageInfo.totalRecords = 0;
            pageInfo.currentRecords = 0;
            pageInfo.totalPages = 0;
            totalSearch.result_count = 0;
            totalSearch.result_msg = '검색결과';
          }
        })
        .finally(() => {
          //메세지 숨김
        });
    }
  }
}

/**
 * 상세검색
 */
const fnDetailSearch = (tabType, pageParams) => {

  let keyword = '';
  let url = '/api/solr/solrKeywordSearch';
  if (tabType === '00') {
    if (_.isEmpty(detailSearch.tab00_params_sido_val)) {
      alert("시도를 선택하세요.");
      return;
    } else if (_.isEmpty(detailSearch.tab00_params_sgg_val)) {
      alert("시군구를 선택하세요.");
      return;
    }

    // 페이징 유무 체크
    if (pageParams) {
      detailSearch.tab00_pageInfo.page = pageParams.page;
      inqCndParams.pageable.page = pageParams.page;
    } else {
      detailSearch.tab00_pageInfo.page = 0;
      inqCndParams.pageable.page = 0;
    }

    keyword = detailSearch.tab00_params_sido_val.label + " " + detailSearch.tab00_params_sgg_val.label +
      (detailSearch.tab00_params_road_name ? " " + detailSearch.tab00_params_road_name.label : "") +
      (detailSearch.tab00_params_bnmn ? " " + detailSearch.tab00_params_bnmn : "") +
      (detailSearch.tab00_params_bnsn ? " " + detailSearch.tab00_params_bnsn : "");
    detailSearch.tab00_search_keyword = keyword;

    inqCndParams.keyword = keyword;
    inqCndParams.strFirstSort = "road";
    inqCndParams.strAotYn = 'N';

  } else if (tabType === '01') {
    if (_.isEmpty(detailSearch.tab01_params_sido_val)) {
      alert("시도를 선택하세요.");
      return;
    } else if (_.isEmpty(detailSearch.tab01_params_sgg_val)) {
      alert("시군구를 선택하세요.");
      return;
    }

    // 페이징 유무 체크
    if (pageParams) {
      detailSearch.tab01_pageInfo.page = pageParams.page;
      inqCndParams.pageable.page = pageParams.page;
    } else {
      detailSearch.tab01_pageInfo.page = 0;
      inqCndParams.pageable.page = 0;
    }

    keyword = detailSearch.tab01_params_sido_val.label + " " + detailSearch.tab01_params_sgg_val.label +
      (detailSearch.tab01_params_emd_val ? " " + detailSearch.tab01_params_emd_val.label : "") +
      (detailSearch.tab01_params_tli_val ? " " + detailSearch.tab01_params_tli_val.label : "");
    detailSearch.tab01_search_keyword = keyword;

    inqCndParams.searchType = 'DETAIL';
    inqCndParams.dsgubuntext = 'jibun';
    inqCndParams.dscity1text = detailSearch.tab01_params_sido_val.label;
    inqCndParams.dscounty1text = detailSearch.tab01_params_sgg_val.label;
    inqCndParams.dsemd1text = detailSearch.tab01_params_emd_val ? detailSearch.tab01_params_emd_val.label : '';
    inqCndParams.dsri1text = detailSearch.tab01_params_tli_val ? detailSearch.tab01_params_tli_val.label : '';
    inqCndParams.dssan1text = detailSearch.tab01_params_mtn_se_cd ? '1' : '0';
    inqCndParams.dsbun1 = detailSearch.tab01_params_mno;
    inqCndParams.dsbun2 = detailSearch.tab01_params_sno;

    inqCndParams.keyword = keyword;
    inqCndParams.strFirstSort = "location";
    inqCndParams.strAotYn = 'N';
    url = '/api/solr/solrDetailSearch';
  } else if (tabType === '02') {
    if (_.isEmpty(detailSearch.tab02_params_sido_val)) {
      alert("시도를 선택하세요.");
      return;
    } else if (_.isEmpty(detailSearch.tab02_params_sgg_val)) {
      alert("시군구를 선택하세요.");
      return;
    } else if (_.isEmpty(detailSearch.tab02_params_emd_val)) {
      alert("읍면동을 선택하세요.");
      return;
    }

    // 페이징 유무 체크
    if (pageParams) {
      detailSearch.tab02_pageInfo.page = pageParams.page;
      inqCndParams.pageable.page = pageParams.page;
    } else {
      detailSearch.tab02_pageInfo.page = 0;
      inqCndParams.pageable.page = 0;
    }

    keyword = detailSearch.tab02_params_sido_val.label + " " + detailSearch.tab02_params_sgg_val.label +
      (detailSearch.tab02_params_emd_val ? " " + detailSearch.tab02_params_emd_val.label : "");
    detailSearch.tab02_search_keyword = keyword;

    inqCndParams.searchType = 'DETAIL';
    inqCndParams.dsgubuntext = 'building';
    inqCndParams.dscity1text = detailSearch.tab02_params_sido_val.label;
    inqCndParams.dscounty1text = detailSearch.tab02_params_sgg_val.label;
    inqCndParams.dsemd1text = detailSearch.tab02_params_emd_val ? detailSearch.tab02_params_emd_val.label : '';
    inqCndParams.dsbuilding1 = detailSearch.tab02_params_buld_nm;

    inqCndParams.keyword = keyword;
    inqCndParams.strFirstSort = "build";
    inqCndParams.strAotYn = 'N';
    url = '/api/solr/solrDetailSearch';
  } else if (tabType === '03') {
    if (_.isEmpty(detailSearch.tab03_params_sido_val)) {
      alert("시도를 선택하세요.");
      return;
    } else if (_.isEmpty(detailSearch.tab03_params_sgg_val)) {
      alert("시군구를 선택하세요.");
      return;
    } else if (_.isEmpty(detailSearch.tab03_params_road_name)) {
      alert("도로명을 선택하세요.");
      return;
    }

    // 페이징 유무 체크
    if (pageParams) {
      detailSearch.tab03_pageInfo.page = pageParams.page;
      inqCndParams.pageable.page = pageParams.page;
    } else {
      detailSearch.tab03_pageInfo.page = 0;
      inqCndParams.pageable.page = 0;
    }

    keyword = detailSearch.tab03_params_sido_val.label + " " + detailSearch.tab03_params_sgg_val.label +
      (detailSearch.tab03_params_road_name ? " " + detailSearch.tab03_params_road_name.label : "") +
      (detailSearch.tab03_params_bnmn ? " " + detailSearch.tab03_params_bnmn : "") +
      (detailSearch.tab03_params_bnsn ? " " + detailSearch.tab03_params_bnsn : "");
    detailSearch.tab03_search_keyword = keyword;

    inqCndParams.keyword = keyword;
    inqCndParams.strFirstSort = "road";
    inqCndParams.strAotYn = 'N';
  }

  axios.post(url, inqCndParams)
    .then((response) => {
      const data = response.data;
      // console.log("############# result ->> ", data);

      if (tabType === '00') {

        if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
          detailSearch.tab00_search_result = data.results.content;
          detailSearch.tab00_pageInfo.totalRecords = data.results.totalElements;
          detailSearch.tab00_pageInfo.currentRecords = data.results.numberOfElements;
          detailSearch.tab00_pageInfo.totalPages = data.results.totalPages;
          detailSearch.tab00_result_count = data.results.totalElements;
        } else {
          detailSearch.tab00_search_result = data.results.content;
          detailSearch.tab00_pageInfo.totalRecords = 0;
          detailSearch.tab00_pageInfo.currentRecords = 0;
          detailSearch.tab00_pageInfo.totalPages = 0;
          detailSearch.tab00_result_count = 0;
        }
      } else if (tabType === '01') {
        if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
          detailSearch.tab01_search_result = data.results.content;
          detailSearch.tab01_pageInfo.totalRecords = data.results.totalElements;
          detailSearch.tab01_pageInfo.currentRecords = data.results.numberOfElements;
          detailSearch.tab01_pageInfo.totalPages = data.results.totalPages;
          detailSearch.tab01_result_count = data.results.totalElements;
        } else {
          detailSearch.tab01_search_result = data.results.content;
          detailSearch.tab01_pageInfo.totalRecords = 0;
          detailSearch.tab01_pageInfo.currentRecords = 0;
          detailSearch.tab01_pageInfo.totalPages = 0;
          detailSearch.tab01_result_count = 0;
        }
      } else if (tabType === '02') {
        if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
          detailSearch.tab02_search_result = data.results.content;
          detailSearch.tab02_pageInfo.totalRecords = data.results.totalElements;
          detailSearch.tab02_pageInfo.currentRecords = data.results.numberOfElements;
          detailSearch.tab02_pageInfo.totalPages = data.results.totalPages;
          detailSearch.tab02_result_count = data.results.totalElements;
        } else {
          detailSearch.tab02_search_result = data.results.content;
          detailSearch.tab02_pageInfo.totalRecords = 0;
          detailSearch.tab02_pageInfo.currentRecords = 0;
          detailSearch.tab02_pageInfo.totalPages = 0;
          detailSearch.tab02_result_count = 0;
        }

      } else if (tabType === '03') {
        if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
          if (detailSearch.tab03_search_result.length === 0) {
            const cql_filter = "rn_cd='" + detailSearch.tab03_params_road_name.value + "' and sig_cd='" + detailSearch.tab03_params_sgg_val.value + "'";
            // 결과값이 있으면
            fnSearchSprdRoad(cql_filter);
          }
          detailSearch.tab03_search_result = data.results.content;
          detailSearch.tab03_pageInfo.totalRecords = data.results.totalElements;
          detailSearch.tab03_pageInfo.currentRecords = data.results.numberOfElements;
          detailSearch.tab03_pageInfo.totalPages = data.results.totalPages;
          detailSearch.tab03_result_count = data.results.totalElements;
        } else {
          detailSearch.tab03_search_result = data.results.content;
          detailSearch.tab03_pageInfo.totalRecords = 0;
          detailSearch.tab03_pageInfo.currentRecords = 0;
          detailSearch.tab03_pageInfo.totalPages = 0;
          detailSearch.tab03_result_count = 0;
        }
      }
    })
    .finally(() => {
      //메세지 숨김
    });
}

/**
 * 기초구역 검색
 */
const fnSearchBasicDistrict = (pageParams) => {

  // 페이징 유무 체크
  if (pageParams) {
    basicDistrict.pageable.page = pageParams.page;
  } else {
    basicDistrict.pageable.page = 0;
  }

  let url = '/api/totalMap/selectKarbSbdList';

  if (basicDistrict.districtNo.length > 2) {
  } else if (_.isEmpty(basicDistrict.params_sido_val?.value) && basicDistrict.districtNo.length < 3) {
    alert("시도를 선택하거나 구역번호를 3자리 이상 입력하세요.");
    return;
  } else if ((basicDistrict.params_sido_val?.value.substring(0, 2) !== '36' && _.isEmpty(basicDistrict.params_sgg_val?.value) && basicDistrict.districtNo.length < 3)) {
    alert("시군구를 선택하거나 구역번호를 3자리 이상 입력하세요.");
    return;
  }

  // 시도 파라미터 세팅
  if (basicDistrict.params_sido_val && basicDistrict.params_sido_val.value) {
    basicDistrict.ctpvCd = basicDistrict.params_sido_val.value.substring(0, 2);
  } else {
    basicDistrict.ctpvCd = '';
  }

  // 시구군 파라미터 세팅
  if (basicDistrict.params_sgg_val && basicDistrict.params_sgg_val.value) {
    basicDistrict.ctpvCd = ''
    basicDistrict.lgvReplcCd = basicDistrict.params_sgg_val.value;
  } else {
    basicDistrict.lgvReplcCd = '';
  }

  axios.post(url, basicDistrict)
    .then((response) => {
      const data = response.data;
      // console.log("############# result ->> ", data);
      if (data.results?.content?.length > 0) {
        basicDistrict.search_result = data.results.content;
        basicDistrict.pageable.totalRecords = data.results.totalElements;
        basicDistrict.pageable.currentRecords = data.results.numberOfElements;
        basicDistrict.pageable.totalPages = data.results.totalPages;
        basicDistrict.result_offset = data.results.pageable.offset;
        basicDistrict.result_count = data.results.totalElements;
      } else {
        basicDistrict.search_result = data.results.content;
        basicDistrict.pageable.totalRecords = 0;
        basicDistrict.pageable.currentRecords = 0;
        basicDistrict.pageable.totalPages = 0;
        basicDistrict.result_offset = 0;
        basicDistrict.result_count = 0;
      }
    })
    .finally(() => {
      //메세지 숨김
    });
}

/**
 * XY좌표 검색
 */
const fnSearchCoordinate = (pageParams) => {

  // 페이징 유무 체크
  if (pageParams) {
    xyPosition.pageable.page = pageParams.page;
  } else {
    xyPosition.pageable.page = 0;
  }

  if (!/^\d*[.]\d*$/.test(xyPosition.xPosition) && !/^\d*$/.test(xyPosition.xPosition)) {
    alert("X좌표를 형식에 맞게 입력하세요.");
    return;
  } else if (!/^\d*[.]\d*$/.test(xyPosition.yPosition) && !/^\d*$/.test(xyPosition.yPosition)) {
    alert("Y좌표를 형식에 맞게 입력하세요.");
    return;
  }
  const params = {
    xPos: xyPosition.xPosition,
    yPos: xyPosition.yPosition
  }

  axios.post('/api/totalMap/selectBuldEqbForCoordinateList', params)
  .then((response) => {
    const data = response.data;
    // console.log("############# result ->> ", data);
    if (data.results?.length > 1) {
      if (data.results[0].buld_type.includes('BULD')) {
        data.results.shift();
      }
      xyPosition.search_result = data.results;
      xyPosition.result_count = data.results.length;
    } else if (data.results?.length > 0) {
      xyPosition.search_result = data.results;
      xyPosition.result_count = data.results.length;
    } else {
      xyPosition.search_result = data.results;
      xyPosition.result_count = 0;
    }
  })
  .finally(() => {
    //메세지 숨김
  });
}

/**
 * 주소 오버레이 추가
 */
const fnAddAddrOverlay = () => {
  // 지도 마우스 오버
  comMapEditor.value.getMap().on('pointermove', (evt) => {
    if (isPointerMove) {
      isPointerMove = false;
      setTimeout(() => {
        isPointerMove = true;
      }, 50);
      addrInfoMouseOverElmt.innerHTML = '';
      addrInfoMouseOver.setPosition(undefined);
      comMapEditor.value.getMap().getTargetElement().style.cursor = '';

      comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {
        if (ft && ft.get('rn_addr') && lyr && lyr.get('layerName')?.includes('buldVectorTile')) {
          addrInfoMouseOverElmt.innerHTML = `
            <div class="integratedMap__moveLayerPopup" >
              <div class="integratedMap__moveLayerPopupContent">
                ${ft.get('rn_addr') ?? ''}
              </div>
            </div>
          `;
          addrInfoMouseOver.setPosition(evt.coordinate);
          comMapEditor.value.getMap().getTargetElement().style.cursor = 'pointer';
        }
      });
    }
  });
}

/**
 * 주소정보 조회 추가
 */
const fnAddSearchAddrInfo = () => {

  // 지도 클릭
  comMapEditor.value.getMap().on('singleclick', (evt) => {
    // 초기화
    fnInitAddrInfo();
    buldEqbLayer.getSource().clear();

    comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {
      if (ft && lyr && lyr.get('layerName') && lyr.get('layerName').includes('buldVectorTile')) {
        // console.log('###################################fnAddSearchAddrInfo===>', ft);
        let query = '';
        // 하이라이트  설정
        if (ft.get('eqb_man_sn') && ft.get('eqb_man_sn') === '0' && ft.get('bd_mgt_sn')) {
          query = 'bdMgtSn:' + ft.get('bd_mgt_sn');
        } else if (ft.get('eqb_man_sn') && ft.get('eqb_man_sn') !== '0' && ft.get('sig_cd')) {
          query = 'eqbManSn:' + ft.get('eqb_man_sn') + ' AND emdCd:' + ft.get('sig_cd');
        }
        // 클릭한 피쳐의 포인트 정보 전달(정보조회 위치 설정용)
        if (ft.getType() === 'Point' && ft.getFlatCoordinates().length === 2) {
          addrInfoMouseClickPosition = ft.getFlatCoordinates();
        }
        // 검색엔진에서 정보 조회
        axios.post('/api/solr/solrGetBuldJusoInfo', { query: query })
        .then((res) => {
          if (res.status === 200) {
            if (res.data?.length) {
              const searchBuld = res.data[0];
              // 마우스 오버 초기화
              addrInfoMouseOverElmt.innerHTML = '';
              addrInfoMouseOver.setPosition(undefined);

              searchBuld.clickPosition = addrInfoMouseClickPosition
              fnClickSearchSpbd(searchBuld);
            }
          }
        });
      }
    });
  });
}

/**
 * 사물주소 오버레이
 */
const fnAotAddrOverlay = (evt) => {
  if (isPointerMove) {
    isPointerMove = false;
    setTimeout(() => {
      isPointerMove = true;
    }, 50);
    aotAddrMouseOverElmt.innerHTML = '';
    aotAddrMouseOver.setPosition(undefined);
    comMapEditor.value.getMap().getTargetElement().style.cursor = '';

    comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {
      if (ft && lyr && lyr.get('layerName') && lyr.get('layerName').includes('VBL_KADT_AOT_MNG_LAYER')) {
        aotAddrMouseOverElmt.innerHTML = `
          <div class="integratedMap__moveLayerPopup" >
            <div class="integratedMap__moveLayerPopupContent">
              ${ft.get('THNG_NM') ?? ''}
            </div>
          </div>
        `;
        aotAddrMouseOver.setPosition(evt.coordinate);
        comMapEditor.value.getMap().getTargetElement().style.cursor = 'pointer';
      }
    });
  }
}

/**
 * 사물주소 정보 조회
 */
const fnAddAotAddrInfo = (evt) => {

  // 초기화
  aotAddrMouseClickElmt.innerHTML = '';
  aotAddrMouseClick.setPosition(undefined);

  try {
    comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {
      if (ft && lyr && lyr.get('layerName') && lyr.get('layerName').includes('VBL_KADT_AOT_MNG_LAYER')) {
        aotAddrMouseClickElmt.innerHTML = `
          <div class="integratedMap__basicLayerPopup" >
            <div class="integratedMap__basicLayerPopupHeader">
              <p class="integratedMap__basicLayerPopupTitle">${ft.get('THNG_NM')}</p>
              <Button class="integratedMap__basicLayerPopupButton" id="aotAddrInfoPopCloseBtn">
                <span class="blind">팝업닫기</span>
                <i aria-hidden="true" class="bi bi-x-lg"></i>
              </Button>
            </div>
            <div class="integratedMap__basicLayerPopupContent">
              ${ft.get('ROAD_NM_ADDR')}
            </div>
          </div>
        `;
        aotAddrMouseClick.setPosition(evt.coordinate);

        // 마우스 오버 오버레이 초기화
        aotAddrMouseOverElmt.innerHTML = '';
        aotAddrMouseOver.setPosition(undefined);


        // 정보조회 닫기 버튼 맵핑
        document.getElementById("aotAddrInfoPopCloseBtn").addEventListener('click', () => {
          // 초기화
          aotAddrMouseClickElmt.innerHTML = '';
          aotAddrMouseClick.setPosition(undefined);
        });
      }
    });
  } catch (e) {
  }
}

/**
 * 민원행정기관 오버레이
 */
const fnGovMachOverlay = (evt) => {
  if (isPointerMove) {
    isPointerMove = false;
    setTimeout(() => {
      isPointerMove = true;
    }, 50);
    govMachMouseOverElmt.innerHTML = '';
    govMachMouseOver.setPosition(undefined);
    comMapEditor.value.getMap().getTargetElement().style.cursor = '';

    comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {

      if (ft && lyr && lyr.get('layerName') && lyr.get('layerName').includes('VBL_HAHU_FCLTS_LAYER')) {
        govMachMouseOverElmt.innerHTML = `
          <div class="integratedMap__moveLayerPopup" >
            <div class="integratedMap__moveLayerPopupContent">
              ${ft.get('BD_NM') ?? ''}
            </div>
          </div>
        `;
        govMachMouseOver.setPosition(evt.coordinate);
        comMapEditor.value.getMap().getTargetElement().style.cursor = 'pointer';
      }
    });
  }
}

/**
 * 민원행정기관 조회 추가
 */
const fnAddGovMachInfo = async (evt) => {

  // 초기화
  govMachMouseClickElmt.innerHTML = '';
  govMachMouseClick.setPosition(undefined);

  try {
    comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {
      if (ft && (lyr && lyr.get('layerName') && lyr.get('layerName').includes('VBL_HAHU_FCLTS_LAYER'))) {

        govMachMouseClickElmt.innerHTML = `
          <div class="integratedMap__basicLayerPopup" >
            <div class="integratedMap__basicLayerPopupHeader">
              <p class="integratedMap__basicLayerPopupTitle">${ft.get('BD_NM') ?? ''}</p>
              <Button class="integratedMap__basicLayerPopupButton" id="hahuFcltsInfoPopCloseBtn">
                <span class="blind">팝업닫기</span>
                <i aria-hidden="true" class="bi bi-x-lg"></i>
              </Button>
            </div>
            <div class="integratedMap__basicLayerPopupContent">
              ${ft.get('ROAD_NM_ADDR') ?? ''}
              <br/>
              <span class="integratedMap__basicLayerPopupPhone"><i aria-hidden="true" class="bi bi-telephone-fill"></i>  ${ft.get('TELNO_CN') ?? ''}</span>
            </div>
          </div>
        `;
        govMachMouseClick.setPosition(evt.coordinate);

        // 마우스 오버 오버레이 초기화
        govMachMouseOverElmt.innerHTML = '';
        govMachMouseOver.setPosition(undefined);

        // 정보조회 닫기 버튼 맵핑
        document.getElementById("hahuFcltsInfoPopCloseBtn").addEventListener('click', () => {
          // 초기화
          govMachMouseClickElmt.innerHTML = '';
          govMachMouseClick.setPosition(undefined);
        });
      }
    });
  } catch (e) {
  }
}

/**
 * 국가지점번호판 오버레이
 */
const fnKargSsnpOverlay = (evt) => {
  if (isPointerMove) {
    isPointerMove = false;
    setTimeout(() => {
      isPointerMove = true;
    }, 50);
    kargSsnpMouseOverElmt.innerHTML = '';
    kargSsnpMouseOver.setPosition(undefined);
    comMapEditor.value.getMap().getTargetElement().style.cursor = '';

    comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {
      if (ft && ft.get('features') && ft.get('features').length && lyr && lyr.get('layerName') && lyr.get('layerName').includes('VBL_KARG_SSNP_LAYER')) {
        if (ft.get('features').length === 1 && ft.get('features')[0].get('SSN') && tempKargSsnpSsn !== ft.get('features')[0].get('SSN')) {
          kargSsnpMouseOverElmt.innerHTML = `
            <div class="integratedMap__moveLayerPopup" >
              <div class="integratedMap__moveLayerPopupContent">
                ${ft.get('features')[0].get('SSN')}
              </div>
            </div>
          `;
          kargSsnpMouseOver.setPosition(evt.coordinate);
          comMapEditor.value.getMap().getTargetElement().style.cursor = 'pointer';
        } else {
          kargSsnpMouseOverElmt.innerHTML = '';
          kargSsnpMouseOver.setPosition(undefined);
          comMapEditor.value.getMap().getTargetElement().style.cursor = '';
        }
      }
    });
  }
}

/**
 * 국가지점번호판 정보 조회
 */
const fnAddKargSsnpInfo = (evt) => {

  // 초기화
  kargSsnpMouseClickElmt.innerHTML = '';
  kargSsnpMouseClick.setPosition(undefined);
  tempKargSsnpSsn = '';

  try {
    comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {
      if (ft && ft.get('features') && ft.get('features').length && lyr && lyr.get('layerName') && lyr.get('layerName').includes('VBL_KARG_SSNP_LAYER')) {
        if (ft.get('features').length === 1) {
          kargSsnpMouseClickElmt.innerHTML = `
            <div class="integratedMap__basicLayerPopup" >
              <div class="integratedMap__basicLayerPopupHeader">
                <p class="integratedMap__basicLayerPopupTitle">${ft.get('features')[0].get('SSN')}</p>
                <Button class="integratedMap__basicLayerPopupButton" id="kargSsnpInfoPopCloseBtn">
                  <span class="blind">팝업닫기</span>
                  <i aria-hidden="true" class="bi bi-x-lg"></i>
                </Button>
              </div>
              <div class="integratedMap__basicLayerPopupContent">
                ${ft.get('features')[0].get('FCLTS_KND_CD_NM')}
              </div>
            </div>
          `;

          // 마우스 오버 오버레이 초기화
          kargSsnpMouseOverElmt.innerHTML = '';
          kargSsnpMouseOver.setPosition(undefined);

          // kargSsnpMouseClick.setPosition(evt.coordinate);
          kargSsnpMouseClick.setPosition(ft.get('features')[0].getGeometry().getCoordinates());
          tempKargSsnpSsn = ft.get('features')[0].get('SSN');

          // 정보조회 닫기 버튼 맵핑
          document.getElementById("kargSsnpInfoPopCloseBtn").addEventListener('click', () => {
            // 초기화
            kargSsnpMouseClickElmt.innerHTML = '';
            kargSsnpMouseClick.setPosition(undefined);
            tempKargSsnpSsn = '';
          });
        } else {
          comMapEditor.value.getMap().getView().animate({
            center: evt.coordinate,
            zoom: comMapEditor.value.getMap().getView().getZoom() + 1,
            duration: 500
          });
        }
      }
    });
  } catch (e) {
  }
}

/**
 * 검색 결과 클릭(건물 및 건물군 조회용)
 */
const fnClickSearchSpbd = (res) => {
  fnInitAddrInfo();

  if (res && res.eqbManSn && Number(res.eqbManSn) > 0) {
    fnGetSpbdEqb(res);
  } else if (res && res.bdMgtSn) {
    fnGetSpbdBuld(res);
  }
}

/**
 * 검색 결과 클릭(사물주소용)
 */
const fnClickSearchAot = (res) => {
  const thngMgno = res.objMngNo;
  fnSearchAot({ 'thngMgno': thngMgno });
}

/**
 * 검색 결과 클릭(기초번호)
 */
const fnClickSearchIntrvl = (res) => {
  const x = mapUtils.decrypt(parseFloat(res.d));
  const y = mapUtils.decrypt(parseFloat(res.k));

  comMapEditor.value.getMap().getView().setCenter([x, y]);
  comMapEditor.value.getMap().getView().setZoom(13);
}

/**
 * 검색 결과 클릭(XY좌표)
 */
const fnClickXYPosition = (res) => {
  let query = '';
  // 하이라이트  설정
  if (res.buld_type.includes('EQB')) {
    query = 'eqbManSn:' + res.eqb_man_sn + ' AND emdCd:' + res.sig_cd;
  } else  {
    query = 'bdMgtSn:' + res.bd_mgt_sn;
  }

  if(query) {
    axios.post('/api/solr/solrGetBuldJusoInfo', { query: query })
    .then((res) => {
      if (res.status === 200) {
        if (res.data?.length) {
          fnClickSearchSpbd(res.data[0]);
        }
      }
    });
  }
}

/**
 * 검색결과 클릭(기초구역)
 */
const fnClickSearchBasicDistrict = (res) => {
  const jsonData = JSON.parse(res.geom)
  const geom = comMapEditor.value.fnGetDrawClass().fnCreateGeom(jsonData.type, jsonData.coordinates)
  const feature = new Feature(geom)

  let searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_KARB_SBD_LAYER');
  if (searchLayer) {
    // comMapEditor.value.getMap().removeLayer(searchLayer);
    searchLayer.getSource().clear();
  } else {

    searchLayer = new VectorLayer({
      layerName: 'VBL_KARB_SBD_LAYER',
      source: new VectorSource({
        format: new GeoJSON(),
      }),
      zIndex: 1003,
      style: new Style({
        stroke: new Stroke({
          color: '#F85151',
          width: 3,
        }),
      }),
    });
    comMapEditor.value.getMap().addLayer(searchLayer);
  }
  searchLayer.getSource().addFeature(feature);
  comMapEditor.value.getMap().getView().fit(searchLayer.getSource().getExtent());
}

/**
 * 기초구간 탭 결과 클릭
 */
const fnSearchSprdRoad = async (cql_filter) => {
  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&APIKEY=" + MAP_APIKEY
    + "&VERSION=1.1.1"
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_sprd_manage"
    + "&cql_filter="+cql_filter;

  const resVal = await axios.get(url)
  .then((res) => {
    if (res.status === 200) {
      if (res.data?.features?.length) {
        let sig_cd = '';
        let cql_filter = '';
        const rds_man_no = [];
        res.data.features.forEach((ftJson) => {
          sig_cd = ftJson.properties.sig_cd;
          rds_man_no.push("'" + ftJson.properties.rds_man_no + "'");
        });
        cql_filter = "sig_cd='" + sig_cd + "' and rds_man_no in (" + rds_man_no.join(",") + ")"
        // console.log("####################################SEARCH TL_SPRD_MANAGE CQL_FILTER==>>" + cql_filter);

        fnGetSprdIntrvl(cql_filter);

        return res.data.features;
      }
    }
  });

  return resVal;
}

/**
 * 주소정보 조회 -> 도로명 정보 조회 클릭
 */
const fnSearchRoadNameInfo = (filter = {}) => {

  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&version=1.1.1"
    + "&APIKEY=" + MAP_APIKEY
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_sprd_manage"
    // + "&CQL_FILTER=rds_dpn_se=0 and rn_cd='" + rnCd + "' and sig_cd='" + sigCd + "'";
    + "&CQL_FILTER=rds_dpn_se=0 and rn_cd='" + filter.rnCd + "'";

  axios.get(url)
    .then((res) => {
      if (res.status === 200) {
        const format = new GeoJSON();
        if (res.data?.features?.length) {
          res.data.features.forEach((ftJson) => {
            const ft = format.readFeature(ftJson);
            sprdManageLayer.getSource().addFeature(ft);
          });
          comMapEditor.value.getMap().getView().fit(sprdManageLayer.getSource().getExtent());
        }
      }
    });
}

/**
 * 주소이야기 -> 우리집 주소는? 클릭
 */
const fnSearchMyArea = (options) => {
  axios.get('/api/solr/solrRoadSearch/' + options.rdMgtSn)
    .then((response) => {

      // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", response);

      // const url = mapUtils.MAP_SERVER_URL + "/wfs?"
      //   + "SERVICE=WFS"
      //   + "&version=1.1.0"
      //   + "&REQUEST=GetFeature"
      //   + "&outputFormat=application/json"
      //   + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_sprd_manage"
      //   // + "&CQL_FILTER=rds_dpn_se=0 and rn_cd='" + rnCd + "' and sig_cd='" + sigCd + "'";
      //   + "&CQL_FILTER=rds_dpn_se=0 and rn_cd='" + rnCd + "'";
      //
      // axios.get(url)
      //   .then((res) => {
      //     if(res.status === 200) {
      //       const format = new GeoJSON();
      //       if (res.data?.features?.length) {
      //         res.data.features.forEach((ftJson) => {
      //           const ft = format.readFeature(ftJson);
      //           sprdManageLayer.getSource().addFeature(ft);
      //         });
      //       }
      //       comMapEditor.value.getMap().getView().fit(sprdManageLayer.getSource().getExtent());
      //     }
      //   });
    })
    .catch(error => {
      console.error("error =>", error);
    });
}

/**
 * 사물주소 클릭
 */
const fnSearchAot = async (params) => {

  const pointArr = [];
  let popPosition = null;
  const format = new GeoJSON();
  let ft = null;

  aotLayer.getSource().clear();
  fnInitAddrInfo();

  const aotGeomArr = await axios.post('/api/totalMap/selectKadtAotList', params)
    .then((res) => {
      if (res.status === 200) {
        if (res.data?.results?.length) {
          return res.data.results;
        }
      }
    });

  const aotInfoArr = await axios.post('/api/solr/solrGetAotInfo', { query: 'objMngNo:' + params.thngMgno })
    .then((res) => {
      if (res.status === 200) {
        if (res.data?.length) {
          return res.data;
        }
      }
    });

  if (aotInfoArr.length && aotGeomArr.length) {
    aotGeomArr.forEach((item) => {
      if (item.pointGid && item.pointGeom) {
        pointArr.push(item);
        ft = format.readFeature(item.pointGeom);
        if (item.rprsAddrYn === 'Y') {
          if (ft.getGeometry() instanceof MultiPoint) {
            popPosition = ft.getGeometry().getFirstCoordinate();
          } else {
            popPosition = ft.getGeometry().getCoordinates();
          }
        }
      } else if (item.lnGid && item.lnGeom) {
        ft = format.readFeature(item.lnGeom);
      } else if (item.sideGid && item.sideGeom) {
        ft = format.readFeature(item.sideGeom);
      }
      aotLayer.getSource().addFeature(ft);
    });
    comMapEditor.value.getMap().getView().fit(aotLayer.getSource().getExtent());

    let searchInfo = `
          <div class="infoInquiryLayerpopup" style="display:block">
            <div class="informationInquiry__layerPopup">
              <div class="informationInquiry__header">
                <p class="informationInquiry__title">정보조회</p>
                <button type="button" id="searchInfoPopCloseBtn" class="informationInquiry__button" title="팝업닫기">
                  <span class="blind">팝업닫기</span>
                  <i aria-hidden="true" class="bi bi-x-lg"></i>
                </button>
              </div>
              <div class="informationInquiry__inquiryAdressWrap type01">
                <div class="informationInquiry__inquiryAdress">
                  <dl class="informationInquiry__information">
                    <dt>${aotInfoArr[0].objNm}</dt>
                    <dd id="bdInfo_rodaNmArea" >${aotInfoArr[0].bdSnTxt}</dd>
                  </dl>
                  <div class="informationInquiry__inquiryAdressFunction">
                    <button type="button" id="bdInfo_engBtn" class="informationInquiry__inquiryAdressButton" title="영문">영문</button>
                    <button type="button" id="bdInfo_copyRdNm" class="informationInquiry__inquiryAdressButton" title="복사">복사</button>
                  </div>
                </div>
              </div>
              <div class="informationInquiry__doorway">
                <p class="informationInquiry__doorwayTitle">출입구정보</p>
                <div class="commonTable__wrap type01">
                  <table class="commonTable__vertical">
                    <thead>
                      <th>순번</th>
                      <th>구분</th>
                      <th>주소</th>
                      <th>주출입구</th>
                    </thead>
                    <tbody>
        `;



    if (pointArr.length) {
      pointArr.forEach((item, idx) => {
        searchInfo += `
                      <tr>
                        <td>${idx + 1}</td>
                        <td>입출구</td>
                        <td>${item.roadNmAddr}</td>
                        <td>${item.rprsAddrYn === 'Y' ? '주출입구' : '보조출입구'}</td>
                      </tr>
            `;
      });
    }

    searchInfo += `
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;

    addrInfoMouseClickElmt.innerHTML = searchInfo;
    addrInfoMouseClick.setPosition(popPosition);

    // 정보조회 닫기 버튼 맵핑
    document.getElementById("searchInfoPopCloseBtn").addEventListener('click', () => {
      fnInitAddrInfo();
      aotLayer.getSource().clear();
    });

    // 정보조회 국문/영문 버튼 맵핑
    document.getElementById("bdInfo_engBtn").addEventListener('click', () => {
      fnClickEngRdNmBtn({ schKorRoadNm: aotInfoArr[0].bdSnTxt, schEngRoadNm: aotInfoArr[0].bdEngSn });
    });
    // 정보조회 복사 버튼 맵핑
    document.getElementById("bdInfo_copyRdNm").addEventListener('click', () => {
      fnClickRoadAddrCopyBtn({ schKorRoadNm: aotInfoArr[0].bdSnTxt, schEngRoadNm: aotInfoArr[0].bdEngSn });
    });

    // 정보조회 팝업 draggable
    $('.infoInquiryLayerpopup').draggable({
      cursor: 'move',
      handle: '.informationInquiry__header',
      start: (evt) => {
        // 마우스로 지도 이동 비활성화
        comMapEditor.value.getMap().getInteractions().getArray().forEach(function (interaction) {
          if (interaction instanceof DragPan) {
            interaction.setActive(false);
          }
        });
      },
      stop: (evt) => {
        // 마우스로 지도 이동 활성화
        comMapEditor.value.getMap().getInteractions().getArray().forEach(function (interaction) {
          if (interaction instanceof DragPan) {
            interaction.setActive(true);
          }
        });
      },
    });
  }
}

/**
 * 우편번호 검색
 */
const fnSearchPostNo = (filter = {}) => {
  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&APIKEY=" + MAP_APIKEY
    + "&VERSION=1.1.1"
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":TBL_KARB_SBD"
    + "&cql_filter=" + "sbdno='" + filter.sbdno + "'";

  axios.get(url)
  .then((res) => {
    if (res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          postLayer.getSource().addFeature(ft);
        });
        comMapEditor.value.getMap().getView().fit(postLayer.getSource().getExtent());
      }
    }
  });
}

/**
 * 지점번호 검색
 */
const fnSearchSsnp = (filter = {}) => {
  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&APIKEY=" + MAP_APIKEY
    + "&VERSION=1.1.1"
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":VBL_KARG_SSNP"
    + "&cql_filter=" + "ssn='" + filter.ssn + "'";

  axios.get(url)
  .then((res) => {
    if(res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          ssnpLayer.getSource().addFeature(ft);

          kargSsnpMouseClickElmt.innerHTML = `
            <div class="integratedMap__basicLayerPopup" >
              <div class="integratedMap__basicLayerPopupHeader">
                <p class="integratedMap__basicLayerPopupTitle">${ft.get('SSN')}</p>
                <Button class="integratedMap__basicLayerPopupButton" id="kargSsnpInfoPopCloseBtn">
                  <span class="blind">팝업닫기</span>
                  <i aria-hidden="true" class="bi bi-x-lg"></i>
                </Button>
              </div>
              <div class="integratedMap__basicLayerPopupContent">
                ${ft.get('FCLTS_KND_CD_NM')}
              </div>
            </div>
          `;
          kargSsnpMouseClick.setPosition(ft.getGeometry().getCoordinates());
        });

        // 정보조회 닫기 버튼 맵핑
        document.getElementById("kargSsnpInfoPopCloseBtn").addEventListener('click', () => {
          // 초기화
          kargSsnpMouseClickElmt.innerHTML = '';
          kargSsnpMouseClick.setPosition(undefined);
          ssnpLayer.getSource().clear();
        });

        comMapEditor.value.getMap().getView().setCenter(getCenter(ssnpLayer.getSource().getExtent()));
        comMapEditor.value.getMap().getView().setZoom(11);
      }
    }
  });
}

/**
 * 정보조회 초기화
 */
const fnInitAddrInfo = () => {
  addrInfoMouseClickElmt.innerHTML = '';
  addrInfoMouseClick.setPosition(undefined);
  // 국문/영문 버튼 초기화
  bdInfo_isEngRdNm = false;
}

/**
 * 정보조회 영문/국문 전환 버튼 클릭
 */
const fnClickEngRdNmBtn = (params) => {
  let rdNm = '';
  let btnTxt = '';

  if (bdInfo_isEngRdNm) {
    rdNm = params.schKorRoadNm;
    btnTxt = '영문';
  } else {
    rdNm = params.schEngRoadNm;
    btnTxt = '국문';
  }

  bdInfo_isEngRdNm = !bdInfo_isEngRdNm;
  document.getElementById('bdInfo_rodaNmArea').innerText = rdNm;
  document.getElementById('bdInfo_engBtn').innerText = btnTxt;
}

/**
 * 정보조회 주소 복사 버튼 클릭
 */
const fnClickRoadAddrCopyBtn = (params) => {
  let rdNm = '';

  if (bdInfo_isEngRdNm) {
    rdNm = params.schEngRoadNm;
  } else {
    rdNm = params.schKorRoadNm;
  }

  const copyTxt = document.createElement("input");
  document.body.appendChild(copyTxt);
  copyTxt.value = rdNm;
  copyTxt.select();

  if (document.execCommand("copy")) {
    alert("도로명주소가 클립보드로 복사 되었습니다.\n" + rdNm);
    document.body.removeChild(copyTxt);
  } else {
    alert("복사기능을 사용할 수 없는 브라우저입니다.");
    document.body.removeChild(copyTxt);
  }
}

/**
 * 동 데이터 조회
 */
const fnSearchJusoDongData = (params) => {
  //상세주소 조회 - 동조회
  // 임시 데이터
  params.schMode = "D";
  params.adrMngNo = "BBT00000451110093788";
  axios.post('/api/search/selectJusoDetail', detailParams)
    .then((response) => {
      const data = response.data.results;
      // console.log('############################selectJusoDetail==>>',data);
      // if (data.length > 0) {
      //   dongItems.value[index] = data.map((item) => ({
      //     value: item.KEY,
      //     label: item.VALUE,
      //   }))
      // }
    })
    .finally(() => {
      //메세지 숨김AhtAddressTransformOffer
    });
}

/**
 * 주소정보 팝업 -> 도로정보 조회
 */
const fnSearchRoadInfo = async (params = {}) => {
  // const testRdMgtSn = params.rdMgtSn;
  const testRdMgtSn = "1144022113001";

  await axios.get('/api/ahs/selectRoadLocation/' + testRdMgtSn)
    .then(async (res) => {
      if (res.data !== null) {
        // console.log("테스트 =======>", res.data.results.list[0])
        searchInfoPopupResult.roadInfoData = { ...res.data.results.list[0] };
      }
    });
}
/**
 * 주소정보 팝업 -> 변동이력 조회
 */
const fnSearchHistoryInfo = async (params = {}) => {
  const detailParams = {
    // adrMngNo : params.adrMngNo,
    adrMngNo: "BBT00000451110087495",
  }
  await axios.post('/api/search/history-list', detailParams)
    .then((response) => {
      searchInfoPopupResult.historyInfoData = response.data.results;
      // console.log("############# result ->> ", response);
      // sales.value = data;
    });
}

/**
 * 주소정보 조회 추가
 */
const fnAddAddrInfo = async (isBdInfo, position, params = {}) => {
  // 도로정보 조회
  await fnSearchRoadInfo();
  // 변동이력 조회
  await fnSearchHistoryInfo();

  let searchInfo = `
    <div class="infoInquiryLayerpopup"  style="display:block">
      <div class="informationInquiry__layerPopup">
        <div class="informationInquiry__header">
          <p class="informationInquiry__title">정보조회</p>
          <button type="button" id="searchInfoPopCloseBtn" class="informationInquiry__button" title="팝업닫기">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg"></i>
          </button>
          <button class="informationInquiry__headerFunction" title="내용더보기">
            <span class="blind">내용 더보기</span>
          </button>
        </div>

        <ul class="informationInquiry__tab">
          <li class="active">
            <button type="button" id="searchInfoPopBuldInfoBtn" class="informationInquiry__tabButton" role="tab"
                aria-selected="true" aria-controls="tab1__content" title="건물정보 보기">
              건물정보
            </button>
          </li>
          <li>
            <button type="button" id="searchInfoPopRoadInfoBtn" class="informationInquiry__tabButton" role="tab"
                aria-selected="false" aria-controls="tab2__content" title="도로정보 보기">
              도로정보
            </button>
          </li>
          <li>
            <button type="button" id="searchInfoPopHistoryInfoBtn" class="informationInquiry__tabButton" role="tab"
                aria-selected="false" aria-controls="tab3__content" title="변동이력 보기">
              변동이력
            </button>
          </li>
        </ul>
        <div id="tab1__content" role="tabpanel" class="informationInquiry__content active">
          <div class="informationInquiry__inquiryAdressWrap">
            <div class="informationInquiry__inquiryAdress">
              <div class="informationInquiry__inquiryAdressNumber">${params.zipCl}</div>
              <p class="informationInquiry__inquiryAdressText" id="bdInfo_rodaNmArea">${params.schKorRoadNm}</p>
              <div class="informationInquiry__inquiryAdressFunction">
                <button type="button" id="bdInfo_engBtn" class="informationInquiry__inquiryAdressButton" title="영문">영문</button>
                <button type="button" id="bdInfo_copyRdNm" class="informationInquiry__inquiryAdressButton" title="복사">복사</button>
              </div>
            </div>
          </div>
          <div class="informationInquiry__listDetail">
            <p class="informationInquiry__listDetailTitle">지번주소</p>
            <div class="informationInquiry__listDetailContent">
                ${params.schKorJibunNm}
            </div>
            <p class="informationInquiry__listDetailTitle">관할주민센터</p>
            <div class="informationInquiry__listDetailContent">
              <ul class="informationInquiry__communityCenter">
                <li>
                  ${params.juminCenter_01}
                  <span class="informationInquiry__phone"><i aria-hidden="true" class="bi bi-telephone-fill"></i> ${params.juminCenterNumber_01}</span>
                </li>
                <li style="display:${params.juminCenter_02 ? 'block' : 'none'}">
                  ${params.juminCenter_02}
                  <span class="informationInquiry__phone"><i aria-hidden="true" class="bi bi-telephone-fill"></i> ${params.juminCenterNumber_02}</span>
                </li>
              </ul>
              <ul class="informationInquiry__tip">
                <li><span class="commonBullet">※</span> 관할주민센터는 참고정보이며, 실제와 다를 수 있습니다.</li>
                <li style="display:${params.juminCenter_02 ? 'block' : 'none'}">
                  <span class="commonBullet">※</span> 해당주소는 관할주민센터가 2개이므로, 자세한 사항은 자치단체에 문의하시기 바랍니다.
                </li>
              </ul>
            </div>
            <p class="informationInquiry__listDetailTitle">건물명</p>
            <div class="informationInquiry__listDetailContent">
              ${params.bdNm ? params.bdNm : '-'}
              <span>
                <button type="button" class="informationInquiry__detailAdressButton" title="상세주소(동·층·호) 열기" style="display:none">
                  <span>상세주소(동·층·호) 보기</span> <i aria-hidden="true" class="bi bi-chevron-down"></i>
                </button>
              </span>
            </div>
          </div>
          <div class="informationInquiry__detailAdress" style="display:none">
            <ul class="informationInquiry__eastWestFloor">
              <li>
                <label for="east" class="blind">동 선택</label>
                <select  class="informationInquiry__eastWestFloorSelect" id="east" title="동 선택하기">
                  <option>동 선택</option>
                </select>
              </li>
              <li>
                <label for="west" class="blind">층 선택</label>
                <select  class="informationInquiry__eastWestFloorSelect" id="west" title="층 선택하기">
                  <option>층 선택</option>
                </select>
              </li>
              <li>
                <label for="floor" class="blind">호 선택</label>
                <select  class="informationInquiry__eastWestFloorSelect" id="floor" title="호 선택하기">
                  <option>호 선택</option>
                </select>
              </li>
            </ul>
            <div class="informationInquiry__innerBox">
              <span class="informationInquiry__innerBoxText">서울 특별시 용산구 서빙고로 137 (용산6가) </span>
              <button type="button" class="informationInquiry__copyButton" title="주소복사하기">복사</button>
            </div>
            <p class="informationInquiry__eastWestFloorTip"><span class="commonBullet">※</span> 위 주소는 '호'에 '층'정보가 포함되어 있어 층을 생략하고 표기할 수 있습니다.</p>
          </div>
        </div>
        <div id="tab2__content" role="tabpanel" class="informationInquiry__content">
          <div class="informationInquiry__inquiryAdressWrap">
            <div class="informationInquiry__inquiryAdress road">
              <p class="informationInquiry__inquiryAdressText">${searchInfoPopupResult.roadInfoData?.rdNm}</p>
              <div class="informationInquiry__inquiryAdressFunction">
                <button type="button" class="informationInquiry__inquiryAdressButton" title="도로 구간 보기">
                  도로 구간 보기
                </button>
                <button type="button" class="informationInquiry__inquiryAdressButton" title="기초 번호 보기">
                  기초 번호 보기
                </button>
              </div>
            </div>
          </div>
          <div class="informationInquiry__listDetail">
            <p class="informationInquiry__listDetailTitle">기점</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.srtCn}
            </div>
            <p class="informationInquiry__listDetailTitle">종점</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.endCn}
            </div>
            <p class="informationInquiry__listDetailTitle">길이(m)</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.roadLt}
            </div>
            <p class="informationInquiry__listDetailTitle">고시일</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.noticeYmd}
            </div>
            <p class="informationInquiry__listDetailTitle">효력발생일</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.effectDe}
            </div>
            <p class="informationInquiry__listDetailTitle">도로명 부여사유</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.grantDe}
            </div>
          </div>
        </div>
        <div id="tab3__content" role="tabpanel" class="informationInquiry__content">
          <div class="informationInquiry__inquiryAdressWrap">
            <div class="informationInquiry__inquiryAdress road">
              <p class="informationInquiry__inquiryAdressText">${params.schKorRoadNm}</p>
            </div>
          </div>
          <div class="informationInquiry__doorway">
<!--            <p class="informationInquiry__doorwayTitle">출입구정보</p>-->
            <div class="commonTable__wrap type01">
              <table class="commonTable__vertical">
                <thead>
                  <th>변동일자</th>
                  <th>주소</th>
                  <th>고시여부</th>
                  <th>읍면동</th>
                  <th>변동구분</th>
                </thead>
                <tbody>
  `;

  if (searchInfoPopupResult.historyInfoData) {
    searchInfoPopupResult.historyInfoData.forEach(item => {
      searchInfo += `
                  <tr>
                    <td>${item.updtDt}</td>
                    <td>${item.rnAddr}</td>
                    <td>${item.ancmntYn}</td>
                    <td>${item.emdNm}</td>
                    <td>${item.jobSeNm}</td>
                  </tr>
      `;
    });
  }

  searchInfo += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  addrInfoMouseClickElmt.innerHTML = searchInfo;

  // 정보조회 닫기 버튼 맵핑
  document.getElementById("searchInfoPopCloseBtn").addEventListener('click', () => {
    fnInitAddrInfo();
    buldEqbLayer.getSource().clear();
  });
  // 정보조회 국문/영문 버튼 맵핑
  document.getElementById("bdInfo_engBtn").addEventListener('click', () => {
    fnClickEngRdNmBtn(params);
  });
  // 정보조회 복사 버튼 맵핑
  document.getElementById("bdInfo_copyRdNm").addEventListener('click', () => {
    fnClickRoadAddrCopyBtn(params);
  });
  // 정보조회 건물정보 탭
  document.getElementById("searchInfoPopBuldInfoBtn").addEventListener('click', () => {
    document.getElementById("tab1__content").style.display = 'block';
    document.getElementById("tab2__content").style.display = 'none';
    document.getElementById("tab3__content").style.display = 'none';
    document.getElementById("searchInfoPopBuldInfoBtn").parentElement.classList.add('active');
    document.getElementById("searchInfoPopRoadInfoBtn").parentElement.classList.remove('active');
    document.getElementById("searchInfoPopHistoryInfoBtn").parentElement.classList.remove('active');
  });
  // 정보조회 건물정보 탭
  document.getElementById("searchInfoPopRoadInfoBtn").addEventListener('click', () => {
    document.getElementById("tab1__content").style.display = 'none';
    document.getElementById("tab2__content").style.display = 'block';
    document.getElementById("tab3__content").style.display = 'none';
    document.getElementById("searchInfoPopBuldInfoBtn").parentElement.classList.remove('active');
    document.getElementById("searchInfoPopRoadInfoBtn").parentElement.classList.add('active');
    document.getElementById("searchInfoPopHistoryInfoBtn").parentElement.classList.remove('active');
  });
  // 정보조회 건물정보 탭
  document.getElementById("searchInfoPopHistoryInfoBtn").addEventListener('click', () => {
    document.getElementById("tab1__content").style.display = 'none';
    document.getElementById("tab2__content").style.display = 'none';
    document.getElementById("tab3__content").style.display = 'block';
    document.getElementById("searchInfoPopBuldInfoBtn").parentElement.classList.remove('active');
    document.getElementById("searchInfoPopRoadInfoBtn").parentElement.classList.remove('active');
    document.getElementById("searchInfoPopHistoryInfoBtn").parentElement.classList.add('active');
  });

  // 정보조회 팝업 draggable
  $('.infoInquiryLayerpopup').draggable({
    cursor: 'move',
    handle: '.informationInquiry__header',
    start: (evt) => {
      // 마우스로 지도 이동 비활성화
      comMapEditor.value.getMap().getInteractions().getArray().forEach(function (interaction) {
        if (interaction instanceof DragPan) {
          interaction.setActive(false);
        }
      });
    },
    stop: (evt) => {
      // 마우스로 지도 이동 활성화
      comMapEditor.value.getMap().getInteractions().getArray().forEach(function (interaction) {
        if (interaction instanceof DragPan) {
          interaction.setActive(true);
        }
      });
    },
  });

  addrInfoMouseClick.setPosition(position);
}

/**
 * 건물군 조회
 */
const fnGetSpbdEqb = async (params) => {
  // 피쳐 초기화
  buldEqbLayer.getSource().clear();

  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&APIKEY=" + MAP_APIKEY
    + "&VERSION=1.1.1"
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_spbd_eqb"
    + "&cql_filter=" + "eqb_man_sn='" + params.eqbManSn + "' and sig_cd='" + params.emdCd + "'";

  const res = await axios.get(url);

  if (res.status === 200) {
    const format = new GeoJSON();
    if (res.data?.features?.length) {
      for (const ftJson of res.data.features) {
        const ft = format.readFeature(ftJson);
        buldEqbLayer.getSource().addFeature(ft);
        if (ft && ft.get('eqb_man_sn') && ft.get('sig_cd')) {
          let eqbCenter = getCenter(buldEqbLayer.getSource().getExtent());
          // 주출입구 세팅
          let entRes = await fnGetSpbdEntrc("eqb_man_sn='" + ft.get('eqb_man_sn') + "' and sig_cd='" + ft.get('sig_cd') + "' and entrc_se='RM'");
          // 주소정보 팝업 포지션 세팅
          if (entRes.data?.features?.length) {
            const fts = format.readFeatures(entRes.data);
            eqbCenter = fts[0].getGeometry().getCoordinates();
          }
          // 파라미터로 전달받은 센터값 세팅
          if (params.clickPosition) {
            eqbCenter = params.clickPosition;
          } else {
            // 검색결과에서 클릭한 경우 위치 이동
            comMapEditor.value.getMap().getView().animate({
              center: eqbCenter,
              zoom: 12,
              duration: 10
            });
          }
          // 주소정보 팝업 세팅
          fnAddAddrInfo(true, eqbCenter, params);
        }
      }
    }
  }
}

/**
 * 건물 조회
 */
const fnGetSpbdBuld = async (params) => {
  // 피쳐 초기화
  buldEqbLayer.getSource().clear();

  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&APIKEY=" + MAP_APIKEY
    + "&VERSION=1.1.1"
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_spbd_buld"
    + "&cql_filter=" + "bd_mgt_sn='" + params.bdMgtSn + "'";

  const res = await axios.get(url);

  if (res.status === 200) {
    const format = new GeoJSON();
    if (res.data?.features?.length) {
      for (const ftJson of res.data.features) {
        const ft = format.readFeature(ftJson);
        buldEqbLayer.getSource().addFeature(ft);
        if (ft && ft.get('bul_man_no') && ft.get('sig_cd')) {
          let buldCenter = getCenter(buldEqbLayer.getSource().getExtent());
          // 주출입구 세팅
          let entRes = await fnGetSpbdEntrc("bul_man_no='" + ft.get('bul_man_no') + "' and sig_cd='" + ft.get('sig_cd') + "' and entrc_se='RM'");
          // 주소정보 팝업 포지션 세팅
          if (entRes.data?.features?.length) {
            const fts = format.readFeatures(entRes.data);
            buldCenter = fts[0].getGeometry().getCoordinates();
          }
          // 파라미터로 전달받은 센터값 세팅
          if (params.clickPosition) {
            buldCenter = params.clickPosition;
          } else {
            // 검색결과에서 클릭한 경우 위치 이동
            comMapEditor.value.getMap().getView().animate({
              center: buldCenter,
              zoom: 12,
              duration: 10
            });
          }
          // 주소정보 팝업 세팅
          fnAddAddrInfo(true, buldCenter, params);
        }
      }
    }
  }
}

/**
 * 출입구 테이블 조회
 */
const fnGetSpbdEntrc = async (cqlfilter) => {
  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&APIKEY=" + MAP_APIKEY
    + "&VERSION=1.1.1"
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_spbd_entrc"
    + "&cql_filter=" + cqlfilter;

  const res = await axios.get(url);
  if (res.status === 200) {
    const format = new GeoJSON();
    if (res.data?.features?.length) {
      res.data.features.forEach((ftJson) => {
        const ft = format.readFeature(ftJson);
        buldEqbLayer.getSource().addFeature(ft);
      });
    }
  }
  return res;
}

/**
 * 기초구간 테이블 조회
 */
const fnGetSprdIntrvl = (cqlfilter) => {

  // 피쳐 초기화
  sprdIntrvlLayer.getSource().clear();

  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&APIKEY=" + MAP_APIKEY
    + "&VERSION=1.1.1"
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_sprd_intrvl"
    + "&cql_filter=" + cqlfilter;

  axios.get(url)
  .then((res) => {
    if (res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          sprdIntrvlLayer.getSource().addFeature(ft);
        });
      }
      // comMapEditor.value.getMap().getView().fit(sprdIntrvlLayer.getSource().getExtent());
    }
  });
}

</script>

<template>
  <div class="integratedMap__layout">
    <div class="integratedMap__header">
      <div class="integratedMap__headerLogo"><img src="/src/assets/images/utilization/img-logo@2x.png" alt="도로명주소" />
      </div>
      <div>
        <button class="integratedMap__headerHelp">
          <i aria-hidden="true" class="bi bi-question-lg" />
          <span class="integratedMap__headerHelpText">처음이신가요?</span>
        </button>
      </div>
    </div>
    <div class="integratedMap__menu">
      <Button class="integratedMap__menuButton detail" id="menu" @click="toogleLayerPopup(1)"
        :class="{ 'active': activeLayerPopup === 1 }">상세검색</Button>
      <Button class="integratedMap__menuButton baseArea" @click="toogleLayerPopup(2)"
        :class="{ 'active': activeLayerPopup === 2 }">기초구역</Button>
    </div>
    <div class="integratedMap__content"
      :class="{ 'layerPopupPosition': activeLayerPopup === 1 || activeLayerPopup === 2 }">

      <MapEditor ref="comMapEditor" :zoom-slider="true" @mapLoaded="fnMapLoaded" lang="ko" :apikey="MAP_APIKEY" />
      <div class="integratedMap__detailSearch" :class="{ 'active': activeLayerPopup === 1 }">
        <div class="integratedMap__layoutPopupHeader">
          <p class="integratedMap__layoutPopupHeaderTitle">상세검색</p>
          <div class="integratedMap__layoutPopupHeaderClose">
            <Button class="integratedMap__layoutPopupHeaderButton" @click="closeLayerPopup">
              <i aria-hidden="true" class="bi bi-x" />
              <span class="blind">닫기</span>
            </Button>
          </div>
        </div>
        <div class="integratedMap__detailSearchTab">
          <div class="integratedMap__detailSearchTabFunction">
            <Button class="integratedMap__detailSearchTabButton">지도</Button>
          </div>
          <div class="integratedMap__detailSearchTabScroll">
            <TabMenu :model="tabItems" :activeIndex="active" @tab-change="onTabChange" />
          </div>
        </div>
        <div class="integratedMap__detailSearchTabContent">
          <div v-show="active === 0">
            <div class="integratedMap__detailSearchFilter">
              <p class="integratedMap__detailSearchFilterTitle"><label for="roadCity1">시/도</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="roadCity1"
                  :options="detailSearch.tab00_params_sido_data" v-model="detailSearch.tab00_params_sido_val"
                  title="시/도선택" placeholder="선택"
                  @change='fnSearchSggData("detailSearchTab00Sgg", detailSearch.tab00_params_sido_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="roadCounty1">시/군/구</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="roadCounty1"
                  :options="detailSearch.tab00_params_sgg_data" v-model="detailSearch.tab00_params_sgg_val"
                  title="시/군/구선택" placeholder="선택"
                  @change='fnSearchRoadNameData("detailSearchTab00RoadName01", detailSearch.tab00_params_sgg_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="roadName01">도로명</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown initial" inputId="roadName01" :options="roadItemsList"
                  v-model="detailSearch.tab00_params_start_char" title="초성 선택" placeholder="ㄱ"
                  @change='fnSearchRoadNameData("detailSearchTab00RoadName02", detailSearch.tab00_params_sgg_val)' />
                <CustomDropdown class="integratedMap__dropdown" inputId="roadName02"
                  :options="detailSearch.tab00_params_road_data" v-model="detailSearch.tab00_params_road_name"
                  title="도로명선택" placeholder="선택" />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="building01">건물번호</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomInputText id="building01" v-model="detailSearch.tab00_params_bnmn"
                  class="input formStyle01 integratedMap__inputText form02" placeholder="" title="본번 입력해주세요."
                  @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("00") }' />
                <span class="dash">-</span>
                <CustomInputText id="building02" v-model="detailSearch.tab00_params_bnsn"
                  class="input formStyle01 integratedMap__inputText form02" placeholder="" title="부번 입력해주세요."
                  @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("00") }' />
                <span class="text">번</span>
              </div>
            </div>
            <Button class="integratedMap__detailSearchFilterButton" @click.prevent='fnDetailSearch("00")'
              @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("00", { page: 0 }) }'>검색</Button>
          </div>
          <div v-show="active === 1">
            <div class="integratedMap__detailSearchFilter">
              <p class="integratedMap__detailSearchFilterTitle"><label for="bungeeCity1">시/도</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="bungeeCity1"
                  :options="detailSearch.tab01_params_sido_data" v-model="detailSearch.tab01_params_sido_val"
                  title="시/도선택" placeholder="선택"
                  @change='fnSearchSggData("detailSearchTab01Sgg", detailSearch.tab01_params_sido_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="bungeeCounty1">시/군/구</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="bungeeCounty1"
                  :options="detailSearch.tab01_params_sgg_data" v-model="detailSearch.tab01_params_sgg_val"
                  title="시/군/구선택" placeholder="선택"
                  @change='fnSearchEmdData("detailSearchTab01Emd", detailSearch.tab01_params_sgg_val)' />
              </div>

              <p class="integratedMap__detailSearchFilterTitle"><label for="bungeeTown1">읍/면/동</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="bungeeTown1"
                  :options="detailSearch.tab01_params_emd_data" v-model="detailSearch.tab01_params_emd_val"
                  title="읍/면/동선택" placeholder="선택"
                  @change='fnSearchTliData("detailSearchTab01Tli", detailSearch.tab01_params_emd_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="ri1">리</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="ri1"
                  :options="detailSearch.tab01_params_tli_data" v-model="detailSearch.tab01_params_tli_val" title="리선택"
                  placeholder="선택" />
              </div>

              <p class="integratedMap__detailSearchFilterTitle"><label for="bungee01">번지</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <Checkbox v-model="detailSearch.tab01_params_mtn_se_cd" inputId="bungee01" name="bungee01" title="산 선택하기"
                  :binary="true" />
                <label for="bungee01">산</label>
                <CustomInputText id="bungee02" v-model="detailSearch.tab01_params_mno"
                  class="input formStyle01 integratedMap__inputText form02" placeholder="" title="본번 입력해주세요."
                  @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("01") }' />
                <span class="dash">-</span>
                <CustomInputText id="bungee03" v-model="detailSearch.tab01_params_sno"
                  class="input formStyle01 integratedMap__inputText form02" placeholder="" title="부번 입력해주세요."
                  @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("01") }' />
                <span class="text">번</span>
              </div>
            </div>
            <Button class="integratedMap__detailSearchFilterButton" @click.prevent='fnDetailSearch("01")'
              @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("01") }'>검색</Button>
          </div>
          <div v-show="active === 2">
            <div class="integratedMap__detailSearchFilter">
              <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCity1">시/도</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="buildingCity1"
                  :options="detailSearch.tab02_params_sido_data" v-model="detailSearch.tab02_params_sido_val"
                  title="시/도선택" placeholder="선택"
                  @change='fnSearchSggData("detailSearchTab02Sgg", detailSearch.tab02_params_sido_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCounty1">시/군/구</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="buildingCounty1"
                  :options="detailSearch.tab02_params_sgg_data" v-model="detailSearch.tab02_params_sgg_val"
                  title="시/군/구선택" placeholder="선택"
                  @change='fnSearchEmdData("detailSearchTab02Emd", detailSearch.tab02_params_sgg_val)' />
              </div>

              <p class="integratedMap__detailSearchFilterTitle"><label for="buildingTown1">읍/면/동</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="buildingTown1"
                  :options="detailSearch.tab02_params_emd_data" v-model="detailSearch.tab02_params_emd_val"
                  title="읍/면/동선택" placeholder="선택" />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="buildingName">건물명</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomInputText id="buildingName" v-model="detailSearch.tab02_params_buld_nm"
                  class="input formStyle01 integratedMap__inputText" placeholder="" title="부번 입력해주세요."
                  @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("02") }' />
              </div>
            </div>
            <Button class="integratedMap__detailSearchFilterButton" @click.prevent='fnDetailSearch("02")'
              @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("02") }'>검색</Button>
          </div>
          <div v-show="active === 3">
            <div class="integratedMap__detailSearchFilter">
              <p class="integratedMap__detailSearchFilterTitle"><label for="basicCity1">시/도</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="basicCity1"
                  :options="detailSearch.tab03_params_sido_data" v-model="detailSearch.tab03_params_sido_val"
                  title="시/도선택" placeholder="선택"
                  @change='fnSearchSggData("detailSearchTab03Sgg", detailSearch.tab03_params_sido_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="basicCounty1">시/군/구</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="basicCounty1"
                  :options="detailSearch.tab03_params_sgg_data" v-model="detailSearch.tab03_params_sgg_val"
                  title="시/군/구선택" placeholder="선택"
                  @change='fnSearchRoadNameData("detailSearchTab03RoadName01", detailSearch.tab03_params_sgg_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="basicName01">도로명</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown initial" inputId="basicName01" :options="roadItemsList"
                  v-model="detailSearch.tab03_params_start_char" title="초성 선택" placeholder="ㄱ"
                  @change='fnSearchRoadNameData("detailSearchTab03RoadName02", detailSearch.tab03_params_sgg_val)' />
                <CustomDropdown class="integratedMap__dropdown" inputId="basicName02"
                  :options="detailSearch.tab03_params_road_data" v-model="detailSearch.tab03_params_road_name"
                  title="도로명선택" placeholder="선택" />
              </div>
              <p class="integratedMap__detailSearchFilterTitle">
                <label for="basicNumber01">기초번호</label>
                <button class="integratedMap__tooltip" id="dialogFocusSave" title="기초번호 툴팁보기"
                  @click="baseNumberShowDialog()" :aria-controls="baseNumberDialogVisible ? 'baseNumber' : null"
                  :aria-expanded="baseNumberDialogVisible ? true : false">
                  <i aria-hidden="true" class="bi bi-exclamation-circle" />
                  <span class="blind">툴팁 보기</span>
                </button>
              </p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomInputText id="basicNumber01" v-model="detailSearch.tab03_params_bnmn"
                  class="input formStyle01 integratedMap__inputText form02" placeholder="" title="본번 입력해주세요."
                  @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("03") }' />
                <span class="dash">-</span>
                <CustomInputText id="basicNumber02" v-model="detailSearch.tab03_params_bnsn"
                  class="input formStyle01 integratedMap__inputText form02" placeholder="" title="부번 입력해주세요."
                  @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("03") }' />
                <span class="text">번</span>
              </div>
            </div>
            <Button class="integratedMap__detailSearchFilterButton" @click.prevent='fnDetailSearch("03")'
              @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("03") }'>검색</Button>
          </div>
          <div v-show="active === 4">
            <div class="integratedMap__detailSearchFilter">
              <p class="integratedMap__detailSearchFilterTitle"><label for="xPosition">X좌표</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomInputText id="xPosition" v-model="xyPosition.xPosition"
                  class="input formStyle01 integratedMap__inputText" placeholder="" title="X좌표 입력해주세요." type="point" />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="yPosition">Y좌표</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomInputText id="yPosition" v-model="xyPosition.yPosition"
                  class="input formStyle01 integratedMap__inputText" placeholder="" title="Y좌표 입력해주세요." type="point" />
              </div>
            </div>
            <Button class="integratedMap__detailSearchFilterButton" @click.prevent='fnSearchCoordinate()'
              @keydown='(evt) => { if (evt.keyCode === 13) fnSearchCoordinate() }'>검색</Button>
          </div>
          <div v-show="active === 5">
            <div class="integratedMap__detailSearchFilter">
            </div>
          </div>
          <div v-show="active === 6">
            <div class="integratedMap__detailSearchFilter">
            </div>
          </div>
          <div v-show="active === 7">
            <div class="integratedMap__detailSearchFilter">
            </div>
          </div>
        </div>



        <template v-if="active === 0">
          <div class="integratedMap__detailSearchResult">
            <p class="integratedMap__detailSearchResultTitle">
              검색결과 (총 <span class="commonColor01">{{ common.fnAddComma(detailSearch.tab00_result_count) }}</span> 건)
            </p>
            <div class="integratedMap__detailSearchResultFunction">
              <Button class="integratedMap__detailSearchResultFunctionButton">
                지도
              </Button>
            </div>
          </div>
          <div class="integratedMap__detailNotRecentSearches" v-if="detailSearch.tab00_search_result.length < 1">
            <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
            <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
          </div>
          <Scrollpanel class="integratedMap__detailSearchResultScroll" v-if="detailSearch.tab00_search_result.length > 0">
            <ul class="integratedMap__resultList">
              <li v-for="(res, idx) in detailSearch.tab00_search_result" :key="idx">
                <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickSearchSpbd(res)'>
                  <strong class="integratedMap__roadAddress">{{ res.rdNm }} ({{ res.emdNm }}{{ res.bdNm ? ', ' + res.bdNm :
                    '' }})</strong>
                  <span class="integratedMap__oldAddress"><i aria-hidden="true"
                      class="bi bi-geo-alt" />{{ res.lndnSnTrim }}</span>
                </Button>
              </li>
            </ul>
          </Scrollpanel>
          <div class="integratedMap__detailSearchResultPaging" v-if="detailSearch.tab00_search_result.length > 0">
            <!--            <CustomPaginator class="integratedMap__paging" :rows="10" :totalRecords="100" :pageLinkSize="5"/>-->
            <TemplatePaginator class="integratedMap__paging" :pageInfo="detailSearch.tab00_pageInfo"
              @reload-list="(pageInfo) => fnDetailSearch('00', pageInfo)" />
          </div>
        </template>
        <template v-if="active === 1">
          <div class="integratedMap__detailSearchResult">
            <p class="integratedMap__detailSearchResultTitle">
              검색결과 (총 <span class="commonColor01">{{ common.fnAddComma(detailSearch.tab01_result_count) }}</span> 건)
            </p>
            <div class="integratedMap__detailSearchResultFunction">
              <Button class="integratedMap__detailSearchResultFunctionButton">
                지도
              </Button>
            </div>
          </div>
          <div class="integratedMap__detailNotRecentSearches" v-if="detailSearch.tab01_search_result.length < 1">
            <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
            <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
          </div>
          <Scrollpanel class="integratedMap__detailSearchResultScroll" v-if="detailSearch.tab01_search_result.length > 0">
            <ul class="integratedMap__resultList">
              <li v-for="(res, idx) in detailSearch.tab01_search_result" :key="idx">
                <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickSearchSpbd(res)'>
                  <strong class="integratedMap__roadAddress">{{ res.rdNm }} ({{ res.emdNm }}{{ res.bdNm ? ', ' + res.bdNm :
                    '' }})</strong>
                  <span class="integratedMap__oldAddress"><i aria-hidden="true"
                      class="bi bi-geo-alt" />{{ res.lndnSnTrim }}</span>
                </Button>
              </li>
            </ul>
          </Scrollpanel>
          <div class="integratedMap__detailSearchResultPaging" v-if="detailSearch.tab01_search_result.length > 0">
            <!--            <CustomPaginator class="integratedMap__paging" :rows="10" :totalRecords="100" :pageLinkSize="5"/>-->
            <TemplatePaginator class="integratedMap__paging" :pageInfo="detailSearch.tab01_pageInfo"
              @reload-list="(pageInfo) => fnDetailSearch('01', pageInfo)" />
          </div>
        </template>
        <template v-if="active === 2">
          <div class="integratedMap__detailSearchResult">
            <p class="integratedMap__detailSearchResultTitle">
              검색결과 (총 <span class="commonColor01">{{ common.fnAddComma(detailSearch.tab02_result_count) }}</span> 건)
            </p>
            <div class="integratedMap__detailSearchResultFunction">
              <Button class="integratedMap__detailSearchResultFunctionButton">
                지도
              </Button>
            </div>
          </div>
          <div class="integratedMap__detailNotRecentSearches" v-if="detailSearch.tab02_search_result.length < 1">
            <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
            <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
          </div>
          <Scrollpanel class="integratedMap__detailSearchResultScroll" v-if="detailSearch.tab02_search_result.length > 0">
            <ul class="integratedMap__resultList">
              <li v-for="(res, idx) in detailSearch.tab02_search_result" :key="idx">
                <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickSearchSpbd(res)'>
                  <strong class="integratedMap__roadAddress">{{ res.rdNm }} ({{ res.emdNm }}, {{ res.bdNm }})</strong>
                  <span class="integratedMap__oldAddress"><i aria-hidden="true"
                      class="bi bi-geo-alt" />{{ res.lndnSnTrim }}</span>
                </Button>
              </li>
            </ul>
          </Scrollpanel>
          <div class="integratedMap__detailSearchResultPaging" v-if="detailSearch.tab02_search_result.length > 0">
            <!--            <CustomPaginator class="integratedMap__paging" :rows="10" :totalRecords="100" :pageLinkSize="5"/>-->
            <TemplatePaginator class="integratedMap__paging" :pageInfo="detailSearch.tab02_pageInfo"
              @reload-list="(pageInfo) => fnDetailSearch('02', pageInfo)" />
          </div>
        </template>
        <template v-if="active === 3">
          <div class="integratedMap__detailSearchResult">
            <p class="integratedMap__detailSearchResultTitle">
              검색결과 (총 <span class="commonColor01">{{ common.fnAddComma(detailSearch.tab03_result_count) }}</span> 건)
            </p>
            <div class="integratedMap__detailSearchResultFunction">
              <Button class="integratedMap__detailSearchResultFunctionButton">
                지도
              </Button>
            </div>
          </div>
          <div class="integratedMap__detailNotRecentSearches" v-if="detailSearch.tab03_search_result.length < 1">
            <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
            <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
          </div>
          <Scrollpanel class="integratedMap__detailSearchResultScroll" v-if="detailSearch.tab03_search_result.length > 0">
            <ul class="integratedMap__resultList">
              <li v-for="(res, idx) in detailSearch.tab03_search_result" :key="idx">
                <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickSearchIntrvl(res)'>
                  <strong class="integratedMap__roadAddress">{{ res.siNm }} {{ res.sggNm }} {{ res.rdNmStr }} {{ res.bdSbSn != 0
                    ? res.bdMaSn + '-' + res.bdSbSn : res.bdMaSn }}</strong>
                </Button>
              </li>
            </ul>
            <!--            <ul class="integratedMap__resultListBaseArea">-->
            <!--              <li v-for="(res, idx) in detailSearch.tab03_search_result" >-->
            <!--                <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickSearchIntrvl(res)'>-->
            <!--                <div class="integratedMap__resultListBaseAreaNumber" @click='fnClickSearchIntrvl(res)'>{{idx}}</div>-->
            <!--                <p class="integratedMap__resultListBaseAreaText" @click='fnClickSearchIntrvl(res)'>{{res.siNm}} {{res.sggNm}} {{res.rdNmStr}} {{res.bdSbSn != 0 ? res.bdMaSn + '-' + res.bdSbSn : res.bdMaSn}}</p>-->
            <!--                </Button>-->
            <!--              </li>-->
            <!--            </ul>-->
          </Scrollpanel>
          <!--          <Scrollpanel class="integratedMap__detailSearchResultScroll" v-if="basicDistrict.search_result.length > 0">-->
          <!--            <ul class="integratedMap__resultListBaseArea">-->
          <!--              <li v-for="(res, idx) in basicDistrict.search_result">-->
          <!--                <div class="integratedMap__resultListBaseAreaNumber">{{basicDistrict.result_offset + idx + 1}}</div>-->
          <!--                <p class="integratedMap__resultListBaseAreaText">{{res.ctpvNm}} {{res.sigNm}} {{res.sbdno}}</p>-->
          <!--              </li>-->
          <!--            </ul>-->
          <!--          </Scrollpanel>-->




          <div class="integratedMap__detailSearchResultPaging" v-if="detailSearch.tab03_search_result.length > 0">
            <!--            <CustomPaginator class="integratedMap__paging" :rows="10" :totalRecords="100" :pageLinkSize="5"/>-->
            <TemplatePaginator class="integratedMap__paging" :pageInfo="detailSearch.tab03_pageInfo"
              @reload-list="(pageInfo) => fnDetailSearch('03', pageInfo)" />
          </div>
        </template>
        <template v-if="active === 4">
          <div class="integratedMap__detailSearchResult">
            <p class="integratedMap__detailSearchResultTitle">
              검색결과 (총 <span class="commonColor01">{{ common.fnAddComma(xyPosition.result_count) }}</span> 건)
            </p>
            <div class="integratedMap__detailSearchResultFunction">
              <Button class="integratedMap__detailSearchResultFunctionButton">
                지도
              </Button>
            </div>
          </div>
          <div class="integratedMap__detailNotRecentSearches" v-if="xyPosition.search_result.length < 1">
            <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
            <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
          </div>
          <Scrollpanel class="integratedMap__detailSearchResultScroll" v-if="xyPosition.search_result.length > 0">
            <ul class="integratedMap__resultList">
              <li v-for="(res, idx) in xyPosition.search_result" :key="idx">
                <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickXYPosition(res)'>
                  <strong class="integratedMap__roadAddress">{{ res.addr }}</strong>
                </Button>
              </li>
            </ul>
          </Scrollpanel>
          <!--          <div class="integratedMap__detailSearchResultPaging" v-if="xyPosition.search_result.length > 0">-->
          <!--            <TemplatePaginator class="integratedMap__paging" :pageInfo="xyPosition.pageable" @reload-list="(pageInfo) => fnDetailSearch('04', pageInfo)"/>-->
          <!--          </div>-->
        </template>
      </div>
      <!-- //상세검색팝업 -->

      <div class="integratedMap__baseArea" :class="{ 'active': activeLayerPopup === 2 }">
        <div class="integratedMap__layoutPopupHeader">
          <p class="integratedMap__layoutPopupHeaderTitle">국가기초구역이란?</p>
          <div class="integratedMap__layoutPopupHeaderClose">
            <Button class="integratedMap__layoutPopupHeaderButton" @click="closeLayerPopup">
              <i aria-hidden="true" class="bi bi-x" />
              <span class="blind">닫기</span>
            </Button>
          </div>
        </div>
        <div class="integratedMap__detailSearchFilter baseArea">
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCity2">시/도</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCity2"
              :options="basicDistrict.params_sido_data" v-model="basicDistrict.params_sido_val" title="시/도선택"
              placeholder="선택" @change='fnSearchSggData("basicDistrictSgg", basicDistrict.params_sido_val)' />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCounty2">시/군/구</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCounty2"
              :options="basicDistrict.params_sgg_data" v-model="basicDistrict.params_sgg_val" title="시/군/구선택"
              placeholder="선택" />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingName2">구역번호</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomInputText id="buildingName2" v-model="basicDistrict.districtNo"
              class="input formStyle01 integratedMap__inputText" placeholder="" title="부번 입력해주세요." :maxLength="6"
              type="number" />
          </div>
        </div>
        <Button class="integratedMap__detailSearchFilterButton" @click="fnSearchBasicDistrict">검색</Button>

        <div class="integratedMap__detailSearchResult">
          <p class="integratedMap__detailSearchResultTitle">
            검색결과 (총 <span class="commonColor01">{{ basicDistrict.result_count }}</span> 건)
          </p>
          <div class="integratedMap__detailSearchResultFunction">
            <Button class="integratedMap__detailSearchResultFunctionButton">
              지도
            </Button>
          </div>
        </div>

        <div class="integratedMap__detailNotRecentSearches" v-if="basicDistrict.search_result.length < 1">
          <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
          <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
        </div>
        <Scrollpanel class="integratedMap__detailSearchResultScroll" v-if="basicDistrict.search_result.length > 0">
          <ul class="integratedMap__resultListBaseArea">
            <li v-for="(res, idx) in basicDistrict.search_result" :key="idx">
              <div class="integratedMap__resultListBaseAreaNumber" @click.prevent="fnClickSearchBasicDistrict(res)">
                {{ basicDistrict.result_offset + idx + 1 }}</div>
              <p class="integratedMap__resultListBaseAreaText" @click.prevent="fnClickSearchBasicDistrict(res)">
                {{ res.ctpvNm }} {{ res.sigNm }} {{ res.sbdno }}</p>
            </li>
          </ul>
        </Scrollpanel>
        <div class="integratedMap__detailSearchResultPaging" v-if="basicDistrict.search_result.length > 0">
          <TemplatePaginator class="integratedMap__paging" :pageInfo="basicDistrict.pageable"
            @reload-list="(pageInfo) => fnSearchBasicDistrict(pageInfo)" />
        </div>
      </div>

      <!--  결과 창이 뜰때  resultListActive  추가 -->
      <div class="integratedMap__searchBoxWrap resultListActive" :class="{ 'layerPopupActive': isActiveRecentSearches }">
        <div class="integratedMap__form">
          <Button class="integratedMap__view">지도</Button>
          <div class="integratedMap__searchBox">
            <div class="integratedMap__searchInnerBox">
              <i aria-hidden="true" class="bi bi-geo-alt-fill" />
              <label for="integratedMapSearch"><span class="blind">검색어 입력</span></label>
              <InputText class="integratedMap__searchInput" v-model="totalSearch.search_keyword" placeholder="주소를 입력하세요."
                title="주소를 입력하세요" id="integratedMapSearch" autocomplete="off" @focusin="activeRecentSearches"
                @keydown="(evt) => { if (evt.keyCode === 13) fnTotalSearch() }" />
              <Button v-if="modelValue" @click="clearInput" class="integratedMap__clearButton" title="삭제">
                <span class="blind">삭제</span>
                <i aria-hidden="true" class="bi bi-x" />
              </Button>
              <Button class="integratedMap__recentSearchesButtonMore"
                :title="isActiveRecentSearches ? '최근검색어 보기' : '최근검색어 닫기'" @click="toggleActiveRecentSearches">
                <span class="blind">{{ isActiveRecentSearches ? '최근검색어 보기' : '최근검색어 닫기' }}</span>
                <i aria-hidden="true" class="bi bi-caret-down-fill" />
              </Button>
            </div>
            <Button class="integratedMap__searchButton" title="검색" @click.prevent="fnTotalSearch"
              @keydown="(evt) => { if (evt.keyCode === 13) fnTotalSearch() }">
              <i aria-hidden="true" class="bi bi-search" />
              <span class="blind">검색</span>
            </Button>
            <div class="integratedMap__searchButtonChkedBox">
              <Checkbox v-model="totalSearch.is_search_aot_addr" inputId="objectsAdressPc" name="objectsAdressPc"
                title="사물주소 선택하기" :binary="true" />
              <label for="objectsAdressPc">사물주소 검색</label>
            </div>
            <div class="integratedMap__recentSearchesLayerPopup">
              <div class="integratedMap__objects">
                <div class="integratedMap__objectsCheckbox">
                  <Checkbox v-model="totalSearch.is_search_aot_addr" inputId="objectsAdress" name="objectsAdress"
                    title="사물주소 선택하기" :binary="true" />
                  <label for="objectsAdress">사물주소 검색</label>
                </div>
                <div class="integratedMap__objectsClose">
                  <Button class="integratedMap__objectsButton" title="최근검색어 닫기">
                    <span class="blind">최근검색어 닫기</span>
                    <i aria-hidden="true" class="bi bi-x-lg" />
                  </Button>
                </div>
              </div>
              <div class="integratedMap__recentSearches">
                <p class="integratedMap__recentSearchesTitle">최근검색어</p>
                <div class="integratedMap__recentSearchesScrollWrap">
                  <div class="integratedMap__recentSearchesScroll">
                    <ul class="integratedMap__recentSearchesList">
                      <li v-for="(item, index) in recentSearches" :key="index">
                        <Button class="integratedMap__recentSearchesText" title="" @click="setModelValue(item.value)">
                          <span class="integratedMap__recentSearchesSearchText">{{ item.value }}</span>
                        </Button>
                        <span class="integratedMap__recentSearchesDate">{{ item.date }}</span>
                        <Button class="integratedMap__recentSearchesButton" title="검색어 삭제" @click="removeSearch(index)">
                          <i aria-hidden="true" class="bi bi-x" />
                          <span class="blind">검색어 삭제</span>
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <!-- <p class="integratedMap__firstRecentSearches">검색창에서 주소를 입력해보세요.</p> -->
                  <!-- <div class="integratedMap__notRecentSearches">
                        <p class="integratedMap__notRecentSearchesTitle">검색결과가 없습니다.</p>
                        <p class="integratedMap__notRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
                    </div> -->
                </div>
                <div class="integratedMap__recentSearchesfunction">
                  <Button class="integratedMap__recentSearchesfunctionButton" @click="clearRecentSearches">전체삭제</Button>
                  <div>
                    <!--ㄴㄴ-->
                    <!-- <Button class="integratedMap__recentSearchesfunctionButton">{{}}검색이력 끄기</Button> -->
                    <Button class="integratedMap__recentSearchesfunctionButton" @click="toggleSearchHistory">
                      {{isHistoryEnabled ? '검색이력 끄기' : '검색이력 켜기'}}
                    </Button>
                    <Button class="integratedMap__recentSearchesfunctionButton" @click="toggleRecentSearches">닫기</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="integratedMap__resultListLayerPopup" :class="{ 'active': isActiveResultList }">
          <div class="integratedMap__recentSearchesHeader">
            <p class="integratedMap__recentSearchesHeaderTitle">{{ totalSearch.result_msg }} (총 <span class="commonColor01">{{ totalSearch.result_count }}</span>건)</p>
            <Button class="integratedMap__recentSearchesToggle" :title="isActiveResultList ? '레이어팝업 열기' : '레이어팝업 닫기'"
              @click="toggleActiveResultList">
              <i aria-hidden="true" class="bi bi-chevron-up" />
              <span class="blind">{{ isActiveResultList ? '레이어팝업 열기' : '레이어팝업 닫기' }}</span>
            </Button>
          </div>

          <div class="integratedMap__detailNotRecentSearches" v-if="totalSearch.search_result.length < 1 && totalSearch.search_keyword.length > 1 && totalSearch.is_searched">
            <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
            <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
          </div>
          <Scrollpanel class="integratedMap__resultListWrap" v-if="totalSearch.search_result.length > 0">
            <ul v-if="inqCndParams.strAotYn.includes('N')" class="integratedMap__resultList">
              <li v-for="(res, idx) in totalSearch.search_result" :key="idx">
                <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickSearchSpbd(res)'>
                  <strong class="integratedMap__roadAddress">{{ res.schKorRoadNm }}</strong>
                  <span class="integratedMap__oldAddress"><i aria-hidden="true"
                      class="bi bi-geo-alt" />{{ res.lndnSnTrim }}</span>
                </Button>
              </li>
            </ul>
            <ul v-if="inqCndParams.strAotYn.includes('Y')" class="integratedMap__resultList">
              <li v-for="(res, idx) in totalSearch.search_result" :key="idx">
                <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickSearchAot(res)'>
                  <strong class="integratedMap__roadAddress">{{ res.objNm }}</strong>
                  <span class="integratedMap__oldAddress"><i aria-hidden="true"
                      class="bi bi-geo-alt" />{{ res.bdSnTxt }}</span>
                </Button>
              </li>
            </ul>
          </Scrollpanel>

          <!--          <CustomPaginator v-if="totalSearch.search_result.length > 0" class="integratedMap__paging" :rows="pageInfo.size" :totalRecords="pageInfo.totalRecords" :pageLinkSize="1"/>-->
          <TemplatePaginator class="integratedMap__paging" :pageInfo="pageInfo" @reload-list="fnTotalSearch" />
        </div>
      </div>

      <ul class="integratedMap__mapKeyword">
        <li :class="{ 'layer': true, 'active': thingsIsActive }">
          <Button class="things" @click="toggleThingsActive">사물주소</Button>
          <div class="integratedMap__mapKeywordList01">
            <ul class="integratedMap__mapKeywordCategory01">
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30101")'>육교승강기</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10901")'>드론배달점</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30201")'>둔치주차장</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30301")'>지진옥외 대피장소</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10401")'>버스정류장</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10402")'>택시승강장</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30601")'>졸음쉼터</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30302")'>지진해일 긴급대피장소</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30501")'>소공원</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10301")'>비상급수시설</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10302")'>인명구조함</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30202")'>주차장</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30701")'>전기차충전소</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10801")'>공중전화</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10802")'>우체통</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10701")'>전동휠체어 급속충전기</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30801")'>자전거거치대</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10303")'>비상소화장치</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T10601")'>무더위쉼터</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30802")'>어린이 놀이시설</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T31201")'>푸드트럭 허가구역</Button></li>
              <li><Button class="category" @click.prevent='fnCallAotAddrPoint("T30502")'>어린이공원</Button></li>
            </ul>
          </div>
        </li>
        <li :class="{ 'layer': true, 'active': civilAffairsIsActive }">
          <Button class="civilAffairs" @click.prevent="toggleCivilAffairsActive">민원행정기관</Button>
          <div class="integratedMap__mapKeywordList02">
            <ul class="integratedMap__mapKeywordCategory02">
              <li><Button class="category" @click.prevent='fnCallGovMachPoint("police")'>경찰서</Button></li>
              <li><Button class="category" @click.prevent='fnCallGovMachPoint("school")'>학교</Button></li>
              <li><Button class="category" @click.prevent='fnCallGovMachPoint("post")'>우체국</Button></li>
              <li><Button class="category" @click.prevent='fnCallGovMachPoint("adm")'>관공서</Button></li>
              <li><Button class="category" @click.prevent='fnCallGovMachPoint("hospital")'>보건소</Button></li>
              <li><Button class="category" @click.prevent='fnCallGovMachPoint("court")'>법원/병무</Button></li>
              <li><Button class="category" @click.prevent='fnCallGovMachPoint("customs")'>관세/국세</Button></li>
            </ul>
          </div>
        </li>
        <li>
          <Button class="country" @click="fnCallKargSsnp">국가지점번호판</Button>
        </li>
        <li>
          <Button class="foundation" @click="fnCallKarbSbd">기초구역</Button>
        </li>
        <li>
          <Button class="administration" @click="fnCallGEmdBndry">행정구역</Button>
        </li>
        <li>
          <Button class="administration" @click="fnCallEmdBndry">법정구역</Button>
        </li>
      </ul>

      <div class="integratedMap__mapFunctionWrap">
        <div class="integratedMap__mapFunction type01">
          <ul>
            <li>
              <Button class="base" title="기초번호" @click.prevent="fnClickSprdIntrvl">
                <span class="tip">기초번호</span>
              </Button>
            </li>

            <li class="mo">
              <Button class="branchNumber" title="지점번호">
                <span class="tip">지점번호</span>
              </Button>
            </li>
            <li class="mo">
              <Button class="mybranchNumber" title="나의 위치 지점번호">
                <span class="tip">나의 위치 지점번호</span>
              </Button>
            </li>
            <li class="pc">
              <Button class="legend" title="범례" id="legend" @click="legendShowDialog()"
                :aria-controls="dialogVisible ? 'legend' : null" :aria-expanded="dialogVisible ? true : false">
                <span class="tip">범례</span>
              </Button>
            </li>


            <li>
              <Button @click="fnPrintMapPopup" class="output" title="출력">
                <span class="tip">출력</span>
              </Button>
            </li>
            <li>
              <Button title="저장" id="dialogFocusSave" @click="showDialog()" :aria-controls="dialogVisible ? 'dlg' : null"
                :aria-expanded="dialogVisible ? true : false">
                <i aria-hidden="true" class="bi bi-download" />
                <span class="tip">저장</span>
              </Button>
            </li>
            <li>
              <Button class="area" title="면적" @click="fnMeasureArea">
                <span class="tip">면적</span>
              </Button>
            </li>
            <li>
              <Button class="distance" title="거리" @click="fnMeasureDistance">
                <span class="tip">거리</span>
              </Button>
            </li>
            <li>
              <Button @click="fnClearMeasure">
                <i aria-hidden="true" class="bi bi-arrow-clockwise" />
                <span class="tip">초기화</span>
              </Button>
            </li>
          </ul>
        </div>
        <div class="integratedMap__mapFunction type02" v-if="currentPointButton">
          <Button class="current" title="접속위치">
            <span class="tip">접속위치</span>
          </Button>
        </div>



        <div class="integratedMap__mapFunction type03">
          <Button @click="fnMapZoomIn" title="확대">
            <i aria-hidden="true" class="bi bi-plus-lg" />
            <span class="tip">1단계 확대</span>
          </Button>
        </div>
        <div class="integratedMap__mapFunction type04">
          <Button @click="fnMapZoomOut" title="축소">
            <i aria-hidden="true" class="bi bi-dash-lg" />
            <span class="tip">1단계 축소</span>
          </Button>
        </div>


      </div>


      <!-- 지도범례 툴팁 -->
      <Dialog class="integratedMap__legendLayerPopup" id="geoLegend" :visible="legendDialogVisible"
        :closable="false" @hide="legendOnHideDialog" @show="legendOnShowDialog">
        <template #header>
          <p class="integratedMap__baseLayerPopupTitle">지도범례</p>
          <Button id="legendClose" class="integratedMap__baseLayerPopupButton" @click="legendCloseDialog">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg" />
          </Button>
        </template>

        <ul class="integratedMap__legendList">
          <li>아파트</li>
          <li>관공서</li>
          <li>경찰서</li>
          <li>소방서</li>
          <li>우체국</li>
          <li>교육시설</li>
          <li>의료시설</li>
          <li>쇼핑시설</li>
          <li>금융시설</li>
          <li>숙박시설</li>
          <li>도서관</li>
          <li>공항</li>
          <li>주차장</li>
          <li>주유소</li>
        </ul>
      </Dialog>
      <!-- //지도범례 툴팁 -->

      <!-- 기초구역 툴팁 -->
      <Dialog class="integratedMap__baseLayerPopup" id="baseArea" :visible="baseAreaDialogVisible" :modal="isModal"
        :closable="false" @hide="baseAreaOnHideDialog" @show="baseAreaOnShowDialog">
        <template #header>
          <p class="integratedMap__baseLayerPopupTitle">국가기초구역 설명</p>
          <Button id="baseAreaClose" class="integratedMap__baseLayerPopupButton" @click="baseAreaCloseDialog">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg" />
          </Button>
        </template>

        <div class="integratedMap__baseLayerPopupSubContent">
          <div class="integratedMap__baseLayerPopupSubTitle">국가기초구역이란?</div>
          <p class="integratedMap__baseLayerPopupSubText">
            도로명주소를 기반으로 국토를 읍·면·동의 면적보다 작게 일정한 경계를 정하여 나눈 구역입니다.
          </p>
          <div class="integratedMap__baseLayerPopupSubTitle">구역번호란?</div>
          <p class="integratedMap__baseLayerPopupSubText">
            국가기초구역마다 부여한 번호로 5자리 숫자로 구성되어 있습니다.
          </p>
          <p class="integratedMap__baseLayerPopupSubTip">
            <span class="commonBullet">※</span> 앞 2자리(시·도 구분) → 앞 3자리까지(시·군·구 구분) → 끝 2자리(시·군·구 내 일련번호)
          </p>
          <ul class="integratedMap__baseLayerPopupSubList">
            <li>서울<span class="integratedMap__baseLayerPopupSubListNumber">01~09</span></li>
            <li>경기<span class="integratedMap__baseLayerPopupSubListNumber">10~20</span></li>
            <li>인천<span class="integratedMap__baseLayerPopupSubListNumber">21~23</span></li>
            <li>강원<span class="integratedMap__baseLayerPopupSubListNumber">24~26</span></li>
            <li>충북<span class="integratedMap__baseLayerPopupSubListNumber">27~29</span></li>
            <li>세종<span class="integratedMap__baseLayerPopupSubListNumber">30</span></li>
            <li>충남<span class="integratedMap__baseLayerPopupSubListNumber">31~33</span></li>
            <li>대전<span class="integratedMap__baseLayerPopupSubListNumber">34~35</span></li>
            <li>경북<span class="integratedMap__baseLayerPopupSubListNumber">36~40</span></li>
            <li>대구<span class="integratedMap__baseLayerPopupSubListNumber">41~43</span></li>
            <li>울산<span class="integratedMap__baseLayerPopupSubListNumber">44~45</span></li>
            <li>부산<span class="integratedMap__baseLayerPopupSubListNumber">46~49</span></li>
            <li>경남<span class="integratedMap__baseLayerPopupSubListNumber">50~53</span></li>
            <li>전북<span class="integratedMap__baseLayerPopupSubListNumber">54~56</span></li>
            <li>전남<span class="integratedMap__baseLayerPopupSubListNumber">57~60</span></li>
            <li>공주<span class="integratedMap__baseLayerPopupSubListNumber">61~62</span></li>
            <li>제주<span class="integratedMap__baseLayerPopupSubListNumber">63</span></li>
          </ul>
        </div>
      </Dialog>
      <!-- //기초구역 툴팁 -->

      <!-- 기초번호 툴팁 -->
      <Dialog class="integratedMap__baseLayerPopup" id="baseNumber" :visible="baseNumberDialogVisible" :modal="isModal"
        :closable="false" @hide="baseNumberOnHideDialog" @show="baseNumberOnShowDialog">
        <template #header>
          <p class="integratedMap__baseLayerPopupTitle">기초번호란?</p>
          <Button id="baseNumberClose" class="integratedMap__baseLayerPopupButton" @click="baseNumberCloseDialog">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg" />
          </Button>
        </template>
        <p class="integratedMap__baseLayerPopupText">도로구간의 시작지점부터 끝지점까지 일정한 간격으로 부여한 번호로 도로의 왼쪽에는 홀수번호를 부여하고, 오른쪽에는 짝수번호를
          부여합니다.<br />주소 부여 시 해당 건물의 주소로</p>
        <div class="integratedMap__baseLayerPopupImage">
          <img src="/src/assets/images/utilization/img-basic-num.png" alt="기초번호구역 설정 이미지" />
        </div>
      </Dialog>
      <!-- //기초번호 툴팁 -->

      <!-- map save -->
      <Dialog class="integratedMap__dimLayerPopup" id="dlg" :visible="dialogVisible" modal :closable="false"
        @hide="onHideDialog" @show="onShowDialog">
        <template #header>
          <p class="integratedMap__dimLayerPopupTitle">지도화면 저장</p>
          <Button id="mapSaveClose"  class="integratedMap__dimLayerPopupButton" @click="closeDialog">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg" />
          </Button>
        </template>

        <div class="integratedMap__dimLayerPopupSaveMap">
          <p class="integratedMap__dimLayerPopupSaveMapTitle">지정할 파일의 형식을 선택하세요.</p>
          <ul class="integratedMap__dimLayerPopupSaveMapForm">
            <li v-for="checkList in categories" :key="checkList.key">
              <label :for="checkList.key" :style="{ backgroundColor: checkList.bgColor }">
                <i aria-hidden="true" :class="checkList.icon" />
                <span class="blind">{{ checkList.label }}</span>
              </label>
              <RadioButton v-model="selectedCategories" :inputId="checkList.key" name="checkList"
                :value="checkList.value" />
            </li>
          </ul>
          <div class="integratedMap__dimLayerPopupSaveMapButton">
            <Button class="commonLayerPopup__button" title="이미지 저장하기" @click="fnSaveMap"
              @keydown="(evt) => { if (evt.keyCode === 13) fnSaveMap() }">이미지 저장</Button>
            <Button class="commonLayerPopup__button" title="PDF 리더 다운로드 하기"
              @click="window.open('http://getadobe.com/kr/reader/')"
              @keydown="(evt) => { if (evt.keyCode === 13) window.open('http://getadobe.com/kr/reader/') }">PDF 리더
              다운로드</Button>
          </div>
          <p class="integratedMap__dimLayerPopupSaveMapText"><span class="commonBullet">※</span> 이미지 저장 시 다소 시간이 소요될 수
            있습니다.</p>
        </div>
      </Dialog>
      <!-- //map save -->

      <!-- map print -->
      <Dialog class="integratedMap__dimLayerPopup" id="mapPrint" v-model:visible="isVisiblePrintMap" style="width: 904px;height: 879px;" @update:visible="fnClosePrintMapPopup" modal
              :blockScroll="true" :closeOnEscape="false" :dismissableMask="false" :keepInViewPort="false">
<!--        <template #header>-->
<!--          <span>안내도 출력</span>-->
<!--        </template>-->
        <template #header>
          <p class="integratedMap__dimLayerPopupTitle">안내도 출력</p>
          <Button id="mapPrintClose"  class="integratedMap__dimLayerPopupButton" @click="fnClosePrintMapPopup">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg" />
          </Button>
        </template>

        <div class="integratedMap__windowPopupMap" style="position:relative;">
          <MapEditor ref="copyMapObj" :zoom-slider="false" @mapLoaded="fnLoadCopyMap" lang="ko" :apikey="MAP_APIKEY"/>
        </div>
        <div class="integratedMap__windowPopupContent">
          <p class="integratedMap__windowPopupSaveMapText"><span class="commonBullet">※</span> 이미지 저장 시 다소 시간이 소요될 수 있습니다.
          </p>
          <Textarea class="integratedMap__windowPopupTextarea" v-model="descText" @keyup="fnKeyUpPrintText"></Textarea>
          <div class="integratedMap__windowPopupTextareaText"><span class="commonColor01">{{ descTextCnt }}</span>/300</div>
          <div class="integratedMap__windowPopupSaveMapButton">
            <Button class="commonLayerPopup__button" title="출력" @click="fnPrint">출력</Button>
            <Button class="commonLayerPopup__button" title="취소" @click="fnClosePrintMapPopup">취소</Button>
          </div>
        </div>
      </Dialog>
      <!-- //map print -->


    </div>
    <div class="integratedMap__footer">
      <div class="integratedMap__regionWrap">
        <div class="integratedMap__logo"><img src="/src/assets/images/utilization/logo-mois@2x.png" alt="행정안전부" /></div>
        <div class="integratedMap__region">
          <Button class="integratedMap__function" @click="toggleActive" :class="{ 'layer': true, 'active': isActive }">
            <span class="integratedMap__mapText">{{ mapCenterCity }}</span>
            <i aria-hidden="true" class="bi bi-caret-right-fill" />
            <span class="integratedMap__mapText">{{ mapCenterCounty }}</span>
            <i aria-hidden="true" class="bi bi-caret-right-fill" />
            <span class="integratedMap__mapText">{{ mapCenterTown }}</span>
            <i aria-hidden="true" class="bi bi-chevron-up" />
          </Button>
          <div class="integratedMap__layerPopup" :class="{ 'layer': true, 'active': isActive }">
            <div class="integratedMap__layerPopupContent">
              <Scrollpanel class="integratedMap__scroll" ref="scrollContainerCity">
                <ul class="integratedMap__list" >
                  <li v-for="(item, index) in mapCenterAddr.params_sido_data" :key="index" :option="item" :id="'item-' + index"
                  :data-option = "item.option" style="overflow-y: auto;">
                    <Button :class="{'integratedMap__selectButton' : true, 'integratedMap__selectButton active':activeCity === index}"
                       inputId="mapCenterCity"
                      @click="mapCenterLocation(item, 'mapCenterCity', index)">
                      {{ item.label }}
                    </Button>
                  </li>
                  <!-- <li>
                      <Button class="integratedMap__selectButton active" ㅁㅁ>서울특별시</Button>
                    </li> -->
                </ul>
              </Scrollpanel>
              <Scrollpanel class="integratedMap__scroll" ref="scrollContainerCounty">
                <ul class="integratedMap__list">
                  <li v-for="(item, index) in mapCenterAddr.params_sgg_data" :key="index" :option="item" :id="'item-' + index"
                  :data-option = "item.option" style="overflow-y: auto;">
                    <Button :class="{'integratedMap__selectButton' : true, 'integratedMap__selectButton active':activeCounty === index}"
                    inputId="mapCenterCounty"
                      @click="mapCenterLocation(item, 'mapCenterCounty', index)">
                      {{ item.label }}
                    </Button>
                  </li>
                  <!-- <li>
                      <Button class="integratedMap__selectButton active">강남구</Button>
                    </li> -->
                </ul>
              </Scrollpanel>
              <Scrollpanel class="integratedMap__scroll" ref="scrollContainerTown">
                <ul class="integratedMap__list">
                  <li v-for="(item, index) in mapCenterAddr.params_emd_data" :key="index" :option="item" :id="'item-' + index"
                  :data-option = "item.option" style="overflow-y: auto;">
                    <Button :class="{'integratedMap__selectButton' : true, 'integratedMap__selectButton active':activeTown === index}"
                     inputId="mapCenterTown"
                      @click="mapCenterLocation(item, 'mapCenterTown', index)">
                      {{ item.label }}
                    </Button>
                  </li>
                  <!-- <li>
                      <Button class="integratedMap__selectButton active">광희동1가</Button>
                    </li> -->
                </ul>
              </Scrollpanel>
            </div>
            <div class="integratedMap__layerPopupFunction">
              <Button class="integratedMap__function" @click="mapCenterPointOkButton()">확인</Button>
              <Button class="integratedMap__function" @click="mapCentetPointCloseButton">취소</Button>
            </div>
          </div>
        </div>
      </div>
      <p class="integratedMap__text">* 도로명주소 안내도에서 제공하는 정보는 참고용으로만 사용하시기 바랍니다.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('@/assets/scss/contents/utilization/IntegratedMap.scss');
</style>

<style>
/* 스케일 ※ scope 안에 넣으면 적용이 안된다. */
.ol-overlaycontainer-stopevent .ol-zoomslider {
  display: block;
  top: unset;
  left: unset;
  right: 1rem;
  bottom: 150px;
  width: 40px;
  height: 120px;
  background-color: rgba(128, 128, 128, 0.4);
  z-index: 1000;
}

.ol-overlaycontainer-stopevent .ol-zoomslider:hover {
  background-color: rgba(128, 128, 128, 0.5);
}

.ol-overlaycontainer-stopevent button.ol-zoomslider-thumb {
  margin: 3px;
  width: 34px;
  height: 15px;
}
</style>

<style>
.infoInquiryLayerpopup {
  display: none;
  position: absolute;
  //top:50%;left:50%;
  //transform: translate3d(-50%,-50%,0);
}

.informationInquiry__layerPopup {
  display: flex;
  flex-direction: column;
  width: 560px;
  border-radius: 15px;
  box-shadow: 1px 1.7px 8px 0 rgba(0, 0, 0, 0.12);
  background: #fff !important;
}

.informationInquiry__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding-left: 24px;
  border-radius: 15px 15px 0 0;
  background: #325ee6;
}

.informationInquiry__title {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}

.informationInquiry__button {
  width: 60px;
  height: 60px;
  background: none;
}

.informationInquiry__button i {
  width: auto;
  height: auto;
  color: #fff;
}

.informationInquiry__tab {
  display: flex;
  gap: 25px;
  padding: 19px 25px 0;
  background: #f8f8f8;
}

.informationInquiry__tab li .informationInquiry__tabButton {
  position: relative;
  height: auto;
  padding: 0 0 5px;
  border-radius: 0;
  background: none;
  color: #666;
  font-size: 16px;
  font-weight: 500;
}

.informationInquiry__tab li.active .informationInquiry__tabButton {
  color: #111;
}

.informationInquiry__tab li.active .informationInquiry__tabButton::after {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  content: " ";
  display: block;
  height: 1px;
  background: #000;
}

.informationInquiry__inquiryAdressWrap {
  padding: 15px 25px 22px;
  background: #f8f8f8;
}

.informationInquiry__inquiryAdressWrap {
  padding: 15px 25px 22px;
  background: #f8f8f8;
}

.informationInquiry__inquiryAdressWrap.type01 {
  padding: 20px 25px;
}

.informationInquiry__inquiryAdressWrap.type01 .informationInquiry__inquiryAdress {
  height: auto;
}

.informationInquiry__inquiryAdress {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
}

.informationInquiry__inquiryAdressNumber {
  position: relative;
  padding-right: 27px;
  color: #325ee6;
  font-size: 15px;
  font-weight: 500;
}

.informationInquiry__inquiryAdressNumber::after {
  position: absolute;
  right: 13px;
  top: 2px;
  content: " ";
  display: block;
  width: 1px;
  height: 14px;
  background: #ddd;
}

.informationInquiry__inquiryAdressText {
  flex: 1;
  padding-right: 10px;
  color: #111;
  font-size: 15px;
  font-weight: 500;
}

.informationInquiry__inquiryAdressButton {
  min-width: 42px;
  height: 28px;
  padding: 0 9px;
  border-radius: 14px;
  background: #eee;
  color: #666;
  font-size: 12px;
}

.informationInquiry__inquiryAdressFunction {
  display: flex;
  gap: 9px;
  min-width: 90px;
}

.informationInquiry__listDetail {
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  padding: 22px 25px;
  gap: 10px 0;
}

.informationInquiry__listDetailTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 34px;
  margin-right: 10px;
  border-radius: 7px;
  background: #f0f0f0;
  color: #555;
  font-size: 14px;
}

.informationInquiry__listDetailContent {
  display: flex;
  flex-direction: column;
  width: calc(100% - 120px);
  margin-top: 9px;
  color: #333;
  font-size: 15px;
}

.informationInquiry__table th {
  border: 1px solid rgba(7, 7, 7, 0.4);
  background-color: rgba(0, 176, 240, 0.37);
  padding: 5px 5px 5px 5px;
  font-size: 14px;
  text-align: center;
}

.informationInquiry__table td {
  border: 1px solid rgba(7, 7, 7, 0.4);
  padding: 5px 1px 5px 1px;
  font-size: 13px;
  text-align: center;
}

.informationInquiry__listDetailContentGap {
  margin-top: 4px;
}

.informationInquiry__tip {
  margin-top: 16px;
}

.informationInquiry__tip li {
  color: #666;
  font-size: 14px;
  line-height: 1.71;
}

.informationInquiry__communityCenter li {
  margin-top: 10px;
  color: #333;
  font-size: 15px;
}

.informationInquiry__communityCenter li:first-child {
  margin-top: 0;
}

.informationInquiry__phone {
  display: inline-block;
  position: relative;
  padding-left: 27px;
  color: #183899;
  font-size: 15px;
}

.informationInquiry__phone i {
  color: #183899;
  font-size: 13px;
}

.informationInquiry__phone::after {
  position: absolute;
  left: 13px;
  top: 2px;
  content: " ";
  display: block;
  width: 1px;
  height: 17px;
  background: #d5d5d5;
}

.informationInquiry__detailAdressButton {
  display: inline-flex;
  align-items: center;
  width: auto;
  height: 30px;
  margin-top: 5px;
  padding: 0 12px;
  background: #e5eaf9;
  color: #11328e;
  font-size: 13px;
  gap: 9px;
}

.informationInquiry__detailAdressButton i {
  width: auto;
  height: auto;
  color: #11328e;
  font-size: 13px;
}

.informationInquiry__detailAdress {
  display: none;
  padding: 20px 25px 30px;
  background: #f8f8f8;
}

.informationInquiry__detailAdress.detailAdressActive {
  display: block;
  transition: display 1s;
}

.informationInquiry__eastWestFloor {
  display: flex;
  width: 100%;
  gap: 7px;
}

.informationInquiry__eastWestFloor li {
  width: 33.3%;
}

.informationInquiry__eastWestFloorSelect {
  min-width: auto;
  width: 100%;
  height: 40px;
  padding-left: 16px;
  border-radius: 7px;
  border: 1px solid #ddd;
  line-height: 40px;
  font-size: 13px;
}

.informationInquiry__innerBox {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
}

.informationInquiry__innerBoxText {
  margin-top: 6px;
  color: #333;
  font-size: 15px;
  font-weight: 500;
}

.informationInquiry__copyButton {
  height: 28px;
  padding: 0 10px;
  border-radius: 14px;
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  font-size: 12px;
}

.informationInquiry__eastWestFloorTip {
  margin-top: 14px;
  color: #666;
  font-size: 13px;
}

.informationInquiry__content {
  display: none;
}

.informationInquiry__content.active {
  display: block;
}

.informationInquiry__headerFunction {
  display: none;
}

.informationInquiry__doorway {
  padding: 19px 25px 31px;
}

.informationInquiry__doorwayTitle {
  color: #111;
  font-size: 18px;
  font-weight: 500;
}

.informationInquiry__information {
  width: 390px;
  padding: 19px 0;
}

.informationInquiry__information dt {
  color: #325ee6;
  font-size: 15px;
  font-weight: 500;
}

.informationInquiry__information dd {
  margin-top: 12px;
  color: #111;
  font-size: 15px;
  font-weight: 500;
}

.commonTable__wrap {
  border-top: 1px solid #000;
  margin-top: 48px;
}

.commonTable__wrap.type01 {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 16px;
}

.commonTable__vertical {
  width: 100%;
}

.commonTable__vertical thead th {
  height: 50px;
  border-bottom: 1px solid #d9dce0;
  background: #f2f5fa;
  color: #666;
  font-size: 14px;
  text-align: center;
}

.commonTable__vertical tbody td {
  height: 50px;
  border-bottom: 1px solid #e5e5e5;
  color: #000;
  font-size: 15px;
  text-align: center;
}

@media (max-width: 1280px) {
  .infoInquiryLayerpopup {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: flex-end;
    height: auto;
    padding-bottom: 70px;
    background: none;
    transform: none;
  }
}


.integratedMap__basicLayerPopup {
  min-width: 200px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 1px 1.7px 8px 0 rgba(0, 0, 0, 0.12);
}

.integratedMap__basicLayerPopupHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 0 0 21px;
  border-bottom: 1px solid #e5e5e5;
}

.integratedMap__basicLayerPopupTitle {
  color: #325ee6;
  font-size: 16px;
  font-weight: bold;
}

.integratedMap__basicLayerPopupButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: none;
  background: none;
}

.integratedMap__basicLayerPopupButton i {
  width: auto;
  height: auto;
  color: #000;
  font-size: 16px;
}

.integratedMap__basicLayerPopupContent {
  padding: 15px;
  color: #333;
  font-size: 15px;
}

.integratedMap__moveLayerPopup {
  min-width: 50px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 1px 1.7px 8px 0 rgba(0, 0, 0, 0.12);
}

.integratedMap__moveLayerPopupContent {
  padding: 15px;
  color: #333;
  font-size: 15px;
}

.integratedMap__basicLayerPopupPhone {
  display: inline-block;
  position: relative;
  padding-left: 2px;
  color: #183899;
  font-size: 15px;
}

.integratedMap__basicLayerPopupPhone i {
  color: #183899;
  font-size: 13px;
}

.integratedMap__basicLayerPopupPhone::after {
  position: absolute;
  top: 2px;
  display: block;
  width: 1px;
  height: 17px;
  background: #d5d5d5;
}

.informationInquiry__header {
  cursor: move;
}
</style>