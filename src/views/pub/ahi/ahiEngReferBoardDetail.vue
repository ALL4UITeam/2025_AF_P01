<template>
<div class="enContent type01">
    <HeaderTitle title="Publications" />

    <div class="viewDetails">
        <div class="viewDetails__header">
            <p class="viewDetails__title">{{ detailSearchData.pstTtl }}</p>
            <div class="viewDetails__date">{{ detailSearchData.frstRegDt }}</div>
        </div>
        <dl class="viewDetails__info">
            <dt>Poster</dt>
            <dd>{{ detailSearchData.frstRegUserId }}</dd>
            <dt>Read</dt>
            <dd>{{ detailSearchData.inqCnt }}</dd>
            <dt>Reference</dt>
            <dd>{{ detailSearchData.srcNm }}</dd>
        </dl>
        <ul class="viewDetails__file" v-if="detailSearchData.fileMgno">

            <li v-for="(files, index) in fileList" :key="index">
                <Button @click="fnFileDwnld(files)">
                    <span class="bi bi-paperclip">
                        <span class="blind">첨부된 파일</span>
                    </span>
                    <span class="viewDetails__filename">{{ files.fileNm }} </span>

                    <span class="bi bi-download">
                        <span class="blind">다운로드</span>
                    </span>
                </Button>
            </li>
        </ul>
    </div>
    <div class="viewDetails__content" v-dompurify-html="detailSearchData.pstCn" style="white-space: pre-wrap;">
    </div>
    <div class="viewDetails__button">
        <Button @click.prevent="fnSrchMove">list<i aria-hidden="true" class="bi bi-arrow-right" /></Button>
    </div>
</div>    
</template>
<style lang="scss" scoped>
@import url('@scss/contents/en/enMain.scss');
</style>
<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'
import HeaderTitle from '@components/title/HeaderTitle.vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

//라우터
const router = useRouter();
const route = useRoute();

//상세정보
const detailSearchData = reactive({});

//파일리스트
const fileList = ref([]);

//PK
const prRscntrMgno = ref(route.query.prRscntrMgno);

//목록 페이지 넘버
const pageNumberDetail = ref(route.query.pageNumber);

const extractContent = (htmlContent) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;

    const allowedTags = ['IMG', 'BR', 'A', 'SPAN', 'P', 'UL'];
    const elements = div.querySelectorAll('*');

    elements.forEach(element => {
        if (!allowedTags.includes(element.tagName)) {
            element.outerHTML = element.innerHTML;
        }
    });
    return div.innerHTML;
}

//상세조회
const fnDtlSrch = () => {
    let params = { prRscntrMgno: prRscntrMgno.value };
    
    axios.post('/api/ahi/selectDtlEngReferenceView', params)
		.then((response) => {
			if (response.data) {
				Object.assign(detailSearchData, response.data);
				detailSearchData.extractCn = extractContent(detailSearchData.prRscntrMgno);
				fileList.value = detailSearchData.fileList;
			}
		})
}

//목록이동
const fnSrchMove = () => {
    router.push({
        path: '/ahi/ahiEngReferBoardList',
        query: { pageNumberDetail: pageNumberDetail.value }
    });
}

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
    } catch (error) {
        alert("파일 다운로드를 실패하였습니다.")
    }
}

onMounted(async () => {
    fnDtlSrch();
})

</script>