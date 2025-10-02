<template>
	<CommonBreadcrumb />
    <HeaderTitle title="불편신고" />

    <div class="qaBoard__explanation">
        <dl class="qaBoard__list">
            <dt>불편신고 게시판 이용 안내</dt>
            <dd>주소정보시설물 훼손 신고 및 기타 불편신고 내역을 안내하는 게시판입니다.</dd>
            <dd>불편신고 등록하기를 이용하여 간편하게 신고할 수 있습니다. (모바일 웹에서도 이용 가능)</dd>
        </dl>
        <div class="qaBoard__button">
            <Button id="dialogFocusInq" class="commonButton__button" title="불편신고 등록하기"  @click.prevent="onShowDialog()">
                <span class="commonButton__text">등록하기</span>
                <i aria-hidden="true" class="bi bi-arrow-right" />
            </Button>
            <Button id="certificationOnShowDialog" class="commonButton__button" title="나의 문의내역" v-if="srchMode == 'ALL'" @click.prevent="certificationOnShowDialog('1')">
                <span class="commonButton__text">나의 문의내역</span>
                <i aria-hidden="true" class="bi bi-arrow-right" />
            </Button>
            <Button id="allBoardList" class="commonButton__button" title="전체글 목록보기" v-if="srchMode == 'MY'" @click.prevent="fnSrch('MY')">
                <span class="commonButton__text">전체글 목록 보기</span>
                <i aria-hidden="true" class="bi bi-arrow-right" />
            </Button>
        </div>
    </div>

    <form @submit.prevent="handleSubmit">
        <fieldset>
            <legend>불편신고 검색</legend>
            <div class="commonContentSearchForm">

                <div class="commonContentSearchForm__type">
                    <div class="commonContentSearchForm__mapSelect">
                        <label for="city1">검색조건</label>
						<CustomDropdown inputId="sidoList" :options="itemsCity" optionLabel="label" optionValue="value" v-model="inqCndParams.ctpvCd" @change="loadSidoData" title="시/도 선택" placeholder="시/도 선택" />
                        <CustomDropdown inputId="sggList" :options="itemsCounty" optionLabel="label" optionValue="lgvReplcCd" v-model="inqCndParams.lgvReplcCd" @change="loadSggData" title="시/군/구 선택" placeholder="시/군/구 선택" />
                    </div>
                </div>

                <div class="commonContentSearchForm__search">
                    <Button class="commonContentSearchForm__searchButton" title="검색하기" @click.prevent="fnSrch()">
                        <i aria-hidden="true" class="bi bi-search" /> 검색
                    </Button>
                </div>

            </div>
        </fieldset>
    </form>
    <!-- 게시판 목록형 -->
    <div class="dataTable__wrap">
        <table class="table__noticeBoard">
            <caption class="blind">불편신고 게시판 리스트로 번호, 문의내용, 진행상태, 등록일자, 첨부파일을 제공하고 있습니다.</caption>
            <colgroup>
                <col class="col no" />
                <col class="col type" />
                <col class="col title" />
                <col class="col state" />
                <col class="col release" />
                <col class="col date" />
                <col class="col file" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col" class="no"><span class="box">No</span></th>
                    <th scope="col" class="type"><span class="box">유형</span></th>
                    <th scope="col" class="title"><span class="box">문의내용</span></th>
                    <th scope="col" class="state"><span class="box">진행상태</span></th>
                    <th scope="col" class="release"><span class="box">공개여부</span></th>
                    <th scope="col" class="date"><span class="box">등록일시</span></th>
                    <th scope="col" class="file"><span class="box">첨부파일</span></th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(item, index) in searchDataList" :key="index">
                    <!-- root -->
                    <tr @click="fnDtlView(item)">
                        <td class="no">
                            <div class="box">{{ item.rnum }}</div>
                        </td>
                        <td class="type">
                            <div class="box">
                                {{ item.qaTypeNm }}
                            </div>
                        </td>
                        <td class="title alignLeft">
                            <div class="box">
                                <a href="javascript:void(0);" class="qaTitle" title="문의내용 펼치기">{{ item.pstTtl }} ({{ item.lgvReplcNm }})
                                     <span v-if="item.valid == 'Y'" class="new">new</span>
                                </a>
                            </div>
                        </td>
                        <td class="state">
                            <div class="box">
                                <strong :class="item.prgrsSttsNm == '답변완료' ? 'complete' : 'inProgress'">{{ item.prgrsSttsNm }}</strong>
                            </div>
                        </td>
                        <td class="release"><div class="box">{{ item.rlsNm }}</div></td>
                        <td class="date"><div class="box">{{ item.regDt }}</div></td>
                        <td class="file">
                            <div class="box">
                                <template v-if="item.fileMgno">
                                    <i aria-hidden="true" class="bi bi-floppy"></i>
                                    <span class="blind">파일첨부</span>
                                </template>
                            </div>
                        </td>
                    </tr>
                    <!-- //root -->
                    <!-- 상세내용 아래로 펼치기-->
                    <tr v-show="expandedDetail == item.rnum">
                        <td colspan="7" class="qaCotent">
                            <div class="qaCotent__wrap">
                                <div class="qaCotent__questions">
                                    <div class="qaCotent__questionsType">
                                        Q <span class="blind">질문</span>
                                    </div>
                                    <div class="qaCotent__questionsText">
                                    	<span v-dompurify-html="item.pstCn"></span>
                                        <Button class="qaCotent__delete" title="질문 삭제하기" @click.prevent="fnDel(item)" v-if="srchMode == 'MY' && detailDataList.length < 1">
                                            삭제
                                        </Button>                                        
                                    	<Button v-if="item.fileList" title="첨부파일보기" class="photoView" @click.prevent="showFileDialog(item)">파일보기</Button>
                                	</div>
                                </div>
                                <div class="qaCotent__answers" v-if="detailDataList.length > 0" v-for="answerItem in detailDataList">
                                    <div class="qaCotent__answersType">
                                        A <span class="blind">답변</span>
                                    </div>
                                    <div class="qaCotent__answersText">{{ answerItem.pstCn }}</div>
                                    <Button v-if="answerItem.fileList" title="첨부파일보기" class="photoView" @click.prevent="showFileDialog(answerItem)">파일보기</Button>
                                </div>      
                            </div>
                        </td>
                    </tr>
                    <!--상세보기 끝  -->
                </template>
            </tbody>
        </table>

    </div>

    <!-- 목록 -->
    <Panel class="section hasTable noHeader">
       <TemplatePaginator class="paging" :pageInfo="pageInfo" @reload-list="onPaging"></TemplatePaginator>
    </Panel>

    <Dialog 
        class="commonDialog qaBoard__layerPopup"
        id="dlg" 
        :visible="dialogVisible" 
        modal 
        :closable="false" 
        :aria-controls="dialogVisible ? 'dlg' : null"
        :aria-expanded="dialogVisible ? true : false"
    >
        <template #header>      
            <Button id="dialogFocus" class="dialogCloseButton" @click="closeDialog">
                <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
            </Button>
        </template>

        <ContentTitle title="불편 신고 등록" fontSize="30px" marginTop="0" mobileFontSize="20px" />
        <div class="qaBoard__essentialText">
            <span class="commonEssential">*</span> 필수 입력
        </div>
        <Scrollpanel class="qaBoard__scroll">
            <label for="layerPopupType1" class="qaBoard__layerPopupTitle">신고유형<span class="commonEssential">*</span></label>
            <div class="qaBoard__form">
                <CustomDropdown inputId="layerPopupType1" :options="layerPopupType1" optionLabel="label" optionValue="value" v-model="saveParams.qaTypeCd" title="유형선택" placeholder="선택" />
            </div>
            
            <label for="thema" class="qaBoard__layerPopupTitle">제목<span class="commonEssential">*</span></label>
            <div class="qaBoard__form">
                <CustomInputText v-model="saveParams.pstTtl" class="input" id="thema" name="thema" :maxlength="12" type="text" placeholder="제목을 입력하세요" title="제목을 입력하세요" />
            </div>
            
           	<label for="num01" class="qaBoard__layerPopupTitle">전화번호<span class="commonEssential">*</span></label>
            <div class="qaBoard__form">
                <CustomDropdown inputId="num01" :options="telOptions" optionLabel="label" optionValue="value" v-model="saveParams.tel01" title="유형선택" placeholder="02" />
                <label for="num02" class="blind">중간번호</label>
                <CustomInputText v-model="saveParams.tel02" class="input" id="num02" name="num02" :maxLength="4" title="중간번호" placeholder="" type="number"/>
                <label for="num03" class="blind">끝번호</label>
                <CustomInputText v-model="saveParams.tel03" class="input" id="num03" name="num03" :maxLength="4" title="끝번호" placeholder="" type="number"/>
            </div>
            <div v-if="saveParams.qaTypeCd == '04'">
            	<p></p>
	            <label for="thema" class="qaBoard__layerPopupTitle">검색 주소<span class="commonEssential">*</span></label>
	            <div class="qaBoard__form">
	                <CustomInputText v-model="saveParams.searchAdres" class="input" id="thema" name="thema" :maxlength="12" type="text" placeholder="" title="입력하세요" />
	            </div>
	            <p class="qaBoard__layerPopupText">※ 검색하고자 하시는 주소를 기재해 주세요 (예:서울특별시 마포구 성암로 189)</p>
	            
	            <label for="thema" class="qaBoard__layerPopupTitle">이용사이트 명<span class="commonEssential">*</span></label>
	            <div class="qaBoard__form">
	                <CustomInputText v-model="saveParams.useSiteNm" class="input" id="thema" name="thema" :maxlength="12" type="text" placeholder="" title="입력하세요" />
	            </div>
	            <p class="qaBoard__layerPopupText">※ 주소 검색에 이용하신 사이트 명을 기재해 주세요.<br>(예:OO홈쇼핑, http://oo.shopping.co.kr/zipPost.do)</p>
            </div>
            
            <div v-if="saveParams.qaTypeCd == '01'">
            	<p></p>
	            <label for="thema02" class="qaBoard__layerPopupTitle">변경대상 주소<span class="commonEssential">*</span></label>
	            <div class="qaBoard__form02">
	                <CustomInputText v-model="jusoSearchParams.keyword" :disabled="jusoInputValid" class="input" id="thema02" name="thema02" placeholder="" title="주소를 입력하세요" @keydown.enter="recentSearchesResultRef"/>
	                <Button class="addressButton" @click.prevent="recentSearchesResultRef">
	                    <i aria-hidden="true" class="bi bi-search"></i>
	                    <span class="blind">검색</span>
	                </Button>
	                <div class="addressResult" v-if="jusoSearchDataList.length > 0 && jusoToggle == true">
	                    <ul class="addressResult__list">
	                        <li v-for="(item, index) in jusoSearchDataList" :key="index">
	                            <Button class="addressResult__button" @click="getJuso(item)"><span style="display: inline-block; text-align:left;">도로명 {{ item.schKorRoadNm }}<br>지번 {{ item.schKorJibunNm }}</span></Button>
	                        </li>
	                    </ul>
	                </div>
	                <div class="addressResult" v-if="jusoSearchDataList.length == 0 && jusoToggle == true">
	                    <ul class="addressResult__list">
	                        <li>
	                            <Button class="addressResult__button">검색 결과가 없습니다.</Button>
	                        </li>
	                    </ul>
	                </div>
	            </div>
				<p class="qaBoard__layerPopupText">※ 대상 건물의 주소를 입력 후 검색버튼을 클릭해주세요.(예 : 서울특별시 마포구 성암로 189)</p>
            </div>
            
            <div v-if="saveParams.qaTypeCd != '04'">
            	<p></p>
	          	<label for="layerPopupCity1" class="qaBoard__layerPopupTitle" v-if="saveParams.qaTypeCd != '04'">지역선택<span class="commonEssential">*</span></label>
	            <div class="qaBoard__form">
	 				<CustomDropdown inputId="layerPopupCity1" :options="itemsCityToRegForm" optionLabel="label" optionValue="value" v-model="saveParams.ctpvCd" @change="loadSidoDataRegForm" title="시/도선택" placeholder="시/도선택" :disabled="saveParams.qaTypeCd =='01'"/>
					<CustomDropdown inputId="layerPopupCounty1" :options="itemsCountyToRegForm" optionLabel="label" optionValue="lgvReplcCd" v-model="saveParams.lgvReplcCd" @change="loadSggDataRegForm" title="시/군/구선택" placeholder="시/군/구선택" :disabled="saveParams.qaTypeCd =='01'"/>
	            </div>
	            <p class="qaBoard__layerPopupText" v-if="saveParams.qaTypeCd == '01'">※ 변경대상 주소 검색 후 자동으로 입력됩니다.</p>
            </div>
            
            <div v-if="saveParams.qaTypeCd == '01'">
            	<p></p>
	            <label for="thema03" class="qaBoard__layerPopupTitle">현재 건물명<span class="commonEssential">*</span></label>
	            <div class="qaBoard__form02">
	                <CustomInputText v-model="saveParams.buldNm" disabled :clearButton="false" class="input" id="thema03" name="thema03" placeholder="주소 검색 후 자동으로 입력됩니다." title="현재 건물명"/>
	            </div>
	            <label for="thema03" class="qaBoard__layerPopupTitle">변경 건물명<span class="commonEssential">*</span></label>
	            <div class="qaBoard__form02">
	                <CustomInputText v-model="saveParams.chgBuldNm" class="input" id="thema03" name="thema03" placeholder="" title="변경할 건물명을 입력해주세요."/>
	            </div>
	            <p class="qaBoard__layerPopupText">※ 변경하고자 하는 건물명을 기재해 주세요.(예 : B빌딩, 삭제요청)</p>
            </div>
            
            
            <label class="qaBoard__layerPopupTitle">{{ saveParams.qaTypeCd == "01" ? "변경사유" : "신고내용" }}<span class="commonEssential">*</span></label>
            <Textarea class="commonTextarea qaBoard__textarea" @input="updateCharacterCount" v-model="saveParams.pstCn" autoResize rows="5" cols="30" placeholder="추가 문의사항을 기재해주세요."></Textarea>
            <div class="commonTextNumberBox"><span class="commonColor01">{{ textCount }}</span>/300</div>

            <p class="qaBoard__layerPopupTitle">첨부파일</p>
            <div class="qaBoard__fileUpload">
	            <InnorixFileUpload class="innorixBackground type03" @files-added="handleFilesAdded" @send-fileMgno="handleFileMgnoAdded" ref="innorixRef" job="type01" />
            </div>
            <ul class="fileUpload__tip qaBoard__fileUploadTip">
                <li>
                    <span class="commonBullet">※</span> 첨부가능한 파일 확장자 : jpg, jpeg, png
                </li>
                <li>
                    <span class="commonBullet">※</span> 첨부파일 최대크기 : 10MB
                </li>
                <li>
                    <span class="commonBullet">※</span> 최대 6개까지 첨부 가능합니다.
                </li>
            </ul>
            <p class="qaBoard__layerPopupTitle">공개여부<span class="commonEssential">*</span></p>
            <div class="formStyle__wrap qaBoard__radio">
                <div class="formStyle__radio" v-for="checkList in categories" :key="checkList.key">
                    <RadioButton v-model="saveParams.rlsYn"  :inputId="checkList.key" name="checkList" :value="checkList.value"  />
                    <label :for="checkList.key">{{ checkList.label }}</label>
                </div>
            </div>
            <p class="qaBoard__layerPopupImportance"><span class="commonBullet">※</span> 신고를 위해서는 본인인증(휴대폰, 아이핀) 절차가 필요합니다.</p>
            <div class="qaBoard__layerPopupButton">
                <Button class="commonButton__button" title="불편신고 등록하기" @click.prevent="fnSave()">
                    등록
                </Button>
                <Button class="commonButton__button" title="불편신고 취소하기" @click.prevent="closeDialog">
                    취소
                </Button>
            </div>
        </Scrollpanel>   

    </Dialog>
    
    <Certification v-if="certificationDialogVisible" :redirectTo="'/ahh/ahhNotifyBoardList'" @popupClose="certificationCloseDialog" @job="fnCertAftWork"/>
    
    <Dialog 
        class="commonDialog fileDialog"
        id="fileDialog" 
        :visible="fileDialogVisible" 
        modal 
        :closable="false" 
        :aria-controls="fileDialogVisible ? 'fileDialog' : null"
        :aria-expanded="fileDialogVisible ? true : false"
    >
        <template #header>      
            <ContentTitle title="첨부파일" fontSize="30px" marginTop="0" mobileFontSize="20px" />
            <Button id="fileDialogFocus" class="dialogCloseButton" @click="showFileDialog">
                <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
            </Button>
        </template>
        
        <!-- 이미지에 알맞는 alt값 들어가야함. -->
        <div class="fileList" v-if="imageArray.length > 0">
            <template v-if="imageArray.length == 1">
                <div class="singleImage">
                    <img :src="imageArray[0].previewUrl" :alt="imageArray[0].printFileName"/>
                </div>
            </template>
            <template v-else>
                <Swiper
                    :modules="[Navigation, Pagination]"
                    :navigation="true"
                    :pagination="{ clickable: true }"
                    class="imageSwiper"
                    :autoHeight="true"
                >
                    <SwiperSlide v-for="(file, index) in imageArray" :key="index">
                        <div class="qaCotent__swiperImage">
                            <img :src="file.previewUrl" :alt="file.printFileName" alt="미리보기 이미지" />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </template>
            <div class="fileList__download">
                <Button class="commonButton__button" title="파일다운로드" @click="downloadAllFiles">
                    <span class="commonButton__text">다운로드</span>
                    <i aria-hidden="true" class="bi bi-download" />
                </Button>
            </div>
        </div>
    </Dialog>
</template>
<script setup>
import { ref, computed, onMounted, watchEffect, onBeforeUnmount, watch, reactive, nextTick } from "vue";
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import Scrollpanel from 'primevue/scrollpanel'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import RadioButton from "primevue/radiobutton";
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import ContentTitle from '@/components/title/ContentTitle.vue';
import CustomInputText from '@/components/input_text/CustomInputText.vue';
import InnorixFileUpload from '@/components/innorix/JusoInnorixFileUpload.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import { sidoDataLoad, sggDataLoad } from '@/common/jusoCommon.ts'
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import DataTableLoadingComponent from "@/components/common/DataTableLoadingComponent.vue";
import {useLoadingStore} from "@/stores/ui.loading";
import { validateJuso, checkValidate1, checkValidate2, keyWordMin, keyWordMax, keyWordIsNumber, keyWordIsMaxNumber, regExpCheckJuso, checkValidate3 } from '@/common/histrySearchValidUtil.js'
import Certification from "@/components/common/CertificationComponent.vue";

//로딩바
const loadingStore = useLoadingStore();
const jusoToggle = ref(false);
const jusoInputValid = ref(false);
const innorixRef = ref(null);
 
/*----------------------------------------------------------------------- 검색 관련 */
 
//검색 구분
const srchMode = ref("ALL"); 

//검색결과 변수
const searchDataList = ref([]);

//페이징 관련 변수
const pageSize = ref(10);
const pageTotal = ref();
const currentPage = ref(0);

//질문글, 답변글 No 매핑 변수
const expandedDetail = ref();

//답변 게시글 목록 변수
const detailDataList = ref([]);

//검색조건 초기화변수
const inqCndParams = reactive({
	 ctpvCd : '' 
    , lgvReplcCd : '' 
    , qaPstUnqMgno : '' 
    , qaPstRfrncMgno : '' 
    , pageTotal : pageTotal 
    , pageable : {
		page : 0 ,
		size : Number(import.meta.env.VITE_DAIP_PAGING_SIZE),
    }
});

//페이징변수
const pageInfo = reactive({
    first: 0
    , totalRecords: 0
    , currentRecords: 0
    , totalPages: 0
    , page: 0												// 요청한 페이지 번호 (zero based)
    , size: Number(import.meta.env.VITE_DAIP_PAGING_SIZE)	// 페이지당 항목 수
    , orders: [{
        property: ''                               			// 정렬할 속성 이름
        , direction: ''                                		// 정렬 방향 (ASC 또는 DESC)
    }]
});

//페이징 버튼클릭
const onPaging = params => {
	pageInfo.first = params.first !== undefined ? params.first : 0;
	pageInfo.page = params.page ? params.page + 1 : 1;
	pageInfo.size = params.rows ? params.rows : pageInfo.size;

	//post 방식으로 전달시 0페이지부터 조회하도록 -1을 해줘야함.
	inqCndParams.pageable.page = pageInfo.page - 1;
	inqCndParams.pageable.size = pageInfo.size;

	fnSrch();
}

//검색
const fnSrch = async (mode) => {
	console.log(inqCndParams);
	expandedDetail.value = null;
	
	if (inqCndParams.lgvReplcCd == null) {
		inqCndParams.lgvReplcCd = '';
	}
	
	if (inqCndParams.ctpvCd == null) {
		inqCndParams.ctpvCd = '';
	}
	
	if (mode) {
		srchMode.value = "ALL";
		inqCndParams.mode = null;
		authenticationMode.value = null;
	}
	
	if (authenticationMode.value == "1") {
		inqCndParams.mode = "MY";
	}
	
	loadingStore.show();
	axios.post('/api/ahh/selectNotifyBoardList', inqCndParams)
		.then((response) => {
			const data = response.data;
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				searchDataList.value = data.results.content;
				pageTotal.value = data.results.totalElements;
				pageInfo.totalRecords = data.results.totalElements;
				pageInfo.currentRecords = data.results.numberOfElements;
				pageInfo.totalPages = data.results.totalPages;
				
				//내용 줄바꿈 표시
				searchDataList.value.map(item => {
					item.pstCn = item.pstCn.replaceAll("\r\n", "<br>");
					if (item.lgvReplcCd?.startsWith("00")) {
						item.lgvReplcNm = '중앙';
					}
				})
			} else {
				searchDataList.value.splice(0);
				pageTotal.value = data.results.totalElements;
				pageInfo.totalRecords = 0;
				pageInfo.currentRecords = 0;
				pageInfo.totalPages = 0;
			}
		})
		.catch(error => {
			console.error("error =>", error);
		})
		.finally(() => {
			loadingStore.hide();
		})
}
 
