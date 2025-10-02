<template>
  <div class="introduction-section">
    <h3>{{ title }}</h3>
    <p v-if="description" v-html="description" class="description"></p>
    <div class="introduction-section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "IntroductionSection",
  props: {
    title: { type: String, required: true },
    description: { type: String, required: false }
  }
};
</script>
