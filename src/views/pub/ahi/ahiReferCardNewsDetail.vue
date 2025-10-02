<template>
	<CommonBreadcrumb />
    <HeaderTitle title="카드뉴스" />

    <div class="viewDetails">
        <div class="viewDetails__header">
            <p class="viewDetails__title">{{ detailInfo.pstTtl }}</p>
            <div class="viewDetails__date">{{ detailInfo.frstRegDt }}</div>
        </div>
        <dl class="viewDetails__info">
            <dt>작성자</dt>
            <dd>{{ detailInfo.frstRegUserId }}</dd>
            <dt>조회</dt>
            <dd>{{ detailInfo.inqCnt }}</dd>
            <dt>출처</dt>
            <dd>{{ detailInfo.srcNm }}</dd>
        </dl>
        <ul class="viewDetails__file" v-if="detailInfo.fileMgno">
            <li v-for="(files, index) in fileList" :key="index">
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
    <div class="viewDetails__content" v-dompurify-html="detailInfo.pstCn" style="white-space: pre-wrap;">
    </div>
    <div class="viewDetails__button">
        <Button @click.prevent="fnSrchMove">목록<i class="bi bi-arrow-right" /></Button>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import Button from 'primevue/button'
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import ContentTitle from '@/components/title/ContentTitle.vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import {useLoadingStore} from "@/stores/ui.loading";

const loadingStore = useLoadingStore();

//라우터
const router = useRouter();
const route = useRoute();

const fileList = ref([]);

const detailInfo = reactive({});

const prRscntrMgno = ref(route.query.prRscntrMgno);

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

//상세조회
const fnDtlSrch = () => {
	loadingStore.show();
    axios.post('/api/ahi/selectDtlReferenceView', {"prRscntrMgno": prRscntrMgno.value})
        .then((data) => {
            if (data.data !== null) {
                Object.assign(detailInfo, data.data);
                detailInfo.extractCn = extractContent(detailInfo.prRscntrMgno);
                fileList.value = detailInfo.fileList;
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
		path: '/ahi/ahiReferCardNewsList' 
	});
}

//파일 다운로드
const innorixDownloadUrl = `/api/innorix/download`

const fnFileDwnld = async (files) => {
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

onMounted(async () => {
	fnDtlSrch();
})

</script>