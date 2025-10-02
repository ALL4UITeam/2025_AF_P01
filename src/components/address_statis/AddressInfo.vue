<script setup>
import { ref, onMounted, watch } from "vue";
import Dropdown from 'primevue/dropdown';
import RadioButton from "primevue/radiobutton";
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
	job: String,
    title: String,
    subtitle: String,
    date: String,
    count: Number,
    options: Array,
    isLoadingBar: {
      type: Boolean,
      default: true,
    },
    prefix : {
        type: String,
        required: true,
    },
    selectedItem02: {
    	type: Object,
    	requried: true,
    },
    roadNmReasonSelectedItem02: {
    	type: Object,
    	requried: true,
    },
    roadNmTypeSelectedItem02: {
    	type: Object,
    	requried: true,
    },
});

const selectOption = ref('차트');

function downloadExcel() {
    window.location.href=props.downloadPath;
}

function handleExcelDownload() {
	emit('downloadExcel');
}

const selectChart = ref('setBarChartX');

const emit = defineEmits(['update:selectChart', "downloadExcel", 'updateMapType', 'radioChart']);

const mapOption = ref('차트');
const mapChart = ref('mapColorChart');

//option 초기 변경
function handleOptionChange(option) {
	selectOption.value = option
	if(option === '지도') {
		console.log("옵션 : ", selectOption.value);
		emit('radioChart', selectOption.value);
	} else {
		console.log("옵션 : ", selectOption.value);
		emit('radioChart', selectOption.value);
	}
}

//option 변경
watch(selectOption, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        selectChart.value = 'setBarChartX'
    }
    if (newValue === '지도') {
        mapChart.value = 'mapColorChart'
        console.log("watch newValue", newValue);
        emit('updateMapType', mapChart.value);
    } 
});

//차트 초기 타입 변경
function emitChartEvent(chartType) {
	selectChart.value = chartType;
	emit('update:selectChart', chartType);
}

//지도 초기 타입 변경
function emitMapType(chartType) {
	mapChart.value = chartType;
	emit('updateMapType', chartType)
};

//차트 타입 변경
watch(selectChart, (newVal) => {
	emit('update:selectChart', newVal);
})

//행정안전부 '지도' 라디오 버튼 disabled
const isDisabled = ref(false);

watch(() => props.selectedItem02, (newValue) => {
	console.log("행정안전부 : ", newValue.value);
	isDisabled.value = (newValue.value === '00');
})

watch(() => props.roadNmReasonSelectedItem02, (newValue) => {
	console.log("행정안전부2 : ", newValue.value);
	isDisabled.value = (newValue.value === '00');
})

watch(() => props.roadNmTypeSelectedItem02, (newValue) => {
	console.log("행정안전부3 : ", newValue.value);
	isDisabled.value = (newValue.value === '00');
})

</script>

<template>
    <div class="chart__wrap">
        <div class="chart__header">
            <p class="chart__title">
                <span class="chart__mainTitle">{{props.title}}</span>
                <span class="chart__subTitle">
                    {{props.subtitle}}
                </span>
            </p>
            <p class="chart__related">
                <span class="commonBullet">※</span>
                (기준일  : <span class="chart__date">{{props.date}}</span> 
                / 건수 : <span class="chart__total">{{props.count}}</span>)
            </p>
        </div>
        <div class="chart__content">
            <div class="chart__information">
                <div class="chart__classification">
                    <slot name="classification" />
                </div>
                <div class="chart__function">
                    <div class="chart__checkbox" v-for="(option, index) in props.options" :key="index">
                        <RadioButton :disabled="option === '지도' && isDisabled" @click="handleOptionChange(option)" v-model="selectOption" :inputId="`option-${index}${props.job}${props.title}`" name="checkList" :value="option"  />