//상세 조회 파라미터
const detailParams = reactive({
	qaPstUnqMgno : ''
})

const selectedDataRow = ref(null);

//질문글 상세 조회
const fnDtlView = (item) => {
	if (expandedDetail.value == item.rnum) {
		expandedDetail.value = null;
		return false;
	}
	
	if (detailDataList.value) {
		detailDataList.value.splice(0);
	}
	
	authenticationMode.value = "2";
	selectedDataRow.value = item;
	
	//나의글보기 상태일시 본인인증 거치지않음
	if (srchMode.value == "MY") {
		fnDetailSrch(item);	
	} else {
		//공개여부가 비공개이면 본인인증 팝업 호출
		if (item.rlsYn == "N") {
 			certificationDialogVisible.value = true;
 		} else {
 			fnDetailSrch(item);
 		}
	}
}

//답변글 상세 조회
const fnDetailSrch = async (item) => {
	loadingStore.show();
	let res = "";
	
	if (item.rlsYn == "N") {
		await axios.get(`/api/ahh/compareSessionKeyToDB/${item.qaPstUnqMgno}`)
			.then((response) => {
				res = response.data.results;
	        })
	        .catch(error => {
	        	console.error("error =>", error);
	        })
	}
		
	if (res == "" || res == "SUCCESE") {
		if (item.prgrsSttsNm == "답변완료") {
			detailParams.qaPstUnqMgno = item.qaPstUnqMgno;
			await await axios.post('/api/ahh/detailNotifyBoard', detailParams)
				.then((response) => {
					if (response.data.results) {
						detailDataList.value.splice(0);
						detailDataList.value = response.data.results;
					}
		        })
		        .catch(error => {
		        	console.error("error =>", error);
		        });
		}
		expandedDetail.value = expandedDetail.value == item.rnum ? null : item.rnum;
	} else {
		alert("사용자가 일치하지 않습니다.");
	}	
	loadingStore.hide();
}

