<template>
	<div class="enContent type01">
    	<HeaderTitle title="Publications"/>

	    <div class="tableHeaderFormRight">
	        <CustomDropdown inputId="item" :options="searchOptions" v-model="selectedSearchOptions" title="검색박스" :placeholder="searchOptions[0]?.label" />
	        <CustomSearchBox
	            v-model="modelValue"
	            placeholder="Enter a keyword"
	            title="검색어 입력해주세요."
	            @click.prevent="onPaging({ page: 0 })" @keydown.enter="fnSrch"
	        />
	    </div>
	    
	    <!-- 게시판 목록형 -->
	    <div class="dataTable__wrap">
	        <DataTable 
	            :value="searchDataList" 
	            ref="dataTableRef"
	        >
	            <Column 
	                style="width:10%;"
	                field="rnum" 
	                v-if="showNo" 
	                header="No"
	            >
	                <template #body="slotProps">
	                    <span class="firstHover">
	                        {{ slotProps.data.rnum }}
	                    </span>
	                </template>
	            </Column>
	            <Column 
	                field="title" 
	                header="Title"
	                class="alignLeft"
	            >
	                <template #body="slotProps">
	                    <div class="linkHover">
	                        <a 
	                            href="#"
	                            class="alignLink"
	                            @click.prevent="fnDtlView(slotProps.data.prRscntrMgno)"
	                        >
	                            {{slotProps.data.pstTtl}}
	                        </a>
	                        <div class="bi bi-paperclip" v-if="slotProps.data.fileUseCount > 0">
	                            <span class="blind">파일첨부</span>
	                        </div>
	                    </div>
	                </template>
	            </Column>
	            <Column 
	                style="width:20%;"
	                field="date" 
	                header="Date"
	            >
	                <template #body="slotProps">
	                    <span class="centerHover">
	                        {{slotProps.data.frstRegDt}}
	                    </span>
	                </template>
	            </Column>
	            <Column 
	                style="width:10%;"
	                field="attachment"
	                v-if="showNum"
	                header="Read"
	            >
	                <template #body="slotProps">
	                    <span class="lastHover">
	                        {{slotProps.data.inqCnt}}
	                    </span>
	                </template>
	            </Column>
	            <template #empty>
	                <span class="centerHover">
	                    검색결과가 없습니다.
	                </span>
	            </template>
	        </DataTable>
	    </div>

	    <!-- pc 10건, mo 5건 -->
	    <Panel class="section hasTable noHeader">
	        <!-- tableArea -->
	        <TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
	        <!-- //tableArea -->
	    </Panel>
</div>
</template>
<style lang="scss" scoped>@import url('@scss/contents/en/enMain.scss');</style>
<script setup>
import { ref, computed, onMounted, watchEffect, onBeforeUnmount, reactive } from "vue";
import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Breadcrumb from 'primevue/breadcrumb'
import CustomSearchBox from '@components/search_box/CustomSearchBox.vue';
import HeaderTitle from '@components/title/HeaderTitle.vue';
import CustomPaginator from '@components/paginator/CustomPaginator.vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";

//셀렉트박스
const selectedSearchOptions = ref(null);
const searchOptions = ref([
	{ label: 'Choice', value: '' },
    { label: 'Title', value: 'pstTtl' },
    { label: 'Contents', value: 'pstCn' },
]);

//검색영역
const modelValue = ref('');

//테이블
const dataTableRef = ref(null);

//반응형 처리 항목 숨기기
const showNo = ref(true);
const showNum = ref(true);

//라우터
const router = useRouter();
const route = useRoute();

//조회결과
const searchDataList = ref([]);

//검색조건 초기화변수
const inqCndParams = reactive({
    pstTtl: ''
    , pstCn: ''
    , ntcTypeCd: ''
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
    , page: 0												                      // 요청한 페이지 번호 (zero based)
    , size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE)	// 페이지당 항목 수
    , orders: [{
        property: ''                               			    // 정렬할 속성 이름
        , direction: ''                                		  // 정렬 방향 (ASC 또는 DESC)
    }]
});

