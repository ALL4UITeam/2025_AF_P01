<template>
  <div class="facility-card" :class="{ full: size === 'full' }">
    <h4>{{ title }}</h4>
    <div class="flex">
      <div class="image-box">
        <img :src="image" :alt="title" />
      </div>
      <div class="cont">
        <ul class="bullet-list">
          <li v-for="(b,i) in bullets" :key="i" v-html="b"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FacilityCard",
  props: {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    bullets: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: "default"
    }
  }
};
</script>
