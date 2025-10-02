<template>
	<CommonBreadcrumb />
	<HeaderTitle title="아름다운 길" />

	<div class="road__explanation">
		<div class="road__innerBox">
			<ul class="road__introduction">
				<li>한국의 아름다운 길을 보여주는 대한민국 곳곳의 명소들을 소개합니다.</li>
				<li>이미지를 클릭하시면 해당 지역의 도로명주소와 특징, 유래 등을 알 수 있고, 이미지를 다운로드 받으실 수 있습니다.</li>
			</ul>
			<div class="road__manual">
				<div class="road__manualText">
					언제든지 특별하고 찾아가고 싶은 지역의 명소를 감상하실 수 있도록 <strong class="strong">아름다운 길을 화면보호기에 담았습니다.</strong>
				</div>
				<div class="road__more">
					<Button class="commonButton__button" @click="toggleUseLayer" :title="isUseVisible ? '사용법 닫기' : '사용법 보기'">
						<span class="commonButton__text">사용법 보기</span>
						<i aria-hidden="true" :class="isUseVisible ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" />
					</Button>
				</div>
			</div>
		</div>

		<div class="road__howUse" v-if="isUseVisible">
			<div class="road__howUseHeader">
				<p class="road__howUseHeaderTitle">아름다운 길 화면보호기 사용법</p>
				<Button class="commonButton__button" title="아름다운 길 화면보호기(31.4MB)" @click="beautifulRoadScreensaver">
					<span class="commonButton__text">아름다운 길 화면보호기(31.4MB)</span>
					<i aria-hidden="true" class="bi bi-download" />
				</Button>
			</div>
			<div class="road__howUseContent">
				<ol class="road__howUseContentList">
					<li>
						<div class="road__howUseContentTitle">
							<span class="road__howUseContentNumber">1</span>
							상단의 <span class="commonColor01">[아름다운 길 화면보호기 다운로드]</span> 버튼을 이용해 화면보호기 파일을 다운로드 받습니다.
						</div>
					</li>
					<li>
						<div class="road__howUseContentTitle">
							<span class="road__howUseContentNumber">2</span>
							다운로드 파일에서 오른쪽 마우스 클릭 후<span class="commonColor01">[설치]</span> 항목을 선택합니다.
						</div>
						<div class="road__howUseContentImage">
							<img src="@images/story/pc/howtouse-1.png" alt="설치 항목선택 화면예시" />
						</div>
					</li>
					<li>
						<div class="road__howUseContentTitle">
							<span class="road__howUseContentNumber">3</span>
							화면보호기 설정 화면이 나타나며 <span class="commonColor01">[확인]</span> 버튼을 누르면 다운로드 받은 '아름다운길 화면보호기'가 적용됩니다.
						</div>
						<div class="road__howUseContentImage">
							<img src="@images/story/pc/howtouse-2.png" alt="화면보호기 설정 화면예시" />
						</div>
					</li>
				</ol>
				<p class="blind">아름다운 길 화면 보호기 예시</p>
				<ul class="road__howUseContentSample">
					<li>
						<img src="@images/story/pc/howtouse-3.png" alt="아름다운길 화면보호기 사용시 적용 예시 화면-1" />
					</li>
					<li>
						<img src="@images/story/pc/howtouse-4.png" alt="아름다운길 화면보호기 사용시 적용 예시 화면-2" />
					</li>
					<li>
						<img src="@images/story/pc/howtouse-5.png" alt="아름다운길 화면보호기 사용시 적용 예시 화면-3" />
					</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="road__wrap">
		<ul class="road__list">
			<li v-for="item in searchDataList" :key="item.roadData">
				<figure>
					<div class="road__image">
						<img :src="item.thumbImage" :alt="`${item.gallPhotoRoadNmAddr}(${item.gallPhotoSrcDtlCn}作)`" v-if="item.thumbImage != null"/>
					</div>
					<figcaption class="road__detail">
						<p class="road__text">{{ item.gallPhotoRoadNmAddr }}</p>
						<div class="road__title">{{ item.gallPhotoNm }}</div>
					</figcaption>
				</figure>
				
				<Button class="road__button" :id="'bgImgDetailClose_' + item.gallBbsMgno" :title="item.gallPhotoNm + ' 상세보기'" @click.prevent="fnDtlView(item)">
					<span class="blind">상세정보 보기</span>
				</Button>
			</li>
		</ul>
	</div>

	<Dialog class="commonDialog dialogRoadName" id="dlg" :visible="dialogVisible" modal :closable="false"
		@hide="onHideDialog" :aria-controls="dialogVisible ? 'dlg' : null" :aria-expanded="dialogVisible ? true : false">
		<template #header>
			<Button id="dialogFocus" class="dialogCloseButton" @click="closeDialog">
				<i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
			</Button>
		</template>
	
		<dl class="dialogRoadName__header">
			<dt>{{ detailDataList.gallPhotoNm }}</dt>
			<dd>{{ detailDataList.gallPhotoRoadNmAddr }}</dd>
		</dl>
		
		<Button v-if="detailDataList.gallPhotoSrcCd == '10' || detailDataList.gallPhotoSrcCd == '30'"
			class="commonButton__button" title="아름다운길 이미지 다운로드" 
			@click="fnFileDwnld(detailDataList)">
			<span class="commonButton__text">{{ detailDataList.fileNm }}</span>
			<i aria-hidden="true" class="bi bi-download" />
		</Button>
		<p class="dialogRoadName__source" v-if="detailDataList.gallPhotoSrcCd == '20' || detailDataList.gallPhotoSrcCd == '30'">
			출처 : {{ detailDataList.sourceNm }}
		</p>
		<div class="dialogRoadName__info">
			<div class="dialogRoadName__imageBox">
				{{ detailDataList.dtlThmbFileNm }}
				<img :src="detailDataList.thumbImage" :alt="detailDataList.gallPhotoNm"  v-if="detailDataList.thumbImage != null"/>
			</div>
		</div>
		<div class="dialogRoadName__scrollWrap">
			<ul class="dialogRoadName__list">
				<div v-dompurify-html="detailDataList.gallPhotoExpln"></div>
			</ul>
			<!-- 
			<div v-if="detailDataList.gallPhotoSrcCd == '20'">
				<p class="dialogRoadName__original">※ 본 이미지에 대한 원본사진은 한국관광공사 홈페이지에서 제공받을 수 있습니다.</p>
				<div class="dialogRoadName__externalLinks">
					<a href="" title="한국관광공사 홈페이지 보기">한국관광공사 홈페이지 바로가기</a>
				</div>
			</div>
			 -->
		</div>
	</Dialog>

	<Panel class="section hasTable noHeader">
    	<TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
	</Panel>
