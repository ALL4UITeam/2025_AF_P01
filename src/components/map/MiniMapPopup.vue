<template>
  <Dialog class="resultMapViewDialog" id="mapView" v-model:visible="mapViewDialogVisible" modal :closable="false"
    :aria-controls="mapViewDialogVisible ? 'mapView' : null" :aria-expanded="mapViewDialogVisible ? true : false"
    @hide="mapViewOnHideDialog"   @update:visible="fnClosePop"
  >
    <template #header>
      <Button id="mapViewDialogFocus" class="mapDialogCloseButton" @click="fnClosePop" >
        <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
      </Button>
    </template>
    <div class="resultMapViewDialog__map" style="background: #3399ff;">
      <div style="width:100%; height: 100%; position:relative; ">
        <MapEditor ref="comMapEditor" @mapLoaded="fnMapLoaded" lang="ko" :apikey="MAP_APIKEY"/>

        <button title="확대하기" class="mapButton__plus" @click="fnMapZoomIn">
          <span class="blind">확대</span>
        </button>
        <button title="축소하기" class="mapButton__minus" @click="fnMapZoomOut">
          <span class="blind">축소</span>
        </button>
      </div>
    </div>
    <div class="resultMapViewDialog__content" v-if="isRoadAddr && !isRoadLine">
      <div class="resultMapViewDialog__address">
        <div class="resultMapViewDialog__addressTitle">도로명주소</div>
        <p class="resultMapViewDialog__addressContent">{{props.data.schKorRoadNm}}
          <Button class="commonButton__resultButton" title="위치찾기" @click="fnMovePoint">
            <i aria-hidden="true" class="bi bi-geo-alt-fill" />
            <span class="blind">위치찾기</span>
          </Button>
        </p>
        <div class="resultMapViewDialog__addressTitle">지번</div>
        <p class="resultMapViewDialog__addressContent" v-dompurify-html="props.data.lndnSnTrim"/>
        <div class="resultMapViewDialog__addressTitle">우편번호</div>
        <p class="resultMapViewDialog__addressContent">{{props.data.zipCl}}</p>
      </div>
      <div class="resultMapViewDialog__function">
        <Button class="resultMapViewDialog__button guide" title="안내도 보기" @click.prevent="fnSearchTotalMap('spbd')">
          안내도 보기
        </Button>
        <Button class="resultMapViewDialog__button road" title="도로구간 보기" @click.prevent="fnSearchRoadNm">
          도로구간 보기
        </Button>
      </div>
    </div>
    <div class="resultMapViewDialog__content" v-if="isRoadAddr && isRoadLine">
      <div class="resultMapViewDialog__address">
        <div class="resultMapViewDialog__addressTitle">도로명</div>
        <p class="resultMapViewDialog__addressContent">{{props.data.schKorRoadNm}}
          <Button class="commonButton__resultButton" title="위치찾기" @click.prevent="fnMovePoint">
            <i aria-hidden="true" class="bi bi-geo-alt-fill" />
            <span class="blind">위치찾기</span>
          </Button>
        </p>
        <div class="resultMapViewDialog__addressTitle">기점/종점</div>
        <p class="resultMapViewDialog__addressContent">{{roadNmInfo.srtEndCn}}</p>
        <div class="resultMapViewDialog__addressTitle">부여사유</div>
        <p class="resultMapViewDialog__addressContent">{{roadNmInfo.grantDe}}</p>
        <div class="resultMapViewDialog__addressTitle">고시일</div>
        <p class="resultMapViewDialog__addressContent">{{roadNmInfo.noticeYmd}}</p>
        <div class="resultMapViewDialog__addressTitle">효력발생일</div>
        <p class="resultMapViewDialog__addressContent">{{roadNmInfo.effectDe}}</p>
        <div class="resultMapViewDialog__addressTitle">길이(m)</div>
        <p class="resultMapViewDialog__addressContent">{{roadNmInfo.roadLt}}</p>
      </div>
      <div class="resultMapViewDialog__function">
        <Button class="resultMapViewDialog__button guide" title="안내도 보기" @click="fnSearchTotalMap('road')">
          안내도 보기
        </Button>
        <Button class="resultMapViewDialog__button road" title="도로명주소" @click.prevent="fnSearchRoadNm">
          도로명주소
        </Button>
      </div>
    </div>

    <div class="resultMapViewDialog__content" v-if="!isRoadAddr">
      <div class="resultMapViewDialog__address">
          <div class="resultMapViewDialog__addressTitle">도로명주소</div>
          <p class="resultMapViewDialog__addressContent">{{props.aot.bdSnTxt}}</p>
          <div class="resultMapViewDialog__addressTitle">사물명</div>
          <p class="resultMapViewDialog__addressContent">{{props.aot.objNm}}</p>
      </div>
      <div class="resultMapViewDialog__function">
        <Button class="resultMapViewDialog__button guide" title="안내도 보기" @click="fnSearchTotalMap('aot')">
          안내도 보기
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import {nextTick, reactive, ref, onMounted} from "vue";
import MapEditor from "daip-map-component";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import mapUtils from "@/common/mapUtils";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {getCenter} from "ol/extent";
import GeoJSON from "ol/format/GeoJSON";
import mapStyles from "@/common/mapStyles";
import axios from "axios";
import {Feature} from "ol";
import Point from "ol/geom/Point";
import 'ol/ol.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import common from "@/common/common";
import dateUtils from "@/common/dateUtils";

