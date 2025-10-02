<script setup>
import {ref, onMounted, nextTick, reactive} from "vue";
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
import {bbox as bboxStrategy} from "ol/loadingstrategy";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Icon from "ol/style/Icon";
import Text from "ol/style/Text";
import GML2 from "ol/format/GML2";
import CircleStyle from "ol/style/Circle";
import Cluster from "ol/source/Cluster";
import Overlay from "ol/Overlay";
import {getCenter} from "ol/extent";
import { sidoDataLoad, sggDataLoad, emdDataLoad, stliDataLoad} from '@/common/jusoCommon.ts'
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import mapUtils from "@/common/mapUtils";
import mapStyles from "@/common/mapStyles";
import Measure from "@/common/measure";
import common from "@/common/common";
import {Feature} from "ol";
import {useRoute} from "vue-router";
import ImageLyr from "ol/layer/Image";
import ImageSource from "ol/source/ImageWMS";
import Draw from "ol/interaction/Draw";
import {MultiLineString, MultiPoint} from "ol/geom";
import html2canvas from "html2canvas";

/************ 개발용 **************/
// map apikey
const MAP_APIKEY = mapUtils.MAP_SERVER_APIKEY;
// 그리기 모드
let drawInteraction = null;
// map에 포인터 이동 유무
let isPointerMove = true;
// 접속위치 버튼 표출 유무
const currentPointButton =ref(false);
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
// 사물주소 레이어
let postLayer = null;

const measure = new Measure();

const route = useRoute();

// 주소검색용 오버레이
const addrInfoMouseOverElmt = document.createElement('div');
const addrInfoMouseOver = new Overlay({
  id: 'addrInfoMouseOverOverlay',
  element: addrInfoMouseOverElmt,
  offset: [20, 0],
  positioning: 'bottom-center',
});
const addrInfoMouseClickElmt = document.createElement('div');
const addrInfoMouseClick = new Overlay({
  id: 'addrInfoMouseClickOverlay',
  element: addrInfoMouseClickElmt,
  offset: [50, 0],
  positioning: 'top-left',
});

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
  offset: [0, -30],
  positioning: 'bottom-center',
});

// 기초번호용 오버레이
const sprdIntrvlMouseClickElmt = document.createElement('div');
const sprdIntrvlMouseClick = new Overlay({
  id: 'sprdIntrvlMouseClickOverlay',
  element: sprdIntrvlMouseClickElmt,
  offset: [0, -30],
  positioning: 'bottom-center',
});

// 통합검색
const totalSearch = reactive({
  is_search_aot_addr : false,
  search_keyword : '',
  search_result : [],
  result_count : 0,
  result_msg : 'Result',
});

