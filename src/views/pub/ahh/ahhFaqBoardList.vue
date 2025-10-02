<template>
	<CommonBreadcrumb />
	<HeaderTitle title="자주 묻는 질문" />

	<div class="tableHeaderFormRight">
		<CustomDropdown :options="items" optionLabel="label" optionValue="value" v-model="inqCndParams.searchTag" title="검색박스" placeholder="제목" />
		<CustomSearchBox
			v-model="inqCndParams.searchValue"
			placeholder="검색어를 입력해주세요."
			title="검색어 입력해주세요."
			@click.prevent="onPaging({ page: 0 })"
			@keydown.enter="fnSrch"
		/>
	</div> 

	<div class="common__box">
		<DataTable :value="faqData" ref="dataTableRef">
			<ul class="accordionList">
				<li v-for="(item, index) in faqData" :key="index" :class="{ current: item.inOpen }">
					<a :href="'#faqSeq' + (index + 1)" :title="item.inOpen ? '답변 접기' : '답변 펼치기'" role="button"
					class="accordionList__subject" @click.prevent="toggleAnswer(index)">
						<div class="accordionList__question"><span class="blind">질문</span></div>
						<div class="accordionList__thema">{{ item.pstTtl }}</div>
					</a>
					<div :id="'faqSeq' + (index + 1)" class="accordionList__content" v-show="item.inOpen">
						<div class="accordionList__answer"><span class="blind">답변</span></div>
						<div v-dompurify-html="item.pstCn.replace(/\n/g, '<br>')"></div>
						<img :src="item.faqImage" :alt="item.pstTtl" v-if="item.faqImage != null"/>
					</div>
				</li>
			</ul>
			<div v-if="pageInfo.totalRecords === 0">
				<span class="centerHover">
					검색결과가 없습니다.
				</span>
	 		</div>
		</DataTable>
	</div>

	<Panel class="section hasTable noHeader">
		<TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
	</Panel>
</template>
<script setup>
import { ref, computed, onMounted, watchEffect, onBeforeUnmount, reactive  } from "vue";
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import CustomSearchBox from '@/components/search_box/CustomSearchBox.vue';
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import CustomPaginator from '@/components/paginator/CustomPaginator.vue';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import axios from 'axios';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";

const items = ref([
	{label:'제목', value:'pstTtl'},
	{label:'내용', value:'pstCn'},
]);

const searchValue = ref('');

const pageSize = ref(10);
const currentPage = ref(0);

//조회결과
const faqData = ref([]);

const handlePageChange = (event) => {
  currentPage.value = Math.floor(event.first / pageSize.value)
}

const toggleAnswer = (index) => {
  faqData.value[index].inOpen = !faqData.value[index].inOpen
}

//검색조건 초기화변수
const inqCndParams = reactive({
	searchTag : 'pstTtl'
    , searchValue : ''
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
		property: ''										// 정렬할 속성 이름
		, direction: ''										// 정렬 방향 (ASC 또는 DESC)
	}]
});

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

//검색
const fnSrch = async () => {
	axios.post('/api/ahh/selectFaqList', inqCndParams)
		.then((response) => {
			const data = response.data;
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				faqImgSet(data)
				pageInfo.totalRecords = data.results.totalElements;
				pageInfo.currentRecords = data.results.numberOfElements;
				pageInfo.totalPages = data.results.totalPages;
			} else {
				faqData.value = data.results.content;
				pageInfo.totalRecords = 0;
				pageInfo.currentRecords = 0;
				pageInfo.totalPages = 0;
			}
		})
		.catch(error => {
			console.error("error =>", error);
		})
	    .finally(() =>{
	    });
}

//자주묻는질문 이미지 리스트
const innorixDownloadUrl = `/api/innorix/download`;

async function faqImgSet(data) {
	let dataList = data.results.content; 
    try {
        for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].fileSn != null) {
                const fileMgno = dataList[i].fileMgno;
                const fileSn = dataList[i].fileSn;
                const fileDownloadUrl = `${innorixDownloadUrl}/${fileMgno}/${fileSn}`;
                // const response = await axios({
                //     url: fileDownloadUrl,
                //     method: 'GET',
                //     responseType: 'blob'
                // });
                // const imageUrl = URL.createObjectURL(response.data);
                dataList[i].faqImage = fileDownloadUrl;
            }
        }
        faqData.value = dataList;
    } catch (error) {
        let dataList = data.results.content;
        faqData.value = dataList;
    }
}

onMounted(() => {
	fnSrch();
})
</script>

<style lang="scss" scoped></style>