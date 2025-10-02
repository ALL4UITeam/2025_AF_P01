<script setup>
    import { onMounted, ref, onBeforeUnmount, computed ,watch, nextTick } from "vue";
   
</script>

<template>

<div class="addressChangeService__wrap">
        <div class="addressChangeService__inner fixed">
        <div class="addressChangeService__title">주소변경 서비스</div>
        <p class="addressChangeService__subTitle">공공 서비스</p>

        <a href="javascript:void(0);" title="주소 일괄정정 신청 새창 바로가기" class="addressChangeService__link">
            <img src="@/assets/images/common/img-logo-government-24.png" alt="정부 24">
            주소 일괄정정 신청
        </a>
        <a href="https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=13100000016" target="_blank" title="온라인 전입신고 새창 바로가기" class="addressChangeService__link">
            <img src="@/assets/images/common/img-logo-government-24.png" alt="정부 24">
            온라인 전입신고
            </a>
        <a href="https://service.epost.go.kr/front.RetrieveAddressMoveInfo.postal" target="_blank" title="우편물 전송서비스 새창 바로가기" class="addressChangeService__link post">
            <img src="@/assets/images/common/img-logo-koreapost.png" alt="우정사업본부">
            주거이전 우편물<br>전송서비스
        </a>

        <p class="addressChangeService__subTitle">민간 서비스</p>

        <a href="https://www.ktmoving.com" target="_blank" title="주소변경 신청 새창 바로가기" class="addressChangeService__link kt">
            <img src="@/assets/images/common/img-logo-ktmoving.png" alt="kt moving">
            주소변경 신청<br>(은행,카드사 등)
        </a>
    </div>
</div>

</template>



