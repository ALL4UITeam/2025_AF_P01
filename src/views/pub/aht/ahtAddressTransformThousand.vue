<template>
	<CommonBreadcrumb />
    <HeaderTitle title="주소전환" />

    <TabMenu :model="tabItems" :activeIndex="active" @tab-change="onTabChange" />
    <div v-show="active === 0">
        <div class="dataTable__wrap">
		    <div class="commonHeader">
		        <ContentTitle title="전환결과" fontSize="24px" marginTop="0" mobileFontSize="18px" mobileMarginTop="0" />
		        <Button class="commonButton__button" title="신청화면" @click.prevent="fnBfrPage()">
		            <span class="commonButton__text">신청화면</span>
		            <i aria-hidden="true" class="bi bi-arrow-right" />
		        </Button>
		    </div>
            <DataTable 
                class="tableStyle01 noneLine"
                :value="refineNocsInfo"
                ref="dataTableRef"
            >
                <Column header="No" field="inptNo" style="width:10%" />
       	        <Column header="입력좌표(X,Y)" field="xy" v-if="xyFlag" style="width:20%" />
                <Column header="지번주소" field="inptAddr" />
                <Column header="전환주소" field="resultRn" />
                <Column header="기타주소" field="etcAddr" v-if="!xyFlag"/>
                <template #empty>
       	 			<span class="centerHover">
          				표시할 데이터가 없습니다.
        			</span>
      			</template>
            </DataTable>
            <div class="addressConvert__footer">
                <div>
                    <Button class="commonButton__button" title="전체파일 저장" @click.prevent="fnExcelDwnld('all')">
                        <span class="commonButton__text">전체파일 저장</span>
                        <i aria-hidden="true" class="bi bi-download" />
                    </Button>
                </div>
                <div class="addressConvert__button">
                    <Button class="commonButton__button" title="전환성공 저장" @click.prevent="fnExcelDwnld('suc')">
                        <span class="commonButton__text">전환성공 저장</span>
                        <i aria-hidden="true" class="bi bi-download" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
    <div v-show="active === 1">
        <div class="dataTable__wrap">
		    <div class="commonHeader">
		        <ContentTitle title="전환결과" fontSize="24px" marginTop="0" mobileFontSize="18px" mobileMarginTop="0" />
		        <Button class="commonButton__button" title="신청화면" @click.prevent="fnBfrPage()">
		            <span class="commonButton__text">신청화면</span>
		            <i aria-hidden="true" class="bi bi-arrow-right" />
		        </Button>
		    </div>
            <DataTable 
                class="tableStyle01 noneLine"
                :value="refuneMultiNocsDetail"
                ref="dataTableRef"
            >
            <ColumnGroup type="header">
	            <Row>
    	            <Column header="No" style="width:10%" />
        	        <Column header="입력좌표(X,Y)" v-if="xyFlag" style="width:20%"/>
        	        <Column header="지번주소"/>
            	    <Column header="전환주소"/>
                	<Column header="기타주소" v-if="!xyFlag"/>
	            </Row>
            </ColumnGroup>
   	            <Column field="inptNo" style="width:10%" />
       	        <Column field="xy" v-if="xyFlag"/>
       	        <Column field="inptAddr"/>
       	        <Column field="refineMultiNocs.roadNm">
	       	        <template #body="slotProps">
	                	<CustomDropdown inputId="refineMultiNocs" v-model="slotProps.data.selRoadNm" :options="slotProps.data.refineMultiNocs"
	                	  title="복수주소 선택" placeholder="주소를 선택해주세요."/>
	                </template>
                </Column>
               	<Column field="etcAddr" v-if="!xyFlag"/>
               	<template #empty>
       	 			<span class="centerHover">
          				표시할 데이터가 없습니다.
        			</span>
      			</template>
            </DataTable>
            <div class="addressConvert__footer alignRight">
                <div class="addressConvert__button">
                    <Button class="commonButton__button" title="선택주소 저장" @click.prevent="fnExcelDwnld('multiSelect')">
                        <span class="commonButton__text">선택주소 저장</span>
                        <i aria-hidden="true" class="bi bi-download" />
                    </Button>
                    <Button class="commonButton__button" title="복수주소 저장" @click.prevent="fnExcelDwnld('multiAll')">
                        <span class="commonButton__text">복수주소 저장</span>
                        <i aria-hidden="true" class="bi bi-download" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
    <div v-show="active === 2">

        <div class="dataTable__wrap">
		    <div class="commonHeader">
		        <ContentTitle title="전환결과" fontSize="24px" marginTop="0" mobileFontSize="18px" mobileMarginTop="0" />
		        <Button class="commonButton__button" title="신청화면" @click.prevent="fnBfrPage()">
		            <span class="commonButton__text">신청화면</span>
		            <i aria-hidden="true" class="bi bi-arrow-right" />
		        </Button>
		    </div>
            <DataTable 
                class="tableStyle01 addressTransform"
                :value="refineFailNocsInfo"
                ref="dataTableRef02"
                >
                <ColumnGroup type="header">
                    <Row>
                        <Column header="No" :rowspan="2" />
                        <Column header="입력주소" :rowspan="2" />
                        <Column header="정제주소" :colspan="8" />
                    </Row>
                    <Row>
                        <Column class="subLine" header="시도" />
                        <Column class="line" header="시군구"  />
                        <Column class="line" header="읍면동"  />
                        <Column class="line" header="리"  />
                        <Column class="line" header="산"  />
                        <Column class="line" header="지번"  />
                        <Column class="line" header="기타주소"  />
                        <Column class="line" header="비고"  />
                    </Row>
                </ColumnGroup>
                <Column field="inptNo" />
                <Column field="inptAddr" />
                <Column field="cityname"  
                >
                    <template #body="slotProps">
                        <CustomInputText v-model="slotProps.data.ctpvNm" id="ctpvNm"  class="input" :name="slotProps.ctpvNm" value="" placeholder="" title="" /> 
                    </template>
                </Column>
                <Column field="county" 
                >
                    <template #body="slotProps">
                        <CustomInputText v-model="slotProps.data.sggNm" id="sggNm" class="input" :name="slotProps.sggNm" value="" placeholder="" title="" /> 
                    </template>
                </Column>
                <Column field="town" 
                >
                    <template #body="slotProps">
                        <CustomInputText v-model="slotProps.data.emdNm" id="emdNm" class="input" :name="slotProps.emdNm" value="" placeholder="" title="" /> 
                    </template>
                </Column>
                <Column field="ri"  
                >
                    <template #body="slotProps">
                        <CustomInputText v-model="slotProps.data.stliNm" id="stliNm" class="input" :name="slotProps.stliNm" value="" placeholder="" title="" /> 
                    </template>
                </Column>
                <Column field="san" 
                >
                    <template #body="slotProps">
                        <CustomInputText v-model="slotProps.data.mtnSeCd" id="mtnSeCd" :name="slotProps.mtnSeCd"  class="input" value="" placeholder="" title="" /> 
                    </template>
                </Column>
                <Column field="address" 
                >
                    <template #body="slotProps">
                        <CustomInputText v-model="slotProps.data.jibun" id="jibun" :name="slotProps.jibun" class="input" value="" placeholder="" title="" /> 
                    </template>
                </Column>
                <Column field="otheraddress" 
                >
                    <template #body="slotProps">
                        <CustomInputText v-model="slotProps.data.etcAddr" id="etcAddr" :name="slotProps.etcAddr" class="input" value="" placeholder="" title="" /> 
                    </template>
                </Column>
                <Column field="other" />
                
                <template #empty>
       	 			<span class="centerHover">
          				표시할 데이터가 없습니다.
        			</span>
      			</template>
            </DataTable>
        
            <div class="addressConvert__footer alignRight">
                <div class="addressConvert__button">
                    <Button class="commonButton__button" title="미전환 저장" @click.prevent="fnExcelDwnld('fail')">
                        <span class="commonButton__text">미전환 저장</span>
                        <i aria-hidden="true" class="bi bi-download" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Breadcrumb from 'primevue/breadcrumb'
