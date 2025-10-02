<template>
	<CommonBreadcrumb />
    <HeaderTitle title="100만건 이하 주소전환 신청내역" />

    <TabMenu :model="tabItems" :activeIndex="active" @tab-change="onTabChange" />

    <div v-show="active === 2">

        <div class="dataTable__wrap" id="target">

            <div class="commonHeader">
                <ContentTitle title="신청내역" fontSize="24px" marginTop="0" mobileFontSize="18px" mobileMarginTop="0" />
                <Button class="commonButton__button" title="신청화면" @click.prevent="fnBfrPage()">
                    <span class="commonButton__text">신청화면</span>
                    <i aria-hidden="true" class="bi bi-arrow-right" />
                </Button>
            </div>

            <DataTable :value="items" ref="dataTableRef">
                <Column header="등록일시" field="regDt" style="width:20%;" />
                <Column header="파일명" field="actlFileNm" class="alignLeft">
	                <template #body="slotProps">
                        <div v-if="slotProps.data.uldFileNm != null && slotProps.data.uldFileNm != ''">
	                        {{slotProps.data.actlFileNm}}
                        </div>
                        <div v-else>
                        	파일이 없습니다.
                        </div>
	                </template>
                </Column>
                <Column header="진행상태" field="prgrsSttsCd" style="width:15%;">
                    <template #body="slotProps">
                    	<div v-if="slotProps.data.delRsnCd == '0'">
	                        <Button v-if="slotProps.data.prgrsSttsCd == '90'" class="commonButton__tableButton" title="다운로드" @click.prevent="downloadAllFiles(slotProps.data.uldFileNm, slotProps.data.regDt.substring(0,4), slotProps.data.actlFileNm)">
	                            다운로드
	                            <i aria-hidden="true" class="bi bi-download" />
	                        </Button>
	                        <span v-else if="slotProps.data.prgrsSttsCd == '10'" class="commonColor01">전환중</span>
	                        <span v-else if="slotProps.data.prgrsSttsCd == '00'" class="commonColor01">대기</span>
                    	</div>
                    	<div v-if="slotProps.data.delRsnCd == '1'">
	                        <span class="commonColor01">삭제됨</span>
                    	</div>
                    </template>
                </Column>
                <Column header="삭제" style="width:15%;">
                    <template #body="slotProps">
                        <Button class="commonButton__tableButton primary" @click="deleteItem(slotProps.data.hmpgAddrNo)"> 
                            삭제
                            <i aria-hidden="true" class="bi bi-x" />
                        </Button>
                    </template>
                </Column>
                <template #empty>
	                <span class="centerHover">
	                	검색된 내용이 없습니다.
	                </span>
            	</template>
            </DataTable>
		    <Panel class="section hasTable noHeader">
		    	<TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
		    </Panel>
        </div>
        <div class="addressConvert__guideBox">
            <p class="addressConvert__guideBoxTitle">
                <i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 전환결과 확인 안내
            </p>
            <ul class="addressConvert__guideBoxText">
                <li>주소전환 자료에는 개인정보를 포함하면 안됩니다.</li>
                <li>결과의 맨 앞자리가 "형식오류", "미전환"는 입력 하신 주소가 불명확 하거나, 형식이 부정확하여 전환이 실패한 항목입니다.(입력된 주소를 다시 확인해주세요.)</li>
                <li>"복수주소"은 입력하신 지번에 여러 개의 도로명주소가 존재하는 경우, 각 주소는 "|"로 구분됩니다.
                    <!-- 이미지가 내부에 없어 임시 이미지 -->
                    <div>
                        <img src="@/assets/images/utilization/img-guide02.png" alt="결과코드,우편주소,지번주소,도로명주소,건물관리번호 | 우편번호,도로명주소,건물관리번호 - 복수주소 표출형태(주소 건수만큼 반복)" />
                    </div>
                </li>
                <li>"자료없음"는 주소를 찾을 수 없는 경우</li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Breadcrumb from 'primevue/breadcrumb'
import TabMenu from 'primevue/tabmenu'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import axios from 'axios';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
import HeaderTitle from '@components/title/HeaderTitle.vue';
import ContentTitle from '@components/title/ContentTitle.vue';
import CustomInputText from '@components/input_text/CustomInputText.vue';
import { useRouter, useRoute } from "vue-router";
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";

