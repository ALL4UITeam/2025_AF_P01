<template>
	<CommonBreadcrumb />

    <HeaderTitle title="주소전환" />

    <TabMenu :model="tabItems" :activeIndex="active" @tab-change="onTabChange" />
    <div v-show="active === 0">
        <div class="convertStep__wrap">
            <ol class="convertStep">
                <li class="step01">
                    <div class="inbox type02">
                        <div class="convertStep__number">STEP1</div>
                        <p class="convertStep__text">{{title.substring(0,2)}}<span v-if="isCoordinates">을</span><span v-else>를</span> 직접입력 /<br /> 붙여넣기</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step02">
                    <div class="inbox type03">
                        <div class="convertStep__number">STEP2</div>
                        <p class="convertStep__text">도로명주소 전환<br /> 버튼 클릭</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step03">
                    <div class="inbox type04">
                        <div class="convertStep__number">STEP3</div>
                        <p class="convertStep__text">전환결과<br /> 확인하기</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step04">
                    <div class="inbox type05">
                        <div class="convertStep__number">STEP4</div>
                        <p class="convertStep__text">엑셀 및 텍스트로<br /> 다운로드</p>
                    </div>
                </li>
            </ol>
        </div>

		<p class="tipAddress"><i aria-hidden="true" class="bi bi-exclamation-circle-fill"></i> 도로명주소를 지번주소로 전환하는 서비스는 제공되지 않음을 양해 부탁드립니다.</p>
        <div class="addressConvert__header">
            <ContentTitle :title="title" fontSize="24px" marginTop="0" mobileFontSize="18px" mobileMarginTop="0" />
            <Button class="commonButton__button" :title="buttonText" @click="toggleTypeChage">
                <span class="commonButton__text">{{buttonText}}</span>
                <i aria-hidden="true" class="bi bi-arrow-right" />
            </Button>
        </div>

        <div class="sampleAddressEntry">
            <p class="sampleAddressEntry__title">{{title}}예시</p>
            <div class="sampleAddressEntry__content">
                <p class="sampleAddressEntry__subText" v-if="isCoordinates">지번<span class="commonColor01">(필수)</span></p>
                <p class="sampleAddressEntry__subText" v-else>X좌표<span class="commonColor01">(필수)</span></p>
                <div class="sampleAddressEntry__sampleBox" v-if="isCoordinates">서울특별시 강남구 개포동 000-00</div>
                <div class="sampleAddressEntry__sampleBox" v-if="isCoordinates">서울특별시 종로구 내수동 용비어천가</div>
                <div class="sampleAddressEntry__sampleBox" v-if="!isCoordinates">[경위도] 126.8979336</div>
                <div class="sampleAddressEntry__sampleBox" v-if="!isCoordinates">[TM] 946833</div>
                <div class="sampleAddressEntry__sampleBox" v-if="!isCoordinates">[TM] 962213</div>
            </div>
            <div class="sampleAddressEntry__content">
                <p class="sampleAddressEntry__subText" v-if="isCoordinates">기타주소(선택) <span class="sampleAddressEntry__tip">- 참고사항으로 주소전환 대상은 아닙니다.</span></p>
                <p class="sampleAddressEntry__subText" v-else>Y좌표<span class="commonColor01">(필수)</span></p>
                <div class="sampleAddressEntry__sampleBox" v-if="isCoordinates">현대아파트 000동 00호</div>
                <div class="sampleAddressEntry__sampleBox" v-if="isCoordinates">000동 00층 00호</div>
                <div class="sampleAddressEntry__sampleBox" v-if="!isCoordinates">37.5767482</div>
                <div class="sampleAddressEntry__sampleBox" v-if="!isCoordinates">1953210</div>
                <div class="sampleAddressEntry__sampleBox" v-if="!isCoordinates">1895993</div>
            </div>
        </div>

        <div class="common__box">
            <div class="addressConvert__wrap">
                <table class="addressConvert__detail">
                    <caption>지번 50건 이하 주소전환 입력 테이블로 지번과 기타주소를 입력할 수 있습니다.</caption>
                    <colgroup>
                        <col />
                        <col />
                    </colgroup>
                    <tbody>
                        <tr v-for="n in itemCount" :key="n">
                            <th scope="row">
                                <label :for="'txt' + n">{{ isCoordinates ? "지번" : "좌표" }} {{n}}</label>
                            </th>
                            <td>
                                <div class="addressConvert__form" v-if="isCoordinates">
                                    <CustomInputText 
                                        :name="'name' + n"
                                        :id="'txt' + n"
                                        :title="'지번' + n"
                                        placeholder="지번을 입력하세요."
                                        v-model="inputValues[n - 1].jibun"
                                    />
                                    <label :for="'auxJibun' + n" class="blind">지번 {{n}} 기타주소</label>
                                    <CustomInputText
                                          :name="'auxJibun' + n"
                                          :id="'auxJibun' + n"
                                          :title="'기타주소' + n"
                                          placeholder="기타주소를 입력하세요"
                                          v-model="inputValues[n - 1].auxJibun"
                                      />
                                </div>
                                <div class="addressConvert__form" v-else>
                                    <label :for="'xCoordinate' + n" class="blind">X좌표 {{n}}</label>
                                    <CustomInputText
                                        :name="'xCoordinate' + n"
                                        :id="'xCoordinate' + n"
                                        :title="'X좌표를 입력하세요.' + n"
                                        placeholder="X좌표를 입력하세요."
                                        v-model="inputValues[n - 1].xCoordinate"
                                        @input="fnHandleInputCoordi"

                                    />
                                    <label :for="'yCoordinate' + n" class="blind">Y좌표 {{n}}</label>
                                    <CustomInputText
                                        :name="'yCoordinate' + n"
                                        :id="'yCoordinate' + n"
                                        :title="'Y좌표를 입력하세요.' + n"
                                        placeholder="Y좌표를 입력하세요."
                                        v-model="inputValues[n - 1].yCoordinate"
                                        @input="fnHandleInputCoordi"
                                        
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="addressConvert__footer">
                <div>
                    <Button class="commonButton__button" title="5줄 추가" v-if="inputValues.length < 50" @click.prevent="addItem()">
                        <span class="commonButton__text">5줄 추가</span>
                        <i aria-hidden="true" class="bi bi-plus" />
                    </Button>
                </div>
                <div class="addressConvert__button">
                    <Button class="commonButton__button" title="도로명주소 전환" @click.prevent="fnConvert()">
                        <span class="commonButton__text">도로명주소 전환</span>
                        <i aria-hidden="true" class="bi bi-arrow-right" />
                    </Button>
                    <Button class="commonButton__button" title="초기화" @click.prevent="reset()">
                        <span class="commonButton__text">초기화</span>
                    </Button>
                </div>
            </div>
        </div>

        <div class="common__box" v-if="resultFlag">

                <DataTable class="tableStyle01 noneLine" :value="convertedAddr50" ref="dataTableRef">
                    <Column header="No" field="inptNo" style="width:10%;"/>
                    <Column header="결과" field="refineFlag"style="width:10%;"/>
                    <Column header="우편번호" field="sbdno" style="width:10%;"/>
                    <Column header="입력좌표(X,Y)" field="coordinates" v-if="!isCoordinates" style="width:15%;"/>
                    <Column header="지번" field="inptAddr" style="width:20%;"/>
                    <Column header="도로명주소" field="roadNm" style="width:30%;"/>
                    <Column header="기타주소" field="etcAddr" v-if="isCoordinates"/>
                </DataTable>

            <div class="addressConvert__footer alignRight">
                <div class="addressConvert__button">
                    <Button class="commonButton__button" title="엑셀다운로드" @click.prevent="fnExcelDwnld()">
                        <span class="commonButton__text">엑셀다운로드</span>
                        <i aria-hidden="true" class="bi bi-download" />
                    </Button>
                    <Button class="commonButton__button" title="텍스트 다운로드" @click.prevent="fnTextDwnld()">
                        <span class="commonButton__text">텍스트 다운로드</span>
                        <i aria-hidden="true" class="bi bi-download" />
                    </Button>
                </div>
            </div>
        </div>

        <div class="addressConvert__guideBox">
            <p class="addressConvert__guideBoxTitle">
                <i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 전환결과 확인 안내
            </p>
            <ul class="addressConvert__guideBoxText">
                <li>번호가 "1-2"와 같이 표기되는 건은 입력하신 지번에 여러 개의 도로명주소가 존재하는 건입니다.</li>
                <li>성공여부가 "실패" 인 건은 입력하신 지번에 정확히 일치하는 도로명주소가 검색되지 않은 경우 입니다.
                    <p class="addressConvert__guideBoxTip">(화면 상단의 통합검색을 이용하시거나 해당 자치단체에 문의하시면 정확한 주소를 알 수 있습니다.)</p>
                </li>
            </ul>
        </div>
    </div>
    <div v-show="active === 1">
        <div class="convertStep__wrap">
            <ol class="convertStep stepType01">
                <li class="step05">
                    <div class="inbox type01">
                        <div class="convertStep__number">STEP1</div>
                        <p class="convertStep__text">가이드 &amp; 예제파일<br /> 다운받기</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step06">
                    <div class="inbox type02">
                        <div class="convertStep__number">STEP2</div>
                        <p class="convertStep__text">예제파일에 형식을<br /> 맞춰 주소 입력</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step07">
                    <div class="inbox type03">
                        <div class="convertStep__number">STEP3</div>
                        <p class="convertStep__text">주소전환<br /> 파일 선택</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step08">
                    <div class="inbox type04">
                        <div class="convertStep__number">STEP4</div>
                        <p class="convertStep__text">변환<br/>실행</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step04">
                    <div class="inbox type05">
                        <div class="convertStep__number">STEP5</div>
                        <p class="convertStep__text">엑셀 및 텍스트로<br />다운로드</p>
                    </div>
                </li>
            </ol>
        </div>

        <p class="tipAddress type01"><i aria-hidden="true" class="bi bi-exclamation-circle-fill"></i> 도로명주소를 지번주소로 전환하는 서비스는 제공되지 않음을 양해 부탁드립니다.</p>
        <div class="addressConvert__fileUploadWrap">
            <ContentTitle title="주소전환 파일 선택" fontSize="20px" marginTop="20px" mobileFontSize="14px" mobileMarginTop="0" />
            <div class="addressConvert__fileUpload">
	            <InnorixFileUpload @files-added="handleFilesAdded" @send-fileMgno="handleFileMgnoAdded" ref="innorixRefThousand" job="type02"/>
            </div>
			<!-- 
			 <input type="file" @change="handleFilesAdded" class="file-input">
			 -->
            <ul class="fileUpload__tip">
                <li>
                    <span class="commonBullet">※</span> 첨부가능한 파일 확장자 : txt,xls(xlsx)
                </li>
            </ul>
            <div class="addressConvert__fileUploadButton">
                <Checkbox 
                    v-model="checkedRef2"
                    inputId="xy"
                    name="extendSrch" 
                    value="" 
                    title="좌표입력하기"
                    :binary="true"
                />
                <label for="xy">좌표입력</label>
                <Button class="commonButton__button" title="전환실행" @click.prevent="fnThousandConvert()">
                    <span class="commonButton__text">전환실행</span>
                    <i aria-hidden="true" class="bi bi-arrow-right" />
                </Button>
            </div>
        </div>

        <div class="addressConvert__footer alignCenter">
            <div class="addressConvert__button">
                <Button class="commonButton__button" title="가이드 예제파일 다운로드" @click.prevent="fnGuideFileDownload()">
                    <span class="commonButton__text">가이드 &amp; 예제파일 다운로드</span>
                    <i aria-hidden="true" class="bi bi-download" />
                </Button>
            </div>
        </div>

        <ContentTitle title="Sample" fontSize="24px" marginTop="49px" mobileFontSize="18px" mobileMarginTop="30px" />
        <ul class="addressConvert__sampleBox">
            <li>
                <p class="addressConvert__sampleTitle">텍스트파일 양식 샘플(TXT)</p>
                <div class="addressConvert__sampleImage"><img src="@/assets/images/utilization/img-sample-txt.png" alt="텍스트파일 양심 샘플(TXT)로 메모장에 각 주소를 엔터로 구분하여 입력하시면 됩니다." /></div>
            </li>
            <li>
                <p class="addressConvert__sampleTitle">엑셀파일 양식 샘플(XLS, XLSX)</p>
                <div class="addressConvert__sampleImage"><img src="@/assets/images/utilization/img-sample-xlsx.png" alt="엑셀파일 양식 샘플(XLS, XLSX)로 A-G열은 순서대로 시도+(필수), 시군구+(필수), 읍면동+(필수),리,산,지번+(필수), 기타주소로 되어 있으며 1번 행은 구분이고 2번행부터 해당 열에 정보를 입력하시면 됩니다." /></div>
            </li>
        </ul>

        <div class="addressConvert__guideBox">
            <p class="addressConvert__guideBoxTitle">
                <i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 유의사항
            </p>
            <ul class="addressConvert__guideBoxText">
                <li><strong>올바른 주소 입력형식 안내</strong>
                    <div class="addressConvert__guideImage"><img src="@/assets/images/utilization/img-guide.png" alt="올바른 주소 입력 형식 안내: 부산시 진구 범천1동 850-16 세운이노빌3층(잘못된 주소), 부산시 진구 범천1동 850-16 세운이노빌(올바른 주소), 서울특별시 종로구 종로3가 102번지 3호(잘못된 주소), 서울특별시 종로구 종로3가 102-3(올바른 주소), 서울특별시 은평구 진관동(잘못된 주소), 서울특별시 은평구 진관동 1-25(올바른 주소), 교남동 100-10(잘못된 주소), 서울특별시 종로구 교남동 100-10(올바른주소)" /></div>
                    <ul class="addressConvert__guideBoxTextInner">
                        <li><span class="commonColor01">[엑셀형식]</span> 예제파일을 다운받아 형식에 맞게 작성하시면 주소전환 정확도가 향상됩니다.</li>
                        <li><span class="commonColor01">[텍스트형식]</span> Window7 이상에서 메모장(text파일)을 활용할 경우, 인코딩 방식을 <span>*</span>ANSI방식으로 지정하십시오.</li>
                    </ul>
                    <p class="addressConvert__guideBoxTextInnerTip">*ANSI:문자인코딩 방식으로 영어 이외의 문자표현 시 사용</p>
                </li>
            </ul>
        </div>
    </div>

    <div v-show="active === 2">
        <div class="convertStep__wrap">
            <ol class="convertStep">
                <li class="step01">
                    <div class="inbox type06">
                        <div class="convertStep__number">STEP1</div>
                        <p class="convertStep__text">텍스트문서<br /> (확장자txt) 만들기</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step02">
                    <div class="inbox type07">
                        <div class="convertStep__number">STEP2</div>
                        <p class="convertStep__text">본인인증<br /> (휴대폰/아이핀 인증)</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step03">
                    <div class="inbox type08">
                        <div class="convertStep__number">STEP3</div>
                        <p class="convertStep__text">파일업로드/<br /> 파일변환</p>
                    </div>
                    <i aria-hidden="true" class="bi bi-arrow-right-short" />
                </li>
                <li class="step04">
                    <div class="inbox type05">
                        <div class="convertStep__number">STEP4</div>
                        <p class="convertStep__text">텍스트<br />다운로드</p>
                    </div>
                </li>
            </ol>
        </div>

        <p class="tipAddress type01"><i aria-hidden="true" class="bi bi-exclamation-circle-fill"></i> 도로명주소를 지번주소로 전환하는 서비스는 제공되지 않음을 양해 부탁드립니다.</p>
        <div class="addressConvert__fileUploadWrap">
            <ContentTitle title="주소전환 파일 선택" fontSize="20px" marginTop="20px" mobileFontSize="14px" mobileMarginTop="0" />
            <p class="addressConvert__fileUploadSubText">개인 또는 기관이 보유한 100만건 이하 지번을 도로명주소로 횟수에 관계없이 무료로 전환해 드립니다.</p>
			<div class="addressConvert__fileUpload">            
            	<InnorixFileUpload @files-added="handleFilesAdded" @send-fileMgno="handleFileMgnoAdded" ref="innorixRefMillion" job="type03"/>
            </div>
            <!-- 
            <input type="file" @change="handleFilesAdded">
             -->
            <ul class="fileUpload__tip">
                <li>
                    <span class="commonBullet">※</span> 첨부가능한 파일 확장자 : txt
                </li>
                <li>
                    <span class="commonBullet">※</span> 첨부파일에 개인정보(주민등록번호, 성명 등)가 포함되어 있는지 확인 바랍니다.
                </li>
                <li>
                    <span class="commonBullet">※</span> 전환서비스는 접수 순으로 진행되므로 30분~1일까지 소요될 수 있습니다.(30만건 이하 기준)
                </li>
                <li>
                    <span class="commonBullet">※</span> 변환된 파일은 1주일이 경과되면 삭제될 수 있습니다.
                </li>
            </ul>
            <div class="addressConvert__fileUploadButton">
                <Button class="commonButton__button" title="전환실행" @click.prevent="myList('add')">
                    <span class="commonButton__text">전환실행</span>
                    <i aria-hidden="true" class="bi bi-arrow-right" />
                </Button>
                <Button class="commonButton__button" title="신청내역 조회" @click.prevent="myList('select')">
                    <span class="commonButton__text">신청내역 조회</span>
                    <i aria-hidden="true" class="bi bi-arrow-right" />
                </Button>
            </div>
        </div>

        <div class="addressConvert__footer alignCenter">
            <div class="addressConvert__button">
                <Button class="commonButton__button" title="텍스트 문서 예제파일 다운로드" @click.prevent="fnGuideFileDownload()">
                    <span class="commonButton__text">텍스트 문서 예제파일 다운로드</span>
                    <i aria-hidden="true" class="bi bi-download" />
                </Button>
            </div>
        </div>


        <div class="addressConvert__guideBox">
            <p class="addressConvert__guideBoxTitle">
                <i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 유의사항
            </p>
            <ul class="addressConvert__guideBoxText02">
                <li><span class="commonColor01">주소전환 자료에는 개인정보를 포함하면 안됩니다.</span>
                    <p class="addressConvert__guideBoxInnerText">주소전환을 원하는 경우 파일 내에 개인정보 (주민등록번호, 성명 등) 이 포함되지 않도록 주의해 주시기 바랍니다.</p>
                </li>
                <li>주소전환을 원하는 지번만을 자료에 담아 주시기 바랍니다.
                    <ul class="addressConvert__guideBoxInnerText">
                        <li>-시도/시군구/읍면동/리 + 지번 순으로 주소만 기재하시기 바랍니다.(타 정보는 불필요)</li>
                        <li>-윈도우8이상에서 메모장을 활용할 경우 인코딩방식을 'ANSI'방식으로 지정하셔야 합니다.</li>
                    </ul>
                </li>
                <li><span class="commonColor01">빈 줄을 포함하여 100만건 이하, 100MB 이내</span>의 자료만 처리 가능합니다.</li>
                <li>발급내역을 확인하기 위해 본인인증 절차가 필요합니다.</li>
            </ul>
        </div>
    </div>
    
 	<Certification v-if="certificationDialogVisible" :redirectTo="'/aht/AhtAddressTransformOffer'" @popupClose="certificationCloseDialog" @job="fnCertAftWork"/>
 
