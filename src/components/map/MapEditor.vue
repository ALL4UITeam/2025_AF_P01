<template>
  <div style="width:100%; height: 100%; position:relative; ">
    <MapEditor ref="comMapEditor" @mapLoaded="fnMapLoaded" lang="ko" apikey='"3B63BE88F1A06653075E0C88883B157E"'/>
  </div>
</template>

<script setup>
import MapEditor from "daip-map-component";
import {ref} from "vue";
const comMapEditor = ref(null);

const fnMapLoaded = () => {
  // if (history.state.zoom && history.state.center) {
  //   comMapEditor.value.getMap().getView().setCenter(history.state.center);
  //   comMapEditor.value.getMap().getView().setZoom(history.state.zoom);
  // } else {
    comMapEditor.value.getMap().getView().setCenter([949219.3, 1947495.6]);
    comMapEditor.value.getMap().getView().setZoom(11);
  // }
}
</script>

<style>
/* 스케일 ※ scope 안에 넣으면 적용이 안된다. */
.ol-zoomslider {
  display: block;
}
</style>