<!--                        <label :for="option">{{ option }}</label>-->
                      	<label :for="`option-${index}${props.job}${props.title}`" :title="`${option} 선택`" @keydown.space.prevent="selectOption = option"
                          @keydown.enter.prevent="selectOption = option" tabindex="0">
                        {{ option }}
                      </label>
                    </div>
                    <Button class="commonButton__button" @click="handleExcelDownload" title="엑셀다운로드">
                        <span class="commonButton__text">엑셀다운로드</span>
                        <i aria-hidden="true" class="bi bi-download" />
                    </Button>
                </div>
            </div>

            <div class="chart__detail">
                <div v-if="selectOption === '차트'">
                    <div class="chart__type">
                      <Button class="chart-btn setBarChartX" :class="{ active: selectChart === 'setBarChartX' }"
                          @click="emitChartEvent('setBarChartX')" :title="selectChart === 'setBarChartX' ? '가로형 바차트 선택됨' : '가로형 바차트 보기'">
                        <span class="blind">가로형바차트</span>
                      </Button>
                      <Button class="chart-btn setBarChartY" :class="{ active: selectChart === 'setBarChartY' }"
                          @click="emitChartEvent('setBarChartY')" :title="selectChart === 'setBarChartY' ? '세로형 바차트 선택됨' : '세로형 바차트 보기'">
                        <span class="blind">세로형바차트</span>
                      </Button>
                      <Button class="chart-btn setDoughnutChart" :class="{ active: selectChart === 'setDoughnutChart' }"
                          @click="emitChartEvent('setDoughnutChart')" :title="selectChart === 'setDoughnutChart' ? '도넛형 차트 선택됨' : '도넛형 차트 보기'">
                        <span class="blind">도넛형차트</span>
                      </Button>
                    </div>
                    <div v-if="selectChart === 'setBarChartX'">
                        <slot name="setBarChartX" />
                    </div>
                    <div v-if="selectChart === 'setBarChartY'">
                        <slot name="setBarChartY" />
                    </div>
                    <div v-if="selectChart === 'setDoughnutChart'">
                        <slot name="setDoughnutChart" />
                    </div>
                </div>
                <div v-if="selectOption === '도표'"><div class="scrollBoxTable"><slot name="grid" /></div></div>
                <div v-if="selectOption === '지도'">

                  <div class="progress-container" v-if="props.isLoadingBar">
                    <div class="progress-wrapper">
                      <ProgressSpinner :style="{width: '50px', height: '50px'}" strokeWidth="5" fill="var(--surface-ground)"
                                       animationDuration="3s" aria-label="Custom ProgressSpinner" />
                    </div>
                  </div>
                  <slot name="map" />
                	<div class="chart__type">
                      <Button class="chart-btn mapColorChart" :class="{ active: mapChart === 'mapColorChart' }"
                          @click="emitMapType('mapColorChart')" :title="mapChart === 'mapColorChart' ? '지도색상차트 선택됨' : '지도색상차트 보기'">
                        <span class="blind">지도색상차트</span>
                      </Button>
                      <Button class="chart-btn mapBubbleChart" :class="{ active: mapChart === 'mapBubbleChart' }"
                          @click="emitMapType('mapBubbleChart')" :title="mapChart === 'mapBubbleChart' ? '지도버블차트 선택됨' : '지도버블차트 보기'">
                        <span class="blind">지도버블차트</span>
                      </Button>
                    </div>
                    <div v-if="selectOption === '지도'">
	                    <div v-if="mapChart === 'mapColorChart'">
                        <slot name="mapColorChart" />
                      </div>
                      <div v-if="mapChart === 'mapBubbleChart'">
                        <slot name="mapBubbleChart" />
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/_mixin';
.chart {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  &__title {
    display: flex;
    align-items: flex-end;
    gap:15px;
  }

  &__mainTitle {
    color:#000;
    font-size:26px;
  }
  &__subTitle {
    color:#333;
    font-size:17px;
  }
  &__related {
    color:#666;
    font-size:16px;
  }

  &__content {
    margin-top:30px;
  }
  &__information {
    display: flex;
    justify-content: space-between;
    padding:20px 40px;
    border-radius: 15px;
    background: #eff2f6;
  }
  &__classification {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap:20px;
  }
  &__function {
    display: flex;
    align-items: center;
    gap:20px;
  }
  &__checkbox {
    display: flex;
    gap:7px;
    label {
      color:#000;
      font-size:15px;
    }
  }
  &__detail {
    position: relative;
    margin-top:20px;
    padding-top:20px;
  }
  &__type {
    display: flex;
    align-items: center;
    gap:10px;
    position: absolute;
    right:0;
    top:0;

    button {
      display: inline-block;
      width: 30px;
      height: 30px;
      cursor: pointer;

      &.setBarChartX {
        background: url('@images/story/bg_vertical_off.png') no-repeat 0 0/30px;

        &.active {background-image: url('@images/story/bg_vertical_on.png');}
      }
      &.setBarChartY {
        background: url('@images/story/bg_horizontal_off.png') no-repeat 0 0/30px;

        &.active {background-image: url('@images/story/bg_horizontal_on.png');}
      }
      &.setDoughnutChart {
        background: url('@images/story/bg_donut_off.png') no-repeat 0 0/30px;

        &.active {background-image: url('@images/story/bg_donut_on.png');}
      }
      &.mapColorChart {
        background: url('@images/story/bg_horizontal_off.png') no-repeat 0 0/30px;

        &.active {background-image: url('@images/story/bg_horizontal_on.png');}
      }
      &.mapBubbleChart {
        background: url('@images/story/bg_donut_off.png') no-repeat 0 0/30px;

        &.active {background-image: url('@images/story/bg_donut_on.png');}
      }
    }
  }
}

@include mixin.breakpoint-tablet {
  .chart {
    &__header {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-start;
    }
    &__title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap:5px;
    }
    &__mainTitle {
      font-size:17px;
    }
    &__subTitle {
      font-size:12px;
    }
    &__related {
      font-size:11px;
    }
    &__content {
      margin-top:18px;
    }
    &__information {
      flex-direction: column;
      justify-content: flex-start;
      padding:19px 15px 15px;
      border-radius: 10px;
    }
    &__classification {
      display: flex;
      align-items: center;
      width: 100%;
      gap:6px;
    }
    &__function {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap:14px;
      margin-top:14px;
    }
    &__checkbox {
      display: flex;
      gap:7px;
      align-items: center;
      label {
        color:#000;
        font-size:11px;
      }
    }
    &__detail {
      position: relative;
      margin-top:20px;
      padding-top:20px;
    }
    &__type {
      display: flex;
      align-items: center;
      gap:10px;
      position: absolute;
      right:0;
      top:0;
    }
  }
}

.progress-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 540px;

}

.progress-wrapper {
  position:absolute;
  inset:0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  vertical-align: middle;
  text-align: center;
}

</style>