// map apikey
const MAP_APIKEY = mapUtils.MAP_SERVER_APIKEY;
const comMapEditor = ref(null);
const mapViewDialogVisible = ref(false);
const isRoadAddr = ref(true);
const isRoadLine = ref(false);
const roadNmInfo = ref({
  srtEndCn : '',
  grantDe : '',
  noticeYmd : '',
  effectDe : '',
  roadLt : '',
});

const props = reactive({
  data : null,
  aot : null,
});

const emit = defineEmits(['fnCloseModal']);

// 건물/건물군 레이어
let buldEqbLayer = null;
// 포인트 아이콘 레이어
let pointIconLayer = null;
// 사물주소 레이어
let aotLayer = null;
// 도로구간 레이어
let sprdManageLayer = null;

/**
 * 맵 로드 완료
 */
const fnMapLoaded = () => {
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

  pointIconLayer = new VectorLayer({
    layerName: 'pointIconLayer',
    source: new VectorSource({
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetBasicStyle(ft, {}),
  });

  aotLayer = new VectorLayer({
    layerName: 'aotLayer',
    source: new VectorSource({
    }),
    zIndex: 1003,
    style: (ft) => mapStyles.fnGetAotStyle(ft, {scale: 1.5, anchor: [0.5, 1.2]}),
  });

  sprdManageLayer = new VectorLayer({
    layerName: 'sprdManageLayer',
    source: new VectorSource({
      format: new GeoJSON(),
    }),
    zIndex: 1003,
    visible: false,
    style: (ft) => mapStyles.fnGetSprdManageFlagStyle(ft, {
      strokeColor: 'rgba(243,64,164,0.8)',
      strokeWidth: 5,
    }),
  });

  comMapEditor.value.getMap().addLayer(buldEqbLayer);
  comMapEditor.value.getMap().addLayer(pointIconLayer);
  comMapEditor.value.getMap().addLayer(aotLayer);
  comMapEditor.value.getMap().addLayer(sprdManageLayer);

  if (props.aot?.objMngNo){
    const thngMgno = props.aot.objMngNo;
    fnSearchAot({'thngMgno' : thngMgno});
  } else if (props.data?.bdMgtSn) {
    fnClickSearchSpbd(props.data);
    fnGetRoadNmInfo();
  }
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
 * 레이어 오픈 상태 확인
 */
const getIsVisible = () => {
  return mapViewDialogVisible.value;
}

/**
 * 지도 출력 레이어를 오픈
 */
const show = (item) => {
  mapViewDialogVisible.value = true;

  if (item.objMngNo) {
    isRoadAddr.value = false;
    isRoadLine.value = false;
    props.aot = item;
  } else {
    isRoadAddr.value = true;
    isRoadLine.value = false;
    props.data = item;
  }
}

/**
 * 지도 출력 레이어를 닫기
 */
const hide = () => {
  mapViewDialogVisible.value = false;
  emit('fnCloseModal');
}

/**
 * 주소 팝업 닫기
 */
const fnClosePop = () => {
  mapViewDialogVisible.value  = false;
  emit('fnCloseModal');
}

const mapViewOnHideDialog = async() => {
  await nextTick();
}

/**
 * 검색 결과 클릭(건물 및 건물군 조회용)
 */
const fnMovePoint = () => {
  if (props.data.d && props.data.k){

    const x = mapUtils.decrypt(parseFloat(props.data.d));
    const y = mapUtils.decrypt(parseFloat(props.data.k));

    comMapEditor.value.getMap().getView().animate({
      center : [x, y],
      duration: 300
    });
  }
}

/**
 * 검색 결과 클릭(건물 및 건물군 조회용)
 */
const fnClickSearchSpbd = (res) => {
  if (res.d && res.k) {
    const x = mapUtils.decrypt(parseFloat(res.d));
    const y = mapUtils.decrypt(parseFloat(res.k));

    comMapEditor.value.getMap().getView().setCenter([x, y]);
    comMapEditor.value.getMap().getView().setZoom(10);

    pointIconLayer.getSource().clear();
    const ft = new Feature(new Point([x, y]));
    pointIconLayer.getSource().addFeature(ft);
  }

  if (res && res.eqbManSn && Number(res.eqbManSn) > 0) {
    fnGetSpbdEqb(res);
  } else if (res && res.bdMgtSn) {
    fnGetSpbdBuld(res);
  }
}

/**
 * 건물군 조회
 */
const fnGetSpbdEqb = (params) => {
  // 피쳐 초기화
  buldEqbLayer.getSource().clear();

  const url= mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&version=1.1.0"
    + "&APIKEY=" + MAP_APIKEY
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_spbd_eqb"
    + "&CQL_FILTER=eqb_man_sn='" + params.eqbManSn + "' and sig_cd='" + params.emdCd + "'"; // emdCd가 sigCd임

  axios.get(url)
  .then((res) => {
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
        if(buldEqbLayer.getSource().getExtent()) {
          comMapEditor.value.getMap().getView().fit(buldEqbLayer.getSource().getExtent());
        }
      // } else {
      //   comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      //   comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
      }
    } else {
      comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
    }
  })
  .catch(err => {
    console.log(err);
  });
}

/**
 * 건물 조회
 */
const fnGetSpbdBuld = (params) => {
  // 피쳐 초기화
  buldEqbLayer.getSource().clear();

  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&version=1.1.0"
    + "&APIKEY=" + MAP_APIKEY
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_spbd_buld"
    + "&CQL_FILTER=bd_mgt_sn='" + params.bdMgtSn + "'";

  axios.get(url)
  .then((res) => {
    if(res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          buldEqbLayer.getSource().addFeature(ft);
        });
        if(buldEqbLayer.getSource().getExtent()) {
          comMapEditor.value.getMap().getView().fit(buldEqbLayer.getSource().getExtent());
        }
      // } else {
      //   comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      //   comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
      }
      const buldCenter = getCenter(buldEqbLayer.getSource().getExtent());
    } else {
      comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
    }
  })
  .catch(err => {
    console.log(err);
  });
}

