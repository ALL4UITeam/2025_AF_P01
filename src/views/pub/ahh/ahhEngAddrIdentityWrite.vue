<template>
	<CommonBreadcrumb />
    <div class="commonView__header">
        <HeaderTitle title="주소동일성 영문증명서 발급" />
        <p class="commonView__essential"><span class="commonEssential">* <span class="blind">필수</span></span>필수입력</p>
    </div>

    <div class="common__box">
        <div class="commonDetails">
            <div class="commonDetails__inner">
                <div class="commonDetails__title">
                    <label for="corporateName">회사명(Corporate name)</label> 
                    <span class="commonEssential">*
                        <span class="blind">필수</span>
                    </span>
                </div>
                <div class="commonDetails__content">
                    <CustomInputText id="corporateName" v-model="saveParams.aplyInstNm" class="input formStyle01" placeholder="회사명을 입력해주세요" title="회사명을 입력해주세요" /> 
                    <p class="commonView__tip"><span class="commonBullet">※</span> 영문사업자등록증과 동일하게 입력바랍니다.</p>
                </div>
            </div>
            <div class="commonDetails__inner">
                <div class="commonDetails__title">
                    <label for="oldAddressForm">구 주소(Old Address)</label>
                    <span class="commonEssential">*
                        <span class="blind">필수</span>
                    </span>
                </div>
                <div class="commonDetails__content">
                    <ul class="oldAddressForm">
                        <li>
                            <CustomInputText id="oldAddressForm" v-model="saveParams.bfrAddr" class="input" placeholder="구 주소를 입력해주세요" title="주소를 입력해주세요" /> 
                            <Button v-if="!showBfrNo02Addr" @click="showBfrNo02Addr = true" class="plusButton">
                                <span class="blind">추가</span><i aria-hidden="true" class="bi bi-plus-lg"/>
                            </Button>
                        </li>
                        <li v-if="showBfrNo02Addr">
                            <label class="blind" for="oldAddressForm02">구 주소(Old Address)의 상세주소</label>
                            <CustomInputText v-model="saveParams.bfrNo02Addr" id="oldAddressForm02" class="input" placeholder="구 상세주소를 입력해주세요" title="상세 주소를 입력해주세요" /> 
                            <Button @click="showBfrNo02Addr = false; saveParams.bfrNo02Addr = ''" class="delButton">
                                <span class="blind">삭제</span><i aria-hidden="true" class="bi bi-x-lg"/>
                            </Button>
                        </li>
                    </ul>
                    <p class="commonView__tip"><span class="commonBullet">※</span> 해당 항목은 영문으로 입력해 주시기 바랍니다. (한글로 입력할 수 없습니다.)</p>
                </div>
            </div>
            <div class="commonDetails__inner">
                <div class="commonDetails__title">
                    <label for="currentAddress">현 주소(Current Address)</label> 
                    <span class="commonEssential">*
                        <span class="blind">필수</span>
                    </span>
                </div>
                <div class="commonDetails__content">
                    <CustomInputText v-model="saveParams.newAddr" id="currentAddress" class="input" placeholder="현 주소를 입력해주세요" title="현 주소를 입력해주세요" /> 
                </div>
            </div>
            <div class="commonDetails__inner">
                <div class="commonDetails__title">
                    <label for="oldPostalCode01">구 우편번호(OldPretable)</label>
                    <label class="blind" for="oldPostalCode02">구 우편번호(OldPretable) 뒷자리</label>
                    <span class="commonEssential">*
                        <span class="blind">필수</span>
                    </span>
                </div>
                <div class="commonDetails__content">
                    <div class="formType formType__cont">
                        <CustomInputText @input="filterNumbers('oldPostalCode01')" v-model="oldPostalCode01" type="number" :maxLength = "3" class="input" id="oldPostalCode01" placeholder="" title="우편번호 앞자리를 입력해주세요" />
                        <span class="formType__dash">-</span>
                        <CustomInputText @input="filterNumbers('oldPostalCode02')" v-model="oldPostalCode02" type="number" :maxLength = "3" class="input" id="oldPostalCode02" placeholder="" title="우편번호 뒷자리를 입력해주세요" />
                    </div>
                </div>
            </div>
            <div class="commonDetails__inner">
                <div class="commonDetails__title">
                    <label for="newPor">현 우편번호(NewPor)</label>
                    <span class="commonEssential">*
                        <span class="blind">필수</span>
                    </span>
                </div>
                <div class="commonDetails__content">
                    <div class="c formType__cont">
                        <CustomInputText @input="filterNumbers('newZip')" v-model="saveParams.newZip" type="number" :maxLength = "5" id="newPor" class="input input__type" placeholder="" title="우편번호를 입력해주세요" /> 
                    </div>
                </div>
            </div>
            <div class="commonDetails__inner">
                <div class="commonDetails__title">
                    <label for="enterprise">기업 연락처</label>
                    <span class="commonEssential">*
                        <span class="blind">필수</span>
                    </span>
                </div>
                <div class="commonDetails__content">
                    <div class="formType formType__cont">
                        <CustomDropdown class="formFull" inputId="enterprise" :options="numberOption" optionLabel="label" optionValue="value" v-model="selectedItemRef01" title="전화번호 앞자리 선택해주세요" placeholder="선택" />
                        <span class="formType__dash">-</span>
                        <label class="blind" for="enterpriseNumber01">전화번호 중간</label>
                        <CustomInputText @input="filterNumbers('enterpriseNumber01')" v-model="enterpriseNumber01" type="number" :maxLength = "4" id="enterpriseNumber01" class="input" placeholder="" title="전화번호 중간자리 입력해주세요" /> 
                        <span class="formType__dash">-</span>
                        <label class="blind" for="enterpriseNumber02">전화번호 마지막</label>
                        <CustomInputText @input="filterNumbers('enterpriseNumber02')" v-model="enterpriseNumber02" type="number" :maxLength = "4" id="enterpriseNumber02" class="input" placeholder="" title="전화번호 뒷자리 입력해주세요" /> 
                    </div>
                    <p class="commonView__tip"><span class="commonBullet">※</span> 기업 연락처 또는 신청 담당자에게 연락 가능한 전화번호를 입력해 주시기 바랍니다.</p>
                    <div class="formStyle__title">내선번호<span class="selects">(선택사항)</span></div>
                    <label class="blind" for="enterpriseNumber03">내선번호</label>
                    <CustomInputText @input="filterNumbers('extTelno')" v-model="saveParams.extTelno" type="number" :maxLength = "4" class="input formStyle01" id="enterpriseNumber03" placeholder="" title="내선번호 입력해주세요" /> 
                </div>
            </div>
            <div class="commonDetails__inner">
                <div class="commonDetails__title">
                    신청 사유
                    <span class="commonEssential">*
                        <span class="blind">필수</span>
                    </span>
                </div>
                <div class="commonDetails__content">
                    <div class="formStyle__wrap">
                        <div class="formStyle__radio">
                            <RadioButton v-model="saveParams.chgRsnCd" inputId="ch01" name="checkList" value="10" />
                            <label for="ch01">기관 제출용</label>
                        </div>
                        <div class="formStyle__radio">
                            <RadioButton v-model="saveParams.chgRsnCd" inputId="ch02" name="checkList" value="20" />
                            <label for="ch02">특허권 등의 갱신</label>
                        </div>
                        <div class="formStyle__radio">
                            <RadioButton v-model="saveParams.chgRsnCd" inputId="ch03" name="checkList" value="90" />
                            <label for="ch03">기타<span class="formStyle__color">(직접입력)</span></label>
                        </div>
                        <label for="selectedCategoriesText" class="blind">신청 사유 직접입력</label>
                        <CustomInputText :disabled="saveParams.chgRsnCd !== '90'" :maxLength="255" v-model="saveParams.chgRsn" class="input formStyle02" id="selectedCategoriesText" placeholder="" title="신청사유를 입력해주세요" /> 
                    </div>
                </div>
            </div>
            <div class="commonDetails__inner">
                <div class="commonDetails__title">
                    첨부파일
                    <span class="commonEssential">*
                        <span class="blind">필수</span>
                    </span>
                </div>
                <div class="commonDetails__content">
                    <InnorixFileUpload v-if="innoComponent" class="addressConvert__fileUpload" @files-added="handleFilesAdded" @send-fileMgno="handleFileMgnoAdded" ref="innorixRef" job="type04" :fileArray="fileList"/>
                    <!-- 
                        1. Innorix 내부 img 삭제필요
                        2. 첨부시 자동으로 생성되는기능이 아닌 하단 fileUpload__box에 파일명 올라가야함.
                    <input type="file" @change="handleFilesAdded">
                    -->
                    <ul class="fileUpload__tip">
                        <li>
                            <span class="commonBullet">※</span> 신청정보 확인을 위한 영문사업자등록증명서를 첨부하여 주시기 바랍니다.
                        </li>
                        <li>
                            <span class="commonBullet">※</span> 개인사업자는 주민번호 뒷자리 [숨김] 선택 후 발급받아 첨부 바랍니다.
                        </li>
                        <li>
                            <span class="commonBullet">※</span> 첨부가능한 파일 확장자 : pdf
                        </li>
                        <li>
                            <span class="commonBullet">※</span> 첨부파일 최대크기 : 10MB
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <p class="issuanceDefails"><span class="commonBullet">※</span> 발급내역을 확인하기 위해 본인인증 절차가 필요합니다.</p>
    <div class="viewDetails__button">
        <Button @click="fnMainMove" class="primary">취소<i aria-hidden="true" class="bi bi-arrow-right" /></Button>
        <Button @click="fnSave">{{ saveParams.uccSn == '' ? "등록" : "저장" }}<i aria-hidden="true" class="bi bi-arrow-right" /></Button>
    </div>
    
   	<Certification v-if="certificationDialogVisible" :redirectTo="'/ahh/ahhEngAddrIdentityList'" @popupClose="certificationCloseDialog" @job="fnCertAftWork"/>
    
    <!-- 
    <Dialog 
        class="commonDialog"
        id="certification" 
        :visible="certificationDialogVisible" 
        modal 
        :closable="false" 
        @hide="certificationOnHideDialog"
        :aria-controls="certificationDialogVisible ? 'certification' : null"
        :aria-expanded="certificationDialogVisible ? true : false"
    >
        <template #header>      
        <Button id="certificationDialogFocus" class="dialogCloseButton" @click="certificationCloseDialog">
            <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
        </Button>
        </template>
        <ContentTitle title="본인 인증" fontSize="30px" marginTop="0" mobileFontSize="20px" />
        <ul class="identityVerification">
            <li class="type01">
                <p class="identityVerification__title">사용중인<br /><strong>휴대폰 전화번호</strong>로 인증</p>
                <div class="identityVerification__buttonWrap">
                    <Button class="identityVerification__button" title="휴대폰 인증하기" @click.prevent="pass">
                        <span class="identityVerification__text">휴대폰 인증</span>
                        <i aria-hidden="true" class="bi bi-arrow-right" />
                    </Button>
                </div>
            </li>
            <li class="type02">
                <p class="identityVerification__title">본인 명의<br /><strong>아이핀 계정</strong>으로 인증</p>
                <div class="identityVerification__buttonWrap">
                    <Button class="identityVerification__button" title="아이핀 인증하기" @click.prevent="pass">
                        <span class="identityVerification__text">아이핀 인증</span>
                        <i aria-hidden="true" class="bi bi-arrow-right" />
                    </Button>
                </div>
            </li>
        </ul>
    </Dialog>
     -->