/*----------------------------------------------------------------------- 본인인증 관련 */

//본인인증 구분 1 - 나의글보기 목록, 2 - 내 글 보기, 3 - 등록
const authenticationMode = ref(null); 

//인증 팝업 visible
const certificationDialogVisible = ref(false);

//본인인증 팝업 open
const certificationOnShowDialog = (mode) => {
	if (mode) authenticationMode.value = mode;
    certificationDialogVisible.value = true;
}

//본인인증 팝업 close
const certificationCloseDialog = () => {
	certificationDialogVisible.value = false;
}

//본인인증 후 실행 함수
const fnCertAftWork = async (item) => {
	//나의 글보기
	if(authenticationMode.value == "1") {
   		inqCndParams.ctpvCd = null;
       	inqCndParams.lgvReplcCd = null;
       	srchMode.value = "MY";
       	certificationCloseDialog();
       	fnSrch();
	} else if(authenticationMode.value == "2") {
		fnDetailSrch(selectedDataRow.value);
	} else {
		//등록
   		saveParams.pstRfrncNm = '0';
		if(fileId.value) {
   			innorixRef.value?.onUpload();
   		} else {
   			apiBoardSave(saveParams).then(response => {
   				closeDialog();
   				fnSrch();
   			})
   			.catch(error => {
   				console.error("error =>", error);
   			})
   		}
	}
}
	
