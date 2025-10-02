<template>
  <CommonBreadcrumb />

  <HeaderTitle title="사물주소 소개" />

  <IntroductionTitle title="사물주소란?">
    <div class="text-content">
      <p class="definition">주소부여가 어려운 곳에 도로명과 기초번호를 이용하여 사물에 부여한 주소</p>
      <p class="purpose">안전 사고 발생 시 신속 대응 지원 및 내비게이션 등에 안내체계 마련을 위해 도로명과 기초번호를 이용하여 구성한 사물주소 정보를 제공.</p>
      <p class="footnote">* 기초번호 : 전신주 등에 표시</p>
    </div>
  </IntroductionTitle>

  <IntroductionSection title="사물주소 표기">
    <div class="grid-2">
      <div
      v-for="(item, idx) in objectAddressList"
      :key="idx"
      class="object-address-notation boxing-border"
      >
      <h4>{{ item.title }}</h4>
      <div class="sample-box box-gray">
        <div v-html="item.sample"></div>
        <span>예시</span>
      </div>
      <div class="text-info" v-html="item.text"></div>
      <div 
      class="image-box"
      :class="{ sky: idx === 1 }">
        <img :src="item.image" :alt="item.alt" />
      </div>
      </div>
    </div>
  </IntroductionSection> 

  <IntroductionSection title="사물/공간주소 정보 시설 유형">
    <div class="facility-card-grid">
    <FacilityCard
      title="육교승강기"
      image="/src/assets/images/introduction/object/img-3.png"
      :bullets="[
        '도로와 육교간 이동을 위하여 설치한 승강기',
        '육교승강기의 형상을 면형으로 표시',
        '승강기 출입구의 중심점'
      ]"
    />
    <FacilityCard
      title="둔치 주차장"
      image="/src/assets/images/introduction/object/img-4.png"
      :bullets="[
        '하천의 둔치에 설치된 노외 주차장',
        '둔치주차장의 주차면과 차량 이동이 가능한 <br>범위 포함한 경계를 면형으로 표시',
        '도로와 연결된 출입구의 중심점'
      ]"
    />
    <FacilityCard
      title="둔치 주차장"
      image="/src/assets/images/introduction/object/img-5.png"
      :bullets="[
        '긴급대피 목적으로 지진 발생 시 대피지구 내 <br>10분 내 대피 가능한 안전장소',
        '건물과 옹벽 담장 등의 시설을 제외한 대피장소 <br>(공터 등)의 경계를 면형으로 표시',
        '출입구가 있는 경우 도로와 연결된 출입구의 중심점, 출입구가 없이 개방된 경우 다중의 접근이 편리한 통행로의 중심점'
      ]"
    />
    <FacilityCard
      title="버스정류장"
      image="/src/assets/images/introduction/object/img-6.png"
      :bullets="[
        '버스가 사람을 태우거나 내려 주기 위하여 <br>머무르는 일정한 장소',
        '버스정류장 안내표지 또는 승차대의 중심점을 <br>점형으로 표시',
        '버스정류장 안내표지 또는 승차대의 중심점'
      ]"
    />
    <FacilityCard
      title="택시승강장"
      image="/src/assets/images/introduction/object/img-7.png"
      :bullets="[
        '택시운송사업용 자동차가 승객을 승하차 시키거나, <br>태우기 위한 대기장소(구역)',
        '택시승강장 안내표지 또는 승차대의 중심점을 <br>점형으로 표시',
        '택시승강장 안내표지 또는 승차대의 중심점'
      ]"
    />
    <FacilityCard
      title="졸음쉼터"
      image="/src/assets/images/introduction/object/img-8.png"
      :bullets="[
        '졸음운전으로 인한 사고 예방 및 휴식 공간 제공을 <br>위해 휴게소간 간격이 먼 구간에 설치하여 <br>이용객에게 휴식공간을 제공하는 장소',
        '졸음쉼터로 사용되는 주차장 시설 및 가속 감속 <br>차선을 포함하여 면형으로 표시',
        '도로의 실폭에서 졸음쉼터의 가속 감속차선이 <br>시작되는 지점'
      ]"
    />
    <FacilityCard
      title="지진해일긴급대피장소"
      image="/src/assets/images/introduction/object/img-9.png"
      :bullets="[
        '긴급(임시) 피난을 목적으로 지진해일 발생 시 <br>10분 내 대피 가능한 안전장소',
        '대피장소로 운동장, 주차장, 건물옥상, 도로위 등의 <br>경계를 면형으로 표시',
        '출입구가 도로와 연결된 경우 출입구의 중심점, <br>출입구가 없이 개방된 경우 다중의 접근이 편리한 <br>통행로의 중심점'
      ]"
    />
    <FacilityCard
      title="소공원"
      image="/src/assets/images/introduction/object/img-10.png"
      :bullets="[
        '소규모 토지를 이용하여 도시민의 휴식 및 정서 함양을 위해 설치하는 공원',
        '운동 및 놀이시설, 휴게시설 등 부대시설 포함한 공원 경계를 면형으로 표시',
        '출입구가 도로와 연결된 경우 출입구의 중심점, 출입구가 없이 개방된 경우 다중의 접근이 편리한 통행로의 중심점'
      ]"
    />
    <FacilityCard
      title="어린이 공원"
      image="/src/assets/images/introduction/object/img-11.png"
      :bullets="[
        '어린이 보건 및 정서생활의 향상에 이바지하기 <br>위하여 설치하는 공원',
        '운동 및 놀이시설, 휴게시설 등 부대시설 모두 <br>포함한 공원 경계를 면형으로 표시',
        '출입구가 도로와 연결된 경우 출입구의 중심점, <br>출입구가 없이 개방된 경우 다중의 접근이 편리한 <br>통행로의 중심점'
      ]"
    />
    <FacilityCard
      title="비상급수시설"
      image="/src/assets/images/introduction/object/img-12.png"
      :bullets="[
        '전쟁, 지진, 풍수해 등의 자연재해로 국가적 <br>비상재난이 발생하였을 때, 상수도 파괴와 오염에 <br>대비하여 식수, 생활용수 확보를 위해 마련된 시설',
        '비상급수시설의 중심점을 점형으로 표시',
        '비상급수시설의 중심점'
      ]"
    />
    <FacilityCard
      title="인명구조함"
      image="/src/assets/images/introduction/object/img-13.png"
      :bullets="[
        '인명을 구조하기 위해 필요한 장비를 보관하는 <br>시설이나 장치',
        '인명구조함 중심점을 점형으로 표시',
        '인명구조함의 중심점'
      ]"
    />
    <FacilityCard
      title="드론 배달점"
      image="/src/assets/images/introduction/object/img-14.png"
      :bullets="[
        '물품을 적재하여 드론이 이륙하고, 배달을 위해 <br>착륙 후 물품을 인출할 수 있는 주소기반 이착륙 지점',
        '드론 배달점 설치 지점을 점형으로 표시',
        '드론 배달점 설치 지점'
      ]"
    />
    <FacilityCard
      title="주차장"
      image="/src/assets/images/introduction/object/img-15.png"
      :bullets="[
        '도로의 노면 또는 노면외의 일정한 구역에 설치된 <br>주차장',
        '노상주차장의 주차면과 주차장 경계를 면형으로 <br>표시',
        '출입구가 있는 경우, 도로와 연결된 출입구의 <br>중심점 또는 출입구가 없는 경우 차량이 진입하는 <br>방향의 첫 번째 주차면 경계의 중심점'
      ]"
    />
    <FacilityCard
      title="전기차충전소"
      image="/src/assets/images/introduction/object/img-16.png"
      :bullets="[
        '전기를 연료로 사용하는 자동차에 전기를 충전하기 <br>위한 장소',
        '전기차 충전시설과 주차면을 포함한 경계를 <br>면형으로 표시',
        '차량이 진입하는 방향의 충전소 경계의 중심점'
      ]"
    />
    <FacilityCard
      title="공중전화"
      image="/src/assets/images/introduction/object/img-17.png"
      :bullets="[
        '일반인이 누구나 이용할 수 있도록 공공장소에 <br>설치된 전화기',
        '공중전화 또는 각 공중전화부스의 중심점을 <br>점형으로 표시',
        '공중전화 또는 각 공중전화부스의 중심점'
      ]"
    />
    <FacilityCard
      title="우체통"
      image="/src/assets/images/introduction/object/img-18.png"
      :bullets="[
        '편지나 우편물을 수령하고 보관하는 장치',
        '우체통의 중심점을 점형으로 표시',
        '우체통의 중심점'
      ]"
    />
    <FacilityCard
      title="전동휠체어 급속충전기"
      image="/src/assets/images/introduction/object/img-19.png"
      :bullets="[
        '노인 및 장애인의 편의를 위해 전동휠체어 및 <br>전동스쿠터를 충전할 수 있도록 설치한 장치',
        '전동휠체어 급속충전기의 중심점을 점형으로 표시',
        '전동휠체어 급속충전기의 중심점'
      ]"
    />
    <FacilityCard
      title="자전거거치대"
      image="/src/assets/images/introduction/object/img-20.png"
      :bullets="[
        '자전거의 주차, 보관 등을위해 자전거를 지탱할 수 <br>있도록 공공장소에 설치한 장치',
        '자전거거치대에 해당하는 경계를 면형으로 표시',
        '자전거거치대 형상의 경계선 중 도로와 가장 <br>인접한 경계선의 중심점'
      ]"
    />
    <FacilityCard
      title="비상소화장치"
      image="/src/assets/images/introduction/object/img-21.png"
      :bullets="[
        '소방호스 등을 소방용수시설에 연결하여 화재를 <br>진압하는 시설이나 장치',
        '비상소화장치의 중심점을 점형으로 표시',
        '비상소화장치의 중심점'
      ]"
    />
    <FacilityCard
      title="무더위쉼터"
      image="/src/assets/images/introduction/object/img-22.png"
      :bullets="[
        '더위를 피해 쉴 수 있도록 공공시설, 광장, <br>공원 등에 설치 또는 지정한 시설물 및 장소',
        '무더위쉼터 시설물 및 장소의 중심점을 <br>점형으로 표시',
        '무더위쉼터 시설물 및 장소의 중심점'
      ]"
    />
    <FacilityCard
      title="민방위 대피시설"
      image="/src/assets/images/introduction/object/img-23.png"
      :bullets="[
        '민방위사태 발생시 주민의 생명과 재산을 보호하기 <br>위해 지정된 시설',
        '민방위 대피시설 출입구의 중심을 점형으로 표시',
        '민방위 대피시설 출입구의 중심점'
      ]"
    />
    <FacilityCard
      title="어린이 놀이시설"
      image="/src/assets/images/introduction/object/img-24.png"
      :bullets="[
        '어린이 놀이기구가 설치된 실외의 놀이터',
        '어린이 놀이시설에 해당하는 경계를 면형으로 표시',
        '출입구가 있는 경우 도로와 연결된 출입구의 <br>중심점 또는 출입구가 없이 개방되어 있는 경우 <br>다중의 접근이 편리한 통행로의 중심점'
      ]"
    />
    <FacilityCard
      title="음식판매 자동차 허가구역"
      image="/src/assets/images/introduction/object/img-25.png"
      :bullets="[
        '음식판매 자동차(푸드트럭) 영업이 가능하도록 지방자치 단체에서 조례로 정한 구역',
        '음식판매 자동차(푸드트럭) 영업장소 구획면이 표시된 경계를 면형으로 표시 *구획면이 없는 경우 영업중인 푸드트럭을 모두 포함하는 경계를 면형으로 표시',
        '출입구가 있는 경우 도로와 연결된 출입구의 중심점 또는 출입구가 없이 개방되어 있는 경우 다중의 접근이 편리한 통행로의 중심점'
      ]"
      :class="{ full: true }"
    />
    </div>
  </IntroductionSection>
  
  <IntroductionSection title="사물주소 사용 예시" description="시설물과 공간에 사용되고 있습니다.">
    <div class="object-sample-grid">
      <div class="object-sample-grid-title">사물주소 23종</div>
      <ObjectSampleCard index="1" text="육교승강기" />
      <ObjectSampleCard index="2" text="둔치주차장" />
      <ObjectSampleCard index="3" text="지진옥외대피장소" />
      <ObjectSampleCard index="4" text="버스정류장" />
      <ObjectSampleCard index="5" text="택시승강장" />
      <ObjectSampleCard index="6" text="졸음쉼터" />
      <ObjectSampleCard index="7" text="지진해일긴급대피장소" />
      <ObjectSampleCard index="8" text="소공원" />
      <ObjectSampleCard index="9" text="어린이공원" />
      <ObjectSampleCard index="10" text="드론배달점" />
      <ObjectSampleCard index="11" text="비상급수시설" />
      <ObjectSampleCard index="12" text="인명구조함" />
      <ObjectSampleCard index="13" text="주차장" />
      <ObjectSampleCard index="14" text="전기차충전소" />
      <ObjectSampleCard index="15" text="공중전화" />
      <ObjectSampleCard index="16" text="우체통" />
      <ObjectSampleCard index="17" text="전동휠체어 급속충전기" />
      <ObjectSampleCard index="18" text="자전거거치대" />
      <ObjectSampleCard index="19" text="비상소화장치" />
      <ObjectSampleCard index="20" text="무더위쉼터" />
      <ObjectSampleCard index="21" text="민방위 대피시설" />
      <ObjectSampleCard index="22" text="어린이 놀이시설" />
      <ObjectSampleCard index="23" text="음식판매 자동차 허가구역" />
    </div>
  </IntroductionSection>
