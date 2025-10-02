<script setup>
import {ref, onMounted, nextTick, reactive} from "vue";
import Button from 'primevue/button'
import Scrollpanel from 'primevue/scrollpanel'
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
import NiceCertificationModal from "@/components/certification/NiceCertificationModal.vue";
import dateUtils from "@/common/dateUtils";
import LoadingComponent from "@/components/common/LoadingComponent.vue";

/************ 개발용 **************/
// map apikey
const MAP_APIKEY = mapUtils.MAP_SERVER_APIKEY;
// 나이스 인증 모달 팝업


const niceCertificationModal = ref(null);
// 그리기 모드
let drawInteraction = null;
// map에 포인터 이동 유무
let isPointerMove = true;
// 사물주소 메뉴 클릭 유무
const isActiveKadtAotMng = ref(false);
// 사물주소 레이어 타입
const kadtAotMngType = ref('');
// 민원행정기관 메뉴 클릭 유무
const isActiveHahuFclts = ref(false);
// 민원행정기관 레이어 타입
const hahuFcltsType = ref('');
// 국가지점번호판 레이어 호출 유무
const isActiveKargSsnp = ref(false);
// 기초구역 레이어 호출 유무
const isActiveKarbSbd = ref(false);
// 행정구역 메뉴 클릭 유무
const isActiveEmdBndry = ref(false);
// 행정구역 행정동 레이어 호출 유무
const isActiveEmdhBndry = ref(false);
// 행정구역 법정동 레이어 호출 유무
const isActiveEmdbBndry = ref(false);
// 선택된 국가지점번호판 임시 저장
let tempKargSsnpSsn = '';
// 건물/건물군 레이어
let buldEqbLayer = null;
// 도로구간 레이어
let sprdManageLayer = null;
// 명예도로 레이어
let honorRoadLayer = null;
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
// 관심주소 레이어
let addressInterestLayer = null;
// 도로명 주소 조회 메뉴에서 통합지도 조회한 경우
let isLinkAddr = false;
// 본 페이지에서 통합지도의 도로명을 조회한 경우
let isLinkRoadNm = false;

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
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [0, -12],
  positioning: 'bottom-center',
});
const addrInfoMouseClickElmt = document.createElement('div');
const addrInfoMouseClick = new Overlay({
  id: 'addrInfoMouseClickOverlay',
  element: addrInfoMouseClickElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [10, 0],
  positioning: 'top-left',
});
let addrInfoMouseClickPosition = null;

// 민원행정기관용 오버레이
const govMachMouseOverElmt = document.createElement('div');
const govMachMouseOver = new Overlay({
  id: 'govMachMouseOverOverlay',
  element: govMachMouseOverElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [20, 0],
  positioning: 'top-left',
});
const govMachMouseClickElmt = document.createElement('div');
const govMachMouseClick = new Overlay({
  id: 'govMachMouseClickOverlay',
  element: govMachMouseClickElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [20, 0],
  positioning: 'top-left',
});

// 사물주소용 오버레이
const aotAddrMouseOverElmt = document.createElement('div');
const aotAddrMouseOver = new Overlay({
  id: 'aotAddrMouseOverOverlay',
  element: aotAddrMouseOverElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [20, 0],
  positioning: 'top-left',
});
const aotAddrMouseClickElmt = document.createElement('div');
const aotAddrMouseClick = new Overlay({
  id: 'aotAddrMouseClickOverlay',
  element: aotAddrMouseClickElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [20, 0],
  positioning: 'top-left',
});

// 국가지점번호판용 오버레이
const kargSsnpMouseOverElmt = document.createElement('div');
const kargSsnpMouseOver = new Overlay({
  id: 'kargSsnpMouseOverOverlay',
  element: kargSsnpMouseOverElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [0, -30],
  positioning: 'bottom-center',
});
const kargSsnpMouseClickElmt = document.createElement('div');
const kargSsnpMouseClick = new Overlay({
  id: 'kargSsnpMouseClickOverlay',
  element: kargSsnpMouseClickElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [0, -50],
  positioning: 'bottom-center',
});

// 기초번호용 오버레이
const sprdIntrvlMouseClickElmt = document.createElement('div');
const sprdIntrvlMouseClick = new Overlay({
  id: 'sprdIntrvlMouseClickOverlay',
  element: sprdIntrvlMouseClickElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [0, -40],
  positioning: 'bottom-center',
});

// 국가지점번호판 검색 오버레이
const nationalPointNumMouseClickElmt = document.createElement('div');
const nationalPointNumMouseClick = new Overlay({
  id: 'nationalPointNumMouseClickOverlay',
  element: nationalPointNumMouseClickElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [20, 0],
  positioning: 'top-left',
});

// 기초번호판 검색 오버레이
const basisNumberPlateMouseClickElmt = document.createElement('div');
const basisNumberPlateMouseClick = new Overlay({
  id: 'basisNumberPlateMouseClickOverlay',
  element: basisNumberPlateMouseClickElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [0, -50],
  positioning: 'bottom-center',
});

// 명예도로용 오버레이
const honorRoadClickElmt = document.createElement('div');
const honorRoadClick = new Overlay({
  id: 'honorRoadClickOverlay',
  element: honorRoadClickElmt,
  autoPan: {
    animation : {
      duration: 100
    },
    margin : 50
  },
  offset: [0, 0],
  positioning: 'bottom-center',
});

