<template>
	<CommonBreadcrumb />
	<HeaderTitle title="담당자 연락처" />

	<form>
		<fieldset>
			<legend>담당자 연락처</legend>
			<div class="commonContentSearchForm">
				<div class="commonContentSearchForm__type">
					<div class="commonContentSearchForm__mapSelect">
						<label for="map">지역선택</label>
						<CustomDropdown @change="loadSidoData" inputId="city1" :options="itemsCity" v-model="inqCndParams.stdgCtpvCd" title="시/도선택" placeholder="시/도선택" />
						<CustomDropdown inputId="county1" :options="itemsCounty" v-model="inqCndParams.lgvReplcCd" title="시/군/구선택" placeholder="시/군/구선택" />
					</div>
				</div>
				<div class="commonContentSearchForm__search">
					<Button @click="fnSrch()" class="commonContentSearchForm__searchButton" title="검색하기">
						<i aria-hidden="true" class="bi bi-search" /> 검색
					</Button>
				</div>
			</div>
		</fieldset>
	</form>

	<div class="dataTable__wrap">
		<DataTable  class="tableStyle01" :value="searchDataList" ref="dataTableRef" :loading="lazyLoading">
			<template #loading>
				<DataTableLoadingComponent />
			</template>
			<ColumnGroup type="header">
				<Row>
					<Column header="시/도" :rowspan="2" />
					<Column header="시/군/구" :rowspan="2" />
					<Column header="대표전화" :rowspan="2" />
				</Row>
			</ColumnGroup>
			<Column field="ctpKorNm" />
			<Column field="sigKorNm" />
			<Column field="userTelno" />
		</DataTable>
	</div>
	<Panel class="section hasTable noHeader">
		<TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
	</Panel>
</template>
<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import RadioButton from "primevue/radiobutton";
import Checkbox from "primevue/checkbox";
import Dialog from 'primevue/dialog';
import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
import CustomInputText from '@components/input_text/CustomInputText.vue';
import CustomPaginator from '@components/paginator/CustomPaginator.vue';
import HeaderTitle from '@components/title/HeaderTitle.vue';
import ContentTitle from '@components/title/ContentTitle.vue';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import axios from 'axios';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import DataTableLoadingComponent from "@/components/common/DataTableLoadingComponent.vue";
import { sidoDataLoad, sggDataLoad, emdDataLoad } from '@/common/jusoCommon.ts'   //[공용컴포넌트]시도 데이터, 시군구 데이터

//datatable loading
const lazyLoading = ref(false);

//지역선택 드롭다운 변수
const itemsCity = ref([]);
const itemsCounty = ref([]);

const pageTotal = ref();

//검색결과 리스트
const searchDataList = ref([]);

//테이블
const dataTableRef = ref(null);

//시도 데이터 (jusoCommon.ts)
const loadSidoData = async () => {
	try {
		const data = await sidoDataLoad();
		itemsCity.value = [{ label: '시/도 선택', value: '' }, ...data];
		loadSggData();
	} catch (error) {
		console.error("error =>", error);
	}
}

//시군구 데이터 (jusoCommon.ts)
const loadSggData = async () => {
	try {
		if(inqCndParams.stdgCtpvCd) {
			const data = await sggDataLoad(inqCndParams.stdgCtpvCd.value);
			itemsCounty.value = [
		    	{ label: '시/군/구 선택', value: '' }, 
		    	...data.map(item => ({
		    		label: item.label,
		    		value: item.lgvReplcCd
		    	}))
	    	];
		}
	} catch (error) {
		console.error("error =>", error);
	}
}

//검색조건 초기화 변수
const inqCndParams = reactive({
	userNm : "",
	telNum : "",
	stdgCtpvCd : "",
	lgvReplcCd : "",
	searchCn: "",
	searchType:"", 
	userNm: "",
	telNum: "",
	pageable: {
		page: 0,
	    size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE),
	}
});

//페이징 관련 변수
const pageInfo = reactive({
    first: 0
    , totalRecords: 0
    , currentRecords: 0
    , totalPages: 0
    , page: 0											     // 요청한 페이지 번호 (zero based)
    , size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE)	 // 페이지당 항목 수
    , orders: [{
      property: ''                               			 // 정렬할 속성 이름
      , direction: ''                                		 // 정렬 방향 (ASC 또는 DESC)
    }]
});

const onPaging = params => {
	pageInfo.first = params.first !== undefined ? params.first : 0;
	pageInfo.page = params.page ? params.page + 1 : 1;
	pageInfo.size = params.rows ? params.rows : pageInfo.size;
	
	//post 방식으로 전달시 0페이지부터 조회하도록 -1을 해줘야함.
	inqCndParams.pageable.page = pageInfo.page - 1;
	inqCndParams.pageable.size = pageInfo.size;

	fnSrch();
}

const fnSrch = async () => {
	const stdgCtpvCdValue = inqCndParams.stdgCtpvCd?.value ? inqCndParams.stdgCtpvCd.value.slice(0, -4) : '';
	const searchParams = {
			...inqCndParams,
			stdgCtpvCd: stdgCtpvCdValue,
			lgvReplcCd: inqCndParams.lgvReplcCd?.value || ''
	};
	lazyLoading.value = true;
	axios.post('/api/ahh/selectManagerList', searchParams)
		.then((response) => {
			console.log(response);
			const data = response.data;
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				searchDataList.value = data.results.content;
				pageTotal.value = data.results.totalElements;
	            pageInfo.totalRecords = data.results.totalElements;
	            pageInfo.currentRecords = data.results.numberOfElements;
	            pageInfo.totalPages = data.results.totalPages;
			} else {
				searchDataList.value = data.results.content;
				pageTotal.value = data.results.totalElements;
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

onMounted(() => {
	loadSidoData();
	fnSrch();
})

</script>