/*----------------------------------------------------------------------- 등록 관련 */

//게시글 저장 초기화변수
const saveParamsInfo = {
	 ctpvCd : ''
	, lgvReplcCd : ''
    , pstCn : ''
    , pstTtl : ''
    , rlsYn : 'Y'
    , qaTypeCd : '01'
    , pstRfrncNm : ''
    , fileMgno : ''
    , buldNm : ''
    , chgBuldNm : ''
    , tel01 : '02'
    , tel02 : ''
    , tel03 : ''
};

//게시글 저장 파라미터
const saveParams = reactive({});

//등록 팝업 visible
const dialogVisible = ref(false);

const fileId = ref();

//게시글 길이 체크
const textCount = ref(0);

//문자열 길이 체크
const updateCharacterCount = () => {
	textCount.value = saveParams.pstCn.length;
}

//불편신고등록 - 신고유형
const layerPopupType1 = ref([
	{label:'건물명변경', value:'01'},
	{label:'검색오류', value:'02'},
	{label:'일반문의', value:'03'},
	{label:'타사이트 검색문의', value:'04'},
]);

//공개여부
const categories = ref([
	{label: '공개', key: "Y", title: "게시글 공개", value: "Y"},
	{label: '비공개', key: "N", title: "게시글 비공개", value: "N"},
]);

