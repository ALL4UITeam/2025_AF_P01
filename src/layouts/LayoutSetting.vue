<script setup>
import NoneLayout from '@/layouts/NoneLayout.vue';
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const layout = computed(() => {
  const { layout } = route.meta;

  if (layout === 'DefaultLayout') {
    return defineAsyncComponent(() => import('@/layouts/DefaultLayout.vue'));
  } else if (layout === 'EnMainLayout') {
    return defineAsyncComponent(() => import('@/layouts/EnMainLayout.vue'));
  } else if (layout === 'EnMapLayout') {
    return defineAsyncComponent(() => import('@/layouts/EnMapLayout.vue'));
  } else if (layout === 'IntegratedMapLayout') {
    return defineAsyncComponent(() => import('@/layouts/IntegratedMapLayout.vue'));
  }else{
    return NoneLayout;
  }
});

</script>

<template>
  <component :is="layout"><RouterView /></component>
</template>