<template>
	<CommonBreadcrumb />
    <HeaderTitle title="언론보도" />
    
    <div class="tableHeaderForm">
        <TabMenu :model="tabItems" :activeIndex="2" class="tabList">
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate" :title="`${item.label} 이동하기`">
                        {{item.label}}
                    </a>
                </router-link>
            </template>
        </TabMenu>
	    <div class="tableHeaderFormRight">
	        <CustomDropdown :options="searchItemOptions" optionLabel="label" optionValue="value" v-model="inqCndParams.searchTag" title="검색박스" placeholder="제목" />
	        <CustomSearchBox v-model="inqCndParams.searchValue" placeholder="검색어를 입력해주세요." title="검색어 입력해주세요." @update:modelValue="getKeyword"/>
	    </div>
    </div>

    <!-- 게시판 목록형 -->
    <div class="dataTable__wrap">
        <DataTable :value="searchDataList" ref="dataTableRef" :loading="lazyLoading">
			<template #loading>
				<DataTableLoadingComponent />
      		</template>
            <Column style="width:10%;" field="rnum" v-if="showNo" header="No">
                <template #body="slotProps">
                    <span class="firstHover">
                        {{ slotProps.data.rnum }}
                    </span>
                </template>
            </Column>
            <Column field="pstTtl" header="제목" class="alignLeft">
                <template #body="slotProps">
                    <div class="linkHover">
                        <a href="#" @click.prevent="fnDtlView(slotProps.data.ntcnBbsMgno)" class="alignLink">
                            {{ slotProps.data.pstTtl }}
                        </a>
                        <div class="bi bi-paperclip" v-if="slotProps.data.fileUseCount > 0">
                            <span class="blind">파일첨부</span>
                        </div>
                    </div>
                </template>
            </Column>
            <Column style="width:20%;" field="frstRegDt" header="등록일">
                <template #body="slotProps">
                    <span class="centerHover">
                        {{ slotProps.data.frstRegDt }}
                    </span>
                </template>
            </Column>
            <Column style="width:10%;" field="inqCnt" v-if="showNum" header="조회수">
                <template #body="slotProps">
                    <span class="lastHover">
                        {{ slotProps.data.inqCnt }}
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

    <Panel class="section hasTable noHeader">
        <TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
    </Panel>
</template>
<script setup>
import { ref, computed, onMounted, watchEffect, onBeforeUnmount, reactive } from "vue";
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import CustomSearchBox from '@/components/search_box/CustomSearchBox.vue';
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import CustomPaginator from '@/components/paginator/CustomPaginator.vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import DataTableLoadingComponent from "@/components/common/DataTableLoadingComponent.vue";
import TabMenu from 'primevue/tabmenu'

//탭
const tabItems = ref([
    {label:'보도자료', route:'/ahh/ahhNewsBoardList'},
    {label:'신문기사', route:'/ahh/ahhNewspaperList'},
    {label:'기고문', route:'/ahh/ahhContributedArticleList'},
]);

//datatable loading
const lazyLoading = ref(false);

//라우터
const router = useRouter();
const route = useRoute();

//조회결과
const searchDataList = ref([]);
const dataTableRef = ref(null);

//페이지 넘버
const pageNumber = ref('');

//검색조건 초기화변수
const inqCndParams = reactive({
	searchTag: 'pstTtl'
	, searchValue: ''
	, pstgTypeCd: '3'
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

//검색시 파라미터 복제
const inqCndParamsOrigin = reactive({});

//검색조건 변수
const searchItemOptions = ref([
    { label: '제목', value: 'pstTtl' },
    { label: '내용', value: 'pstCn' },
]);

const getKeyword = (keyword, mode) => {
	//mode - 'update'는 업데이트만, 'srch'는 업데이트후 검색수행
	inqCndParams.searchValue = keyword;
	if (mode == "srch") {
		onPaging({page:0});
	}
}

//검색 버튼 클릭
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
const fnSrch = async () => {
	lazyLoading.value = true;
    axios.post('/api/ahh/selectNewsList', inqCndParams)
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
		.catch(error => {
			console.error("error =>", error);
		})
	    .finally(() =>{
			lazyLoading.value = false;
	    });
}

//상세 화면 이동
const fnDtlView = (ntcnBbsMgno) => {
    sessionStorage.setItem('pageInfo', JSON.stringify(pageInfo));
    sessionStorage.setItem('inqCndParams', JSON.stringify(inqCndParams));
    router.push({
        path: '/ahh/ahhNewsBoardDetail',
        query: { 
        	ntcnBbsMgno: ntcnBbsMgno,
        	active: '3',
			pageNumber: pageNumber.value }
    });
};

const header = ref('');
const updateCaption = () => {
    const width = window.innerWidth;
    header.value = width > 900 ? '공지사항 리스트로 NO, 제목, 등록일, 조회수 정보를 제공합니다' : '공지사항 리스트로 제목, 등록일 정보를 제공합니다';
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

//반응형 처리 항목 숨기기
const showNo = ref(true);
const showNum = ref(true);

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

<style lang="scss" scoped></style>