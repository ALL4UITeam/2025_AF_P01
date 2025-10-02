<script setup>
import { ref } from "vue";
import {useRoute} from "vue-router"

const routes = ref([
  {label:'자료실', path:'/introduction/ReferenceBoardList'},
  {label:'홍보영상', path:'/introduction/VodBoardList'},
  {label:'지자체 홍보자료실', path:'/introduction/LocalGovBoardMainList'},
])

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}

</script>

<template>
  <ul>
    <li v-for="route in routes" :key="route.path">
      <router-link :to="route.path" :class="{active: isActive(route.path)}" :title="route.label + '이동'">{{route.label}}</router-link>
    </li>
  </ul>
</template>


<style lang="scss" scoped>

</style>