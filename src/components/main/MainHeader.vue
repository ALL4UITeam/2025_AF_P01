<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick} from 'vue'
import HeaderMenu from '@/components/common/HeaderMenu.vue'

const activeIndex = ref(-1);

const toggleSubmenu = (index) => {
    if (activeIndex.value === index) {
        activeIndex.value = null;
    } else {
        activeIndex.value = index;
    }
};

const handleClickOutside = (event) => {
    const gnbElement = document.querySelector('.header__gnb');
    if (gnbElement && !gnbElement.contains(event.target)) {
        activeIndex.value = -1;
    }
};

const handleFocusOut = (event) => {
    const gnbElement = document.querySelector('.header__gnb');
    if (gnbElement && !gnbElement.contains(event.relatedTarget)) {
        activeIndex.value = -1;
    }
};

//햄버거메뉴
const isOpen = ref(false);

const toggle = () => {
  if (window.innerWidth <= 1280) {
    isOpen.value = !isOpen.value;

    nextTick(() => {
      const header = document.querySelector('.header__wrap');

      if(header) {
        header.classList.toggle('fixed', isOpen.value);
      }

      const focusableElements = document.querySelectorAll('.skip__navi a, .content a, .content button, .content input, .footer__wrap a, .footer__wrap button, .footer__wrap input');
      focusableElements.forEach(element => {
        element.setAttribute('tabindex', isOpen.value ? '-1' : '' );
      })
    })
  }
}

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('focusout', handleFocusOut);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('focusout', handleFocusOut);
});

// ... existing code ...
</script>

<template>
    <div class="mainHeaderWrap headerHeight">
        <div class="header__wrap mainHeader" :class="{ fixed: isOpen }">
            <div class="header__inner">
                <div class="header">
                    <h1 class="header__logo">
                        <a href="/"><img src="@images/common/img-logo@2x.png" alt="도로명주소 로고"></a>
                    </h1>
                    <div class="header__menu">
                        <button class="header__menuFunction" type="button" @click="toggle">
                            <span class="blind">{{ isOpen ? '메뉴닫기' : '메뉴열기' }}</span>
                        </button>
                    </div>
                    <div class="header__gnb" @mousedown="handleClickOutside">
                        <div class="header__mobileHeader">
                            <h1 class="header__logo">
                                <a href="/"><img src="@images/common/img-logo@2x.png" alt="도로명주소 로고"></a>
                            </h1>
                            <button class="header__mobileHeaderClear" type="button" @click="toggle">
                                <i aria-hidden="true" class="bi bi-x-lg"></i>
                                <span class="blind">{{ isOpen ? '메뉴열기' : '메뉴닫기' }}</span>
                            </button>
                        </div>

                        <HeaderMenu />

                        <div class="header__etc">
                            <div class="header__certification" id="timer" style="display: none;">본인인증 <span class="on">ON</span><span id="counter">00:00</span>
                                <button class="clear" type="button">인증해제</button>
                            </div>
                            <div class="header__etcFunction">
                                <a href="/main/engMain" class="language">EN</a>
                                <a href="/" target="_blank" class="link" title="주소기반산업지원서비스 새창 이동하기">주소기반산업지원서비스</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

