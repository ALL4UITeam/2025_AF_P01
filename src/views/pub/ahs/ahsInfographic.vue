<template>
	<CommonBreadcrumb />
    <HeaderTitle title="도로명주소 인포그래픽" />

    <TabMenu :model="tabItems" :activeIndex="active" @tab-change="onTabChange" />

    <div v-show="active === 0">
        <div class="common__box infographic__box">
            <div class="infographic__header">
                <p class="infographic__title">{{info1Term}} 전국에는 <strong class="commonColor01">{{info1TotalVl}}</strong>개의 주소가 새로 부여 되었습니다.</p>
                <p class="infographic__text"><strong class="commonColor02">{{info1JusoRnkNm}}</strong>이/가 <strong class="commonColor01">{{info1JusoRnkCnt}}</strong>건으로 새로운 주소가 가장 많이 부여 되었습니다.</p>
            </div>
            <div class="infographic__date"><span class="commonBullet">※</span> 기준일: {{statsYm}} ~ {{edYm}}</div>
            <div class="infographic__chart">
            <div class="infographic__chartHeader">
                    <p class="infographic__chartTitle">상위 5개 시도</p>
                    <ul class="infographic__chartList">
                        <li v-for="(item, index) in extractionInfo1" :key="index" :class="'color0' + ++index">
                            <div class="infographic__chartText">
                                <span class="infographic__number">{{ item.info1DRnk }}</span>
                                {{ item.info1AdmNm }}
                            </div>
                            <div class="infographic__chartCounting">
                                <strong class="infographic__chartCountingNumber">{{ item.info1Cnt }}</strong>건
                            </div>
                        </li>
                    </ul>
                </div>
           	 <div class="infographic__chartBox" id="myPieChart1"></div>
            </div>

            <DataTable 
                class="tableStyle02"
                :value="columns1"
                ref="dataTableRef01"
            >
                <Column style="width:10%;" header="No" field="info1DRnk" />
                <Column header="시도명" field="info1AdmNm" />
                <Column header="부여된 주소 수" field="info1Cnt" />
            </DataTable>
        </div>
        <div class="common__box infographic__box">
            <div class="infographic__header">
                <p class="infographic__title">기초 자치단체 중에는 <strong class="commonColor02">{{info2JusoRnkNm2}}</strong>이/가 <strong class="commonColor01">{{info2JusoRnkCnt2}}</strong>건으로 가장 많았으며,</p>
                <p class="infographic__text"><strong class="commonColor02">{{info2JusoRnkNm3}}</strong>이/가 <strong class="commonColor01">{{info2JusoRnkCnt3}}</strong>건으로 두번째로 많이 부여 되었습니다.</p>
            </div>
            <div class="infographic__date"><span class="commonBullet">※</span> 기준일: {{statsYm}} ~ {{edYm}}</div>
            <div class="infographic__chart">
            <div class="infographic__chartHeader">
                    <p class="infographic__chartTitle">상위 5개 시군구</p>
                    <ul class="infographic__chartList">
                        <li v-for="(item, index) in columns2" :key="index" :class="'color0' + ++index">
                            <div class="infographic__chartText">
                                <span class="infographic__number">{{ item.info2DRnk }}</span>
                                {{ item.info2AdmNm }}
                            </div>
                            <div class="infographic__chartCounting">
                                <strong class="infographic__chartCountingNumber">{{ item.info2Cnt }}</strong>건
                            </div>
                        </li>
                    </ul>
                </div>
				<div class="infographic__chartBox" id="myPieChart2"></div>
			</div>
            <DataTable 
                class="tableStyle02"
                :value="columns2"
                ref="dataTableRef02"
            >
                <Column style="width:10%;" header="No" field="info2DRnk" />
                <Column header="시군구명" field="info2AdmNm" />
                <Column header="부여된 주소 수" field="info2Cnt" />
            </DataTable>
        </div>
        <div class="common__box infographic__box">
            <div class="infographic__header">
                <p class="infographic__title">최근 1년간의 <strong>주소부여 추이</strong>를 살펴보겠습니다.</p>
            </div>
            <div class="infographic__chart">
            <div class="infographic__chartHeader">
                    <p class="infographic__chartTitle">상위 5개 년/월</p>
                    <ul class="infographic__chartList">
                        <li v-for="(item, index) in extractionInfo3" :key="index" :class="'color0' + ++index">
                            <div class="infographic__chartText">
                                <span class="infographic__number">{{ index++ }}</span>
                                {{ item.info3StatsYm }}
                            </div>
                            <div class="infographic__chartCounting">
                                <strong class="infographic__chartCountingNumber">{{ item.info3Cnt }}</strong>건
                            </div>
                        </li>
                    </ul>
                </div>
            <div class="infographic__chartBox" id="myLineChart"></div>
			</div>
            <DataTable 
                class="tableStyle02"
                :value="columns3"
                ref="dataTableRef03"
            >
                <Column style="width:10%;" header="No" field="info3DRnk" />
                <Column header="기준년월" field="info3StatsYm" />
                <Column header="부여된 주소 수" field="info3Cnt" />
            </DataTable>
        </div>
    </div>
    <div v-show="active === 1">
        <div class="common__box pureKorean__box">
            <div class="pureKorean__header">
                <p class="pureKorean__headerTitle"><strong>순 우리말</strong>을 사용한 도로명은 어떤것이 있을까요?</p>
                <p class="pureKorean__headerText">아름다운 순 우리말에서 유래한 도로명을 소개합니다.
                    <span class="pureKorean__sort">(가나다순입니다.)</span>
                </p>
            </div>
            <ul class="pureKorean__list">
                <li class="type01">
                    <div class="pureKorean__listTitle">모꼬지</div>
                    <div class="pureKorean__datail">
                        <p class="pureKorean__listText">
                            <strong>'놀이'</strong>나 <strong>'잔치'</strong> 또는 그 밖의 일로 여러 사람이 모이는 일
                        </p>
                        <ul class="pureKorean__innerList">
                            <li>
                                <div class="pureKorean__innerListTitle">· 모고지로</div>
                                <div class="pureKorean__innerListText">경기도 남양주시와 가평군에 걸친 도로</div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="type02">
                    <div class="pureKorean__listTitle">미리내</div>
                    <div class="pureKorean__datail">
                        <p class="pureKorean__listText">
                            <strong>'은하수'</strong>를 뜻하는 순 우리말
                        </p>
                        <ul class="pureKorean__innerList">
                            <li>
                                <div class="pureKorean__innerListTitle">· 미리내로</div>
                                <div class="pureKorean__innerListText">세종특별자치시</div>
                            </li>
                            <li>
                                <div class="pureKorean__innerListTitle">· 미리내길</div>
                                <div class="pureKorean__innerListText">
                                    <span class="text">경기도 양평군,</span>
                                    <span class="text">강원특별자치도 속초시,</span>
                                    <span class="text">제주특별자치도 제주시</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="type03">
                    <div class="pureKorean__listTitle">에움</div>
                    <div class="pureKorean__datail">
                        <p class="pureKorean__listText">
                            <strong>'사방을 빙 둘러싸다'</strong>는 뜻의 순 우리말
                        </p>
                        <ul class="pureKorean__innerList">
                            <li>
                                <div class="pureKorean__innerListTitle">· 에움길</div>
                                <div class="pureKorean__innerListText">부산광역시 영도구</div>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="type04">
                    <div class="pureKorean__listTitle">해오름</div>
                    <div class="pureKorean__datail">
                        <p class="pureKorean__listText">
                            <strong>'일출'</strong>을 뜻하는 순우리말
                        </p>
                        <ul class="pureKorean__innerList">
                            <li>
                                <div class="pureKorean__innerListTitle">· 해오름로</div>
                                <div class="pureKorean__innerListText">
                                    <span class="text">강원특별자치도 속초시,</span>
                                    <span class="text">경상북도 김천시</span>
                                </div>
                            </li>
                            <li>
                                <div class="pureKorean__innerListTitle">· 해오름길</div>
                                <div class="pureKorean__innerListText">
                                    <span class="text">울산광역시 중구, </span>
                                    <span class="text">경기도 양평군, </span>
                                    <span class="text">강원특별자치도 춘천시, </span>
                                    <span class="text">전라남도 남원시, </span>
                                    <span class="text">전라남도 담양군, </span> 
                                    <span class="text">경산북도 경산시</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div v-show="active === 2">
        <div class="common__box roadNamesCountry">
            <div class="roadNamesCountry__header">
                <div class="roadNamesCountry__map">
                    <img src="@images/story/pc/img_map.png" alt="@images/story/pc/img_map.png" />
                </div>
                <dl class="roadNamesCountry__explanation">
                    <dt><strong>국토 끝섬</strong>에도 도로명이 있다.</dt>
                    <dd>우리나라 3면의 끝에는 어떤 도로가 있을까요?</dd>
                    <dd>두리나라 <span class="commonColor01">끝을 지키는 도로</span>에 대해서 자세히 알아 볼까요?</dd>
                </dl>
            </div>
            <ul class="roadNamesCountry__content">
                <li>
                    <p class="roadNamesCountry__contentTitle">백령도 두무진로</p>
                    <dl class="roadNamesCountry__contentDatail">
                        <dt>· 부여사유</dt>
                        <dd>명승 8호로 지정된 두무진의 명칭을 이용하여 도로명부여</dd>
                        <dt>· 행정구역</dt>
                        <dd>인천광역시 옹진군 백령면</dd>
                        <dt>· 지역특징</dt>
                        <dd>서해 최북단에 위치한 백령도는 대한민국에서 8번째로 큰섬으로 천혜의 관광명소이다.</dd>
                        <dt>· 관광정보</dt>
                        <dd>백령도 관광정보(한국관광공사)</dd>
                    </dl>
                    <div class="roadNamesCountry__contentButton">
                        <Button @click="movePage(1)" class="commonButton__button" title="자세히보기">
                            <span class="commonButton__text">자세히보기</span>
                            <i aria-hidden="true" class="bi bi-box-arrow-up-right" />
                        </Button>
                    </div>
                </li>
                <li>
                    <p class="roadNamesCountry__contentTitle">독도 독도이사부길</p>
                    <dl class="roadNamesCountry__contentDatail">
                        <dt>· 부여사유</dt>
                        <dd>국민 공모에 의해 도로명 부여</dd>
                        <dt>· 행정구역</dt>
                        <dd>경성북도 울릉군 울릉읍</dd>
                        <dt>· 지역특징</dt>
                        <dd>독도는 동도와 서도로 이루어진 섬으로 동도에는 독도 이사부길, 서도에는 독도안용복길이 있다.</dd>
                        <dt>· 관광정보</dt>
                        <dd>독도 관광정보(한국관광공사)</dd>
                    </dl>
                    <div class="roadNamesCountry__contentButton">
                        <Button @click="movePage(2)" class="commonButton__button" title="자세히보기">
                            <span class="commonButton__text">자세히보기</span>
                            <i aria-hidden="true" class="bi bi-box-arrow-up-right" />
                        </Button>
                    </div>
                </li>
                <li>
                    <p class="roadNamesCountry__contentTitle">가거도 가거도길</p>
                    <dl class="roadNamesCountry__contentDatail">
                        <dt>· 부여사유</dt>
                        <dd>가거도의 마을이름을 이용하여 도로명 부여</dd>
                        <dt>· 행정구역</dt>
                        <dd>전라남도 신안군 흑산면</dd>
                        <dt>· 지역특징</dt>
                        <dd>최서남단에 위치한 "가히 살만한 섬"이라는 뜻의 가거도는 산세가 높고 절벽으로 형성되어 웅장한 절경을 자랑하는 섬으로 우리나라에서 해가 가장 늦게 지는 곳이다.</dd>
                        <dt>· 관광정보</dt>
                        <dd>가거도 관광정보(한국관광공사)</dd>
                    </dl>
                    <div class="roadNamesCountry__contentButton">
                        <Button @click="movePage(3)" class="commonButton__button" title="자세히보기">
                            <span class="commonButton__text">자세히보기</span>
                            <i aria-hidden="true" class="bi bi-box-arrow-up-right" />
                        </Button>
                    </div>
                </li>
                <li>
                    <p class="roadNamesCountry__contentTitle">마라도 마라로</p>
                    <dl class="roadNamesCountry__contentDatail">
                        <dt>· 부여사유</dt>
                        <dd>마라도 마을 해안도로 도로명 부여</dd>
                        <dt>· 행정구역</dt>
                        <dd>제주특별자치도 서귀포시 대정읍</dd>
                        <dt>· 지역특징</dt>
                        <dd>마라도는 대한민국 최남단에 있는 섬으로 주변 일대가 천연기념물 제 423호로 지정되어 보호되고 있다.</dd>
                        <dt>· 관광정보</dt>
                        <dd>마라도 관광정보(한국관광공사)</dd>
                    </dl>
                    <div class="roadNamesCountry__contentButton">
                        <Button @click="movePage(4)" class="commonButton__button" title="자세히보기">
                            <span class="commonButton__text">자세히보기</span>
                            <i aria-hidden="true" class="bi bi-box-arrow-up-right" />
                        </Button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import Breadcrumb from 'primevue/breadcrumb'
