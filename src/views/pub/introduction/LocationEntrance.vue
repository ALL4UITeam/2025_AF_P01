<template>
    <CommonBreadcrumb />
    <HeaderTitle title="장소지능 출입구 소개" />
  
    <IntroductionTitle title="장소지능 출입구정보란?">
      <div class="desc">기존 건물의 주 출입구의 정보제공에서 다양한 이동체별(교통약자, 로봇 등) 맞춤형 출입구 정보제공을 위한 출입구 정보제공 확대(출입구 유형 및 구분,  진입로 형태)</div>
      <div class="entrance-beforeafter">
        <div class="before">
          <strong>종전</strong>
          <div class="text">
            <div>건물 주 출입구</div>
            <div>-</div>
            <div>-</div>
            <div>-</div>
          </div>
        </div>
        <span class="arrow"><img src="@/assets/images/introduction/location/arrow.png" alt=""></span>
        <div class="after">
          <strong>개선</strong>
          <div class="text">
            <div><b>건물 주 출입구</b></div>
            <div><b>출입구 유형</b> (보행, 차량, 혼용)</div>
            <div><b>출입구 구분</b> (주/보조, 동 출입구, 주차장 출입구)</div>
            <div><b>진입로 형태</b> (수평, 경사, 계단, 엘리베이터 등)</div>
          </div>
        </div>
      </div>
    </IntroductionTitle>
    <IntroductionSection title="출입구 정보 구축 예시">
      <div class="entrance-example-box">
        <div class="image-box"><img src="@/assets/images/introduction/location/img-1.png" alt=""></div>
      </div>
    </IntroductionSection>
    
  </template>
  <script setup>
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import IntroductionSection from "@/components/introduction/IntroductionSection.vue";
import IntroductionTitle from "@/components/introduction/Title.vue";
import HeaderTitle from "@/components/title/HeaderTitle.vue";
  </script>