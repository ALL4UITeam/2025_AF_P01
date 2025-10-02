<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentPath = route.path;

const breadcrumbs = computed(() => {
    const items = [];
    
    // items.push({
    //     type: 'link',
    //     href: '/',
    //     title: '메인으로 이동하기',
    //     content: '<img src="/src/assets/images/common/ic-home.png" alt="메인" />'
    // });

    if (route.meta.secondDepth) {
        items.push({
            type: 'button',
            title: '메뉴보기',
            content: route.meta.secondDepth,
            onClick: () => {
                const gnbButtons = document.querySelectorAll('.header__mainMenu');
                const currentSecondDepth = route.meta.secondDepth;
                
                // 모든 GNB 메뉴 버튼을 순회하면서 현재 secondDepth와 일치하는 메뉴 찾기
                gnbButtons.forEach(button => {
                    const menuText = button.textContent.trim();
                    if (menuText === currentSecondDepth) {
                        button.click();
                    }
                });
            }
        });
    }

    // 현재 메뉴
    items.push({
        type: 'text',
        content: route.meta.menu || ''
    });

    return items;
});
</script>

<template>
    <ul class="breadcrumbBox">
        <li>
            <a href="/" title="메인으로 이동하기">
              <img src="/src/assets/images/common/ic-home.png" alt="메인" />
            </a>
        </li>
        <li v-for="(item, index) in breadcrumbs" :key="index">
            <template v-if="item.type === 'link'">
                <a :href="item.href" :title="item.title" v-dompurify-html="item.content"></a>
            </template>
            <template v-else-if="item.type === 'button'">
                <button :title="item.title" @click="item.onClick">{{item.content}}</button>
            </template>
            <template v-else>
                {{item.content}}
            </template>
        </li>
    </ul>
</template>

