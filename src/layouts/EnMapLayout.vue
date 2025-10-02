<script setup>

</script>
<template>
  <div class="enLayoutMap">
    <div class="enLayoutMap__header">
      <div class="enLayoutMap__headerLogo">
        <img src="@images/en/img_logo_en_map.png" alt="logo" />
      </div>
      <div class="enLayoutMap__headerMenu">
        <i aria-hidden="true" class="bi bi-search" />
        <p class="enLayoutMap__headerMenuText">Search</p>
      </div>
    </div>
    <slot />
  </div>
</template>


<style lang="scss" scoped>
@import url('@scss/contents/en/enMap.scss');
</style>
