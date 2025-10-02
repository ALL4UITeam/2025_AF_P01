<script setup>
    import {ref} from "vue";
    const todayNot = ref(false);
</script>

<template>
    <div class="mainLayerPopup" style="right:100px;top:210px;">
        <p class="mainLayerPopup__title">수상시설물 주소 부여 관련<br />변경사항 안내</p>
        <div class="mainLayerPopup__inner">
            <p class="mainLayerPopup__text">
                주소정보누리집을 이용해주셔서 감사합니다.<br />
                수상시설물에 대한 주소 부여와 관련하여<br />
                도로면주소 표기 및 유통에 대한 서비스 변경을 안내하오니,<br />
                자세한 사항은 아래의 '변경사항 상세보기'를 참고하시기 바랍니다.
            </p>
            <dl class="mainLayerPopup__info">
                <dt>변경일자</dt>
                <dd>2025년 9월 30일</dd>
                <dt>변경대상</dt>
                <dd>주소정보누리집 및 주소기반 산업지원서비스<br />검색 aput 유통 연계</dd>
            </dl>
        </div>
        <div class="mainLayerPopup__function">
            <a href="#none" class="mainLayerPopup__link" title="변경사항 상세보기">변경사항 상세보기</a>
        </div>
        <div class="mainLayerPopup__footer">
            <div class="mainLayerPopup__footerCheck">
                <input id="not" type="checkbox" v-model="todayNot" :binary="true" />
                <label for="not">오늘 하루 보지 않기</label>
            </div>
            <button class="mainLayerPopup__close">
                <i aria-hidden="true" class="bi bi-x-lg"></i>
                <span class="blind">닫기</span>
            </button>
        </div>
    </div>

</template>