//등록 팝업 호출
const onShowDialog = async () => {
	Object.assign(saveParams, saveParamsInfo);
	jusoSearchParams.keyword = "";
	dialogVisible.value = true;
	loadSidoDataRegForm();
}

//등록 팝업 종료
const closeDialog = () => {
	Object.assign(saveParams, saveParamsInfo);
	dialogVisible.value = false;
}

//저장 유효성 체크
const fnSave = () => {
	
	var regExp =/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
	var regExp1 =/(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}/;
	var regExp2 =/[0-9]{6}-?[0-9]{6,7}/;
	
	if(!saveParams.qaTypeCd) {
		alert("신고유형을 선택하세요.");
		return false;
	}
	
	if (saveParams.qaTypeCd != "04" && !saveParams.lgvReplcCd) {
		if (saveParams.qaTypeCd == "01") {
			alert("변경 대상 주소가 검색되지 않았습니다.\n검색 후 주소를 선택해주세요.");
			return false;
		}
		alert("지역을 선택하세요.");
		return false;
	}
	
	if (!saveParams.pstTtl) {
		alert("제목을 입력하세요.");
		return false;
	}
	
	if(!saveParams.tel02 || !saveParams.tel03) {
		alert("전화번호를 입력해주세요.");
		return false;
	} else {
		saveParams.userTelno = saveParams.tel01 + "-" + saveParams.tel02 + "-" + saveParams.tel03;
		saveParams.rgtrNm = saveParams.tel03
		if(!regExp.test(saveParams.userTelno)){
			alert("잘못된 전화번호입니다. 숫자만 입력하세요. 예) 02-XXX-XXXX");
			return false;
		}
	}
	
	if (saveParams.qaTypeCd == "01") {
		if (jusoInputValid.value == false) {
			alert("변경 대상 주소가 검색되지 않았습니다.\n검색 후 주소를 선택해주세요.");
			return false;
		}
		if (!saveParams.chgBuldNm) {
			alert("변경 건물명을 입력해주세요.");
			return false;
		}
	} else if (saveParams.qaTypeCd == "04") {
		if (!saveParams.searchAdres) {
			alert("검색 주소를 입력해 주세요.");
			return false;
		}
		if (!saveParams.useSiteNm) {
			alert("이용 사이트 명을 입력해 주세요.");
			return false;
		}
	}
	
	if (!saveParams.pstCn) {
		alert("문의내용을 입력하세요.");
		return false;
	} else {
		if(regExp1.test(saveParams.pstCn)){
			alert("내용중에 전화번호가 포함되어 있습니다.\n전화번호를 삭제해 주세요.");
			return false;
		}else if(regExp2.test(saveParams.pstCn)){
			alert("내용중에 주민등록번호가 포함되어 있습니다.\n주민등록번호를 삭제해 주세요.");
			return false;
		}
	}

	if (!saveParams.rlsYn) {
		alert("공개여부를 선택하세요.");
		return false;
	}
	
	//5자리 코드를 지방자치단체코드로 변환
	itemsCountyToRegForm.value.map(item => {
		if (item.value == saveParams.lgvReplcCd) {
			saveParams.lgvReplcCd = item.lgvReplcCd;
		}
	});
	
	//본인인증팝업 표출
	certificationOnShowDialog('3');
}