</template>
<script setup>
import { ref, onMounted, watch, reactive, nextTick } from "vue";
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import RadioButton from "primevue/radiobutton";
import Textarea from "primevue/textarea";
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import ContentTitle from '@/components/title/ContentTitle.vue';
import InnorixFileUpload from '@/components/innorix/JusoInnorixFileUpload.vue';
import CustomInputText from '@/components/input_text/CustomInputText.vue';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import {useLoadingStore} from "@/stores/ui.loading";
import Certification from "@/components/common/CertificationComponent.vue";

const loadingStore = useLoadingStore();

//라우터 변수
const router = useRouter();
const route = useRoute();

//등록/수정 구분 I-등록, U-수정
const wrkId = ref('I');

//이전 페이지에서 넘어온 파라미터 담기
const stateParams = reactive({});

//파일관련 변수
const innorixRef = ref(null);
const newFileAdded = ref(false);

//수정 화면에서 기존 첨부파일이 있을 시 이노릭스 트리에 로드함
const fileList = ref([]);

//트리 데이터 먼저 담은 후 이노릭스 v-if 로딩
const innoComponent = ref(false);

//새로 첨부된 파일이 있는 경우
const fileId = ref();

//다이얼로그 변수
const dialogVisible = ref(false);

//구 우편번호
const oldPostalCode01 = ref('');
const oldPostalCode02 = ref('');

