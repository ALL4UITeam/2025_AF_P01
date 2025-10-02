<template>
	<CommonBreadcrumb />
    <HeaderTitle title="도로명 주소 조회" />

    <form @submit.prevent="postSubmitRoadNameAddress">
        <fieldset>
            <legend>도로명 주소 검색</legend> 
            <div class="commonContentSearchForm">
                <div class="commonContentSearchForm__type">
                    <div class="commonContentSearchForm__item03">
                        <label for="ancmntYmd">고시일자</label>
                        <DatePicker :date="yesterday" v-model="inqCndParams.ancmntYmdDate" @updateDate="(newDate) => updateDate('ancmntYmd', newDate)"
                            v-if="!checkedRef" id="ancmntYmd" inputId="ancmntYmd" placeholder="YYYY-MM-DD" ref="calendarRef"/>
                            
                        <label class="blind" for="ancmntYmdFrom">고시일자</label>
                        <DatePicker :date="yesterday" style="width:100%" v-model="inqCndParams.ancmntYmdFromDate" @updateDate="(newDate) => updateDate('ancmntYmdFrom', newDate)"
                            v-if="checkedRef" id="ancmntYmdFrom" inputId="ancmntYmdFrom" placeholder="YYYY-MM-DD" ref="calendarRefFrom"/>
                            
                        <DatePicker :date="null" v-model="inqCndParams.ancmntYmdToDate" @updateDate="(newDate) => updateDate('ancmntYmdTo', newDate)"
                            v-if="checkedRef" id="ancmntYmdTo" inputId="ancmntYmdTo" placeholder="YYYY-MM-DD" ref="calendarRefTo" />
                            
                        <div class="commonContentSearchForm__expansion">
                            <Checkbox v-model="checkedRef" inputId="extendSrch" name="extendSrch" title="기간검색"
                                :binary="true" />
                            <label for="extendSrch" class="imsi">기간검색</label>
                        </div>
                    </div>

                    <div class="commonContentSearchForm__item04">
                        <label for="category1">구분</label>
                        <CustomDropdown class="formFull" inputId="mvmnRsnCd" :options="itemsType" optionLabel="label" optionValue="value" v-model="inqCndParams.mvmnRsnCd"
                            title="구분 선택" placeholder="선택" />
                    </div>
                </div>

                <div class="commonContentSearchForm__type">
                    <div class="commonContentSearchForm__item03">
                        <label for="city1">시/도</label>
                        <CustomDropdown class="formFull" inputId="sidoList" :options="itemsCity" optionLabel="label" optionValue="value"
                            v-model="inqCndParams.ctpvCd" @change="loadSidoData" title="시/도 선택" placeholder="시/도 선택" />
                    </div>

                    <div class="commonContentSearchForm__item04">
                        <label for="county1">시/군/구</label>
                        <CustomDropdown class="formFull" inputId="sggList" :options="itemsCounty" optionLabel="label" optionValue="value"
                            v-model="inqCndParams.lgvReplcCd" @change="loadSggData" title="시/군/구 선택" placeholder="시/군/구 선택" />
                    </div>
                </div>

                <div class="commonContentSearchForm__type">
                    <div class="commonContentSearchForm__item03">
                        <label for="roadName">도로명</label>
                        <div class="formType">
                            <CustomDropdown class="formType__initial" inputId="roadName" :options="roadItemsList" optionLabel="label" optionValue="value"
                                v-model="chosungParams.startChar" title="초성 선택" placeholder="ㄱ" @change="fetchRoadNames()"/>
                            <CustomDropdown class="formType__selectInput" inputId="chosungNm" :options="chosungData"
                                optionValue="value" v-model="inqCndParams.roadNmCd" title="도로명 선택" placeholder="선택" />
                        </div>
                    </div>

                    <div class="commonContentSearchForm__item04">
                        <label for="bmno">건물번호</label>
                        <div class="formType formType__building">
                            <CustomInputText v-model="inqCndParams.bmno" class="input bmno" id="bmno" name="bmno"
                                placeholder="" title="건물번호의 앞번호 입력해주세요" mode="number"/>
                            <span class="formType__dash">-</span>
                            <label for="bsno" class="blind">건물번호 뒷번호</label>
                            <CustomInputText v-model="inqCndParams.bsno" class="input bsno" id="bsno" name="bsno"
                                placeholder="" title="건물번호의 뒷번호 입력해주세요" />
                        </div>
                    </div>
                </div>
                <div class="commonContentSearchForm__search">
                    <Button class="contentSearchForm__searchButton" title="검색하기" @click.prevent="onPaging({ page: 0 })"
                        @keydown.enter="fnSrch">
                        <i class="bi bi-search" /> 검색
                    </Button>
                </div>

            </div>
        </fieldset>
    </form>

    <div class="fileDownload">
        <Button class="commonButton__button" title="엑셀다운로드" @click.prevent="fnExcelDwnld">
            <span class="commonButton__text">엑셀다운로드</span>
            <i class="bi bi-download" />
        </Button>
    </div>

    <div class="dataTable__wrap">
      <div class="dataTable__caption rightType">
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
            <Column header="도로명" field="roadNm">
                <template #body="slotProps">
                    <Button v-if="slotProps.data.mvmnRsnNm === '신규' || slotProps.data.mvmnRsnNm === '변경'" class="alignLink"
                        :id="'bgImgDetailClose_' +  slotProps.data.roadNmCd" @click.prevent="fnOpenRoadNmAddrMap(slotProps.data)">
                        <!--@click.prevent="fnPop(slotProps.data.lgvCd + slotProps.data.roadNmCd)"  solr 데이터 있을 시 사용 -->
                        <span class="text">
		                    {{ slotProps.data.roadNm }}
                        </span>
                        <i aria-hidden="true" class="bi bi-geo-alt-fill" />
                    </Button>
                </template>
            </Column>
            <Column header="본번" field="bmno">
                <template #body="slotProps">
                    {{ slotProps.data.bmno }}
                </template>
            </Column>
            <Column header="부번" field="bsno">
                <template #body="slotProps">
                    {{ slotProps.data.bsno }}
                </template>
            </Column>
            <Column header="고시일자" field="ancmntYmd">
                <template #body="slotProps">
                    {{ slotProps.data.ancmntYmdTag }}
                </template>
            </Column>
            <Column header="효력발생일" field="tkefYmd">
                <template #body="slotProps">
                    {{ slotProps.data.tkefYmd }}
                </template>
            </Column>
            <Column header="읍/면/동" field="emdNm">
                <template #body="slotProps">
                    {{ slotProps.data.emdNm }}
                </template>
            </Column>
            <Column header="구분" field="mvmnRsnNm">
                <template #body="slotProps">
					{{ slotProps.data.mvmnRsnNm }}
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
import axios from 'axios';
import { sidoDataLoad, sggDataLoad } from '@/common/jusoCommon.ts'   //[공용컴포넌트]시도 데이터, 시군구 데이터 
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import DatePicker from "@/components/datePicker/DatePicker.vue";
import DateUtils from "@/common/dateUtils";
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import DataTableLoadingComponent from "@/components/common/DataTableLoadingComponent.vue";
import {useLoadingStore} from "@/stores/ui.loading";