// 통합검색
const totalSearch = reactive({
  // 사물 검색
  is_search_aot_addr: false,
  // 좌표 검색
  is_search_pos_addr: false,
  is_searched: false,
  search_keyword: '',
  search_keyword_placeholder: '예) 도움6로 42,  초성검색',
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
    , linkSize: 5               // 페이지 버튼 수
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
  tab01_params_stli_val: null,  // 리
  tab01_params_stli_data: [],
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
    , linkSize: 5               // 페이지 버튼 수
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
    , linkSize: 5               // 페이지 버튼 수
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
    , linkSize: 5               // 페이지 버튼 수
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
    , linkSize: 5               // 페이지 버튼 수
    , orders: [{
      property: ''            // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  }
});


// 관심주소 등록
const addressInterest = reactive({
  params_sido_val: null,
  params_sido_data: [],
  params_sgg_val: null,
  params_sgg_data: [],
  params_search_keyword: '',
  search_result: [],
  result_count: 0,
  interest_address_dpcn_idnty_cd_nm: '',
  interest_address_reg_sn: '',
  interest_address_frst_reg_dt: '',

  tab01_items: [
    {label:'관심주소등록'},
    {label:'등록내역'},
  ],
  tab01_isActive: 0,
  interest_address_title: '',
  interest_address_result: [],
  regist_pageable: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 5		              // 한 페이지당 데이터 수
    , linkSize: 5               // 페이지 버튼 수
    , orders: [{
      property: ''            // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  },

  tab02_items: [
    {label:'단건등록'},
    {label:'일괄등록'}
  ],
  tab02_isActive: 0,
  interest_address_excel_title: '',
  interest_address_excel_result: [],
  interest_address_excel_file: null,
  interest_address_excel_file_nm: '',

  interest_address_hist_result: [],
  hist_pageable: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 10		              // 한 페이지당 데이터 수
    , linkSize: 5               // 페이지 버튼 수
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
    , linkSize: 5               // 페이지 버튼 수
    , orders: [{
      property: ''            // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  }
});

// 국가지점번호판
const nationalPointNum = reactive({
  params_sido_val: null,
  params_sido_data: [],
  params_sgg_val: null,
  params_sgg_data: [],
  params_point_Num: '',
  search_result: [],
  result_count: 0,
  result_offset: 0,
  ctpvCd : '',
  lgvReplcCd : '',
  ssn : '',
  pageable: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 10		              // 한 페이지당 데이터 수
    , linkSize: 5               // 페이지 버튼 수
    , orders: [{
      property: ''            // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  }
});

// 국가지점번호판
const basisNumberPlatePaging = reactive({});
const basisNumberPlate = reactive({
  params_sido_val: null, // 시도
  params_sido_data: [],
  params_sgg_val: null,  // 시군구
  params_sgg_data: [],
  params_start_char: null, // 초성
  params_road_name: null,// 도로명
  params_road_data: [],
  params_bnmn: '',       // 건물번호 본번
  params_bnsn: '',       // 건물번호 부번
  search_keyword: '',
  search_result: [],
  result_count: 0,
  result_offset: 0,
  pageable: {
    first: 0
    , totalRecords: 0     		  // 전체 데이터 수
    , currentRecords: 0    		  // 현재 보여지는 데이터 수
    , totalPages: 0        	    // 전체 페이지 수
    , page: 0	                  // 현재 페이지
    , size: 10 		              // 한 페이지당 데이터 수
    , linkSize: 5               // 페이지 버튼 수
    , orders: [{
      property: ''              // 정렬할 속성 이름
      , direction: ''           // 정렬 방향 (ASC 또는 DESC)
    }]
  },
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
  , linkSize: 5               // 페이지 버튼 수
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

// 페이징 유지용 변수
const onPagingParams = reactive({});

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

// 사물/좌표 검색 버튼 클릭
const fnChangeSearchAotPos = (type) => {
  if (type === 'aot') {
    if (totalSearch.is_search_aot_addr) {
      totalSearch.is_search_pos_addr = false;
      totalSearch.search_keyword_placeholder = '예) 도움6로 42,  초성검색';
    }
  } else {
    if (totalSearch.is_search_pos_addr) {
      totalSearch.search_keyword = '';
      totalSearch.is_search_aot_addr = false;
      totalSearch.search_keyword_placeholder = '예) [경위도] 126.8979, 37.5767 / [TM] 946833, 1953210';
    } else {
      totalSearch.search_keyword_placeholder = '예) 도움6로 42,  초성검색';
    }
  }
}

const toggleActive = () => {
  isActive.value = !isActive.value;
  scrollToSelectedAll()
}

// 관심주소등록 탭 초기화
const fnInitAddrIntrTab01 = () => {
  // 초기화
  addressInterest.params_sido_val = null;
  addressInterest.params_sgg_val = null;
  addressInterest.params_sgg_data = [];
  addressInterest.params_search_keyword = '';
  addressInterest.search_result = [];
  addressInterest.result_count = 0;
  addressInterest.interest_address_title = '';
  addressInterest.interest_address_result = [];
  addressInterest.interest_address_reg_sn = '';
  addressInterest.interest_address_frst_reg_dt = '';
  addressInterest.tab02_isActive = 0;
}

// 관심주소/ 등록내역 탭 이동
const fnChangeAddrIntrTab01 = (index) => {

  if(index === 1) {
    if (addressInterest.interest_address_result.length > 0){
      if (confirm("등록 중인 주소가 있습니다. \n화면을 이동하시면 등록 중인 내용은 저장 되지 않습니다. \n화면이동하시겠습니까?")) {
        // 초기화
        fnInitAddrIntrTab01();
      } else {
        fnCloseCertificationModal();
        return;
      }
    }

    // di 유무에 따라 인증체크 확인
    if(_.isEmpty(addressInterest.interest_address_dpcn_idnty_cd_nm)){
      // 인증 체크
      niceCertificationModal.value.fnShowCertificationDialog('hist');
      // addressInterest.tab01_isActive = 0;
    } else {
      fnSelectAddrItrstList();
      addressInterest.tab01_isActive = index;
    }
  } else {
    addressInterest.tab01_isActive = index;
    // 초기화
    fnInitAddrIntrTab01();
  }
  addressInterestLayer.getSource().clear();
}

// 단건/일괄 등록 탭 이동
const fnChangeAddrIntrTab02 = (e) => {
  addressInterest.tab02_isActive = e.index;
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
  fnTotalSearch();
}

//검색결과 영역 토글
const isActiveTotalResultList = ref(false);
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
const fnToggleKadtAotMng = () => {
  isActiveKadtAotMng.value = !isActiveKadtAotMng.value;

  if (isActiveKadtAotMng.value) {
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
const fnToggleHahuFclts = () => {
  isActiveHahuFclts.value = !isActiveHahuFclts.value;

  if (isActiveHahuFclts.value) {
    // 피쳐 클릭 추가
    comMapEditor.value.getMap().on('pointermove', fnGovMachOverlay);
    comMapEditor.value.getMap().on('singleclick', fnAddGovMachInfo);
  } else {
    // 피쳐 클릭 삭제
    comMapEditor.value.getMap().un('pointermove', fnGovMachOverlay);
    comMapEditor.value.getMap().un('singleclick', fnAddGovMachInfo);
  }
}

// 행정구역 토글
const fnToggleEmdBndry = () => {
  isActiveEmdBndry.value = !isActiveEmdBndry.value;
};

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
// 통합검색 로딩바
const isTotalSearchLoadingBar = ref(false);
// 상세검색(도로명주소) 로딩바
const isDetailSearchTab00LoadingBar = ref(false);
// 상세검색(지번) 로딩바
const isDetailSearchTab01LoadingBar = ref(false);
// 상세검색(건물명) 로딩바
const isDetailSearchTab02LoadingBar = ref(false);
// 상세검색(기초번호) 로딩바
const isDetailSearchTab03LoadingBar = ref(false);
// 상세검색(XY좌표) 로딩바
const isDetailSearchTab04LoadingBar = ref(false);
// 기초구역검색 로딩바
const isBasicDistrictSearchLoadingBar = ref(false);
// 관심주소 로딩바
const isAddressInterestLoadingBar = ref(false);
// 국가지점번호판검색 로딩바
const isNationalPointNumLoadingBar = ref(false);
// 기초번호판검색 로딩바
const isBasisNumberPlateLoadingBar = ref(false);

// 상단 메뉴 검색
const toogleLayerPopup = (popupNumber) => {
  activeLayerPopup.value = activeLayerPopup.value === popupNumber ? null : popupNumber

  // 상세검색
  if (activeLayerPopup.value !== 1) {
    // 피쳐 초기화
    fnClearMeasure();
  }

  // 기초구역 검색
  if (activeLayerPopup.value === 2) {
    fnCallKarbSbd();
  } else {
    // 국가기초구역 선택 레이어 삭제
    let sbdLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_KARB_SBD_LAYER');
    if (sbdLayer) {
      comMapEditor.value.getMap().removeLayer(sbdLayer);
    }

    // 국가기초구역 레이어 삭제
    const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('TBL_KARB_SBD_LAYER');
    if (searchLayer) {
      comMapEditor.value.getMap().removeLayer(searchLayer);
      isActiveKarbSbd.value = false;
    }
  }

  // 관심주소
  if (activeLayerPopup.value !== 3) {
    addressInterestLayer.getSource().clear();
  }

  // 국가지점번호판 검색
  if (activeLayerPopup.value === 4) {
    fnCallKargSsnp(true);
  } else {
    // 이미 존재하는 레이어인지 체크
    const kargSsnpLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_KARG_SSNP_LAYER');

    if (kargSsnpLayer) {
      comMapEditor.value.getMap().removeLayer(kargSsnpLayer);
      // 피쳐 이벤트 삭제
      comMapEditor.value.getMap().un('pointermove', fnKargSsnpOverlay);
      comMapEditor.value.getMap().un('singleclick', fnAddKargSsnpInfo);
      isActiveKargSsnp.value = false;
    }

    let searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('MV_VBL_KARG_SSNP_LAYER');
    if (searchLayer) {
      comMapEditor.value.getMap().removeLayer(searchLayer);
    }

    nationalPointNumMouseClickElmt.innerHTML = '';
    nationalPointNumMouseClick.setPosition(undefined);
  }

  // 기초번호판 검색
  if (activeLayerPopup.value !== 5) {
    // 이미 존재하는 레이어인지 체크
    let searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('TBL_KAFF_BSNP_LAYER');
    if (searchLayer) {
      comMapEditor.value.getMap().removeLayer(searchLayer);
    }

    basisNumberPlateMouseClickElmt.innerHTML = '';
    basisNumberPlateMouseClick.setPosition(undefined);
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

// 상세검색 클릭
const onTabChange = (e) => {
  active.value = e.index;

  // // 레이어 초기화
  // buldEqbLayer.getSource().clear();
  // sprdManageLayer.getSource().clear();
  // sprdIntrvlLayer.getSource().clear();
  // // 오버레이 초기화
  // addrInfoMouseClickElmt.innerHTML = '';
  // addrInfoMouseClick.setPosition(undefined);
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

// 지도 가이드
const guideDialogVisible = ref(false);

const guideOnShowDialog = () => {
  guideDialogVisible.value = true;
  setTimeout(() => {
    document.getElementById('guideDialogFocus').focus();
  }, 0);
}

const guideCloseDialog = () => {
  guideDialogVisible.value = false;
}

const guideOnHideDialog = () => {
  const helpButton = document.querySelector('.integratedMap__headerHelp');
  if (helpButton) {
    helpButton.focus();
  }
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

const selectedCategories = ref('PNG');
const categories = ref([
  { label: '지도화면 PNG로 저장하기', bgColor: "#4e40db", icon: "bi bi-filetype-png", title: "지도화면 PNG로 저장하기", value: "PNG" },
  { label: '지도화면 JPG로 저장하기', bgColor: "#2a51c7", icon: "bi bi-filetype-jpg", title: "지도화면 JPG로 저장하기", value: "JPEG" },
  { label: '지도화면 PDF로 저장하기', bgColor: "#d93f4a", icon: "bi bi-filetype-pdf", title: "지도화면 PDF로 저장하기", value: "PDF" },
]);

const fnShowHideTip = (event, isDisplay = true, type = 'menu') => {
  let tip = null;
  if(type === 'menu') {
    tip = event.currentTarget.querySelectorAll('.tip');
  } else {

    tip = document.querySelectorAll('.integratedMap__mapLevel span.tip');
  }

  if (tip) {
    tip.forEach(item => {
      item.style.display = isDisplay ? 'block' : 'none';
    });
  }

}


onMounted(async () => {
  // 페이징 복제용
  Object.assign(onPagingParams, inqCndParams);

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
  addressInterest.params_sido_data = [...data];
  nationalPointNum.params_sido_data = [...data];
  basisNumberPlate.params_sido_data = [...data];
  mapCenterAddr.params_sido_data = [...data];

  // 모든 버튼에 이벤트 리스너 추가
  const buttons = document.querySelectorAll('.integratedMap__mapFunction.type01 button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', (evt) => fnShowHideTip(evt, true, 'menu'));
    button.addEventListener('mouseleave', (evt) => fnShowHideTip(evt, false, 'menu'));
  });

  // 줌 버튼
  const zoomButton01 = document.querySelector('.integratedMap__mapFunction.type04');
  if(zoomButton01) {
    zoomButton01.addEventListener('mouseenter', (evt) => fnShowHideTip(evt, true, 'zoom'));
    zoomButton01.addEventListener('mouseleave', (evt) => fnShowHideTip(evt, false, 'zoom'));
  }
  const zoomButton02 = document.querySelector('.integratedMap__mapFunction.type03');
  if(zoomButton02) {
    zoomButton02.addEventListener('mouseenter', (evt) => fnShowHideTip(evt, true, 'zoom'));
    zoomButton02.addEventListener('mouseleave', (evt) => fnShowHideTip(evt, false, 'zoom'));
  }
  const zoomslider = document.querySelector('.ol-zoomslider');
  if(zoomslider) {
    zoomslider.addEventListener('mouseenter', (evt) => fnShowHideTip(evt, true, 'zoom'));
    zoomslider.addEventListener('mouseleave', (evt) => fnShowHideTip(evt, false, 'zoom'));
  }

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
            // if(stdgCd.value.substring(0, 2) === '52') {
            //   stdgCd.value = '45' + stdgCd.value.substring(2);
            // }

            mapCenterDataLoad(stdgCd.value)
          });
        }
      }
    });
}

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
  if(!totalSearch.is_search_pos_addr) {
    isAutoCompleteOpen.value = true;
    if(event.target.value.length > 0) {
      autoParams.keyword = event.target.value;
      axios.post('/api/solr/solrAutocomplete', autoParams)
      .then((response) => {
        //검색을 수행했지만 사용자가 그 전에 다시 키워드를 삭제한 경우 예외처리
        if (!totalSearch.search_keyword) {
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
          isActiveRecentSearches.value = false;
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
const fnSelectSuggesion = (keyword) => {
  totalSearch.search_keyword = keyword;
  fnTotalSearch();
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
    fnSearchEmdData("mapCenterAddrEmd", imsiCounty)
  }
  if (type === 'mapCenterTown') {
    activeTown.value = index;
    imsiTown.value = item.value
  }

}

//지역선택 팝업 확인 버튼
const mapCenterPointOkButton = () => {

  const params = {};

  // mapCenterAddr.params_sido_val = imsiCity.value
  // mapCenterAddr.params_sgg_val = imsiCounty.value
  // mapCenterAddr.params_emd_val = imsiTown.value

  if(_.isEmpty(imsiCounty.value) && _.isEmpty(imsiTown.value)) {
    params.ctprvnCd = imsiCity.value.toString().substring(0,2);
  } else if(_.isEmpty(imsiTown.value)) {
    params.sigCd = imsiCounty.value;
  } else {
    params.emdCd = imsiCounty.value + imsiTown.value;
  }

  isActive.value = false;
  moveCenterPoint(params);
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
 * 맵 중심으로 이동
 */
const moveCenterPoint = (params) => {
  axios.post('/api/totalMap/selectMoveMapCenterPoint',params)
  .then((response) => {
    if(response.data !== null) {
      const dataList = response.data
      comMapEditor.value.getMap().getView().fit([dataList.minX, dataList.minY, dataList.maxX, dataList.maxY]);
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
    if (!_.isEmpty(hahuFcltsType.value) && evt.frameState.viewState.zoom < 10) {
      alert('시설물정보는 읍면동(10레벨) 이상에서 조회가 가능합니다.');
      hahuFcltsType.value = '';
      const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_HAHU_FCLTS_LAYER');
      if (searchLayer) {
        comMapEditor.value.getMap().removeLayer(searchLayer);
      }
    } else if (isActiveKargSsnp.value && evt.frameState.viewState.zoom < 8) {
      alert('국가지점번호판은 시군구(8레벨) 이상에서 조회가 가능합니다.');
      isActiveKargSsnp.value = false;
      const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_KARG_SSNP_LAYER');
      if (searchLayer) {
        comMapEditor.value.getMap().removeLayer(searchLayer);
      }
    }

    if(isActiveKargSsnp.value){
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

  // 지도 마우스 포인터 설정
  comMapEditor.value.getMap().getViewport().style.cursor = 'grab';
  comMapEditor.value.getMap().on('pointerdrag', (evt) => {
    comMapEditor.value.getMap().getViewport().style.cursor = 'grabbing';
  });
  comMapEditor.value.getMap().on('pointerup', (evt) => {
    comMapEditor.value.getMap().getViewport().style.cursor = 'grab';
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
  comMapEditor.value.getMap().addOverlay(nationalPointNumMouseClick);
  comMapEditor.value.getMap().addOverlay(basisNumberPlateMouseClick);
  comMapEditor.value.getMap().addOverlay(honorRoadClick);

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
  // 도로명 주소 조회
  } else if (route.query?.searchType?.includes('addr')) {
    isLinkAddr = true;
    if (route.query?.rdNmAddr) {
      totalSearch.search_keyword = route.query.rdNmAddr;
      fnTotalSearch();
      // fnSearchRoadNameInfo({rnCd:route.query.rdCd, sigCd:route.query.sigCd});
    }
  // 도로명
  } else if (route.query?.searchType?.includes('roadNm')) {
    isLinkRoadNm = true;
    if (route.query?.rdCd) {
      totalSearch.search_keyword = route.query.rdNm;
      fnTotalSearch();
      fnSearchRoadNameInfo({rnCd:route.query.rdCd, sigCd:route.query.sigCd});
    }
  // 명예도로 조회
  } else if (route.query?.searchType?.includes('honorRoad')) {
    if (route.query?.sigCd) {
      fnSearchHonorRoadNameInfo({rdNm:route.query.rdNm, sigCd:route.query.sigCd, honRoaSn:route.query.honRoaSn});
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
      fnSearchAot('C', {'thngMgno' : route.query.thngMgno});
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
  // 기초번호
  } else if (route.query?.searchType && route.query.searchType === 'basicNum') {
    if (route.query?.rnCd && route.query?.sigCd) {
      fnSearchBasicNum({
        rnCd: route.query.rnCd ?? ''
        , sigCd: route.query.sigCd ?? ''
        , rdNmIdx: route.query.rdNmIdx ?? ''
        , rdNm: route.query.rdNm ?? ''
        , bdMaSn: route.query.bdMaSn ?? ''
        , bdSlno: route.query.bdSlno ?? ''
      });
    }
  } else {
    // comMapEditor.value.getMap().getView().setCenter([949219.3, 1947495.6]);
    comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);// 전주
    // comMapEditor.value.getMap().getView().setCenter([1002442.364, 1813212.333]);// 국가지점번호판 테스트
    // comMapEditor.value.getMap().getView().setCenter([974948.7390899544, 1895721.4479178444]);// 민원행정기관 테스트
    comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
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
    style: (ft) => mapStyles.fnGetSprdManageFlagStyle(ft, { strokeColor: 'rgba(243,64,164,0.8)', strokeWidth: 5 }),
  });

  honorRoadLayer = new VectorLayer({
    layerName: 'honorRoadLayer',
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetSprdManageFlagStyle(ft, { strokeColor: 'rgba(243,64,164,0.8)', strokeWidth: 5 }),
  });

  sprdIntrvlLayer = new VectorLayer({
    layerName: 'sprdIntrvlLayer',
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    zIndex: 1003,
    style: (ft, rslt) => mapStyles.fnGetSprdIntrvlStyle(ft, {strokeColor: 'rgba(243,64,164,0.8)', strokeWidth: 5 }, rslt),
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

  addressInterestLayer = new VectorLayer({
    layerName: 'addressInterestLayer',
    source: new VectorSource({
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetAddrIntrStyle(ft),
  });

  comMapEditor.value.getMap().addLayer(buldEqbLayer);
  comMapEditor.value.getMap().addLayer(sprdManageLayer);
  comMapEditor.value.getMap().addLayer(honorRoadLayer);
  comMapEditor.value.getMap().addLayer(sprdIntrvlLayer);
  comMapEditor.value.getMap().addLayer(pointIconLayer);
  comMapEditor.value.getMap().addLayer(aotLayer);
  comMapEditor.value.getMap().addLayer(postLayer);
  comMapEditor.value.getMap().addLayer(ssnpLayer);
  comMapEditor.value.getMap().addLayer(addressInterestLayer);
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
 *  PDF 리더 다운로드
 */
const fnDownloadAdobeReader = () => {
  window.open('https://get.adobe.com/kr/reader/', '_blank');
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
  honorRoadLayer.getSource().clear();
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
  nationalPointNumMouseClickElmt.innerHTML = '';
  nationalPointNumMouseClick.setPosition(undefined);
  basisNumberPlateMouseClickElmt.innerHTML = '';
  basisNumberPlateMouseClick.setPosition(undefined);
  honorRoadClickElmt.innerHTML = '';
  honorRoadClick.setPosition(undefined);
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
            // sprdManageLayer.getSource().addFeature(sprdFt);
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
        detailSearch.tab00_params_start_char = '가';
        detailSearch.tab00_params_road_name = null;
        detailSearch.tab00_params_road_data = [];
      } else if (type === 'detailSearchTab01Sgg') {
        detailSearch.tab01_params_sgg_data = data;
        detailSearch.tab01_params_sgg_val = null;
        detailSearch.tab01_params_emd_data = [];
        detailSearch.tab01_params_emd_val = null;
        detailSearch.tab01_params_stli_data = [];
        detailSearch.tab01_params_stli_val = null;
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
      } else if (type === 'addressInterestSgg') {
        addressInterest.params_sgg_data = data;
        addressInterest.params_sgg_val = null;
      } else if (type === 'nationalPointNumSgg') {
        nationalPointNum.params_sgg_data = data;
        nationalPointNum.params_sgg_val = null;
      } else if (type === 'basisNumberPlateSgg') {
        basisNumberPlate.params_sgg_data = data;
        basisNumberPlate.params_sgg_val = null;
        basisNumberPlate.params_start_char = '가';
        basisNumberPlate.params_road_name = null;
        basisNumberPlate.params_road_data = [];
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
        detailSearch.tab01_params_stli_data = [];
        detailSearch.tab01_params_stli_val = null;
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
const fnSearchStliData = async (type, lgvCd, emdCd) => {
  try {
    if (lgvCd && emdCd) {
      let data = await stliDataLoad(lgvCd.value, emdCd.value);
      data = [{ label: '선택', value: null }, ...data];
      if (type === 'detailSearchTab01Tli') {
        detailSearch.tab01_params_stli_data = data;
        detailSearch.tab01_params_stli_val = null;
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
      } else if (type === 'basisNumberPlateRoadName01') {
        params.startChar = '가';
        basisNumberPlate.params_start_char = '가';
      } else if (type === 'basisNumberPlateRoadName02') {
        params.startChar = basisNumberPlate.params_start_char.value;
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
      } else if (type.includes('detailSearchTab03RoadName')) {
        detailSearch.tab03_params_road_name = null;
        detailSearch.tab03_params_road_data = chosungData;
      } else if (type.includes('basisNumberPlateRoadName')) {
        basisNumberPlate.params_road_name = null;
        basisNumberPlate.params_road_data = chosungData;
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
  const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('TBL_KARB_SBD_LAYER');
  if (searchLayer) {
    isActiveKarbSbd.value = false;
    comMapEditor.value.getMap().removeLayer(searchLayer);
  } else {
    isActiveKarbSbd.value = true;
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
}

/**
 *  행정/법정구역 호출
 */
const fnCallEmdBndry = async (type) => {
  // 이미 존재하는 레이어인지 체크
  const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('daip_emd_' + type + '_LAYER');

  if (searchLayer) {
    if (type.includes('b')) {
      isActiveEmdhBndry.value = false;
    } else {
      isActiveEmdbBndry.value = false;
    }
    comMapEditor.value.getMap().removeLayer(searchLayer);

  } else {
    if (type.includes('b')) {
      isActiveEmdhBndry.value = true;
    } else {
      isActiveEmdbBndry.value = true;
    }
    fnWmsView({
      schema: mapUtils.MAP_SERVER_SCHEMA,
      layerName: 'daip_emd_' + type,
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

  // 같은 타입이면 레이어 삭제 처리
  if (kadtAotMngType.value === type) {
    let searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_KADT_AOT_MNG_LAYER');
    if (searchLayer) {
      comMapEditor.value.getMap().removeLayer(searchLayer);
      kadtAotMngType.value = '';
    }
  } else {
    // 지도 이벤트용
    kadtAotMngType.value = type;

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

  // 같은 타입이면 레이어 삭제 처리
  if (hahuFcltsType.value === type) {
    let searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_HAHU_FCLTS_LAYER');
    if (searchLayer) {
      comMapEditor.value.getMap().removeLayer(searchLayer);
      hahuFcltsType.value = '';
    }
  } else {
    // 지도 이벤트용
    hahuFcltsType.value = type;

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
                anchor: [0.5, 1],
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
}

/**
 * 국가지점번호판
 */
const fnCallKargSsnp = async (incType) => {
  if (incType){
    comMapEditor.value.getMap().getView().setZoom(8);
  } else {

    if (comMapEditor.value.getMap().getView().getZoom() < 8) {
      if (confirm('국가지점번호판은 시군구(8레벨) 이상에서 조회가 가능합니다.\n조회하시겠습니까?')) {
        comMapEditor.value.getMap().getView().setZoom(8);
      } else {
        return;
      }
    }
  }

  // 이미 존재하는 레이어인지 체크
  const searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('VBL_KARG_SSNP_LAYER');

  if (searchLayer) {
    comMapEditor.value.getMap().removeLayer(searchLayer);
    // 피쳐 이벤트 삭제
    comMapEditor.value.getMap().un('pointermove', fnKargSsnpOverlay);
    comMapEditor.value.getMap().un('singleclick', fnAddKargSsnpInfo);
    isActiveKargSsnp.value = false;
    return;
  }

  // 국가지점번호판 active
  isActiveKargSsnp.value = true;

  // 피쳐 이벤트 추가
  comMapEditor.value.getMap().on('pointermove', fnKargSsnpOverlay);
  comMapEditor.value.getMap().on('singleclick', fnAddKargSsnpInfo);


  const sourceLayer = await new VectorSource({
    format: new GeoJSON(),
    loader: (extent, resolution, projection) => {
      // const proj = projection.getCode();
      // params.BBOX = extent.join(',') + ',' + proj;

      const mapExtent = comMapEditor.value.getMap().getView().calculateExtent(comMapEditor.value.getMap().getSize())
      const url = mapUtils.MAP_SERVER_URL + "/wfs?"
        + "SERVICE=WFS"
        + "&APIKEY=" + MAP_APIKEY
        + "&VERSION=1.1.1"
        + "&REQUEST=GetFeature"
        + "&outputFormat=application/json"
        + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":VBL_KARG_SSNP"
        + "&cql_filter=" + `(XCRD_VL > ${mapExtent[0]} and XCRD_VL < ${mapExtent[2]}) and (YCRD_VL  > ${mapExtent[1]} and YCRD_VL  < ${mapExtent[3]})`;

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
    distance: 200,
    source: sourceLayer,
  });

  let clusterCnt = 0;
  clusterSource.on('addfeature', (evt) => {
    const mapExtent = comMapEditor.value.getMap().getView().calculateExtent(comMapEditor.value.getMap().getSize())
    if(mapExtent[0] < evt.feature.getGeometry().getCoordinates()[0] && evt.feature.getGeometry().getCoordinates()[0] < mapExtent[2]
        && mapExtent[1] < evt.feature.getGeometry().getCoordinates()[1] && evt.feature.getGeometry().getCoordinates()[1] < mapExtent[3]) {
      if (evt.feature?.get('features') && evt.feature.get('features').length > 1) {

        const mapPanelTooltipEle = document.createElement('div');

        mapPanelTooltipEle.className = "tooltip-mapPanelInfo-hidden-cluster mapPanelIdx" + clusterCnt;//고유 클래스
        mapPanelTooltipEle.setAttribute('tabindex', '0');//초점 진입을 위한 속성
        mapPanelTooltipEle.setAttribute('idx', clusterCnt);//고유 클래스 할당을 위한 인덱스
        // mapPanelTooltipEle.feature = evt.feature;

        mapPanelTooltipEle.addEventListener('click', (e) => {
          comMapEditor.value.getMap().getView().animate({
            center: evt.feature.getGeometry().getCoordinates(),
            zoom: 11,
            duration: 500
          });
          // $("#map").css("cursor", "grab");
        });
        mapPanelTooltipEle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            comMapEditor.value.getMap().getView().animate({
              center: evt.feature.getGeometry().getCoordinates(),
              zoom: 11,
              duration: 500
            });
            // $("#map").css("cursor", "grab");
          }
        });

        const mapPanelTooltip = new Overlay({
          element: mapPanelTooltipEle,
          offset: [0, 0],
          positioning: 'center',
          className: 'mapPanelTooltip-hidden-cluster',
          overlayName: 'VBL_KARG_SSNP_LAYER',
        });

        mapPanelTooltip.setPosition(evt.feature.getGeometry().getCoordinates());
        comMapEditor.value.getMap().addOverlay(mapPanelTooltip);

        if (clusterCnt === 0) {
          setTimeout(() => {
            const kargSsnpInfoPopCloseBtnElement = document.getElementById("kargSsnpInfoPopCloseBtn");
            if (kargSsnpInfoPopCloseBtnElement) {
              kargSsnpInfoPopCloseBtnElement.focus();
            }
          }, 10);
        }
      } else {
        const mapPanelTooltipEle = document.createElement('div');

        mapPanelTooltipEle.className = "tooltip-mapPanelInfo-hidden-cluster-one mapPanelIdx" + clusterCnt;//고유 클래스
        mapPanelTooltipEle.setAttribute('tabindex', '0');//초점 진입을 위한 속성
        mapPanelTooltipEle.setAttribute('idx', clusterCnt);//고유 클래스 할당을 위한 인덱스

        const clickSsnpOverlay = () => {
          // 초기화
          kargSsnpMouseClickElmt.innerHTML = '';
          kargSsnpMouseClick.setPosition(undefined);
          tempKargSsnpSsn = '';

          if (evt.feature.get('features').length === 1) {
            const ssn = evt.feature.get('features')[0].get('SSN');
            kargSsnpMouseClickElmt.innerHTML = `
              <div class="integratedMap__basicLayerPopup" >
                <div class="integratedMap__basicLayerPopupHeader">
                  <p class="integratedMap__basicLayerPopupTitle">${ssn.substring(0, 2) + " " + ssn.substring(2, 6) + " " + ssn.substring(6, 10)}</p>
                  <Button class="integratedMap__basicLayerPopupButton" id="kargSsnpInfoPopCloseBtn">
                    <span class="blind">팝업닫기</span>
                    <i aria-hidden="true" class="bi bi-x-lg"></i>
                  </Button>
                </div>
                <div class="integratedMap__basicLayerPopupContent">
                  ${evt.feature.get('features')[0].get('FCLTS_KND_CD_NM')}
                </div>
              </div>
            `;

            // 마우스 오버 오버레이 초기화
            kargSsnpMouseOverElmt.innerHTML = '';
            kargSsnpMouseOver.setPosition(undefined);

            kargSsnpMouseClick.setPosition(evt.feature.get('features')[0].getGeometry().getCoordinates());
            tempKargSsnpSsn = evt.feature.get('features')[0].get('SSN');

            // 정보조회 닫기 버튼 맵핑
            document.getElementById("kargSsnpInfoPopCloseBtn").addEventListener('click', () => {
              // 초기화
              const currentElement = document.activeElement;
              if (currentElement) {
                currentElement.blur();
                const previousElement = currentElement.previousElementSibling;
                if (previousElement) {
                  previousElement.focus();
                }
              }
              kargSsnpMouseClickElmt.innerHTML = '';
              kargSsnpMouseClick.setPosition(undefined);
              tempKargSsnpSsn = '';
            });

            // 포커스 이동
            setTimeout(() => {
              // document.getElementById("kargSsnpInfoPopCloseBtn").focus();
              const kargSsnpInfoPopCloseBtnElement = document.getElementById("kargSsnpInfoPopCloseBtn");
              if (kargSsnpInfoPopCloseBtnElement) {
                kargSsnpInfoPopCloseBtnElement.focus();
              }
            }, 10);
          }
        }

        mapPanelTooltipEle.addEventListener('click', (e) => {
          clickSsnpOverlay();
          // $("#map").css("cursor", "grab");
        });
        mapPanelTooltipEle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            clickSsnpOverlay();
            // $("#map").css("cursor", "grab");
          }
        });

        const mapPanelTooltip = new Overlay({
          element: mapPanelTooltipEle,
          offset: [-15, -44],
          positioning: 'center',
          className: 'mapPanelTooltip-hidden-cluster',
          overlayName: 'VBL_KARG_SSNP_LAYER',
        });

        mapPanelTooltip.setPosition(evt.feature.getGeometry().getCoordinates());
        comMapEditor.value.getMap().addOverlay(mapPanelTooltip);
        // if(clusterCnt === 0) {
        //   setTimeout(() => {
        //     mapPanelTooltipEle.focus();
        //   }, 10);
        // }
        if (clusterCnt === 0) {
          setTimeout(() => {
            const kargSsnpInfoPopCloseBtnElement = document.getElementById("kargSsnpInfoPopCloseBtn");
            if (kargSsnpInfoPopCloseBtnElement) {
              kargSsnpInfoPopCloseBtnElement.focus();
            }
          }, 10);
        }
      }
    }
    clusterCnt++;
  });

  // 국가지점번호판 오버레이 초기화
  clusterSource.on('clear', (evt) => {

    const overlays = [];
    comMapEditor.value.getMap().getOverlays().getArray().forEach(ovly => {
      if(ovly.getOptions().className === 'mapPanelTooltip-hidden-cluster'){
        overlays.push(ovly);
      }
    });
    overlays.forEach(ovly => {
      comMapEditor.value.getMap().removeOverlay(ovly);
    });
    clusterCnt = 0;
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
 * 좌표 입력 타입
 */
const fnHandlerInputPos = (targetInput) => {
  const regex1 = /[^0-9.,\s]/g;
  const regex2 = /[^0-9.\s]/g;
  // 통합검색(좌표)
  if (totalSearch.is_search_pos_addr && !_.isEmpty(targetInput) && targetInput === 'totalSearch') {
    totalSearch.search_keyword = totalSearch.search_keyword.replace(regex1, '');
  // 상세검색(x좌표)
  } else if(!_.isEmpty(targetInput) && targetInput === 'xPosition') {
    xyPosition.xPosition = xyPosition.xPosition.replace(regex2, '');
  // 상세검색(y좌표)
  } else if(!_.isEmpty(targetInput) && targetInput === 'yPosition') {
    xyPosition.yPosition = xyPosition.yPosition.replace(regex2, '');
  }
}

/**
 * 통합검색
 */
const fnTotalSearch = (pageParams) => {

  // 페이징 유무 체크
  if (pageParams) {
    onPagingParams.pageable.page = pageParams.page;
    totalSearch.is_search_aot_addr = onPagingParams.strAotYn === 'Y' ? true : false;
    totalSearch.is_search_pos_addr = onPagingParams.strSearchType === 'COORDINATE' ? true : false;
    totalSearch.search_keyword = onPagingParams.keyword;
  }

  if (totalSearch.search_keyword.length < 2) {
    alert("검색어는 두글자 이상 입력되어야 합니다.");
    return;
  } else {
    const searchParams = {...inqCndParams};

    // 좌표 검색 valid
    if(totalSearch.is_search_pos_addr) {
      const coordinatePattern = /^[+-]?(\d+(\.\d*)?|\.\d+),\s*[+-]?(\d+(\.\d*)?|\.\d+)$/;
      const isValid = ref(true);
      const cleanedValue = totalSearch.search_keyword.replace(/\s+/g, '');
      isValid.value = coordinatePattern.test(cleanedValue);

      //입력값 유효성 체크
      if (!isValid.value) {
        alert("X, Y 형태로 입력해주세요.\n예) [경위도] 126.8979, 37.5767 / [TM] 946833, 1953210");
        return;
      } else {
        let param = cleanedValue.split(",");

        if (param[0] < 124 || ( 133 <= param[0] && param[0] < 705680) || 1388291 < param[0]) {
          alert("유효하지 않은 경위도 X값 입니다.\n범위 : [경위도] 124이상 ~ 133미만 / [TM] 705,680이상 ~ 1,388,291이하");
          return;
        }

        if (param[1] < 33 || ( 44 <= param[1] && param[1] < 1349270) || 2581448 < param[1]) {
          alert("유효하지 않은 경위도 Y값 입니다.\n범위 : [경위도] 33이상 ~ 44미만 / [TM] 1,349,270이상 ~ 2,581,448이하");
          return;
        }
      }
    }

    // solr 호출
    searchParams.keyword = totalSearch.search_keyword;
    searchParams.strFirstSort = "none";

    if (isHistoryEnabled.value === true) {
      historyKeywordSave(searchParams.keyword);
    }

    isActiveRecentSearches.value = false;
    isTotalSearchLoadingBar.value = true;

    if (totalSearch.is_search_aot_addr) {
      searchParams.strAotYn = 'Y';

      // 페이징 체크
      if (pageParams) {
        Object.assign(searchParams, onPagingParams);
      } else {
        Object.assign(onPagingParams, searchParams);
      }

      axios.post('/api/solr/solrAotSearch', searchParams)
        .then((response) => {
          isActiveTotalResultList.value = true;
          isActiveResultList.value = true;
          totalSearch.is_searched = true;
          const data = response.data;
          // console.log("############# result ->> ", data);
          if (data.results?.content?.length > 0) {
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
          if(isActiveTotalResultList.value) {
            // 자동완성 닫기
            autoCompleteDataList.value.splice(0);
            isAutoCompleteOpen.value = false;
          }
          isTotalSearchLoadingBar.value = false;
        });
    } else {
      if (totalSearch.is_search_pos_addr){
        searchParams.strSearchType = 'COORDINATE';
      } else {
        searchParams.strSearchType = 'HSTRY';
      }

      searchParams.strAotYn = 'N';

      // 페이징 체크
      if (pageParams) {
        Object.assign(searchParams, onPagingParams);
      } else {
        Object.assign(onPagingParams, searchParams);
      }

      axios.post('/api/solr/solrKeywordSearch', searchParams)
        .then((response) => {
          isActiveTotalResultList.value = true;
          isActiveResultList.value = true;
          totalSearch.is_searched = true;
          const data = response.data;
          // console.log("############# result ->> ", data);
          if (data.results?.content?.length > 0) {
            totalSearch.search_result = data.results.content;
            pageInfo.totalRecords = data.results.totalElements;
            pageInfo.currentRecords = data.results.numberOfElements;
            pageInfo.totalPages = data.results.totalPages;
            totalSearch.result_count = data.results.totalElements;
            if (data.results.content[0].schMode === 'SOLR' && data.results.content[0].engYn !== 'Y') {
              totalSearch.result_msg = '검색결과';
            } else if(data.results.content[0].engYn === 'Y') {
              totalSearch.result_msg = '검색결과가 없어 검색어 "' + data.results.content[0].originKeyword + '"에 대한 검색 결과';
            } else {
              totalSearch.result_msg = '검색결과가 없어 주변 주소로 검색한 결과';
            }
            // 도로명 주소 조회 메뉴에서 통합지도 조회한 경우
            if(isLinkAddr) {
              fnClickSearchSpbd(data.results.content[0]);
              isLinkAddr = false;
            }
            // 본 페이지에서 통합지도의 도로명을 조회한 경우
            if(isLinkRoadNm) {
              // 주소정보 팝업 세팅
              const x = mapUtils.decrypt(parseFloat(Number(data.results.content[0].d)));
              const y = mapUtils.decrypt(parseFloat(Number(data.results.content[0].k)));
              fnAddAddrInfo(false, [x, y], data.results.content[0]);
              isLinkRoadNm = false;
            }
          } else {
            totalSearch.search_result = data.results.content;
            pageInfo.totalRecords = 0;
            pageInfo.currentRecords = 0;
            pageInfo.totalPages = 0;
            totalSearch.result_count = 0;
            totalSearch.result_msg = '검색결과';
            // 도로명 주소 조회 메뉴에서 통합지도 조회한 경우
            if(isLinkAddr) {
              comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
              isLinkAddr = false;
            }
            // 본 페이지에서 통합지도의 도로명을 조회한 경우
            if(isLinkRoadNm) {
              comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
              isLinkRoadNm = false;
            }
          }
        })
        .finally(() => {
          //메세지 숨김
          if(isActiveTotalResultList.value) {
            // 자동완성 닫기
            autoCompleteDataList.value.splice(0);
            isAutoCompleteOpen.value = false;
          }
          isTotalSearchLoadingBar.value = false;
        });
    }
  }
}

/**
 * 상세검색
 */
const fnDetailSearch = (tabType, pageParams) => {
  const searchParams = {...inqCndParams};

  let keyword = '';
  let url = '/api/solr/solrDetailSearch';

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
      searchParams.pageable.page = pageParams.page;
    } else {
      detailSearch.tab00_pageInfo.page = 0;
      searchParams.pageable.page = 0;
    }

    // keyword = detailSearch.tab00_params_sido_val.label + " " + detailSearch.tab00_params_sgg_val.label +
    //   (detailSearch.tab00_params_road_name ? " " + detailSearch.tab00_params_road_name.label : "") +
    //   (detailSearch.tab00_params_bnmn ? " " + detailSearch.tab00_params_bnmn : "") +
    //   (detailSearch.tab00_params_bnsn ? " " + detailSearch.tab00_params_bnsn : "");
    // detailSearch.tab00_search_keyword = keyword;
    //
    // searchParams.keyword = keyword;
    // searchParams.strFirstSort = "road";
    // searchParams.strAotYn = 'N';
    // searchParams.searchType = 'DETAIL';
    // searchParams.functionName = 'detailSearch';



    searchParams.searchType = 'DETAIL';
    searchParams.dsgubuntext = 'road';
    searchParams.dscity1text = detailSearch.tab00_params_sido_val.label;
    searchParams.dscounty1text = detailSearch.tab00_params_sgg_val.label;
    searchParams.dsrdNm1text = detailSearch.tab00_params_road_name ? detailSearch.tab00_params_road_name.label : "";
    searchParams.dsma = detailSearch.tab00_params_bnmn ? detailSearch.tab00_params_bnmn : "";
    searchParams.dssb = detailSearch.tab00_params_bnsn ? detailSearch.tab00_params_bnsn : "";

    searchParams.keyword = keyword;
    searchParams.strFirstSort = "road";
    searchParams.strAotYn = 'N';
    searchParams.functionName = 'detailSearch';
    isDetailSearchTab00LoadingBar.value = true;
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
      searchParams.pageable.page = pageParams.page;
    } else {
      detailSearch.tab01_pageInfo.page = 0;
      searchParams.pageable.page = 0;
    }

    keyword = detailSearch.tab01_params_sido_val.label + " " + detailSearch.tab01_params_sgg_val.label +
      (detailSearch.tab01_params_emd_val ? " " + detailSearch.tab01_params_emd_val.label : "") +
      (detailSearch.tab01_params_stli_val ? " " + detailSearch.tab01_params_stli_val.label : "") +
      (detailSearch.tab01_params_mtn_se_cd ? " 산" : "") +
      (_.isEmpty(detailSearch.tab01_params_mno) ? "" : " " + detailSearch.tab01_params_mno.replace(/ /g,"")) +
      (_.isEmpty(detailSearch.tab01_params_sno) ? "" : "-" + detailSearch.tab01_params_sno.replace(/ /g,""));
    detailSearch.tab01_search_keyword = keyword;

    searchParams.searchType = 'DETAIL';
    searchParams.dsgubuntext = 'jibun';
    searchParams.dscity1text = detailSearch.tab01_params_sido_val.label;
    searchParams.dscounty1text = detailSearch.tab01_params_sgg_val.label;
    searchParams.dsemd1text = detailSearch.tab01_params_emd_val ? detailSearch.tab01_params_emd_val.label : '';
    searchParams.dsri1text = detailSearch.tab01_params_stli_val ? detailSearch.tab01_params_stli_val.label : '';
    searchParams.dssan1text = detailSearch.tab01_params_mtn_se_cd ? '1' : '0';
    searchParams.dsbun1 = detailSearch.tab01_params_mno;
    searchParams.dsbun2 = detailSearch.tab01_params_sno;

    searchParams.keyword = keyword;
    searchParams.strFirstSort = "location";
    searchParams.strAotYn = 'N';
    isDetailSearchTab01LoadingBar.value = true;
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
    } else if (_.isEmpty(detailSearch.tab02_params_buld_nm)) {
      alert("건물명을 입력해주세요.");
      return;
    }

    // 페이징 유무 체크
    if (pageParams) {
      detailSearch.tab02_pageInfo.page = pageParams.page;
      searchParams.pageable.page = pageParams.page;
    } else {
      detailSearch.tab02_pageInfo.page = 0;
      searchParams.pageable.page = 0;
    }

    keyword = detailSearch.tab02_params_sido_val.label + " " + detailSearch.tab02_params_sgg_val.label +
        (detailSearch.tab02_params_emd_val ? " " + detailSearch.tab02_params_emd_val.label : "");
    detailSearch.tab02_search_keyword = keyword;

    searchParams.searchType = 'DETAIL';
    searchParams.dsgubuntext = 'building';
    searchParams.dscity1text = detailSearch.tab02_params_sido_val.label;
    searchParams.dscounty1text = detailSearch.tab02_params_sgg_val.label;
    searchParams.dsemd1text = detailSearch.tab02_params_emd_val ? detailSearch.tab02_params_emd_val.label : '';
    searchParams.dsbuilding1 = detailSearch.tab02_params_buld_nm;

    // searchParams.searchKeyword = keyword;
    searchParams.strFirstSort = "build";
    searchParams.strAotYn = 'N';
    searchParams.functionName = 'detailSearch';
    isDetailSearchTab02LoadingBar.value = true;
  }

  axios.post(url, searchParams)
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
      }
    })
    .finally(() => {
      //메세지 숨김
      isDetailSearchTab00LoadingBar.value = false;
      isDetailSearchTab01LoadingBar.value = false;
      isDetailSearchTab02LoadingBar.value = false;
    });
}

/**
 * 기초번호 도로명 변경
 */
const fnChangeRoadName = () => {
  if(!_.isEmpty(detailSearch.tab03_params_road_name)) {
    fnDetailSearchSprdIntrvl();
  }
}

/**
 * 기초번호 검색
 */
const fnDetailSearchSprdIntrvl = (pageParams) => {

  // 페이징 유무 체크
  if (pageParams) {
    detailSearch.tab03_pageInfo.page = pageParams.page;
  } else {
    detailSearch.tab03_pageInfo.page = 0;
  }

  let url = '/api/totalMap/selectSprdIntrvlList';

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

  const params = {
    sigCd : detailSearch.tab03_params_sgg_val.value
    , rnCd : detailSearch.tab03_params_road_name.value
    , bdMaSn : detailSearch.tab03_params_bnmn
    , bdSlno : detailSearch.tab03_params_bnsn
    , pageable: {
      page: pageParams ? pageParams.page : 0,
      size: pageSize.value,
    }
  }

  // 전북특별자치도 데이터 변경으로 인한 임시 수정
  // if(basicDistrict.lgvReplcCd?.substring(0, 2) === '52') {
  //   basicDistrict.lgvReplcCd = '45' + basicDistrict.lgvReplcCd.substring(2);
  // }

  isDetailSearchTab03LoadingBar.value = true;
  axios.post(url, params)
  .then(async (response) => {
    const data = response.data;
    console.log("############# result ->> ", data);
    if (data.results?.content?.length > 0) {
      // 기초번호 초기화
      sprdManageLayer.getSource().clear();
      sprdIntrvlLayer.getSource().clear();
      sprdIntrvlMouseClickElmt.innerHTML = '';
      sprdIntrvlMouseClick.setPosition(undefined);

      // 지도에 도로구간 생성
      const cql_filter = "rn_cd='" + detailSearch.tab03_params_road_name.value + "' and sig_cd='" + detailSearch.tab03_params_sgg_val.value + "'";
      const resVal = await fnSearchSprdRoad(cql_filter);
      if (resVal && resVal.length) {
        resVal.forEach(road => {
          const format = new GeoJSON();
          const sprdFt = format.readFeature(road);
          // sprdManageLayer.getSource().addFeature(sprdFt);
        });
      }
      detailSearch.tab03_search_result = data.results.content;
      detailSearch.tab03_pageInfo.totalRecords = data.results.totalElements;
      detailSearch.tab03_pageInfo.currentRecords = data.results.numberOfElements;
      detailSearch.tab03_pageInfo.totalPages = data.results.totalPages;
      detailSearch.tab03_result_count = data.results.totalElements;

      // 첫번째 결과값 위치로 이동
      fnClickSearchIntrvl(data.results.content[0]);

    } else {
      detailSearch.tab03_search_result = data.results.content;
      detailSearch.tab03_pageInfo.totalRecords = 0;
      detailSearch.tab03_pageInfo.currentRecords = 0;
      detailSearch.tab03_pageInfo.totalPages = 0;
      detailSearch.tab03_result_count = 0;
    }
  })
  .finally(() => {
    //메세지 숨김
    isDetailSearchTab03LoadingBar.value = false;
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
  // 전북특별자치도 데이터 변경으로 인한 임시 수정
  if(basicDistrict.lgvReplcCd?.substring(0, 2) === '52') {
    basicDistrict.lgvReplcCd = '45' + basicDistrict.lgvReplcCd.substring(2);
  }
  isBasicDistrictSearchLoadingBar.value = true;

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
      isBasicDistrictSearchLoadingBar.value = false;
    });
}

/**
 * XY좌표 검색
 */
const fnSearchCoordinate = (pageParams) => {

  const searchParams = {...inqCndParams};

  // 페이징 유무 체크
  if (pageParams) {
    xyPosition.pageable.page = pageParams.page;
    searchParams.pageable.page = pageParams.page;
  }

  if (!/^\d*[.]\d*$/.test(xyPosition.xPosition) && !/^\d*$/.test(xyPosition.xPosition)) {
    alert("X좌표를 형식에 맞게 입력해주세요.");
    return;
  } else if (!/^\d*[.]\d*$/.test(xyPosition.yPosition) && !/^\d*$/.test(xyPosition.yPosition)) {
    alert("Y좌표를 형식에 맞게 입력해주세요.");
    return;
  }


  // 좌표 검색 valid
  const coordinatePattern = /^[+-]?(\d+(\.\d*)?|\.\d+),\s*[+-]?(\d+(\.\d*)?|\.\d+)$/;
  const isValid = ref(true);
  const cleanedValue =  (xyPosition.xPosition + ',' + xyPosition.yPosition).replace(/\s+/g, '');
  isValid.value = coordinatePattern.test(cleanedValue);

  //입력값 유효성 체크
  if (!isValid.value) {
    alert("좌표 형식에 맞게 입력해주세요.\n예) [경위도] 126.8979, 37.5767 / [TM] 946833, 1953210");
    return;
  } else {
    let param = cleanedValue.split(",");

    if (param[0] < 124 || ( 133 <= param[0] && param[0] < 705680) || 1388291 < param[0]) {
      alert("유효하지 않은 경위도 X값 입니다.\n범위 : [경위도] 124이상 ~ 133미만 / [TM] 705,680이상 ~ 1,388,291이하");
      return;
    }

    if (param[1] < 33 || ( 44 <= param[1] && param[1] < 1349270) || 2581448 < param[1]) {
      alert("유효하지 않은 경위도 Y값 입니다.\n범위 : [경위도] 33이상 ~ 44미만 / [TM] 1,349,270이상 ~ 2,581,448이하");
      return;
    }
  }

  // solr 호출
  searchParams.keyword = xyPosition.xPosition + ',' + xyPosition.yPosition;
  searchParams.strFirstSort = "none";
  searchParams.strSearchType = 'COORDINATE';
  searchParams.strAotYn = 'N';
  isDetailSearchTab04LoadingBar.value = true;
  axios.post('/api/solr/solrKeywordSearch', searchParams)
  .then((response) => {
    const data = response.data;
    // console.log("############# result ->> ", data);
    if ( data.results?.content?.length > 0) {
      xyPosition.search_result = data.results.content;
      xyPosition.pageable.totalRecords = data.results.totalElements;
      xyPosition.pageable.currentRecords = data.results.numberOfElements;
      xyPosition.pageable.totalPages = data.results.totalPages;
      xyPosition.result_count = data.results.totalElements;
    } else {
      xyPosition.search_result = data.results.content;
      xyPosition.pageable.totalRecords = 0;
      xyPosition.pageable.currentRecords = 0;
      xyPosition.pageable.totalPages = 0;
      xyPosition.result_count = 0;
    }
  })
  .finally(() => {
    //메세지 숨김
    isDetailSearchTab04LoadingBar.value = false;
  });
}

/**
 * 관심주소 조회
 */
const fnSearchAddrItrst = (pageParams) => {

  if (_.isEmpty(addressInterest.params_sido_val)) {
    alert("시도를 선택하세요.");
    return;
  } else if (_.isEmpty(addressInterest.params_sgg_val)) {
    alert("시군구를 선택하세요.");
    return;
  } else if(_.isEmpty(addressInterest.params_search_keyword)) {
    alert('주소를 입력해 주세요.');
    return;
  }

  // 페이징 유무 체크
  if (pageParams) {
    addressInterest.regist_pageable.page = pageParams.page;
  } else {
    addressInterest.regist_pageable.page = 0;
  }

  const keyword = addressInterest.params_sido_val.label + " " + addressInterest.params_sgg_val.label + " " + addressInterest.params_search_keyword;

  const params = {
      keyword: keyword
    , strSearchType: "HSTRY"
    , strFirstSort: "none"
    , strAblYn: "N"
    , strAotYn: "N"
    , strSynnYn: null
    , strHstryYn: "Y"
    , reqFrom: "RN_SEARCH_KOR_WEB"
    , checkMoblieYn: "N"
    , strFunctionName: "Y"
    , pageTotal: addressInterest.regist_pageable.totalPages
    , pageable: {
      page: addressInterest.regist_pageable.page,
      size: addressInterest.regist_pageable.size,
    }
  };

  isAddressInterestLoadingBar.value = true;
  axios.post('/api/solr/solrKeywordSearch', params)
    .then((response) => {
      const data = response.data;
      if (data.results?.content?.length > 0) {
        addressInterest.search_result = data.results.content;
        addressInterest.regist_pageable.totalRecords = data.results.totalElements;
        addressInterest.regist_pageable.currentRecords = data.results.numberOfElements;
        addressInterest.regist_pageable.totalPages = data.results.totalPages;
        addressInterest.regist_pageable.first = data.results.pageable.offset;
      } else {
        addressInterest.search_result = data.results.content;
        addressInterest.regist_pageable.totalRecords = 0;
        addressInterest.regist_pageable.currentRecords = 0;
        addressInterest.regist_pageable.totalPages = 0;
        addressInterest.regist_pageable.first = 0;
      }
    })
    .finally(() => {
      //메세지 숨김
      isAddressInterestLoadingBar.value = false;
    });

  const container = document.querySelector('.integratedMap__addressTable.scroll01');
  if (container) {
    container.scrollTop = 0;
  }

}

/**
 * 관심주소 지도 표시
 */
const fnAddMapAddrItrst = (res, idx) => {
  const x = mapUtils.decrypt(parseFloat(Number(res.d)));
  const y = mapUtils.decrypt(parseFloat(Number(res.k)));
  const newFeature = new Feature(new Point([x, y]));
  newFeature.set('addrIntrNo', idx.toString());
  newFeature.set('adrMngNo', res.adrMngNo);
  newFeature.setId('addrIntrNo_' + idx);
  addressInterestLayer.getSource().addFeature(newFeature);
}

/**
 * 관심주소 추가
 */
const fnAddAddrItrst = (res) => {
  // 동일 주소 체크
  let chkDuplAddr = false;
  addressInterest.interest_address_result.forEach((item, idx) => {
    if (res.adrMngNo === item.adrMngNo) {
      chkDuplAddr = true;
    }
  });

  if (chkDuplAddr) {
    alert(res.schKorRoadNm + '은(는) 이미 추가한 주소입니다.');
    return;
  }

  // 관심주소 영역 추가
  addressInterest.interest_address_result.push(res);
  // 관심주소 지도 표시
  fnAddMapAddrItrst(res, addressInterest.interest_address_result.length.toString());
}

/**
 * 관심주소 이동
 */
const fnViewAddrItrst = (res) => {
  const x = mapUtils.decrypt(parseFloat(res.d));
  const y = mapUtils.decrypt(parseFloat(res.k));

  comMapEditor.value.getMap().getView().setCenter([x, y]);
  comMapEditor.value.getMap().getView().setZoom(13);
}

/**
 * 관심주소 전체 이동
 */
const fnMoveAllAddrItrst = () => {

  if (addressInterest.tab02_isActive === 0) { // 단건 등록
    if (addressInterest.interest_address_result.length > 0) {
      addressInterestLayer.getSource().clear();
      addressInterest.interest_address_result.forEach((item, idx) => {
        // 관심주소 지도 표시
        fnAddMapAddrItrst(item, idx+1);
      });
    }
  } else { // 일괄 등록
    if (addressInterest.interest_address_excel_result.length > 0) {

      addressInterestLayer.getSource().clear();
      // check valid
      let chkCovertGubun = addressInterest.interest_address_excel_result.some((item) => item.covertGubun === "0");

      // 주소 선택 유무
      let noSelectAddr = false;
      document.querySelectorAll('.integratedMap__addressDataSelect select').forEach((elmt) => {
        if (!noSelectAddr && _.isEmpty(elmt.value)) {
          noSelectAddr = true;
        }
      });

      if(chkCovertGubun || noSelectAddr) {
        alert('지도 정보가 없거나 선택 되지 않은 주소가 있습니다.');
        return;
      }
      addressInterest.interest_address_excel_result.forEach((item, idx) => {
        // 관심주소 지도 표시
        if (item.subList.length > 1) {
          document.querySelectorAll('.integratedMap__addressDataSelect select').forEach((elmt) => {
            if (String(idx) === elmt.dataset.index){
              fnAddMapAddrItrst(item.subList[elmt.selectedIndex - 1], idx+1);
            }
          });
        } else {
          fnAddMapAddrItrst(item.subList[0], idx+1);
        }
      });
    }
  }
  comMapEditor.value.getMap().getView().fit(addressInterestLayer.getSource().getExtent());
  if(comMapEditor.value.getMap().getView().getZoom()-1 > 0){
    comMapEditor.value.getMap().getView().setZoom(comMapEditor.value.getMap().getView().getZoom()-1);
  }
}

/**
 * 관심주소 단건/일괄 엑셀 다운로드
 */
const fnAddrItrstExcelDwnld = async () => {
  const excelDataList = [];
  let header = null;

  if (addressInterest.tab02_isActive === 0) { // 단건 등록
    addressInterest.interest_address_result.forEach((item, idx) => {
      const excelData = {
        no : String(idx + 1)
        , roadNm : item.schKorRoadNm
      }
      excelDataList.push(excelData);
    });

    header = {
      "no": "순번"
      , "roadNm": "도로명주소"
    }
  } else { // 일괄 등록

    // 주소 선택 유무
    let noSelectAddr = false;
    document.querySelectorAll('.integratedMap__addressDataSelect select').forEach((elmt) => {
      if (!noSelectAddr && _.isEmpty(elmt.value)) {
        noSelectAddr = true;
      }
    });

    if(noSelectAddr) {
      alert('지도 정보가 없거나 선택 되지 않은 주소가 있습니다.');
      return;
    }

    addressInterest.interest_address_excel_result.forEach((item, idx) => {
      let excelData = null;
      // 관심주소 지도 표시
      if (item.subList.length > 1) {
        document.querySelectorAll('.integratedMap__addressDataSelect select').forEach((elmt) => {
          if (String(idx) === elmt.dataset.index){
            excelData = {
              no : String(idx + 1)
              , orgAddr : item.orgAddr
              , roadNm : item.subList[elmt.selectedIndex - 1].searchResult
            };
          }
        });
      } else {
        excelData = {
          no : String(idx + 1)
          , orgAddr : item.orgAddr
          , roadNm : item.subList[0].searchResult
        };
      }
      excelDataList.push(excelData);
    });

    header = {
      "no": "순번"
      , "orgAddr": "입력주소"
      , "roadNm": "도로명주소"
    }
  }

  let param = {
    "fileNm": "주소내역다운로드"
    , "headerEngTitle": header
    , "dataList": excelDataList
  }

  axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
    .then(response => {
      const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = '주소내역다운로드.xlsx';
      link.click();
    })
    .catch(error => {
      console.error("error =>", error);
    });
}

/**
 * 단건등록 관심주소 삭제
 */
const fnRemoveAddrItrst = (evt, res) => {

  addressInterest.interest_address_result = addressInterest.interest_address_result.filter(item => item.adrMngNo !== res.adrMngNo);

  addressInterestLayer.getSource().clear();
  if (addressInterest.interest_address_result.length > 0) {
    addressInterest.interest_address_result.forEach((item, idx) => {
      // 관심주소 지도 표시
      fnAddMapAddrItrst(item, idx+1);
    });
  }
  evt.stopPropagation();

}

/**
 * 일괄등록 관심주소 삭제
 */
const fnRemoveAddrItrstExcel = (evt, res) => {
  if (confirm(res.orgAddr + " 삭제 하시겠습니까?")) {
    addressInterest.interest_address_excel_result = addressInterest.interest_address_excel_result.filter(item => item.rowNum !== res.rowNum);
  }
  evt.stopPropagation();
}

/**
 * 관심주소 이동
 */
const fnMoveAddrItrst = (evt, res, pos) => {

  let arrPos = 0;
  addressInterest.interest_address_result.forEach((item, idx) => {
    if (item.adrMngNo === res.adrMngNo) {
      arrPos = idx;
    }
  });

  // 배열 위치 변경 함수
  const switchVal = (arr, idx1, idx2) => {
    const tmp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = tmp;
  }

  if (pos === 'up') {
    if (arrPos > 0) {
      switchVal(addressInterest.interest_address_result, arrPos - 1, arrPos);
    } else {
      evt.stopPropagation();
      return;
    }
  } else {
    if (arrPos < addressInterest.interest_address_result.length - 1) {
      switchVal(addressInterest.interest_address_result, arrPos, arrPos + 1);
    } else {
      evt.stopPropagation();
      return;
    }
  }

  if (addressInterest.interest_address_result.length > 0) {
    addressInterestLayer.getSource().clear();
    addressInterest.interest_address_result.forEach((item, idx) => {
      // 관심주소 지도 표시
      fnAddMapAddrItrst(item, idx+1);
    });
  }

  evt.stopPropagation();
}

/**
 * 관심주소 valid check
 */
const fnValidAddrItrst = () => {

  if (addressInterest.tab02_isActive === 0) { // 단건 등록
    if (_.isEmpty(addressInterest.interest_address_title)) {
      alert('관심(배달지점) 주소명을 입력하세요.');
      return;
    } else if (addressInterest.interest_address_result.length < 1) {
      alert('선택된 주소가 없습니다.');
      return;
    }
  } else { // 일괄 등록
    let msg = "";

      if (_.isEmpty(addressInterest.interest_address_excel_title)) {
      alert('관심(배달지점) 주소명을 입력하세요.');
      return;
    }

    // 주소 선택 유무 체크
    let isNotSelectAddr = false;
    document.querySelectorAll('.integratedMap__addressDataSelect select').forEach((elmt) => {
      if (!isNotSelectAddr && _.isEmpty(elmt.value)) {
        isNotSelectAddr = true;
      }
    });

    // 지도 정보 없음 유무 체크
    let isSecAddr = false;
    addressInterest.interest_address_excel_result.forEach((item, idx) => {
      if (item.subList.length > 1) {
        document.querySelectorAll('.integratedMap__addressDataSelect select').forEach((elmt) => {
          if (!isSecAddr && String(idx) === elmt.dataset.index && _.isEmpty(item.subList[elmt.selectedIndex - 1].d)){
            isSecAddr = true;
          }
        });
      } else {
        if (!isSecAddr && _.isEmpty(item.subList[0].d)) {
          isSecAddr = true;
        }
      }
    });

    // 주소 선택 유무 체크
    if (isNotSelectAddr) {
      msg += "선택하지 않은 주소가 존재합니다.\n";
    }

    // 검색 안된 데이터 체크
    if (addressInterest.interest_address_excel_result.some((item) => item.covertGubun === "0")){
      msg += "검색되지 않는 도로명이 존재합니다.\n";
    }

    // 지도 정보 없음 유무 체크
    if (isSecAddr) {
      msg += "지도정보가 없는 주소가 존재합니다.\n";
    }

    if(!_.isEmpty(msg)) {
      msg += "해당주소를 삭제하시고 다시시도해 주세요.";
      alert(msg);
      return;
    }
  }

  // di 유무에 따라 인증체크 확인
  if(_.isEmpty(addressInterest.interest_address_dpcn_idnty_cd_nm)){
    // 인증 체크
    niceCertificationModal.value.fnShowCertificationDialog('save');
  } else {
    fnSaveAddrItrst();
  }
}

/**
 * 관심주소 저장
 */
const fnSaveAddrItrst = () => {
  const intrAddrDltList = [];
  let params = null;

  if (addressInterest.tab02_isActive === 0) { // 단건 등록
    addressInterest.interest_address_result.forEach((item, idx) => {
      const intrAddrDlt = {
        // DI 코드
        dpcnIdntyCdNm : addressInterest.interest_address_dpcn_idnty_cd_nm,
        // 등록 일련번호
        regSn : addressInterest.interest_address_reg_sn,
        // 정렬번호
        sortSn : idx + 1,
        // 도로명 주소
        roadNmAddr : item.schKorRoadNm,
        // x좌표값
        xcrdVl : item.d,
        // y좌표값
        ycrdVl : item.k,
        // 지방자치단체 코드
        lgvReplcCd : '',
        // 도로명 코드
        roadNmCd : '',
        // 건물본번
        bmno : item.bdMaSn,
        // 건물부번
        bsno : item.bdSbSn,
        // 도로관리번호
        // rdMgtSn : item.rdMgtSn,
      }
      intrAddrDltList.push(intrAddrDlt);
    });

    params = {
      // DI 코드
      dpcnIdntyCdNm : addressInterest.interest_address_dpcn_idnty_cd_nm,
      // 등록 일련번호
      regSn : addressInterest.interest_address_reg_sn,
      // 등록일자
      frstRegDt : addressInterest.interest_address_frst_reg_dt,
      // 게시물 제목
      pstTtl : addressInterest.interest_address_title,
      // 게시물 제목
      useYn : 'Y',
      // 상세목록
      totalMapAddrIntrDtlDtoList : intrAddrDltList
    }
  } else { // 일괄 등록

    addressInterest.interest_address_excel_result.forEach((item, idx) => {
      const intrAddrDlt = {
        // DI 코드
        dpcnIdntyCdNm : addressInterest.interest_address_dpcn_idnty_cd_nm,
        // 정렬번호
        sortSn : idx + 1,

      }

      if (item.subList.length > 1) {
        document.querySelectorAll('.integratedMap__addressDataSelect select').forEach((elmt) => {
          if (String(idx) === elmt.dataset.index) {
            // 도로명 주소
            intrAddrDlt['roadNmAddr'] = item.subList[elmt.selectedIndex - 1].searchResult;
            // x좌표값
            intrAddrDlt['xcrdVl'] = item.subList[elmt.selectedIndex - 1].d;
            // y좌표값
            intrAddrDlt['ycrdVl'] = item.subList[elmt.selectedIndex - 1].k;
            // 지방자치단체 코드
            intrAddrDlt['lgvReplcCd'] = '';
            // 도로명 코드
            intrAddrDlt['roadNmCd'] = '';
            // 건물본번
            intrAddrDlt['bmno'] = item.subList[elmt.selectedIndex - 1].bdMaSn;
            // 건물부번
            intrAddrDlt['bsno'] = item.subList[elmt.selectedIndex - 1].bdSbSn;
            // 도로관리번호
            // intrAddrDlt['rdMgtSn'] = item.subList[elmt.selectedIndex - 1].rdMgtSn;
          }
        });
      } else {
        // 도로명 주소
        intrAddrDlt['roadNmAddr'] = item.subList[0].searchResult;
        // x좌표값
        intrAddrDlt['xcrdVl'] = item.subList[0].d;
        // y좌표값
        intrAddrDlt['ycrdVl'] = item.subList[0].k;
        // 지방자치단체 코드
        intrAddrDlt['lgvReplcCd'] = '';
        // 도로명 코드
        intrAddrDlt['roadNmCd'] = '';
        // 건물본번
        intrAddrDlt['bmno'] = item.subList[0].bdMaSn;
        // 건물부번
        intrAddrDlt['bsno'] = item.subList[0].bdSbSn;
        // 도로관리번호
        // intrAddrDlt['rdMgtSn'] = item.subList[0].rdMgtSn;
      }
      intrAddrDltList.push(intrAddrDlt);
    });

    params = {
      // DI 코드
      dpcnIdntyCdNm : addressInterest.interest_address_dpcn_idnty_cd_nm,
      // 게시물 제목
      pstTtl : addressInterest.interest_address_excel_title,
      // 게시물 제목
      useYn : 'Y',
      // 상세목록
      totalMapAddrIntrDtlDtoList : intrAddrDltList
    }
  }

  // 검색엔진에서 정보 조회
  axios.post('/api/totalMap/saveAddrIntr', params)
  .then((res) => {
    if (res.status === 200) {
      if (res.results?.regSn) {
        addressInterest.interest_address_reg_sn = res.results.regSn;
      }

      if (confirm("등록되었습니다.\n등록내역으로 이동하시겠습니까?")) {
        // 초기화
        addressInterestLayer.getSource().clear();
        fnInitAddrIntrTab01();
        fnChangeAddrIntrTab01(1);
      }
    }
  });
}

/**
 * 관심주소 일괄등록 파일 열기
 */
const fnUploadAddrIntr = () => {
  document.getElementById("uploadIntrAddrExcelFile").click();
}

/**
 * 관심주소 일괄등록 파일 업로드
 */
const fnOnloadAddrIntr = (evt) => {
  const file = document.getElementById("uploadIntrAddrExcelFile").files[0];

  if(file) {
    addressInterest.interest_address_excel_file = file;
    addressInterest.interest_address_excel_file_nm = file.name;
  }
}

/**
 * 관심주소 일괄등록 파일 업로드
 */
const fnConvertAddrIntr = (evt) => {
  if(addressInterest.interest_address_excel_file) {
    const formData = new FormData();
    formData.append('file', addressInterest.interest_address_excel_file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    // 엑셀 파일 변ㄱ검색엔진에서 정보 조회
    axios.post('/api/totalMap/convertExcelFile', formData, config)
    .then((res) => {
      if (res.status === 200) {
        if (res.data?.results?.rstCode === 'success') {
          addressInterest.interest_address_excel_result = res.data.results.rstList;
        }
      }
    });
  }
}

/**
 * 관심주소 조회
 */
const fnSelectAddrItrstList = (pageParams) => {

  // 페이징 유무 체크
  if (pageParams) {
    addressInterest.hist_pageable.page = pageParams.page;
  } else {
    addressInterest.hist_pageable.page = 0;
  }

  const params ={
    // DI 코드
    dpcnIdntyCdNm : addressInterest.interest_address_dpcn_idnty_cd_nm
    // , pageable : addressInterest.hist_pageable
    , pageable: {
      page: addressInterest.hist_pageable.page,
      size: addressInterest.hist_pageable.size,
    }

  }

  // 검색엔진에서 정보 조회
  axios.post('/api/totalMap/selectAddrIntrList', params)
  .then((res) => {
    if (res.status === 200) {
      const data = res.data;
      if (data.results?.content?.length > 0) {
        addressInterest.interest_address_hist_result = data.results.content;
        addressInterest.hist_pageable.totalRecords = data.results.totalElements;
        addressInterest.hist_pageable.currentRecords = data.results.numberOfElements;
        addressInterest.hist_pageable.totalPages = data.results.totalPages;
        addressInterest.hist_pageable.first = data.results.pageable.offset;
      } else {
        addressInterest.interest_address_hist_result = data.results.content;
        addressInterest.hist_pageable.totalRecords = 0;
        addressInterest.hist_pageable.currentRecords = 0;
        addressInterest.hist_pageable.totalPages = 0;
        addressInterest.hist_pageable.first = 0;
      }
    }
  });

  const container = document.querySelector('.integratedMap__registrationDetailsList');
  if (container) {
    container.scrollTop = 0;
  }
}

/**
 * 관심주소 상세 보기
 */
const fnDetailAddrItrst = (evt, res) => {
  addressInterest.tab01_isActive = 0;
  addressInterest.interest_address_title = res.pstTtl;
  addressInterest.interest_address_dpcn_idnty_cd_nm = res.dpcnIdntyCdNm;
  addressInterest.interest_address_reg_sn = res.regSn;
  addressInterest.interest_address_frst_reg_dt = res.frstRegDt;

  const addrRes = []
  res.totalMapAddrIntrDtlDtoList.forEach(item => {
    const detailObj = {
        schKorRoadNm : item.roadNmAddr
      , d : item.xcrdVl
      , k : item.ycrdVl
      , bdMaSn : item.bmno
      , bdSbSn : item.bsno
      , adrMngNo : item.sortSn
    }
    addrRes.push(detailObj);
  });
  addressInterest.interest_address_result = addrRes;

  //관심주소 전체 이동
  fnMoveAllAddrItrst();

  evt.stopPropagation();
}

/**
 * 관심주소 지도 보기
 */
const fnMapViewAddrItrst = (evt, res) => {

  if (res.totalMapAddrIntrDtlDtoList?.length > 0) {
    addressInterestLayer.getSource().clear();
    res.totalMapAddrIntrDtlDtoList.forEach((item, idx) => {
      // 관심주소 지도 표시
      const detailObj = {
        schKorRoadNm : item.roadNmAddr
        , d : item.xcrdVl
        , k : item.ycrdVl
        , bdMaSn : item.bmno
        , bdSbSn : item.bsno
        , adrMngNo : item.sortSn
      }
      fnAddMapAddrItrst(detailObj, idx+1);
    });
    comMapEditor.value.getMap().getView().fit(addressInterestLayer.getSource().getExtent());
    if(comMapEditor.value.getMap().getView().getZoom()-1 > 0){
      comMapEditor.value.getMap().getView().setZoom(comMapEditor.value.getMap().getView().getZoom()-1);
    }
  }

  evt.stopPropagation();
}

/**
 * 관심주소 삭제
 */
const fnDeleteAddrItrst = (evt, res) => {
  if (confirm("삭제 하시겠습니까?")) {
    // 파라미터 체크
    if (_.isEmpty(res.dpcnIdntyCdNm) && _.isEmpty(res.regSn)) {
      return;
    }
  } else {
    return;
  }


  const params = {
    dpcnIdntyCdNm : res.dpcnIdntyCdNm
    , regSn : res.regSn
  }

  // 검색엔진에서 정보 조회
  axios.post('/api/totalMap/deleteAddrIntr', params)
  .then((res) => {
    if (res.status === 200) {
      alert('삭제되었습니다.');
      fnSelectAddrItrstList({page : addressInterest.hist_pageable.page});
    }
  });

  evt.stopPropagation();
}

/**
 * 국가지점번호판 검색
 */
const fnSearchNationalPointNum = (pageParams) => {

  // 페이징 유무 체크
  if (pageParams) {
    nationalPointNum.pageable.page = pageParams.page;
  } else {
    nationalPointNum.pageable.page = 0;
  }

  if (nationalPointNum.params_point_Num.length > 2) {
  } else if (_.isEmpty(nationalPointNum.params_sido_val?.value) && nationalPointNum.params_point_Num.length < 3) {
    alert("시도를 선택하거나 구역번호를 3자리 이상 입력하세요.");
    return;
  } else if ((nationalPointNum.params_sido_val?.value.substring(0, 2) !== '36' && _.isEmpty(nationalPointNum.params_sgg_val?.value) && nationalPointNum.params_point_Num.length < 3)) {
    alert("시군구를 선택하거나 구역번호를 3자리 이상 입력하세요.");
    return;
  }

  // 시도 파라미터 세팅
  if (nationalPointNum.params_sido_val && nationalPointNum.params_sido_val.value) {
    nationalPointNum.ctpvCd = nationalPointNum.params_sido_val.value.substring(0, 2);
  } else {
    nationalPointNum.ctpvCd = '';
  }

  // 시구군 파라미터 세팅
  if (nationalPointNum.params_sgg_val && nationalPointNum.params_sgg_val.value) {
    nationalPointNum.ctpvCd = ''
    nationalPointNum.lgvReplcCd = nationalPointNum.params_sgg_val.value;
  } else {
    nationalPointNum.lgvReplcCd = '';
  }
  // 시구군 파라미터 세팅
  nationalPointNum.ssn = nationalPointNum.params_point_Num;

  // 전북특별자치도 데이터 변경으로 인한 임시 수정
  if(nationalPointNum.lgvReplcCd?.substring(0, 2) === '52') {
    nationalPointNum.lgvReplcCd = '45' + nationalPointNum.lgvReplcCd.substring(2);
  }
  isNationalPointNumLoadingBar.value = true;

  axios.post('/api/totalMap/selectSsnpPrstList', nationalPointNum)
  .then((response) => {
    const data = response.data;
    // console.log("############# result ->> ", data);
    if (data.results?.content?.length > 0) {
      nationalPointNum.search_result = data.results.content;
      nationalPointNum.pageable.totalRecords = data.results.totalElements;
      nationalPointNum.pageable.currentRecords = data.results.numberOfElements;
      nationalPointNum.pageable.totalPages = data.results.totalPages;
      nationalPointNum.result_offset = data.results.pageable.offset;
      nationalPointNum.result_count = data.results.totalElements;
    } else {
      nationalPointNum.search_result = data.results.content;
      nationalPointNum.pageable.totalRecords = 0;
      nationalPointNum.pageable.currentRecords = 0;
      nationalPointNum.pageable.totalPages = 0;
      nationalPointNum.result_offset = 0;
      nationalPointNum.result_count = 0;
    }
  })
  .finally(() => {
    //메세지 숨김
    isNationalPointNumLoadingBar.value = false;
  });
}

/**
 * 검색결과 클릭(국가지점번호판)
 */
const fnClickSearchNationalPointNum = (res) => {

  nationalPointNumMouseClickElmt.innerHTML = '';
  nationalPointNumMouseClick.setPosition(undefined);

  if (res.xcrdVl && res.ycrdVl) {
    const geom = comMapEditor.value.fnGetDrawClass().fnCreateGeom('Point', [res.xcrdVl, res.ycrdVl])
    const feature = new Feature(geom)

    let searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('MV_VBL_KARG_SSNP_LAYER');
    if (searchLayer) {
      // comMapEditor.value.getMap().removeLayer(searchLayer);
      searchLayer.getSource().clear();
    } else {

      searchLayer = new VectorLayer({
        layerName: 'MV_VBL_KARG_SSNP_LAYER',
        source: new VectorSource(),
        zIndex: 1003,
        style: mapStyles.fnGetNationalPointNumStyle,
      });
      comMapEditor.value.getMap().addLayer(searchLayer);
    }

    nationalPointNumMouseClickElmt.innerHTML = `
      <div class="integratedMap__basicLayerPopup" >
        <div class="integratedMap__basicLayerPopupHeader">
          <p class="integratedMap__basicLayerPopupTitle">${res.ssn}</p>
          <Button class="integratedMap__basicLayerPopupButton" id="nationalPointNumPopCloseBtn">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg"></i>
          </Button>
        </div>
        <div class="integratedMap__basicLayerPopupContent">
          ${res.lctnAddr}<br/>
          ${res.fcltsKndCdNm}
        </div>
      </div>
    `;
    nationalPointNumMouseClick.setPosition([res.xcrdVl, res.ycrdVl]);

    // 정보조회 닫기 버튼 맵핑
    document.getElementById("nationalPointNumPopCloseBtn").addEventListener('click', () => {
      // 초기화
      nationalPointNumMouseClickElmt.innerHTML = '';
      nationalPointNumMouseClick.setPosition(undefined);

      searchLayer.getSource().removeFeature(feature);
    });

    searchLayer.getSource().addFeature(feature);
    comMapEditor.value.getMap().getView().setCenter([res.xcrdVl, res.ycrdVl]);
  }
}

/**
 * 기초번호판 지도 추가
 */
const fnAddMapBasisNumberPlate = () => {
  if (basisNumberPlate.search_result) {

    let searchLayer = comMapEditor.value.fnGetDrawClass().fnSearchLayerByName('TBL_KAFF_BSNP_LAYER');
    if (searchLayer) {
      searchLayer.getSource().clear();
    } else {

      searchLayer = new VectorLayer({
        layerName: 'TBL_KAFF_BSNP_LAYER',
        source: new VectorSource({
          format: new GeoJSON()
        }),
        zIndex: 1003,
        style: (ft) => mapStyles.fnGetAddrIntrStyle(ft),

      });
      comMapEditor.value.getMap().addLayer(searchLayer);
    }

    // 기초번호판 지도에 추가
    basisNumberPlate.search_result.forEach((item, idx) => {
      const feature = new Feature(new Point([item.grs80XcrdVl, item.grs80YcrdVl]));
      feature.set('addrIntrNo', (idx+1).toString());
      searchLayer.getSource().addFeature(feature);
    });

    comMapEditor.value.getMap().getView().fit(searchLayer.getSource().getExtent());
  }
}

/**
 * 기초번호판 검색
 */
const fnSearchBasisNumberPlate = (pageParams) => {

  if (_.isEmpty(basisNumberPlate.params_sido_val)) {
    alert("시도를 선택하세요.");
    return;
  } else if (_.isEmpty(basisNumberPlate.params_sgg_val)) {
    alert("시군구를 선택하세요.");
    return;
  }

  const searchParams = {};

  // 시구군 파라미터 세팅
  if (basisNumberPlate.params_sgg_val && basisNumberPlate.params_sgg_val.value) {
    searchParams.lgvCd = basisNumberPlate.params_sgg_val.value;
  }
  // 도로명 파라미터 세팅
  if (basisNumberPlate.params_road_name && basisNumberPlate.params_road_name.value) {
    searchParams.roadNmCd = basisNumberPlate.params_road_name.value;
  }
  // 기초번호 본번 파라미터 세팅
  if (!_.isEmpty(basisNumberPlate.params_bnmn)) {
    searchParams.isptBnmn = basisNumberPlate.params_bnmn;
  }
  // 기초번호 부번 파라미터 세팅
  if (!_.isEmpty(basisNumberPlate.params_bnsn)) {
    searchParams.isptBnsn = basisNumberPlate.params_bnsn;
  }

  // 전북특별자치도 데이터 변경으로 인한 임시 수정
  // if(searchParams.lgvCd?.substring(0, 2) === '52') {
  //   searchParams.lgvCd = '45' + searchParams.lgvCd.substring(2);
  // }

  // 페이징 유무 체크
  if (pageParams) {
    basisNumberPlate.pageable.page = pageParams.page;
    searchParams.pageable.page = pageParams.page;
    Object.assign(searchParams, basisNumberPlatePaging);
  } else {
    basisNumberPlate.pageable.page = 0;
    searchParams.pageable = {...basisNumberPlate.pageable};
    Object.assign(basisNumberPlatePaging, searchParams);
  }
  isBasisNumberPlateLoadingBar.value = true;

  axios.post('/api/totalMap/selectKaffBsnpList', searchParams)
  .then((response) => {
    const data = response.data;
    // console.log("############# result ->> ", data);
    if (data.results?.content?.length > 0) {
      basisNumberPlate.search_result = data.results.content;
      basisNumberPlate.pageable.totalRecords = data.results.totalElements;
      basisNumberPlate.pageable.currentRecords = data.results.numberOfElements;
      basisNumberPlate.pageable.totalPages = data.results.totalPages;
      basisNumberPlate.result_offset = data.results.pageable.offset;
      basisNumberPlate.result_count = data.results.totalElements;
      fnAddMapBasisNumberPlate();
    } else {
      basisNumberPlate.search_result = data.results.content;
      basisNumberPlate.pageable.totalRecords = 0;
      basisNumberPlate.pageable.currentRecords = 0;
      basisNumberPlate.pageable.totalPages = 0;
      basisNumberPlate.result_offset = 0;
      basisNumberPlate.result_count = 0;
    }
  })
  .finally(() => {
    //메세지 숨김
    isBasisNumberPlateLoadingBar.value = false;
  });
}

/**
 * 검색결과 클릭(기초번호판)
 */
const fnClickSearchBasisNumberPlate = (res) => {

  basisNumberPlateMouseClickElmt.innerHTML = '';
  basisNumberPlateMouseClick.setPosition(undefined);

  if (res.grs80XcrdVl && res.grs80YcrdVl) {
    basisNumberPlateMouseClickElmt.innerHTML = `
      <div class="integratedMap__basicLayerPopup" >
        <div class="integratedMap__basicLayerPopupHeader">
          <p class="integratedMap__basicLayerPopupTitle">${_.isEmpty(res.bsnpNsflCdNm) ? res.nsflEtcCn : res.bsnpNsflCdNm}</p>
          <Button class="integratedMap__basicLayerPopupButton" id="basisNumberPlatPopCloseBtn">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg"></i>
          </Button>
        </div>
        <div class="integratedMap__basicLayerPopupContent">
          ${res.crvsfPlaneSeCdNm}<br/>
          ${res.lgvReplcCdNm} ${res.stdgCdNm ?? ''}<br/>
          ${res.korrdNm} ${ res.bsnpBnsn === '0' ? res.bsnpBnmn : res.bsnpBnmn + '-' + res.bsnpBnsn} ${_.isEmpty(res.romRoadNm) ? '' : '('+res.romRoadNm+')'}
        </div>
      </div>
    `;
    basisNumberPlateMouseClick.setPosition([res.grs80XcrdVl, res.grs80YcrdVl]);

    // 정보조회 닫기 버튼 맵핑
    document.getElementById("basisNumberPlatPopCloseBtn").addEventListener('click', () => {
      // 초기화
      basisNumberPlateMouseClickElmt.innerHTML = '';
      basisNumberPlateMouseClick.setPosition(undefined);
    });

    comMapEditor.value.getMap().getView().setCenter([res.grs80XcrdVl, res.grs80YcrdVl]);
  }
}

/**
 * 인증 완료(DI 전달)
 */
const fnGetDpcnIdntyCdNm = (res) => {
  if(!_.isEmpty(res.di)){
    addressInterest.interest_address_dpcn_idnty_cd_nm = res.di;

    if (res.type === 'save') {
      fnSaveAddrItrst();
    } else if (res.type === 'hist') {
      fnSelectAddrItrstList();
      addressInterest.tab01_isActive = 1;
    }
  }
}

/**
 * 인증 모달 닫기
 */
const fnCloseCertificationModal = () => {
  addressInterest.tab01_isActive = 0;
  // setTimeout(() => {
  //   addressInterest.tab01_isActive = 0;
  // }, 0);
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
      comMapEditor.value.getMap().getViewport().style.cursor = 'grab';

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
          comMapEditor.value.getMap().getViewport().style.cursor = 'pointer';
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
  // if (isPointerMove) {
  //   isPointerMove = false;
  //   setTimeout(() => {
  //     isPointerMove = true;
  //   }, 50);
    aotAddrMouseOverElmt.innerHTML = '';
    aotAddrMouseOver.setPosition(undefined);
  comMapEditor.value.getMap().getViewport().style.cursor = 'grab';

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
        comMapEditor.value.getMap().getViewport().style.cursor = 'pointer';
      }
    });
  // }
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
  // if (isPointerMove) {
  //   isPointerMove = false;
  //   setTimeout(() => {
  //     isPointerMove = true;
  //   }, 50);
    govMachMouseOverElmt.innerHTML = '';
    govMachMouseOver.setPosition(undefined);
  comMapEditor.value.getMap().getViewport().style.cursor = 'grab';

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
        comMapEditor.value.getMap().getViewport().style.cursor = 'pointer';
      }
    });
  // }
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
  // if (isPointerMove) {
  //   isPointerMove = false;
  //   setTimeout(() => {
  //     isPointerMove = true;
  //   }, 50);
    kargSsnpMouseOverElmt.innerHTML = '';
    kargSsnpMouseOver.setPosition(undefined);
    comMapEditor.value.getMap().getViewport().style.cursor = 'grab';

    comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {
      if (ft && ft.get('features') && ft.get('features').length && lyr && lyr.get('layerName') && lyr.get('layerName').includes('VBL_KARG_SSNP_LAYER')) {
        if (ft.get('features').length === 1 && ft.get('features')[0].get('SSN') && tempKargSsnpSsn !== ft.get('features')[0].get('SSN')) {
          const ssn = ft.get('features')[0].get('SSN');
          kargSsnpMouseOverElmt.innerHTML = `
            <div class="integratedMap__moveLayerPopup" >
              <div class="integratedMap__moveLayerPopupContent">
                ${ssn.substring(0, 2) + " " + ssn.substring(2, 6) + " " + ssn.substring(6, 10)}
              </div>
            </div>
          `;
          kargSsnpMouseOver.setPosition(evt.coordinate);

        } else {
          kargSsnpMouseOverElmt.innerHTML = '';
          kargSsnpMouseOver.setPosition(undefined);
        }
        comMapEditor.value.getMap().getViewport().style.cursor = 'pointer';
      } else {
        comMapEditor.value.getMap().getViewport().style.cursor = 'grab';
      }
    });
  // }
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
          const ssn = ft.get('features')[0].get('SSN');
          kargSsnpMouseClickElmt.innerHTML = `
            <div class="integratedMap__basicLayerPopup" >
              <div class="integratedMap__basicLayerPopupHeader">
                <p class="integratedMap__basicLayerPopupTitle">${ssn.substring(0, 2) + " " + ssn.substring(2, 6) + " " + ssn.substring(6, 10)}</p>
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
            // zoom: comMapEditor.value.getMap().getView().getZoom() + 1,
            zoom: 11,
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
 * 검색 결과 클릭(기초번호)
 */
const fnClickSearchIntrvl = (res, isClick = false) => {
  if(isClick){
    sprdIntrvlMouseClickElmt.innerHTML = `
      <div class="integratedMap__basicLayerPopup" >
        <div class="integratedMap__basicLayerPopupHeader">
          <p class="integratedMap__basicLayerPopupTitle">기초번호 조회</p>
          <Button class="integratedMap__basicLayerPopupButton" id="sprdIntrvlInfoPopCloseBtn">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg"></i>
          </Button>
        </div>
        <div class="integratedMap__basicLayerPopupContent">
          ${res.roadNm} ${((_.isEmpty(res.bsiSl) || res.bsiSl === '0' ) ? res.bsiMn : res.bsiMn + '-' + res.bsiSl )}
        </div>
      </div>
    `;

    // 기초번호 조회 닫기 버튼 맵핑
    document.getElementById("sprdIntrvlInfoPopCloseBtn").addEventListener('click', () => {
      // 초기화
      sprdIntrvlMouseClickElmt.innerHTML = '';
      sprdIntrvlMouseClick.setPosition(undefined);
    });
  }

  // 추후 db에서 좌표값 조회 예정
  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
      + "SERVICE=WFS"
      + "&APIKEY=" + MAP_APIKEY
      + "&VERSION=1.1.1"
      + "&REQUEST=GetFeature"
      + "&outputFormat=application/json"
      + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_sprd_intrvl"
      + "&cql_filter=" + "sig_cd='" + res.sigCd + "' and rds_man_no='" + res.rdsManNo + "' and bsi_int_sn='" +res.bsiIntSn +"'";

  axios.get(url)
  .then((res) => {
    if (res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const chkFt = format.readFeature(ftJson);
          if (chkFt.getGeometry() instanceof MultiLineString && chkFt.getGeometry().getLineStrings().length) {
            if(isClick) {
              sprdIntrvlMouseClick.setPosition(chkFt.getGeometry().getLineStrings()[0].getCoordinateAt(0.5));


              const oldFt = sprdManageLayer.getSource().getFeatureById('sprdIntrvlRedPin');
              if(oldFt) {
                sprdManageLayer.getSource().removeFeature(oldFt);
              }

              const ft = new Feature(new Point([...chkFt.getGeometry().getLineStrings()[0].getCoordinateAt(0.5)]));
              ft.setId('sprdIntrvlRedPin');
              ft.setStyle(
                mapStyles.fnGetBasicStyle(null, {
                  icon: '/src/assets/images/mapEditor/icon/ico-red-pin.svg',
                  scale : 1.5,
                  anchor : [0.5, 1.2]
                })
              )
              sprdManageLayer.getSource().addFeature(ft);

            }
            comMapEditor.value.getMap().getView().setCenter(chkFt.getGeometry().getLineStrings()[0].getCoordinateAt(0.5));
            comMapEditor.value.getMap().getView().setZoom(13);
          } else {
            if(isClick) {
              sprdIntrvlMouseClick.setPosition(chkFt.getGeometry().getCoordinateAt(0.5));
            }
            comMapEditor.value.getMap().getView().setCenter(chkFt.getGeometry().getCoordinateAt(0.5));
            comMapEditor.value.getMap().getView().setZoom(13);
          }
        });
      }
    }
  });

  // comMapEditor.value.getMap().getView().setCenter([x, y]);
  // comMapEditor.value.getMap().getView().setZoom(13);
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
    + "&CQL_FILTER=rds_dpn_se=0 and rn_cd='" + filter.rnCd + "' and sig_cd='" + filter.sigCd + "'";
    // + "&CQL_FILTER=rds_dpn_se=0 and rn_cd='" + filter.rnCd + "'";

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
        } else {
          comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
          comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
        }
      } else {
        comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
        comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
      }
    });
}

/**
 * 주소정보 조회 -> 명예도로 조회 클릭
 */
const fnSearchHonorRoadNameInfo = (filter = {}) => {

  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&version=1.1.1"
    + "&APIKEY=" + MAP_APIKEY
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_sprd_honor"
    + "&CQL_FILTER=sig_cd='" + filter.sigCd + "' and kor_hon_rn='" + filter.rdNm +"'";

  axios.get(url)
  .then((res) => {
    if (res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          honorRoadLayer.getSource().addFeature(ft);
          fnSearchHonorRoad(ft);
        });
        comMapEditor.value.getMap().getView().fit(honorRoadLayer.getSource().getExtent());
      } else {
        comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
        comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
      }
    } else {
      comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
    }
  });
}

/**
 * 명예도로 오버레이
 */
const fnSearchHonorRoad = (ft) => {

  honorRoadClickElmt.innerHTML = '';
  honorRoadClick.setPosition(undefined);

  if (ft) {
    honorRoadClickElmt.innerHTML = `
      <div class="integratedMap__basicLayerPopup" >
        <div class="integratedMap__basicLayerPopupHeader">
          <p class="integratedMap__basicLayerPopupTitle">명예도로 조회</p>
          <Button class="integratedMap__basicLayerPopupButton" id="honorRoadPopCloseBtn">
            <span class="blind">팝업닫기</span>
            <i aria-hidden="true" class="bi bi-x-lg"></i>
          </Button>
        </div>
        <div class="integratedMap__basicLayerPopupContent">
          ${ft.get('rn')}<br/>
          (${ft.get('eng_rn')})
        </div>
      </div>
    `;

    // 정보조회 닫기 버튼 맵핑
    document.getElementById("honorRoadPopCloseBtn").addEventListener('click', () => {
      // 초기화
      honorRoadClickElmt.innerHTML = '';
      honorRoadClick.setPosition(undefined);

      honorRoadLayer.getSource().clear();
    });

    let geometry = ft.getGeometry();

    // 멀티라인스트링인 경우
    if(geometry instanceof MultiLineString){
      ft.getGeometry().getLineStrings().forEach(geom => {
        geometry = geom;
      });
    }
    honorRoadClick.setPosition(geometry.getCoordinateAt(0.5));
  }
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
const fnSearchAot = async (type, params) => {

  const pointArr = [];
  let popPosition = null;
  const format = new GeoJSON();


  aotLayer.getSource().clear();
  fnInitAddrInfo();

  const aotGeomArr = await axios.post('/api/totalMap/selectKadtAotList', params.thngMgno ? params : {'thngMgno': params.objMngNo})
    .then((res) => {
      if (res.status === 200) {
        if (res.data?.results?.length) {
          return res.data.results;
        }
      }
    });

  let aotInfoArr = null;

  if(type === 'C') {
    aotInfoArr = await axios.post('/api/solr/solrGetAotInfo', { query: 'objMngNo:' + params.thngMgno })
    .then((res) => {
      if (res.status === 200) {
        if (res.data?.length) {
          return res.data[0];
        }
      }
    });
  } else {
    aotInfoArr = params;
  }

  if (aotInfoArr && aotGeomArr && aotGeomArr.length) {
    aotGeomArr.forEach((item) => {
      let ft = null;

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
      if(ft){
        aotLayer.getSource().addFeature(ft);
      }
    });

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
                    <dt id="bdInfo_rodaNmArea">${aotInfoArr.bdSnTxt}</dt>
                    <dd>${aotInfoArr.objNm}</dd>
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
      fnClickEngRdNmBtn({ schKorRoadNm: aotInfoArr.bdSnTxt, schEngRoadNm: aotInfoArr.bdEngSn });
    });
    // 정보조회 복사 버튼 맵핑
    document.getElementById("bdInfo_copyRdNm").addEventListener('click', () => {
      fnClickRoadAddrCopyBtn({ schKorRoadNm: aotInfoArr.bdSnTxt, schEngRoadNm: aotInfoArr.bdEngSn });
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

    comMapEditor.value.getMap().getView().setCenter(popPosition);
    comMapEditor.value.getMap().getView().setZoom(12);
    // comMapEditor.value.getMap().getView().fit(aotLayer.getSource().getExtent());
  } else {
    comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
    comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
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
        } else {
          comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
          comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
        }
      } else {
        comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
        comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
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
            const ssn = ft.get('SSN');
            kargSsnpMouseClickElmt.innerHTML = `
            <div class="integratedMap__basicLayerPopup" >
              <div class="integratedMap__basicLayerPopupHeader">
                <p class="integratedMap__basicLayerPopupTitle">${ssn.substring(0, 2) + " " + ssn.substring(2, 6) + " " + ssn.substring(6, 10)}</p>
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
        } else {
          comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
          comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
        }
      } else {
        comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
        comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
      }
    });
}

/**
 * 기초번호 검색
 */
const fnSearchBasicNum = async (params = {}) => {

  activeLayerPopup.value = 1;
  active.value = 3;

  const param = {
    sigCd : params.sigCd
    , rnCd : params.rnCd
    , bdMaSn : params.bdMaSn
    , bdSlno : params.bdSlno
    , pageable: {
      page: 0,
      size: pageSize.value,
    }
  }

  let url = '/api/totalMap/selectSprdIntrvlList';
  isDetailSearchTab03LoadingBar.value = true;
  axios.post(url, param)
  .then(async (response) => {
    const data = response.data;
    if (data.results?.content?.length > 0) {
      // 기초번호 초기화
      sprdManageLayer.getSource().clear();
      sprdIntrvlLayer.getSource().clear();
      sprdIntrvlMouseClickElmt.innerHTML = '';
      sprdIntrvlMouseClick.setPosition(undefined);

      // 지도에 도로구간 생성
      const cql_filter = "rn_cd='" + params.rnCd + "' and sig_cd='" + params.sigCd + "'";
      // const cql_filter = "rn_cd='" + detailSearch.tab03_params_road_name.value + "' and sig_cd='" + detailSearch.tab03_params_sgg_val.value + "'";
      const resVal = await fnSearchSprdRoad(cql_filter);
      if (resVal && resVal.length) {
        resVal.forEach(road => {
          const format = new GeoJSON();
          const sprdFt = format.readFeature(road);
          // sprdManageLayer.getSource().addFeature(sprdFt);
        });
      }
      detailSearch.tab03_search_result = data.results.content;
      detailSearch.tab03_pageInfo.totalRecords = data.results.totalElements;
      detailSearch.tab03_pageInfo.currentRecords = data.results.numberOfElements;
      detailSearch.tab03_pageInfo.totalPages = data.results.totalPages;
      detailSearch.tab03_result_count = data.results.totalElements;

      // 첫번째 결과값 위치로 이동
      fnClickSearchIntrvl(data.results.content[0]);

    } else {
      detailSearch.tab03_search_result = data.results.content;
      detailSearch.tab03_pageInfo.totalRecords = 0;
      detailSearch.tab03_pageInfo.currentRecords = 0;
      detailSearch.tab03_pageInfo.totalPages = 0;
      detailSearch.tab03_result_count = 0;
    }
  })
  .finally(async () => {
    //메세지 숨김

    // 시도 세팅
    detailSearch.tab03_params_sido_data.forEach(item => {
      if(item.value === params.sigCd.slice(0, 2) + '0001'){
        detailSearch.tab03_params_sido_val = item;
      }
    });

    // 시군군 세팅
    await fnSearchSggData("detailSearchTab03Sgg", detailSearch.tab03_params_sido_val);
    detailSearch.tab03_params_sgg_data.forEach(item => {
      if(item.value === params.sigCd){
        detailSearch.tab03_params_sgg_val = item;
      }
    });

    // 도로명 초성 세팅
    roadItemsList.value.forEach(item => {
      if(item.value === params.rdNmIdx.split('_')[0]){
        detailSearch.tab03_params_start_char = item;
      }
    });

    // 도로명 세팅
    await fnSearchRoadNameData("detailSearchTab03RoadName02", detailSearch.tab03_params_sgg_val)
    detailSearch.tab03_params_road_data.forEach(item => {
      if(item.value === params.rnCd){
        detailSearch.tab03_params_road_name = item;
      }
    });

    // 건물번호 본/부번
    detailSearch.tab03_params_bnmn = params.bdMaSn;
    detailSearch.tab03_params_bnsn = params.bdSlno;

    isDetailSearchTab03LoadingBar.value = false;
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
 * 주소정보 팝업 -> 도로정보 조회
 */
const fnSearchRoadInfo = async (params = {}) => {
  const rdMgtSn = params.rdMgtSn;

  await axios.get('/api/ahs/selectRoadLocation/' + rdMgtSn)
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
  if(params.adrMngNo){
    await axios.get('/api/search/history-list/' + params.adrMngNo)
    .then((response) => {
      searchInfoPopupResult.historyInfoData = response.data.results;
      // console.log("############# result ->> ", response);
      // sales.value = data;
    });
  }
}

/**
 * 주소정보 팝업 -> 도로구간 조회
 */
const fnShowRoadInfo = async (params = {}) => {
  if(params.rdMgtSn){
    sprdManageLayer.getSource().clear();
    sprdIntrvlLayer.getSource().clear();
    fnSearchRoadNameInfo({rnCd:params.rdMgtSn.slice(5), sigCd:params.rdMgtSn.slice(0, 5)});
  }
}

/**
 * 주소정보 팝업 -> 도로구간 조회
 */
const fnShowSprdIntrvl = async (params = {}) => {
  if(params.rdMgtSn){
    sprdManageLayer.getSource().clear();
    sprdIntrvlLayer.getSource().clear();
    const cql_filter = "rn_cd='" + params.rdMgtSn.slice(5) + "' and sig_cd='" + params.rdMgtSn.slice(0, 5) + "'";
    fnSearchSprdRoad(cql_filter);
  }
}

/**
 * 주소정보 조회 추가
 */
const fnAddAddrInfo = async (isBdInfo, position, params = {}) => {
  // 도로정보 조회
  await fnSearchRoadInfo(params);
  // 변동이력 조회
  await fnSearchHistoryInfo(params);

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
  `;

  searchInfo += `
        <ul class="informationInquiry__tab">
  `;

  if(isBdInfo) {
    searchInfo += `

          <li class="active">
            <button type="button" id="searchInfoPopBuldInfoBtn" class="informationInquiry__tabButton" role="tab"
                aria-selected="true" aria-controls="tab1__content" title="건물정보 보기">
              건물정보
            </button>
          </li>
    `;
  }

  searchInfo += `
          <li class="${isBdInfo? '' : 'active'}">
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
  `;

  if(isBdInfo) {
    searchInfo += `
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
                  ${params.siNm} ${params.sggNm} ${params.juminCenter_01}
                  <span class="informationInquiry__phone"><i aria-hidden="true" class="bi bi-telephone-fill"></i> ${params.juminCenterNumber_01}</span>
                </li>
                <li style="display:${params.juminCenter_02 ? 'block' : 'none'}">
                  ${params.siNm} ${params.sggNm} ${params.juminCenter_02}
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
                <button type="button" id="bdInfo_detailAddressView" class="informationInquiry__detailAdressButton" title="상세주소(동·층·호) 보기" style="display:${params.adrDcCount != '0' && params.secAdrYn == null ? 'inline-flex' : 'none'}">
                  <span>상세주소(동·층·호) 보기</span> <i aria-hidden="true" class="bi bi-chevron-down"></i>
                </button>
              </span>
            </div>
          </div>
          <div id="bdInfo_detailAddressSelectArea" class="informationInquiry__detailAdress" style="display:none">
            <ul class="informationInquiry__eastWestFloor">
              <li>
                <label for="bdInfo_detailAddressDong" class="blind">동 선택</label>
                <select  class="informationInquiry__eastWestFloorSelect" id="bdInfo_detailAddressDong" title="동 선택하기">
                  <option value="">동을 선택하세요.</option>
                </select>
              </li>
              <li>
                <label for="bdInfo_detailAddressFloor" class="blind">층 선택</label>
                <select  class="informationInquiry__eastWestFloorSelect" id="bdInfo_detailAddressFloor" title="층 선택하기">
                  <option value="">층을 선택하세요.</option>
                </select>
              </li>
              <li>
                <label for="bdInfo_detailAddressLine" class="blind">호 선택</label>
                <select  class="informationInquiry__eastWestFloorSelect" id="bdInfo_detailAddressLine" title="호 선택하기">
                  <option value="">호를 선택하세요.</option>
                </select>
              </li>
            </ul>
            <div id="bdInfo_detailAddressViewArea" class="informationInquiry__innerBox"  style="display:none">
              <span class="informationInquiry__innerBoxText"></span>
              <button type="button" id="bdInfo_copyDetailAddr" class="informationInquiry__copyButton" title="주소복사하기">복사</button>
            </div>
            <p id="bdInfo_detailAddressTipArea" class="informationInquiry__eastWestFloorTip" style="display:none">
              <span class="commonBullet">※</span> 위 주소는 '호'에 '층'정보가 포함되어 있어 층을 생략하고 표기할 수 있습니다.
            </p>
          </div>
        </div>
    `;
  }

  searchInfo += `
        <div id="tab2__content" role="tabpanel" class="informationInquiry__content ${isBdInfo ? '' : 'active'}">
          <div class="informationInquiry__inquiryAdressWrap">
            <div class="informationInquiry__inquiryAdress road">
              <p class="informationInquiry__inquiryAdressText">${searchInfoPopupResult.roadInfoData?.rdNm ?? '-'}</p>
              <div class="informationInquiry__inquiryAdressFunction">
                <button type="button" id="searchRoadLineViewBtn" class="informationInquiry__inquiryAdressButton" title="도로 구간 보기">
                  도로 구간 보기
                </button>
                <button type="button" id="searchIntrvlNoViewBtn" class="informationInquiry__inquiryAdressButton" title="기초 번호 보기">
                  기초 번호 보기
                </button>
              </div>
            </div>
          </div>
          <div class="informationInquiry__listDetail">
            <p class="informationInquiry__listDetailTitle">기점</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.srtCn ?? '-'}
            </div>
            <p class="informationInquiry__listDetailTitle">종점</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.endCn ?? '-'}
            </div>
            <p class="informationInquiry__listDetailTitle">길이(m)</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.roadLt ?? '-'}
            </div>
            <p class="informationInquiry__listDetailTitle">고시일</p>
            <div class="informationInquiry__listDetailContent">
              ${dateUtils.getDateSlice(searchInfoPopupResult.roadInfoData?.noticeYmd, '-') ?? '-'}
            </div>
            <p class="informationInquiry__listDetailTitle">효력발생일</p>
            <div class="informationInquiry__listDetailContent">
              ${dateUtils.getDateSlice(searchInfoPopupResult.roadInfoData?.effectDe, '-') ?? '-'}
            </div>
            <p class="informationInquiry__listDetailTitle">도로명 부여사유</p>
            <div class="informationInquiry__listDetailContent">
              ${searchInfoPopupResult.roadInfoData?.grantDe ?? '-'}
            </div>
          </div>
        </div>
  `;

  searchInfo += `
        <div id="tab3__content" role="tabpanel" class="informationInquiry__content">
          <div class="informationInquiry__inquiryAdressWrap">
            <div class="informationInquiry__inquiryAdress road">
              <p class="informationInquiry__inquiryAdressText">${params.schKorRoadNm}</p>
            </div>
          </div>
          <div class="informationInquiry__doorway">
            <div class="commonTable__wrap type01">
              <table class="commonTable__vertical">
                <thead>
                  <th>변동일자</th>
                  <th>주소</th>
                  <th>고시여부</th>
                  <th>변동구분</th>
                  <th>변동사유</th>
                </thead>
                <tbody>
  `;

  if (searchInfoPopupResult.historyInfoData) {
    searchInfoPopupResult.historyInfoData.forEach(item => {
      searchInfo += `
                  <tr>
                    <td>${item.chgDt}</td>
                    <td class="align-left">[도로명주소] ${ item.rnAddr }<br>[지번] ${ item.jibun }</td>
                    <td>${ item.chgResNm == "폐지" ? "-" : (item.ntfcYn == "1" ? "고시" : "미고시" ) }</td>
                    <td>${item.chgResNm}</td>
                    <td>${item.chgResNmDtl ? item.chgResNmDtl : "-" }</td>
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

  if(isBdInfo) {
    // 정보조회 국문/영문 버튼 맵핑
    document.getElementById("bdInfo_engBtn").addEventListener('click', () => {
      fnClickEngRdNmBtn(params);
    });
    // 정보조회 복사 버튼 맵핑
    document.getElementById("bdInfo_copyRdNm").addEventListener('click', () => {
      fnClickRoadAddrCopyBtn(params);
    });
     // 상세주소보기 버튼 맵핑
    document.getElementById("bdInfo_detailAddressView").addEventListener('click', () => {
      if (document.getElementById('bdInfo_detailAddressSelectArea').style.display === 'block') {
        document.getElementById('bdInfo_detailAddressSelectArea').style.display = 'none';
        document.getElementById("bdInfo_detailAddressFloor").innerHTML = `<option value="">층을 선택하세요.</option>`;
        document.getElementById("bdInfo_detailAddressLine").innerHTML = `<option value="">호를 선택하세요.</option>`;
        fnHideDetailAddress();
      } else {
        document.getElementById('bdInfo_detailAddressSelectArea').style.display = 'block';
      }
      fnSelectDongList(params);
    });
    // 동 select box change 맵핑
    document.getElementById("bdInfo_detailAddressDong").addEventListener('change', () => {
      if (_.isEmpty(document.getElementById("bdInfo_detailAddressDong").value)) {
        document.getElementById("bdInfo_detailAddressFloor").innerHTML = `<option value="">층을 선택하세요.</option>`;
        document.getElementById("bdInfo_detailAddressLine").innerHTML = `<option value="">호를 선택하세요.</option>`;
        fnHideDetailAddress();
      } else {
        fnSelectFloorList(document.getElementById("bdInfo_detailAddressDong").value);
      }
    });
    // 층 select box change 맵핑
    document.getElementById("bdInfo_detailAddressFloor").addEventListener('change', () => {
      if (_.isEmpty(document.getElementById("bdInfo_detailAddressFloor").value)) {
        document.getElementById("bdInfo_detailAddressLine").innerHTML = `<option value="">호를 선택하세요.</option>`;
        fnHideDetailAddress();
      } else {
        fnSelectLineList(document.getElementById("bdInfo_detailAddressDong").value, document.getElementById("bdInfo_detailAddressFloor").value);
      }
    });
    // 호 select box change 맵핑
    document.getElementById("bdInfo_detailAddressLine").addEventListener('change', () => {
      if (_.isEmpty(document.getElementById("bdInfo_detailAddressLine").value)) {

        fnHideDetailAddress();
      } else {
        fnShowDetailAddress(params);
      }
    });
    // 정보조회 복사 버튼 맵핑
    document.getElementById("bdInfo_copyDetailAddr").addEventListener('click', () => {
      fnClickDetailAddrCopyBtn();
    });
  }

  // 도로정보 탭 도로구간 보기 버튼 맵핑
  document.getElementById("searchRoadLineViewBtn").addEventListener('click', () => {
    fnShowRoadInfo(params);
  });
  // 도로정보 탭 기초번호 보기 버튼 맵핑
  document.getElementById("searchIntrvlNoViewBtn").addEventListener('click', () => {
    fnShowSprdIntrvl(params);
  });

  if(isBdInfo) {
    // 정보조회 건물정보 탭
    document.getElementById("searchInfoPopBuldInfoBtn").addEventListener('click', () => {
      document.getElementById("tab1__content").style.display = 'block';
      document.getElementById("tab2__content").style.display = 'none';
      document.getElementById("tab3__content").style.display = 'none';
      document.getElementById("searchInfoPopBuldInfoBtn").parentElement.classList.add('active');
      document.getElementById("searchInfoPopRoadInfoBtn").parentElement.classList.remove('active');
      document.getElementById("searchInfoPopHistoryInfoBtn").parentElement.classList.remove('active');
    });
  }
  // 정보조회 건물정보 탭
  document.getElementById("searchInfoPopRoadInfoBtn").addEventListener('click', () => {
    if(isBdInfo) {
      document.getElementById("tab1__content").style.display = 'none';
    }
    document.getElementById("tab2__content").style.display = 'block';
    document.getElementById("tab3__content").style.display = 'none';
    if(isBdInfo) {
      document.getElementById("searchInfoPopBuldInfoBtn").parentElement.classList.remove('active');
    }
    document.getElementById("searchInfoPopRoadInfoBtn").parentElement.classList.add('active');
    document.getElementById("searchInfoPopHistoryInfoBtn").parentElement.classList.remove('active');
  });
  // 정보조회 건물정보 탭
  document.getElementById("searchInfoPopHistoryInfoBtn").addEventListener('click', () => {
    if(isBdInfo) {
      document.getElementById("tab1__content").style.display = 'none';
    }
    document.getElementById("tab2__content").style.display = 'none';
    document.getElementById("tab3__content").style.display = 'block';
    if(isBdInfo) {
      document.getElementById("searchInfoPopBuldInfoBtn").parentElement.classList.remove('active');
    }
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


//상세주소 조회 - 동조회
const fnSelectDongList = (item) => {
  const params = {
    schMode : "D"
    , sigCd : item.emdCd
    , roadNmCd : item.rdMgtSn?.slice(5)
    , bnmn : item.bdMaSn
    , bnsn : item.bdSbSn
    , udgdSeCd : item.udrtYn
  }

  axios.post('/api/search/selectJusoDetail', params)
  .then((response) => {
    const data = response.data.results;
    if (data.length > 0) {

      const selectDong = document.getElementById('bdInfo_detailAddressDong');
      selectDong.innerHTML = `<option value="">동을 선택하세요.</option>`;
      for(let i = 0; i < data.length; i++) {
        const newOption = document.createElement('option');
        newOption.value = data[i].BDDG_MGNO;
        newOption.text = data[i].BDDG_NM == "0" ? '"동" 표기 없음' : data[i].BDDG_NM + "동";
        selectDong.appendChild(newOption);
      }
    }
  })
  .catch(error => {
    console.error("error =>", error);
  })
  .finally(() => {
  });
}

//상세주소 조회 - 층조회
const fnSelectFloorList = (bddgMgno) => {

  if(bddgMgno) {
    const params = {
      schMode : "F"
      , bddgMgno : bddgMgno
    }

    axios.post('/api/search/selectJusoDetail', params)
    .then((response) => {
      const data = response.data.results;
      if (data.length > 0) {
        const selectFloor = document.getElementById('bdInfo_detailAddressFloor');
        selectFloor.innerHTML = `<option value="">층을 선택하세요.</option>`;
        for(let i = 0; i < data.length; i++) {
          const newOption = document.createElement('option');
          newOption.value = data[i].BDFL_MGNO;
          newOption.text = data[i].UDGD_SE_CD == "0" ? data[i].BDFL_NM + "층" : "지하 " + data[i].BDFL_NM + "층";
          selectFloor.appendChild(newOption);
        }
      }
    })
    .catch(error => {
      console.error("error =>", error);
    });
  }
}

//상세주소 조회 - 호조회
const fnSelectLineList = (bddgMgno, bdflMgno) => {

  if(bddgMgno && bdflMgno) {
    const params = {
      schMode : "H"
      , bddgMgno : bddgMgno
      , bdflMgno : bdflMgno
    }

    axios.post('/api/search/selectJusoDetail', params)
    .then((response) => {
      const data = response.data.results;
      if (data.length > 0) {
        const selectLine = document.getElementById('bdInfo_detailAddressLine');
        selectLine.innerHTML = `<option value="">호를 선택하세요.</option>`;
        for(let i = 0; i < data.length; i++) {
          const newOption = document.createElement('option');
          newOption.value = data[i].BDHO_NM;
          newOption.text = data[i].BDHO_NM ? data[i].BDHO_NM + "호" : '"호" 표기 없음';
          selectLine.appendChild(newOption);
        }
      }
    })
    .catch(error => {
      console.error("error =>", error);
    });
  }
}

//상세주소 조회 - 상세주소 보여주기
const fnShowDetailAddress = (params) => {
  let detailAddr = ', ';

  document.getElementById('bdInfo_detailAddressViewArea').style.display = 'block';
  document.getElementById('bdInfo_detailAddressTipArea').style.display = 'block';

  const dong = document.getElementById("bdInfo_detailAddressDong");
  const floor = document.getElementById("bdInfo_detailAddressFloor");
  const line = document.getElementById("bdInfo_detailAddressLine");
  const dongTxt = dong.options[dong.selectedIndex].text
  const floorTxt = floor.options[floor.selectedIndex].text
  const lineTxt = line.options[line.selectedIndex].text

  if(!(dongTxt.replace(/ /g, '').indexOf('표기없음') > -1)) {
    detailAddr += dongTxt + ' ';
  }
  if(!(floorTxt.replace(/ /g, '').indexOf('표기없음') > -1)) {
    detailAddr += floorTxt + ' ';
  }
  if(!(lineTxt.replace(/ /g, '').indexOf('표기없음') > -1)) {
    detailAddr += lineTxt + ' ';
  }

  if(params.schKorRoadNm.indexOf('(') > -1) {
    detailAddr = params.schKorRoadNm.slice(0, params.schKorRoadNm.indexOf('(')-1) + detailAddr + params.schKorRoadNm.slice(params.schKorRoadNm.indexOf('('))
  } else {
    detailAddr = params.schKorRoadNm + detailAddr;
  }
  document.getElementById('bdInfo_detailAddressTipArea .informationInquiry__innerBoxText').innerHTML = detailAddr;
}

//상세주소 조회 - 상세주소 숨기기
const fnHideDetailAddress = () => {
  document.getElementById('bdInfo_detailAddressViewArea').style.display = 'none';
  document.getElementById('bdInfo_detailAddressTipArea').style.display = 'none';
  // document.getElementById('bdInfo_detailAddressTipArea .informationInquiry__innerBoxText').innerHTML = '';
}

/**
 * 정보조회 상세주소 복사 버튼 클릭
 */
const fnClickDetailAddrCopyBtn = () => {
  let detailAddr = document.getElementById('bdInfo_detailAddressTipArea .informationInquiry__innerBoxText').innerHTML;

  const copyTxt = document.createElement("input");
  document.body.appendChild(copyTxt);
  copyTxt.value = detailAddr;
  copyTxt.select();

  if (document.execCommand("copy")) {
    alert("도로명주소가 클립보드로 복사 되었습니다.\n" + detailAddr);
    document.body.removeChild(copyTxt);
  } else {
    alert("복사기능을 사용할 수 없는 브라우저입니다.");
    document.body.removeChild(copyTxt);
  }
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
    } else {
      comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
    }
  } else {
    comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
    comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
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
    } else {
      comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
    }
  } else {
    comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
    comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
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
        <button class="integratedMap__headerHelp" title="처음이신가요 열기" @click="guideOnShowDialog">
          <i aria-hidden="true" class="bi bi-question-lg" />
          <span class="integratedMap__headerHelpText">처음이신가요?</span>
        </button>
      </div>
    </div>
    <div class="integratedMap__menu">
      <Button class="integratedMap__menuButton detail" id="menu" @click="toogleLayerPopup(1)"
              :class="{ 'active': activeLayerPopup === 1 }" title="상세검색 열기">상세검색</Button>
      <Button class="integratedMap__menuButton baseArea" @click="toogleLayerPopup(2)"
              :class="{ 'active': activeLayerPopup === 2 }" title="기초구역 열기">기초구역검색</Button>
      <Button class="integratedMap__menuButton addressInterest" @click="toogleLayerPopup(3)"
              :class="{'active': activeLayerPopup === 3}" title="관심주소 열기">관심주소</Button>
      <Button class="integratedMap__menuButton country" @click="toogleLayerPopup(4)"
              :class="{ 'active': activeLayerPopup === 4 }" title="국가지점번호판검색">국가지점번호판검색</Button>
      <Button class="integratedMap__menuButton basic" @click="toogleLayerPopup(5)"
              :class="{ 'active': activeLayerPopup === 5 }" title="기초번호판검색">기초번호판검색</Button>
    </div>
    <div class="integratedMap__content"
         :class="{ 'layerPopupPosition': activeLayerPopup === 1 || activeLayerPopup === 2  || activeLayerPopup === 3  || activeLayerPopup === 4 || activeLayerPopup === 5 }">

      <MapEditor ref="comMapEditor" :zoom-slider="true" @mapLoaded="fnMapLoaded" lang="ko" :apikey="MAP_APIKEY" />
      <div class="integratedMap__detailSearch" :class="{ 'active': activeLayerPopup === 1 }">
        <div class="integratedMap__layoutPopupHeader">
          <p class="integratedMap__layoutPopupHeaderTitle">상세검색</p>
          <div class="integratedMap__layoutPopupHeaderClose">
            <Button class="integratedMap__layoutPopupHeaderButton" @click="closeLayerPopup" title="상세검색 닫기">
              <i aria-hidden="true" class="bi bi-x" />
              <span class="blind">닫기</span>
            </Button>
          </div>
        </div>
        <div class="integratedMap__detailSearchTab">
<!--          <div class="integratedMap__detailSearchTabFunction">-->
<!--            <Button class="integratedMap__detailSearchTabButton">지도</Button>-->
<!--          </div>-->
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
                                title="시/도선택" placeholder="선택" scroll-height="30rem"
                                @change='fnSearchSggData("detailSearchTab00Sgg", detailSearch.tab00_params_sido_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="roadCounty1">시/군/구</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="roadCounty1"
                                :options="detailSearch.tab00_params_sgg_data" v-model="detailSearch.tab00_params_sgg_val"
                                title="시/군/구선택" placeholder="선택" scroll-height="30rem"
                                @change='fnSearchRoadNameData("detailSearchTab00RoadName01", detailSearch.tab00_params_sgg_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="roadName01">도로명</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown initial" inputId="roadName01" :options="roadItemsList"
                                v-model="detailSearch.tab00_params_start_char" title="초성 선택" placeholder="ㄱ" scroll-height="30rem"
                                @change='fnSearchRoadNameData("detailSearchTab00RoadName02", detailSearch.tab00_params_sgg_val)' />
                <CustomDropdown class="integratedMap__dropdown" inputId="roadName02" scroll-height="30rem"
                                :options="detailSearch.tab00_params_road_data" v-model="detailSearch.tab00_params_road_name"
                                title="도로명선택" placeholder="선택" />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="building01">건물번호</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomInputText id="building01" v-model="detailSearch.tab00_params_bnmn" :type="'number'" :maxLength="6"
                                 class="input formStyle01 integratedMap__inputText form02" placeholder="" title="본번 입력해주세요."
                                 @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("00") }' />
                <span class="dash">-</span>
                <CustomInputText id="building02" v-model="detailSearch.tab00_params_bnsn" :type="'number'" :maxLength="6"
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
                                title="시/도선택" placeholder="선택" scroll-height="30rem"
                                @change='fnSearchSggData("detailSearchTab01Sgg", detailSearch.tab01_params_sido_val)' />
              </div>

              <p class="integratedMap__detailSearchFilterTitle"><label for="bungeeCounty1">시/군/구</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="bungeeCounty1"
                                :options="detailSearch.tab01_params_sgg_data" v-model="detailSearch.tab01_params_sgg_val"
                                title="시/군/구선택" placeholder="선택" scroll-height="30rem"
                                @change='fnSearchEmdData("detailSearchTab01Emd", detailSearch.tab01_params_sgg_val)' />
              </div>

              <p class="integratedMap__detailSearchFilterTitle"><label for="bungeeTown1">읍/면/동</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="bungeeTown1"
                                :options="detailSearch.tab01_params_emd_data" v-model="detailSearch.tab01_params_emd_val"
                                title="읍/면/동선택" placeholder="선택" scroll-height="30rem"
                                @change='fnSearchStliData("detailSearchTab01Tli", detailSearch.tab01_params_sgg_val, detailSearch.tab01_params_emd_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="ri1">리</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="ri1" scroll-height="30rem"
                                :options="detailSearch.tab01_params_stli_data" v-model="detailSearch.tab01_params_stli_val" title="리선택"
                                placeholder="선택" />
              </div>

              <p class="integratedMap__detailSearchFilterTitle"><label for="bungee01">번지</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <Checkbox v-model="detailSearch.tab01_params_mtn_se_cd" inputId="bungee01" name="bungee01" title="산 선택하기"
                          :binary="true" />
                <label for="bungee01">산</label>
                <CustomInputText id="bungee02" v-model="detailSearch.tab01_params_mno" :type="'number'" :maxLength="6" style="padding:5px;"
                                 class="input formStyle01 integratedMap__inputText form02" placeholder="" title="본번 입력해주세요."
                                 @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearch("01") }' />
                <span class="dash">-</span>
                <CustomInputText id="bungee03" v-model="detailSearch.tab01_params_sno" :type="'number'" :maxLength="6" style="padding:5px;"
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
                                title="시/도선택" placeholder="선택" scroll-height="30rem"
                                @change='fnSearchSggData("detailSearchTab02Sgg", detailSearch.tab02_params_sido_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCounty1">시/군/구</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="buildingCounty1"
                                :options="detailSearch.tab02_params_sgg_data" v-model="detailSearch.tab02_params_sgg_val"
                                title="시/군/구선택" placeholder="선택" scroll-height="30rem"
                                @change='fnSearchEmdData("detailSearchTab02Emd", detailSearch.tab02_params_sgg_val)' />
              </div>

              <p class="integratedMap__detailSearchFilterTitle"><label for="buildingTown1">읍/면/동</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="buildingTown1" scroll-height="30rem"
                                :options="detailSearch.tab02_params_emd_data" v-model="detailSearch.tab02_params_emd_val"
                                title="읍/면/동선택" placeholder="선택" />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="buildingName">건물명</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomInputText id="buildingName" v-model="detailSearch.tab02_params_buld_nm" scroll-height="30rem"
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
                                title="시/도선택" placeholder="선택" scroll-height="30rem"
                                @change='fnSearchSggData("detailSearchTab03Sgg", detailSearch.tab03_params_sido_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="basicCounty1">시/군/구</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown" inputId="basicCounty1"
                                :options="detailSearch.tab03_params_sgg_data" v-model="detailSearch.tab03_params_sgg_val"
                                title="시/군/구선택" placeholder="선택" scroll-height="30rem"
                                @change='fnSearchRoadNameData("detailSearchTab03RoadName01", detailSearch.tab03_params_sgg_val)' />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="basicName01">도로명</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomDropdown class="integratedMap__dropdown initial" inputId="basicName01" :options="roadItemsList"
                                v-model="detailSearch.tab03_params_start_char" title="초성 선택" placeholder="ㄱ" scroll-height="30rem"
                                @change='fnSearchRoadNameData("detailSearchTab03RoadName02", detailSearch.tab03_params_sgg_val)' />
                <CustomDropdown class="integratedMap__dropdown" inputId="basicName02" scroll-height="30rem"
                                :options="detailSearch.tab03_params_road_data" v-model="detailSearch.tab03_params_road_name"
                                title="도로명선택" placeholder="선택" @change="fnChangeRoadName" />
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
                <CustomInputText id="basicNumber01" v-model="detailSearch.tab03_params_bnmn"  :type="'number'" :maxLength="6"
                                 class="input formStyle01 integratedMap__inputText form02" placeholder="" title="본번 입력해주세요."
                                 @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearchSprdIntrvl() }' />
                <span class="dash">-</span>
                <CustomInputText id="basicNumber02" v-model="detailSearch.tab03_params_bnsn"  :type="'number'" :maxLength="6"
                                 class="input formStyle01 integratedMap__inputText form02" placeholder="" title="부번 입력해주세요."
                                 @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearchSprdIntrvl() }' />
                <span class="text">번</span>
              </div>
            </div>
            <Button class="integratedMap__detailSearchFilterButton" @click.prevent='fnDetailSearchSprdIntrvl()'
                    @keydown='(evt) => { if (evt.keyCode === 13) fnDetailSearchSprdIntrvl() }'>검색</Button>
          </div>
          <div v-show="active === 4">
            <div class="integratedMap__detailSearchFilter">
              <p class="integratedMap__detailSearchFilterTitle"><label for="xPosition">X좌표</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomInputText id="xPosition" v-model="xyPosition.xPosition"
                                 @input="(evt) => {fnHandlerInputPos('xPosition') }"
                                 @keydown='(evt) => { if (evt.keyCode === 13) fnSearchCoordinate() }'
                                 class="input formStyle01 integratedMap__inputText" placeholder="" title="X좌표 입력해주세요." />
              </div>
              <p class="integratedMap__detailSearchFilterTitle"><label for="yPosition">Y좌표</label></p>
              <div class="integratedMap__detailSearchFilterForm">
                <CustomInputText id="yPosition" v-model="xyPosition.yPosition"
                                 @input="(evt) => {fnHandlerInputPos('yPosition') }"
                                 @keydown='(evt) => { if (evt.keyCode === 13) fnSearchCoordinate() }'
                                 class="input formStyle01 integratedMap__inputText" placeholder="" title="Y좌표 입력해주세요." />
              </div>
            </div>
            <Button class="integratedMap__detailSearchFilterButton" @click.prevent='fnSearchCoordinate()'
                    @keydown='(evt) => { if (evt.keyCode === 13) fnSearchCoordinate() }'>검색</Button>
          </div>
        </div>




        <template v-if="active === 0">
          <div class="integratedMap__detailSearchResultWrap" >
            <LoadingComponent :isArea="isDetailSearchTab00LoadingBar" style="position:relative;" />
            <div class="integratedMap__detailSearchResultWrapInner resultBox basResultBox">
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
                      <strong class="integratedMap__roadAddress">{{ res.schKorRoadNm }}</strong>
                      <span class="integratedMap__oldAddress"><i aria-hidden="true"
                                                                 class="bi bi-geo-alt" />{{ res.schKorJibunNm }}</span>
                    </Button>
                  </li>
                </ul>
              </Scrollpanel>
            </div>
          </div>
          <div class="integratedMap__detailSearchResultPaging" v-if="detailSearch.tab00_search_result.length > 0">
            <!--            <CustomPaginator class="integratedMap__paging" :rows="10" :totalRecords="100" :pageLinkSize="5"/>-->
            <TemplatePaginator class="integratedMap__paging" :pageInfo="detailSearch.tab00_pageInfo"
                               @reload-list="(pageInfo) => fnDetailSearch('00', pageInfo)" />
          </div>
        </template>
        <template v-if="active === 1">
          <div class="integratedMap__detailSearchResultWrap" >
            <LoadingComponent :isArea="isDetailSearchTab01LoadingBar" style="position:relative;" />
            <div class="integratedMap__detailSearchResultWrapInner resultBox basResultBox">
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
                      <strong class="integratedMap__roadAddress">{{ res.schKorRoadNm }}</strong>
                      <span class="integratedMap__oldAddress"><i aria-hidden="true"
                                                                 class="bi bi-geo-alt" />{{ res.schKorJibunNm }}</span>
                    </Button>
                  </li>
                </ul>
              </Scrollpanel>
            </div>
          </div>
          <div class="integratedMap__detailSearchResultPaging" v-if="detailSearch.tab01_search_result.length > 0">
            <!--            <CustomPaginator class="integratedMap__paging" :rows="10" :totalRecords="100" :pageLinkSize="5"/>-->
            <TemplatePaginator class="integratedMap__paging" :pageInfo="detailSearch.tab01_pageInfo"
                               @reload-list="(pageInfo) => fnDetailSearch('01', pageInfo)" />
          </div>
        </template>
        <template v-if="active === 2">
          <div class="integratedMap__detailSearchResultWrap" >
            <LoadingComponent :isArea="isDetailSearchTab02LoadingBar" style="position:relative;" />
            <div class="integratedMap__detailSearchResultWrapInner resultBox basResultBox">
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
                      <strong class="integratedMap__roadAddress">{{ res.schKorRoadNm }}</strong>
                      <span class="integratedMap__oldAddress"><i aria-hidden="true"
                                                                 class="bi bi-geo-alt" />{{ res.schKorJibunNm }}</span>
                    </Button>
                  </li>
                </ul>
              </Scrollpanel>
            </div>
          </div>
          <div class="integratedMap__detailSearchResultPaging" v-if="detailSearch.tab02_search_result.length > 0">
            <!--            <CustomPaginator class="integratedMap__paging" :rows="10" :totalRecords="100" :pageLinkSize="5"/>-->
            <TemplatePaginator class="integratedMap__paging" :pageInfo="detailSearch.tab02_pageInfo"
                               @reload-list="(pageInfo) => fnDetailSearch('02', pageInfo)" />
          </div>
        </template>
        <template v-if="active === 3">
          <div class="integratedMap__detailSearchResultWrap" >
            <LoadingComponent :isArea="isDetailSearchTab03LoadingBar" style="position:relative;" />
            <div class="integratedMap__detailSearchResultWrapInner resultBox basResultBox">
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
                <ul class="integratedMap__resultListBaseArea">
                  <li v-for="(res, idx) in detailSearch.tab03_search_result" :key="idx" @click.prevent="fnClickSearchIntrvl(res, true)" style="cursor:pointer;">
                    <div class="integratedMap__resultListBaseAreaNumber" >{{ res.rid }}</div>
                    <p class="integratedMap__resultListBaseAreaText">{{ res.sggNm }} {{ res.roadNm }} {{ res.bsiSl != '0' ? res.bsiMn + '-' + res.bsiSl : res.bsiMn }}</p>
                  </li>
                </ul>
              </Scrollpanel>
            </div>
          </div>
          <div class="integratedMap__detailSearchResultPaging" v-if="detailSearch.tab03_search_result.length > 0">
            <!--            <CustomPaginator class="integratedMap__paging" :rows="10" :totalRecords="100" :pageLinkSize="5"/>-->
            <TemplatePaginator class="integratedMap__paging" :pageInfo="detailSearch.tab03_pageInfo"
                               @reload-list="(pageInfo) => fnDetailSearchSprdIntrvl(pageInfo)" />
          </div>
        </template>
        <template v-if="active === 4">
          <div class="integratedMap__detailSearchResultWrap" >
            <LoadingComponent :isArea="isDetailSearchTab04LoadingBar" style="position:relative;" />
            <div class="integratedMap__detailSearchResultWrapInner resultBox basResultBox">
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
                    <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickSearchSpbd(res)'>
                      <strong class="integratedMap__roadAddress">{{ res.schKorRoadNm }}</strong>
                      <span class="integratedMap__oldAddress">
                        <i aria-hidden="true" class="bi bi-geo-alt" />{{ res.schKorJibunNm }}
                      </span>
                    </Button>
                  </li>
                </ul>
              </Scrollpanel>
            </div>
          </div>
          <!--          <div class="integratedMap__detailSearchResultPaging" v-if="xyPosition.search_result.length > 0">-->
          <!--            <TemplatePaginator class="integratedMap__paging" :pageInfo="xyPosition.pageable" @reload-list="(pageInfo) => fnDetailSearch('04', pageInfo)"/>-->
          <!--          </div>-->
        </template>
      </div>
      <!-- //상세검색팝업 -->

      <div class="integratedMap__baseArea" :class="{ 'active': activeLayerPopup === 2 }">
        <div class="integratedMap__layoutPopupHeader">
          <p class="integratedMap__layoutPopupHeaderTitle">국가기초구역이란?
            <button class="integratedMap__tooltip" id="baseArea" @click="baseAreaShowDialog()"
                    :aria-controls="baseAreaDialogVisible ? 'baseArea' : null" :aria-expanded="baseAreaDialogVisible ? true : false">
              <i aria-hidden="true" class="bi bi-exclamation-circle-fill" />
              <span class="blind">툴팁 보기</span>
            </button>
          </p>
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
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCity2" scroll-height="30rem"
                            :options="basicDistrict.params_sido_data" v-model="basicDistrict.params_sido_val" title="시/도선택"
                            placeholder="선택" @change='fnSearchSggData("basicDistrictSgg", basicDistrict.params_sido_val)' />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCounty2">시/군/구</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCounty2" scroll-height="30rem"
                            :options="basicDistrict.params_sgg_data" v-model="basicDistrict.params_sgg_val" title="시/군/구선택"
                            placeholder="선택" />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingName2">구역번호</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomInputText id="buildingName2" v-model="basicDistrict.districtNo" type="number"
                             class="input formStyle01 integratedMap__inputText" placeholder="" title="부번 입력해주세요." :maxLength="6"/>
          </div>
        </div>
        <Button class="integratedMap__detailSearchFilterButton" @click="fnSearchBasicDistrict()">검색</Button>

        <div class="integratedMap__detailSearchResultWrap" >
          <LoadingComponent :isArea="isBasicDistrictSearchLoadingBar" style="position:relative;" />
          <div class="integratedMap__detailSearchResultWrapInner resultBox basResultBox">
            <div class="integratedMap__detailSearchResult">
              <p class="integratedMap__detailSearchResultTitle">
                검색결과 (총 <span class="commonColor01">{{ common.fnAddComma(basicDistrict.result_count) }}</span> 건)
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
                <li v-for="(res, idx) in basicDistrict.search_result" :key="idx" @click.prevent="fnClickSearchBasicDistrict(res)" style="cursor:pointer;">
                  <div class="integratedMap__resultListBaseAreaNumber" >
                    {{ basicDistrict.result_offset + idx + 1 }}</div>
                  <p class="integratedMap__resultListBaseAreaText">
                    {{ res.ctpvNm }} {{ res.sigNm }} {{ res.sbdno }}</p>
                </li>
              </ul>
            </Scrollpanel>
          </div>
        </div>
        <div class="integratedMap__detailSearchResultPaging" v-if="basicDistrict.search_result.length > 0">
          <TemplatePaginator class="integratedMap__paging" :pageInfo="basicDistrict.pageable"
                             @reload-list="(pageInfo) => fnSearchBasicDistrict(pageInfo)" />
        </div>
      </div>

      <!-- 관심주소 -->
      <div class="integratedMap__detailSearch" :class="{'active': activeLayerPopup === 3 }">
        <div class="integratedMap__layoutPopupHeader">
          <p class="integratedMap__layoutPopupHeaderTitle">관심주소</p>
          <div class="integratedMap__layoutPopupHeaderClose">
            <Button class="integratedMap__layoutPopupHeaderButton" @click="closeLayerPopup" title="관심주소 닫기">
              <i aria-hidden="true" class="bi bi-x" />
              <span class="blind">닫기</span>
            </Button>
          </div>
        </div>
        <div class="integratedMap__detailSearchTab">
          <div class="integratedMap__detailSearchTabScroll">
<!--            <TabMenu :model="addressInterest.tab01_items" :activeIndex="addressInterest.tab01_isActive" @tab-change="fnChangeAddrIntrTab01" />-->



            <ul class="integratedMap__tab">
              <li v-for="(item, index) in addressInterest.tab01_items" :key="index" :class="{'active': addressInterest.tab01_isActive === index}">
                <Button :title="item.label" @click="fnChangeAddrIntrTab01(index)">{{ item.label }}</Button>
              </li>
            </ul>
          </div>
        </div>
        <div class="integratedMap__detailSearchTabContent type01">
          <div class="integratedMap__innerContent" v-show="addressInterest.tab01_isActive === 0">

            <!-- 내부탭 -->
            <TabMenu class="integratedMap__innerTab" :model="addressInterest.tab02_items" :activeIndex="addressInterest.tab02_isActive" @tab-change="fnChangeAddrIntrTab02" />
            <div class="integratedMap__innerTabContent" v-show="addressInterest.tab02_isActive === 0">

              <p class="integratedMap__hint">※ 관심주소는 최대50건까지 등록가능합니다.</p>

              <!-- asis와 동일하게 맞추기위해 추가 -->
              <div class="integratedMap__inLayout">
                <div class="integratedMap__additionalAddress">
                  <div class="integratedMap__selectAdress">
                    <CustomDropdown class="integratedMap__dropdown" inputId="addressInterestCity1" :options="addressInterest.params_sido_data" scroll-height="30rem"
                                    v-model="addressInterest.params_sido_val" @change='fnSearchSggData("addressInterestSgg", addressInterest.params_sido_val)' title="시/도선택" placeholder="선택" />
                    <CustomDropdown class="integratedMap__dropdown" inputId="addressInterestCounty1" :options="addressInterest.params_sgg_data" scroll-height="30rem"
                                    v-model="addressInterest.params_sgg_val" title="시/군/구선택" placeholder="선택" />
                  </div>

                  <div class="integratedMap__adressSearchBox">
                    <CustomInputText id="addressInterestSearch" v-model="addressInterest.params_search_keyword" class="input formStyle01 integratedMap__inputText"
                                     placeholder="주소를 입력하세요." title="주소를 입력하세요." @keydown='(evt) => { if (evt.keyCode === 13) fnSearchAddrItrst() }'  />
                    <Button title="검색" class="" @click="fnSearchAddrItrst">

                      <i aria-hidden="true" class="bi bi-search"></i>
                      <span class="blind">검색</span>
                    </Button>
                  </div>

                  <div class="integratedMap__addressTable scroll01">
                    <LoadingComponent :isArea="isAddressInterestLoadingBar" style="position:relative;" />
                    <table>
                      <colgroup>
                        <col style="width:33px;" />
                        <col />
                        <col style="width:33px;" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>주소</th>
                          <th>추가</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="addressInterest.search_result.length < 1" >
                          <td colspan="3">
                            <div class="integratedMap__empty">
                              <img src="@images/utilization/icon_empty.png" alt="empty"><br />
                              검색된 내용이 없습니다.
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(res, idx) in addressInterest.search_result" :key="idx" >
                          <td>{{addressInterest.regist_pageable.first + idx + 1}}</td>
                          <td>
                            <div class="integratedMap__addressBox">

                              <div class="integratedMap__addressType"><span class="badge type01">도로</span> {{res.schKorRoadNm}}</div>
                              <div class="integratedMap__addressType"><span class="badge type02">지번</span> {{res.schKorJibunNm}}</div>
                            </div>
                          </td>
                          <td>
                            <Button title="추가하기" class="integratedMap__addressPlus" @click.prevent="fnAddAddrItrst(res)">
                              <span class="blind">추가</span>
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

<!--                  <CustomPaginator class="integratedMap__inLayoutPaging" :rows="10" :totalRecords="100" :pageLinkSize="5"/>-->
                  <TemplatePaginator class="integratedMap__paging" :pageInfo="addressInterest.regist_pageable" @reload-list="fnSearchAddrItrst" />
                </div>

                <div class="integratedMap__addressInterest">
                  <p class="integratedMap__addressInterestTitle">관심주소 (선택건수: {{addressInterest.interest_address_result.length}}/50)</p>
                  <div class="integratedMap__addressInterestForm">
                    <CustomInputText id="AddressInterest" v-model="addressInterest.interest_address_title" class="input formStyle01 integratedMap__inputText"
                                     placeholder="관심(배달지점) 주소명을 입력하세요." title="검색어를 입력해주세요." :maxLength="80"/>
                  </div>
                  <div class="integratedMap__addressTable scroll02">
                    <table>
                      <colgroup>
                        <col style="width:33px;" />
                        <col />
                        <col style="width:70px;" />
                      </colgroup>
                      <thead>
                      <tr>
                        <th>No</th>
                        <th>주소</th>
                        <th>이동/삭제</th>
                      </tr>
                      </thead>
                      <tbody>
                        <tr v-if="addressInterest.interest_address_result.length < 1" >
                          <td class="nodata" colspan="3">
                            주소를 선택해 주세요.
                          </td>
                        </tr>
                        <tr v-for="(res, idx) in addressInterest.interest_address_result" :key="idx" @click.prevent="fnViewAddrItrst(res)">
                          <td>{{idx+1}}</td>
                          <td>{{res.schKorRoadNm}}</td>
                          <td>
                            <div class="integratedMap__addressFunction">
                              <div class="integratedMap__addressButtonBox">
                                <Button class="integratedMap__addressButton up" title="한 칸 위로 순서변경" @click.prevent="(evt)=>{fnMoveAddrItrst(evt,  res, 'up')}">
                                  <span class="blind">한 칸 위로 순서변경</span>
                                </Button>
                                <Button class="integratedMap__addressButton down" title="한 칸 아래로 순서 변경" @click.prevent="(evt)=>{fnMoveAddrItrst(evt,  res, 'down')}">
                                  <span class="blind">한 칸 아래로 순서 변경</span>
                                </Button>
                              </div>
                              <div class="integratedMap__addressButtonBox">
                                <Button class="integratedMap__addressButton trash" title="현재 검색주소 삭제" @click.prevent="(evt)=>{fnRemoveAddrItrst(evt,  res)}">
                                  <span class="blind">현재 검색주소 삭제</span>
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="integratedMap__innerTabContent" v-show="addressInterest.tab02_isActive === 1">
              <p class="integratedMap__hint">※ 관심주소는 최대50건까지 등록가능합니다.</p>

              <!-- asis와 동일하게 맞추기위해 추가 -->
              <div class="integratedMap__inLayout">
                <div class="integratedMap__fileUploadWrap">
                  <div class="integratedMap__fileUploadBox">
                    <CustomInputText id="bulkRegistration" v-model="addressInterest.interest_address_excel_file_nm" class="input formStyle01 integratedMap__inputText"
                                     placeholder="엑셀파일(xls, xlsx)을 첨부하세요." title="엑셀파일(xls, xlsx)을 첨부하세요." disabled />
                    <Button class="fileSelect"  @click="fnUploadAddrIntr">파일선택</Button>
                    <input type="file" id="uploadIntrAddrExcelFile" style="display: none;" @change="fnOnloadAddrIntr" />
                  </div>
                  <p class="integratedMap__fileUploadSample">sample</p>
                  <div class="integratedMap__fileUploadImg"><img src="@images/utilization/sample.png" alt="sample" /></div>
                  <p class="integratedMap__fileUploadTip">※ 주소등록 시 이용하신 파일은 별도로 저장하거나 보유하지 않습니다. 안심하고 이용하세요.</p>
                  <div class="integratedMap__fileUploadButton">
                    <Button class="button" @click.prevent="fnConvertAddrIntr">주소검색</Button>
                  </div>
                </div>
                <div class="integratedMap__addressInterest type01">
                  <p class="integratedMap__addressInterestTitle">관심주소 (선택건수: {{addressInterest.interest_address_excel_result.length}}/50)</p>
                  <div class="integratedMap__addressInterestForm">
                    <CustomInputText id="AddressInterest" v-model="addressInterest.interest_address_excel_title" class="input formStyle01 integratedMap__inputText"
                                     placeholder="관심(배달지점) 주소명을 입력하세요." title="검색어를 입력해주세요." :maxLength="80"/>
                  </div>
                  <div class="integratedMap__addressTable scroll03">
                    <table>
                      <colgroup>
                        <col style="width:33px;" />
                        <col />
                        <col style="width:27px;" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>주소</th>
                          <th>삭제</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="addressInterest.interest_address_excel_result.length < 1" >
                          <td  colspan="3" style="text-align: center;padding: 30px;">
                            검색된 내용이 없습니다.
                          </td>
                        </tr>
                        <tr v-for="(res, idx) in addressInterest.interest_address_excel_result" :key="idx">
                          <td>{{idx+1}}</td>
                          <td>
                            <div class="integratedMap__addressBox">
                              <div class="integratedMap__addressType line">
                                <div class="badge type03">입력주소</div>
                                <div class="integratedMap__addressDataText">
                                  {{res.orgAddr}}
                                </div>
                              </div>
                              <div class="integratedMap__addressType line">
                                <div class="badge type04">도로명주소</div>
                                <template v-if='res.covertGubun === "0"'>
                                  <p class="integratedMap__addressDataTip">※ {{ res.searchResult }}</p>

                                </template>
                                <template v-if='res.covertGubun === "1" && res.subList && res.subList.length > 0'>
                                  <div class="integratedMap__addressDataSelect">
                                    <span class="text">{{ res.subList[0].searchResult }}</span>
                                  </div>

                                </template>
                                <template v-if='res.covertGubun === "2"'>

                                  <div class="integratedMap__addressDataSelect">
                                    <select :data-index="idx">
                                      <option value="" selected>::주소 선택::</option>
                                      <template v-for="(sub, key) in res.subList" :key="key" >
                                        <option :data-d="sub.d" :data-k="sub.k" :data-adrMngNo="sub.adrMngNo" >{{sub.searchResult}}</option>
                                      </template>
                                    </select>
                                  </div>
                                </template>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Button class="integratedMap__addressButton trash02" title="항목삭제하기" @click.prevent="(evt)=>{fnRemoveAddrItrstExcel(evt,  res)}">
                              <span class="blind">삭제</span>
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
            <!-- //내부탭 -->
            <div class="integratedMap__innerTabFooter">
              <Button class="integratedMap__innerTabFooterButton type01" @click.prevent="fnMoveAllAddrItrst">지도 표기</Button>
              <Button class="integratedMap__innerTabFooterButton type02" @click.prevent="fnAddrItrstExcelDwnld">파일 다운로드</Button>
              <Button class="integratedMap__innerTabFooterButton type03" id="certificationOnShowDialog" @click.prevent="fnValidAddrItrst">저장</Button>
            </div>
          </div>
          <div class="integratedMap__innerContent" v-show="addressInterest.tab01_isActive === 1">


            <template v-if="addressInterest.interest_address_hist_result.length < 1">

              <div class="integratedMap__empty">
                <img src="@images/utilization/icon_empty.png" alt="empty"><br />
                등록된 주소가 없습니다.<br />
                관심주소를 등록하시면 내역을 확인 할 수 있습니다.
              </div>
            </template>

            <template v-if="addressInterest.interest_address_hist_result.length > 0">
              <p class="integratedMap__registrationDetailsTitle">관심주소 등록 내역(총 {{addressInterest.hist_pageable.totalRecords}} 건)</p>

              <ul class="integratedMap__registrationDetailsList">
                <li v-for="(res, idx) in addressInterest.interest_address_hist_result" :key="idx" >
                  <div class="integratedMap__registrationDetailsListAddressBox" @click.prevent="(evt)=>{fnDetailAddrItrst(evt,  res)}">
                    <p class="integratedMap__registrationDetailsListAddress">{{ res.pstTtl }}</p>
                    <div class="integratedMap__registrationDetailsListAddressText">
                      <span class="title">등록일시</span>
                      <span class="text">{{res.frstRegDt}}</span>
                    </div>
                  </div>
                  <div class="integratedMap__registrationDetailsListFunction">
                    <Button title="관심주소 지도에 표시하기" @click.prevent="(evt)=>{fnMapViewAddrItrst(evt,  res)}">
                      <i class="bi bi-geo-alt" /><span class="blind">관심주소 지도에 표시하기</span>
                    </Button>
                    <Button title="관심주소 정보 보기" @click.prevent="(evt)=>{fnDetailAddrItrst(evt,  res)}">
                      <i class="bi bi-exclamation-circle" /><span class="blind">관심주소 정보보기</span>
                    </Button>
                    <Button title="관심주소 삭제하기" @click.prevent="(evt)=>{fnDeleteAddrItrst(evt,  res)}">
                      <i class="bi bi-trash" /><span class="blind">관심주소 삭제하기</span>
                    </Button>
                  </div>
                </li>
              </ul>
              <TemplatePaginator class="integratedMap__paging" :pageInfo="addressInterest.hist_pageable" @reload-list="fnSelectAddrItrstList" />
            </template>
          </div>
        </div>
      </div>

      <!-- 국가지점번호판 검색 -->
      <div class="integratedMap__detailSearch" :class="{'active': activeLayerPopup === 4 }">
        <div class="integratedMap__layoutPopupHeader">
          <p class="integratedMap__layoutPopupHeaderTitle">국가지점번호판검색</p>
          <div class="integratedMap__layoutPopupHeaderClose">
            <Button class="integratedMap__layoutPopupHeaderButton" @click="closeLayerPopup">
              <i aria-hidden="true" class="bi bi-x" />
              <span class="blind">닫기</span>
            </Button>
          </div>
        </div>
        <div class="integratedMap__detailSearchFilter baseArea">
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCity3">시/도</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCity3" scroll-height="30rem"
                            :options="nationalPointNum.params_sido_data" v-model="nationalPointNum.params_sido_val" title="시/도선택"
                            placeholder="선택" @change='fnSearchSggData("nationalPointNumSgg", nationalPointNum.params_sido_val)' />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCounty3">시/군/구</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCounty3" scroll-height="30rem"
                            :options="nationalPointNum.params_sgg_data" v-model="nationalPointNum.params_sgg_val" title="시/군/구선택"
                            placeholder="선택" />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="nationalPointNum">국가지점번호</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomInputText id="nationalPointNum" v-model="nationalPointNum.params_point_Num"  title="국가지점번호판번호를 입력해주세요."
                             class="input formStyle01 integratedMap__inputText" placeholder="" :maxLength="10"/>
          </div>
        </div>
        <Button class="integratedMap__detailSearchFilterButton" @click="fnSearchNationalPointNum()">검색</Button>

        <div class="integratedMap__detailSearchResultWrap" >
          <LoadingComponent :isArea="isNationalPointNumLoadingBar" style="position:relative;" />
          <div class="integratedMap__detailSearchResultWrapInner resultBox basResultBox">
            <div class="integratedMap__detailSearchResult">
              <p class="integratedMap__detailSearchResultTitle">
                검색결과 (총 <span class="commonColor01">{{ common.fnAddComma(nationalPointNum.result_count) }}</span> 건)
              </p>
              <div class="integratedMap__detailSearchResultFunction">
                <Button class="integratedMap__detailSearchResultFunctionButton">
                  지도
                </Button>
              </div>
            </div>

            <div class="integratedMap__detailNotRecentSearches" v-if="nationalPointNum.search_result.length < 1">
              <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
              <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
            </div>
            <Scrollpanel class="integratedMap__detailSearchResultScroll" v-if="nationalPointNum.search_result.length > 0">
              <ul class="integratedMap__resultListBaseArea">
                <li v-for="(res, idx) in nationalPointNum.search_result" :key="idx" @click.prevent="fnClickSearchNationalPointNum(res)" style="cursor:pointer;">
                  <div class="integratedMap__resultListBaseAreaNumber" >
                    {{ nationalPointNum.result_offset + idx + 1 }}</div>
                  <p class="integratedMap__resultListBaseAreaText">
                    {{ res.lctnAddr }}<br/>
                    {{ res.fcltsKndCdNm }}<br/>
                    {{ res.ssn }}
                  </p>
                </li>
              </ul>
            </Scrollpanel>
          </div>
        </div>
        <div class="integratedMap__detailSearchResultPaging" v-if="nationalPointNum.search_result.length > 0">
          <TemplatePaginator class="integratedMap__paging" :pageInfo="nationalPointNum.pageable"
                             @reload-list="(pageInfo) => fnSearchNationalPointNum(pageInfo)" />
        </div>
      </div>

      <!-- 기초번호판 검색 -->
      <div class="integratedMap__detailSearch" :class="{'active': activeLayerPopup === 5 }">
        <div class="integratedMap__layoutPopupHeader">
          <p class="integratedMap__layoutPopupHeaderTitle">기초번호판검색</p>
          <div class="integratedMap__layoutPopupHeaderClose">
            <Button class="integratedMap__layoutPopupHeaderButton" @click="closeLayerPopup">
              <i aria-hidden="true" class="bi bi-x" />
              <span class="blind">닫기</span>
            </Button>
          </div>
        </div>
        <div class="integratedMap__detailSearchFilter baseArea">
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCity3">시/도</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCity3" scroll-height="30rem"
                            :options="basisNumberPlate.params_sido_data" v-model="basisNumberPlate.params_sido_val" title="시/도선택"
                            placeholder="선택" @change='fnSearchSggData("basisNumberPlateSgg", basisNumberPlate.params_sido_val)' />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCounty3">시/군/구</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCounty3" scroll-height="30rem"
                            :options="basisNumberPlate.params_sgg_data" v-model="basisNumberPlate.params_sgg_val" title="시/군/구선택"
                            placeholder="선택" @change='fnSearchRoadNameData("basisNumberPlateRoadName01", basisNumberPlate.params_sgg_val)' />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="roadName01">도로명</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomDropdown class="integratedMap__dropdown initial" inputId="roadName01" :options="roadItemsList"
                            v-model="basisNumberPlate.params_start_char" title="초성 선택" placeholder="ㄱ" scroll-height="30rem"
                            @change='fnSearchRoadNameData("basisNumberPlateRoadName02", basisNumberPlate.params_sgg_val)' />
            <CustomDropdown class="integratedMap__dropdown" inputId="roadName02" scroll-height="30rem"
                            :options="basisNumberPlate.params_road_data" v-model="basisNumberPlate.params_road_name"
                            title="도로명선택" placeholder="선택" />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="building03">건물번호</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomInputText id="building03" v-model="basisNumberPlate.params_bnmn" :type="'number'" :maxLength="6"
                             class="input formStyle01 integratedMap__inputText form02" placeholder="" title="본번 입력해주세요."
                             @keydown='(evt) => { if (evt.keyCode === 13) fnSearchBasisNumberPlate() }' />
            <span class="dash">-</span>
            <CustomInputText id="building04" v-model="basisNumberPlate.params_bnsn" :type="'number'" :maxLength="6"
                             class="input formStyle01 integratedMap__inputText form02" placeholder="" title="부번 입력해주세요."
                             @keydown='(evt) => { if (evt.keyCode === 13) fnSearchBasisNumberPlate() }' />
            <span class="text">번</span>
          </div>
        </div>
        <Button class="integratedMap__detailSearchFilterButton" @click="fnSearchBasisNumberPlate()">검색</Button>

        <div class="integratedMap__detailSearchResultWrap" >
          <LoadingComponent :isArea="isBasisNumberPlateLoadingBar" style="position:relative;" />
          <div class="integratedMap__detailSearchResultWrapInner resultBox basResultBox">
            <div class="integratedMap__detailSearchResult">
              <p class="integratedMap__detailSearchResultTitle">
                검색결과 (총 <span class="commonColor01">{{ common.fnAddComma(basisNumberPlate.result_count) }}</span> 건)
              </p>
              <div class="integratedMap__detailSearchResultFunction">
                <Button class="integratedMap__detailSearchResultFunctionButton">
                  지도
                </Button>
              </div>
            </div>

            <div class="integratedMap__detailNotRecentSearches" v-if="basisNumberPlate.search_result.length < 1">
              <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
              <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
            </div>
            <Scrollpanel class="integratedMap__detailSearchResultScroll" v-if="basisNumberPlate.search_result.length > 0">
              <ul class="integratedMap__resultListBaseArea">
                <li v-for="(res, idx) in basisNumberPlate.search_result" :key="idx" @click.prevent="fnClickSearchBasisNumberPlate(res)" style="cursor:pointer;">
                  <div class="integratedMap__resultListBaseAreaNumber" >
                    {{ basisNumberPlate.result_offset + idx + 1 }}</div>
                  <p class="integratedMap__resultListBaseAreaText">
                    {{ _.isEmpty(res.bsnpNsflCdNm) ? res.nsflEtcCn : res.bsnpNsflCdNm }}<br/>
                    {{ res.lgvReplcCdNm }} {{ res.korrdNm }} {{ res.bsnpBnsn === '0' ? res.bsnpBnmn : res.bsnpBnmn + '-' + res.bsnpBnsn}}
                  </p>
                </li>
              </ul>
            </Scrollpanel>
          </div>
        </div>
        <div class="integratedMap__detailSearchResultPaging" v-if="basisNumberPlate.search_result.length > 0">
          <TemplatePaginator class="integratedMap__paging" :pageInfo="basisNumberPlate.pageable"
                             @reload-list="(pageInfo) => fnSearchBasisNumberPlate(pageInfo)" />
        </div>
      </div>

      <!--  결과 창이 뜰때  resultListActive  추가 -->
      <div class="integratedMap__searchBoxWrap"  :class="{ 'layerPopupActive': isActiveRecentSearches, 'resultListActive' : isActiveTotalResultList }">
        <div class="integratedMap__form">
          <Button class="integratedMap__view">지도</Button>
          <div class="integratedMap__searchBox">
            <div class="integratedMap__searchInnerBox">
<!--              <i aria-hidden="true" class="bi bi-geo-alt-fill" />-->
              <ul class="integratedMap__searchCategories">
                <li>
                  <Checkbox v-model="totalSearch.is_search_aot_addr" inputId="totalSearchAot" name="checkList" binary @change="fnChangeSearchAotPos('aot')"/>
                  <label for="totalSearchAot">
                    <i aria-hidden="true" class="bi bi-check-lg" />사물
                  </label>
                </li>
                <li>
                  <Checkbox v-model="totalSearch.is_search_pos_addr" inputId="totalSearchPos" name="checkList" binary @change="fnChangeSearchAotPos('pos')"/>
                  <label for="totalSearchPos">
                    <i aria-hidden="true" class="bi bi-check-lg" />좌표
                  </label>
                </li>
              </ul>

              <label for="integratedMapSearch"><span class="blind">검색어 입력</span></label>
              <CustomInputText class="integratedMap__searchInput" v-model="totalSearch.search_keyword" :placeholder="totalSearch.search_keyword_placeholder"
                         :title="totalSearch.search_keyword_placeholder" id="integratedMapSearch" autocomplete="off" @focusin="activeRecentSearches"
                         @keydown="(evt) => { if (evt.keyCode === 13) fnTotalSearch() }" @input="(evt) => {fnSolrAutoComplete(evt), fnHandlerInputPos('totalSearch') }"/>
<!--              <Button v-if="totalSearch.search_keyword.length > 0" @click="clearInput" class="integratedMap__clearButton" title="삭제">-->
<!--                <span class="blind">삭제</span>-->
<!--                <i aria-hidden="true" class="bi bi-x" />-->
<!--              </Button>-->
              <Button class="integratedMap__recentSearchesButtonMore"
                      :title="isActiveRecentSearches ? '최근검색어 보기' : '최근검색어 닫기'" @click="toggleActiveRecentSearches">
                <span class="blind">{{ isActiveRecentSearches ? '최근검색어 보기' : '최근검색어 닫기' }}</span>
                <i aria-hidden="true" class="bi bi-caret-down-fill" />
              </Button>
            </div>
            <Button class="integratedMap__searchButton" title="검색" @click.prevent="fnTotalSearch()"
                    @keydown="(evt) => { if (evt.keyCode === 13) fnTotalSearch() }">
              <i aria-hidden="true" class="bi bi-search" />
              <span class="blind">검색</span>
            </Button>
            <div class="integratedMap__recentSearchesLayerPopup">
              <div class="integratedMap__objects">
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

            <!-- 자동완성 영역 -->
            <div class="integratedMap__autoComplete" v-if="isAutoCompleteOpen && autoCompleteDataList.length > 0 && totalSearch.search_keyword">
              <div class="integratedMap__autoCompleteContent">
                <Scrollpanel class="integratedMap__autoCompleteListWrap">
                  <ul  class="integratedMap__autoCompleteList">
                    <li v-for="(suggestions, index) in autoCompleteDataList" :key="index">
                      <span class="link" :title="suggestions.fullAddr" @click.prevent="fnSelectSuggesion(suggestions.fullAddr)" >
                        <span v-dompurify-html="suggestions.htmlAddr"/>
                      </span>
                    </li>
                  </ul>
                </Scrollpanel>
              </div>
            </div>
          </div>
        </div>
        <div class="integratedMap__resultListLayerPopup" :class="{ 'active': !isActiveResultList }">
          <LoadingComponent :isArea="isTotalSearchLoadingBar" style="position:absolute;" />
          <div class="integratedMap__recentSearchesHeader">
            <p class="integratedMap__recentSearchesHeaderTitle">{{ totalSearch.result_msg }} (총 <span class="commonColor01">{{ common.fnAddComma(totalSearch.result_count) }}</span>건)</p>
            <Button class="integratedMap__recentSearchesToggle" :title="isActiveResultList ? '레이어팝업 닫기' : '레이어팝업 열기'"
                    @click="toggleActiveResultList">
              <i aria-hidden="true" class="bi bi-chevron-up" />
              <span class="blind">{{ isActiveResultList ? '레이어팝업 닫기' : '레이어팝업 열기' }}</span>
            </Button>
          </div>

          <div class="integratedMap__detailNotRecentSearches" v-if="totalSearch.search_result.length < 1 && totalSearch.is_searched">
            <div class="integratedMap__empty">
              <br/>
              <br/>
              <img src="@images/utilization/ic-no-search-text.png" alt="empty">
              <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>
              <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>
              <br/>
              <br/>
            </div>
          </div>
          <Scrollpanel class="integratedMap__resultListWrap" v-if="totalSearch.search_result.length > 0">
            <ul class="integratedMap__resultList">
              <li v-for="(res, idx) in totalSearch.search_result" :key="idx">
                <template v-if="!res.objNm">
                  <Button class="integratedMap__resultAddress" title="위치보기" @click='fnClickSearchSpbd(res)'>
                    <strong class="integratedMap__roadAddress">{{ res.schKorRoadNm }}</strong>
                    <span class="integratedMap__oldAddress">
                      <i aria-hidden="true" class="bi bi-geo-alt" />{{ res.lndnSnTrim }}
                    </span>
                  </Button>
                </template>
                <template v-if="res.objNm">
                  <Button class="integratedMap__resultAddress" title="위치보기" @click='fnSearchAot("S", res)'>
                    <strong class="integratedMap__roadAddress">{{ res.bdSnTxt }}</strong>
                    <span class="integratedMap__oldAddress">
                    <i aria-hidden="true" class="bi bi-geo-alt" />{{ res.objNm }}
                  </span>
                  </Button>
                </template>
              </li>
            </ul>
          </Scrollpanel>

          <!--          <CustomPaginator v-if="totalSearch.search_result.length > 0" class="integratedMap__paging" :rows="pageInfo.size" :totalRecords="pageInfo.totalRecords" :pageLinkSize="1"/>-->
          <TemplatePaginator class="integratedMap__paging" :pageInfo="pageInfo" @reload-list="fnTotalSearch" />
        </div>
      </div>

      <ul class="integratedMap__mapKeyword">
        <li :class="{ 'layer': true, 'active': isActiveKadtAotMng }">

          <Button class="things" @click="fnToggleKadtAotMng">사물주소</Button>
          <div class="integratedMap__mapKeywordList01">
            <ul class="integratedMap__mapKeywordCategory01">
              <li :class="{'active' : kadtAotMngType === 'T30101'}">
                <Button class="category pedestrianOverpassElevator" title="육교승강기" @click.prevent='fnCallAotAddrPoint("T30101")'>육교승강기</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T30201'}">
                <Button class="category riversideParkingLot" title="둔치주차장" @click.prevent='fnCallAotAddrPoint("T30201")'>둔치주차장</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T30301'}">
                <Button class="category earthquakeOutdoorShelter" title="지진옥외대피장소" @click.prevent='fnCallAotAddrPoint("T30301")'>지진옥외 대피장소</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10401'}">
                <Button class="category busStop" title="버스정류장" @click.prevent='fnCallAotAddrPoint("T10401")'>버스정류장</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10402'}">
                <Button class="category taxiStand" title="택시승강장" @click.prevent='fnCallAotAddrPoint("T10402")'>택시승강장</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T30601'}">
                <Button class="category napArea" title="졸음쉼터" @click.prevent='fnCallAotAddrPoint("T30601")'>졸음쉼터</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T30302'}">
                <Button class="category tsunamiEvacuationShelter" title="지진해일 긴급대피장소" @click.prevent='fnCallAotAddrPoint("T30302")'>지진해일 긴급대피장소</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T30501'}">
                <Button class="category smallPark" title="소공원" @click.prevent='fnCallAotAddrPoint("T30501")'>소공원</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T30502'}">
                <Button class="category childrensPark" title="어린이공원" @click.prevent='fnCallAotAddrPoint("T30502")'>어린이공원</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10301'}">
                <Button class="category emergencyWaterSupplyFacility" title="비상급수시설" @click.prevent='fnCallAotAddrPoint("T10301")'>비상급수시설</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10302'}">
                <Button class="category lifeboat" title="인명구조함" @click.prevent='fnCallAotAddrPoint("T10302")'>인명구조함</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10901'}">
                <Button class="category droneDeliveryPoint" title="드론배달점" @click.prevent='fnCallAotAddrPoint("T10901")'>드론배달점</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T30202'}">
                <Button class="category parkingLot" title="주차장" @click.prevent='fnCallAotAddrPoint("T30202")'>주차장</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T30701'}">
                <Button class="category electricVehicleChargingStation" title="전기차충전소" @click.prevent='fnCallAotAddrPoint("T30701")'>전기차충전소</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10801'}">
                <Button class="category publicPhone" title="공중전화" @click.prevent='fnCallAotAddrPoint("T10801")'>공중전화</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10802'}">
                <Button class="category mailbox" title="우체통" @click.prevent='fnCallAotAddrPoint("T10802")'>우체통</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10701'}">
                <Button class="category electricWheelchairFastCharger" title="전동휠체어급속충전기" @click.prevent='fnCallAotAddrPoint("T10701")'>전동휠체어 급속충전기</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T30801'}">
                <Button class="category bicycleRack" title="자전거거치대" @click.prevent='fnCallAotAddrPoint("T30801")'>자전거거치대</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10303'}">
                <Button class="category emergencyFireExtinguishingDevice" title="비상소화장치" @click.prevent='fnCallAotAddrPoint("T10303")'>비상소화장치</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T10601'}">
                <Button class="category heatWaveShelter" title="무더위쉼터" @click.prevent='fnCallAotAddrPoint("T10601")'>무더위쉼터</Button>
              </li>
<!--              <li :class="{'active' : kadtAotMngType === 'T'}">-->
<!--                <Button class="category civilDefenseShelter" title="민방위대피소" @click.prevent='fnCallAotAddrPoint("")'>민방위대피소</Button>-->
<!--              </li>-->
              <li :class="{'active' : kadtAotMngType === 'T30802'}">
                <Button class="category childrensPlayFacility" title="어린이놀이시설" @click.prevent='fnCallAotAddrPoint("T30802")'>어린이 놀이시설</Button>
              </li>
              <li :class="{'active' : kadtAotMngType === 'T31201'}">
                <Button class="category foodTruckPermittedZone" title="푸드트럭허가구역" @click.prevent='fnCallAotAddrPoint("T31201")'>푸드트럭 허가구역</Button>
              </li>
            </ul>
          </div>
        </li>
        <li :class="{ 'layer': true, 'active': isActiveHahuFclts }">
          <Button class="civilAffairs" @click.prevent="fnToggleHahuFclts">민원행정기관</Button>
          <div class="integratedMap__mapKeywordList02">
            <ul class="integratedMap__mapKeywordCategory02">
              <li :class="{'active' : hahuFcltsType === 'police'}">
                <Button class="category policeStation" title="경찰서" @click.prevent='fnCallGovMachPoint("police")'>경찰서</Button>
              </li>
              <li :class="{'active' : hahuFcltsType === 'school'}">
                <Button class="category school" title="학교" @click.prevent='fnCallGovMachPoint("school")'>학교</Button>
              </li>
              <li :class="{'active' : hahuFcltsType === 'post'}">
                <Button class="category postOffice" title="우체국" @click.prevent='fnCallGovMachPoint("post")'>우체국</Button>
              </li>
              <li :class="{'active' : hahuFcltsType === 'adm'}">
                <Button class="category governmentOffice" title="관공서" @click.prevent='fnCallGovMachPoint("adm")'>관공서</Button>
              </li>
              <li :class="{'active' : hahuFcltsType === 'hospital'}">
                <Button class="category healthCenter" title="보건소" @click.prevent='fnCallGovMachPoint("hospital")'>보건소</Button>
              </li>
              <li :class="{'active' : hahuFcltsType === 'court'}">
                <Button class="category courtMilitaryService" title="법원/병무" @click.prevent='fnCallGovMachPoint("court")'>법원/병무</Button>
              </li>
              <li :class="{'active' : hahuFcltsType === 'customs'}">
                <Button class="category customsNationalTax" title="관세/국세" @click.prevent='fnCallGovMachPoint("customs")'>관세/국세</Button>
              </li>
            </ul>
          </div>
        </li>
        <li :class="{'active' : isActiveKargSsnp}">
          <Button class="country" @click="fnCallKargSsnp(false)">국가지점번호판</Button>
        </li>
        <li :class="{'active' : isActiveKarbSbd}">
          <Button class="foundation" @click="fnCallKarbSbd">기초구역<span class="post">(우편번호)</span></Button>
        </li>
        <li :class="{ active: isActiveEmdBndry }">
          <Button class="administration" title="행정구역" @click="fnToggleEmdBndry">행정구역</Button>
          <div class="integratedMap__mapKeywordList03" v-show="isActiveEmdBndry">
            <ul class="integratedMap__mapKeywordCategory03">
              <li :class="{ 'active' : isActiveEmdhBndry }">
                <button class="category" title="법정경계" @click="fnCallEmdBndry('b')">
                  <i aria-hidden="true" class="bi bi-check-lg" />법정경계
                </button>
              </li>
              <li :class="{ 'active' : isActiveEmdbBndry}">
                <button class="category" title="행정경계" @click="fnCallEmdBndry('h')">
                  <i aria-hidden="true" class="bi bi-check-lg" />행정경계
                </button>
              </li>
            </ul>
          </div>
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
            <li>
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
        <div class="integratedMap__mapFunction type04">
          <Button @click="fnMapZoomIn" title="확대">
            <i aria-hidden="true" class="bi bi-plus-lg" />
<!--            <span class="tip">1단계 확대</span>-->
          </Button>
        </div>
        <div class="integratedMap__mapFunction type03">
          <Button @click="fnMapZoomOut" title="축소">
            <i aria-hidden="true" class="bi bi-dash-lg" />
<!--            <span class="tip">1단계 축소</span>-->
          </Button>
        </div>

        <div class="integratedMap__mapLevel">
          <span class="tip type01">1단계 확대</span>
          <span class="tip type02">읍면동</span>
          <span class="tip type03">시군구</span>
          <span class="tip type04">시도</span>
          <span class="tip type05">국가</span>
          <span class="tip type06">1단계 축소</span>
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
      <Dialog class="integratedMap__baseLayerPopup" id="baseArea" :visible="baseAreaDialogVisible"
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
            <li>광주<span class="integratedMap__baseLayerPopupSubListNumber">61~62</span></li>
            <li>제주<span class="integratedMap__baseLayerPopupSubListNumber">63</span></li>
          </ul>
        </div>
      </Dialog>
      <!-- //기초구역 툴팁 -->

      <!-- 기초번호 툴팁 -->
      <Dialog class="integratedMap__baseLayerPopup" id="baseNumber" :visible="baseNumberDialogVisible"
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
                    @click="fnDownloadAdobeReader"
                    @keydown="(evt) => { if (evt.keyCode === 13) fnDownloadAdobeReader() }">PDF 리더
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
        <div class="integratedMap__logo">
          <a href="http://www.mois.go.kr" target="_blank" title="행정안전부 홈페이지 새창으로 열림"><img src="@images/utilization/logo-mois@2x.png" class="type02" alt="행정안전부"></a>
        </div>
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
                </ul>
              </Scrollpanel>
            </div>
            <div class="integratedMap__layerPopupFunction">
              <Button class="integratedMap__function" @click="mapCenterPointOkButton">확인</Button>
              <Button class="integratedMap__function" @click="mapCentetPointCloseButton">취소</Button>
            </div>
          </div>
        </div>
      </div>
      <p class="integratedMap__text">* 도로명주소 안내도에서 제공하는 정보는 참고용으로만 사용하시기 바랍니다.</p>
    </div>
  </div>

  <Dialog class="integratedMap__dimLayerPopup" id="guide" style="width:830px;"  :visible="guideDialogVisible" modal :closable="false"
    @hide="guideOnHideDialog" :aria-controls="guideDialogVisible ? 'guide' : null" :aria-expanded="guideDialogVisible ? true : false">
    <template #header>
      <p class="integratedMap__dimLayerPopupTitle">도로명주소찾기</p>
      <Button id="guideDialogFocus" class="integratedMap__dimLayerPopupButton" @click="guideCloseDialog">
        <span class="blind">팝업닫기</span>
        <i aria-hidden="true" class="bi bi-x-lg"/>
      </Button>
    </template>
    <div class="informationInquiry__guideContentWrap">
      <div class="informationInquiry__guideContent">
        <ol class="informationInquiry__guideContentList">
          <li>
            <p class="informationInquiry__guideContentTitle">1. 지도 서비스 구성</p>
            <div class="informationInquiry__guideContentImage"><img src="@images/utilization/img-guide-01.png" alt="지도서비스 안내 이미지"></div>
            <ol class="informationInquiry__guideContentInner">
              <li>
                <span class="informationInquiry__guideContentInnerNumber">1</span>
                지도 메뉴 영역으로 상세검색, 기초구역, 관심주소 메뉴를 제공합니다.
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">2</span>
                검색 조건의 입력과 결과를 조회할 수 있는 영역입니다. 목록에 조회된 주소 선택 시 지도에 표시됩니다.
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">3</span>
                선택한 도로명주소에 대해 건물정보와 도로정보를 확인할 수 있는 영역입니다.
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">4</span>
                지도의 행정구역 위치 표시 및 이동(시도/시군구/읍면동) 기능을 제공합니다.
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">5</span>
                지도의 확대/축소, 초기화, 거리/면적재기, 지도 저장/출력, 레이어(기초구역, 행정구역, 민원행정기관) 표시 기능을 제공합니다.
              </li>
            </ol>
          </li>
          <li>
            <p class="informationInquiry__guideContentTitle">2. 지도 메뉴</p>
            <div class="informationInquiry__guideContentImage"><img src="@images/utilization/img-guide-02.png" alt="지도 메뉴 안내 이미지"></div>
            <ol class="informationInquiry__guideContentInner">
              <li>
                <span class="informationInquiry__guideContentInnerNumber">1</span>
                검색어를 입력하여 도로명주소를 조회하는 통합검색 기능을 제공합니다.
                <ul>
                  <li>- 최근검색어 확인 및 검색어 자동완성(행정구역, 도로명) 기능을 제공합니다.</li>
                </ul>
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">2</span>
                도로명주소, 지번, 건물명 선택을 통한 도로명주소 검색과 기초번호 조회 기능을 제공합니다.
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">3</span>
                시도/시군구별 기초구역(우편번호) 조회 기능을 제공합니다.
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">4</span>
                관심주소의 건별 및 일괄(파일) 등록과 지도 표시, 저장, 다운로드의 기능을 제공합니다.
              </li>
            </ol>
          </li>
          <li>
            <p class="informationInquiry__guideContentTitle">3. 지도 툴바 기능</p>
            <div class="informationInquiry__guideContentImage"><img src="@images/utilization/img-guide-03.png" alt="지도 툴바 안내 이미지"></div>
            <ol class="informationInquiry__guideContentInner">
              <li>
                <span class="informationInquiry__guideContentInnerNumber">1</span>
                14Level로 구성된 안내지도의 단계별 확대/축소와 현재 표시된 지도의 단계를 표시합니다.
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">2</span>
                지도에 표시된 내용의
                초기화 <span aria-hidden="true" class="informationInquiry__guideIcon"><i aria-hidden="true" class="bi bi-arrow-clockwise"></i></span>,
                거리 재기 <span aria-hidden="true" class="informationInquiry__guideIcon distance"></span> ,
                면적 재기 <span aria-hidden="true" class="informationInquiry__guideIcon area"></span> 기능을 제공합니다.
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">3</span>
                지도 화면 저장(PNG, JPG, PDF) <span class="informationInquiry__guideIcon" aria-hidden="true"><i aria-hidden="true" class="bi bi-download"></i></span>,
                안내도 출력 <span class="informationInquiry__guideIcon output" aria-hidden="true"></span>,
                지도 범례 확인 <span class="informationInquiry__guideIcon legend" aria-hidden="true"></span>
                기능을 제공합니다.
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">4</span>
                지도에 레이어를 표시하는
                <span class="informationInquiry__guideFun type01"><strong class="blind">민원행정기관</strong></span>
                <span class="informationInquiry__guideFun type02"><strong class="blind">국가지점번호판</strong></span>
                <span class="informationInquiry__guideFun type03"><strong class="blind">기초구역</strong></span>
                <span class="informationInquiry__guideFun type04"><strong class="blind">행정구역</strong></span>
                기능을 제공합니다.
                <ul>
                  <li>- 기초구역 영역 레이어의 표시/미표시</li>
                  <li>- 행정구역 영역 레이어의 표시/미표시 (지도의 축척에 따라 시도, 시군구, 읍면동 표시)</li>
                  <li>- 민원행정기관 (경찰서, 학교, 관공서, 보건소, 법원/병무, 관세/국세)의 위치 및 정보 표시</li>
                  <li>- 국가지점번호판의 위치 및 정보 표시</li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            <p class="informationInquiry__guideContentTitle">4. 건물/도로정보 조회</p>
            <div class="informationInquiry__guideContentImage"><img src="@images/utilization/img-guide-04.png" alt="지도서비스 안내 이미지"></div>
            <ol class="informationInquiry__guideContentInner">
              <li>
                <span class="informationInquiry__guideContentInnerNumber">1</span>
                검색한 주소의 건물정보를 제공합니다.
                <ul>
                  <li>- 도로명주소의 영/국문 전환  <span class="informationInquiry__btn">영문</span>및 <span class="informationInquiry__btn">복사</span> 기능을 제공합니다.</li>
                  <li>- 지번주소 및 관할주민센터의 확인이 가능합니다.</li>
                  <li>- 상세주소(동/층/호)가 부여된 주소는 상세주소의 확인이 가능합니다.</li>
                </ul>
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">2</span>
                검색한 주소의 도로정보를 제공합니다.
                <ul>
                  <li>- 기점/종점, 길이, 고시일, 효력발생일, 도로명 부여사유를 확인할 수 있습니다.</li>
                  <li>- 도로구간과 <span class="informationInquiry__btn">도로구간보기</span>기초번호를<span class="informationInquiry__btn">기초구간보기</span> 지도에서 확인이 가능합니다.</li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            <p class="informationInquiry__guideContentTitle">5. 지도 선택으로 주소정보 조회</p>
            <div class="informationInquiry__guideContentImage"><img src="@images/utilization/img-guide-05.png" alt="지도서비스 안내 이미지"></div>
            <ol class="informationInquiry__guideContentInner">
              <li>
                <span class="informationInquiry__guideContentInnerNumber">1</span>
                12 Level 이상인 지도에서 건물군 명칭이나 건물번호에 마우스 포인터가 올라가면 도로명과 건물번호가 표시됩니다.
                <ul>
                  <li>- 도로명주소 안내지도는 전국이 표시되는 1Level 부터 상세한 지도가 표시되는 14 Level까지 제공됩니다.</li>
                  <li>- 12 Level에서는 건물군(공동주택 등)이 표시되고, 13 Level부터 건물번호가 표시됩니다.</li>
                  <!-- <li>- 12 Level 이상에서 건물 명칭에 마우스 포인터가 올라가면 마우스 포인터가 <img src="@images/utilization/ic-pointer.png" alt="마우스 포인터 이미지">변경되며, 도로명과 건물번호가 표시됩니다.<br>
                      <img src="@images/utilization/img-address-bubble.png" alt="학동로 68길 28">
                  </li> -->
                  <li>- 해당 주소정보 조회를 원하시면 마우스 왼쪽 버튼 클릭 시 주소정보창이 표시됩니다.</li>
                </ul>
              </li>
              <li>
                <span class="informationInquiry__guideContentInnerNumber">2</span>
                검색한 주소의 건물정보를 제공합니다.
                <ul>
                  <li>- 도로명주소의 영/국문 전환, 복사 기능이 동일하게 제공됩니다.</li>
                  <li>- 지번주소 및 관할주민센터의 확인이 가능합니다.</li>
                  <li>- 상세주소(동/층/호)가 부여된 주소는 상세주소의 확인이 가능합니다.</li>
                </ul>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>
  </Dialog>

  <NiceCertificationModal ref="niceCertificationModal" @fnGetDpcnIdntyCdNm="fnGetDpcnIdntyCdNm" @fnCloseModal="fnCloseCertificationModal"/>

</template>

<style lang="scss" scoped>
@import url('@/assets/scss/contents/utilization/IntegratedMap_pc.scss');
</style>

<style>
/* 스케일 ※ scope 안에 넣으면 적용이 안된다. */
.ol-zoomslider {
  display: block;
  top: unset;
  left: unset;
  right: 1rem;
  bottom: 100px;
  width: 40px;
  height: 121px;
  background-color: rgba(128, 128, 128, 0.4);
  z-index: 1000;
}

.ol-zoomslider:hover {
  background-color: rgba(128, 128, 128, 0.5);
}

button.ol-zoomslider-thumb {
  margin: 3px;
  width: 34px;
  height: 15px;
}

.ol-rotate {
  top: 95px;
  right: 16px;
  border: 0.5px solid #cccccc;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
  border-radius: 0.25rem;
}

button.ol-rotate-reset {
  width: 38px;
  height: 38px;
}

.ol-rotate-reset .ol-compass {
  font-size: large;
  font-weight: bold;
}
</style>

<style lang="scss">
.infoInquiryLayerpopup {
  display: none;
  /*position: absolute;*/
}

.informationInquiry__layerPopup {
  display: flex;
  flex-direction: column;
  width: 700px;
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
  width: 510px;
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
  padding:0 5px;
  border-bottom: 1px solid #d9dce0;
  background: #f2f5fa;
  color: #666;
  font-size: 14px;
  text-align: center;
}

.commonTable__vertical tbody td {
  height: 50px;
  padding:0 5px;
  border-bottom: 1px solid #e5e5e5;
  color: #000;
  font-size: 15px;
  text-align: center;
}

.commonTable__vertical tbody td.align-left {
  padding-left:10px;
  text-align: left;
}
/*
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
*/

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

.integratedMap__mapLevel {
  display: flex;
  position: absolute;
  right: 63px;
  bottom: 52px;
  flex-direction: column;
  align-items: flex-end;
}

.integratedMap__mapLevel .tip {
  display: none;
  position: absolute;
  align-items: center;
  height: 20px;
  padding: 0 10px;
  border-radius: 12px;
  transform: translateY(-50%);
  background: #000000cc;
  color: #fff;
  font-size: 12px;
  white-space: nowrap;
  line-height: 20px;

  &.type01 {
    bottom: 168px;
  }
  &.type02 {
     bottom: 112px;
   }
  &.type03 {
    bottom: 90px;
  }
  &.type04 {
     bottom: 68px;
   }
  &.type05 {
    bottom: 46px;
  }
  &.type06 {
    bottom: 8px;
  }
}
.integratedMap__inputText.form01 .p-inputtext{
  padding: 10px;

}

.integratedMap__inputText.form02 .p-inputtext{
  padding: 10px;
}

// 국가지점번호판 오버레이 class
.tooltip-mapPanelInfo-hidden-cluster {
  width:30px; height:30px; background-color:none;border-radius: 15px;margin-top:-15px;margin-left:-15px;

}
.tooltip-mapPanelInfo-hidden-cluster:focus {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #75f0e3, 0 1px 2px 0 #75f0e3;
}
.tooltip-mapPanelInfo-hidden-cluster-one {
  width:28px; height:40px; background-color:none;border-radius: 15px;

}
.tooltip-mapPanelInfo-hidden-cluster-one:focus {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #75f0e3, 0 1px 2px 0 #75f0e3;
}
</style>