//구주소의 상세주소 입력폼 오픈 변수
const showBfrNo02Addr = ref(false);

//기업 연락처 - 번호
const selectedItemRef01 = ref(null);
const numberOption = ref([
    {label:'02', value: '02'},
    {label:'031', value: '031'},
    {label:'032', value: '032'},
    {label:'033', value: '033'},
    {label:'041', value: '041'},
    {label:'042', value: '042'},
    {label:'043', value: '043'},
    {label:'044', value: '044'},
    {label:'051', value: '051'},
    {label:'052', value: '052'},
    {label:'053', value: '053'},
    {label:'054', value: '054'},
    {label:'055', value: '055'},
    {label:'061', value: '061'},
    {label:'062', value: '062'},
    {label:'063', value: '063'},
    {label:'064', value: '064'},
    {label:'070', value: '070'},
    {label:'080', value: '080'},
]);
const enterpriseNumber01 = ref('');
const enterpriseNumber02 = ref('');

//페이징변수
const pageInfo = reactive({
	first: 0
	, totalRecords: 0
	, currentRecords: 0
	, totalPages: 0
	, page: 0												   // 요청한 페이지 번호 (zero based)
	, size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE)	   // 페이지당 항목 수
	, orders: [{
		property: ''                               			   // 정렬할 속성 이름
		, direction: ''                                		   // 정렬 방향 (ASC 또는 DESC)
	}]
});