</template>


<style lang="scss" scoped>

</style>
<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import TabMenu from 'primevue/tabmenu'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import axios from 'axios';
import Panel from 'primevue/panel';
import _ from 'lodash';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import ContentTitle from '@/components/title/ContentTitle.vue';
import Checkbox from "primevue/checkbox";
import CustomInputText from '@/components/input_text/CustomInputText.vue';
//import InnorixFileUpload from '@/components/innorix/JusoInnorixFileUpload.vue';
import InnorixFileUpload from '@/components/innorix/JusoInnorixFileUpload.vue';
import { useRouter, useRoute } from "vue-router";
import Dialog from 'primevue/dialog';
import CommonBreadcrumb from '@/components/breadcrumb/CommonBreadcrumb.vue';
import {useLoadingStore} from "@/stores/ui.loading";
import Certification from "@/components/common/CertificationComponent.vue";

const loadingStore = useLoadingStore();
const router = useRouter();
const route = useRoute();

//테이블
const dataTableRef = ref(null);
const tabItems = ref([
    {label:'50건 이하 주소전환'},
    {label:'3,000건 이하 주소전환'},
    {label:'100만건 이하 주소전환'},
]);

//탭 구분 변수
const active = ref(0);

//50건 주소전환 줄 추가 변수
const baseItemCount = 10;
const increaseAmount = 5;