//이노릭스 파일 첨부 후 콜백 함수
function handleFilesAdded(files) {
 	fileId.value = files[0].id;
}

//이노릭스 파일 업로드 후 콜백 함수
function handleFileMgnoAdded(fileMgno) {
	saveParams.fileMgno = fileMgno;
	apiBoardSave(saveParams).then(response => {
		certificationCloseDialog();
		closeDialog();
		fnSrch();
	})
	.catch(error => {
		console.error("error =>", error);
	})
}

//게시글 등록
const apiBoardSave = async(saveParams) => {
	return new Promise((resolve, reject) => {
		axios.post('/api/ahh/saveNotifyBoard', saveParams).then(response => {
	    	resolve(response);
		})
	    .catch(error =>{
	    	reject(error);
	    })
	})
}

/*----------------------------------------------------------------------- 게시글 삭제 관련 */

//파일삭제 api
const fnDtlReplyViewApi = async (file) => {
	return new Promise((resolve, reject) => {
		axios.get(`/api/file/${file.fileMgno}/${file.fileSn}`).then(response => {
			resolve(response);
		})
	    .catch(error =>{
	    	reject(error);
	    })
	})
}

//파일삭제
const fnFileDelete = (files) => {
	for (let i=0; i<files.length; i++) {
		fnDtlReplyViewApi(files[i]).then(response => {})
		    .catch(error =>{
				console.error("error =>", error);
			})
	}
}

//질문게시글삭제
const fnDel = async (item) => {
	if (detailDataList.value.length > 0) {
		alert("답변이 있는 게시글은 삭제할 수 없습니다.");
		return;
	}
	
	let msg = "삭제하시겠습니까?";

	if (confirm(msg)) {
		await axios.delete(`/api/ahh/notify-board/${item.qaPstUnqMgno}`)
			.then(response => {
				//질문글 삭제인 경우 질문글의 파일 삭제
				if (item.fileList != null) {
					fnFileDelete(item.fileList);
				}
				fnSrch();
			})
		    .catch(error =>{
				console.error("error =>", error);
			})
	}
}

/*----------------------------------------------------------------------- 파일보기, 다운로드 관련 */
 