import TabMenu from 'primevue/tabmenu'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import axios from 'axios';
import qs from 'qs';
import * as echarts from 'echarts';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import { Chart, LineController, PointElement, LineElement, PieController, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

Chart.register(LineController, PointElement, LineElement, PieController, ArcElement, Tooltip, Legend, CategoryScale, LinearScale );

// 브레드크럼
const breadcrumbs = [
    {
        label:'메인',
        title:'메인으로 이동',
        url: '/',
    },
    {
        label:'주소이야기',
        title:'주소이야기로 이동',
        url: '/',
    },
    {
        label:'도로명주소 인포그래픽',
        title:'도로명주소 인포그래픽 이동',
        url: '/',
    },
]

const active =ref(0);
const tabItems = ref([
    {label:'주소,얼마나 생길까요?'},
    {label:'순 우리말 도로명은?'},
    {label:'우리나라 끝을 지키는 도로명은?'},
]);

const onTabChange = (e) => {
    active.value = e.index;
}

//테이블
const dataTableRef01 = ref(null);
const dataTableRef02 = ref(null);
const dataTableRef03 = ref(null);

const columns1 = ref([]);
const columns2 = ref([]);
const columns3 = ref([]);

//기간
const statsYm = ref('');
const edYm = ref('');

//info1
const info1DRnk = ref([]);
const info1AdmNm = ref([]);
const info1Cnt = ref([]);
const info1Term = ref('');
const info1TotalVl = ref('');
const info1JusoRnkNm = ref('');
const info1JusoRnkCnt = ref('');

//info2
const info2DRnk = ref([]);
const info2AdmNm = ref([]);
const info2Cnt = ref([]);
const info2JusoRnkNm2 = ref('');
const info2JusoRnkCnt2 = ref('');
const info2JusoRnkNm3 = ref('');
const info2JusoRnkCnt3 = ref('');

//info3
const info3DRnk = ref([]);
const info3StatsYm = ref([]);
const info3Cnt = ref([]);

//차트컬러
const randomColor = () => {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for(let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

//파이차트
const createPieChart = (type, labels, data) => {
	console.log("type : ", type);
	console.log('파이차트 labels : ', labels);
	console.log('파이차트 data : ', data);
	let chartDom = document.getElementById('myPieChart1');
	let myChart = echarts.init(chartDom);
	
	const backgroundColors = labels.map(() => randomColor());
	
	const option = {
			tooltip: {
				trigger: 'item',
				formatter: (params) => {
					const data = params.value.toLocaleString();
					return `${params.name} : ${data}(건)`
				}
			},
			series: [
				{
					name: '주소 수',
					type: 'pie',
					radius: '80%',
					data: labels.map((label, index) => ({
						name: label,
						value: data[index],
					})),
				}
			]
	}
	
	console.log('파이차트 : ', option);
	
	myChart.setOption(option);
	
	console.log('마이차트', myChart.getOption().series[0].data);
	
	window.addEventListener('resize', () => {
		myChart.resize();
	});
};

//파이차트
const createPieChart2 = (type, labels, data) => {
	console.log("type : ", type);
	console.log('파이차트 labels : ', labels);
	console.log('파이차트 data : ', data);
	let chartDom2 = document.getElementById('myPieChart2');
	let myChart2 = echarts.init(chartDom2);
	
	const backgroundColors = labels.map(() => randomColor());
	
	const option = {
			tooltip: {
				trigger: 'item',
				formatter: (params) => {
					const data = params.value.toLocaleString();
					return `${params.name} : ${data}(건)`
				}
			},
			series: [
				{
					name: '주소 수',
					type: 'pie',
					radius: '80%',
					data: labels.map((label, index) => ({
						name: label,
						value: data[index],
					})),
				}
			]
	}
	
	console.log('파이차트 : ', option);
	
	myChart2.setOption(option);
	
	window.addEventListener('resize', () => {
		myChart2.resize();
	});
};

//꺾은선 그래프
const createLineChart = (labels, data) => {
	console.log("data : ", data);
	let chartDom3 = document.getElementById('myLineChart');
	let myChart3 = echarts.init(chartDom3);
	
	const formattedData = (item) => {
		console.log("item : ", item.toLocaleString())
		return parseInt(item);
	}
	
	const option = {
			tooltip: {
				trigger: 'axis',
				formatter: (params) => {
					const label = params[0].name;
					const value = params[0].value.toLocaleString();
					return `${label}<br>부여된 주소 수 : ${value}(건)`;
				}
			},
			xAxis: {
				type: 'category',
				data: labels,
				axisLine: {show: true},
				axisLabel: {interval: 0, rotate: 45},
				splitLine: {show: false}
			},
			yAxis: {
				type: 'value',
				min: 0,
				axisLine: {show: true},
				axisLabel: {
					formatter: '{value}'
				},
				splitLine: {show: true},
				splitNumber: 5,
				interval: 2000
			},
			series: [
				{
					name: '부여된 주소 수',
					type: 'line',
					data: labels.map((label, index) => ({
						name: label,
						value: data[index],
					})),
					smooth: false,
					lineStyle: {
						width: 2,
						color: '#5470C6'
					},
					itemStyle: {
						color: '#5470C6'
					},
					label: {
						show: true,
						formatter: '{c}'
					}
				}
			]
	}
	
	myChart3.setOption(option);
	
	window.addEventListener('resize', () => {
		myChart3.resize();
	});
};

//info1 그래프 데이터
const info1FnGraph = async () => {
	try {
		const response = await axios.post('/api/ahs/selectGrantGraph', qs.stringify({type1: "info"}),
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		console.log("response : ", response);
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const info1 = Array.from(xmlDoc.getElementsByTagName('info1'));

		info1Term.value = results[0]?.getElementsByTagName('term')[0]?.textContent || '';
		info1TotalVl.value = parseInt(results[0]?.getElementsByTagName('jusoTotVl1')[0]?.textContent || '').toLocaleString();
		info1JusoRnkNm.value = results[0]?.getElementsByTagName('jusoRnkNm1')[0]?.textContent || '';
		info1JusoRnkCnt.value = parseInt(results[0]?.getElementsByTagName('jusoRnkCnt1')[0]?.textContent || '').toLocaleString();
		statsYm.value = results[0]?.getElementsByTagName('statsYm')[0]?.textContent || '';
		edYm.value = results[0]?.getElementsByTagName('edYm')[0]?.textContent || '';
		info1DRnk.value = info1.map(data => parseInt(data.getElementsByTagName('dRnk')[0]?.textContent, 10) || 0);
		info1AdmNm.value = info1.map(data => data.getElementsByTagName('admNm')[0]?.textContent || '');
		info1Cnt.value = info1.map(data => parseInt(data.getElementsByTagName('cnt')[0]?.textContent, 10) || 0);

		if(response.data != null) {
			columns1.value = info1DRnk.value.map((dRnk, index) => ({
				info1DRnk: dRnk,
				info1AdmNm: info1AdmNm.value[index],
				info1Cnt: info1Cnt.value[index].toLocaleString()
			}));
		} 
		console.log("columns : ", columns1.value);
		
		createPieChart('1', info1AdmNm.value, info1Cnt.value);
	} catch (error) {
		console.log(error);
	}
}

const colorArr1 = ['rgb(84, 112, 198)', 'rgb(145, 204, 117)', 'rgb(250, 200, 88)', 'rgb(238, 102, 102)', 'rgb(115, 192, 222)']

const extractionInfo1 = computed(() => {
	return [...columns1.value]
		.sort((a, b) => parseInt(b.info1Cnt.replace(/,/g, '')) - parseInt(a.info1Cnt.replace(/,/g, '')))
		.slice(0, 5);
})

//info2 그래프 데이터
const info2FnGraph = async () => {
	try {
		const response = await axios.post('/api/ahs/selectGrantGraph', qs.stringify({type1: "info"}),
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		console.log("response : ", response);
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const info2 = Array.from(xmlDoc.getElementsByTagName('info2'));
		
		info2JusoRnkNm2.value = results[0]?.getElementsByTagName('jusoRnkNm2')[0]?.textContent || '';
		info2JusoRnkCnt2.value = parseInt(results[0]?.getElementsByTagName('jusoRnkCnt2')[0]?.textContent || '').toLocaleString();
		info2JusoRnkNm3.value = results[0]?.getElementsByTagName('jusoRnkNm3')[0]?.textContent || '';
		info2JusoRnkCnt3.value = parseInt(results[0]?.getElementsByTagName('jusoRnkCnt3')[0]?.textContent || '').toLocaleString();
		info2DRnk.value = info2.map(data => parseInt(data.getElementsByTagName('dRnk')[0]?.textContent, 10) || 0);
		info2AdmNm.value = info2.map(data => data.getElementsByTagName('admNm')[0]?.textContent || '');
		info2Cnt.value = info2.map(data => parseInt(data.getElementsByTagName('cnt')[0]?.textContent, 10) || 0);
		
		if(response.data != null) {
			columns2.value = info2DRnk.value.map((dRnk, index) => ({
				info2DRnk: dRnk,
				info2AdmNm: info2AdmNm.value[index],
				info2Cnt: info2Cnt.value[index].toLocaleString()
			}));
		} 
		console.log("columns2 : ", columns2);
		
		createPieChart2('2', info2AdmNm.value, info2Cnt.value);
	} catch (error) {
		console.log(error);
	}
}

//info3 그래프 데이터
const info3FnGraph = async () => {
	try {
		const response = await axios.post('/api/ahs/selectGrantGraph', qs.stringify({type1: "info"}),
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		console.log("response3 : ", response);
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const info3 = Array.from(xmlDoc.getElementsByTagName('info3'));
		
		info3DRnk.value = info3.map(data => parseInt(data.getElementsByTagName('dRnk')[0]?.textContent, 10) || 0);
		info3StatsYm.value = info3.map(data => data.getElementsByTagName('statsYm')[0]?.textContent || '');
		info3Cnt.value = info3.map(data => parseInt(data.getElementsByTagName('cnt')[0]?.textContent, 10) || 0);
		
		if(response.data != null) {
			console.log("info3DRnk.value", info3DRnk.value)
			columns3.value = info3DRnk.value.map((dRnk, index) => ({
				info3DRnk: dRnk,
				info3StatsYm: info3StatsYm.value[index],
				info3Cnt: info3Cnt.value[index].toLocaleString()
			}));
		} 
		console.log("columns3 : ", columns3);
		
		createLineChart(info3StatsYm.value, info3Cnt.value);
	} catch (error) {
		console.log(error);
	}
}

const extractionInfo3 = computed(() => {
	return [...columns3.value]
		.sort((a, b) => parseInt(b.info3Cnt.replace(/,/g, '')) - parseInt(a.info3Cnt.replace(/,/g, '')))
		.slice(0, 5);
})

function movePage(data) {
	console.log("data : ", data);
	if(data === 1) {
		window.open('https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=c2896867-359b-4d50-bf56-c71fa1118c82', '_blank');
	} else if(data === 2) {
		window.open('https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=0c6762e4-6504-458c-8756-d59519babb84', '_blank');
	} else if(data === 3) {
		window.open('https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=a85fb330-8954-483c-ae26-b26060db2864', '_blank');
	} else if(data === 4) {
		window.open('https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=19b4ad99-2045-4fea-8614-7d9a82d44a91&big_category=A01&mid_category=A0101&big_area=39', '_blank');
	}
}

onMounted(() => {
	info1FnGraph();
	info2FnGraph();
	info3FnGraph();
	
    //th에 scope달기
    const headers = document.querySelectorAll('th[role="columnheader"]');
    headers.forEach(header => {
        header.setAttribute('scope', 'col');
    })

    //캡션 추가
    const dataTableEl01 = dataTableRef01.value.$el.querySelector('.p-datatable-table');
    if (dataTableEl01) {
        const caption = document.createElement('caption');
        caption.textContent = '도로명주소 인포그래픽 테이블로 순번, 시도명, 부여된 주소 수 정보를 제공합니다.';
        dataTableEl01.prepend(caption);
    }

    const dataTableEl02 = dataTableRef02.value.$el.querySelector('.p-datatable-table');
    if (dataTableEl02) {
        const caption = document.createElement('caption');
        caption.textContent = '도로명주소 인포그래픽 테이블로 순번, 시군구명, 부여된 주소 수 정보를 제공합니다.';
        dataTableEl02.prepend(caption);
    }

    const dataTableEl03 = dataTableRef03.value.$el.querySelector('.p-datatable-table');
    if (dataTableEl03) {
        const caption = document.createElement('caption');
        caption.textContent = '도로명주소 인포그래픽 테이블로 순번, 기준년월, 부여된 주소 수 정보를 제공합니다.';
        dataTableEl03.prepend(caption);
    }
})
</script>