const resultFlag = ref(false);
const checkedRef = ref(null);
const checkedRef2 = ref(null);

const innorixRefThousand = ref(null);
const innorixRefMillion = ref(null);

const aplyMode = ref(null);

//50건 주소전환 결과변수
const convertedAddr50 = reactive([{}]);

//3000건 주소전환 신청 파라미터
const thousandParams = ref({})

//100만건 주소전환 신청 파라미터
const millionParams = ref({
	uldFileNm : ''
	,actlFileNm : ''
})

//파일첨부 변수
const addedFiles = ref(null);

//50건 좌표입력화면 관련변수
const isCoordinates = ref(true);
const title= ref('지번입력');
const tableTitle = ref('좌표');
const tableCaption = ref('좌표 입력 테이블');

const buttonText = computed(() => {
    return isCoordinates.value ? '좌표 입력' : '지번 입력';
})

//좌표,지번입력 화면변경
const toggleTypeChage = () => {
    isCoordinates.value = !isCoordinates.value;
    if (!isCoordinates.value) {
        title.value = "좌표입력"
        tableCaption.value = "좌표 50건 이하 주소전환 입력 테이블로 지번과 기타주소를 입력할 수 있습니다."
        tableTitle.value = "좌표"
    } else {
        title.value = "지번입력"
        tableCaption.value = "지번 50건 이하 주소전환 입력 테이블로 지번과 기타주소를 입력할 수 있습니다."
        tableTitle.value = "지번"
    }
}