</template>

<script setup>
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import FacilityCard from "@/components/introduction/FacilityCard.vue";
import IntroductionSection from "@/components/introduction/IntroductionSection.vue";
import ObjectSampleCard from "@/components/introduction/ObjectSampleCard.vue";

import IntroductionTitle from "@/components/introduction/Title.vue";
import HeaderTitle from "@/components/title/HeaderTitle.vue";

const objectAddressList = [
  {
    title: "1) 시설물(시설 및 장소, 이하 ‘시설물’)이 건물등의 밖에 있는 경우  ",
    sample: "‘서울특별시 강남구 학동로 2 비상급수시설’",
    text: "「행정구역명」     +   「도로명」     +     「사물번호」      +     「사물유형명」",
    image: "/src/assets/images/introduction/object/img-1.png",
    alt: "사물주소 표기 이미지 1"
  },
  {
    title: "2) 시설물이 건물등의 안에 있는 경우",
    sample: "‘서울특별시 종로구 중학천길 42, <br>201호 무인발급기 ’",
    text: "「행정구역명」     +     「도로명」     +     「건물번호」     +     「쉼표(,)」     +     <br>「사물번호」     +     「사물유형명」",
    image: "/src/assets/images/introduction/object/img-2.png",
    alt: "사물주소 표기 이미지 2"
  }
];
</script>