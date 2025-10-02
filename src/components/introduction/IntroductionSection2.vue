<template>
    <div class="introductionSection2">
      <h4>{{ title }}</h4>
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: "IntroductionSection2",
    props: {
      title: {
        type: String,
        required: true
      }
    }
  }
  </script>