const inputValues = reactive(
    Array.from({ length: baseItemCount}, () => ({jibun: '', auxJibun: ''}))
);

const itemCount = computed(() => inputValues.length);

//50건 이하 주소전환 입력값 체크
const validCheck = async () => {
	let cnt = 0;
	for (let i=0; i<inputValues.length; i++) {
		if (inputValues[i].jibun != '' && inputValues[i].jibun != undefined) {
			cnt++;
			let data = inputValues[i].jibun;
		
			var reqExp1 = /읍|면|동|[0-9]가|리/ ;
			var fulljuso = data.replace(/(^\s*)|(\s*$)|\(|\)/g, ""); //앞뒤 공백 제거
			var jusoArr = fulljuso.split(reqExp1); //읍/면/동 기준으로 문자열 자르기
			var idx = jusoArr.length - 1;
			
			if (jusoArr.length==1 || jusoArr[idx] == "" || jusoArr[idx] == null) {
				alert("\""+data + "\" 주소에 대해\n지번본번·부번 혹은 건물명을 상세히 입력해 주세요.");
				return false ;
			}
			return true ;
	   	}
	}
	if (cnt == 0) {
		return false;
	}
}

//50건 좌표전환 숫자 외 입력방지
const fnHandleInputCoordi = async () => {
	for (var i=0; i<inputValues.length; i++) {
		let regex = /[^0-9.]/g;
		let xresult = null;
		let yresult = null;
		
		if(inputValues[i].xCoordinate) {
			xresult = inputValues[i].xCoordinate.match(regex);
		}
		
		if(inputValues[i].yCoordinate) {
			yresult = inputValues[i].yCoordinate.match(regex);
		}
		
		if(xresult != null) {
	   		alert('소수점 단위의 숫자로 입력해주십시오.');
	   		inputValues[i].xCoordinate = '';
			return;
		}
        
		if(yresult != null) {
	   		alert('소수점 단위의 숫자로 입력해주십시오.');
	   		inputValues[i].yCoordinate = '';
			return;
		}
		
	}
}

