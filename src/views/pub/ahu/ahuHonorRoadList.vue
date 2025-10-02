<template>
	<CommonBreadcrumb />
	<HeaderTitle title="명예도로 조회" />

  <form @submit.prevent="AddressObject">
    <fieldset>
      <legend>명예도로 검색</legend>
      <div class="commonContentSearchForm">
        <div class="commonContentSearchForm__type">
          <div class="commonContentSearchForm__mapSelect">
            <label for="map">지역선택</label>
            <CustomDropdown inputId="sidoList" :options="itemsCity" optionLabel="label" optionValue="value" v-model="inqCndParams.ctpvCd" @change="loadSidoData" title="시/도 선택" placeholder="시/도 선택" />
			<CustomDropdown inputId="sggList" :options="itemsCounty" optionLabel="label" optionValue="value" v-model="inqCndParams.lgvReplcCd" @change="loadSggData" title="시/군/구 선택" placeholder="시/군/구 선택" />
          </div>
        </div>
        <div class="commonContentSearchForm__type">
          <div class="commonContentSearchForm__item02">
            <label for="khnrdNm">명예도로명</label>
            <CustomInputText inputId="khnrdNm" v-model="inqCndParams.khnrdNm" class="input" id="khnrdNm" @keydown.enter="fnSrch"
              placeholder="명예도로명 입력" title="명예도로 입력해주세요"/>
          </div>
          
        </div>

        <div class="commonContentSearchForm__search">
          <Button class="contentSearchForm__searchButton" title="검색하기" @click.prevent="onPaging({ page: 0 })">
            <i class="bi bi-search" /> 검색
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
	   <Column header="시/도" field="ctpvNm">
        <template #body="slotProps">
          {{ slotProps.data.ctpvNm }}
        </template>
      </Column>
      <Column header="시/군/구" field="sggNm">
        <template #body="slotProps">
          {{ slotProps.data.sggNm }}
        </template>
      </Column>
      <Column header="명예도로명" field="khnrdNm">
        <template #body="slotProps">
          <a href="#" class="alignLink" @click.prevent="detailDataView(slotProps.data)"> 
            <span class="text">
              {{ slotProps.data.khnrdNm }}
              <i class="bi bi-geo-alt-fill" />
            </span>
          </a>
        </template>
      </Column>
      <Column header="영문명" field="ehnrdNm">
        <template #body="slotProps">
          {{ slotProps.data.ehnrdNm }}
        </template>
      </Column>
      <Column header="부여일자" field="grntYmd">
        <template #body="slotProps">
          {{ slotProps.data.grntYmd }}
        </template>
      </Column>

      <template #empty>
        <span class="centerHover">
          검색결과가 없습니다.
        </span>
      </template>
    </DataTable>
  </div>
  
  <Dialog class="commonDialog" id="dlg" :visible="dialogVisible" modal :closable="false"
    :aria-controls="dialogVisible ? 'dlg' : null" :aria-expanded="dialogVisible ? true : false">
    <template #header>
      <Button id="dialogFocus" class="dialogCloseButton" @click="closeDialog">
        <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
      </Button>
    </template>
	<ContentTitle :title="roadInfoModalData.honorRoadNm" fontSize="30px" marginTop="0" mobileFontSize="20px" />    
    <div class="commonTable__wrap">
      <table class="commonTable__detail">
        <colgroup>
          <col style="width:30%" />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>부여사유</th>
            <td>{{ roadInfoModalData.grntRsn }}</td>
          </tr>
          <tr>
            <th>관련도로</th>
            <td>{{ roadInfoModalData.roadNm }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table__alignCenter">
      <Button class="table__button" @click="fnRoadSectionMap()">도로구간 보기</Button>
    </div>
  </Dialog>

  <!-- 목록 -->
  <Panel class="section hasTable noHeader">
    <!-- tableArea -->
    <TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
    <!-- //tableArea -->
  </Panel>
  <!-- //목록 -->
</template>
<script setup>
import { ref, onMounted, computed, watch, reactive } from "vue";
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
import axios from 'axios';
import { sidoDataLoad, sggDataLoad } from '@/common/jusoCommon.ts'   //[공용컴포넌트]시도 데이터, 시군구 데이터 
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import Dialog from 'primevue/dialog';
import ContentTitle from '@/components/title/ContentTitle.vue';
import { useRouter, useRoute } from 'vue-router';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import DataTableLoadingComponent from "@/components/common/DataTableLoadingComponent.vue";
import {useLoadingStore} from "@/stores/ui.loading";

const loadingStore = useLoadingStore();

// datatable loading
const lazyLoading = ref(false);

//라우터
const router = useRouter();
const route = useRoute();

//지역선택 드롭다운 변수
const itemsCity = ref([]);
const itemsCounty = ref([]);

//검색조건 초기화변수
const inqCndParams = reactive({
	ctpvCd: ''
	, lgvCd: ''
	, khnrdNm:'' 
	, hnrdMgno: ''
	, lgvReplcCd: ''
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

//목록 조회결과
const searchDataList = ref([]);

//도로구간 보기 새창 데이터 
const roadSectionModalData = ref('');

//명예도로 정보 팝업 데이터 
const roadInfoModalData = reactive({});

//팝업 호출여부
const dialogVisible = ref(false);

//테이블
const dataTableRef = ref(null);

//엑셀용 파라미터
const inqCndParamsOrigin = reactive({});

//시도 데이터 (jusoCommon.ts)
const loadSidoData = async () => {
    try {
		const data = await sidoDataLoad();
        itemsCity.value = [{ label: '시/도 선택', value: '' }, ...data];
        
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
        itemsCounty.value = [{ label: '시/군/구 선택', value: '' }, ...data];
    } catch (error) {
		console.error('error =>', error);
    }
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
	axios.post('/api/ahu/selectHonorRoadList', inqCndParams)
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
		})
	    .finally(() =>{
			lazyLoading.value = false;
	    });
}

//엑셀 다운로드용 조회
const apiDtlSrch = () => {
	return new Promise((resolve, reject) => {
		axios.post('/api/ahu/selectHonorRoadListExcel', inqCndParamsOrigin).then(response => {
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
		console.error("error : ", error);
    })

	let header = {
		"ctpvNm": "시/도"
		, "sggNm": "시/군/구"
		, "khnrdNm": "명예도로명"
		, "ehnrdNm": "영문명"
		, "grntYmd": "부여일자"
	}

	let param = {
		"fileNm": "명예도로 조회"
		, "headerEngTitle": header
		, "dataList": excelDataList.value
	}

	axios.post('/api/jusoCommon/cmn-excel-download', param, { responseType: 'blob' })
		.then(response => {
			const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = '명예도로 조회.xlsx';
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

//상세조회(팝업)
function detailDataView(data) {
	axios.get('/api/ahu/detailHonorRoad/' + data.hnrdMgno)
		.then(response => {
			//도로구간보기(새창) 데이터 저장
			roadSectionModalData.value = response.data.results;
			
			//명예도로정보(팝업) 데이터 저장
			roadInfoModalData.honorRoadNm = data.ctpvNm + " " + data.sggNm + " " + data.khnrdNm;
			roadInfoModalData.grntRsn = response.data.results.grntRsn;
			roadInfoModalData.roadNm = response.data.results.roadNm;
			roadInfoModalData.hnrdSctnSn = response.data.results.hnrdSctnSn;
			onShowDialog();
	})
	.catch(error => {
		console.error("error =>", error);
	})
}

//도로구간 보기(새창)
const fnRoadSectionMap = () => {
	let url = '/map/totalMapView?';

	//도로구간 데이터 (도로명코드, 도로명, 시군구코드)
	const roadNmCd = roadSectionModalData.value.roadNmCd;
	const khnrdNm = roadSectionModalData.value.khnrdNm;
	const lgvCd = roadSectionModalData.value.lgvCd;
	const hnrdSctnSn = roadSectionModalData.value.hnrdSctnSn;

	if (hnrdSctnSn && lgvCd) {
		//새창 너비 조정
		const width = window.innerWidth;
		const height = window.innerHeight;
		url += `searchType=honorRoad&rdNm=${khnrdNm}&sigCd=${lgvCd}&honRoaSn=${hnrdSctnSn}`;
		window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
	} else {
		alert("데이터가 없습니다.");
		return false;
	}
}

const onShowDialog = () => {
	dialogVisible.value = true;
}

const closeDialog = () => {
	dialogVisible.value = false;
}

onMounted(() => {
	if (route.query) {
		inqCndParams.khnrdNm = route.query.khnrdNm;	
	}
	
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
		caption.textContent = '명예도로 조회 리스트로, 순번, 명예도로, 시/도, 시/군/구를 제공합니다.';
		dataTableEl.prepend(caption);
	}
})
</script>