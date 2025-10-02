<template>
  <div class="addressSearchBox">
    <div class="addressSearchBox__inner">
      <label class="blind" for="AddressSearchBoxForm">검색어 입력</label>
      <InputText 
        v-model="inqCndParams.keyword"
        :placeholder="placeholder"
        :title="title"
        id="AddressSearchBoxForm"
        @keyup.enter="onShowDialog(item)"
      />
      <Button v-if="inqCndParams.keyword" @click="clearInput" class="clearButton" title="삭제">
        <span class="blind">삭제</span>
        <i aria-hidden="true" class="bi bi-x" />
      </Button>
      <Button id="myHomeAddress" class="searchButton" title="검색" @click.prevent="onShowDialog(item)">
        <i aria-hidden="true" class="bi bi-search" />
        <span class="irText">검색</span>
      </Button>
    </div>
  </div>
  <Dialog 
        class="commonDialog"
        id="dlg" 
        :visible="dialogVisible" 
        modal 
        :closable="false" 
        :aria-controls="dialogVisible ? 'dlg' : null"
        :aria-expanded="dialogVisible ? true : false"
    >
        <template #header>      
          <Button id="myHomeAddressDialogFocus" class="dialogCloseButton" @click="closeDialog">
              <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
          </Button>
        </template>
        <ContentTitle title="도로명주소찾기" fontSize="30px" marginTop="0" mobileFontSize="20px" />
        
        <div class="innerContentSearch">
          <label class="blind" for="search">검색어 입력</label>
          <InputText 
            v-model="inqCndParams.keyword"
            id="innerSearch"
            @keyup.enter="onPaging({ page:0 })"
            placeholder="주소를 입력해주세요."
          />
          <Button v-if="inqCndParams.keyword" @click="innerClearInput" class="clearButton" title="삭제">
            <span class="blind">삭제</span>
            <i aria-hidden="true" class="bi bi-x" />
          </Button>
          <Button class="searchButton" title="검색" @click.prevent="fn_solr_search()">
            <i aria-hidden="true" class="bi bi-search" />
            <span class="irText">검색</span>
          </Button>
        </div>
        <p class="innerSerchText">검색어 예)도로명(서울특별시 서초구 반포대로 58), 지번(서울특별시 강남구 삼성동 25)</p>
        <div class="dataTable__caption rightType">
            <div class="dataTable__count">
            총 <strong class="bold">{{ pageInfo.totalRecords.toLocaleString() }}</strong>건
            </div>
        </div>
        <DataTable class="tableStyle01 noneLine gapStyle01" :value="searchDataList" ref="dataTableReResult" :loading="lazyLoading"> 
			<template #loading>
				<DataTableLoadingComponent />
			</template>
			<ColumnGroup type="header">
				<Row>
					<Column header="NO" style="width:15%;"/>
					<Column header="주소" />
					<Column header="우편번호" style="width:20%;"/>
				</Row>
			</ColumnGroup>
			<Column field="rowNumber">
				<template #body="slotProps">
					{{ slotProps.data.rowNumber }}
				</template>
			</Column>
			<Column field="rdNm" class="alignLeft">
				<template #body="slotProps">
					<a href="#" @click.prevent="fnDtlSearch(slotProps.data.rdMgtSn ,slotProps.data)">
						{{ slotProps.data.schKorRoadNm }}<br>
						<span style="font-size: 0.8em;">
							지번 {{ slotProps.data.schKorJibunNm }}
						</span>
					</a>
				</template>
			</Column>
			<Column field="zipCl">
				<template #body="slotProps">
					{{ slotProps.data.zipCl }}
				</template>
			</Column>
			<template #empty>
                <span class="centerHover">
                    검색 결과가 없습니다.
                </span>
            </template>
        </DataTable>
	    <Panel class="section hasTable noHeader">
	    	<TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
	    </Panel>
    </Dialog>
</template>
<script setup>
import { ref, watch, onMounted, computed, nextTick, reactive  } from "vue";
import InputText from 'primevue/inputtext'
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import Row from 'primevue/row';
import ColumnGroup from 'primevue/columngroup';
import HeaderTitle from '@components/title/HeaderTitle.vue';
import ContentTitle from '@components/title/ContentTitle.vue';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import axios from 'axios';
import DataTableLoadingComponent from "@/components/common/DataTableLoadingComponent.vue";
import { validateJuso, checkValidate1, checkValidate2, keyWordMin, keyWordMax, keyWordIsNumber, keyWordIsMaxNumber, regExpCheckJuso, checkValidate3 } from '@/common/histrySearchValidUtil.js'

//datatable loading
const lazyLoading = ref(false);