//게시글 저장 변수
const saveParams = reactive({});

//글자 수 제한
const limitLength = (value, maxLength) => {
	return value.length > maxLength ? value.slice(0, maxLength) : value;
};

//신청내용 validate
const cntInput = (event) => {
	saveParams.cnt = limitLength(event.target.value, 300);
}

//나의 문의내역 인증
const certificationDialogVisible = ref(false);
const certificationOnShowDialog = () => {
	certificationDialogVisible.value = true;
}

const certificationCloseDialog = () => {
    certificationDialogVisible.value = false;
}

//화면 입력값 체크
const filterNumbers = (refName) => {
	if (refName == 'oldPostalCode01') {
		oldPostalCode01.value = oldPostalCode01.value.replace(/\D/g, '');
	} else if(refName == 'oldPostalCode02') {
		oldPostalCode02.value = oldPostalCode02.value.replace(/\D/g, '');
	} else if(refName == 'enterpriseNumber01') {
		enterpriseNumber01.value = enterpriseNumber01.value.replace(/\D/g, '');
	} else if(refName == 'enterpriseNumber02') {
		enterpriseNumber02.value = enterpriseNumber02.value.replace(/\D/g, '');
	} else if(refName == 'newZip') {
		saveParams.newZip = saveParams.newZip.replace(/\D/g, '');
	} else if(refName == 'extTelno') {
		saveParams.extTelno = saveParams.extTelno.replace(/\D/g, '');
	}
}

const filterEnglish = (refName) => {
	if (refName == 'bfrAddr') {
		saveParams.bfrAddr = saveParams.bfrAddr.replace(/[^a-zA-Z\s]/g, '');
	} else if(refName == 'bfrNo02Addr') {
		saveParams.bfrNo02Addr = saveParams.bfrNo02Addr.replace(/[^a-zA-Z\s]/g, '');
	}
}

