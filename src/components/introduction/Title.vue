<template>
<div class="introduction-title-container">
    <div class="info-box">
        <h2 class="title">{{ title }}</h2>
        <slot />
    </div>
</div>
</template>


<script>
export default {
  name: "IntroductionTitle",
  props: {
    title: { type: String, required: true },
  }
};
</script>
