<script setup>
import InputText from "primevue/inputtext";
import Paginator from "primevue/paginator";
import { computed, ref } from "vue";
import $common from "@/common/common";

const emit = defineEmits(['reloadList']);
const props = defineProps({
  pageInfo: Object,
});

const paginatorRef = ref(null);
 
const searchPageNum = ref(1);

const first = computed(() => props.pageInfo.first)

// 페이지네이터 화면에 표시되는 페이지 수(기본값:5)
const linkSize = computed(() => props.pageInfo.linkSize || 10)

const onPaging = (params) => {
  emit('reloadList', {page: params.page , size: params.rows, first: params.first});
}

const goToPage = () => {
  console.log('searchPageNum ', searchPageNum.value, props.pageInfo);

  if(searchPageNum.value <= 0 || searchPageNum.value > props.pageInfo.totalPages) {
    $common.modalAlert('입력값이 0보다 크거나 전체 페이지 보다 작아야 합니다.');
    return;
  }

  const page = searchPageNum.value -1;
  const first = page * props.pageInfo.size;
  onPaging({
    page: page,
    first: first
  });
}

console.log('paginatorRef', paginatorRef);

</script>

<template>
  <div class="bottomArea" v-if="props.pageInfo.totalRecords > 0">
    <Paginator :first='first' :rows="props.pageInfo.size" :totalRecords="props.pageInfo.totalRecords" @page="onPaging" :pageLinkSize="linkSize" ref="paginatorRef"></Paginator>
  </div>

<!--      <Paginator :first='first' :rows="props.pageInfo.size" :totalRecords="props.pageInfo.totalRecords" @page="onPaging" :pageLinkSize="linkSize"></Paginator>-->
</template>