//수정화면일시 상세조회
const fnDtlSrch = async () => {
	loadingStore.show();
	axios.get(`/api/ahh/engAddrIdentityOfferDetail/${stateParams.uccSn}/${wrkId.value}`)
		.then((response) => {
			if (response.data.qaDetail.qaFileList) {
				fileList.value.push(response.data.qaDetail.qaFileList);
				innoComponent.value = true;
			}
			Object.assign(saveParams, response.data.qaDetail);
			oldPostalCode01.value = saveParams.ozip.substring(0, 3);
			oldPostalCode02.value = saveParams.ozip.substring(3);
			
			let telNo = response.data.qaDetail.ofcTelnoCn.split("-");
			selectedItemRef01.value = telNo[0];
			enterpriseNumber01.value = telNo[1]; 
			enterpriseNumber02.value = telNo[2];
			
			if (saveParams.bfrNo02Addr) {
				showBfrNo02Addr.value = true;
			}
		})
		.catch((error) => {
			console.error("error =>", error);
		})
		.finally(() => {
			loadingStore.hide();
		})
}

//저장 유효성 체크
const fnSave = () => {
	const englishOnlyRegex = /^[A-Za-z0-9\s]+$/;
	if (!saveParams.aplyInstNm) {
		alert("회사명을 입력하세요.");
		return false;
	}
	if (!saveParams.bfrAddr) {
		alert("구 주소를 입력하세요.");
		return false;
	}
	if ((saveParams.bfrAddr.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/) != -1) || (saveParams.bfrAddr == "")) {
		alert("구 주소1 항목은 한글로 입력 하실 수 없습니다. 영문으로 입력해 주시기 바랍니다.");
		saveParams.bfrAddr = "";
		return false;
	}
	if (saveParams.bfrNo02Addr) {
		if ((saveParams.bfrNo02Addr.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/) != -1)) {
			alert("구 주소2 항목은 한글로 입력 하실 수 없습니다. 영문으로 입력해 주시기 바랍니다.");
			saveParams.bfrNo02Addr = "";
			return false;
		}	
		
		if (saveParams.bfrAddr == saveParams.bfrNo02Addr) {
			alert("구 주소1, 구 주소2가 동일합니다.구 주소를 확인 바랍니다.");
			onlyen.focus();
			return false;
		}	
	}
	
	if (!saveParams.newAddr) {
		alert("현 주소를 입력하세요.");
		return false;
	}
	if (!oldPostalCode01.value || !oldPostalCode02.value) {
		alert("구 우편번호를 입력하세요.");
		return false;
	}
	if (!saveParams.newZip) {
		alert("현 우편번호를 입력하세요.");
		return false;
	}
	if (!selectedItemRef01.value || !enterpriseNumber01.value || !enterpriseNumber02.value) {
		alert("기업 연락처를 입력하세요.");
		return false;
	}
	if (!saveParams.chgRsnCd) {
		alert("신청 사유를 선택하세요.");
		return false;
	}
	if (saveParams.chgRsnCd == '90' && !saveParams.chgRsn) {
		alert("신청 사유를 입력하세요.");
		return false;
	}
	if (!fileId.value) {
		alert("첨부파일(사업자 등록증)을 등록해주세요.");
		return false;
	}
	
	if (wrkId.value == "I") {
		certificationOnShowDialog();
	} else {
		if (confirm("수정하시겠습니까?")) {
			saveParams.uccSn = stateParams.uccSn;
			saveParams.ofcTelnoCn = selectedItemRef01.value + "-" + enterpriseNumber01.value + "-" + enterpriseNumber02.value;
			saveParams.ozip = oldPostalCode01.value + oldPostalCode02.value;
			saveParams.fileId = fileId.value;
			
			//상태코드 [보완요청]일때 저장 할시 [보완등록]으로 상태 수정
			if (saveParams.prgrsSttsCd == '04') {
				saveParams.prgrsSttsCd = '02';
			}
			
			if (fileId.value && newFileAdded.value) {
				//첨부파일이 있는 경우 이노릭스 저장 실행 후 handleFileMgnoAdded() 함수 실행됨
    			innorixRef.value?.onUpload();
    		} else {
				axios.post('/api/ahh/updateEngCefiteInquiry', saveParams)
					.then((response) => {
						if(response.status == 200) {
							router.push({ 
								path: '/ahh/ahhEngAddrIdentityList',
								state: { dpcnIdntyCdNm: saveParams.dpcnIdntyCdNm }
							});
						}
					})
					.catch((error) => {
						console.error("error =>", error);
					});
    		}
		}
	}
}