const loadingStore = useLoadingStore();

//datatable loading
const lazyLoading = ref(false);

//지역선택 드롭다운 변수
const itemsCity = ref([]);
const itemsCounty = ref([]);

//폐지구분 드롭다운 변수
const itemsType = ref([
    { label: '선택', value: '' },
    { label: '신규', value: '31' },
    { label: '변경', value: '34' },
    { label: '폐지', value: '63' },
]);

//도로명 초성 드롭다운 변수
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

//목록 조회결과
const searchDataList = ref([]);

//도로명 리스트 데이터 변수
const chosungData = ref([]);

//달력 날짜 (어제/오늘) DateUtils 사용
const yesterday = DateUtils.getYesterday();

//체크박스 - 기간검색
const checkedRef = ref(null);

//테이블
const dataTableRef = ref(null);

//검색조건 초기화변수
const inqCndParams = reactive({
    kcpNm: ''
    , ancmntYmd: ''
    , ancmntYmdFrom: ''
    , ancmntYmdTo: ''
    , ancmntYmdDate: yesterday
    , mvmnRsnCd: ''
    , ctpvCd: ''
    , lgvReplcCd: ''
    , roadNmCd: ''
    , bmno: ''
    , bsno: ''
    , pageable: {
		page: 0,
        size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE),
    }
});

//도로명 초성검색 변수
const chosungParams = reactive({
    startChar: '가'
});

const calendarRef = ref(null);
const calendarRefFrom = ref(null);
const calendarRefTo = ref(null);

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

//날짜 필드 업데이트 inqCndParams (ancmntYmd, ancmntYmdTo, ancmntYmdFrom )
const updateDate = (field, newDate) => {
	if (newDate) inqCndParams[field] = formatDate(newDate);
};

//스트링을 날짜형식으로 변환
const formatDate = (dateString) => { 
//	return `${dateString.slice(0, 4)}-${dateString.slice(5, 7)}-${dateString.slice(8)}`;
	return new Date(dateString);
};