//파일보기 다이얼로그
const fileDialogVisible = ref(false);

const fileArray = ref([]);
const imageArray = ref([]);

const showFileDialog = async (item) => {
	if (fileDialogVisible.value == false) {
	    await imageUrlFommating(item.fileList);
		fileArray.value = item.fileList;
	    fileDialogVisible.value = true;
	} else {
		imageArray.value.splice(0);
	    fileDialogVisible.value = false;
	}
};

//첨부파일 다운로드
async function downloadAllFiles() {
	for(const file of fileArray.value) {
		const fileMgno = file.fileMgno;
		const fileSn = file.fileSn;
		const fileDownloadUrl = `/api/innorix/download/${fileMgno}/${fileSn}`;
		try {
			const response = await axios({
				url: fileDownloadUrl,
  		 	method: 'GET',
  			responseType: 'blob'
  		});
  		const link = document.createElement('a');
  		link.href = URL.createObjectURL(new Blob([response.data], {type: 'application/octet-stream'}));
			link.download = file.printFileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch(error) {
			console.error("error : ", error);
		}
	}
}

//사진보기 리스트
const imageUrlFommating = async (fileList) => {
	loadingStore.show();
	for (let i=0; i<fileList.length; i++) {
		if (fileList[i].fileSn != null) {
			const innorixDownloadUrl = `/api/innorix/download`;
			const fileMgno = fileList[i].fileMgno;
			const fileSn = fileList[i].fileSn;
			const fileDownloadUrl = `${innorixDownloadUrl}/${fileMgno}/${fileSn}`;
			
			await axios.get(fileDownloadUrl, {responseType: 'blob'})
				.then(response => {
					const imageUrl = URL.createObjectURL(response.data);
					imageArray.value.push({"previewUrl" : imageUrl});
				})
				.catch(error => {
					console.error("error =>", error);
				})
		}
	}
	loadingStore.hide();
}

/*----------------------------------------------------------------------- 드롭다운 관련 */

//검색조건 지역선택 드롭다운 변수
const itemsCity = ref([]);
const itemsCounty = ref([]);

//시도 데이터
const loadSidoData = async () => {
	try {
		const data = await sidoDataLoad();
		itemsCity.value = [{ label: '시/도 선택', value: null }, ...data];
		inqCndParams.lgvReplcCd = null;
		loadSggData();
	} catch (error) {
		console.error('error =>', error);
	}
}

//시군구 데이터
const loadSggData = async () => {
	try {
		const data = await sggDataLoad(inqCndParams.ctpvCd);
		itemsCounty.value = [{ label: '시/군/구 선택', value: null }, ...data];
	} catch (error) {
		console.error('error =>', error);
	}
}

//등록화면 지역선택 드롭다운 변수
const itemsCityToRegForm = ref([]);
const itemsCountyToRegForm = ref([]);

//등록화면 시도 데이터
const loadSidoDataRegForm = async () => {
	try {
		const data = await sidoDataLoad();
		itemsCityToRegForm.value = [{ label: '시/도 선택', value: null }, ...data];
		console.log("등록화면 ->", itemsCityToRegForm.value);
		loadSggDataRegForm();
	} catch (error) {
		console.error('error =>', error);
	}
}

//등록화면 시군구 데이터
const loadSggDataRegForm = async () => {
	try {
		const data = await sggDataLoad(saveParams.ctpvCd);
		itemsCountyToRegForm.value = [{ label: '시/군/구 선택', value: null }, ...data];
		console.log("등록화면시군구 -> ", itemsCountyToRegForm.value);
	} catch (error) {
		console.error('error =>', error);
	}
}

const telOptions = [
	{value:"02", label:"02"}
	,{value:"031", label:"031"}
	,{value:"032", label:"032"}
	,{value:"033", label:"033"}
	,{value:"041", label:"041"}
	,{value:"042", label:"042"}
	,{value:"043", label:"043"}
	,{value:"044", label:"044"}
	,{value:"051", label:"051"}
	,{value:"052", label:"052"}
	,{value:"053", label:"053"}
	,{value:"054", label:"054"}
	,{value:"055", label:"055"}
	,{value:"061", label:"061"}
	,{value:"062", label:"062"}
	,{value:"063", label:"063"}
	,{value:"064", label:"064"}
	,{value:"010", label:"010"}
	,{value:"011", label:"011"}
	,{value:"016", label:"016"}
	,{value:"017", label:"017"}
	,{value:"018", label:"018"}
	,{value:"019", label:"019"}
	,{value:"070", label:"070"}
	,{value:"080", label:"080"}
]

/*----------------------------------------------------------------------- 주소검색관련 */

const jusoSearchDataList = ref([]);

//검색조건 초기화변수
const jusoSearchParams = reactive({
	keyword : ''
	, strSearchType : "HSTRY"				//검색구분
	, strFirstSort : "none"					//정렬구분
	, strAblYn : "N"						//폐지여부
	, strAotYn : "N"						//사물주소여부
	, strSynnYn : null
	, strHstryYn : "Y"
	, reqFrom :  "RN_SEARCH_KOR_WEB"
	, checkMoblieYn : "N"
	, strFunctionName : "Y"
	, pageable : {
		page : currentPage.value,
		size : pageSize.value,
	}
});

//검색 유효성 체크
const recentSearchesResultRef = () => {
	
	if (jusoInputValid.value == true) {
		alert("입력된 값을 삭제하고 다시 시도해주십시오.");
		return false;
	}
	
	jusoSearchParams.keyword = validateJuso(jusoSearchParams.keyword);
	
	//주소 체크
	if (!checkValidate1(jusoSearchParams.keyword)){
		return false;
	}else if(!checkValidate2(jusoSearchParams.keyword)){
		return false;
	}else if(!keyWordMin(jusoSearchParams.keyword)){
		return false;
	}else if(!keyWordMax(jusoSearchParams.keyword)){
		return false;
	}else if(!keyWordIsNumber(jusoSearchParams.keyword)){
		return false;
	}else if(!keyWordIsMaxNumber(jusoSearchParams.keyword)){
		return false;
	}
	
	jusoSearchParams.keyword = regExpCheckJuso(jusoSearchParams.keyword);
	
	//인천 남구 -> 미추홀구 명칭변경 안내문구
	checkValidate3(jusoSearchParams.keyword);
	
	inqCndParams.pageable.page = 0;
	axiosCall();
}

//검색 수행
const axiosCall = async () => {
	loadingStore.show();
	let url = "/api/solr/solrKeywordSearch";
	await axios.post(url, jusoSearchParams)
		.then((response) => {
			const data = response.data;
			console.log('solrKeywordSearch->', response.data);
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				const totalElements = data.results.totalElements;
				const pageSize = data.results.size;
				currentPage.value = data.results.pageable.pageNumber;
				jusoSearchDataList.value = data.results.content.map((item, index) => {
					const rowNumber = currentPage.value * pageSize + index + 1;
					return {
						...item,
						rowNumber: rowNumber
					}
				})
				
				jusoSearchDataList.value.map(item => {
					//아파트인 경우 완성주소에서 건물명 제거
					if (item.aphusYn == "1" && item.schKorRoadNm.includes(",")) {
						item.schKorRoadNm = item.schKorRoadNm.substring(0, item.schKorRoadNm.indexOf(",")) + ")";
					}
				})
				
			} else {
				jusoSearchDataList.value.splice(0);
				pageInfo.totalRecords = 0;
				pageInfo.currentRecords = 0;
				pageInfo.totalPages = 0;
			}
		})
		.catch(error => {
			console.error("error =>", error);
		})
	jusoToggle.value = true;
	loadingStore.hide();
}