//50건 주소전환 실행
const fnConvert = async () => {
	if (isCoordinates.value) {
		let params = '';
		let resultTag;
		
		await validCheck().then(result =>{
			resultTag = result;
		});
		
		if (!resultTag) {
			alert('전환할 주소를 입력하세요.');
			return;
		}
		
		for (let i=0; i<inputValues.length; i++) {	
	
			if (inputValues[i].jibun == '' && inputValues[i].auxJibun != ''){
				alert(i + '번 칸의 지번을 입력해주세요.');
				return;
			}
			
			if (inputValues[i].jibun != ''){
				params += inputValues[i].jibun;
				if (inputValues[i].auxJibun != '') {
					params += ' ' + inputValues[i].auxJibun + '!';
				} else {
					params += '!';
				}
			}
		}
		
		loadingStore.show();
		let dto = {"params" : params};
		axios.post('/api/aht/selectConvertAddr', dto)
			.then(response => {
				resultFlag.value = true;
				if (response.data.results != null) {
					fnResultBind(response.data);
				}
				
			})
		    .catch(error =>{
				console.error("error =>", error);
				alert("에러가 발생했습니다.");
		    }).finally(() => {
				loadingStore.hide();
			});
		
	} else {
		let params = '';
		for (let i=0; i<inputValues.length; i++) {
			if ((inputValues[i].xCoordinate && !inputValues[i].yCoordinate) || (!inputValues[i].xCoordinate && inputValues[i].yCoordinate)) {
				alert("X 또는 Y좌표가 누락되었습니다.\n입력값을 확인해주세요.")
				return false;
			}
			if (parseInt(inputValues[i].xCoordinate) > 2147483647) {
				alert('입력할 수 없는 X좌표 입니다.');
				return false;
			}
			if (parseInt(inputValues[i].yCoordinate) > 2147483647) {
				alert('입력할 수 없는 Y좌표 입니다.');
				return false;
			}
			if (inputValues[i].xCoordinate && inputValues[i].yCoordinate) {
				params += inputValues[i].xCoordinate + ' ' + inputValues[i].yCoordinate + '!';
			}
		}
		loadingStore.show();
		let dto = {"params" : params};
		axios.post('/api/aht/selectConvertAddrCoordi', dto)
			.then(response => {
				resultFlag.value = true;
				if (response.data.results != null) {
					params = params.replace(/ /g, ',');
					let arrParam = params.split('!');
				
					for (let i=0; i<response.data.results.length; i++){
						let num = response.data.results[i].inptNo;
						response.data.results[i].coordinates = arrParam[num - 1];
					}
					fnResultBind(response.data);
				}
			})
		    .catch(error =>{
				console.error("error =>", error);
		    })
			.finally(() => {
				loadingStore.hide();
			});
	}
	
}

