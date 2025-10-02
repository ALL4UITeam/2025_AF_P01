<template>
   	<CommonBreadcrumb />
    <div class="commonView__header">
        <HeaderTitle title="주소동일성 영문증명서 발급" />
    </div>

    <div class="common__box">
        <div class="commonTable__wrap">
            <table class="commonTable__detail">
                <caption>도로명 테이블입니다. 항목은 기점, 종점, 고시일, 효력발생일, 길이가 있습니다.</caption>
                <colgroup>
                    <col style="width:20%" />
                    <col />
                </colgroup>
                <tbody>
                <tr>
                    <th scope="col">회사명(Corporate name)</th>
                    <td>{{ inqCndParams.aplyInstNm }}</td>
                </tr>
                <tr>
                    <th scope="col">구 주소(Old Address)</th>
                    <td>{{ inqCndParams.bfrAddr }} {{ inqCndParams.bfrNo02Addr }}</td>
                </tr>
                <tr>
                    <th scope="col">현 주소(Current Address)</th>
                    <td>{{ inqCndParams.newAddr }}</td>
                </tr>
                <tr>
                    <th scope="col">구 우편번호(Old Postal Code)</th>
                    <td>{{ inqCndParams.ozip?.substring(0, 3) }}-{{ inqCndParams.ozip?.substring(3) }}</td>
                </tr>
                <tr>
                    <th scope="col">현 우편번호(New Postal Code)</th>
                    <td>{{ inqCndParams.newZip }}</td>
                </tr>
                <tr>
                    <th scope="col">기업 연락처</th>
                    <td>{{ inqCndParams.ofcTelnoCn }}</td>
                </tr>
                <tr>
                    <th scope="col">신청 사유</th>
                    <td>{{ inqCndParams.chgRsn }}</td>
                </tr>
                <tr>
                    <th scope="col">신청인 첨부파일</th>
                    <td>
                    	<ul class="viewDetails__file" v-if="inqCndParams.qaFileList">
							<li @click="fnFileDwnld(inqCndParams.qaFileList)">
				                <Button>
				                    <span class="bi bi-paperclip">
				                        <span class="blind">첨부된 파일</span>
				                    </span>
				                    <span class="viewDetails__filename">{{ inqCndParams.qaFileList.printFileName }} </span>
				
				                    <span class="bi bi-download">
				                        <span class="blind">다운로드</span>
				                    </span>
				                </Button>
				            </li>
			            </ul>
					</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <p v-if="ansDataList.length > 0" style="margin-left: 5px; margin-top: 20px; font-weight: bold; font-size: 20px;">- 답변</p>
    <!-- 03 완료, 05 종결 -->
	<div class="common__box" v-if="ansDataList.length > 0 && (inqCndParams.prgrsSttsCd == '03' || inqCndParams.prgrsSttsCd == '05')">
     	<ul>
			<li v-for="(item, index) in ansDataList" :key="index">
	         <div class="commonDetails" style="padding-top: 5px;">
	            <div class="commonDetails__inner">
	                <div class="commonDetails__title">
	                    <label for="corporateName">답변 {{ index+1 }}</label> 
	                </div>
	                <div class="commonDetails__content">
	                    <div v-dompurify-html="item.ansCn"></div>
	                </div>
	            </div>
	         </div>
         	</li>
         </ul>
         <div v-if="ansDataList[0].ansFileList" class="commonDetails__inner" style="margin-top: 5px;">
	         <div class="commonDetails__title">
	             <label for="currentAddress">답변인 첨부파일</label> 
	         </div>
	         <div class="commonDetails__content">
	             <ul class="viewDetails__file" v-if="ansDataList[0].ansFileList">
					<li @click="fnFileDwnld(ansDataList[0].ansFileList)">
			            <Button>
			                <span class="bi bi-paperclip">
			                    <span class="blind">첨부된 파일</span>
			                </span>
			                <span class="viewDetails__filename">{{ ansDataList[0].ansFileList.printFileName }} </span>
			                <span class="bi bi-download">
			                    <span class="blind">다운로드</span>
			                </span>
			            </Button>
			        </li>
			    </ul>
	         </div>
	     </div>
	</div>
	
	<!-- 01 신청, 02 보완등록, 04 보완요청 -->
	<div class="common__box" v-if="ansDataList.length > 0 && (inqCndParams.prgrsSttsCd == '01' || inqCndParams.prgrsSttsCd == '02' || inqCndParams.prgrsSttsCd == '04')">
     	<ul>
			<li v-for="(item, index) in ansDataList" :key="index">
	         <div class="commonDetails" style="padding-top: 5px;">
	            <div class="commonDetails__inner">
	                <div class="commonDetails__title">
	                    <label for="corporateName">답변 {{ index+1 }}</label> 
	                </div>
	                <div class="commonDetails__content">
	                    <div v-dompurify-html="item.ansCn"></div>
	                </div>
	            </div>
	         </div>
         	</li>
         </ul>
         <div v-if="ansDataList[0].ansFileList" class="commonDetails__inner">
	         <div class="commonDetails__title">
	             <label for="currentAddress">답변인 첨부파일</label> 
	         </div>
	         <div class="commonDetails__content">
	             <ul class="viewDetails__file" v-if="ansDataList[0].ansFileList">
					<li >
			            <Button>
			                <span class="bi bi-paperclip">
			                    <span class="blind">첨부된 파일</span>
			                </span>
			                <span class="viewDetails__filename">{{ ansDataList[0].ansFileList.printFileName }} </span>
			                <span @click="fnFileDwnld(ansDataList[0].ansFileList)" class="bi bi-download">
			                    <span class="blind">다운로드</span>
			                </span>
			            </Button>
			        </li>
			    </ul>
	         </div>
	     </div>
	</div>
    
    <div class="viewDetails__button">
        <Button @click="fnModifyMove" class="primary" v-if="inqCndParams.prgrsSttsCd == '01' || inqCndParams.prgrsSttsCd == '02' || inqCndParams.prgrsSttsCd == '04' ">{{ inqCndParams.prgrsSttsCd == '04' ? "보완등록" : "수정" }} <i aria-hidden="true" class="bi bi-arrow-right" /></Button>
        <Button @click="fnDelete" class="primary" v-if="inqCndParams.prgrsSttsCd == '01'">삭제 <i aria-hidden="true" class="bi bi-arrow-right" /></Button>
        <Button @click="fnListMove" class="primary">목록 <i aria-hidden="true" class="bi bi-arrow-right" /></Button>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import RadioButton from "primevue/radiobutton";
