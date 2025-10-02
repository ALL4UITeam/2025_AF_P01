<template>
	<CommonBreadcrumb />
    <HeaderTitle title="영상 자료실" />
    <div class="tableHeaderForm">
        <TabMenu :model="tabItems" :activeIndex="1" class="tabList">
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate" :title="`${item.label} 이동하기`">
                        {{ item.label }}
                    </a>
                </router-link>
            </template>
        </TabMenu>
        <div class="tableHeaderFormRight">
            <CustomDropdown :options="searchItemOptions" optionLabel="label" optionValue="value" v-model="inqCndParams.ntcTypeCd" title="검색박스" placeholder="전체"/>
            <CustomDropdown :options="items" optionLabel="label" optionValue="value" v-model="inqCndParams.searchTag" title="검색박스" placeholder="전체"/>
            <CustomSearchBox v-model="inqCndParams.searchValue" placeholder="검색어를 입력해주세요." title="검색어 입력해주세요." @update:modelValue="getKeyword"/>
        </div>
    </div>

    <!-- 게시판 갤러리형 -->
    <div class="videoList__wrap">
        <ul class="videoList">
            <li v-for="item in searchDataList" :key="item.searchDataList">
                <a :href="item.link" class="videoList__link" :title="item.pstTtl + `영상뉴스 보기`"
                    :id="'bgImgDetailClose_' + item.no" @click.prevent="fnDtlView(item)">
                    <div class="videoList__image">
                        <div class="videoList__play"><i aria-hidden="true" class="bi bi-play-btn-fill" /></div>
                        <img :src="item.thumbImage" :alt="item.pstTtl" class="thumbnail" />
                    </div>
                    <p class="videoList__title">{{ item.pstTtl }}</p>
                    <div class="videoList__info">
                        <div class="videoList__date">{{ item.frstRegDt }}</div>
                        <div class="videoList__source" v-if="item.srcNm != null">출처 : {{ item.srcNm }}</div>
                    </div>
                </a>
            </li>
        </ul>
        <div v-if="pageInfo.totalRecords === 0">
            <span class="centerHover">
                검색결과가 없습니다.
            </span>
        </div>
    </div>

    <!-- 목록 -->
    <Panel class="section hasTable noHeader">
        <!-- tableArea -->
        <TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
        <!-- //tableArea -->
    </Panel>
    <!-- //목록 -->

    <!--팝업 상세정보-->
    <Dialog class="commonDialog" id="dlg" :visible="dialogVisible" modal :closable="false"
        :aria-controls="dialogVisible ? 'dlg' : null" :aria-expanded="dialogVisible ? true : false">
        <template #header>
            <Button id="dialogFocus" class="dialogCloseButton" @click="closeDialog">
                <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
            </Button>
        </template>
        <div class="videoTitle">
            <!--영상 자료실 제목-->
            <ContentTitle :title="detailData.pstTtl" fontSize="30px" marginTop="0" mobileFontSize="20px">
            </ContentTitle>
        </div>
        <div class="videoContent">
			<video :src="detailData.video" controls style="width: 100%; height:360px; max-height: 100vh;"/>
        </div>
        <Scrollpanel class="videoContent__scroll">
            <div v-dompurify-html="detailData.pstCnBr"></div>
        </Scrollpanel>
    </Dialog>
</template>
<script setup>
import { ref, computed, onMounted, watchEffect, onBeforeUnmount, reactive } from "vue";
import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Scrollpanel from 'primevue/scrollpanel'
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import CustomSearchBox from '@components/search_box/CustomSearchBox.vue';
import HeaderTitle from '@components/title/HeaderTitle.vue';
import CustomPaginator from '@components/paginator/CustomPaginator.vue';
import TabMenu from 'primevue/tabmenu'
import ContentTitle from '@components/title/ContentTitle.vue';
import axios from 'axios';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import CommonBreadcrumb from '@/components/breadcrumb/CommonBreadcrumb.vue';
import {useLoadingStore} from "@/stores/ui.loading";

const loadingStore = useLoadingStore();

