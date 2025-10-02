<template>
	<CommonBreadcrumb />
	<HeaderTitle title="우리 집 주소는?" />

	<AddressSearchBox placeholder="주소를 입력해 보세요" title="주소를 입력해 보세요" ref="searchBoxRef" @selectValue="getData"/>

	<div class="common__box myHomeAddress">
	    <div class="myHomeAddress__basicInformation">
	        <div class="myHomeAddress__mostionBox" aria-hidden="true">
	            <svg class="" :class="{ 'movingAddress': isAnimating }" width="620" height="800" xmlns="http://www.w3.org/2000/svg">
	                <path d="M 5 120 L 300 30 L 615 120 L 615 790 L 5 790 Z" stroke="#f0f3fd" stroke-width="60" fill="none"/>
	            </svg>
	        </div>
	        <div class="myHomeAddress__innerBox">
		        <div class="myHomeAddress__koAdress01">{{ data.rdNmStr }}</div>
		        <div class="myHomeAddress__enAdress01">{{ data.rdEngNm }}</div>
		        <div class="myHomeAddress__number">{{ data.buldSlno != "0" ? (data.buldMnnm + "-" + data.buldSlno) : data.buldMnnm }}</div>
		        <div class="myHomeAddress__table">
		            <table class="myHomeAddress__detail">
		                <caption>도로명 주소에 관련된 정보로 도로명주소, 영문주소, 건물명, 관할주민센터, 우편번호를 제공합니다.</caption>
                    <thead>
                    </thead>
                    <tbody>
                        <tr>
                          <th>도로명주소</th>
                          <td>{{ data.schKorRoadNm }}</td>
                        </tr>
                        <tr>
                          <th>영문주소</th>
                          <td>{{ data.engRnAddr }}</td>
                        </tr>
                        <tr>
                          <th>건물명</th>
                          <td>{{ data.bdNm ? data.bdNm : "-" }}</td>
                        </tr>
                        <tr>
                          <th>관할주민센터</th>
                          <td>
                            <p class="myHomeAddress__tip"><span class="commonBullet"></span> {{ data.juminCenter }}</p>
                          </td>
                        </tr>
                        <tr>
                          <th>우편번호</th>
                          <td>{{ data.zipCl }}</td>
                        </tr>
                    </tbody>
                    <tfoot></tfoot>
		            </table>
		        </div>
	        </div>
	        
	        <div class="myHomeAddress__more active" :class="{ 'active': isAnimating }">
	            <Button class="commonButton__button" title="도로구간보기" @click.prevent="fnRoadLctnPopup(data.rdMgtSn, data.rdNm)">
	                <span class="commonButton__text">도로구간보기</span>
	                <i aria-hidden="true" class="bi bi-box-arrow-up-right" />
	            </Button>
	        </div>
	    </div>
	    <div class="myHomeAddress__otherInformation">
	        <div class="myHomeAddress__addressWrap" :class="{ 'active': isAnimating }">
	            <div class="myHomeAddress__address">
	                <div class="myHomeAddress__koAdress02">{{ data.rdNmStr }}</div>
	                <div class="myHomeAddress__enAdress02">{{ data.rdEngNm }}</div>
	            </div>
	        </div>
	        <div class="myHomeAddress__other">
	            <div class="myHomeAddress__grant">
	                <strong class="myHomeAddress__title">부여사유</strong>
	                <span class="myHomeAddress__text">{{ detailData.grantDe == '-' ? "조회된 데이터가 없습니다." : detailData.grantDe }}</span>
	            </div>
	            <ul class="myHomeAddress__info" v-if="detailData.grantDe != '-'">
	                <li>
	                    <strong class="myHomeAddress__stitle">고시일</strong>
	                    <span class="myHomeAddress__date">{{ detailData.noticeYmd }}</span>
	                </li>
	                <li>
	                    <strong class="myHomeAddress__stitle">효력발생일</strong>
	                    <span class="myHomeAddress__date">{{ detailData.effectDe }}</span>
	                </li>
	                <li>
	                    <strong class="myHomeAddress__stitle">길이</strong>
	                    <span class="myHomeAddress__length">{{ detailData.roadLt }}m</span>
	                </li>
	            </ul>
	        </div>
	    </div>
	</div>