import Textarea from "primevue/textarea";
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import ContentTitle from '@/components/title/ContentTitle.vue';
import CustomInputText from '@/components/input_text/CustomInputText.vue';
import axios from 'axios';
import qs from 'qs';
import { useRouter, useRoute } from 'vue-router';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import {useLoadingStore} from "@/stores/ui.loading";

const loadingStore = useLoadingStore();
const wrkId = ref("R");

/**
 * 01 발급처리상태코드 - 신청
 * 02 발급처리상태코드 - 보완등록
 * 03 발급처리상태코드 - 완료
 * 04 발급처리상태코드 - 보완요청
 * 05 발급처리상태코드 - 종결
 */
 
const router = useRouter();
const route = useRoute();

const inqCndParams = reactive({});

//상세조회 요청 파라미터
const stateParams = reactive({})

//답변게시글 리스트
const ansDataList = ref([]);

//상세조회
const fnDtlSrch = async () => {
	loadingStore.show();
	axios.get(`/api/ahh/engAddrIdentityOfferDetail/${stateParams.uccSn}/${wrkId.value}`)
		.then((response) => {
			Object.assign(inqCndParams, response.data.qaDetail);
			console.log(inqCndParams);
			//답변글		
			if (response.data.ansDetail) {
				ansDataList.value = response.data.ansDetail;
	    		for(let i=0; i<ansDataList.value.length; i++) {
	    			if(ansDataList.value[i].ansCn) {
	    				ansDataList.value[i].ansCn = ansDataList.value[i].ansCn.replace(/\n/g, '<br>');
	    			}
	    		}
			}
		})
		.catch((error) => {
			console.error("error =>", error);
		})
		.finally(() => {
			loadingStore.hide();
		})
}

//첨부파일 다운로드
const fnFileDwnld = async (item) => {
	const innorixDownloadUrl = `/api/innorix/download`
	const fileDownloadUrl = `${innorixDownloadUrl}/${item.fileMgno}/${item.fileSn}`;
	try {
		const response = await axios({
			url: fileDownloadUrl,
			method: 'GET',
			responseType: 'blob'
		});
		const link = document.createElement('a');
		link.href = fileDownloadUrl;
		link.setAttribute('donwload', item.tmprFileNm || 'downloaded_file');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} catch(error) {
		console.log("error : ", error);
		alert("파일을 다운로드할 수 없습니다.\n관리자에게 문의해주세요.");
	}
}

//목록 이동
const fnListMove = (uccSn) => {
	router.push({ 
		path: '/ahh/ahhEngAddrIdentityList',
		state: { dpcnIdntyCdNm : stateParams.dpcnIdntyCdNm }
	});
}

//수정화면 이동
const fnModifyMove = () => {
	let info = {
			uccSn : stateParams.uccSn
			, dpcnIdntyCdNm : stateParams.dpcnIdntyCdNm
			, fileNm: inqCndParams.qaFileList.fileNm
	};
	router.push({ 
		path: '/ahh/ahhEngAddrIdentityWrite',
		state: { data : JSON.stringify(info) }
	});
}

//삭제
const fnDelete = () => {
	if (confirm("삭제하시겠습니까?")) {
		axios.delete(`/api/ahh/deleteEngCefiteInquiry/${stateParams.uccSn}/${inqCndParams.prgrsSttsCd}/${inqCndParams.rfrncTblNm}`)
			.then((response) => {
				fnListMove(stateParams.uccSn);
			})
			.catch((error) => {
				console.error("error =>", error);
			});
	}
}

onMounted(() => {
	if (history.state.data) {
		const data = JSON.parse(history.state.data);
		Object.assign(stateParams, data);
		fnDtlSrch();
	}
})

</script>
<style lang="scss" scoped></style>