<template>
	<CommonBreadcrumb />
    <HeaderTitle title="공지사항" />

    <div class="viewDetails">
        <div class="viewDetails__header">
            <p class="viewDetails__title">{{ inqCndParams.ntcMttrTtlNm }}</p>
            <div class="viewDetails__date">{{ inqCndParams.frstRegDt }}</div>
        </div>
        <dl class="viewDetails__info">
            <dt>작성자</dt>
            <dd>{{ inqCndParams.rgtrNm }}</dd>
            <dt>조회</dt>
            <dd>{{ inqCndParams.inqCnt }}</dd>
            <dt>출처</dt>
            <dd>{{ inqCndParams.srcNm }}</dd>
        </dl>
        <ul class="viewDetails__file" v-if="inqCndParams.fileList">
            <li v-for="(files, index) in inqCndParams.fileList" :key="index">
                <Button>
                    <span class="bi bi-paperclip">
                        <span class="blind">첨부된 파일</span>
                    </span>
                    <span class="viewDetails__filename">{{ files.fileNm }} </span>

                    <span @click="fnFileDwnld(files)" class="bi bi-download">
                        <span class="blind">다운로드</span>
                    </span>
                </Button>
            </li>
        </ul>
    </div>
    <div class="viewDetails__content" v-dompurify-html="inqCndParams.extractCn" style="white-space: pre-wrap;">
    </div>
    <div class="viewDetails__button">
        <Button @click.prevent="fnSrchMove">목록<i class="bi bi-arrow-right" /></Button>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import Button from 'primevue/button'
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import ContentTitle from '@/components/title/ContentTitle.vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import {useLoadingStore} from "@/stores/ui.loading";

const loadingStore = useLoadingStore();

//라우터
const router = useRouter();
const route = useRoute();

const inqCndParams = reactive({});

//페이지 번호
const pageNumberDetail = ref(route.query.pageNumber);

//상세조회
const fnDtlSrch = () => {
	loadingStore.show();
	axios.post('/api/ahh/selectDtlNoticeView', {"ntcMttrMgno" : inqCndParams.ntcMttrMgno})
		.then((response) => {
			if(response.data) {
				Object.assign(inqCndParams, response.data);
				inqCndParams.extractCn = extractContent(inqCndParams.ntcMttrCn);
			}
		})
        .catch((error) => {
        	console.error("error =>", error);
        })
    	.finally(() => {
    		loadingStore.hide();
    	})
}

//목록이동
const fnSrchMove = () => {
	router.push({ 
		path: '/ahh/ahhNoticeBoardList',
        query:{pageNumberDetail :pageNumberDetail.value} 
	});
}

//파일 다운로드
const fnFileDwnld = async (files) => {
	const innorixDownloadUrl = `/api/innorix/download`
	const fileMgno = files.fileMgno;
	const fileSn = files.fileSn;
	const fileDownloadUrl = `${innorixDownloadUrl}/${fileMgno}/${fileSn}`;
	try {
		const response = await axios({
			url: fileDownloadUrl,
			method: 'GET',
			responseType: 'blob'
		});
		const link = document.createElement('a');
		link.href = fileDownloadUrl;
		link.setAttribute('donwload', files.tmprFileNm || 'downloaded_file');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} catch(error) {
		alert("파일을 다운로드할 수 없습니다.\n관리자에게 문의해주세요.");
	}
}

const extractContent = (htmlContent) => {
	const div = document.createElement('div');
	div.innerHTML = htmlContent;
	
	const allowedTags = ['IMG', 'BR', 'A', 'SPAN', 'P', 'UL'];
	const elements = div.querySelectorAll('*');
	
	elements.forEach(element => {
		if(!allowedTags.includes(element.tagName)) {
			element.outerHTML = element.innerHTML;
		}
	});
	
	return div.innerHTML;
}

onMounted(async () => {
	if(route.query.ntcMttrMgno){
		inqCndParams.ntcMttrMgno = route.query.ntcMttrMgno;
		await fnDtlSrch();
	}
})

</script>
<style lang="scss" scoped>
</style>