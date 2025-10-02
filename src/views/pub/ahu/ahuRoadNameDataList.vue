<template>
  <CommonBreadcrumb />
  <HeaderTitle title="도로명 정보 조회" />

    <fieldset>
      <legend>도로명 정보 검색</legend>
      <div class="commonContentSearchForm">
        <div class="commonContentSearchForm__type">
          <div class="commonContentSearchForm__loadName">
            <label for="roadName">도로명</label>
            <CustomInputText v-model="inqCndParams.roadNm" class="input" id="roadName" name="keyword"
              placeholder="도로명을 입력해주세요" title="도로명을 입력해주세요" />
          </div>

          <div class="commonContentSearchForm__loadCode">
            <label for="lgvCdRoadNmCd">도로명코드</label>
            <CustomInputText v-model="inqCndParams.lgvCdRoadNmCd" class="input" id="lgvCdRoadNmCd" name="lgvCdRoadNmCd"
              placeholder="도로명코드를 입력해주세요" title="도로명코드를 입력해주세요" :maxLength="12" />
            <div class="commonContentSearchForm__expansion">
              <Checkbox v-model="inqCndParams.expansionCheck" inputId="expansionCheck" name="expansionCheck" 
                title="확장검색" :binary="true" />
              <label for="expansionCheck">확장검색</label>
            </div>
          </div>
        </div>

        <div class="commonContentSearchForm__type">
          <div class="commonContentSearchForm__mapSelect">
            <label for="map">지역선택</label>
            <CustomDropdown inputId="sidoList" :options="itemsCity" optionLabel="label" optionValue="value"
              v-model="inqCndParams.ctpvCd" @change="loadSidoData" title="시/도 선택" placeholder="시/도 선택" />
            <CustomDropdown inputId="sggList" :options="itemsCounty" optionLabel="label" optionValue="value"
              v-model="inqCndParams.lgvReplcCd" @change="loadSggData" title="시/군/구 선택" placeholder="시/군/구 선택" />
            <CustomDropdown inputId="emdList" :options="itemsEmd" optionLabel="label" optionValue="value"
              v-model="inqCndParams.emdCd" title="읍/면/동 선택" placeholder="읍/면/동 선택" />
          </div>
        </div>

        <div class="commonContentSearchForm__type">
          <div class="commonContentSearchForm__abolition">
            <label for="useYn" class="label">폐지구분</label>
            <div class="commonContentSearchForm__radio" v-for="checkList in categories" :key="checkList.key">
              <RadioButton v-model="inqCndParams.useYn" inputId="useYn" name="checkList" 
                :value="checkList.value" id="useYn" input="checkList.value"/>
              <div for="useYn" >{{ checkList.label }}</div>
            </div>
          </div>

          <div class="commonContentSearchForm__search">
            <Button class="commonContentSearchForm__searchButton" title="검색하기" @click.prevent="onPaging({ page: 0 })"
              @keydown.enter="fnSrch">
              <i class="bi bi-search" /> 검색
            </Button>
          </div>
        </div>
      </div>
    </fieldset>
  <div class="fileDownload">
    <Button class="commonButton__button" title="엑셀다운로드" @click.prevent="fnExcelDwnld">
      <span class="commonButton__text">엑셀다운로드</span>
      <i class="bi bi-download" />
    </Button>
    <Button class="commonButton__button" title="전국 도로명 부여사유 엑셀다운로드" @click.prevent="histFileDownload">
      <span class="commonButton__text">전국 도로명 부여사유 엑셀다운로드</span>
      <i class="bi bi-download" />
    </Button>
  </div>

  <div class="dataTable__wrap">
    <div class="dataTable__caption">
      <p class="dataTable__tip">※ 도로명 또는 도로구간보기 버튼을 클릭하시면 도로명에 대한 정보(기점, 종점,고시일, 길이, 부여사유 등)을 확인하실 수 있습니다.</p>
      <div class="dataTable__count">
        총 <strong class="bold">{{ pageInfo.totalRecords.toLocaleString() }}</strong> 건
        (도로명수 : <strong class="bold">{{ pageTotalCount }}</strong>)
      </div>
    </div>
    <DataTable class="tableStyle01" :value="searchDataList" ref="dataTableRef" :showLoader="true" :loading="lazyLoading">
      <template #loading>
        <DataTableLoadingComponent />
      </template>
      <ColumnGroup type="header">
		<Row>
			<Column style="width:240px;" header="도로명코드" :colspan="2" />
			<Column style="width:227px;" header="도로명" :rowspan="2" />
			<Column style="width:227px;" header="로마자표기" :rowspan="2" />
			<Column style="width:131px;" header="시/도" :rowspan="2" />
			<Column style="width:131px;" header="시/군/구" :rowspan="2" />
			<Column style="width:235px;" header="읍/면/동" :colspan="4" />
		</Row>
		
		<Row>
			<Column style="width:120px;" header="시군구번호" />
			<Column style="width:120px;" class="line" header="도로명번호" />
			<Column style="width:71px;" header="일련번호" />
			<Column style="width:47px;" class="line" header="구분" />
			<Column style="width:54px;" class="line" header="코드" />
			<Column style="width:95px;" class="line" header="명" />
		</Row>
      </ColumnGroup>
      <Column field="lgvCd">
        <template #body="slotProps">
          {{ slotProps.data.lgvCd }}
        </template>
      </Column>
      <Column field="roadnumber">
        <template #body="slotProps">
          {{ slotProps.data.roadNmCd }}
        </template>
      </Column>
      <Column field="roadname">
        <template #body="slotProps">
          <Button v-if="slotProps.data.useYn === 'Y'"
                  class="alignLink"
                  @click.prevent="fnRoadInfo(slotProps.data)">
            <span class="text">
              {{ slotProps.data.roadNm }}
            </span>
            <i aria-hidden="true" class="bi bi-geo-alt-fill" />
          </Button>
          <span class="text" v-else>
              {{ slotProps.data.roadNm }}
            </span>
        </template>
      </Column>
      <Column field="roman">
        <template #body="slotProps">
          {{ slotProps.data.engrdNm }}
        </template>
      </Column>
      <Column field="cityname">
        <template #body="slotProps">
          {{ slotProps.data.ctpvNm }}
        </template>
      </Column>
      <Column field="county">
        <template #body="slotProps">
          {{ slotProps.data.sggNm }}
        </template>
      </Column>
      <Column field="serialnumber">
        <template #body="slotProps">
          {{ slotProps.data.emdSn }}
        </template>
      </Column>
      <Column field="classfication">
        <template #body="slotProps">
          {{ slotProps.data.emdSeCd }}
        </template>
      </Column>
      <Column field="code">
        <template #body="slotProps">
          {{ slotProps.data.emdCd }}
        </template>
      </Column>
      <Column field="name">
        <template #body="slotProps">
          {{ slotProps.data.emdNm }}
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
    <ContentTitle  :title="`${roadDetail.siNm} ${roadDetail.sggNm} ${roadDetail.rdNm}`" fontSize="30px" marginTop="0" mobileFontSize="20px"/>
    <div class="commonTable__wrap">
      <table class="commonTable__detail">
        <caption>도로명 테이블입니다. 항목은 기점, 종점, 고시일, 효력발생일, 길이가 있습니다.</caption>
        <colgroup>
          <col style="width:30%" />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>기점</th>
            <td>{{ roadDetail.srtCn }}</td>
          </tr>
          <tr>
            <th>종점</th>
            <td>{{ roadDetail.endCn }}</td>
          </tr>
          <tr>
            <th>고시일</th>
            <td>{{ roadDetail.noticeYmd }}</td>
          </tr>
          <tr>
            <th>효력발생일</th>
            <td>{{ roadDetail.effectDe }}</td>
          </tr>
          <tr>
            <th>길이(M)</th>
            <td>{{ roadDetail.roadLt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="commonTable__tip"><span class="commonColor01"><span class="commonBullet">※</span> 도로명 부여사유</span> 
        {{roadDetail.grantDe }} </p>
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
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Button from 'primevue/button';
import RadioButton from "primevue/radiobutton";
import Checkbox from "primevue/checkbox";
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import CustomInputText from '@/components/input_text/CustomInputText.vue';

import HeaderTitle from '@/components/title/HeaderTitle.vue';
import { sidoDataLoad, sggDataLoad, emdDataLoad } from '@/common/jusoCommon.ts'   //[공용컴포넌트]시도 데이터, 시군구 데이터 
import axios from 'axios';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import CustomPaginator from '@/components/paginator/CustomPaginator.vue'
import Dialog from 'primevue/dialog';
import ContentTitle from '@components/title/ContentTitle.vue';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import DataTableLoadingComponent from "@/components/common/DataTableLoadingComponent.vue";
import {useLoadingStore} from "@/stores/ui.loading";

const loadingStore = useLoadingStore();

// datatable loading
const lazyLoading = ref(false);

//지역선택 드롭다운 변수
const itemsCity = ref([]);
const itemsCounty = ref([]);
const itemsEmd = ref([]);

//라디오버튼 폐지 구분 드롭다운 변수
const categories = ref([
	{ label: '현존', value: "Y" },
	{ label: '폐지', value: "N" }
]);

//목록 조회결과
const searchDataList = ref([]);

//전국 도로명 부여사유 다운로드용 파라미터
const histData = ref({});

//도로명 정보 조회결과
const roadDetailInfo = {
	siNm : ''
	,sggNm : '' 
	,rdNm : '' 
	,srtCn : '' 
	,endCn : '' 
	,noticeYmd : '' 
	,effectDe : '' 
	,roadLt : '' 
	,grantDe : '' 
};

//도로명 정보 조회결과
const roadDetail = reactive({});

//게시물 중복제거 갯수
const pageTotalCount = ref();

//테이블
const dataTableRef = ref(null);

//검색영역
const header = ref('');

//팝업 호출여부
const dialogVisible = ref(false);

//검색조건 초기화변수
const inqCndParams = reactive({
	roadNm: ''
	, ctpvCd: '110001'
	, lgvReplcCd: ''
	, emdCd: ''
	, useYn: 'Y'
	, expansionCheck: true
	, lgvCdRoadNmCd: ''
	, roadNmCount: ''
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
		property: ''                                 		// 정렬할 속성 이름
		, direction: ''                                		// 정렬 방향 (ASC 또는 DESC)
	}]
});

