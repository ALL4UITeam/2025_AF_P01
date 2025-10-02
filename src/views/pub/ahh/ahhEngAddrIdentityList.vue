<template>
	<CommonBreadcrumb />

    <div class="commonView__header">
        <HeaderTitle title="주소동일성 영문증명서 발급" />
    </div>

    <div class="dataTable__wrap">
        <DataTable :value="searchDataList" ref="dataTableRef" :loading="lazyLoading">
			<template #loading>
				<DataTableLoadingComponent />
			</template>
            <Column 
                style="width:10%;"
                field="date" 
                header="신청일시"
            >
                <template #body="slotProps">
                    <span class="firstHover">
                        {{slotProps.data.regDt}}
                    </span>
                </template>
            </Column>
            <Column 
                field="title" 
                header="제목"
                class="alignLeft"
            >
                <template #body="slotProps">
                    <div class="linkHover">
                        <a 
                            class="alignLink"
                            @click="fnDtlMove(slotProps.data.uccSn)"
                        >
                            {{slotProps.data.aplyInstNm}}
                        </a>
                    </div>
                </template>
            </Column>
            <Column 
                style="width:20%;"
                field="state" 
                header="진행상태"
            >
                <template #body="slotProps">
                    <span class="centerHover">
                        {{slotProps.data.prgrsSttsCd}}
                    </span>
                </template>
            </Column>
            <Column 
                style="width:10%;"
                field="attachment"
                header="조회수"
            >
                <template #body="slotProps">
                    <span class="lastHover">
                        {{slotProps.data.inqCnt}}
                    </span>
                </template>
            </Column>
            <template #empty>
        		<span class="centerHover">
        			검색 결과가 없습니다.
        		</span>
      		</template>
        </DataTable>
        <div class="table__footer">
            <Button @click="fnChgBuldNmIqy" class="commonButton__button" title="신청하기">
                <span class="commonButton__text">신청하기</span>
                <i aria-hidden="true" class="bi bi-arrow-right" />
            </Button>
        </div>
    </div>
    <Panel class="section hasTable noHeader">
       <TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
    </Panel>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog';
import RadioButton from "primevue/radiobutton";
import Textarea from "primevue/textarea";
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import ContentTitle from '@/components/title/ContentTitle.vue';
import CustomInputText from '@/components/input_text/CustomInputText.vue';
import CustomPaginator from '@/components/paginator/CustomPaginator.vue';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import DataTableLoadingComponent from "@/components/common/DataTableLoadingComponent.vue";

//datatable loading
const lazyLoading = ref(false);

const router = useRouter();
const route = useRoute();

//테이블
const dataTableRef = ref(null);
const searchDataList = ref([]);

//페이징 관련 변수
const pageTotal = ref();
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

//파라미터 변수
const inqCndParams = reactive({
	pageTotal: pageTotal,
	pageable: {
	   	page: 0,
	   	size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE),
	}
});

//페이지 버튼 클릭
const onPaging = params => {
    pageInfo.first = params.first !== undefined ? params.first : 0;
    pageInfo.page = params.page ? params.page + 1 : 1;
    pageInfo.size = params.rows ? params.rows : pageInfo.size;

    //post 방식으로 전달시 0페이지부터 조회하도록 -1을 해줘야함.
    inqCndParams.pageable.page = pageInfo.page - 1;
    inqCndParams.pageable.size = pageInfo.size;

    fnInquiryList();
}

//목록 조회
const fnInquiryList = async () => {
	lazyLoading.value = true;
	await axios.post('/api/ahh/selectInquiry', inqCndParams)
		.then((response) => {
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

//상세화면 이동
const fnDtlMove = (uccSn) => {
	let info = { uccSn : uccSn, dpcnIdntyCdNm : inqCndParams.dpcnIdntyCdNm };
	router.push({ 
		path: '/ahh/ahhEngAddrIdentityDetail',
		state: { data: JSON.stringify(info) }
	});
}

//등록화면 이동
const fnChgBuldNmIqy = () => {
	router.push({ 
		path: '/ahh/ahhEngAddrIdentityWrite' 
	});
}

onMounted(() => {
    //th에 scope달기
    const headers = document.querySelectorAll('th[role="columnheader"]');
    headers.forEach(header => {
        header.setAttribute('scope', 'col');
    })
    
    fnInquiryList();
	
	//캡션 추가
    const dataTableEl01 = dataTableRef.value.$el.querySelector('.p-datatable-table');
    if (dataTableEl01) {
        const caption = document.createElement('caption');
        caption.textContent = '도로명주소 인포그래픽 테이블로 순번, 시도명, 부여된 주소 수 정보를 제공합니다.';
        dataTableEl01.prepend(caption);
    }
})

</script>