const pageCount = ref(1);
const pageTotal = ref();  
const pageSize = ref(5);
const currentPage = ref(0);
const dataTableReResult = ref(null);

const dialogVisible = ref(false);
const modelValueResultItem = ref('');
const searchDataList = ref([]);

const detailRoadData = ref({});
const slotIndex = ref(0);

const props = defineProps({
    modelValue : {
      type: String,
      required: true,
    },
    placeholder : {
      type: String,
      default : '입력하세요.'
    },
    title : {
      type: String,
      default : ''
    }
});

const modelValue = ref(props.modelValue);

//검색조건 초기화변수
const inqCndParams = reactive({
	keyword : props.modelValue ? props.modelValue : ''
	,strSearchType : "HSTRY"
	,strFirstSort : "none"
	,strAblYn : "N"
	,strAotYn : "N"
	,strSynnYn : null
	,strHstryYn : "Y"
	,reqFrom : "RN_SEARCH_KOR_WEB"
	,checkMoblieYn:"N"
	,strFunctionName:"Y"
    ,pageTotal:pageTotal
    ,pageable: {
    	page: currentPage.value,
    	size: pageSize.value,
    }
});

//검색시 파라미터 복제
const inqCndParamsOrigin = reactive({});

//페이징변수
const pageInfo = reactive({
	first: 0
	, totalRecords: 0
	, currentRecords: 0
	, totalPages: 0
	, page: 0					// 요청한 페이지 번호 (zero based)
	, size: pageSize.value	// 페이지당 항목 수
	, orders: [{
		property: ''            // 정렬할 속성 이름
		, direction: ''         // 정렬 방향 (ASC 또는 DESC)
	}]
});

const emit = defineEmits(['update:modelValue', 'selectValue']);

const clearInput = () => {
	inqCndParams.keyword = '';
	emit('update:modelValue', '');

	setTimeout(() => {
		const inputElement = document.querySelector('#AddressSearchBoxForm');
		if (inputElement) {
			inputElement.focus();
		}
	}, 0);
};

//검색 버튼 클릭
const onPaging = params => {
	pageInfo.first = params.first !== undefined ? params.first : 0;
	pageInfo.page = params.page !== undefined ? params.page + 1 : 1;
	pageInfo.size = params.rows ? params.rows : pageInfo.size;
	
 	if ((params.page != 0 || params.first != undefined) && inqCndParamsOrigin != null) {
		Object.assign(inqCndParams, inqCndParamsOrigin);
	}
  
	inqCndParams.pageable.page = pageInfo.page - 1;
	inqCndParams.pageable.size = pageInfo.size;
	fn_solr_search();
}

// 검색 실행
function fn_solr_search() {
	inqCndParams.keyword = validateJuso(inqCndParams.keyword);
	
	//주소 체크
	if (!checkValidate1(inqCndParams.keyword)){
		return false;
	}else if(!checkValidate2(inqCndParams.keyword)){
		return false;
	}else if(!keyWordMin(inqCndParams.keyword)){
		return false;
	}else if(!keyWordMax(inqCndParams.keyword)){
		return false;
	}else if(!keyWordIsNumber(inqCndParams.keyword)){
		return false;
	}else if(!keyWordIsMaxNumber(inqCndParams.keyword)){
		return false;
	}
	
	inqCndParams.keyword = regExpCheckJuso(inqCndParams.keyword);
	
	//인천 남구 -> 미추홀구 명칭변경 안내문구
	checkValidate3(inqCndParams.keyword);
	
	lazyLoading.value = true;
	axios.post('/api/solr/solrKeywordSearch', inqCndParams)
		.then((response) => {
			const data = response.data;
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				const totalElements = data.results.totalElements;
				const pageSize = data.results.size;
				const currentPage = data.results.pageable.pageNumber;
				searchDataList.value = data.results.content.map((item, index) => {
					const rowNumber = currentPage * pageSize + index + 1;
					return {
						...item,
						rowNumber: rowNumber
					}
				})
				pageInfo.totalRecords = data.results.totalElements;
				pageInfo.currentRecords = data.results.numberOfElements;
				pageInfo.totalPages = data.results.totalPages;
				
				searchDataList.value.map(item => {
					//아파트인 경우 완성주소에서 건물명 제거
					if (item.aphusYn == "1" && item.schKorRoadNm.includes(",")) {
						item.schKorRoadNm = item.schKorRoadNm.substring(0, item.schKorRoadNm.indexOf(",")) + ")";
					}
				})
				Object.assign(inqCndParamsOrigin, inqCndParams);
				
			} else {
				searchDataList.value.splice(0);
				pageInfo.totalRecords = 0;
				pageInfo.currentRecords = 0;
				pageInfo.totalPages = 0;
			}
		})
	    .catch(error =>{
			console.error("error =>", error);
		})
	    .finally(() =>{
			lazyLoading.value = false;
	    });
}