import TabMenu from 'primevue/tabmenu'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import axios from 'axios';
import _ from 'lodash';
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import ContentTitle from '@/components/title/ContentTitle.vue';
import CustomInputText from '@/components/input_text/CustomInputText.vue';
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import { useRouter, useRoute } from "vue-router";
import CommonBreadcrumb from '@/components/breadcrumb/CommonBreadcrumb.vue';
import {useLoadingStore} from "@/stores/ui.loading";

const loadingStore = useLoadingStore();

const router = useRouter();
const route = useRoute();

const dataTableRef = ref(null);

const refineAllNocsInfo = reactive([]);//excel 전체파일 저장용
const refineMultiNocsMake = ref([]); //elcel 전체복수주소 저장용

const refineNocsInfo = reactive([]); //1:1전환성공
const refineMultiNocsInfo = reactive([]); //복수주소전환
const refineFailNocsInfo = reactive([]); //미전환

const refuneMultiNocsDetail = ref([]);

const tempFileName = ref("");

//excel 주소전환 전체주소
const excelHeaderAll = {
	inptNo : "NO"
	,inptAddr : "입력주소"
	,sbdno : "우편번호"
	,roadNm : "도로명"
	,etcAddr : "기타주소"
	,refineSe : "비고"
}

//excel 주소전환 성공주소
const excelHeaderSuc = {
	inptNo : "NO"
	,inptAddr : "입력주소"
	,sbdno : "우편번호"
	,roadNm : "도로명"
	,etcAddr : "기타주소"
}