</template>
<script setup>
import { ref, watch, reactive, defineAsyncComponent, onMounted, defineExpose } from "vue";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import HeaderTitle from '@components/title/HeaderTitle.vue';
import ContentTitle from '@components/title/ContentTitle.vue';
import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
import AddressSearchBox from '@components/search_box/AddressSearchBox.vue';
import _ from 'lodash';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";

const searchBoxRef = ref(null);
const selectValue = ref({});
const isAnimating = ref(false);

const dataInfo = {
	buldMnnm : "189"
	,buldSlno : "0"
	,rdNm : "서울특별시 마포구 성암로 189 중소기업 DMC 타워"
	,schKorRoadNm : "서울특별시 마포구 성암로 189 (상암동)"
	,engRnAddr : "189 Seongam-ro, Mapo-gu, Seoul"
	,bdNm : "중소기업 DMC 타워"
	,zipCl : "03929"
	,rdMgtSn : "114403113012"
	,rdNmStr : "성암로"
	,rdEngNm : "Seongam-ro"
	,juminCenter : "※ 관할주민센터 정보는 거주지에 한해서 제공됩니다"
}

const detailDataInfo = {
	rdNmStr : "성암로"
	,rdEngNm : "Seongam-ro"
	,grantDe : "성산동과 상암동을 지나는 도로로서, 행정동 명칭을 인용하여 부여함"
	,noticeYmd : "2010.06.17"
	,srtCn : ""
	,endCn : ""
	,roadLt : "3,485"
	,effectDe : "2010.06.17"
}

const data = reactive({});
const detailData = reactive({});

const getData = async (returnValue) => {
	console.log('returnValue ->', returnValue);
	returnValue.dataInfo.engRnAddr = returnValue.dataInfo.bdMaSn + (returnValue.dataInfo.bdSbSn != 0 ? '-' + returnValue.dataInfo.bdSbSn : '') + ' ' + returnValue.dataInfo.rdEngNm + ', ' + returnValue.dataInfo.sggEngNm + ', ' + returnValue.dataInfo.siEngNm;
	returnValue.dataInfo.buldMnnm = returnValue.dataInfo.bdMaSn;
	returnValue.dataInfo.buldSlno = returnValue.dataInfo.bdSbSn;
	returnValue.dataInfo.juminCenter = returnValue.dataInfo.siNm + ' ' + returnValue.dataInfo.sggNm + ' ' + returnValue.dataInfo.hemdNm + ' ☎ ' + returnValue.dataInfo.juminCenterNumber_01;

	data.value = null;
	detailData.value = null;
	
	Object.assign(data, _.cloneDeep(returnValue.dataInfo));
	
	if (returnValue.detailDataInfo) {
		Object.assign(detailData, _.cloneDeep(returnValue.detailDataInfo));
	} else {
		detailData.grantDe = "-";
		detailData.noticeYmd = "-";
		detailData.effectDe = "-";
		detailData.roadLt = "-";
	}
	
	detailData.noticeYmd = formatData(detailData.noticeYmd);
	detailData.effectDe = formatData(detailData.effectDe);
	detailData.roadLt = detailData.roadLt.toLocaleString();
	
	console.log('data -> ', data);
	console.log('detailData -> ', detailData);
}

//팝업 고시일, 효력발생일 포맷
const formatData = (dateStr) => {
	if (dateStr && dateStr.length === 8) {
		return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6)}`;
	}
	return dateStr;
}

const fnRoadLctnPopup = (rdMgtSn, rdNm) => {
	let strSigCd = rdMgtSn.substring(0, 5);
	let strRoadNmCd = rdMgtSn.substring(5);
	let url = '/map/totalMapView?';
	url += `searchType=roadNm&rdCd=${strRoadNmCd}&rdNm=${rdNm}&sigCd=${strSigCd}`;
	//url += 'searchType=myArea&rdMgtSn=' + rdMgtSt + '&rdNm=' + rdNm;
	//url += 'searchType=myArea&rdMgtSn=4511022266001&rdNm=전라북도 전주시 기린대로';
	const width = window.innerWidth;
	const height = window.innerHeight;
	window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
}

watch(data, () => {
    isAnimating.value = true;
    setTimeout(() => {
        isAnimating.value = false;
    }, 1500);
}, { deep: true });

onMounted( async () => {
	Object.assign(data, _.cloneDeep(dataInfo));
	Object.assign(detailData, _.cloneDeep(detailDataInfo));
});

</script>