//상세검색
const fnDtlSearch = (rdMgtSn, data) => {
	axios.get('/api/solr/solrRoadSearch/' + rdMgtSn)
		.then((response) => {
			detailRoadData.value = response.data.results.list;
			const sendData = {
					"dataInfo" : data
					,"detailDataInfo" : detailRoadData.value[0]
			}
			emit("selectValue", sendData);
			closeDialog();
			if (data.schKorRoadNm.indexOf('(') != -1) {
				data.schKorRoadNm = data.schKorRoadNm.substring(0, data.schKorRoadNm.indexOf(' ('));
			}
			inqCndParams.keyword = data.schKorRoadNm;
		})
	    .catch(error =>{
			console.error("error =>", error);
		})	
}

//다이얼로그 오픈
const onShowDialog = async(item) => {
    dialogVisible.value = true;
    
    setTimeout(() => {
    	document.querySelector('#myHomeAddressDialogFocus').focus();
    }, 0);
    
	nextTick(() => {
		const headers = document.querySelectorAll('th[role="columnheader"]');
		headers.forEach(header => {
			header.setAttribute('scope', 'col');
		})
		
		const dataTableEl = dataTableReResult.value.$el.querySelector('.p-datatable-table');
		if (dataTableEl) {
			const caption = document.createElement('caption');
			caption.textContent = '도로명 정보조회 화면 입니다.  시/도, 시/군/구, 도로명, 본번, 부번, 고시일자, 효력발생일, 읍/면/동, 구분 값을 제공합니다.';
			dataTableEl.prepend(caption);
		}
      
		if(inqCndParams.keyword){
			onPaging({page:0});
		}
	})
}

const closeDialog = () => {
	dialogVisible.value = false;
    document.querySelector('#myHomeAddress').focus();
    searchDataList.value.splice(0);
	pageInfo.totalRecords = 0;
	pageInfo.currentRecords = 0;
	pageInfo.totalPages = 0;
}

const innerClearInput = () => {
	inqCndParams.keyword = '';

	setTimeout(() => {
    	const inputElement = document.querySelector('#innerSearch');
	    if (inputElement) {
			inputElement.focus();
		}
	}, 0);
};

const totalCount = computed(() => {
    return searchDataList.value.length;
})

onMounted(() => {
	window.addEventListener('keydown', function(event) {
		if (dialogVisible.value == true) {
			if(event.key === 'Esc' || event.key === 'Escape') {
				dialogVisible.value = false;
				return;
			}
		}
	});
})
</script>
<style lang="scss" scoped>
@use '@/assets/scss/_mixin';

.addressSearchBox {
    display: flex;
    justify-content: center;
    margin-top:50px;
    padding:20px 0;
    border-radius: 20px;
    background: #eaedf2;
}
.addressSearchBox__inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 720px;
  height: 70px;
  border-radius: 45px;
  border:1px solid #2b6ae5;
  background: #fff;

  input {
    width: calc(100% - 106px);
    height: 100%;
    font-size:18px;
    padding-left:20px;
  }
}
.clearButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 50%;
  margin-left:14px;
  background: #e1e4ea;
  color:#333;

  i {
    width: auto;
    height: auto;
    font-size:17px;
    font-weight: bold;
    margin:1px 0 0 1px;
  }
}
.searchButton {
  position: relative;
  width: 26px;
  min-width: 26px;
  height: 100%;
  margin-left:14px;

  i {
    width: auto;
    height: auto;
    color:#2b6ae5;
    font-size: 24px;
  }
}

.innerContentSearch {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top:20px;
  padding:10px 20px;
  border-radius: 12px;
  border:1px solid #ddd;
  input {
    flex:1;
  }
}

.innerSerchText {
  margin-top:10px;
  color:#333;
  font-size:17px;
}

@include mixin.breakpoint-tablet {
  .addressSearchBox {
      margin-top:20px;
      padding:0;
      border-radius: 0;
      background: none;
  }
  .addressSearchBox__inner {
    width: 100%;
    max-width: 100%;
    height: 60px;
    border-radius: 30px;
    box-shadow: 1px 2.8px 15px 0 rgba(0,0,0,0.05);

    input {
      width: calc(100% - 70px);
      height: 100%;
      font-size:15px;
    }
  }

  .innerContentSearch {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top:20px;
  padding:5px 10px;
  border-radius: 12px;
}

.innerSerchText {
  font-size:13px;
}

}
</style>