</template>
<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import CustomPaginator from '@/components/paginator/CustomPaginator.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import Scrollpanel from 'primevue/scrollpanel'
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import {useLoadingStore} from "@/stores/ui.loading";

const loadingStore = useLoadingStore();

// const pageSize = ref();
const currentPage = ref(0);

let lastClickedButton = null;
const dialogVisible = ref(false);
const currentItem = ref(null);

//조회결과
const searchDataList = ref([]);
const searchDataListTmp = ref([]);
const detailDataList = ref([]);

//검색조건 초기화변수
const inqCndParams = reactive({
	pageable: {
	    page: 0,
    	size: 6,
	}
});

//페이징변수
const pageInfo = reactive({
	first: 0
	, totalRecords: 0
	, currentRecords: 0
	, totalPages: 0
	, page: 0			// 요청한 페이지 번호 (zero based)
	, size: 6			// 페이지당 항목 수
	, orders: [{
		property: ''	// 정렬할 속성 이름
		, direction: ''	// 정렬 방향 (ASC 또는 DESC)
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
	loadingStore.show();
	axios.post('/api/ahi/selectBgGalleryList', inqCndParams)
		.then((response) => {
			const data = response.data;
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				searchDataListTmp.value = data.results.content;
				pageInfo.totalRecords = data.results.totalElements;
		        pageInfo.currentRecords = data.results.numberOfElements;
	        	pageInfo.totalPages = data.results.totalPages;
				thumbnailsSet();
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
		.finally(() => {
			loadingStore.hide();
		})
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
}

//상세조회
const fnDtlView = (item) => {
	loadingStore.show();
	
	lastClickedButton = document.getElementById('bgImgDetailClose_' + item.id);
	currentItem.value = item;
	let params = {
		gallBbsMgno: item.gallBbsMgno
	};
	
	axios.post('/api/ahi/selectDtlBgGalleryView', params)
		.then((data) => {
			console.log("selectDtlBgGalleryView", data);
			thumbnailsSetDtl(data)
		})
		.catch(error => {
			console.error("error =>", error);
		})
}

//상세조회 썸네일 리스트
const thumbnailsSetDtl = async (data) => {
	let dataList = data.data;
	try {
		if (dataList.fileSn != null) {
			const innorixDownloadUrl = `/api/innorix/download`;
			const fileMgno = dataList.fileMgno;
			const fileSn = dataList.fileSn;
			const fileDownloadUrl = `${innorixDownloadUrl}/${fileMgno}/${fileSn}`;
			
			await axios.get(fileDownloadUrl, {responseType: 'blob'})
				.then(response => {
					const imageUrl = URL.createObjectURL(response.data);
					dataList.thumbImage = imageUrl;
				})
				.catch(error => {
					console.error("error =>", error);
				})
		}
		
		detailDataList.value = dataList;
		console.log('detailDataList', detailDataList);
		dialogVisible.value = true;
		loadingStore.hide();
	} catch (error) {
		let dataList = data.data;
		detailDataList.value = dataList;
	}
}

//아름다운 길 화면보호기 다운로드
const beautifulRoadScreensaver = async () => {
	loadingStore.show();
	let uldFileNm = 'BeautifulRoad-Screensaver.scr';
	let actlFileNm = '아름다운 길 화면보호기.scr';
	
	const downloadUrl = `/api/innorix/screensaver`;
	const fileDownloadUrl = `${downloadUrl}/${uldFileNm}/`;
	
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
		alert("파일을 다운로드할 수 없습니다.\n관리자에게 문의해주세요.");
   }
   loadingStore.hide();
}

//아름다운길 이미지 다운로드 
const fnFileDwnld = async (detailDataList) => {
	const fileMgno = detailDataList.fileMgno;
	const fileSn = detailDataList.fileSn;
	const gallPhotoSrcCd = detailDataList.gallPhotoSrcCd;
	const innorixDownloadUrl = `/api/innorix/download`;
	
	const fileDownloadUrl = `${innorixDownloadUrl}/${fileMgno}/${fileSn}`;

	try {
		if (gallPhotoSrcCd == '10' || gallPhotoSrcCd == '30') {
			const response = await axios({
				url: fileDownloadUrl,
				method: 'GET',
				responseType: 'blob'
			});
			const link = document.createElement('a');
			link.href = fileDownloadUrl;
			link.setAttribute('donwload', detailDataList.tmprFileNm || 'downloaded_file');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	} catch (error) {
		alert("파일을 다운로드할 수 없습니다.\n관리자에게 문의해주세요.");
	}
}

//팝업 토글
const closeDialog = () => {
	dialogVisible.value = false;
	if (lastClickedButton) {
		lastClickedButton.focus();
	}
	detailDataList.value = [];
}

const onHideDialog = () => {
	lastClickedButton = null;
}

//사용법 토글
const isUseVisible = ref(false);

const toggleUseLayer = () => {
	isUseVisible.value = !isUseVisible.value;
}

onMounted(() => {
	fnSrch();
})
</script>
<style>
.visitkorea {
    color: #e85d50;
}
.goto_homepage {
    color: #e85d50;
}
.section-line {
    background: url(/src/assets/images/etc/section-line.png) repeat-x;
    padding-top: 16px;
    margin: 13px 0 13px 0;}
</style>