<template>
  <CommonBreadcrumb />
  <HeaderTitle title="국가지점번호 소개" />

  <IntroductionTitle title="국가지점번호란?">
    <div class="national-point-intro">
      <p>
        각종 관할구역(통계, 우편, 소방, 경찰 등)을 <br />
        관리하기 위해 나눈 도로명주소를 기반으로 국토를 읍·면·동의 면적보다 작게 <br />
        일정한 경계를 정하여 나눈 구역
      </p>
      <div class="image"><img src="@/assets/images/introduction/point/img-1.png" alt=""></div>
    </div>
  </IntroductionTitle>
  <IntroductionSection title="국가지점번호 표기">
    <div class="national-point-address">
      <div class="address-sample">
        <div class="box"><span>예시</span><b>라마 2120 0425</b></div>
      </div>
      <ul class="national-point-desc">
        <li>산악 등에는 국가지점번호를 사용하여 모든 공간을 주소로 표시</li>
        <li>한글 2글자 + 숫자 8자리</li>
      </ul>
    </div>
  </IntroductionSection>
  <IntroductionSection title="국가지점번호 예시">
    <div class="national-point-example">
      <div class="item" v-for="(item, idx) in exampleList" :key="idx">
        <strong>{{ item.title }}</strong>
        <div class="image-box"><img :src="item.image" alt=""></div>
      </div>
    </div>
  </IntroductionSection>
</template>
  <script setup>
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import IntroductionSection from "@/components/introduction/IntroductionSection.vue";
import IntroductionTitle from "@/components/introduction/Title.vue";
import HeaderTitle from "@/components/title/HeaderTitle.vue";

const exampleList = [
  {
    title: '산악지대',
    image: '/src/assets/images/introduction/point/img-2.png',
  },
  {
    title: '해안가, 위험지대',
    image: '/src/assets/images/introduction/point/img-3.png',
  },
];
  </script>