<template>
    <CommonBreadcrumb />
    <HeaderTitle title="찾아오시는 길" />

    <div class="common__box directions__wrap">
        <div class="directions__map">
            <img src="@images/etc/img_directions.png" alt="세종특별자치시 정부 2청사로 13 (나성동)" />
            <div class="directions__button">
                <Button class="commonButton__button" title="도로명주소 지도보기">
                    <span class="commonButton__text">도로명주소 지도보기</span>
                    <i aria-hidden="true" class="bi bi-box-arrow-up-right" />
                </Button>
            </div>
        </div>
        <div class="directions__address">
            <h4 class="directions__addressTitle">주소</h4>
            <ul class="directions__addressList">
                <li>
                    <span class="directions__addressSub">행정안전부 본관</span>
                    30112 세종특별자치시 도움6로 42 (어진동)
                </li>
                <li>
                    <span class="directions__addressSub">행정안전부 별관</span>
                    30112 세종특별자치시 가름로 143 (어진동)
                </li>
            </ul>
        </div>
        <div class="directions__traffic">
            <h4 class="directions__trafficTitle">교통편</h4>
            <h5 class="directions__trafficSubTitle">행정안전부(세종청사)</h5>
            <ul class="directions__trafficList">
                <li>
                    <strong class="directions__trafficListTitle">대전역 출발 → 정부 세종청사 도착<span>(예상 소요시간 : 약 60분)</span></strong>
                    - 대전역 BRT 버스정류장 승차(B1번) → 정부세종청사북측 하차 → 제9주차장 방향(약 473m) 이동
                </li>
                <li>
                    <strong class="directions__trafficListTitle">오송역 출발 → 정부 세종청사 도착<span>(예상 소요시간 : 약 30분)</span></strong>
                    - 오송역 BRT 버스정류장 승차(B1번, B2번) → 정부세종청사북측 하차 → 제9주차장 방향(약 494m) 이동
                </li>
                <li>
                    <strong class="directions__trafficListTitle">조치원역 출발 → 정부 세종청사 도착<span>(예상 소요시간 : 약 34분)</span></strong>
                    - 조치원역 버스정류장 승차(801번) → 제3주차장 하차 → 도보로 약 298m 이동
                </li>
            </ul>
            <h5 class="directions__trafficSubTitle">행정안전부 별관(임차청사)</h5>
            <ul class="directions__trafficList">
                <li>
                    <strong class="directions__trafficListTitle">대전역 출발 → 임차청사 도착<span>(예상 소요시간 : 약 60분)</span></strong>
                    - 대전역 BRT 버스정류장 승차(B1번) → 정부세종청사남측 정류장 하차 → 청사까지 약 507m 이동
                </li>
                <li>
                    <strong class="directions__trafficListTitle">오송역 출발 → 정부 세종청사 도착<span>(예상 소요시간 : 약 30분)</span></strong>
                    - 오송역 BRT 버스정류장 승차(B1번, B2번) → 정부세종청사북측 하차 → 제9주차장 방향(약 494m) 이동
                </li>
                <li>
                    <strong class="directions__trafficListTitle">조치원역 출발 → 정부 세종청사 도착<span>(예상 소요시간 : 약 34분)</span></strong>
                    - 조치원역 버스정류장 승차(801번) → 제3주차장 하차 → 도보로 약 298m 이동
                </li>
            </ul>
        </div>

    </div>
    
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb'
import HeaderTitle from '@components/title/HeaderTitle.vue';
import CommonBreadcrumb from '@/components/breadcrumb/CommonBreadcrumb.vue';
</script>