//50건 주소전환 결과 매핑
const fnResultBind = (data) => {
	for (var i=0; i<data.results.length; i++){
		//복수지번인 경우
		if (data.results[i].multiInptNo != null) {
			data.results[i].inptNo = data.results[i].multiInptNo;
		}
		//좌표주소 전환 실패인 경우
		if (data.results[i].inptAddr == '실패시 실패구 실패동 1-1') {
			data.results[i].inptAddr = "전환된 지번주소가 없습니다.";
		}
	}
	convertedAddr50.splice(0);
	Object.assign(convertedAddr50, data.results);
}

//50건 이하 엑셀다운로드
const fnExcelDwnld = () => {
	loadingStore.show();
	let header = {
			"inptNo" : "번호"
			, "refineFlag" : "결과"
			, "sbdno" : "우편번호"
			, "inptAddr" : "지번"
			, "roadNm" : "도로명주소"
			, "etcAddr" : "기타주소"
			, "resultRn" : "전환결과"
	};

	if (!isCoordinates.value){
		header = {
			"inptNo" : "번호"
			, "refineFlag" : "결과"
			, "sbdno" : "우편번호"
			, "coordinates" : "입력좌표(X,Y)"
			, "inptAddr" : "지번"
			, "roadNm" : "도로명주소"
			, "resultRn" : "전환결과"
		};
	}
	
	let param = {
		"fileNm" : "도로명주소전환"
		,"headerEngTitle" : header
		,"dataList" : convertedAddr50
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
		.then(response => {
			const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(blob);
			link.download = '도로명주소전환.xlsx';
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

//50건 이하 TXT다운로드
const fnTextDwnld = () => {
	loadingStore.show();
	const text = ref();
	convertedAddr50.forEach(function(v, i){
		if(i == 0){
			if(!isCoordinates.value){
				text.value = '번호,결과,우편번호,입력좌표(X,Y),지번,도로명주소\n';
			}else{
				text.value = '번호,결과,우편번호,지번,도로명주소,기타주소,전환결과\n';
			}
		}
		if(!isCoordinates.value){
			text.value += v.inptNo + ',' + v.refineFlag + ',' + v.sbdno + ',' + v.coordinates + ',' + v.inptAddr + ',' + v.roadNm + '\n';
		}else{
			text.value += v.inptNo + ',' + v.refineFlag + ',' + (v.sbdno == null ? '' : v.sbdno) + ',' + v.inptAddr + ',' + v.roadNm + ',' + (v.etcAddr == null ? '' : v.etcAddr) + ',' + (v.resultRn == null ? '' : v.resultRn) + '\n';
		}
	});

	const blob = new Blob([text.value], {type:'text/plain'});
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = '도로명주소전환';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
	loadingStore.hide();
}

//3000건 이하 주소전환 실행
const fnThousandConvert = async () => {
	await innorixRefThousand.value?.onUpload();
}

//100만건 (전환실행 or 신청내역 조회)
function myList(mode) {
	if (mode == "add" && !addedFiles.value) {
		alert("첨부된 파일이 없습니다.");
		return;
	}
	aplyMode.value = mode;
	certificationDialogVisible.value = true;
}

//100만건 주소전환 본인인증 처리 이후 분기
const fnCertAftWork = async() => {
	if (aplyMode.value == "add") {
		await innorixRefMillion.value?.onUpload();
	} else {
		fnConvertList();
	}
}

//이노릭스 파일 추가 이후 실행 함수
const handleFilesAdded = async (files) => {
	addedFiles.value = files;
	const fileName = files[0].file.name;
	
	if(active.value == "1" && !fileName.endsWith(".txt") && !fileName.endsWith(".xls") && !fileName.endsWith(".xlsx")){
        alert("주소전환은 txt, xls, xlsx 파일만 지원합니다.");
		await innorixRefThousand.value?.deleteFile();
        return false;
	}else if(active.value == "2" && !fileName.endsWith(".txt")){
        alert("txt파일만을 지원합니다.");
		await innorixRefMillion.value?.deleteFile();
        return false;
	}
	
	//3000건 주소전환 파일 용량 제한, 100만건 주소전환 100mb 제한
  	if (active.value == "1" && files[0].file.size > 5242880) {
  		alert("5 Mbyte이상의 파일은 지원하지 않습니다.");
		await innorixRefThousand.value?.deleteFile();
        return false;
	} else if(active.value == "2" && files[0].file.size > 104857600){
  		alert("100 Mbyte이상의 파일은 지원하지 않습니다.");
		await innorixRefMillion.value?.deleteFile();
        return false;
	}
}

//3000, 100만건 주소전환 파일 업로드 이후 실행 함수
const handleFileMgnoAdded = async (p) => {
	
	if (active.value == "1") { //3000건
		loadingStore.show();
		thousandParams.value.orgFileName = p.customValue.actlFileNm;
		thousandParams.value.uploadFile = p.customValue.uldFileNm;
		thousandParams.value.xyFlag = checkedRef2.value;
		
	 	axios.post('/api/aht/selectConvertAddrThd', thousandParams.value)
			.then(response => {
				if (response.data.results.msg != null && response.data.results.msg != "") {
					alert(response.data.results.msg);
					return;
				}
				
				if (response.data.results.refineAllSize == 0 && response.data.results.refineFailNocsSize == 0 
					&& response.data.results.refineMultiNocsSize == 0 && response.data.results.refineNocsSize == 0 ) {
					if(checkedRef2){
						alert('자료를 읽을 수 없습니다.\n좌표전환 양식에 맞춰 자료를 재정비 하여주시기 바랍니다.\n\n좌표전환 신청이 아닌 경우\n좌표입력 체크박스를 해제한 후 신청해주십시오.');
						return;
					}
				} else {
					router.push({
						path: '/aht/ahtAddressTransformThousand',
						state: {data : JSON.stringify(response.data.results)}
					});
				}
			})
		    .catch(error =>{
				console.error("error =>", error);
		    })
	 		.finally(() => {
				loadingStore.hide();
	    	});
		
	} else if(active.value == "2") { //100만건
		millionParams.value.uldFileNm = p.uldFileNm;
		millionParams.value.actlFileNm = p.file.name;
		millionParams.value.serverFilePath = p.serverFilePath;
		
		axios.post('/api/aht/insertTransformAddr', millionParams.value)
			.then((response) => {
				if (response.data.results == "SUCCESS") {
					fnConvertList();
				} else {
					alert(response.data.results);
				}
			})
			.catch(error =>{
				console.error("error =>", error);
			});
	}
}

//100만건 신청내역 페이지 이동
const fnConvertList = () => {
	router.push({
		path: '/aht/ahtAddressTransformMillionOffer'
	});
}

//가이드파일 다운로드
const fnGuideFileDownload = async () => {
	loadingStore.show();
	let uldFileNm = '';
	let actlFileNm = '';
	
	if (active.value == "1") {
		uldFileNm = 'a070cc88-d2b1-431f-bbab-54e995a0b4a6.zip';
		actlFileNm = '가이드_예제파일.zip';
	} else {
		uldFileNm = '04b16b89-b1fa-4d6c-9821-8c085c4d3cf3.txt';
		actlFileNm = 'sample.txt';
	}
	
	const innorixDownloadUrl = `/api/innorix/downloadConvertGuideFile`;
	const fileDownloadUrl = `${innorixDownloadUrl}/${uldFileNm}/`;
	
	try {
		const response = await axios({
			url: fileDownloadUrl,
   		 	method: 'GET',
   			responseType: 'blob'
   		});
   		const link = document.createElement('a');
   		link.href = URL.createObjectURL(new Blob([response.data], {type: 'application/octet-stream'}));
		link.download = actlFileNm;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
   } catch(error) {
		console.log("error : ", error);
   }
   loadingStore.hide();
}

//본인인증 팝업 호출 변수
const certificationDialogVisible = ref(false);

//본인인증 팝업 오픈
const certificationOnShowDialog = (item) => {
  certificationDialogVisible.value = true;
  setTimeout(() => {
  document.querySelector('#certificationDialogFocus').focus();
  }, 0);
}

//본인인증 팝업 닫기
const certificationCloseDialog = () => {
  certificationDialogVisible.value = false;
}

//5줄 추가
const addItem = () => {
	for (let i = 0; i < increaseAmount; i++) {
		inputValues.push({jibun: '', auxJibun: ''});
	}
}

//50건 주소전환 입력값 초기화
const reset = () => {
    inputValues.splice(0, inputValues.length, ...Array.from({length: baseItemCount}, ()=> ({jibun: '', auxJibun: ''})));
}

const onTabChange = (e) => {
	active.value = (e.index == 0 || e.index) ? e.index : e;
}

onMounted(() => {
	if(history.state.active){
		onTabChange(Number(history.state.active));
	}
	
	//감리조치 불필요한 이미지태그 제거
	const ircElements = document.querySelectorAll('.irx-preview-image');
	ircElements.forEach(function(img) {
		img.remove();
	})
});
</script>
<style scoped>
</style>
