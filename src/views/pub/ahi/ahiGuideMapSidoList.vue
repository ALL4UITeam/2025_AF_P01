<template>
    <CommonBreadcrumb />
    <HeaderTitle title="지자체 안내도" />

    <div class="localGovernment__explanation">
        <ul class="localGovernment__list">
            <li>자치단체에서 자체 제작한 도로명주소 안내지도에 대한 다운로드 서비스입니다.</li>
            <li>자료의 용량에 따라 다운로드 완료까지 시간이 다소 소요될 수 있습니다.</li>
            <li>제공되는 안내지도에 대한 사항은 해당 자치단체에 문의하시기 바랍니다.</li>
        </ul>
        <p class="localGovernment__tip">
            <span class="commonBullet">※</span> 자치단체 제작 안내도가 없는 경우 한국국토정보공사에서 제공하는
            <a class="commonlink" href="https://jusomap.lx.or.kr/kor/18/guideMap" title="안내도 PDF 다운로드 서비스 새창으로 이동"
                target="_blank"> “안내도 PDF 내려받기” </a>
            서비스를 통해 안내도를 다운로드 받으실 수 있습니다.
        </p>
    </div>

    <ContentTitle title="지역을 선택해 주세요!" fontSize="24px" marginTop="40px" mobileFontSize="18px" mobileMarginTop="26px" />

    <div class="mapSelectForm">
        <div class="mapSelectForm__type">
            <div class="mapSelectForm__item">
                <label for="city1">시도</label>
                <CustomDropdown inputId="sidoList" :options="itemsCity" optionLabel="label" optionValue="value"
                    v-model="inqCndParams.ctpvCd" @change="loadSidoData" title="시/도 선택" placeholder="시/도 선택" />
            </div>
            <div class="mapSelectForm__item type01">
                <label for="county1">시군구</label>
                <CustomDropdown inputId="sggList" :options="itemsCounty" optionLabel="label" optionValue="value"
                    v-model="inqCndParams.lgvCd" @change="loadSggData" title="시/군/구 선택" placeholder="시/군/구 선택" />
            </div>
            <div class="mapSelectForm__item type02">
                <label for="guideName">안내지도명</label>
                <CustomDropdown inputId="guideName" :options="guideMapData" v-model="guideMapParams.tmprFileNm"
                    title="유형 선택" placeholder="선택" optionValue="value" @change="onMapSelect" />
            </div>
        </div>
        <div class="mapSelectForm__result">
            <div class="mapSelectForm__address">{{ ctpvCdLabel }} {{ lgvCdLabel }}</div>
            <div class="mapSelectForm__number">{{ telnoCn }}</div>
        </div>
    </div>
    <div class="mapSelectForm__button">
        <Button class="commonButton__button" title="다운로드" @click="fnFileDwnld">
            <span class="commonButton__text">다운로드</span>
            <i aria-hidden="true" class="bi bi-download" />
        </Button>
    </div>
</template>
<script setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import Breadcrumb from 'primevue/breadcrumb'
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import HeaderTitle from '@components/title/HeaderTitle.vue';
import ContentTitle from '@components/title/ContentTitle.vue';
import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
import { sidoDataLoad, sggDataLoad } from '@/common/jusoCommon.ts'   //[공용컴포넌트]시도 데이터, 시군구 데이터
import axios from 'axios';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";

//안내지도명 데이터 리스트
const guideMapData = ref([]);
const telnoCn = ref('');

//지역선택 드롭다운 변수
const itemsCity = ref([]);
const itemsCounty = ref([]);

const inqCndParams = reactive({
    ctpvCd: ''
    , lgvReplcCd: ''
    , lgvCd: ''
    , guidanceMapDwnldMgno: ''
});

const ctpvCdLabel = ref('');
const lgvCdLabel = ref('');

//시도 데이터 (jusoCommon.ts)
const loadSidoData = async () => {
    try {
        const data = await sidoDataLoad();
        itemsCity.value = data;
        loadSggData();
    } catch (error) {
        // console.error('Error loading Sido data', error);
    }
}

//시군구 데이터 (jusoCommon.ts)
const loadSggData = async () => {
    try {
        const data = await sggDataLoad(inqCndParams.ctpvCd);
        itemsCounty.value = data;
    } catch (error) {
        // console.log('Error loading Sido data', error);
    }
}

