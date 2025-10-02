<template>
	<CommonBreadcrumb />
    <HeaderTitle title="사물 주소 조회" />

    <form @submit.prevent="AddressObject">
        <fieldset>
            <legend>도로명 정보 검색</legend>
            <div class="commonContentSearchForm">

                <div class="commonContentSearchForm__type">
                    <div class="commonContentSearchForm__mapSelect">
                        <label for="map">지역선택</label>
                        <CustomDropdown inputId="sidoList" :options="itemsCity" optionLabel="label" optionValue="value"
                            v-model="inqCndParams.ctpvCd" @change="loadSidoData" title="시/도 선택" placeholder="시/도 선택" />
                        <CustomDropdown inputId="sggList" :options="itemsCounty" optionLabel="label" optionValue="value"
                            v-model="inqCndParams.lgvReplcCd" @change="loadSggData" title="시/군/구 선택" placeholder="시/군/구 선택" />
                    </div>
                </div>

                <div class="commonContentSearchForm__type">
                    <div class="commonContentSearchForm__item02">
                        <label for="objectType">사물유형</label>
                        <CustomDropdown inputId="objectType" :options="objCdList" optionLabel="label" optionValue="value" v-model="inqCndParams.thngTypeCd" placeholder="선택"
                            title="사물유형 선택해주세요." />
                    </div>

                    <div class="commonContentSearchForm__item02">
                        <label for="thngNm">사물명</label>
                        <CustomInputText id="thngNm" v-model="inqCndParams.thngNm" class="input" @keydown.enter="fnSrch"
                            placeholder="사물명 입력" title="사물명 입력해주세요" />
                    </div>
                </div>
                <div class="commonContentSearchForm__type">
                    <div class="commonContentSearchForm__item02">
                        <label for="roadNmAddr">사물주소</label>
                        <CustomInputText id="roadNmAddr" v-model="inqCndParams.roadNmAddr" class="input" @keydown.enter="fnSrch"
                            placeholder="사물주소 입력" title="사물주소 입력해주세요" />
                    </div>
                </div>

                <div class="commonContentSearchForm__search">
                    <Button class="commonContentSearchForm__searchButton" title="검색하기" @click.prevent="onPaging({ page: 0 })"
                        @keydown.enter="fnSrch">
                        <i aria-hidden="true" class="bi bi-search" /> 검색
                    </Button>
                </div>

            </div>
        </fieldset>
    </form>

    <div class="fileDownload">
        <Button class="commonButton__button" title="엑셀다운로드"
            @click.prevent="fnExcelDwnld"><!-- @click.prevent="fnExcelDwnld"-->
            <span class="commonButton__text">엑셀다운로드</span>
            <i class="bi bi-download" />
        </Button>
    </div>

    <div class="dataTable__wrap">
      <div class="dataTable__caption">
          <p class="dataTable__tip"></p>
          <div class="dataTable__count">
              총 <strong class="bold">{{ pageInfo.totalRecords.toLocaleString() }}</strong> 건
          </div>
      </div>
      <DataTable class="tableStyle01 noneLine" :value="searchDataList" ref="dataTableRef" :loading="lazyLoading">
			<template #loading>
				<DataTableLoadingComponent />
			</template>
            <Column header="순번" field="number">
                <template #body="slotProps">
                    {{ slotProps.data.rnum }}
                </template>
            </Column>
            <Column header="사물유형" field="objecttype">
                <template #body="slotProps">
                    {{ slotProps.data.thngTypeCdNm }}
                </template>
            </Column>
            <Column header="사물명" field="objectname">
                <template #body="slotProps">
                    {{ slotProps.data.thngNm }}
                </template>
            </Column>
            <Column header="사물주소" field="objectaddress">
                <template #body="slotProps">
                    <a href="#none" class="alignLink" @click.prevent="fnRoadSectionMap(slotProps.data)">
                        <span class="text">
                            {{ slotProps.data.roadNmAddr }}
                            <i aria-hidden="true" class="bi bi-geo-alt-fill" />
                        </span>
                    </a>
                </template>
            </Column>
            <Column header="시/도" field="cityname">
                <template #body="slotProps">
                    {{ slotProps.data.kcpNm }}
                </template>
            </Column>
            <Column header="시/군/구" field="county">
                <template #body="slotProps">
                    {{ slotProps.data.kornSggNm }}
                </template>
            </Column>
            <template #empty>
                <span class="centerHover">
                    검색결과가 없습니다.
                </span>
            </template>
        </DataTable>
    </div>

    <!-- 목록 -->
    <Panel class="section hasTable noHeader">
        <!-- tableArea -->
        <TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
        <!-- //tableArea -->
    </Panel>
    <!-- //목록 -->
</template>
<script setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import $common from '@/common/common';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import RadioButton from "primevue/radiobutton";
import Checkbox from "primevue/checkbox";
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import CustomInputText from '@/components/input_text/CustomInputText.vue';
import CustomPaginator from '@/components/paginator/CustomPaginator.vue';
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import { sidoDataLoad, sggDataLoad, emdDataLoad } from '@/common/jusoCommon.ts'   //[공용컴포넌트]시도 데이터, 시군구 데이터 
import axios from 'axios';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import {useLoadingStore} from "@/stores/ui.loading";
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import DataTableLoadingComponent from "@/components/common/DataTableLoadingComponent.vue";

//datatable loading
const lazyLoading = ref(false);

const loadingStore = useLoadingStore();

//지역선택 드롭다운 변수
const itemsCity = ref([]);
const itemsCounty = ref([]);

//사물주소 코드 목록
const objCdList = ref([]);

//조회결과
const searchDataList = ref([]);

//테이블
const dataTableRef = ref(null);

