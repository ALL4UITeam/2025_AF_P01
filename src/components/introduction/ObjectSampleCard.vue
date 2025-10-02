<template>
    <div class="object-sample-card">
      <div class="text-box">
        <span>{{ index }}</span><b>{{ text }}</b>
      </div>
      <div class="image-box">
        <img :src="`/src/assets/images/introduction/object/img-sample-${index}.png`" :alt="text" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ObjectSampleCard",
    props: {
      index: {
        type: Number,
        required: true
      },
      text: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  