watch(() => saveParams.qaTypeCd, (newVal) => {
	saveParams.ctpvCd = "";
	saveParams.lgvReplcCd = "";
	jusoSearchParams.keyword = "";
	saveParams.buldNm = "";
	saveParams.chgBuldNm = "";
})

watch(() => jusoSearchParams.keyword, (newVal) => {
	if (newVal == "") {
		jusoToggle.value = false;
		jusoInputValid.value = false;
		saveParams.buldNm = "";
		saveParams.ctpvCd = "";
		saveParams.lgvReplcCd = "";
	}
})

watch(() => saveParams.ctpvCd, (newVal) => {
	if (newVal != "") {
		loadSggDataRegForm();
	}
})

const getJuso = async (item) => {
	console.log(item);
	axios.post('/api/jusoCommon/getLgvReplcCd', { "mode" : "sido", "code" : item.emdCd } )
		.then((response) => {
			console.log(response);
			saveParams.ctpvCd = response.data.toString();
			console.log(saveParams.ctpvCd);
		})

	axios.post('/api/jusoCommon/getLgvReplcCd', { "mode" : "sgg", "code" : item.emdCd }	)
		.then((response) => {
			saveParams.lgvReplcCd = response.data.toString();
			console.log(saveParams.lgvReplcCd);
		})
	
	saveParams.buldNm = item.bdNm ? item.bdNm : "건물명 없음";
	jusoSearchParams.keyword = item.schKorRoadNm;
	saveParams.keyword = jusoSearchParams.keyword;
	jusoToggle.value = false;
	jusoInputValid.value = true;
	
	//주소관리번호조합
	//시군구코드(5)+읍면동(3)+도로명코드(7)+지하구분(1)+건물본번(5)+건물부번(5) : 26자리
	let sigCd = item.emdCd + item.bdMgtSn.substring(5, 8);
	let roadNmCd = item.rdMgtSn.substring(5);
	let udrtYn = !item.udrtYn ? "0" : item.udrtYn; //0 지상, 1 지하, 2 공중
	let buldMnnm = lpad(item.bdMaSn, 5, '0');
	let buldSlno = lpad(item.bdSbSn, 5, '0');
	saveParams.referCn = sigCd+roadNmCd+udrtYn+buldMnnm+buldSlno;
	console.log(saveParams.referCn);
}

const lpad = (str, length, padChar) => {
	str = String(str);
	while (str.length < length) {
		str = padChar + str;
	}
	return str;
}

/*----------------------------------------------------------------------- 기타 */

const header = ref('');
const updateCaption = () => {
    const width = window.innerWidth;
    header.value = width > 900 ? '불편신고 리스트로 NO, 제목, 등록일, 조회수 정보를 제공합니다':'불편신고 리스트로 제목, 등록일 정보를 제공합니다';
}

onMounted(async() => {
    //th에 scope달기
    const headers = document.querySelectorAll('th[role="columnheader"]');
    headers.forEach(header => {
        header.setAttribute('scope', 'col');
    })
    
    loadSidoData();
    await fnSrch();

    //캡션 추가
    updateCaption();
    window.addEventListener('resize', updateCaption);
})

onBeforeUnmount(() => {
    //캡션 제거
    window.removeEventListener('resize', updateCaption);
})
</script>