//탭
const tabItems = ref([
    { label: '자료실', route: '/ahi/ahiReferBoardList' },
    { label: '영상 자료실', route: '/ahi/ahiReferVideoList' },
    { label: '카드뉴스', route: '/ahi/ahiReferCardNewsList' },
]);

//검색조건 드롭다운 변수
const items = ref([
    { label: '전체', value: '' },
    { label: '제목', value: 'pstTtl' },
    { label: '내용', value: 'pstCn' },
]);

//행안부,지자체 드롭다운 변수
const searchItemOptions = ref([
    { label: '전체', value: '' },
    { label: '행안부', value: '01' },
    { label: '지자체', value: '02' },
]);

//반응형 처리 항목 숨기기
const showNo = ref(true);
const showNum = ref(true);

//조회결과
const searchDataList = ref([]);
const searchDataListTmp = ref([]);

//상세 데이터
const detailData = reactive({});

const detailDataInfo = {
	pstTtl : ''
	, video : ''
	, pstCnBr : ''
};

//모달
const dialogVisible = ref(false);

//검색조건 초기화변수
const inqCndParams = reactive({
	searchTag: 'pstTtl'
	, searchValue: ''
    , comptId: '1'
    , ntcTypeCd: ''
    , pstTypeCd: '2'
    , pageable: {
		page: 0,
        size: 6, 
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
    , page: 0   
    , size: 6	
    , orders: [{
        property: ''                               			 
        , direction: ''                                		 
    }]
});

const getKeyword = (keyword, mode) => {
	//mode - 'update'는 업데이트만, 'srch'는 업데이트후 검색수행
	inqCndParams.searchValue = keyword;
	if (mode == "srch") {
		onPaging({page:0});
	}
}

//페이징
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
	loadingStore.show();
    axios.post('/api/ahi/selectVideoReferenceList', inqCndParams)
        .then((response) => {
            const data = response.data;
            if (data.results.content) {
                searchDataListTmp.value = data.results.content;
                pageInfo.totalRecords = data.results.totalElements;
                pageInfo.currentRecords = data.results.numberOfElements;
                pageInfo.totalPages = data.results.totalPages;
                thumbnailsSet();
                Object.assign(inqCndParamsOrigin, inqCndParams);
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

//썸네일 리스트
const thumbnailsSet = async () => {
	for (let i=0; i<searchDataListTmp.value.length; i++) {
		if (searchDataListTmp.value[i].fileSn != null) {
			const innorixDownloadUrl = `/api/innorix/download`;
			const fileMgno = searchDataListTmp.value[i].fileMgno;
			const fileSn = searchDataListTmp.value[i].fileSn;
			const fileDownloadUrl = `${innorixDownloadUrl}/${fileMgno}/${fileSn}`;
			
			await axios.get(fileDownloadUrl, {responseType: 'blob'})
				.then(response => {
					const imageUrl = URL.createObjectURL(response.data);
					searchDataListTmp.value[i].thumbImage = imageUrl;
				})
				.catch(error => {
					console.error("error =>", error);
				})
		}
	}
	searchDataList.value = searchDataListTmp.value
	loadingStore.hide();
}

//상세조회
const fnDtlView = (item) => {
    axios.post('/api/ahi/selectDtlVideoReferenceView', { prRscntrMgno: item.prRscntrMgno })
        .then((response) => {
		    Object.assign(detailData, response.data);
		    detailData.pstCnBr = detailData.pstCn.replace(/\n/g, '<br>');
		    detailData.video = `/api/innorix/download/${detailData.fileMgno}/${detailData.fileSn}`;
		    dialogVisible.value = true;
        })
        .catch(error => {
        	console.error("error =>", error);
        })
}

const closeDialog = () => {
    dialogVisible.value = false;
    Object.assign(detailData, detailDataInfo);
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

onMounted( async () => {
	await fnSrch();
    //th에 scope달기
    const headers = document.querySelectorAll('th[role="columnheader"]');
    headers.forEach(header => {
        header.setAttribute('scope', 'col');
    })
})
</script>