// 상세검색
const detailSearch = reactive({
  // tab00 파라미터 정보(도로명주소)
  tab00_params_sido_val : null, // 시도
  tab00_params_sido_data : [],
  tab00_params_sgg_val : null,  // 시군구
  tab00_params_sgg_data : [],
  tab00_params_start_char : null, // 초성
  tab00_params_road_name : null,// 도로명
  tab00_params_road_data : [],
  tab00_params_bnmn : '',       // 건물번호 본번
  tab00_params_bnsn : '',       // 건물번호 부번
  tab00_search_keyword : '',
  tab00_search_result : [],
  tab00_result_count : 0,
  tab00_pageInfo : {
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
  tab01_params_sido_val : null, // 시도
  tab01_params_sido_data : [],
  tab01_params_sgg_val : null,  // 시군구
  tab01_params_sgg_data : [],
  tab01_params_emd_val : null,  // 읍면동
  tab01_params_emd_data : [],
  tab01_params_tli_val : null,  // 리
  tab01_params_tli_data : [],
  tab01_params_mtn_se_cd : false,  // 산 구분 유무
  tab01_params_mno : '',       // 번지 본번
  tab01_params_sno : '',       // 번지 부번
  tab01_search_keyword : '',
  tab01_search_result : [],
  tab01_result_count : 0,
  tab01_pageInfo : {
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
  tab02_params_sido_val : null,
  tab02_params_sido_data : [],
  tab02_params_sgg_val : null,
  tab02_params_sgg_data : [],
  tab02_params_emd_val : null,
  tab02_params_emd_data : [],
  tab02_params_buld_nm : '',
  tab02_search_keyword : '',
  tab02_search_result : [],
  tab02_result_count : 0,
  tab02_pageInfo : {
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
  tab03_params_sido_val : null,
  tab03_params_sido_data : [],
  tab03_params_sgg_val : null,
  tab03_params_sgg_data : [],
  tab03_params_start_char : null, // 초성
  tab03_params_road_name : null,  // 도로명
  tab03_params_road_data : [],
  tab03_params_bnmn : '',       // 건물번호 본번
  tab03_params_bnsn : '',       // 건물번호 부번
  tab03_search_keyword : '',
  tab03_search_result : [],
  tab03_result_count : 0,
  tab03_pageInfo : {
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
  params_sido_val : null,
  params_sido_data : [],
  params_sgg_val : null,
  params_sgg_data : [],
  search_result : [],
  result_count : 0,
  result_offset : 0,
  // lgvReplcCd : '451102',
  ctpvCd : '',
  lgvReplcCd : '',
  districtNo : '',
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
  search_result : [],
  result_count : 0,
  result_offset : 0,
  xPosition : '',
  yPosition : '',
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
    keyword:''
  , strSearchType:"HSTRY"
  , strFirstSort:"none"
  , strAblYn:"N"
  , strAotYn:"N"
  , strSynnYn:null
  , strHstryYn:"Y"
  , reqFrom:"RN_SEARCH_KOR_WEB"
  , checkMoblieYn:"N"
  , strFunctionName:"Y"
  , pageTotal:pageTotal
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
  roadInfoData : null,
  historyInfoData : null,
});

const toggleActive = () => {
  isActive.value = !isActive.value;
}

// 사물주소 버튼 클릭
const toggleThingsActive = () => {
  thingsIsActive.value = !thingsIsActive.value;

  if (thingsIsActive.value) {
    // 피쳐 클릭 추가
    comMapEditor.value.getMap().on('pointermove',fnAotAddrOverlay);
    comMapEditor.value.getMap().on('singleclick',fnAddAotAddrInfo);
  } else {
    // 피쳐 클릭 삭제
    comMapEditor.value.getMap().un('pointermove',fnAotAddrOverlay);
    comMapEditor.value.getMap().un('singleclick',fnAddAotAddrInfo);
  }
}

// 민원행정기관 버튼 클릭
const toggleCivilAffairsActive = () => {
  civilAffairsIsActive.value = !civilAffairsIsActive.value;

  if (civilAffairsIsActive.value) {
    // 피쳐 클릭 추가
    comMapEditor.value.getMap().on('pointermove',fnGovMachOverlay);
    comMapEditor.value.getMap().on('singleclick',fnAddGovMachInfo);
  } else {
    // 피쳐 클릭 삭제
    comMapEditor.value.getMap().un('pointermove',fnGovMachOverlay);
    comMapEditor.value.getMap().un('singleclick',fnAddGovMachInfo);
  }
}

const closeLayer = () => {
  isActive.value = false;
}

const modelValue = ref();

const clearInput = () => {
  modelValue.value = '';

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
  activeLayerPopup.value =  activeLayerPopup.value === popupNumber ? null : popupNumber
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

//검색결과 토글
const isActiveResultList = ref(false);
const toggleActiveResultList = () => {
  isActiveResultList.value = !isActiveResultList.value;
}

//검색영역 최근검색어 토글기능
const isActiveRecentSearches = ref(false);
const toggleActiveRecentSearches = () => {
  isActiveRecentSearches.value = !isActiveRecentSearches.value;
}

const active =ref(0);
const tabItems = ref([
  {label:'도로명주소'},
  {label:'지번'},
  {label:'건물명'},
  {label:'기초번호'},
  {label:'XY좌표'},
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
const onShowDialog = async() => {
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
const legendOnShowDialog = async() => {
  await nextTick();
  const dialogElement = document.querySelector('#legendClose');
  if (dialogElement) {
    dialogElement.focus();
  }
}
const legendOnHideDialog = () => {
  document.querySelector('#legend').focus();
}

const activeInquiry02 =ref(false);

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
const baseAreaOnShowDialog = async() => {
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
const baseNumberOnShowDialog = async() => {
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
  {label: '지도화면 PNG로 저장하기', bgColor:"#4e40db" , icon: "bi bi-filetype-png", title: "지도화면 PNG로 저장하기", value: "PNG"},
  {label: '지도화면 JPG로 저장하기', bgColor:"#2a51c7" , icon: "bi bi-filetype-jpg", title: "지도화면 JPG로 저장하기", value: "JPEG"},
  {label: '지도화면 PDF로 저장하기', bgColor:"#d93f4a" , icon: "bi bi-filetype-pdf", title: "지도화면 PDF로 저장하기", value: "PDF"},
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
  data = [{label: '선택', value: null}, ...data];
  detailSearch.tab00_params_sido_data = [...data];
  detailSearch.tab01_params_sido_data = [...data];
  detailSearch.tab02_params_sido_data = [...data];
  detailSearch.tab03_params_sido_data = [...data];
  basicDistrict.params_sido_data = [...data];
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
  });
  // comMapEditor.value.getMap().getView().setCenter([949219.3, 1947495.6]);
  comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);//전주
  // comMapEditor.value.getMap().getView().setCenter([1002442.364, 1813212.333]);// 국가지점번호판 테스트
  // comMapEditor.value.getMap().getView().setCenter([974948.7390899544, 1895721.4479178444]);// 민원행정기관 테스트
  // comMapEditor.value.getMap().getView().setZoom(8);
  //fnAddAddrOverlay();
  //fnAddSearchAddrInfo();
  comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));

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
      const rdCd = route.query.rdCd;
      const sigCd = route.query.sigCd;
      fnTotalSearch();
      fnSearchRoadNameInfo(route.query.rdCd, route.query.sigCd);
    }
  // 우리집 주소는
  } else if (route.query?.searchType && route.query.searchType === 'myArea') {
    if (route.query?.rdMgtSn) {
      totalSearch.search_keyword = route.query.rdNm;
      const rdMgtSn = route.query.rdMgtSn;
      fnTotalSearch();
      fnSearchMyArea({'rdMgtSn' : rdMgtSn});
    }
  // 사물주소
  } else if (route.query?.searchType && route.query.searchType === 'aot') {
    if (route.query?.thngMgno) {
      totalSearch.is_search_aot_addr = true;
      totalSearch.search_keyword = route.query.aotNm;
      const thngMgno = route.query.thngMgno;
      fnTotalSearch();
      fnSearchAot({'thngMgno' : thngMgno});
    }
  // 우편번호
  } else if (route.query?.searchType && route.query.searchType === 'post') {

    if (route.query?.sbdno) {
      const sbdno = route.query.sbdno;
      fnSearchPostNo({'sbdno' : sbdno});
    }
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
      newElement.innerHTML = ovly.getElement().getInnerHTML();
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
          allowTaint:true,
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
        allowTaint:true,
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

      iframe.setAttribute('srcdoc',`
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
  isVisiblePrintMap.value  = false;
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
      icon : '/src/assets/images/mapEditor/icon/ico-ent.png',
      anchor : [0.5, 0.5],
      scale :  0.5,

    })
  });

  sprdManageLayer = new VectorLayer({
    layerName: 'sprdManageLayer',
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetSprdManageStyle(ft, {strokeColor : 'rgba(243,64,164,0.8)', strokeWidth : 5}),
  });

  sprdIntrvlLayer = new VectorLayer({
    layerName: 'sprdIntrvlLayer',
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    zIndex: 1003,
    style: (ft,rslt) => mapStyles.fnGetSprdIntrvlStyle(ft, {}, rslt),
  });

  pointIconLayer = new VectorLayer({
    layerName: 'pointIconLayer',
    source: new VectorSource({
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetBasicStyle(ft, {
      scale : 1,
      anchor : [0.5, 1]
    }),
  });

  aotLayer = new VectorLayer({
    layerName: 'aotLayer',
    source: new VectorSource({
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetAotStyle(ft, {
      scale : 1.5,
      anchor : [0.5, 1.2]
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

  comMapEditor.value.getMap().addLayer(buldEqbLayer);
  comMapEditor.value.getMap().addLayer(sprdManageLayer);
  comMapEditor.value.getMap().addLayer(sprdIntrvlLayer);
  comMapEditor.value.getMap().addLayer(pointIconLayer);
  comMapEditor.value.getMap().addLayer(aotLayer);
  comMapEditor.value.getMap().addLayer(postLayer);
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
  comMapEditor.value.fnSaveMap({mimeType:imageType});
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
 * 시군구 데이터
 * @param type
 * @param ctpvCd
 */
const fnSearchSggData = async (type, ctpvCd) => {
  try {
    if (ctpvCd) {
      let data = await sggDataLoad(ctpvCd.value);
      data = [{label: '선택', value: null}, ...data];

      if(type === 'detailSearchTab00Sgg') {
        detailSearch.tab00_params_sgg_data = data;
        detailSearch.tab00_params_sgg_val = null;
      } else if(type === 'detailSearchTab01Sgg') {
        detailSearch.tab01_params_sgg_data = data;
        detailSearch.tab01_params_sgg_val = null;
        detailSearch.tab01_params_emd_data = [];
        detailSearch.tab01_params_emd_val = null;
        detailSearch.tab01_params_tli_data = [];
        detailSearch.tab01_params_tli_val = null;
      } else if(type === 'detailSearchTab02Sgg') {
        detailSearch.tab02_params_sgg_data = data;
        detailSearch.tab02_params_sgg_val = null;
        detailSearch.tab02_params_emd_data = [];
        detailSearch.tab02_params_emd_val = null;
      } else if(type === 'detailSearchTab03Sgg') {
        detailSearch.tab03_params_sgg_data = data;
        detailSearch.tab03_params_sgg_val = null;
        detailSearch.tab03_params_start_char = '가';
        detailSearch.tab03_params_road_name = null;
        detailSearch.tab03_params_road_data = [];
      } else if(type === 'basicDistrictSgg') {
        basicDistrict.params_sgg_data = data;
        basicDistrict.params_sgg_val = null;
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
      data = [{label: '선택', value: null}, ...data];
      // console.log('######################type==>>'+type);
      if(type === 'detailSearchTab01Emd') {
        detailSearch.tab01_params_emd_data = data;
        detailSearch.tab01_params_emd_val = null;
        detailSearch.tab01_params_tli_data = [];
        detailSearch.tab01_params_tli_val = null;
      } else if(type === 'detailSearchTab02Emd') {
        detailSearch.tab02_params_emd_data = data;
        detailSearch.tab02_params_emd_val = null;
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
      let data = await stliDataLoad(emdCd.value);
      data = [{label: '선택', value: null}, ...data];
      if(type === 'detailSearchTab01Tli') {
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

      if(type === 'detailSearchTab00RoadName01') {
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
        chosungData = [{label:'선택', value:null}, ...chosungData];
      } else {
        chosungData = [];
      }

      if(type.includes('detailSearchTab00RoadName')) {
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
    version: '1.1.0',
    REQUEST: 'GetFeature',
    outputFormat: 'GML2',
    TYPENAME: options.schema + ':' + options.layerName,
  }

  //필터 사용시
  if(options.cqlFilter) params.cql_filter = options.cqlFilter;
  if(options.featureId) params.featureID = options.featureId;

  const sourceLayer = await new VectorSource({
    format: new GML2(),
    loader : (extent, resolution, projection) => {
      const proj = projection.getCode();
      if (options.layerName === 'VBL_KARG_SSNP') {
        params.cql_filter = `((XCRD_VL / 0.3 - 333333) > ${extent[0]} and (XCRD_VL / 0.3 - 333333) < ${extent[2]}) and ((YCRD_VL / 0.3 - 333333) > ${extent[1]} and (YCRD_VL / 0.3 - 333333) < ${extent[3]})`;
      } else {
        params.BBOX = extent.join(',') + ',' + proj;
      }

      // axios.post('/api/proxy/kais/wfs', params, {
      axios.post(options.url ?? mapUtils.MAP_SERVER_URL + '/wfs', params, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      }).then((res) => {
        if(res.status === 200) {
          if(res.status === 200) {
            if (res.data) {
              const features = sourceLayer.getFormat().readFeatures(res.data);
              sourceLayer.addFeatures(features);
            }
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

  if(options.cqlFilter) params['CQL_FILTER'] = options.cqlFilter;
  if(options.featureId) params['featureID'] = options.featureId;

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
    alert("Search terms must contain at least two characters.");
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

    if(totalSearch.is_search_aot_addr) {
      inqCndParams.strAotYn = 'Y';
      axios.post('/api/solr/solrAotSearch', inqCndParams)
      .then((response) => {
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
        const data = response.data;
        // console.log("############# result ->> ", data);
        if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
          totalSearch.search_result = data.results.content;
          pageInfo.totalRecords = data.results.totalElements;
          pageInfo.currentRecords = data.results.numberOfElements;
          pageInfo.totalPages = data.results.totalPages;
          totalSearch.result_count = data.results.totalElements;
          if (data.results.content[0].schMode === 'SOLR') {
            totalSearch.result_msg = 'Result';
          } else {
            totalSearch.result_msg = '검색결과가 없어 주변 주소로 검색한 결과';
          }
        } else {
          totalSearch.search_result = data.results.content;
          pageInfo.totalRecords = 0;
          pageInfo.currentRecords = 0;
          pageInfo.totalPages = 0;
          totalSearch.result_count = 0;
          totalSearch.result_msg = 'Result';
        }
      })
      .finally(() => {
        //메세지 숨김
      });
    }
  }
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

      comMapEditor.value.getMap().forEachFeatureAtPixel(evt.pixel, (ft, lyr) => {
        if(ft && ft.get('rn_addr') && lyr && lyr.get('layerName')?.includes('buldVectorTile')) {
          addrInfoMouseOverElmt.innerHTML = `
            <div class="integratedMap__moveLayerPopup" >
              <div class="integratedMap__moveLayerPopupContent">
                ${ft.get('rn_addr') ?? ''}
              </div>
            </div>
          `;
          addrInfoMouseOver.setPosition(evt.coordinate);
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
      if(ft && lyr && lyr.get('layerName') && lyr.get('layerName').includes('buldVectorTile')) {
        console.log('###################################ft===>',ft);

        let query = '';
        // 하이라이트  설정
        if (ft.get('eqb_man_sn') && ft.get('eqb_man_sn') === '0' && ft.get('bd_mgt_sn')) {
          query = 'bdMgtSn:' + ft.get('bd_mgt_sn');
        } else if (ft.get('eqb_man_sn') && ft.get('eqb_man_sn') !== '0' && ft.get('sig_cd')) {
          query = 'eqbManSn:' + ft.get('eqb_man_sn') + ' AND emdCd:' + ft.get('sig_cd');
        }

        axios.post('/api/solr/solrGetBuldJusoInfo', {query : query})
        .then((res) => {
          if (res.status === 200) {
            if (res.data?.length) {
              fnClickSearchSpbd(res.data[0]);
            }
          }
        });
      }
    });
  });
}

/**
 * 검색 결과 클릭(건물 및 건물군 조회용)
 */
const fnClickSearchSpbd = (res) => {
  console.log('###########################fnClickSearchSpbd==>>',res);
  if (res.d && res.k) {
    const x = mapUtils.decrypt(parseFloat(res.d));
    const y = mapUtils.decrypt(parseFloat(res.k));

    comMapEditor.value.getMap().getView().setCenter([x, y]);
    comMapEditor.value.getMap().getView().setZoom(12);
  }

  if (res && res.eqbManSn && Number(res.eqbManSn) > 0) {
    fnGetSpbdEqb(res);
  } else if (res && res.bdMgtSn) {
    fnGetSpbdBuld(res);
  }
}


/**
 * 주소정보 조회 -> 도로명 정보 조회 클릭
 */
const fnSearchRoadNameInfo = (rnCd, sigCd) => {

  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&version=1.1.0"
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_sprd_manage"
    // + "&CQL_FILTER=rds_dpn_se=0 and rn_cd='" + rnCd + "' and sig_cd='" + sigCd + "'";
    + "&CQL_FILTER=rds_dpn_se=0 and rn_cd='" + rnCd + "'";

   axios.get(url)
  .then((res) => {
    if(res.status === 200) {
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
 * 정보조회 초기화
 */
const fnInitAddrInfo = () => {
  addrInfoMouseClickElmt.innerHTML = '';
  addrInfoMouseClick.setPosition(undefined);
  // 국문/영문 버튼 초기화
  bdInfo_isEngRdNm = false;
}

/**
 * 정보조회 주소 복사 버튼 클릭
 */
const fnClickRoadAddrCopyBtn = (params) => {
  bdInfo_isEngRdNm = true;
  
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

  if(document.execCommand("copy")){
    alert("Road Name Address has been copied to the clipboard.\n"+rdNm);
    document.body.removeChild(copyTxt);
  }else{
    alert("Your browser cannot use the copy function.");
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
const fnSearchRoadInfo = async (params={}) => {
  // const testRdMgtSn = params.rdMgtSn;
  const testRdMgtSn = "1144022113001";

  await axios.get('/api/ahs/selectRoadLocation/' + testRdMgtSn)
    .then(async (res) => {
      if (res.data !== null) {
        // console.log("테스트 =======>", res.data.results.list[0])
        searchInfoPopupResult.roadInfoData = {...res.data.results.list[0]};
      }
    });
}
/**
 * 주소정보 팝업 -> 변동이력 조회
 */
const fnSearchHistoryInfo = async (params={}) => {
  const detailParams = {
    // adrMngNo : params.adrMngNo,
    adrMngNo : "BBT00000451110087495",
  }
  await axios.post('/api/search/history-list', detailParams)
  .then((response) => {
    searchInfoPopupResult.historyInfoData = response.data.results;
    console.log("############# result ->> ", response);
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
          <p class="informationInquiry__title">Details</p>
          <button type="button" id="searchInfoPopCloseBtn" class="informationInquiry__button" title="Close">
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
                aria-selected="true" aria-controls="tab1__content">
              Road Name Address
            </button>
          </li>
        </ul>
        <div id="tab1__content" role="tabpanel" class="informationInquiry__content active">
          <div class="informationInquiry__inquiryAdressWrap">
            <div class="informationInquiry__inquiryAdress">
              <div class="informationInquiry__inquiryAdressNumber">${params.zipCl}</div>
              <p class="informationInquiry__inquiryAdressText" id="bdInfo_rodaNmArea">${params.schEngRoadNm}</p>
              <div class="informationInquiry__inquiryAdressFunction">
                <button type="button" id="bdInfo_copyRdNm" class="informationInquiry__inquiryAdressButton" title="Copy address">Copy</button>
              </div>
            </div>
          </div>
          <div class="informationInquiry__listDetail">
            <p class="informationInquiry__listDetailTitle">Land-Lot Numbers</p>
            <div class="informationInquiry__listDetailContent">
                ${params.schEngJibunNm}
            </div>
            <p class="informationInquiry__listDetailTitle">Building Name</p>
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
                <select  class="informationInquiry__eastWestFloorSelect" inputId="east" title="동 선택하기">
                  <option>동 선택</option>
                </select>
              </li>
              <li>
                <label for="west" class="blind">층 선택</label>
                <select  class="informationInquiry__eastWestFloorSelect" inputId="west" title="층 선택하기">
                  <option>층 선택</option>
                </select>
              </li>
              <li>
                <label for="floor" class="blind">호 선택</label>
                <select  class="informationInquiry__eastWestFloorSelect" inputId="floor" title="호 선택하기">
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
  });
  // 정보조회 복사 버튼 맵핑
  document.getElementById("bdInfo_copyRdNm").addEventListener('click', () => {
    fnClickRoadAddrCopyBtn(params);
  });

  addrInfoMouseClick.setPosition(position);
}

/**
 * 건물군 조회
 */
const fnGetSpbdEqb = (params) => {
  // 피쳐 초기화
  buldEqbLayer.getSource().clear();

  const wfsData = {
    SERVICE: 'WFS',
    version: '1.1.1',
    REQUEST: 'GetFeature',
    outputFormat: 'application/json',
    TYPENAME: mapUtils.MAP_SERVER_SCHEMA + ':tl_spbd_eqb',
    CQL_FILTER : "eqb_man_sn='" + params.eqbManSn + "' and sig_cd='" + params.emdCd + "'",
  }

  axios.post(mapUtils.MAP_SERVER_URL + '/wfs', wfsData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  }).then((res) => {
    if(res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          buldEqbLayer.getSource().addFeature(ft);
          ft.get('eqb_man_sn')
          if (ft && ft.get('eqb_man_sn') && ft.get('sig_cd')) {
            fnGetSpbdEntrc("eqb_man_sn='" + ft.get('eqb_man_sn') + "' and sig_cd='" + ft.get('sig_cd') + "' and entrc_se='RM'");
          }
        });
        const eqbCenter = getCenter(buldEqbLayer.getSource().getExtent());
        fnAddAddrInfo(true, eqbCenter, params);
      }
    }
  });
}

/**
 * 건물 조회
 */
const fnGetSpbdBuld = (params) => {
  // 피쳐 초기화
  buldEqbLayer.getSource().clear();

  const wfsData = {
    SERVICE: 'WFS',
    version: '1.1.1',
    REQUEST: 'GetFeature',
    outputFormat: 'application/json',
    TYPENAME: mapUtils.MAP_SERVER_SCHEMA + ':tl_spbd_buld',
    CQL_FILTER : "bd_mgt_sn='" + params.bdMgtSn + "'",
  }

  axios.post(mapUtils.MAP_SERVER_URL + '/wfs', wfsData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  }).then((res) => {
    if(res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          buldEqbLayer.getSource().addFeature(ft);
        });
      }
      const buldCenter = getCenter(buldEqbLayer.getSource().getExtent());
      fnAddAddrInfo(true, buldCenter, params);
    }
  });
}

/**
 * 출입구 테이블 조회
 */
const fnGetSpbdEntrc = (cqlfilter) => {

  const wfsData = {
    SERVICE: 'WFS',
    version: '1.1.1',
    REQUEST: 'GetFeature',
    outputFormat: 'application/json',
    TYPENAME: mapUtils.MAP_SERVER_SCHEMA + ':tl_spbd_entrc',
    CQL_FILTER : cqlfilter,
  }

  axios.post(mapUtils.MAP_SERVER_URL + '/wfs', wfsData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  }).then((res) => {
    if(res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          buldEqbLayer.getSource().addFeature(ft);
        });
      }
    }
  });
}

</script>

<template>
  <div class="integratedMap__layout">
    <div class="integratedMap__header">
      <div class="integratedMap__headerLogo"><img src="/src/assets/images/utilization/img-logo@2x.png" alt="도로명주소"/>
      </div>
    </div>
    <div class="integratedMap__content"  :class="{'layerPopupPosition': activeLayerPopup === 1 || activeLayerPopup === 2 }">

      <MapEditor ref="comMapEditor" :zoom-slider="true" @mapLoaded="fnMapLoaded" lang="en" :apikey="MAP_APIKEY"/>
      <div class="integratedMap__baseArea" :class="{'active': activeLayerPopup === 2 }">
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
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCity2" :options="basicDistrict.params_sido_data" v-model="basicDistrict.params_sido_val"
                            title="시/도선택" placeholder="선택" @change='fnSearchSggData("basicDistrictSgg", basicDistrict.params_sido_val)' />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingCounty2">시/군/구</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomDropdown class="integratedMap__dropdown" inputId="buildingCounty2" :options="basicDistrict.params_sgg_data" v-model="basicDistrict.params_sgg_val"
                            title="시/군/구선택" placeholder="선택" />
          </div>
          <p class="integratedMap__detailSearchFilterTitle"><label for="buildingName2">구역번호</label></p>
          <div class="integratedMap__detailSearchFilterForm">
            <CustomInputText id="buildingName2" v-model="basicDistrict.districtNo" class="input formStyle01 integratedMap__inputText" placeholder="" title="부번 입력해주세요." :maxLength="6" type="number" />
          </div>
        </div>
        <Button class="integratedMap__detailSearchFilterButton" @click="fnSearchBasicDistrict">검색</Button>

        <div class="integratedMap__detailSearchResult">
          <p class="integratedMap__detailSearchResultTitle">
            검색결과 (총 <span class="commonColor01">{{basicDistrict.result_count}}</span> 건)
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
              <div class="integratedMap__resultListBaseAreaNumber" @click.prevent="fnClickSearchBasicDistrict(res)">{{basicDistrict.result_offset + idx + 1}}</div>
              <p class="integratedMap__resultListBaseAreaText" @click.prevent="fnClickSearchBasicDistrict(res)">{{res.ctpvNm}} {{res.sigNm}} {{res.sbdno}}</p>
            </li>
          </ul>
        </Scrollpanel>
        <div class="integratedMap__detailSearchResultPaging" v-if="basicDistrict.search_result.length > 0">
          <TemplatePaginator class="integratedMap__paging" :pageInfo="basicDistrict.pageable" @reload-list="(pageInfo) => fnSearchBasicDistrict(pageInfo)"/>
        </div>
      </div>

      <!--  결과 창이 뜰때  resultListActive  추가 -->
      <div class="integratedMap__searchBoxWrap resultListActive" :class="{'layerPopupActive': isActiveRecentSearches}">
        <div class="integratedMap__form">
          <Button class="integratedMap__view">지도</Button>
          <div class="integratedMap__searchBox">
            <div class="integratedMap__searchInnerBox">
              <i aria-hidden="true" class="bi bi-geo-alt-fill" />
              <label for="integratedMapSearch"><span class="blind">검색어 입력</span></label>
              <InputText class="integratedMap__searchInput" v-model="totalSearch.search_keyword" placeholder="Search Address"
                title="Search Address" id="integratedMapSearch" autocomplete="off" @keydown="(evt) => {if(evt.keyCode === 13) fnTotalSearch()}"
              />
              <Button v-if="modelValue" @click="clearInput" class="integratedMap__clearButton" title="삭제">
                <span class="blind">삭제</span>
                <i aria-hidden="true" class="bi bi-x" />
              </Button>
              <Button class="integratedMap__recentSearchesButtonMore" :title="isActiveRecentSearches ? 'Recent search words open' : 'Recent search words close'" @click="toggleActiveRecentSearches">
                <span class="blind">{{ isActiveRecentSearches ? '최근검색어 보기' : '최근검색어 닫기' }}</span>
                <i aria-hidden="true" class="bi bi-caret-down-fill" />
              </Button>
            </div>
            <Button class="integratedMap__searchButton" title="Search" @click.prevent="fnTotalSearch" @keydown="(evt) => {if(evt.keyCode === 13) fnTotalSearch()}" >
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
                <p class="integratedMap__recentSearchesTitle">Recent search words</p>
                <div class="integratedMap__recentSearchesScrollWrap">
                  <div class="integratedMap__recentSearchesScroll">
                    <ul class="integratedMap__recentSearchesList">
                      <li>
                        <Button class="integratedMap__recentSearchesText" title="">
                          <span class="integratedMap__recentSearchesSearchText">한강로 2가</span>
                        </Button>
                        <span class="integratedMap__recentSearchesDate">09.23</span>
                        <Button class="integratedMap__recentSearchesButton" title="remove">
                          <i aria-hidden="true" class="bi bi-x" />
                          <span class="blind">remove</span>
                        </Button>
                      </li>
                      <li>
                        <Button class="integratedMap__recentSearchesText" title="">
                          <span class="integratedMap__recentSearchesSearchText">한강로 2가</span>
                        </Button>
                        <span class="integratedMap__recentSearchesDate">09.23</span>
                        <Button class="integratedMap__recentSearchesButton" title="remove">
                          <i aria-hidden="true" class="bi bi-x" />
                          <span class="blind">remove</span>
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
                  <Button class="integratedMap__recentSearchesfunctionButton">All remove</Button>
                  <div>
                    <Button class="integratedMap__recentSearchesfunctionButton">Turn off search history</Button>
                    <Button class="integratedMap__recentSearchesfunctionButton">Close</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="integratedMap__resultListLayerPopup" :class="{'active': isActiveResultList}">
          <div class="integratedMap__recentSearchesHeader">
            <p class="integratedMap__recentSearchesHeaderTitle">{{totalSearch.result_msg}} (Total <span class="commonColor01">{{totalSearch.result_count}}</span>)</p>




            <Button class="integratedMap__recentSearchesToggle" :title="isActiveResultList ? 'Open search area' : 'Close search area'"  @click="toggleActiveResultList">
              <i aria-hidden="true" class="bi bi-chevron-up" />
              <span class="blind">{{ isActiveResultList ? '레이어팝업 열기' : '레이어팝업 닫기' }}</span>
            </Button>
          </div>

<!--          <div class="integratedMap__detailNotRecentSearches" v-if="totalSearch.search_result.length < 1 && totalSearch.search_keyword.length > 1">-->
<!--            <p class="integratedMap__detailNotRecentSearchesTitle">검색결과가 없습니다.</p>-->
<!--            <p class="integratedMap__detailNotRecentSearchesText">검색창에서 주소를 입력해보세요.</p>-->
<!--          </div>-->
          <Scrollpanel class="integratedMap__resultListWrap" v-if="totalSearch.search_result.length > 0">
            <ul v-if="inqCndParams.strAotYn.includes('N')" class="integratedMap__resultList">
              <li v-for="(res, idx) in totalSearch.search_result" :key="idx">
                <Button class="integratedMap__resultAddress" title="Move location" @click='fnClickSearchSpbd(res)'>
                  <strong class="integratedMap__roadAddress">{{res.schEngRoadNm}}</strong>
                  <span class="integratedMap__oldAddress"><i aria-hidden="true" class="bi bi-geo-alt" />{{res.schEngJibunNm}}</span>
                </Button>
              </li>
            </ul>
            <ul v-if="inqCndParams.strAotYn.includes('Y')" class="integratedMap__resultList">
              <li v-for="(res, idx) in totalSearch.search_result" :key="idx">
                <Button class="integratedMap__resultAddress" title="Move location" @click='fnClickSearchAot(res)'>
                  <strong class="integratedMap__roadAddress">{{res.objNm}}</strong>
                  <span class="integratedMap__oldAddress"><i aria-hidden="true" class="bi bi-geo-alt" />{{res.bdSnTxt}}</span>
                </Button>
              </li>
            </ul>
          </Scrollpanel>


<!--          <CustomPaginator v-if="totalSearch.search_result.length > 0" class="integratedMap__paging" :rows="pageInfo.size" :totalRecords="pageInfo.totalRecords" :pageLinkSize="1"/>-->
          <TemplatePaginator class="integratedMap__paging" :pageInfo="pageInfo" @reload-list="fnTotalSearch"/>
        </div>
      </div>

      <div class="integratedMap__mapFunctionWrap">
        <div class="integratedMap__mapFunction type02" v-if="currentPointButton">
          <Button class="current" title="접속위치">
            <span class="tip">접속위치</span>
          </Button>
        </div>
        <div class="integratedMap__mapFunction type03">
          <Button @click="fnMapZoomIn" title="Zoom in">
            <i aria-hidden="true" class="bi bi-plus-lg" />
            <span class="tip">Zoom in</span>
          </Button>
          <div class="drag">

          </div>
          <Button @click="fnMapZoomOut" title="Zoom out">
            <i aria-hidden="true" class="bi bi-dash-lg" />
            <span class="tip">Zoom out</span>
          </Button>
        </div>
      </div>
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
  display:none;
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
  padding-right:10px;
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
  display:block;
}
.informationInquiry__headerFunction {
  display:none;
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
    left:0;
    right:0;
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
  border:none;
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

</style>