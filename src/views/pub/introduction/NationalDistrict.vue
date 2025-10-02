<template>
  <CommonBreadcrumb />
  <HeaderTitle title="국가기초구역 소개" />

  <IntroductionTitle title="국가기초구역이란?">
    <div class="national-intro">
      <p>
        각종 관할구역(통계, 우편, 소방, 경찰 등)을 <br />
        관리하기 위해 나눈 도로명주소를 기반으로 국토를 읍·면·동의 면적보다 작게 <br />
        일정한 경계를 정하여 나눈 구역
      </p>
      <div class="image"><img src="@/assets/images/introduction/national/img-1.png" alt=""></div>
    </div>
  </IntroductionTitle>
  <IntroductionSection title="구역번호란?">
    <div class="zone-number border-container">
      <div class="zone-number-list">
        <div class="zone-number-item"
        v-for="item in zoneNumberList"
        :key="item.label">
          <div class="labels">{{ item.label }}</div>
          <div class="values">{{ item.value }}</div>
        </div>
      </div>

      <ul class="zone-number-desc">
        <li>국가기초구역마다 부여한 번호로 5자리 숫자로 구성
        <br>
        <span>* 앞 2자리(시·도 구분) → 끝 3자리(시·군·구 내 일련번호)</span></li>
        <li>국가기초구역번호는 우편번호로 사용</li>
      </ul>
    </div>
  </IntroductionSection>
  <IntroductionSection title="국가기초구역 예시">
    <div class="national-example-box border-container white">
      <div class="image-box"><img src="@/assets/images/introduction/national/map.png" alt=""></div>
      <div class="text">전라북도 전주시 54847</div>
    </div>
  </IntroductionSection>
</template>
<script setup>
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import IntroductionSection from "@/components/introduction/IntroductionSection.vue";
import IntroductionTitle from "@/components/introduction/Title.vue";
import HeaderTitle from "@/components/title/HeaderTitle.vue";


const zoneNumberList = [
  {
    label: '서울',
    value: '01~09'
  },
  {
    label: '경기',
    value: '10~20'
  },
  {
    label: '인천',
    value: '21~23'
  },
  {
    label: '강원',
    value: '24~26'
  },
  {
    label: '충북',
    value: '27~29'
  },
  {
    label: '세종',
    value: '30'
  },
  {
    label: '충남',
    value: '31~33'
  },
  {
    label: '대전',
    value: '34~35'
  },
  {
    label: '경북',
    value: '36~40'
  },
  {
    label: '대구',
    value: '41~43'
  },
  {
    label: '울산',
    value: '44~45'
  },
  {
    label: '부산',
    value: '46~49'
  },
  {
    label: '경남',
    value: '50~53'
  },
  {
    label: '전북',
    value: '54~56'
  },
  {
    label: '전남',
    value: '57~60'
  },
  {
    label: '광주',
    value: '61~62'
  },
  {
    label: '제주',
    value: '63'
  }
]

</script>