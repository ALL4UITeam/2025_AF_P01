<template>
    <Dialog class="wd880" :visible="mVisible" :modal="true" :header="mHeader" :closable="false">
        <ProgressBar :value="Math.round(100 * mValue / mMaxValue)" />
    </Dialog>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import ProgressBar from 'primevue/progressbar';

const props = defineProps({
    visible: Boolean,
    header: String,
    value: Number,
    maxValue: Number,
});
defineExpose({
    show,
    hide,
    increaseValue,
    setValue,
    setMaxValue,
    setHeader,

    increaseSuccessValue,
    setSuccessValue,
    getSuccessValue,
});

const mVisible = ref(false);
const mHeader = ref('');
const mMaxValue = ref(100);
const mValue = ref(0);
const mSuccessValue = ref(0);
let mAutoClose = false;

watchEffect(() => {
    if (props.visible) {
        mVisible.value = props.visible;
    }
    if (props.header) {
        mHeader.value = props.header;
    }
    if (props.value) {
        mValue.value = props.value;
    }
    if (props.maxValue) {
        mMaxValue.value = props.maxValue;
    }

});


/** 보이기
 * @param {Number} pMaxValue 프로그레스바의 최대값
 * @param {Boolean} pAutoClose 자동으로 종료할지 여부
 */
function show(pMaxValue, pAutoClose) {
    if (pMaxValue != undefined) {
        mMaxValue.value = pMaxValue;
    } else {
        mMaxValue.value = 1000000;
    }

    mValue.value = 0;
    mVisible.value = true;
    mAutoClose = (pAutoClose != undefined) ? pAutoClose : true;
}

function setHeader(pHeader) {
    mHeader.value = pHeader;
}
function setMaxValue(pMaxValue) {
    mMaxValue.value = pMaxValue;
}

/** 숨기기
 */
function hide() {
    mVisible.value = false;
}

/** Value 를 증가 (현재값에 더하기)
 * @param {*} pValue 추가할 값
 */
function increaseValue(pValue) {
    mValue.value += pValue;

    if (mAutoClose && mValue.value >= mMaxValue.value) {
        setTimeout(() => {
            hide();
        }, 1000);
    }
}
/** Value 를 업데이트 (현재값을 변경)
 * @param {*} pValue 변경할 값
 */
function setValue(pValue) {
    mValue.value = pValue;

    if (mAutoClose && mValue.value >= mMaxValue.value) {
        setTimeout(() => {
            hide();
        }, 1000);
    }
}

function increaseSuccessValue(pValue) {
    mSuccessValue.value += pValue;
}
function setSuccessValue(pValue) {
    mSuccessValue.value = pValue;
}
function getSuccessValue() {
    return mSuccessValue.value;
}
</script>