//excel 주소전환 미전환주소
const excelHeaderFail = {
	inptNo : "NO"
	,ctpvNm : "시도*"
	,sggNm : "시군구*"
	,emdNm : "읍면동*"
	,stliNm : "리"
	,mtnSeCd : "산"
	,jibun : "지번*"
	,etcAddr : "기타주소"
	,inptAddr : "입력주소"
	,resultMsg : "처리결과"
}

//Props
const uploadFile = ref('');
const actlFileNm = ref('');
const xyFlag = ref(false);

const active =ref(0);
const tabItems = ref([
    {label:'1:1 전환성공 (0/0건) 전환완료된 주소 목록'},
    {label:'복수주소전환 (0/0건) 전환완료된 주소 목록'},
    {label:'미전환 (0/0건) 전환완료된 주소 목록'},
]);

const onTabChange = (e) => {
    active.value = e.index;
}
const deleteItem = (id) => {
    items.value = items.value.filter()
}

//테이블
const refineNocs = {
	inptNo : ""
	,inptAddr : ""
	,resultRn : ""
	,etcAddr : ""
}

const refineMultiNocs = {
	multiInptNo : ""
	,inptAddr : ""
	,resultRn : ""
	,etcAddr : ""
}

const refineFailNocs = {
	ctpvNm : ""
	,sggNm : ""
	,emdNm : ""
	,stliNm : ""
	,mtnSeCd : ""
	,jibun : ""
	,etcAddr : ""
}

const change = (i) => {
	console.log('체인지 -> ', i);
}

//3000건 이하 주소전환 실행
const fnThousandConvert = (data) => {
	
	let refineAllSize = 0;
	let refineNocsSize = 0;
	let refineMultiNocsSize = 0;
	let refineFailNocsSize = 0;
		
	if(data.refineAllSize != 0){
		Object.assign(refineAllNocsInfo, data.refineAllNocs);
		refineAllSize = data.refineAllSize;
	}
	
	if(data.refineNocsSize != 0){
		Object.assign(refineNocsInfo, data.refineNocs);
		refineNocsSize = data.refineNocsSize;
	}
	
	if(data.refineMultiNocsSize != 0){
		Object.assign(refineMultiNocsInfo, data.refineMultiNocs);
		refineMultiNocsSize = data.refineMultiNocsSize;
		
		refineMultiNocsInfo.forEach(function(v, i){
			refuneMultiNocsDetail.value.push({"inptNo" : v.inptNo, "sbdno" : v.sbdno, "inptAddr" : v.inptAddr, "xy" : v.xy
										, "refineMultiNocs" : [], "etcAddr" : v.etcAddr, "roadNm" : "", "selRoadNm" : ""});
			v.refineMultiNocs.forEach(function(h, j){
				if(v.inptNo == h.inptNo){
					refuneMultiNocsDetail.value[i].refineMultiNocs.push({'label' : h.sbdno + ' ' + h.roadNm, 'value': h.roadNm});
				}
			})
		})
	}
	
	if(data.refineFailNocsSize != 0){
		Object.assign(refineFailNocsInfo, data.refineFailNocs);
		refineFailNocsSize = data.refineFailNocsSize;
	}
	
	if(data.tempFileName != null && data.tempFileName != undefined){
		tempFileName.value = data.tempFileName;
	}
	
	tabItems.value[0].label = "1:1 전환성공 (" + refineNocsSize + "/" + refineAllSize + "건) 전환완료된 주소 목록";
	tabItems.value[1].label = "복수주소전환 (" + refineMultiNocsSize + "/" + refineAllSize + "건) 전환완료된 주소 목록";
	tabItems.value[2].label = "미전환 (" + refineFailNocsSize + "/" + refineAllSize + "건) 전환완료된 주소 목록";
		
}