const router = useRouter();
const route = useRoute();

//테이블
const dataTableRef = ref(null);
const items = reactive([{}]);

const pageCount = ref(1);
const pageTotal = ref();  
const pageSize = ref(10);
const currentPage = ref(0);

const active =ref(2);
const tabItems = ref([
    {label:'50건 이하 주소전환'},
    {label:'3,000건 이하 주소전환'},
    {label:'100만건 이하 주소전환'},
]);

//검색조건 초기화변수
const inqCndParams = reactive({
    pageTotal:pageTotal
    ,pageable: {
    	page: currentPage.value,
    	size: pageSize.value,
    }
});

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

//브레드크럼
const breadcrumbs = [
 {
     label:'메인',
     title:'메인으로 이동',
     url: '/',
 },
 {
     label:'주소정보활용',
     title:'주소정보활용 이동',
     url: '/',
 },
 {
     label:'주소전환',
     title:'주소전환으로 이동',
     url: '/',
 },
]

//검색 버튼 클릭
const onPaging = params => {
  pageInfo.page = params.page !== undefined ? params.page + 1 : 1;
  pageInfo.size = params.rows ? params.rows : pageInfo.size;
  
  inqCndParams.pageable.page = pageInfo.page - 1;
  inqCndParams.pageable.size = pageInfo.size;
  fnConvertList();
}

const onTabChange = (e) => {
	router.push({
		path: '/aht/AhtAddressTransformOffer',
		state : {active : e.index}
	});
}

//100만건 주소전환 신청목록 조회
const fnConvertList = () => {
	axios.post('/api/aht/selectConvertList', inqCndParams)
		.then(response => {
			const data = response.data;
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				items.splice(0);
				Object.assign(items, data.results.content);
				pageInfo.totalRecords = data.results.totalElements;
				pageInfo.currentRecords = data.results.numberOfElements;
				pageInfo.totalPages = data.results.totalPages;
				
				if(pageInfo.page == data.results.totalPages){
					const target = document.getElementById('target');
					target.scrollIntoView({behavior:'smooth'});
				}
				
			} else {
				items.splice(0);
				pageInfo.totalRecords = 0;
				pageInfo.currentRecords = 0;
				pageInfo.totalPages = 0;
			}
		})
	    .catch(error =>{
			console.error("error =>", error);
		})
}

//100만건 파일 다운로드
const downloadAllFiles = async (uldFileNm, year, actlFileNm) => {
	const innorixDownloadUrl = `/api/innorix/downConvertMillionload`;
	const fileDownloadUrl = `${innorixDownloadUrl}/${uldFileNm}/${year}`;
	try {
		const response = await axios({
			url: fileDownloadUrl,
   		 	method: 'GET',
   			responseType: 'blob'
   		});
   		const link = document.createElement('a');
   		link.href = URL.createObjectURL(new Blob([response.data], {type: 'application/octet-stream'}));
		link.download = actlFileNm;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
   } catch(error) {
		console.log("error : ", error);
   }
}

//100만건 주소전환 신청목록 삭제
const deleteItem = (hmpgAddrNo) => {
	if(confirm("삭제하시겠습니까?")){
		axios.get(`/api/aht/deleteConvertList/${hmpgAddrNo}`)
			.then(response => {
				fnConvertList();
			})
		    .catch(error =>{
				console.error("error =>", error);
			})
	}
}

//등록 페이지 이동
const fnBfrPage = () => {
	router.push({
		path: '/aht/AhtAddressTransformOffer',
		state : {active : 2}
	});
}

onMounted( async () => {
    //th에 scope달기
    const headers = document.querySelectorAll('th[role="columnheader"]');
    headers.forEach(header => {
        header.setAttribute('scope', 'col');
    })

    //캡션 추가
    const dataTableEl = dataTableRef.value.$el.querySelector('.p-datatable-table');
    if (dataTableEl) {
        const caption = document.createElement('caption');
        caption.textContent = '지번입력 조회 리스트로 등록일시, 파일명, 진행상태와 삭제기능을 제공합니다.';
        dataTableEl.prepend(caption);
    }
    
    await fnConvertList();

})
</script>

<style lang="scss" scoped>

</style>