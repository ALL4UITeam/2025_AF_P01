<template>

	<CommonBreadcrumb />

    <HeaderTitle title="주소동일성 영문증명서 발급" />

    <div class="enCertificate__explanation">
        <div class="enCertificate__innerBox">
            <div class="enCertificate__introduction">
                <p class="enCertificate__text">수출기업 등 국외에서 도로명주소와 지번의 관계를 입증하는 서류(영문)가 필요하신 기관을 대상으로 발급해드립니다.</p>
                <p class="enCertificate__tip">
                    <span class="enCertificate__bullet">※</span> 국내에서 도로명주소와 지번의 관계를 입증하는 서류(국문)가 필요하신 경우에는 
                    <strong class="enCertificate__strong">'도로명주소대장'</strong>을 발급 받으시기 바랍니다.<br />
                    <a class="commonlink" href="https://www.gov.kr/main?a=AA020InfoCappViewApp&amp;HighCtgCD=A02001&amp;CappBizCD=13110000022&amp;tp_seq=01" title="정부24 새창으로 이동" target="_blank">정부24(인터넷)</a> /
                    <strong class="enCertificate__strong02">시ㆍ군ㆍ구 민원실 / 읍ㆍ면ㆍ동 주민센터</strong>를 통해 발급 신청이 가능합니다.
                </p>
            </div>
            <div class="enCertificate__example">
                주소동일성 영문증명서
                <Button class="commonButton__button exampleButton" title="발급예시 보기" @click="onShowExampleDialog">
                    <span class="commonButton__text">발급예시 보기</span>
                    <i aria-hidden="true" class="bi bi-arrow-right" />
                </Button>
            </div>
        </div>
    </div>

    <div class="common__box enCertificate__wrap">
        <div class="enCertificate__guide">
            <div class="enCertificate__guideHeader">
                <h4 class="enCertificate__guideTitle">
                    주소동일성 영문증명서 
                    <strong class="enCertificate__guideSubTitle">신청 및 발급 절차 안내</strong>
                </h4>
                <p class="enCertificate__guideText">신청자와 요청한 증명서의 수령자의 동일인 여부를<br />확인하기 위해 본인인증 절차가 필요합니다.</p>

                <ul class="enCertificate__function">
                    <li>
                        <Button @click.prevent="fnChgBuldNmIqy" class="commonButton__button" title="신청하기">
                            <span class="commonButton__text">신청하기</span>
                            <i class="bi bi-arrow-right" />
                        </Button>
                    </li>
                    <li>
                        <Button
                            class="commonButton__button"
                            @click.prevent="onShowDialog(item)"
                            title="신청내역 조회"
                            id="dialogFocusInq"
                        >
                            <span class="commonButton__text">신청내역 조회</span>
                            <i class="bi bi-arrow-right" />
                        </Button>
                    </li>
                </ul>
            </div>
            <div class="enCertificate__guideContent">
                <h5 class="enCertificate__guideReceipt">주소동일성 영문증명서 신청 및 수령 안내</h5>
                <ol class="enCertificate__guideList">
                    <li><span class="enCertificate__guideNumber">1</span> 약관동의 및 본인인증 후 증명서 발급 신청서작성
                        <div class="enCertificate__guideTip">- (필수)신청정보 확인 서식 : 영문사업자등록증명</div>
                        <p class="enCertificate__guideTip"><span class="enCertificate__bullet">※</span> 영문사업자등록증명은 해당 시군구 세무서나 국세청 홈페이지 홈택스내의 증명발급서비스 이용</p>
                    </li>
                    <li><span class="enCertificate__guideNumber">2</span> 담당자 신청 내용 확인 및 처리 ( 소요기간 : 평균 약 2일 )</li>
                    <li><span class="enCertificate__guideNumber">3</span> 주소 동일성 영문증명서 파일 다운로드
                        <ol class="enCertificate__guideStepList">
                            <li>
                                <span class="enCertificate__guideStep">Step 01</span>
                                <strong class="enCertificate__guidetheme">신청내역 조회</strong>
                            </li>
                            <li>
                                <span class="enCertificate__guideStep">Step 02</span>
                                <strong class="enCertificate__guidetheme">본인인증</strong>
                            </li>
                            <li> 
                                <span class="enCertificate__guideStep">Step 03</span>
                                <strong class="enCertificate__guidetheme">발급내역 확인</strong>
                            </li>
                        </ol>

                        <ul class="enCertificate__guideDownTip">
                            <li>- 온라인 신청 시 영문증명서는 PDF파일로 제공</li>
                            <li>- 증명서 원본의 경우, 사전 연락 후 정부세종청사로 내방 시 발급 가능(무료)</li>
                            <li>- <strong class="enCertificate__guideinqiry">문의전화 : <span class="font_sky">044-205-3557</span></strong></li>
                        </ul>
                    </li>
                </ol>
            </div>
        </div>
    </div>

    <Certification :show="dialogVisible" :redirectTo="'/ahh/ahhEngAddrIdentityList'" @popupClose="closeDialog" @job="fnMoveList"/>

	<Dialog 
        class="commonDialog dlgExample"
        id="dlgExample" 
        :visible="dialogExampleVisible" 
        modal        
        :closable="false" 
        @hide="onHideExampleDialog"
        :aria-controls="dialogExampleVisible ? 'dlgExample' : null"
        :aria-expanded="dialogExampleVisible ? true : false"
    >
        <template #header>      
            <Button id="dialogExampleFocus" class="dialogCloseButton" @click="closeExampleDialog">
                <i aria-hidden="true" class="bi bi-x"></i>
                <span class="blind">팝업닫기</span>
            </Button>
        </template>
        <ContentTitle title="주소동일성 영문증명서 예시 보기" fontSize="30px" marginTop="0" mobileFontSize="20px" />
        <Scrollpanel class="enCertificateExample__wrap">
            <div class="enCertificateExample">
                <img src="@/assets/images/forum/img-certificate.png" alt="주소동일성 영문증명서 예시" />
            </div>
        </Scrollpanel>
    </Dialog>

</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRouter, useRoute } from 'vue-router';

import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import Scrollpanel from 'primevue/scrollpanel';
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import ContentTitle from '@/components/title/ContentTitle.vue';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import Certification from "@/components/common/CertificationComponent.vue";

//라우터
const router = useRouter();
const route = useRoute();

//신청하기
const fnChgBuldNmIqy = () => {
	router.push({
		path: '/ahh/ahhEngAddrIdentityWrite'
	})
}

//인증팝업
const dialogVisible = ref(false);

//인증팝업 열기
const onShowDialog = (item) => {
    dialogVisible.value = true;
    setTimeout(() => {
        document.querySelector('#dialogFocus').focus();
    }, 0);
}
//인증팝업 닫기
const closeDialog = () => {
    dialogVisible.value = false;
    document.querySelector('#dialogFocusInq').focus();
}

const fnMoveList = () => {
	router.push({
		path: '/ahh/ahhEngAddrIdentityList'
	})
}

//발급예시 팝업
const dialogExampleVisible = ref(false);
const targetButton = ref(null);

//발급예시 보기
const onShowExampleDialog = (event) => {
    dialogExampleVisible.value = true;
    targetButton.value = event.currentTarget;
    setTimeout(() => {
        document.querySelector('#dialogExampleFocus').focus();
    }, 0);
}
//발급예시 닫기
const closeExampleDialog = () => {
    dialogExampleVisible.value = false;
}
//발급예시 닫은 후 포커스
const onHideExampleDialog = () => {
    if(targetButton.value) {
        targetButton.value.focus();
    }
}
</script>