//3000건 이하 엑셀다운로드
const fnExcelDwnld = (flag) => {
	
	loadingStore.show();

	let fileNm = "";
	
	let param = {
		"flag" : flag
		,"fileNm" : "주소전환"
		,"headerEngTitle" : ""
		,"dataList" : ""
		,'tempFileName' : tempFileName.value
		,'xyFlag' : xyFlag.value
	}
	
	if(flag == 'all'){
		
		if(refineAllNocsInfo.length == 0) {
			alert('저장할 데이터가 없습니다.');
			return false;
		}
		
		param.headerEngTitle = excelHeaderAll;
		param.dataList = refineAllNocsInfo;
		fileNm = "주소전환_전체주소.xlsx";
		
	}else if(flag == 'suc'){
		
		if(refineNocsInfo.length == 0) {
			alert('저장할 데이터가 없습니다.');
			return false;
		}
		
		param.headerEngTitle = excelHeaderSuc;
		param.dataList = refineNocsInfo;
		fileNm = "주소전환_선택주소.xlsx";
		alert(" 전환에 성공된 주소정보만 다운로드 됩니다. \n\n 복수주소선택과 미전환 주소정보를 확인하시기 바랍니다.");
		
	}else if(flag == 'fail'){
		
		if(refineFailNocsInfo.length == 0) {
			alert('저장할 데이터가 없습니다.');
			return false;
		}
		
		param.headerEngTitle = excelHeaderFail;
		param.dataList = refineFailNocsInfo;
		fileNm = "주소전환_미전환.xlsx";
		
	}else if(flag == 'multiSelect'){
		
		console.log('refuneMultiNocsDetail.value->', refuneMultiNocsDetail.value)

		if(refuneMultiNocsDetail.value.length == 0) {
			alert('저장할 데이터가 없습니다.');
			return false;
		}
		
		param.headerEngTitle = excelHeaderSuc;
		
		refuneMultiNocsDetail.value.forEach(function(value, i){
			if(value.selRoadNm != ""){
				value.roadNm = value.selRoadNm.value
			}
		})
		
		let chkRoadNm = 0;
		for(var i=0; i<refuneMultiNocsDetail.value.length; i++) {
			if(refuneMultiNocsDetail.value[i].roadNm != ""){
				++chkRoadNm;
			}
		}
		
		if(chkRoadNm == 0){
			alert('선택된 복수주소가 없습니다.');
			return false;
		}
		
		
		param.dataList = refuneMultiNocsDetail.value;
		fileNm = "주소전환_선택주소.xlsx";
		alert(" 선택된 주소만 다운로드 됩니다. \n\n 선택되지 않은 주소까지 모두 저장하시려면 \n\n 복수주소 저장버튼을 이용하시기 바랍니다.");
		
	}else if(flag == 'multiAll'){
		
		if(refineMultiNocsInfo.length == 0) {
			alert('저장할 데이터가 없습니다.');
			return false;
		}
		
		param.headerEngTitle = excelHeaderSuc;
		param.dataList = refineMultiNocsInfo;
		fileNm = "주소전환_전체주소.xlsx";
		alert(" 하나의 지번에 다수의 도로명주소가 검색된 목록이 \n\n 모두 저장됩니다.");
	}
	
	console.log('엑셀 파라미터 -> ', param);
	
	axios.post('/api/aht/excel-download', param, {responseType: 'blob'})
		.then(response => {
			const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			
			link.download = fileNm;
			link.click();
		})
	    .catch(error =>{
			console.error("error =>", error);
			alert(error.response.data.message);
		})
		.finally(() => {
			loadingStore.hide();
		})
}

//등록 페이지 이동
const fnBfrPage = () => {
	if(confirm("전환된 내용이 삭제됩니다.\n신청화면으로 이동하시겠습니까?")){
		router.push({
			path: '/aht/AhtAddressTransformOffer',
			state : {active : 1}
		});
	}
}

onMounted( async () => {
    //th에 scope달기
    const headers = document.querySelectorAll('th[role="columnheader"]');
    headers.forEach(header => {
        header.setAttribute('scope', 'col');
    })

    //캡션 추가
    const dataTableEl = dataTableRef.value.$el.querySelector('.p-datatable-table');
    if (dataTableEl) {
        const caption = document.createElement('caption');
        caption.textContent = '지점번호 조회 리스트로 지점번호, 순번, 사물유형, 시/도, 시/군/구를 제공합니다.';
        dataTableEl.prepend(caption);
    }
    
    const data = JSON.parse(history.state.data);
    
    if (data.xyflag) {
    	xyFlag.value = data.xyflag;
    }
    
    await fnThousandConvert(data);
})

</script>


<style lang="scss" scoped>

</style>