<script setup>
import { ref, computed, onMounted, watchEffect, onBeforeUnmount } from "vue";
import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
//셀렉트박스
const selectedItem = ref(null);
const items = ref([
  {label:'주소정보활용지원센터'},
  {label:'주소기반산업협회'},
]);

const isOpen = ref(false);
const selectId = 'footer-select';
const menuId = 'footer-select-menu';

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
};

const closeOnClickOutside = (event) => {
  const selectBox = document.querySelector('.footer__selectBox');
  if (selectBox && !selectBox.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', closeOnClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('click', closeOnClickOutside);
});
</script>

<template>

  <div class="footer__wrap">
    <div class="footer web">
      <div class="footer__header">
        <ul class="footer__termsUse">
          <li><a href="/Privacy" class="link privacy" title="개인정보처리방침 화면으로 이동">개인정보처리방침</a></li>
          <li><a href="/Terms" class="link" title="이용약관 화면으로 이동">이용약관</a></li>
          <li><a href="/ahh/ahhNotifyBoardList" class="link" title="도로명주소 도움센터 화면으로 이동">도로명주소 도움센터 (1588-0061(7번))</a></li>
        </ul>
        <ul class="footer__utility">
          <li>
            <div class="footer__selectBox" :class="{ active: isOpen }">
              <button
                  class="footer__select"
                  :id="selectId"
                  :aria-expanded="isOpen"
                  :aria-controls="menuId"
                  :aria-haspopup="true"
                  @click="toggleMenu"
                  :title="`유관기관 목록 ${isOpen ? '닫기' : '열기'}`"
              >
                유관기관
              </button>
              <ul
                  class="footer__selectMenu"
                  :id="menuId"
                  role="menu"
                  :aria-labelledby="selectId"
              >
                <li role="none">
                  <a href="#id1" role="menuitem">주소정보활용지원센터</a>
                </li>
                <li role="none">
                  <a href="https://www.address.or.kr/user/index.php" role="menuitem">주소기반산업협회</a>
                </li>
              </ul>
            </div>
          </li>
          <li><a href="/ahh/ahhLegal" class="link" title="법령정보 조회 화면으로 이동" @focus="isOpen = false">법령정보</a></li>
          <li><a href="/ahh/ahhManagerInfoList" class="link" title="담당자연락처 조회 화면으로 이동">담당자 연락처</a></li>
          <li><a href="/Directions" class="link" title="찾아오시는길 화면으로 이동">찾아오시는 길</a></li>
          <li><a href="/Sitemap" class="link" title="사이트맵 화면으로 이동">사이트맵</a></li>
        </ul>
      </div>
      <div class="footer__content">
        <div class="footer__logo">
          <a href="http://www.mois.go.kr" target="_blank" title="행정안전부 홈페이지 새창으로 열림">
            <img src="@images/common/logo-mois@3x.png" alt="행정안전부 로고">
          </a>
        </div>
        <p class="footer__address">30112 세종특별자치시 도움6로 42 (어진동)<br>Copyright @ Ministry of the Interior and Safety. All Rights reserved.</p>
        <div class="marks">
          <div class="wa" title="WA 품질인증 마크, 웹와치(WebWatch) 2024.3.1 ~ 2025.2.28"><img src="@images/common/mark_wa.png" alt="과학기술정보통신부웹 접근성 품질인증" /></div>
          <a class="klid" href="http://www.klid.or.kr/" target="_blank" title="한국지역정보개발원 홈페이지 새창으로 열림"><img src="@images/common/mark_klid_1.png" alt="한국지역정보개발원 KLID" /></a>
        </div>
      </div>
    </div>
    <div class="footer mobile">
      <p class="footer__address">30112 세종특별자치시 도움6로 42 (어진동)<br>Copyright @ Ministry of the Interior and Safety.  All Rights reserved.</p>
    </div>
  </div>

</template>


<style lang="scss" scoped>
.footer {
  width: 100%;
  max-width: 1746px;
  margin: 0 auto;
  padding: 0 90px;

  &.web {
    display:block;
  }

  &.mobile {
    display:none;
  }
  &__wrap {
    padding: 22px 0;
    background: #060e23;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 24px;
  }
  &__termsUse {
    display: flex;
    gap: 46px;

    .link {
      position: relative;
      color: #fafafa;
      font-size: 18px;
      font-weight: 500;

      &.privacy {
        color: #4b75ff;
      }

      &:hover::after, &:focus::after {
        display: block;
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 1px;
        background: #fff;
      }

      &.privacy {
        &:hover::after, &:focus::after {
          background-color: #4b75ff;
        }
      }
    }
  }
  &__utility {
    display: flex;
    gap: 56px;

    .link {
      position: relative;
      color: #b2b5bc;
      font-size: 18px;

      &.privacy {
        color: #4b75ff;
      }

      &:hover::after, &:focus::after {
        display: block;
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 1px;
        background: #fff;
      }

      &.privacy {
        &:hover::after, &:focus::after {
          background-color: #4b75ff;
        }
      }
    }
  }
  &__content {
    display: flex;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid #313747;

    .marks {
      display:flex;
      gap:25px;
    }

    .wa {
      img {
        width:81px;
      }
    }
    .klid {
      img {
        width:140px;
      }
    }

  }
  &__address {
    flex:1;
    margin-left:90px;
    color: #8e929d;
    font-size: 17px;
    line-height: 1.84;
  }
  &__logo {
    img {
      width: 190px;
    }
  }
  &__select {

    color: #b2b5bc;
    font-size: 18px;

    &:hover::after, &:focus::after {
      display: block;
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 1px;
      background: #fff;
    }
  }
  &__selectMenu {
    display: none;
    position: absolute;
    top: 40px;
    left: 0;
    width: 200px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 100;

    li {
      & + li {
        border-top: 1px solid #eee;
      }
      a {
        display: block;
        padding: 10px 15px;
        color: #333;
        text-decoration: none;

        &:hover, &:focus {
          background-color: #f5f5f5;
        }
      }
    }
  }
  &__selectBox {
    position: relative;

    &.active {
      .footer__selectMenu {
        display: block;
      }
    }
  }
}


@media (max-width: 1400px) {
  .footer__termsUse {
    gap: 25px;
  }

  .footer__utility {
    gap: 30px;
  }
}

@media (max-width: 1280px) {
  .footer {
    padding: 0 54px;
    &__wrap {
      padding: 22px 0;
    }
    &__header {
      padding-bottom: 20px;
    }
    &__termsUse {
      gap: 20px;

      .link {
        font-size: 16px;
      }
    }
    &__utility {
      gap: 25px;

      .link {
        font-size: 16px;
      }
    }
    &__content {
      padding-top: 18px;
    }

    &__address {
      font-size: 16px;
      line-height: 1.76;
    }
    &__logo {
      width: 158px;
    }
  }
}

@media (max-width: 1180px) {
  .footer__address {
    width: 100%;
    margin:0;
    text-align: center;
    font-size: 14px;
    line-height: 1.5;
  }
}
@media (max-width: 1100px) {
  .footer {
    &.web {
      display:none;
    }
    &.mobile {
      display:block;
    }
  }
}
</style>