//시도 변경 시 시군구코드 초기화 , 다시 서울특별시 선택시 시군구코드 초기화
watch(() => inqCndParams.ctpvCd, (newVal) => {
    if (newVal !== '') {
        inqCndParams.lgvCd = '';
    }
    //시군구, 시도 데이터 변경 시 초기화
    if (newVal) {
        ctpvCdLabel.value = '';
        lgvCdLabel.value = '';
        telnoCn.value = '';
        guideMapData.value = '';
    }
}
)

//lgvCd 시군구 선택시 inqCndParams.lgvReplcCd에 값이 들어감
watch(() => inqCndParams.lgvCd, (newLgvCd) => {
    const selectedItem = itemsCounty.value.find(item => item.value === newLgvCd)
    if (selectedItem) {
        inqCndParams.lgvReplcCd = selectedItem.lgvReplcCd
        guideMapList();
    }
    //시군구, 시도 데이터 변경 시 초기화
    if (selectedItem) {
        ctpvCdLabel.value = '';
        lgvCdLabel.value = '';
        telnoCn.value = '';
        guideMapData.value = '';
        guideMapParams.fileNm = '';
        guideMapParams.fileNmDt = '';
        guideMapParams.fileMgno = '';
        guideMapParams.fileSn = '';
    }
})

//데이터 검색 
const guideMapList = async () => {
    try {
        const response = await axios.post('/api/ahi/selectGuideMapSidoList', inqCndParams)
        const dataArray = response.data;

        //전화번호
        telnoCn.value = dataArray[0].telnoCn
        updateLabels()

        if (Array.isArray(dataArray)) {
            guideMapData.value = dataArray.map((item) => ({
                value: item.tmprFileNm,
                label: item.fileNmDt,
                fileNm: item.fileNm,
                fileMgno : item.fileMgno,
                fileSn : item.fileSn
            }));
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

//시도, 시군구 업데이트 시 라벨값 추출 (시도: ctpvCdLabel, 시군구: lgvCdLabel)
const updateLabels = () => {
    const selectedCity = itemsCity.value.find(city => city.value === inqCndParams.ctpvCd);
    ctpvCdLabel.value = selectedCity ? selectedCity.label : '';

    const selectedLgv = itemsCounty.value.find(lgv => lgv.value === inqCndParams.lgvCd);
    lgvCdLabel.value = selectedLgv ? selectedLgv.label : '';
}

//안내지도 파일 다운로드 파라미터
const guideMapParams = reactive({
    fileNmDt:''
    ,fileMgno: ''
    , fileNm: ''
    , fileSn: ''
    ,tmprFileNm: ''
});

//안내지도 원본파일명 이용하여 label, fileNm 변수 저장
const onMapSelect = () => {
    const selectedMap = guideMapData.value.find(map => map.value === guideMapParams.tmprFileNm);
    if (selectedMap) {
        guideMapParams.fileNmDt = selectedMap.label;
        guideMapParams.fileSn = selectedMap.fileSn;
        guideMapParams.fileMgno = selectedMap.fileMgno;

    }
}

//안내도 다운로드
const fnFileDwnld = async (files) => {
	
	if (!inqCndParams.ctpvCd) {
		alert("시도를 선택하여 주세요.");
		return;
	}
	
	if (!inqCndParams.lgvCd) {
		alert("시군구를 선택하여 주세요.");
		return;
	}
	
	if (!guideMapParams.tmprFileNm) {
		alert("안내지도를 선택하여 주세요.");
		return;
	}
	
	const innorixDownloadUrl = `/api/innorix/download`
	const fileMgno = guideMapParams.fileMgno;
	const fileSn = guideMapParams.fileSn;
	const fileDownloadUrl = `${innorixDownloadUrl}/${fileMgno}/${fileSn}`;
  try {
		const response = await axios({
			url: fileDownloadUrl,
			method: 'GET',
			responseType: 'blob'
		});
    if(response.status === 200) {
      await axios.post('/api/common/guideMapFileDownloadLog', {
        rfrncTblNm: 'TN_GUIDEMAP'
        , ntcMttrMgno: guideMapParams.fileSn
      })
    }

		const link = document.createElement('a');
		link.href = fileDownloadUrl;
		link.setAttribute('donwload', files.tmprFileNm || 'downloaded_file');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} catch(error) {
		alert("파일을 다운로드할 수 없습니다.\n관리자에게 문의해주세요.");
	}
}

onMounted(() => {
    loadSidoData();
})

</script>