const formatDateToYyyymmdd = (date) => {
	if (!(date instanceof Date) || isNaN(date)) return '';
	
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`
}

//시도 데이터 (jusoCommon.ts)
const loadSidoData = async () => {
    try {
        const data = await sidoDataLoad();
        itemsCity.value = [{ label: '시/도 선택', value: null }, ...data];
        
        //도로명 초성검색 초기화
        chosungParams.startChar = '가';
        chosungData.value.splice(0);
        
        //시군구 코드 초기화
        inqCndParams.lgvReplcCd = '';
        
        //시군구 코드 검색
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
        inqCndParams.roadNmCd = '';
        fetchRoadNames();
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

//건물 본번,부번 숫자만 체크
function isNum(value, name){
	var inText = value;
	var ret;

	for (var i = 0; i < inText.length; i++) {
		ret = inText.charCodeAt(i);
		if (!((ret > 47) && (ret < 58))) {
			alert(name+'란에는 숫자만 입력하세요');
			return false;
		}
	}
	return true;
}

//검색
const fnSrch = () => {
	
	let ymd = formatDateToYyyymmdd(inqCndParams.ancmntYmdDate);
	let ymdTo = formatDateToYyyymmdd(inqCndParams.ancmntYmdToDate);
	let ymdFrom = formatDateToYyyymmdd(inqCndParams.ancmntYmdFromDate);
	
	if (checkedRef.value) {
		if(!inqCndParams.ancmntYmdFromDate){
			alert("시작날짜를 선택해주세요.");
			calendarRefFrom.value?.$el?.querySelector('input').focus();
			return false;
		}else if(!inqCndParams.ancmntYmdToDate){
			alert("종료날짜를 선택해주세요.");
			calendarRefTo.value?.$el?.querySelector('input').focus();
			return false;
		} 

		if(ymdFrom.replaceAll("-", "") < "20110729") {
			console.log(ymdFrom.replaceAll("-", ""));
			alert("2011년 07월 29일 부터 조회가능합니다.");
			return false;
		}
		if(ymdFrom.replaceAll("-", "") == "20110729"){
			alert("'11. 7. 29 도로명주소 고시정보의 경우 해당일자만 시군구별 검색이 가능합니다.");
			return false;
		}
		if (fnCalcDayMonthCount(ymdFrom, ymdTo) < 1){
			alert("올바른 날짜기간을 선택해주세요.");
			calendarRefTo.value?.$el?.querySelector('input').focus();
			return false;
		}
	    if (ymdFrom > ymdTo) {
	        alert('종료 날짜는 시작 날짜보다 작을 수 없습니다.')
			calendarRefTo.value?.$el?.querySelector('input').focus();
	        return false;
	    }
	    if (fnCalcDayMonthCount(ymdFrom, ymdTo) > 91){
			alert("90일 이내의 기간만 조회가능합니다.");
			calendarRefTo.value?.$el?.querySelector('input').focus();
			return false;
		}
	    if (!inqCndParams.lgvReplcCd) {
	        alert('기간검색의 경우 시군구별 검색이 가능합니다.')
	        return false;
    	}
	} else {
	    if (!ymd && !inqCndParams.ctpvCd) {
	        alert("고시일자를 선택하세요.");
			calendarRef.value?.$el?.querySelector('input').focus();
	        return false;
	    }
		if (!ymd) {
			if (!inqCndParams.ctpvCd) {
				alert("시/도를 선택하세요");
				return false;
			} else if (!inqCndParams.lgvReplcCd && inqCndParams.ctpvCd != "36") {
				alert("시/군/구를 선택하세요");
				return false;
			} else if (!inqCndParams.roadNmCd) {
				alert("도로명을 선택하세요");
				return false;
			}
		} else {
			if(ymd.replaceAll("-", "") < "20110729") {
				alert("2011년 07월 29일 부터 조회가능합니다.");
				return false;
			}
			if(ymd.replaceAll("-", "") == "20110729"){
				if(!inqCndParams.ctpvCd){
					alert("'11. 7. 29 도로명주소 고시정보의 경우 해당일자만 시군구별 검색이 가능합니다.");
					return false;
				}else if(!inqCndParams.lgvReplcCd && !inqCndParams.ctpvCd != "36"){
					alert("'11. 7. 29 도로명주소 고시정보의 경우 해당일자만 시군구별 검색이 가능합니다.");
					return false;
				}
			}
		}
	}
	
	if(inqCndParams.bmno){ 
	    if(!isNum(inqCndParams.bmno, '건물본번')){
			return false;
	    };    
	}
    if(inqCndParams.bsno){ 
	    if(!isNum(inqCndParams.bsno, '건물부번')){
			return false;
	    }; 
	}
	
	inqCndParams.ancmntYmd = ymd;
	inqCndParams.ancmntYmdTo = ymdTo;
	inqCndParams.ancmntYmdFrom = ymdFrom;
	
	console.log(inqCndParams);
    lazyLoading.value = true;
    axios.post('/api/ahu/selectRoadAncmntList', inqCndParams)
        .then((response) => {
            const data = response.data;
            if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
                searchDataList.value = data.results.content;
                pageInfo.totalRecords = data.results.totalElements
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

//도로명 리스트 검색
const fetchRoadNames = async () => {
	chosungParams.lgvCd = inqCndParams.lgvReplcCd;
    try {
        const response = await axios.post('/api/ahu/selectRoadNameChose', chosungParams)
        const dataArray = response.data;
        if (Array.isArray(dataArray)) {
            chosungData.value = dataArray.map((item) => ({
                value: item.CHOSUNG_NM_CD,
                label: item.CHOSUNG_NM,
            }));
        } else {
            return [];
        }
    } catch (error) {
    	console.error("error =>", error);
    }
}

//엑셀 다운로드용 조회
const apiDtlSrch = () => {
	return new Promise((resolve, reject) => {
		axios.post('/api/ahu/selectRoadAncmntListExcel', inqCndParamsOrigin).then(response => {
			resolve(response);
		})
	    .catch(error => {
			reject(error);
	    })
	})
}

//엑셀 다운로드
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
         "ctpvNm": "시/도"
        , "sggNm": "시/군/구"
        , "roadNm": "도로명"
        , "bmno": "본번"
        , "bsno": "부번"
        , "ancmntYmd": "고시일자"
        , "tkefYmd": "효력발생일"
        , "emdNm": "읍/면/동"
        , "mvmnRsnNm": "구분"
    }

    let param = {
        "fileNm": "도로명 주소 조회"
        , "headerEngTitle": header
        , "dataList": excelDataList.value
    }

    axios.post('/api/jusoCommon/cmn-excel-download', param, { responseType: 'blob' })
        .then(response => {
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '도로명 주소 조회.xlsx';
            link.click();
        })
        .catch(error => {
			console.error("error =>", error);
        })
    	.finally(() => {
    		loadingStore.hide();
    	})
}

//도로명 주소 맵 보기(새창)
const fnOpenRoadNmAddrMap = (item) => {
    let url = '/map/totalMapView?';
    url += `searchType=addr&rdCd=${item.roadNmCd}&sigCd=${item.lgvCd}`;
    url += '&rdNmAddr=' + encodeURIComponent(item.ctpvNm + ' ' + item.sggNm + ' ' + item.emdNm + ' ' + item.roadNm + ' ' + (item.bsno > 0 ? item.bmno + '-' + item.bsno : item.bmno));
    const width = window.innerWidth;
    const height = window.innerHeight;
    window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
}

//고시일자 기간선택 체크박스 체크/미체크 시 발생
watch(checkedRef, (isChecked) => {
    if (!isChecked) {
        inqCndParams.ancmntYmdDate = formatDate(DateUtils.getYesterday());
        inqCndParams.ancmntYmdFromDate = "";
        inqCndParams.ancmntYmdToDate = "";
    } else {
        inqCndParams.ancmntYmdDate = "";
        inqCndParams.ancmntYmdFromDate = formatDate(DateUtils.getYesterday());
        inqCndParams.ancmntYmdToDate = "";
    }
})

//일수 체크
const fnCalcDayMonthCount = (fromDate, toDate, type) => {
	fromDate = fromDate.replaceAll("-" , "");
	toDate = toDate.replaceAll("-" , "");
	var strSDT = new Date(fromDate.substring(0,4), fromDate.substring(4,6)-1, fromDate.substring(6,8));
	var strEDT = new Date(toDate.substring(0,4), toDate.substring(4,6)-1, toDate.substring(6,8));
	var strTermCnt = 0;
	
	strTermCnt = Math.floor(strEDT.valueOf()/(24*60*60*1000) - strSDT.valueOf()/(1000*60*60*24)+ 1);
	return strTermCnt;
}

onMounted( async() => {
    //고시일자 기초데이터 
    if (!checkedRef.value) {
    	inqCndParams.ancmntYmdDate = formatDate(yesterday);
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
        caption.textContent = '도로명 주소조회 화면 입니다.  고시일자, 구분, 시/도, 시/군/구, 도로명, 건물번호 값을 제공합니다.';
        dataTableEl.prepend(caption);
    }

})

</script>
<style>
/*기간선택 임시로 style 했음, 추후에 삭제예정*/
.imsi {
    width: 56px;
    /* width: 10%px; */
    /* margin: 50px; */
    /* padding: -20px; */
    /* margin-left: 50px 50px; */
}
</style>