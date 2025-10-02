<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { menus as menuData } from '@/constants/menu'

const menus = ref(menuData)
const activeIndex = ref(-1);

const toggleSubmenu = (index) => {
  if (activeIndex.value === index) {
    activeIndex.value = null
  } else {
    activeIndex.value = index
  }
}

const handleClickOutside = (event) => {
  const gnbElement = document.querySelector('.header__gnb');
  if (gnbElement && !gnbElement.contains(event.target)) {
    activeIndex.value = -1;
  }
}

const handleFocusOut = (event) => {
  const gnbElement = document.querySelector('.header__gnb');
  if (gnbElement && !gnbElement.contains(event.relatedTarget)) {
    activeIndex.value = -1;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('focusout', handleFocusOut);
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.removeEventListener('focusout', handleFocusOut);
})
</script>

<template>
  <ul class="header__list" id="gnb">
    <li v-for="(menu,index) in menus" :key="index" :class="{active: activeIndex === index, [`menu${String(index + 1).padStart(2, '0')}`]: true}">
      <button
        class="header__mainMenu"
        :title="activeIndex === index ? '닫기' : '열기' "
        @click="toggleSubmenu(index)"
      >
        {{menu.title}}
      </button>
      <div class="header__subMenu" :class="{active : activeIndex === index}">
        <div class="header__gnbContent">
          <div class="header__introduction">
            <h2 class="header__introductionTitle">{{menu.title}}</h2>
            <p class="header__introductionText" v-dompurify-html="menu.subtitle"></p>
          </div>
          <ul class="header__subMenuList">
            <li v-for="(subMenu, subIndex) in menu.submenus" :key="subIndex" :class="`menu${String(index + 1).padStart(2, '0')}_${String(subIndex + 1).padStart(2, '0')}`">
              <a class="header__link" v-if="subMenu.action" href="#" title="새창으로 열기" @click.prevent="subMenu.action">
                <div class="header__linkInner">
                  <div class="header__linkHeader">
                    <p class="header__subMenuName">{{subMenu.label}}</p>
                    <i aria-hidden="true" class="arrowBox" />
                  </div>
                  <p class="header__subMenuText" v-dompurify-html="subMenu.subtext"></p>
                </div>
              </a>
              <a class="header__link" v-else :href="subMenu.href">
                <div class="header__linkInner">
                  <div class="header__linkHeader">
                    <p class="header__subMenuName">{{subMenu.label}}</p>
                    <i aria-hidden="true" class="arrow" />
                  </div>
                  <p class="header__subMenuText" v-dompurify-html="subMenu.subtext"></p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template> 