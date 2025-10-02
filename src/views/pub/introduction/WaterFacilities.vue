<template>
    <CommonBreadcrumb />
    <HeaderTitle title="수상시설물 주소 소개" />

  <IntroductionTitle title="수상시설물 주소부여란? ">
    <div class="desc">기존 지상에 위치한 건물에만 부여하던 도로명주소를 해상펜션, 양식장 등 수상(해상)에 위치한 시설물까지 확대부여</div>
    <div class="water-facilities-list">
      <div
      v-for="(item, idx) in facilitiesAddressList"
      :key="idx"
      class="water-facilities-item"
      >
        <strong>{{ item.title }}</strong>
        <div class="image">
          <img :src="item.image" :alt="item.alt" />
        </div>
      </div>
    </div>
  </IntroductionTitle>
  <IntroductionSection title="수상시설물 주소부여 방법 " description="육지와의 접합 여부에 따라 국문 : ‘수상‘, 영문 : ‘W’ 로 표기하며 시설물의 형태(건물/시설물) 등에 따라 도로명주소, 사물주소, 국가지점번호로 부여">
    <div class="address-sample">
      <div class="box">
        <span>예시</span>
        <b>경상남도 통영시 학림1길 수상11-32</b>
        <p>(W11-32 Hangnim 1-gil, Tongueong-si, Gyeongsangnam-do)</p>
      </div>
    </div>
  </IntroductionSection>
</template>
<script setup>
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import IntroductionSection from "@/components/introduction/IntroductionSection.vue";
import IntroductionTitle from "@/components/introduction/Title.vue";
import HeaderTitle from "@/components/title/HeaderTitle.vue";

const facilitiesAddressList = [
  {
    title: "해상낚시터 임대업장",
    image: "/src/assets/images/introduction/water/img-1.png",
    alt: "해상낚시터 임대업장 이미지"
  },
  {
    title: "해상굴판매장",
    image: "/src/assets/images/introduction/water/img-2.png",
    alt: "해상굴판매장 이미지"
  },
  {
    title: "바다공중화장실",
    image: "/src/assets/images/introduction/water/img-3.png",
    alt: "바다공중화장실 이미지"
  },
  {
    title: "해상펜션(콘도)",
    image: "/src/assets/images/introduction/water/img-4.png",
    alt: "해상펜션(콘도) 이미지"
  },
  {
    title: "죽방렴",
    image: "/src/assets/images/introduction/water/img-5.png",
    alt: "죽방렴 이미지"
  },
  {
    title: "양식장",
    image: "/src/assets/images/introduction/water/img-6.png",
    alt: "양식장 이미지"
  }
];
</script>