/**
 * 출입구 테이블 조회
 */
const fnGetSpbdEntrc = (cqlfilter) => {

  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
    + "SERVICE=WFS"
    + "&version=1.1.0"
    + "&APIKEY=" + MAP_APIKEY
    + "&REQUEST=GetFeature"
    + "&outputFormat=application/json"
    + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_spbd_entrc"
    + "&CQL_FILTER=" + cqlfilter; // emdCd가 sigCd임

  axios.get(url)
  .then((res) => {
    if(res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          buldEqbLayer.getSource().addFeature(ft);
        });
      }
    }
  })
  .catch(err => {
    console.log(err);
  });
}

/**
 * 주소정보 조회 -> 도로명 정보 조회 클릭
 */
const fnGetRoadNmInfo = () => {

  const cqlFilter = "rds_dpn_se=0 and rn_cd='" + props.data.rdMgtSn.slice(5) + "' and sig_cd='" + props.data.rdMgtSn.slice(0, 5) + "'";
  const url = mapUtils.MAP_SERVER_URL + "/wfs?"
      + "SERVICE=WFS"
      + "&version=1.1.1"
      + "&APIKEY=" + MAP_APIKEY
      + "&REQUEST=GetFeature"
      + "&outputFormat=application/json"
      + "&TYPENAME=" + mapUtils.MAP_SERVER_SCHEMA + ":tl_sprd_manage"
      + "&CQL_FILTER=" + cqlFilter;
  // + "&CQL_FILTER=rds_dpn_se=0 and rn_cd='" + filter.rnCd + "'";

  // 도로 goem 조회
  axios.get(url)
  .then((res) => {
    if (res.status === 200) {
      const format = new GeoJSON();
      if (res.data?.features?.length) {
        res.data.features.forEach((ftJson) => {
          const ft = format.readFeature(ftJson);
          sprdManageLayer.getSource().addFeature(ft);
        });
      // } else {
      //   comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      //   comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
      }
    } else {
      comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
    }
  });

  // 도로 정보 조회
  if(props.data?.rdMgtSn){
    axios.get('/api/ahs/selectRoadLocation/' + props.data.rdMgtSn)
    .then(async (res) => {
      if (res.status === 200) {
        if (res.data?.results?.list?.length) {
          const data = res.data.results.list[0];

          roadNmInfo.value.srtEndCn  = (data.srtCn ?? '-') + ' → ' + (data.endCn ?? '-');
          roadNmInfo.value.grantDe = data.grantDe ?? '-';
          roadNmInfo.value.noticeYmd = dateUtils.getDateSlice(data.noticeYmd, '-') ?? '-';
          roadNmInfo.value.effectDe = dateUtils.getDateSlice(data.effectDe, '-') ?? '-';
          roadNmInfo.value.roadLt = common.fnAddComma(data.roadLt) ?? '-';
        }
      }
    });
  }
}