//페이지 넘버
const pageNumber = ref('');

const fnSrch = async () => {
	if(selectedSearchOptions.value) {
		if(selectedSearchOptions.value.value === 'pstTtl') {
			inqCndParams.pstTtl = modelValue.value
			inqCndParams.pstCn = "";
		} else if(selectedSearchOptions.value.value === 'pstCn') {
			inqCndParams.pstCn = modelValue.value
			inqCndParams.pstTtl = "";
		} else {
			inqCndParams.pstTtl = "";
			inqCndParams.pstCn = "";
		}
	}

	axios.post('/api/ahi/selectEngReferenceList', inqCndParams)
		.then((response) => {
			const data = response.data;
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				searchDataList.value = data.results.content;
				pageInfo.totalRecords = data.results.totalElements;
				pageInfo.currentRecords = data.results.numberOfElements;
				pageInfo.totalPages = data.results.totalPages;
				pageNumber.value = data.results.pageable.pageNumber;  // 페이지번호
			} else {
				searchDataList.value = data.results.content;
				pageInfo.totalRecords = 0;
				pageInfo.currentRecords = 0;
				pageInfo.totalPages = 0;
			}
		})
		.catch((error) => {
			console.error("error =>", error);
		});
}

//검색 버튼 클릭
const onPaging = params => {
    pageInfo.first = params.first !== undefined ? params.first : 0;
    pageInfo.page = params.page ? params.page + 1 : 1;
    pageInfo.size = params.rows ? params.rows : pageInfo.size;

    //post 방식으로 전달시 0페이지부터 조회하도록 -1을 해줘야함.
    inqCndParams.pageable.page = pageInfo.page - 1;
    inqCndParams.pageable.size = pageInfo.size;

    fnSrch();
}

//상세조회 이동
const fnDtlView = (prRscntrMgno) => {
    sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo));
    sessionStorage.setItem('inqCndParams', JSON.stringify(inqCndParams));
    router.push({
        path: '/ahi/ahiEngReferBoardDetail',
        query: {
            prRscntrMgno: prRscntrMgno,
            pageNumber: pageNumber.value
        }
    });
};

const header = ref('');
const updateCaption = () => {
    const width = window.innerWidth;
    header.value = width > 900 ? '공지사항 리스트로 NO, 제목, 등록일, 조회수 정보를 제공합니다':'공지사항 리스트로 제목, 등록일 정보를 제공합니다';


    const dataTableEl = dataTableRef.value.$el.querySelector('.p-datatable-table');
    if (dataTableEl) {

        const existingCaption = dataTableEl.querySelector('caption');
        if(existingCaption) {
            existingCaption.remove();
        }

        const caption = document.createElement('caption');
        caption.textContent = header.value
        dataTableEl.prepend(caption);
    }
}

watchEffect(() => {
    const width = window.innerWidth;
    showNo.value = width > 900;
    showNum.value = width > 900;
})

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    showNo.value = width > 900;
    showNum.value = width > 900;
})

onMounted(async () => {
	
    //th에 scope달기
    const headers = document.querySelectorAll('th[role="columnheader"]');
    headers.forEach(header => {
        header.setAttribute('scope', 'col');
    })

    //캡션 추가
    updateCaption();
    window.addEventListener('resize', updateCaption);
    
	//상세페이지 이동하기 전 목록 sessionStorage 저장
    if (route.query.pageNumberDetail) {
        Object.assign(pageInfo, JSON.parse(sessionStorage.getItem('pageInfo')));
        Object.assign(inqCndParams, JSON.parse(sessionStorage.getItem('inqCndParams')));
        sessionStorage.removeItem('pageInfo');
        sessionStorage.removeItem('inqCndParams');
    }
  
    await fnSrch();
})

onBeforeUnmount(() => {
    //캡션 제거
    window.removeEventListener('resize', updateCaption);
})

</script>