//검색조건 초기화변수
const inqCndParams = reactive({
    ctpvCd: ''
    , lgvCd: ''
    , lgvReplcCd: ''
    , thngTypeCd: ''
    , roadNmAddr: ''
    , thngNm: ''
    , pageable: {
        page: 0,
        size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE),
    }
});

//페이징변수
const pageInfo = reactive({
	first: 0
	, totalRecords: 0
	, currentRecords: 0
	, totalPages: 0
	, page: 0												// 요청한 페이지 번호 (zero based)
	, size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE)	// 페이지당 항목 수
	, orders: [{
		property: ''                               			// 정렬할 속성 이름
		, direction: ''                                		// 정렬 방향 (ASC 또는 DESC)
	}]
});

//엑셀용 파라미터
const inqCndParamsOrigin = reactive({});

//시도 데이터 (jusoCommon.ts)
const loadSidoData = async () => {
    try {
        const data = await sidoDataLoad();
        itemsCity.value = [{ label: '시/도 선택', value: null }, ...data];
        
        //시군구 코드 초기화
        inqCndParams.lgvReplcCd = '';
        
        loadSggData();
    } catch (error) {
		console.error('error =>', error);
    }
}

//시군구 데이터 (jusoCommon.ts)
const loadSggData = async () => {
    try {
        const data = await sggDataLoad(inqCndParams.ctpvCd);
        itemsCounty.value = [{ label: '시/군/구 선택', value: null }, ...data];
    } catch (error) {
		console.error('error =>', error);
    }
}

const getObjCdList = async () => {
    axios.get('/api/ahu/selectObjCdList')
	    .then((response) => {
	    	objCdList.value = response.data.results.map((item, index) => {
	    		return { label : item.CD_NM, value : item.CD_ID }
	    	})
	    })
	    .catch(error => {
			console.error("error =>", error);
	    })
}

//페이징 버튼 클릭
const onPaging = params => {
	pageInfo.first = params.first !== undefined ? params.first : 0;
	pageInfo.page = params.page ? params.page + 1 : 1;
	pageInfo.size = params.rows ? params.rows : pageInfo.size;
	
 	if ((params.page != 0 || params.first != undefined) && inqCndParamsOrigin != null) {
		Object.assign(inqCndParams, inqCndParamsOrigin);
	}

	//post 방식으로 전달시 0페이지부터 조회하도록 -1을 해줘야함.
	inqCndParams.pageable.page = pageInfo.page - 1;
	inqCndParams.pageable.size = pageInfo.size;

	fnSrch();
}

//검색
const fnSrch = () => {
    lazyLoading.value = true;
    axios.post('/api/ahu/selectObjectAddrList', inqCndParams)
	    .then((response) => {
	        const data = response.data;
	        if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
	            searchDataList.value = data.results.content;
	            pageInfo.totalRecords = data.results.totalElements;
	            pageInfo.currentRecords = data.results.numberOfElements;
	            pageInfo.totalPages = data.results.totalPages;
	            Object.assign(inqCndParamsOrigin, inqCndParams);
	        } else {
	            searchDataList.value = data.results.content;
	            pageInfo.totalRecords = 0;
	            pageInfo.currentRecords = 0;
	            pageInfo.totalPages = 0;
	        }
	    })
	    .catch(error => {
			console.error("error =>", error);
	    }).finally(() => {
	    	lazyLoading.value = false;
    	});
}

//엑셀 다운로드용 조회
const apiDtlSrch = () => {
    return new Promise((resolve, reject) => {
        axios.post('/api/ahu/selectObjectAddrListExcel', inqCndParamsOrigin).then(response => {
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    })
}

//엑셀 다운로드
const fnExcelDwnld = async () => {
	loadingStore.show();
    const excelDataList = ref(null);
    
    await apiDtlSrch().then(response => {
        excelDataList.value = response.data.results;
    })
    .catch(error => {
    	console.error("error =>", error);
    })

    let header = {
        "rnum": "순번"
        , "thngTypeCd": "사물유형"
        , "thngNm": "사물명"
        , "roadNmAddr": "사물주소"
        , "kcpNm": "시/도"
        , "kornSggNm": "시/군/구"
    }

    let param = {
        "fileNm": "사물주소 조회"
        , "headerEngTitle": header
        , "dataList": excelDataList.value
    }

    axios.post('/api/jusoCommon/cmn-excel-download', param, { responseType: 'blob' })
        .then(response => {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '사물주소 조회.xlsx';
            link.click();
        })
        .catch(error => {
			console.error("error =>", error);
			alert("파일을 다운로드할 수 없습니다.\n관리자에게 문의해주세요.");
        })
		.finally(() => {
			loadingStore.hide();
		})
}

//도로구간 보기(새창)
const fnRoadSectionMap = (data) => {
    let url = '/map/totalMapView?';
    url += 'searchType=aot&thngMgno=' + data.thngMgno + '&aotNm=' + data.addrNm;
    const width = window.innerWidth;
    const height = window.innerHeight;
    window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
}

onMounted(() => {
	getObjCdList();
    loadSidoData();
    fnSrch();
    //th에 scope달기
    const headers = document.querySelectorAll('th[role="columnheader"]');
    headers.forEach(header => {
        header.setAttribute('scope', 'col');
    })

    //캡션 추가
    const dataTableEl = dataTableRef.value.$el.querySelector('.p-datatable-table');
    if (dataTableEl) {
        const caption = document.createElement('caption');
        caption.textContent = '사물 주소 조회 리스트로, 순선, 사물유형, 사물명, 사물주소, 시/도, 시/군/구를 제공합니다.';
        dataTableEl.prepend(caption);
    }
})
</script>