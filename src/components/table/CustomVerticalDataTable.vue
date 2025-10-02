<script setup>
// import {DataTable, Column} from 'primevue';
import { onMounted, onUpdated, ref, watch,  } from "vue";
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import CustomPaginator from '@/components/paginator/CustomPaginator.vue';

const props = defineProps({
  items: Array,
  columns: Array,
  paginator: Boolean,
  rows: Number,
  totalRecords: Number,
  rowsPerPageOPtions: Array,
  caption: String,
});


const onPage = (event) => {
  emit('update:page', event);
}
const handlePageChange = (event) => {
  console.log('클릭');
}

const dataTableRef = ref(null);

onMounted(() => {
  const headers = document.querySelectorAll('th[role="columnheader"]');
  headers.forEach(header => {
    header.setAttribute('scope', 'col');
  })
  updateCaption(props.caption);
})

function updateCaption(newCaption) {
  const dataTableEl = dataTableRef.value.$el.querySelector('.p-datatable-table');
  if (dataTableEl) {
    const caption = document.createElement('caption');
    caption.textContent = newCaption;
    dataTableEl.prepend(caption);
  }
}
</script>

<template>
  <div class="datatable-wrap">
    <DataTable :value="items" :paginator="false" :rowsPerPageOptions="rowsPerPageOPtions" @page="onPage" ref="dataTableRef">
      <template v-for="(col, index) in columns" :key="index">
        <Column :field="col.field" :header="col.header" :sortable="col.sortable" :body="col.body ? col.body : null" />
      </template>
    </DataTable>
    <CustomPaginator :rows="rows" :totalRecords="totalRecords" :pageLinkSize="10" @page="handlePageChange" />
  </div>
</template>


<style lang="scss" scoped>

</style>