//엑셀용 파라미터
const inqCndParamsOrigin = reactive({});

//도로구간 보기 팝업 데이터 
const roadSectionData = ref('');

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
		
		//읍면동 코드 초기화
		inqCndParams.emdCd = '';
		loadEmdData();
	} catch (error) {
		console.error('error =>', error);
	}
}

//읍면동 데이터 (jusoCommon.ts)
const loadEmdData = async () => {
	try {
		const data = await emdDataLoad(inqCndParams.lgvReplcCd);
		itemsEmd.value = [{ label: '읍/면/동 선택', value: null }, ...data];
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

//validation
function validate(value){
	var specialChars =/[~!#$^@%&*+=|:;?"<,>']/;
	var tmpValue = value.split(specialChars).join("");
	
	if (value != tmpValue) {
		alert("!,@,#,$,%와 같은 특수문자는 검색조건으로 사용할 수 없습니다.");
	}
	
	return tmpValue; 
}

//도로명코드 유효성체크(숫자만)
function isChkNumber(){
	var regNumber = /^[0-9]*$/;
	if(!regNumber.test(inqCndParams.lgvCdRoadNmCd)){
		alert("도로명코드는 숫자만 입력 가능합니다.");
		return false;
	}
	return true;
 }

//검색
const fnSrch = async () => {
	if (inqCndParams.ctpvCd == '' || inqCndParams.ctpvCd == null) {
		alert('도로명, 도로명코드, 시/도 세가지 조건 중 한가지 이상을 필수로 입력해 주시기 바랍니다.');
		return false;
	}
	
	inqCndParams.roadNm = validate(inqCndParams.roadNm);
	inqCndParams.lgvCdRoadNmCd = validate(inqCndParams.lgvCdRoadNmCd);
	
	if(!isChkNumber()){
		return;
	}
	
	lazyLoading.value = true;
	axios.post('/api/ahu/selectRoadList', inqCndParams)
		.then((response) => {
			const data = response.data.results;
			if (data.roadList.content.length > 0) {
				searchDataList.value = data.roadList.content;
				histData.value = data.histData;
				pageInfo.totalRecords = data.roadList.totalElements;
				pageInfo.currentRecords = data.roadList.numberOfElements;
				pageInfo.totalPages = data.roadList.totalPages;
				pageTotalCount.value = data.count.toLocaleString();
				Object.assign(inqCndParamsOrigin, inqCndParams);
			} else {
				searchDataList.value = data.roadList.content;
				pageInfo.totalRecords = 0;
				pageInfo.currentRecords = 0;
				pageInfo.totalPages = 0;
				pageTotalCount.value = 0;
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
		axios.post('/api/ahu/selectRoadListExcel', inqCndParamsOrigin).then(response => {
			resolve(response);
		})
		.catch(error => {
			reject(error);
		})
	})
}

//조회목록 엑셀 다운로드
const fnExcelDwnld = async () => {
	
	if (pageInfo.totalRecords > 10000) {
		alert("10000건 이하만 지원합니다.");
		return;
	}
	
	loadingStore.show();
	const excelDataList = ref(null);
	
	await apiDtlSrch().then(response => {
	    excelDataList.value = response.data.results;
	})
    .catch(error => {
    	console.error("error =>", error);
    })

	let header = {
		"lgvCd": "시군구"
		, "roadNmCd": "도로명번호"
    	, "roadNm": "도로명"
    	, "engrdNm": "로마자표기"
    	, "emdSn": "읍면동일련번호"
    	, "ctpvNm": "시도명"
    	, "sggNm": "시군구명"
    	, "emdSeCd": "읍면동구분"
    	, "emdCd": "읍면동코드"
    	, "emdNm": "읍면동명"
	}

	let param = {
		"fileNm": "도로명정보조회"
		, "headerEngTitle": header
		, "dataList": excelDataList.value
    	//특수하게 표기하는 경우에만 직접 만들어서 전송, 아닐경우는 빼고 전송
    	, "strTotalCount": "총" + pageInfo.totalRecords.toLocaleString() + " (도로명수 : " + pageTotalCount.value + ")" 
	}

	axios.post('/api/jusoCommon/cmn-excel-download', param, { responseType: 'blob' })
		.then(response => {
			const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = '도로명정보조회.xlsx';
			
			document.body.appendChild(link);
			link.click();
			
			URL.revokeObjectURL(link.href);
			document.body.removeChild(link);
		})
		.catch(error => {
      		console.error("error =>", error);
      		alert("파일을 다운로드할 수 없습니다.\n관리자에게 문의해주세요.");
	    })
		.finally(() => {
			loadingStore.hide();
		})
}

//도로명 부여사유 다운로드
const histFileDownload = async () => {
	const innorixDownloadUrl = `/api/innorix/download`
	const fileMgno = histData.value.fileMgno;
	const fileSn = histData.value.fileSn;
	const fileDownloadUrl = `${innorixDownloadUrl}/${fileMgno}/${fileSn}`;
	loadingStore.show();
	try {
		const response = await axios({
			url: fileDownloadUrl,
			method: 'GET',
			responseType: 'blob'
		});
		const link = document.createElement('a');
		link.href = fileDownloadUrl;
		link.setAttribute('donwload', histData.value.tmprFileNm || 'downloaded_file');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} catch (error) {
		console.error("error =>", error);
		alert("파일을 다운로드할 수 없습니다.\n관리자에게 문의해주세요.");
	}
	loadingStore.hide();
}

//팝업 고시일, 효력발생일 포맷
const formatData = (dateStr) => {
	if (dateStr && dateStr.length === 8) {
		return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
	}
	return dateStr;
}

//도로명 정보보기 조회
const fnRoadInfo = async (item) => {
	await axios.get('/api/ahs/selectRoadLocation/' + item.lgvCd + item.roadNmCd)
		.then((response) => {
			if (response.data.results.list.length > 0) {
				Object.assign(roadDetail, response.data.results.list[0]);
				roadDetail.noticeYmd = formatData(roadDetail.noticeYmd);
				roadDetail.effectDe = formatData(roadDetail.effectDe);
				roadDetail.roadLt = roadDetail.roadLt.toLocaleString();
				dialogVisible.value = true;
				roadSectionData.value = item;
			} else {
				alert("조회된 데이터가 없습니다.");
				return;
			}
		})
		.catch(error => {
			console.error("error =>", error);
		})
}
//도로구간 보기(새창)
const fnRoadSectionMap = () => {
	let url = '/map/totalMapView?';

	//도로구간 데이터 (도로명코드, 도로명, 시군구코드)
	const roadNmCd = roadSectionData.value.roadNmCd;
	const roadNm = roadSectionData.value.roadNm;
	const lgvCd = roadSectionData.value.lgvCd;

	if (roadNmCd && roadNm && lgvCd) {
		//새창 너비 조정
		const width = window.innerWidth;
		const height = window.innerHeight;
		url += `searchType=roadNm&rdCd=${roadNmCd}&rdNm=${roadNm}&sigCd=${lgvCd}`;
		window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
	} else {
		alert("데이터가 없습니다.");
		return false;
	}
}

//팝업 종료
const closeDialog = () => {
	Object.assign(roadDetail, roadDetailInfo);
	dialogVisible.value = false;
}

const updateCaption = () => {
	const width = window.innerWidth;
	header.value = width > 900 ? '지자체 홍보자료실 리스트로 NO, 제목, 유형, 지자체, 등록일, 조회수 정보를 제공합니다' : '지자체 홍보자료실 리스트로 제목, 등록일 정보를 제공합니다';


	const dataTableEl = dataTableRef.value.$el.querySelector('.p-datatable-table');
	if (dataTableEl) {
		const existingCaption = dataTableEl.querySelector('caption');
		if (existingCaption) {
			existingCaption.remove();
		}

    const caption = document.createElement('caption');
    caption.textContent = header.value
    dataTableEl.prepend(caption);
	}
}

onMounted( async() => {
	await loadSidoData();
	
	//최초 조회시 강남구로 설정
	inqCndParams.lgvReplcCd = '11680';
	fnSrch(); 

	//th에 scope달기
	const headers = document.querySelectorAll('th[role="columnheader"]');

	headers.forEach(header => {
		header.setAttribute('scope', 'col');
	})

	categories.value.forEach((category) => {
		const checkboxBox = document.querySelector(`#${category.key}`);
		if (checkboxBox && category.title) {
			checkboxBox.setAttribute('title', category.title);
		}
	})

	//캡션 추가
	updateCaption();
	window.addEventListener('resize', updateCaption);
})

onBeforeUnmount(() => {
	//캡션 제거
	window.removeEventListener('resize', updateCaption);
})
</script>