/**
 * 사물주소 클릭
 */
const fnSearchAot = (params) => {

  axios.post('/api/totalMap/selectKadtAotList', params)
  .then((res) => {
    if(res.status === 200) {
      let ft = null;
      if (res.data?.results?.length) {
        const format = new GeoJSON();
        res.data.results.forEach((item) => {

          if (item.pointGid && item.pointGeom) {
            ft = format.readFeature(item.pointGeom);
          } else if (item.lnGid && item.lnGeom) {
            ft = format.readFeature(item.lnGeom);
          } else if (item.sideGid && item.sideGeom) {
            ft = format.readFeature(item.sideGeom);
          }
          aotLayer.getSource().addFeature(ft);
        });
        comMapEditor.value.getMap().getView().fit(aotLayer.getSource().getExtent());
      // } else {
      //   comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      //   comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
      }
    } else {
      comMapEditor.value.getMap().getView().setCenter([Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_X), Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_CENTER_Y)]);
      comMapEditor.value.getMap().getView().setZoom(Number(import.meta.env.VITE_DAIP_MAP_DEFAULT_ZOOM));
    }
  })
  .catch(error =>{
    console.error("error =>", error);
  });
}

/**
 * 안내도 보기
 * @param type
 */
const fnSearchTotalMap = (type) => {

  let url = '/map/totalMapView?';

  if (type.includes('aot')){
    url += 'searchType=aot&thngMgno=' + props.aot.objMngNo + '&aotNm=' + props.aot.bdSnTxt;
  } else if (type.includes('spbd')) {
    url += 'searchType=spbd&adrMngNo=' + props.data.adrMngNo + '&rdNm=' + props.data.rdNm;
  } else {
    url += 'searchType=roadNm&rdCd=' + props.data.rdMgtSn.slice(5) + '&rdNm=' + props.data.rdNm + '&sigCd=' + props.data.rdMgtSn.slice(0, 5);
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
}

/**
 * 도로구간 보기
 */
const fnSearchRoadNm = () => {

  const mapId = comMapEditor.value.fnGetMapId();
  const mapObj = document.getElementById(mapId);
  if(isRoadLine.value){ // 도로명주소 보기
    buldEqbLayer.setVisible(true);
    pointIconLayer.setVisible(true);
    sprdManageLayer.setVisible(false);
    if(buldEqbLayer.getSource().getFeatures().length) {
      comMapEditor.value.getMap().getView().fit(buldEqbLayer.getSource().getExtent(), {duration:500});
    }
    isRoadLine.value = false;
    mapObj.classList.remove('rotate-x-60');
  } else { // 도로구간 보기
    buldEqbLayer.setVisible(false);
    pointIconLayer.setVisible(false);
    sprdManageLayer.setVisible(true);
    if(sprdManageLayer.getSource().getFeatures().length) {
      comMapEditor.value.getMap().getView().fit(sprdManageLayer.getSource().getExtent(), {duration:500});
    }
    isRoadLine.value = true;
    mapObj.classList.add('rotate-x-60');
  }
}

onMounted(() => {
})

defineExpose({
  getIsVisible,
  show,
  hide,
});
</script>

<style scoped>
.closeBtn {
  position: absolute;
  right:30px;
  top:30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #111;
  z-index: 10;
}
.closeBtn i {
  display: flex;
  width: 100%;
  height: 100%;
  margin:1px 0 0 1px;
  line-height: 36px;
  font-size:22px;
  padding: 6px;
}
</style>

<style>

.ol-scale-line {
  display: block;
  position: absolute;
  left: calc(100% - 70px);
  /* bottom: v-bind(mScaleLineBottom); */
  margin-bottom: 1rem;
  transform: translate(-100%, 0);
}

.ol-zoomslider {
  display: none;
  top: unset;
  left: unset;
  right: 1rem;
  bottom: 50px;
  margin-right: 1px;
  width: 34px;
  height: 174px;
  background-color: rgba(128, 128, 128, 0.4);
}

.ol-zoomslider:hover {
  background-color: rgba(128, 128, 128, 0.5);
}

button.ol-zoomslider-thumb {
  margin: 3px;
  width: 28px;
  height: 15px;
}

.ol-rotate {
  display: block;
  top: 60px;
  right: 24px;
  border: 1px solid #bbbbbb;
  box-shadow: none;
  border-radius: 0.25rem;
}

button.ol-rotate-reset {
  display: block;
  width: 32px;
  height: 32px;
}

.ol-rotate-reset .ol-compass {
  display: block;
  font-size: large;
  font-weight: bold;
}

.mapButton__plus {
  position :absolute;
  right : 15px;
  bottom: 63px;
}

.mapButton__minus {
  position :absolute;
  right : 15px;
  bottom: 26px;
}
.map-component-style{
  transform-origin: top center !important;
  transform: rotateX(0deg);
  transition: height ease-in-out 1s, transform ease-in-out 1s;
}
.map-component-style.rotate-x-60{
  height: 116% !important;
  transform-origin: top center !important;
  transform: rotateX(30deg) !important;
}
.resultMapViewDialog__content{
  z-index: 1;
}

</style>