//본인인증 처리 후 실행함수
const fnCertAftWork = () => {
	saveParams.ofcTelnoCn = selectedItemRef01.value + "-" + enterpriseNumber01.value + "-" + enterpriseNumber02.value;
	saveParams.ozip = oldPostalCode01.value + oldPostalCode02.value;
	
	if (fileId.value) {
		//첨부파일이 있는 경우 이노릭스 저장 실행 후 handleFileMgnoAdded() 함수 실행됨
		innorixRef.value?.onUpload();
	} else {
		axios.post('/api/ahh/insertEngCefiteInquiry', saveParams)
			.then((response) => {
				if(response.status == 200) {
					router.push({ 
						path: '/ahh/ahhEngAddrIdentityList',
						state: { dpcnIdntyCdNm: saveParams.dpcnIdntyCdNm }
					});
				}
			})
			.catch((error) => {
				console.error("error =>", error);
			});
	}
}

//파일 추가
const handleFilesAdded = (files) => {
	if (stateParams.fileNm != files[0].printFileName) {
		newFileAdded.value = true;
	}
	fileId.value = files[0].id;
}

//파일 전송 이후 실행함수
const handleFileMgnoAdded = (p) => {
	saveParams.fileMgno = p.fileMgNo;
	saveParams.fileNm = p.file.name;
	saveParams.fileAtrbNm = p.file.type;
	saveParams.fileSz = p.file.size;
	saveParams.tmprFileNm = p.serverFileName;
	saveParams.rfrncTblNm = 'TBN_HAHH_ADDR_CHG_DSCTN_SRVC';
	
	if (wrkId.value == "I") {
		axios.post('/api/ahh/insertEngCefiteInquiry', saveParams)
			.then((response) => {
				router.push({ 
					path: '/ahh/ahhEngAddrIdentityList',
					state: { dpcnIdntyCdNm: saveParams.dpcnIdntyCdNm }
				});
		     })
		     .catch((error) => {
		    	 console.error("error =>", error);
		     });
	} else {
		axios.post('/api/ahh/updateEngCefiteInquiry', saveParams)
			.then((response) => {
				router.push({ 
					path: '/ahh/ahhEngAddrIdentityList',
					state: { dpcnIdntyCdNm: saveParams.dpcnIdntyCdNm }
				});
			})
			.catch((error) => {
				console.error("error =>", error);
			});
	}
}

//이전 화면으로 이동
const fnMainMove = () => {
	if (wrkId.value == "I") {
		router.push({ 
			path: '/ahh/ahhEngAddrIdentity',
		});
	} else {
		router.push({ 
			path: '/ahh/ahhEngAddrIdentityDetail',
			state: { data : JSON.stringify(stateParams)}
		});
	}
}

onMounted(() => {
	if (history.state.data) {
		wrkId.value = 'U';
		const data = JSON.parse(history.state.data);
		Object.assign(stateParams, data);
		fnDtlSrch();
	} else {
		innoComponent.value = true;
	}

	//감리조치 불필요한 이미지태그 제거
	const ircElements = document.querySelectorAll('.irx-preview-image');
	ircElements.forEach(function(img) {
		img.remove();
	})
	
})

</script>
<style lang="scss" scoped>
.disabled {
	pointer-events: none;
	opacity: 0.5;
}
</style>
<style lang="scss">
.chartjs-hidden-iframe {display:none !important;}
</style>