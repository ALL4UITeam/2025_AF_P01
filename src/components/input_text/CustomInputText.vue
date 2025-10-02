<script setup>
import { nextTick, ref, watch,  } from "vue";
import InputText from 'primevue/inputtext'
import Button from 'primevue/button';

const props = defineProps({
  modelValue : {
    type: String,
    required: true,
  },
  placeholder : {
    type: String,
    default : '입력하세요.'
  },
  title : {
    type: String,
    default : ''
  },
  id : {
    type: String,
    required: true,
  },
  disabled: {
	  type: Boolean,
	  default: false
  },
  clearButton: {
	  type: Boolean,
	  default: true
  },
  maxLength: {
    type: Number,
    default: null
  },
  type: {
    type:String,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);
const inputRef = ref(null);
const clear = props.clearButton;

const onInput = (event) => {
  emit('update:modelValue', event.target.value);
}

//숫자 or 문자열 선택 type="number" / type="string" vue에 추가
const handleKeyDown = (event) => {
  const key  = event.key
  if (props.type === 'number') {
    if (!/^[0-9]$/.test(key) && key !=='Backspace' && key !== 'Tab') {
      event.preventDefault();
    }
  } else if (props.type === 'string') {
    if(!/[^a-zA-Zㄱ-ㅎ가-힣]$/.test(key) && key !== 'Backspace' && key !== 'Tab'){
      event.preventDefault();
    }
  } else if (props.type === 'point') {
    if(!/^[0-9.]$/.test(key) && key !== 'Backspace' && key !== 'Tab' && key !== '.'){
      event.preventDefault();
    }
  }
}


const clearInput = () => {
  modelValue.value = '';
  emit('update:modelValue', '');

  nextTick(() => {
    if (inputRef.value) {
      const inputElement = inputRef.value.$el;
      if (inputElement) {
        inputElement.focus();
      }
    }

  })
};

watch(() => props.modelValue, (newValue) => {
  modelValue.value = newValue
})

const modelValue = ref(props.modelValue);

</script>

<template>
  <div class="inputText" :class="{'disabled' : props.disabled}">
    <InputText
      v-model="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      :title="title"
      :id="id"
      :disabled="props.disabled"
      :maxLength="props.maxLength"
      :inputmode="props.inputmode"
      @keydown="handleKeyDown"
      ref="inputRef"
    />
    <Button v-if="modelValue && clear == true" @click="clearInput" class="clearButton" title="입력된값 삭제">
      <span class="blind">삭제</span>
      <i aria-hidden="true" class="bi bi-x"/>
    </Button>
  </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/_mixin';
.inputText {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding:0 5px 0 0;
  border-radius: 5px;
  border:1px solid #c0c4ca;
  background: #fff;

  .p-inputtext {
    width: 100%;
    height: 100%;
    padding:0 0 0 15px;
    border-radius: 0;
    background: transparent;
    border:none;
    color:#000;
    font-size:14px;

    &::placeholder {
      color:#4b5563;
    }
  }

  &.disabled {
    background: #f4f4f4;
  }
}
.clearButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  min-width: 18px;
  border-radius: 50%;
  margin-left:5px;
  background: #e1e4ea;
  color:#333;

  i {
    width: auto;
    height: auto;
    font-size:17px;
    font-weight: bold;
    margin:1px 0 1px 1px;
  }
}

@include mixin.breakpoint-tablet {

  .inputText {
    width: 100%;
    height: 34px;
    padding-right:10px;
    border-radius: 10px;

    .p-inputtext {
      width: 100%;
      padding:16px;
      border-radius: 0;
      background: transparent;
      border:none;
      font-size:13px;
    }
  }
}
</style>