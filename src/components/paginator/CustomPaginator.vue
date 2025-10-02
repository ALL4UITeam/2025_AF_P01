<script setup>
// import { defineProps, onMounted, ref } from "vue";
import {onMounted, ref, nextTick} from "vue";
import Paginator from 'primevue/paginator';

const props = defineProps({
  pageLinkSize: Number,
  totalRecords: Number,
  rows: Number,
  first: Number
});

const emit = defineEmits(['update:first', 'page']);

const handlePageChange = (event) => {
  emit('update:first', event.first);
  emit('page', event);
  nextTick(() => {
    updatePageTitles();
  })
}

const paginatorRef = ref(null);

onMounted(() => {
  const paginatorEl = paginatorRef.value.$el;

  const firstPageBtn = paginatorEl.querySelector('.p-paginator-first');
  if (firstPageBtn) firstPageBtn.setAttribute('title', '첫페이지');
  const prevPageBtn = paginatorEl.querySelector('.p-paginator-prev');
  if (prevPageBtn) prevPageBtn.setAttribute('title', '이전페이지');
  const nextPageBtn = paginatorEl.querySelector('.p-paginator-next');
  if (nextPageBtn) nextPageBtn.setAttribute('title', '다음페이지');
  const lastPageBtn = paginatorEl.querySelector('.p-paginator-last');
  if (lastPageBtn) lastPageBtn.setAttribute('title', '마지막페이지');

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        updatePageTitles();
      }
    });
  });

  const config = {childList: true, subtree: true};

  if (paginatorRef.value) {
    observer.observe(paginatorRef.value.$el, config);
    updatePageTitles();
  }

});

const updatePageTitles = () => {
  if (!paginatorRef.value) return;

  const paginatorEl = paginatorRef.value.$el;
  const pageButtons = paginatorEl.querySelectorAll('.p-paginator-page');

  pageButtons.forEach((btn) => {
    const pageNumber = btn.textContent;
    let title = `${pageNumber}페이지`;

    if (btn.classList.contains('p-highlight')) {
      title += '선택됨';
    }

    btn.setAttribute('title', title);
  })
}
</script>

<template>
  <Paginator :first="first" @page="handlePageChange" :rows="rows" :totalRecords="totalRecords"
             :pageLinkSize="pageLinkSize" ref="paginatorRef"/>
</template>


<style lang="scss" scoped>

</style>