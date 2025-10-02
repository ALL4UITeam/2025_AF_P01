<template>
	<CommonBreadcrumb />
    <HeaderTitle title="주소 통계" />

    <TabMenu :model="tabItems" :activeIndex="active" @tab-change="onTabChange" />
        
        <div v-show="active === 0">
        <div class="common__box roadName">
            <div class="roadName__basic">
                <img class="commonPc" src="@images/story/pc/img_roadName01.png" alt="왕복 8차로이상 대로, 2차로부터 7차로까지 로, 로보다 좁은곳 길" />
                <img class="commonMo" src="@images/story/mo/img_roadName01.png" alt="왕복 8차로이상 대로, 2차로부터 7차로까지 로, 로보다 좁은곳 길" />
            </div>
            <div class="roadName__details">
                <div class="roadName__date">
                    <span class="commonBullet">※</span> 기준일 : {{statsYmd}}
                </div>
                <div class="roadName__box">
                    <dl class="roadName__counting">
                        <dt>도로명 수</dt>
                        <dd>{{roa00}}</dd>
                    </dl>
                    <p class="roadName__text">도로구간마다 부여한 이름으로,<br /> 주된 명사에 도로별 구분기준인 대로, 로, 길을 붙여서 부여합니다.</p>
                    <ul class="roadName__list">
                        <li>
                            <div class="roadName__subTitle">고속도로<span class="commonColor01">(48)</span></div>
                        </li>
                        <li>
                            <div class="roadName__subTitle">대로<span class="commonColor01">(316)</span> </div>
                            <p class="roadName__subText">도로의 폭이 40m를 넘거나 왕복 8차선 이상의 도로</p>
                        </li>
                        <li>
                            <div class="roadName__subTitle">로<span class="commonColor01">(16,788)</span> </div>
                            <p class="roadName__subText">대로보다 작지만 폭이 12m를 넘거나 왕복2차선 이상의 도로</p>
                        </li>
                        <li>
                            <div class="roadName__subTitle">길<span class="commonColor01">(151,124)</span></div> 
                            <p class="roadName__subText">로보다는 좁은 기타 도로</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="common__box">
            <AddressInfo 
            	job="도로명"
                title="지역별 현황"
                subtitle="시도,시군구별 도로명 현황을 확인할 수 있습니다."
                :date="roadNmstatsYmd"
                :count="formatNumber(roadNmTotalCnt)"
                :options="['차트', '도표', '지도']"
                downloadPath="체크완료"
                v-model:selectChart="selectChartRegion" 
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'roadName', 'region')"
                @updateMapType="(newChartType) => handleMapChartTypeChange(newChartType, 'roadName', 'region')"
                @radioChart="(newChartType) => handleRadioClick('roadName', 'region', newChartType)"
                @downloadExcel="fnRegionExcelDwnld"
                prefix="chart1"
                :selectedItem02="selectedItem02"
                :isLoadingBar="isMapLoading.mapChart01"
            >
                <template v-slot:classification>
                    <div class="chartFormDropdown">
                        <label for="test1">기준년월</label>
                        <CustomDropdown @click.stop @change="handleDropdownChange('roadName', 'region', selectOption)" inputId="test1" :options="roadStatsYmSelectReg" v-model="selectedItem01" title="기준년월 선택" :placeholder="roadStatsYmSelectReg[0]?.label" />
                    </div>
                    <div class="chartFormDropdown">
                        <label for="test2">시/도</label>
                        <CustomDropdown @click.stop @change="handleDropdownChange('roadName', 'region', selectOption)" inputId="test2" :options="roadSidoCdSelectReg" v-model="selectedItem02" title="시/도 선택" :placeholder="roadSidoCdSelectReg[0]?.label" />
                    </div>
                </template>
                <template v-slot:setBarChartX>
                    <div id="barChart" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
<!--                    <div class="common__box infographic__box">-->
                    	<DataTable 
			                class="tableStyle02"
			                :value="regionColumns"
			                ref="dataTableRef01"
			            >
			                <Column style="width:10%;" header="연번" field="roadNmRnum" />
			                <Column header="구분" field="roadNmKorNm" />
			                <Column header="도로명수" field="roadNmCnt" />
			            </DataTable>
<!--                    </div>-->
                </template>
                <template v-slot:mapColorChart>
                    <div id="mapChart" style="width: 100%; height: 500px;"></div>
                </template>
                <template v-slot:mapBubbleChart>
                    <div id="mapChart" style="width: 100%; height: 500px;"></div>
                </template>
            </AddressInfo>
        </div>
        <div class="common__box">
            <AddressInfo 
            	job="도로명"
                title="부여사유별 현황"
                subtitle="시도,시군구별 도로명 부여사유 현황을 확인할 수 있습니다."
                :date="statsYmd"
                :count="formatNumber(roadNmReasonTotalCnt)"
                :options="['차트', '도표', '지도']"
                downloadPath="체크완료"
                v-model:selectChart="selectChartReason"
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'roadName', 'reason')"
                @updateMapType="(newChartType) => handleMapChartTypeChange(newChartType, 'roadName', 'reason')"
                @radioChart="(newChartType) => handleRadioClick('roadName', 'reason', newChartType)"
                @downloadExcel="fnReasonExcelDwnld"
                prefix="chart2"
                :roadNmReasonSelectedItem02="roadNmReasonSelectedItem02"
                :isLoadingBar="isMapLoading.mapChart02"
            >
                <template v-slot:classification>
                    <div class="chartFormDropdown">
                        <label for="test1">부여사유</label>
                        <CustomDropdown @click.stop @change="handleDropdownChange('roadName', 'reason', selectOption)" inputId="test1" :options="roadNmChoiceStatsCdAuth" v-model="roadNmReasonSelectedItem01" title="부여사유 선택" :placeholder="roadNmChoiceStatsCdAuth[0]?.label" />
                    </div>
                    <div class="chartFormDropdown">
                        <label for="test2">시/도</label>
                        <CustomDropdown @click.stop @change="handleDropdownChange('roadName', 'reason', selectOption)" inputId="test2" :options="roadSidoCdSelectRegReason" v-model="roadNmReasonSelectedItem02" title="시/도 선택" :placeholder="roadSidoCdSelectRegReason[0]?.label" />
                    </div>
                </template>
                <template v-slot:setBarChartX>
                	<div id="barChart2" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart2" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart2" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
<!--                    <div class="common__box infographic__box">-->
                    	<DataTable 
			                class="tableStyle02"
			                :value="reasonColumns"
			                ref="dataTableRef02"
			            >
			                <Column style="width:10%;" header="시도" field="roadNmReasonKorNm" />
			                <Column header="지명자〮연마을 이름" field="roadNmReg0410" />
			                <Column header="행정구역 명칭" field="roadNmReg0420" />
			                <Column header="역사적인물기〮념" field="roadNmReg0440" />
			                <Column header="문화재유〮적" field="roadNmReg0450" />
			                <Column header="기타" field="roadNmReg0499" />
			            </DataTable>
<!--                    </div>-->
                </template>
                <template v-slot:mapColorChart>
                    <div id="mapChart2" style="width: 100%; height: 500px;"></div>
                </template>
                <template v-slot:mapBubbleChart>
                    <div id="mapChart2" style="width: 100%; height: 500px;"></div>
                </template>
            </AddressInfo>
        </div>
        <div class="common__box">
            <AddressInfo 
            	job="도로명"
                title="위계별 현황"
                subtitle="시도,시군구별 도로위계현황을 확인할 수 있습니다."
                :date="statsYmd"
                :count="formatNumber(roadNmTypeTotalCnt)"
                :options="['차트', '도표', '지도']"
                downloadPath="체크완료"
                v-model:selectChart="selectChartroadType"
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'roadName', 'roadType')"
                @updateMapType="(newChartType) => handleMapChartTypeChange(newChartType, 'roadName', 'roadType')"
                @radioChart="(newChartType) => handleRadioClick('roadName', 'roadType', newChartType)"
                @downloadExcel="fnRoadTypeExcelDwnld"
                prefix="chart3"
                :roadNmTypeSelectedItem02="roadNmTypeSelectedItem02"
                :isLoadingBar="isMapLoading.mapChart03"
            >
                <template v-slot:classification>
                    <div class="chartFormDropdown">
                        <label for="test1">위계구분</label>
                        <CustomDropdown inputId="test1" @click.stop @change="handleDropdownChange('roadName', 'roadType', selectOption)" :options="roadTypeCd" v-model="roadNmTypeSelectedItem01" title="기준년월 선택" :placeholder="roadTypeCd[0]?.label" />
                    </div>
                    <div class="chartFormDropdown">
                        <label for="test2">시/도</label>
                        <CustomDropdown inputId="test2" @click.stop @change="handleDropdownChange('roadName', 'roadType', selectOption)" :options="roadSidoCdSelectRegRoadType" v-model="roadNmTypeSelectedItem02" title="시/도 선택" :placeholder="roadSidoCdSelectRegRoadType[0]?.label" />
                    </div>
                </template>
                <template v-slot:setBarChartX>
                    <div id="barChart3" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart3" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart3" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
<!--                    <div class="common__box infographic__box">-->
                    	<DataTable 
			                class="tableStyle02"
			                :value="roadTypeColumns"
			                ref="dataTableRef03"
			            >
			                <Column style="width:10%;" header="시도" field="roadNmTypeKorNm" />
			                <Column header="고속도로" field="roadNmTypeRoa01" />
			                <Column header="대로" field="roadNmTypeRoa02" />
			                <Column header="로" field="roadNmTypeRoa03" />
			                <Column header="길" field="roadNmTypeRoa04" />
			            </DataTable>
<!--                    </div>-->
                </template>
                <template v-slot:mapColorChart>
                    <div id="mapChart3" style="width: 100%; height: 500px;"></div>
                </template>
                <template v-slot:mapBubbleChart>
                    <div id="mapChart3" style="width: 100%; height: 500px;"></div>
                </template>
            </AddressInfo>
        </div>
		<div class="common__box">
            <AddressInfo 
            	job="도로명"
                title="같은도로명 현황"
                subtitle="전국에 많이 사용되는 상위 TOP10 도로명을 확인할 수 있습니다."
                :date="statsYmd"
                :count="formatNumber(roadNmSameTotalCnt)"
                :options="['차트', '도표']"
                downloadPath="체크완료"
                v-model:selectChart="selectChartSameRoadNm"
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'roadName', 'sameRoadNm')"
                @radioChart="(newChartType) => handleRadioClick('roadName', 'sameRoadNm', newChartType)"
                @downloadExcel="fnSameRoadNmExcelDwnld"
                prefix="chart4"
            >
                <template v-slot:setBarChartX>
                    <div id="barChart4" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart4" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart4" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
<!--                    <div class="common__box infographic__box">-->
                    	<DataTable 
			                class="tableStyle02"
			                :value="sameRoadNmColumns"
			                ref="dataTableRef04"
			            >
			                <Column style="width:10%;" header="연번" field="roadNmSameRnum" />
			                <Column header="구분" field="roadNmSameKorNm" />
			                <Column header="지역수" field="roadNmSameCnt" />
			            </DataTable>
<!--                    </div>-->
                </template>
                <template v-slot:map>
                    111111맵1111
                </template>
            </AddressInfo>
        </div>
    </div>
    
    <div v-show="active === 1">
        <div class="common__box roadName">
            <div class="roadName__basic">
                <img class="commonPc" src="@images/story/pc/img_roadName02.png" alt="도로에 이름을 붙이고 주택·건물에는 도로를 따라 순차적으로 번호를 붙여 도로명과 건물번호에 의해 표기" />
                <img class="commonMo" src="@images/story/mo/img_roadName02.png" alt="도로에 이름을 붙이고 주택·건물에는 도로를 따라 순차적으로 번호를 붙여 도로명과 건물번호에 의해 표기" />
            </div>
            <div class="roadName__details">
                <div class="roadName__date">
                    <span class="commonBullet">※</span> 기준일 : {{statsYmd}}
                </div>
                <div class="roadName__box">
                    <dl class="roadName__counting">
                        <dt>도로명주소 수</dt>
                        <dd class="type02">{{totCo}}</dd>
                    </dl>
                    <p class="roadName__text">도로에 이름을 붙이고 주택·건물에는 도로를 따라<br /> 순차적으로 번호를 붙여 도로명과 건물번호에 의해 표기하는 주소입니다.</p>
                    <ul class="roadName__list">
                        <li>
                            <p class="roadName__subText">지난해 새로 부여한 도로명주소<span class="commonColor01">(316)</span> </p>
                        </li>
                        <li>
                            <p class="roadName__subText">올해 새로 부여한 도로명주소<span class="commonColor01">(16,788)</span></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    
        <div class="common__box">
            <AddressInfo 
            	job="도로명주소"
                title="지역별 현황"
                subtitle="시도,시군구별 도로명주소 현황을 확인할 수 있습니다."
                :date="statsYmd"
                :count="formatNumber(roadNmAddrRegionTotalCnt)"
                :options="['차트', '도표', '지도']"
                downloadPath="체크완료"
                v-model:selectChart="selectChartRoadNmAddrRegion"
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'roadNameAddr', 'region')"
                @updateMapType="(newChartType) => handleMapChartTypeChange(newChartType, 'roadNameAddr', 'region')"
                @radioChart="(newChartType) => handleRadioClick('roadNameAddr', 'region', newChartType)"
                @downloadExcel="fnRoadNmRegionExcelDwnld"
                prefix="chart5"
                :isLoadingBar="isMapLoading.mapChart04"
            >
                <template v-slot:classification>
                    <div class="chartFormDropdown">
                        <label for="test2">시/도</label>
                        <CustomDropdown inputId="test2" @click.stop @change="fnSelectSig('roadNameAddr', 'region', 'sido', roadNmAddrRegionSelectedItem01, '')" :options="detailAddrSidoCdSelectReg" v-model="roadNmAddrRegionSelectedItem01" title="시/도 선택" :placeholder="detailAddrSidoCdSelectReg[0]?.label" />
                    </div>
                    <div class="chartFormDropdown">
                        <label for="test1">시/군/구</label>
                        <CustomDropdown inputId="test1" @click.stop @change="fnSelectSig('roadNameAddr', 'region', 'sig', roadNmAddrRegionSelectedItem01, roadNmAddrRegionSelectedItem02)" :options="roadNmAddrSigSelectRegRegion" v-model="roadNmAddrRegionSelectedItem02" title="시/군/구 선택" placeholder="전체"/>
                    </div>
                </template>
                <template v-slot:setBarChartX>
                    <div id="barChart5" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart5" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart5" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
<!--                    <div class="common__box infographic__box">-->
                    	<DataTable 
			                class="tableStyle02"
			                :value="roadNmAddrRegionColumns"
			                ref="dataTableRef05"
			            >
			                <Column style="width:10%;" header="연번" field="roadNmAddrRegionRnum" />
			                <Column header="구분" field="roadNmAddrRegionKorNm" />
			                <Column header="도로명주소수" field="roadNmAddrRegionCnt" />
			            </DataTable>
<!--                    </div>-->
                </template>
                <template v-slot:mapColorChart>
                    <div id="mapChart8" style="width: 100%; height: 500px;"></div>
                </template>
                <template v-slot:mapBubbleChart>
                    <div id="mapChart8" style="width: 100%; height: 500px;"></div>
                </template>
            </AddressInfo>
        </div>
        <div class="common__box">
            <AddressInfo 
            	job="도로명주소"
                title="부여시기별 현황"
                subtitle="시도,시군구별 도로명주소 현황을 확인할 수 있습니다."
                :date="roadNmAddrPeriodYmd"
                :count="formatNumber(roadNmAddrPeriodTotalCnt)"
                :options="['차트', '도표', '지도']"
                v-model:selectChart="selectChartRoadNmAddrPeriod"
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'roadNameAddr', 'period')"
                @updateMapType="(newChartType) => handleMapChartTypeChange(newChartType, 'roadNameAddr', 'period')"
                @radioChart="(newChartType) => handleRadioClick('roadNameAddr', 'period', newChartType)"
                downloadPath="체크완료"
                @downloadExcel="fnRoadNmPeriodExcelDwnld"
                prefix="chart6"
                :isLoadingBar="isMapLoading.mapChart05"
            >
                <template v-slot:classification>
                	<div class="chartFormDropdown">
                        <label for="test3">부여시기</label>
                        <CustomDropdown inputId="test3" @click.stop @change="fnSelectSig('roadNameAddr', 'period', '', roadNmAddrPeriodSelectedItem01, roadNmAddrPeriodSelectedItem02)" :options="jusoStatsYmAuth" v-model="roadNmAddrPeriodYear" title="부여시기 선택" :placeholder="jusoStatsYmAuth[0]?.label" />
                    </div>
                    <div class="chartFormDropdown">
                        <label for="test2">시/도</label>
                        <CustomDropdown inputId="test2" @click.stop @change="fnSelectSig('roadNameAddr', 'period', 'sido', roadNmAddrPeriodSelectedItem01, '')" :options="detailAddrSidoCdSelectReg" v-model="roadNmAddrPeriodSelectedItem01" title="시/도 선택" :placeholder="detailAddrSidoCdSelectReg[0]?.label" />
                    </div>
                    <div class="chartFormDropdown">
                        <label for="test1">시/군/구</label>
                        <CustomDropdown inputId="test1" @click.stop @change="fnSelectSig('roadNameAddr', 'period', 'sig', roadNmAddrPeriodSelectedItem01, roadNmAddrPeriodSelectedItem02)" :options="roadNmAddrSigSelectRegPeriod" v-model="roadNmAddrPeriodSelectedItem02" title="시/군/구 선택" placeholder="전체" />
                    </div>
                </template>
                <template v-slot:setBarChartX>
                    <div id="barChart6" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart6" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart6" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
                    <DataTable 
			                class="tableStyle02"
			                :value="roadNmAddrPeriodColumns"
			                ref="dataTableRef06"
			            >
			                <Column style="width:10%;" header="연번" field="roadNmAddrPeriodRnum" />
			                <Column header="구분" field="roadNmAddrPeriodKorNm" />
			                <Column header="도로명주소수" field="roadNmAddrPeriodCnt" />
			            </DataTable>
                </template>
                <template v-slot:mapColorChart>
                    <div id="mapChart9" style="width: 100%; height: 500px;"></div>
                </template>
                <template v-slot:mapBubbleChart>
                    <div id="mapChart9" style="width: 100%; height: 500px;"></div>
                </template>
            </AddressInfo>
        </div>
    </div>
    <div v-show="active === 2">
        <div class="common__box roadName">
            <div class="roadName__basic">
                <img class="commonPc" src="@images/story/pc/img_roadName03.png" alt="도로에 이름을 붙이고 주택·건물에는 도로를 따라 순차적으로 번호를 붙여 도로명과 건물번호에 의해 표기" />
                <img class="commonMo" src="@images/story/mo/img_roadName03.png" alt="도로에 이름을 붙이고 주택·건물에는 도로를 따라 순차적으로 번호를 붙여 도로명과 건물번호에 의해 표기" />
            </div>
            <div class="roadName__details">
                <div class="roadName__date">
                    <span class="commonBullet">※</span> 기준일 : {{statsYmd}}
                </div>
                <div class="roadName__box">
                    <dl class="roadName__counting">
                        <dt>상세주소 수</dt>
                        <dd class="type01">{{bdtyp00Cnt}}</dd>
                    </dl>
                    <p class="roadName__text">도로명주소의 건물번호 뒤에 표시하는 동, 층, 호를 말하며,<br />아라비아 숫자를 일련번호로 부여하거나 한글을 이용합니다.<br />(101동,102동,103동.../가동,나동,다동)</p>
                    <ul class="roadName__list">
                        <li>
                            <p class="roadName__subText">단독<span class="commonColor01">(316)</span> </p>
                        </li>
                        <li>
                            <p class="roadName__subText">다가구<span class="commonColor01">(16,788)</span></p>
                        </li>
                        <li>
                            <p class="roadName__subText">근린생활시설<span class="commonColor01">(16,788)</span></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="common__box">
            <AddressInfo 
            	job="상세주소"
                title="지역별 현황"
                subtitle="시도,시군구별 상세주소 현황을 확인할 수 있습니다."
                :date="statsYmd"
                :count="formatNumber(detailAddrTotalCnt)"
                :options="['차트', '도표', '지도']"
                v-model:selectChart="selectChartDetailAddr"
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'detailAddr', 'region')"
                @updateMapType="(newChartType) => handleMapChartTypeChange(newChartType, 'detailAddr', 'region')"
                @radioChart="(newChartType) => handleRadioClick('detailAddr', 'region', newChartType)"
                downloadPath="체크완료"
                @downloadExcel="fnDetailAddrExcelDwnld"
                prefix="chart7"
                :isLoadingBar="isMapLoading.mapChart06"
            >
                <template v-slot:classification>
                    <div class="chartFormDropdown">
                        <label for="test1">부여 건물 유형</label>
                        <CustomDropdown inputId="test1" @click.stop @change="handleDropdownChange('detailAddr', 'region', selectOption)" :options="bdtypCd" v-model="detailAddrSelectedItem01" title="부여 건물 유형 선택" :placeholder="bdtypCd[0]?.label" />
                    </div>
                    <div class="chartFormDropdown">
                        <label for="test2">시/도</label>
                        <CustomDropdown inputId="test2" @click.stop @change="handleDropdownChange('detailAddr', 'region', selectOption)" :options="detailAddrSidoCdSelectReg" v-model="detailAddrSelectedItem02" title="시/도 선택" :placeholder="detailAddrSidoCdSelectReg[0]?.label" />
                    </div>
                </template>
                <template v-slot:setBarChartX>
                    <div id="barChart7" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart7" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart7" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
<!--                    <div class="common__box infographic__box">-->
                    	<DataTable 
			                class="tableStyle02"
			                :value="detailAddrColumns"
			                ref="dataTableRef07"
			            >
			                <Column style="width:10%;" header="시도" field="detailAddrKorNm" />
			                <Column header="단독" field="detailAddrBdtyp01" />
			                <Column header="다가구" field="detailAddrBdtyp02" />
			                <Column header="근린생활시설" field="detailAddrBdtyp03" />
			            </DataTable>
<!--                    </div>-->
                </template>
                <template v-slot:mapColorChart>
                    <div id="mapChart6" style="width: 100%; height: 500px;"></div>
                </template>
                <template v-slot:mapBubbleChart>
                    <div id="mapChart6" style="width: 100%; height: 500px;"></div>
                </template>
            </AddressInfo>
        </div>
    </div>
    <div v-show="active === 3">
        <div class="common__box roadName">
            <ul class="roadName__map">
                <li>
                    <button class="region__button seoul" title="" @click="basMapChoice('bas', 'region', '11')">
                        <span class="region__name">서울</span>
                        <span class="region__number">01-09</span>
                    </button>
                </li>
                <li>
                    <button class="region__button gyeonggi" title="" @click="basMapChoice('bas', 'region', '41')">
                        <span class="region__name">경기</span>
                        <span class="region__number">10-20</span>
                    </button>
                </li>
                <li>
                    <button class="region__button incheon" title="" @click="basMapChoice('bas', 'region', '28')">
                        <span class="region__name">인천</span>
                        <span class="region__number">21-23</span>
                    </button>
                </li>
                <li>
                    <button class="region__button gangwon" title="" @click="basMapChoice('bas', 'region', '51')">
                        <span class="region__name">강원</span>
                        <span class="region__number">24-26</span>
                    </button>
                </li>
                <li>
                    <button class="region__button chungbuk" title="" @click="basMapChoice('bas', 'region', '43')">
                        <span class="region__name">충북</span>
                        <span class="region__number">27-29</span>
                    </button>
                </li>
                <li>
                    <button class="region__button sejong" title="" @click="basMapChoice('bas', 'region', '36')">
                        <span class="region__name">세종</span>
                        <span class="region__number">30</span>
                    </button>
                </li>
                <li>
                    <button class="region__button chungnam" title="" @click="basMapChoice('bas', 'region', '44')">
                        <span class="region__name">충남</span>
                        <span class="region__number">31-33</span>
                    </button>
                </li>
                <li>
                    <button class="region__button daejeon" title="" @click="basMapChoice('bas', 'region', '30')">
                        <span class="region__name">대전</span>
                        <span class="region__number">34-35</span>
                    </button>
                </li>
                <li>
                    <button class="region__button gyeongbuk" title="" @click="basMapChoice('bas', 'region', '47')">
                        <span class="region__name">경북</span>
                        <span class="region__number">36-40</span>
                    </button>
                </li>
                <li>
                    <button class="region__button daegu" title="" @click="basMapChoice('bas', 'region', '27')">
                        <span class="region__name">대구</span>
                        <span class="region__number">41-43</span>
                    </button>
                </li>
                <li>
                    <button class="region__button ulsan" title="" @click="basMapChoice('bas', 'region', '31')">
                        <span class="region__name">울산</span>
                        <span class="region__number">44-45</span>
                    </button>
                </li>
                <li>
                    <button class="region__button busan" title="" @click="basMapChoice('bas', 'region', '26')">
                        <span class="region__name">부산</span>
                        <span class="region__number">46-49</span>
                    </button>
                </li>
                <li>
                    <button class="region__button gyeongnam" title="" @click="basMapChoice('bas', 'region', '48')">
                        <span class="region__name">경남</span>
                        <span class="region__number">50-53</span>
                    </button>
                </li>
                <li>
                    <button class="region__button jeonbuk" title="" @click="basMapChoice('bas', 'region', '52')">
                        <span class="region__name">전북</span>
                        <span class="region__number">54-56</span>
                    </button>
                </li>
                <li>
                    <button class="region__button jeonnam" title="" @click="basMapChoice('bas', 'region', '46')">
                        <span class="region__name">전남</span>
                        <span class="region__number">57-60</span>
                    </button>
                </li>
                <li>
                    <button class="region__button gwangju" title="" @click="basMapChoice('bas', 'region', '29')">
                        <span class="region__name">광주</span>
                        <span class="region__number">61-62</span>
                    </button>
                </li>
                <li>
                    <button class="region__button jeju" title="" @click="basMapChoice('bas', 'region', '50')">
                        <span class="region__name">제주</span>
                        <span class="region__number">63</span>
                    </button>
                </li>
            </ul>
            <div class="roadName__details">
                <div class="roadName__date">
                    <span class="commonBullet">※</span> 기준일 : {{statsYmd}}
                </div>
                <div class="roadName__box">
                    <dl class="roadName__counting">
                        <dt>기초구역 수</dt>
                        <dd class="type03">{{basTotCo}}</dd>
                    </dl>
                    <p class="roadName__title">기초구역번호란?</p>
                    <p class="roadName__text">
                        우체국,경찰서,소방서 등 일반에 공표하는 각종 구역의 기본 단위로 공동 활용하고자<br />
                        국토를 일정한 단위로 구획한 제도 입니다.<br />
                        하나의 시·군·구 내의 도로,하천,철도와 같이 자주 변하지 않는 지형지물을 기준으로<br />
                        행정구역(읍면동)보다 작은 규모의 동일 생활권으로 구획합니다.
                    </p>
                    <div class="roadName__image">
                        <img class="commonPc" src="@images/story/pc/img_map01.png" alt="기초구역번호는 우편번호로 사용됩니다. 1번째 2번째는 특별(광역)시·도 3번째는 시·군·구 4번째 5번째는 일련번호입니다. 2015년 8월부터 새우편번호(5자리)로 활용중입니다." />
                        <img class="commonMo" src="@images/story/mo/img_map01.png" alt="기초구역번호는 우편번호로 사용됩니다. 1번째 2번째는 특별(광역)시·도 3번째는 시·군·구 4번째 5번째는 일련번호입니다. 2015년 8월부터 새우편번호(5자리)로 활용중입니다." />
                    </div>
                </div>
            </div>
        </div>

        <div class="common__box">
            <AddressInfo 
            	job="기초구역"
                title="지역별 현황"
                subtitle="시도,시군구별 기초구역 현황을 확인할 수 있습니다."
                :date="statsYmd"
                :count="formatNumber(basTotalCnt)"
                :options="['차트', '도표', '지도']"
                v-model:selectChart="selectChartbas"
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'bas', 'region')"
                @updateMapType="(newChartType) => handleMapChartTypeChange(newChartType, 'bas', 'region')"
                @radioChart="(newChartType) => handleRadioClick('bas', 'region', newChartType)"
                downloadPath="체크완료"
                @downloadExcel="fnBasExcelDwnld"
                prefix="chart8"
                :isLoadingBar="isMapLoading.mapChart07"
            >
                <template v-slot:classification>
                    <div class="chartFormDropdown">
                        <label for="test2">시/도</label>
                        <CustomDropdown inputId="test2" @click.stop @change="handleDropdownChange('bas', 'region', selectOption)" :options="detailAddrSidoCdSelectReg" v-model="basSelectedItem01" title="시/도 선택" :placeholder="detailAddrSidoCdSelectReg[0]?.label" />
                    </div>
                </template>
                <template v-slot:setBarChartX>
                    <div id="barChart8" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart8" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart8" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
<!--                    <div class="common__box infographic__box">-->
                    	<DataTable 
			                class="tableStyle02"
			                :value="basColumns"
			                ref="dataTableRef08"
			            >
			                <Column style="width:10%;" header="연번" field="basRnum" />
			                <Column header="구분" field="basKorNm" />
			                <Column header="기초구역수" field="basCnt" />
			            </DataTable>
<!--                    </div>-->
                </template>
                <template v-slot:mapColorChart>
                    <div id="mapChart7" style="width: 100%; height: 500px;"></div>
                </template>
                <template v-slot:mapBubbleChart>
                    <div id="mapChart7" style="width: 100%; height: 500px;"></div>
                </template>
            </AddressInfo>
        </div>
    </div>
    <div v-show="active === 4">
        <div class="common__box roadName">
            주소정보이용추이 - 이미지 에셋 등록이 안되어 이후 작업예정
        </div>
		<div class="common__box">
            <AddressInfo 
                title="주소정보 다운로드"
                subtitle="주소정보 다운로드 현황을 확인할 수 있습니다."
                :options="['차트', '도표', '지도']"
                downloadPath="체크완료"
                v-model:selectChart="selectChartDbAddrInfo" 
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'db', 'addrInfo')"
                @radioChart="(newChartType) => handleRadioClick('db', 'addrInfo', newChartType)"
                @downloadExcel="fnRegionExcelDwnld"
                prefix="chart9"
            >
                <template v-slot:classification>
                    <div class="chartFormDropdown">
                        <label for="test1">기준년도</label>
                        <CustomDropdown @click.stop @change="handleDropdownChange('db', 'addrInfo', selectOption)" inputId="test1" :options="dbYmList" v-model="dbAddrInfoSelectedItem01" title="기준년도 선택" :placeholder="dbYmList[0]?.label" />
                    </div>
                    <div class="chartFormDropdown">
                        <label for="test2">종류</label>
                        <CustomDropdown @click.stop @change="handleDropdownChange('db', 'addrInfo', selectOption)" inputId="test2" :options="dbAddrInfoType" v-model="dbAddrInfoSelectedItem02" title="종류 선택" :placeholder="dbAddrInfoType[0]?.label" />
                    </div>
                </template>
                <template v-slot:setBarChartX>
                    <div id="barChart9" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart9" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart9" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
<!--                    <div class="common__box infographic__box">-->
                    	<DataTable 
			                class="tableStyle02"
			                :value="dbAddrInfoColumns"
			                ref="dataTableRef09"
			            >
			                <Column style="width:10%;" header="연번" field="dbAddrInfoRnum" />
			                <Column header="구분" field="dbAddrInfoKndNm" />
			                <Column header="다운로드수" field="dbAddrInfoCnt" />
			            </DataTable>
<!--                    </div>-->
                </template>
            </AddressInfo>
        </div>
        <div class="common__box">
            <AddressInfo 
                title="지도(공간)정보 다운로드 현황"
                subtitle="지도(공간)정보 다운로드 현황을 확인할 수 있습니다."
                :options="['차트', '도표', '지도']"
                downloadPath="체크완료"
                v-model:selectChart="selectChartmapInfo"
                v-model:selectOption="selectOption"
                @update:selectChart="(newChartType) => handleChartTypeChange(newChartType, 'db', 'mapInfo')"
                @radioChart="(newChartType) => handleRadioClick('db', 'mapInfo', newChartType)"
                @downloadExcel="fnReasonExcelDwnld"
                prefix="chart10"
            >
                <template v-slot:classification>
                    <div class="chartFormDropdown">
                        <label for="test1">기준년도</label>
                        <CustomDropdown @click.stop @change="handleDropdownChange('db', 'mapInfo', selectOption)" inputId="test1" :options="dbYmList" v-model="dbMapInfoSelectedItem01" title="기준년도 선택" :placeholder="dbYmList[0]?.label" />
                    </div>
                    <div class="chartFormDropdown">
                        <label for="test2">종류</label>
                        <CustomDropdown @click.stop @change="handleDropdownChange('db', 'mapInfo', selectOption)" inputId="test2" :options="dbMapInfoType" v-model="dbMapInfoSelectedItem02" title="종류 선택" :placeholder="dbMapInfoType[0]?.label" />
                    </div>
                </template>
                <template v-slot:setBarChartX>
                	<div id="barChart10" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setBarChartY>
                    <div id="barChart10" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:setDoughnutChart>
                    <div id="barChart10" style="width: 100%; height: 500%;"></div>
                </template>
                <template v-slot:grid>
<!--                    <div class="common__box infographic__box">-->
                    	<DataTable 
			                class="tableStyle02"
			                :value="dbMapInfoColumns"
			                ref="dataTableRef10"
			            >
			                <Column style="width:10%;" header="연번" field="dbMapInfoRnum" />
			                <Column header="구분" field="dbMapInfoKndNm" />
			                <Column header="다운로드수" field="dbMapInfoCnt" />
			            </DataTable>
<!--                    </div>-->
                </template>
            </AddressInfo>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import Breadcrumb from 'primevue/breadcrumb'
import TabMenu from 'primevue/tabmenu'
import Chart from 'primevue/chart'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import HeaderTitle from '@/components/title/HeaderTitle.vue';
import CustomDropdown from '@/components/dropdown/CustomDropdown.vue';
import AddressInfo from '@/components/address_statis/AddressInfo.vue';
import axios from 'axios';
import qs from 'qs';
import * as echarts from 'echarts';
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";

const active =ref(0);
const tabItems = ref([
    {label:'도로명', route: '/conversion/AddressTransform'},
    {label:'도로명주소', route: '/conversion/AddressTransform'},
    {label:'상세주소', route: '/conversion/AddressTransform'},
    {label:'기초구역', route: '/conversion/AddressTransform'},
    //{label:'주소정보 이용추이', route: '/conversion/AddressTransform'},
]);

const onTabChange = async (e) => {
    active.value = e.index;
    if(active.value === 0) {
    	fnRoadNum();
    	await fnGraphStatusRegionData('roadName', 'region', selectedItem01.value.value, selectedItem02.value.value);
    	await fnGraphStatusReasonData('roadName', 'reason', roadNmReasonSelectedItem01.value.value, roadNmReasonSelectedItem02.value.value);
    	await fnGraphStatusRoadTypeData('roadName', 'roadType', roadNmTypeSelectedItem01.value.value, roadNmTypeSelectedItem02.value.value);
    	await fnGraphStatusSameRoadNmData('roadName', 'sameRoadNm');
    } else if(active.value === 1) {
    	fnRoadAddrNum();
    	console.log("roadNmAddrRegionSelectedItem01.value : ", roadNmAddrRegionSelectedItem01.value.value);
    	console.log("roadNmAddrRegionSelectedItem02.value : ", roadNmAddrRegionSelectedItem02.value.value);
    	selectOption = "차트";
    	await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
    	await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
    } else if(active.value === 2) {
    	fnDetailAddrNum();
    	selectOption = "차트";
    	await fnGraphStatusDetailAddrData('detailAddr', 'region', detailAddrSelectedItem01.value.value, detailAddrSelectedItem02.value.value);
    } else if(active.value === 3) {
    	fnBasNum();
    	selectOption = "차트";
    	await fnGraphStatusBasData('bas', 'region', basSelectedItem01.value.value);
    } else if(active.value === 4) {
    	selectOption = "차트";
    	//await fnGraphStatusDbAddrInfoData('db', 'addrInfo', dbAddrInfoSelectedItem01.value.value, dbAddrInfoSelectedItem02.value.value);
    	//await fnGraphStatusDbMapInfoData('db', 'mapInfo', dbMapInfoSelectedItem01.value.value, dbMapInfoSelectedItem02.value.value);
    }
}

//차트 초기값
const selectChartRegion = ref('setBarChartX');
const selectChartReason = ref('setBarChartX');
const selectChartRoadType = ref('setBarChartX');
const selectChartSameRoadNm = ref('setBarChartX');
const selectChartDetailAddr = ref('setBarChartX');
const selectChartbas = ref('setBarChartX');
const selectChartRoadNmAddrRegion = ref('setBarChartX');
const selectChartRoadNmAddrPeriod = ref('setBarChartX');
const selectChartDbAddrInfo = ref('setBarChartX');
const selectChartDbMapInfo = ref('setBarChartX');

//맵차트 초기값
const selectMapChartRegion = ref('mapColorChart');
const selectMapChartReason = ref('mapColorChart');
const selectMapChartRoadType = ref('mapColorChart');
const selectMapChartRoadNmAddrRegion = ref('mapColorChart');
const selectMapChartDetailAddr = ref('mapColorChart');
const selectMapChartRoadNmAddrPeriod = ref('mapColorChart');
const selectMapChartbas = ref('mapColorChart');

// 맵차트 로딩값
const isMapLoading = reactive({
  mapChart01 : false, // 도로명(지역별)
  mapChart02 : false, // 도로명(부여사유별)
  mapChart03 : false, // 도로명(위계별)
  mapChart04 : false, // 도로명주소(지역별)
  mapChart05 : false, // 도로명주소(부여시기별)
  mapChart06 : false, // 상세주소(지역별)
  mapChart07 : false, // 기초구역(지역별)
});

//기준일
const statsYmd = ref('');

//컬럼
const regionColumns = ref([]);
const reasonColumns = ref([]);
const roadTypeColumns = ref([]);
const sameRoadNmColumns = ref([]);
const detailAddrColumns = ref([]);
const basColumns = ref([]);
const roadNmAddrRegionColumns = ref([]);
const roadNmAddrPeriodColumns = ref([]);
const dbAddrInfoColumns = ref([]);
const dbMapInfoColumns = ref([]);

//도로명 - 지역별 현황 v-model
const selectedItem01 = ref('');
const selectedItem02 = ref('');
//도로명 - 부여사유별 현황 v-model
const roadNmReasonSelectedItem01 = ref('');
const roadNmReasonSelectedItem02 = ref('');
//도로명 - 위계별 현황 v-model
const roadNmTypeSelectedItem01 = ref('');
const roadNmTypeSelectedItem02 = ref('');

//도로명주소 - 지역별 현황 v-model
const roadNmAddrRegionSelectedItem01 = ref('');
const roadNmAddrRegionSelectedItem02 = ref('');
//도로명주소 - 부여시기별 현황 v-model
const roadNmAddrPeriodYear = ref('');
const roadNmAddrPeriodSelectedItem01 = ref('');
const roadNmAddrPeriodSelectedItem02 = ref('');

//상세주소 - 지역별 현황 v-model
const detailAddrSelectedItem01 = ref('');
const detailAddrSelectedItem02 = ref('');

//기초구역 - 지역별 현황 v-model
const basSelectedItem01 = ref('');
const basSelectedItem02 = ref('');

//주소정보이용추이 - 주소정보 다운로드 v-model
const dbAddrInfoSelectedItem01 = ref('');
const dbAddrInfoSelectedItem02 = ref('');

//주소정보이용추이 - 지도(공간)정보 다운로드 v-model
const dbMapInfoSelectedItem01 = ref('');
const dbMapInfoSelectedItem02 = ref('');

//도표
const dataTableRef01 = ref(null);
const dataTableRef02 = ref(null);
const dataTableRef03 = ref(null);
const dataTableRef04 = ref(null);
const dataTableRef05 = ref(null);
const dataTableRef06 = ref(null);
const dataTableRef07 = ref(null);
const dataTableRef08 = ref(null);
const dataTableRef09 = ref(null);
const dataTableRef10 = ref(null);

//--------------------------도로명
//1. 도로명
let roa00 = ref('');
let roa01 = ref('');
let roa02 = ref('');
let roa03 = ref('');
let roa04 = ref('');
//1-1. 지역별
const roadNmstatsYmd = ref('');
const roadNmCnt = ref('');
const roadNmTotalCnt = ref(0);
const roadNmRnum = ref('');
const roadNmAdmCd = ref('');
const roadNmKorNm = ref('');
//1-2. 부여사유별
const roadNmReasonCnt = ref('');
const roadNmReasonTotalCnt = ref(0);
const roadNmReasonRnum = ref('');
const roadNmReasonAdmCd = ref('');
const roadNmReasonKorNm = ref('');
const roadNmReg0410 = ref('');
const roadNmReg0420 = ref('');
const roadNmReg0440 = ref('');
const roadNmReg0450 = ref('');
const roadNmReg0499 = ref('');
const roadNmTotalReg0410 = ref('');
const roadNmTotalReg0420 = ref('');
const roadNmTotalReg0440 = ref('');
const roadNmTotalReg0450 = ref('');
const roadNmTotalReg0499 = ref('');
//1-3. 위계별
const roadNmTypeCnt = ref('');
const roadNmTypeTotalCnt = ref(0);
const roadNmTypeRnum = ref('');
const roadNmTypeAdmCd = ref('');
const roadNmTypeKorNm = ref('');
const roadNmTypeRoa01 = ref('');
const roadNmTypeRoa02 = ref('');
const roadNmTypeRoa03 = ref('');
const roadNmTypeRoa04 = ref('');
const roadNmTypeTotalRoa01 = ref('');
const roadNmTypeTotalRoa02 = ref('');
const roadNmTypeTotalRoa03 = ref('');
const roadNmTypeTotalRoa04 = ref('');
//1-4. 같은도로명
const roadNmSameCnt = ref('');
const roadNmSameTotalCnt = ref(0);
const roadNmSameRnum = ref('');
const roadNmSameKorNm = ref('');

//도로명 - 시도
const roadSidoCdSelectReg = ref([
    {label:'전체', value:''},
    {label:'행정안전부', value:'00'},
    {label:'서울특별시', value:'11'},
    {label:'부산광역시', value:'26'},
    {label:'대구광역시', value:'27'},
    {label:'인천광역시', value:'28'},
    {label:'광주광역시', value:'29'},
    {label:'대전광역시', value:'30'},
    {label:'울산광역시', value:'31'},
    {label:'세종특별자치시', value:'36'},
    {label:'경기도', value:'41'},
    {label:'강원특별자치도', value:'51'},
    {label:'충청북도', value:'43'},
    {label:'충청남도', value:'44'},
    {label:'전북특별자치도', value:'52'},
    {label:'전라남도', value:'46'},
    {label:'경상북도', value:'47'},
    {label:'경상남도', value:'48'},
    {label:'제주특별자치도', value:'50'},
]);

const roadSidoCdSelectRegReason = ref([
    {label:'전체', value:''},
    {label:'행정안전부', value:'00'},
    {label:'서울특별시', value:'11'},
    {label:'부산광역시', value:'26'},
    {label:'대구광역시', value:'27'},
    {label:'인천광역시', value:'28'},
    {label:'광주광역시', value:'29'},
    {label:'대전광역시', value:'30'},
    {label:'울산광역시', value:'31'},
    {label:'세종특별자치시', value:'36'},
    {label:'경기도', value:'41'},
    {label:'강원특별자치도', value:'51'},
    {label:'충청북도', value:'43'},
    {label:'충청남도', value:'44'},
    {label:'전북특별자치도', value:'52'},
    {label:'전라남도', value:'46'},
    {label:'경상북도', value:'47'},
    {label:'경상남도', value:'48'},
    {label:'제주특별자치도', value:'50'},
]);

const roadSidoCdSelectRegRoadType = ref([
    {label:'전체', value:''},
    {label:'행정안전부', value:'00'},
    {label:'서울특별시', value:'11'},
    {label:'부산광역시', value:'26'},
    {label:'대구광역시', value:'27'},
    {label:'인천광역시', value:'28'},
    {label:'광주광역시', value:'29'},
    {label:'대전광역시', value:'30'},
    {label:'울산광역시', value:'31'},
    {label:'세종특별자치시', value:'36'},
    {label:'경기도', value:'41'},
    {label:'강원특별자치도', value:'51'},
    {label:'충청북도', value:'43'},
    {label:'충청남도', value:'44'},
    {label:'전북특별자치도', value:'52'},
    {label:'전라남도', value:'46'},
    {label:'경상북도', value:'47'},
    {label:'경상남도', value:'48'},
    {label:'제주특별자치도', value:'50'},
]);



// 기준년월
const roadStatsYmSelectReg = ref([]);

// 도로명 - 부여사유
const roadNmChoiceStatsCdAuth = ref([
    {label:'전체', value:''},
    {label:'지명·자연마을이름', value:'10'},
    {label:'행정구역 명칭', value:'20'},
    {label:'역사적인물·기념', value:'40'},
    {label:'문화재·유적', value:'50'},
    {label:'기타', value:'99'},
]);

// 도로명 - 위계구분
const roadTypeCd = ref([
    {label:'전체', value:''},
    {label:'고속도로', value:'1'},
    {label:'대로', value:'2'},
    {label:'로', value:'3'},
    {label:'길', value:'4'},
]);

//--------------------------도로명주소
//2. 도로명주소
let totCo = ref('');
let lastCo = ref('');
let thisCo = ref('');
//시군구
const roadNmAddrSigSelectRegRegion = ref([]);
const roadNmAddrSigSelectRegPeriod = ref([]);
//부여시기
const jusoStatsYmAuth = ref([]);

//2.1 도로명주소 - 지역별
const roadNmAddrRegionRnum = ref('');
const roadNmAddrRegionAdmCd = ref('');
const roadNmAddrRegionKorNm = ref('');
const roadNmAddrRegionCnt = ref('');
const roadNmAddrRegionTotalCnt = ref('');
//2.2 도로명주소 - 부여시기별
const roadNmAddrPeriodYmd = ref('');
const roadNmAddrPeriodRnum = ref('');
const roadNmAddrPeriodAdmCd = ref('');
const roadNmAddrPeriodKorNm = ref('');
const roadNmAddrPeriodCnt = ref('');
const roadNmAddrPeriodTotalCnt = ref('');

//--------------------------상세주소
//3. 상세주소
let bdtyp00Cnt = ref('');
let bdtyp01Cnt = ref('');
let bdtyp02Cnt = ref('');
let bdtyp03Cnt = ref('');
//3.1 지역별
const detailAddrAdmCd = ref('');
const detailAddrKorNm = ref('');
const detailAddrCnt = ref('');
const detailAddrTotalCnt = ref('');
const detailAddrBdtyp01 = ref('');
const detailAddrBdtyp02 = ref('');
const detailAddrBdtyp03 = ref('');
const detailAddrTotalBdtyp01 = ref('');
const detailAddrTotalBdtyp02 = ref('');
const detailAddrTotalBdtyp03 = ref('');

//상세주소 - 부여 건물 유형
const bdtypCd = ref([
	{label:'전체', value:''},
    {label:'단독', value:'01000'},
    {label:'다가구', value:'01003'},
    {label:'근린생활시설', value:'03000'},
])
//상세주소 - 시도
const detailAddrSidoCdSelectReg = ref([
    {label:'전체', value:''},
    {label:'서울특별시', value:'11'},
    {label:'부산광역시', value:'26'},
    {label:'대구광역시', value:'27'},
    {label:'인천광역시', value:'28'},
    {label:'광주광역시', value:'29'},
    {label:'대전광역시', value:'30'},
    {label:'울산광역시', value:'31'},
    {label:'세종특별자치시', value:'36'},
    {label:'경기도', value:'41'},
    {label:'강원특별자치도', value:'51'},
    {label:'충청북도', value:'43'},
    {label:'충청남도', value:'44'},
    {label:'전북특별자치도', value:'52'},
    {label:'전라남도', value:'46'},
    {label:'경상북도', value:'47'},
    {label:'경상남도', value:'48'},
    {label:'제주특별자치도', value:'50'},
]);

//--------------------------기초구역
//4. 기초구역
let basTotCo = ref('');
//4.1 지역별
const basRnum = ref('');
const basAdmCd = ref('');
const basKorNm = ref('');
const basCnt = ref('');
const basTotalCnt = ref('');

//--------------------------주소정보 이용추이
//5. 주소정보 이용추이
const dbAddrInfoType = ref('');
const dbMapInfoType = ref('');
const dbYmList = ref('');
//5.1 주소정보 다운로드
const dbAddrInfoYmd = ref('');
const dbAddrInfoRnum = ref('');
const dbAddrInfoKnd = ref('');
const dbAddrInfoKndNm = ref('');
const dbAddrInfoCnt = ref('');
const dbAddrInfoTotalCnt = ref('');
//5.1 지도(공간)정보 다운로드
const dbMapInfoYmd = ref('');
const dbMapInfoRnum = ref('');
const dbMapInfoKnd = ref('');
const dbMapInfoKndNm = ref('');
const dbMapInfoCnt = ref('');
const dbMapInfoTotalCnt = ref('');

//숫자 변환
const formatNumber = (number) => {
	if (!number) return number;
	return Number(number).toLocaleString();
}

//조건 필터링
const handleDropdownChange = async (type1, type2, selectOption) => {
	if(type1 === 'roadName') {
		if(type2 === 'region') {
			console.log("드롭다운 selectOption", selectOption);
			const statsYm = selectedItem01.value.value || roadStatsYmSelectReg.value[0]?.value;
			const sidoCd = selectedItem02.value.value || roadSidoCdSelectReg.value[0]?.value;
			await fnGraphStatusRegionData(type1, type2, statsYm, sidoCd);
			if(selectOption === '지도') {
				fnMap(type1, type2, selectMapChartRegion.value);
			}
		} else if(type2 === 'reason') {
			const roadType = roadNmReasonSelectedItem01.value.value || roadNmChoiceStatsCdAuth.value[0]?.value;
			const sidoCd = roadNmReasonSelectedItem02.value.value || roadSidoCdSelectRegReason.value[0]?.value;
			await fnGraphStatusReasonData(type1, type2, roadType, sidoCd);
			if(selectOption === '지도') {
				fnMap(type1, type2, selectMapChartReason.value);
			}
		} else if(type2 === 'roadType') {
			const roadType = roadNmTypeSelectedItem01.value.value || roadTypeCd.value[0]?.value;
			const sidoCd = roadNmTypeSelectedItem02.value.value || roadSidoCdSelectRegRoadType.value[0]?.value;
			await fnGraphStatusRoadTypeData(type1, type2, roadType, sidoCd);
			if(selectOption === '지도') {
				fnMap(type1, type2, selectMapChartRoadType.value);
			}
		}  
	} else if(type1 === 'detailAddr') {
		if(type2 === 'region') {
			const bdtyp = detailAddrSelectedItem01.value.value || bdtypCd.value[0]?.value;
			const sidoCd = detailAddrSelectedItem02.value.value || detailAddrSidoCdSelectReg.value[0]?.value;
			await fnGraphStatusDetailAddrData(type1, type2, bdtyp, sidoCd);
			if(selectOption === '지도') {
				fnMap(type1, type2, selectMapChartDetailAddr.value);
			}
		}
	} else if(type1 === 'bas') {
		if(type2 === 'region') {
			const sidoCd = basSelectedItem01.value.value || detailAddrSidoCdSelectReg.value[0]?.value;
			await fnGraphStatusBasData(type1, type2, sidoCd);
			if(selectOption === '지도') {
				fnMap(type1, type2, selectMapChartbas.value);
			}
		}
	} else if(type1 === 'db') {
		if(type2 === 'addrInfo') {
			const statsYm = dbAddrInfoSelectedItem01.value.value || dbYmList.value[0]?.value;
			const statsCd = dbAddrInfoSelectedItem02.value.value || dbAddrInfoType.value[0]?.value;
			await fnGraphStatusDbAddrInfoData(type1, type2, statsYm, statsCd);
		} else if(type2 === 'mapInfo') {
			const statsYm = dbMapInfoSelectedItem01.value.value || dbYmList.value[0]?.value;
			const statsCd = dbMapInfoSelectedItem02.value.value || dbMapInfoType.value[0]?.value;
			await fnGraphStatusDbAddrInfoData(type1, type2, statsYm, statsCd);
		}
	}
}

//차트 타입 변경
const handleChartTypeChange = (newChartType, type1, type2) => {
	console.log("newChartType1 : ", newChartType);
	console.log("type1 : ", type1);
	console.log("type2 : ", type2);
	if(type1 === 'roadName') {
		if(type2 === 'region') {
			selectChartRegion.value = newChartType;
			fnGraphRegionStatus(type1, type2);
		} else if (type2 === 'reason') {
			selectChartReason.value = newChartType;
			fnGraphReasonStatus(type1, type2);
		} else if (type2 === 'roadType') {
			selectChartRoadType.value = newChartType;
			fnGraphRoadTypeStatus(type1, type2);
		} else if (type2 === 'sameRoadNm') {
			selectChartSameRoadNm.value = newChartType;
			fnGraphSameRoadNmStatus(type1, type2);
		}
	} else if(type1 === 'roadNameAddr') {
		if(type2 === 'region') {
			selectChartRoadNmAddrRegion.value = newChartType;
			fnGraphRoadNmAddrRegionStatus(type1, type2);
		} else if (type2 === 'period') {
			selectChartRoadNmAddrPeriod.value = newChartType;
			fnGraphRoadNmAddrPeriodStatus(type1, type2);
		}
	} else if(type1 === 'detailAddr') {
		if(type2 === 'region') {
			selectChartDetailAddr.value = newChartType;
			fnGraphDetailAddrStatus(type1, type2);
		}
	} else if(type1 === 'bas') {
		if(type2 === 'region') {
			selectChartbas.value = newChartType;
			fnGraphBasStatus(type1, type2);
		}
	} else if(type1 === 'db') {
		if(type2 === 'addrInfo') {
			selectChartDbAddrInfo.value = newChartType;
			fnGraphDbAddrInfoStatus(type1, type2);
		} else if(type2 === 'mapInfo') {
			selectChartDbMapInfo.value = newChartType;
			fnGraphDbMapInfoStatus(type1, type2);
		}
	}
}

//맵 타입 변경
const handleMapChartTypeChange = (newChartType, type1, type2) => {
	console.log("newChartType2 : ", newChartType);
	if(type1 === 'roadName') {
		if(type2 === 'region') {
			selectMapChartRegion.value = newChartType;
			fnMap(type1, type2, newChartType);
		} else if(type2 === 'reason') {
			selectMapChartReason.value = newChartType;
			fnMap(type1, type2, newChartType);
		}  else if(type2 === 'roadType') {
			selectMapChartRoadType.value = newChartType;
			fnMap(type1, type2, newChartType);
		} 
	} else if(type1 === 'roadNameAddr') {
		if(type2 === 'region') {
			selectMapChartRoadNmAddrRegion.value = newChartType;
			fnMap(type1, type2, newChartType);
		} else if(type2 === 'period') {
			selectMapChartRoadNmAddrPeriod.value = newChartType;
			fnMap(type1, type2, newChartType);
		}
	} else if(type1 === 'detailAddr') {
		if(type2 === 'region') {
			selectMapChartDetailAddr.value = newChartType;
			fnMap(type1, type2, newChartType);
		}
	} else if(type1 === 'bas') {
		if(type2 === 'region') {
			selectMapChartbas.value = newChartType;
			fnMap(type1, type2, newChartType);
		}
	}
}

let selectOption = '차트';

//라디오 버튼 클릭시 차트 호출
const handleRadioClick = async (type1, type2, select) => {
	console.log("####################################################################");
	console.log("type1, type2, select", type1, type2, select);
	console.log("####################################################################");
	selectOption = select;
	
	if(selectOption === '차트') {
		if(type1 === 'roadName') {
			if(type2 === 'region') {
				if(!roadSidoCdSelectReg.value.some(item => item.value === '00')) {
					console.log("!!!!!행정안전부");
					const entireIndex = roadSidoCdSelectReg.value.findIndex(item => item.value === '');
					if(entireIndex !== '-1') {
						roadSidoCdSelectReg.value.splice(entireIndex + 1, 0, {label: '행정안전부', value: '00'});
					} else {
						roadSidoCdSelectReg.value.unshift({label: '행정안전부', value: '00'});
					}
				} else if(!roadSidoCdSelectRegReason.value.some(item => item.value === '00')) {
					console.log("!!!!!행정안전부");
					const entireIndex = roadSidoCdSelectRegReason.value.findIndex(item => item.value === '');
					if(entireIndex !== '-1') {
						roadSidoCdSelectRegReason.value.splice(entireIndex + 1, 0, {label: '행정안전부', value: '00'});
					} else {
						roadSidoCdSelectRegReason.value.unshift({label: '행정안전부', value: '00'});
					}
				} else if(!roadSidoCdSelectRegRoadType.value.some(item => item.value === '00')) {
					console.log("!!!!!행정안전부");
					const entireIndex = roadSidoCdSelectRegRoadType.value.findIndex(item => item.value === '');
					if(entireIndex !== '-1') {
						roadSidoCdSelectRegRoadType.value.splice(entireIndex + 1, 0, {label: '행정안전부', value: '00'});
					} else {
						roadSidoCdSelectRegRoadType.value.unshift({label: '행정안전부', value: '00'});
					}
				}
				
				regionColumns.value = regionColumns.value.filter(item => item.roadNmKorNm !== 'TOTAL_CNT');
				console.log("regionColumns.value : ", regionColumns.value);
				fnGraphRegionStatus(type1, type2);
			} else if(type2 === 'reason') {
				reasonColumns.value = reasonColumns.value.filter(item => item.roadNmReasonKorNm !== 'TOTAL_CNT');
				fnGraphReasonStatus(type1, type2);
			} else if(type2 === 'roadType') {
				roadTypeColumns.value = roadTypeColumns.value.filter(item => item.roadNmTypeKorNm !== 'TOTAL_CNT');
				fnGraphRoadTypeStatus(type1, type2);
			} else if(type2 === 'sameRoadNm') {
				sameRoadNmColumns.value = sameRoadNmColumns.value.filter(item => item.roadNmSameKorNm !== 'TOTAL_CNT');
				fnGraphSameRoadNmStatus(type1, type2);
			}
		} else if(type1 === 'roadNameAddr') {
			if(type2 === 'region') {
				roadNmAddrRegionColumns.value = roadNmAddrRegionColumns.value.filter(item => item.roadNmAddrRegionKorNm !== 'TOTAL_CNT');
				fnGraphRoadNmAddrRegionStatus(type1, type2);
			} else if(type2 === 'period') {
				roadNmAddrPeriodColumns.value = roadNmAddrPeriodColumns.value.filter(item => item.roadNmAddrPeriodKorNm !== 'TOTAL_CNT');
				fnGraphRoadNmAddrPeriodStatus(type1, type2);
			}
		} else if(type1 === 'detailAddr') {
			if(type2 === 'region') {
				detailAddrColumns.value = detailAddrColumns.value.filter(item => item.detailAddrKorNm !== 'TOTAL_CNT');
				fnGraphDetailAddrStatus(type1, type2);
			}
		} else if(type1 === 'bas') {
			if(type2 === 'region') {
				basColumns.value = basColumns.value.filter(item => item.basKorNm !== 'TOTAL_CNT');
				fnGraphBasStatus(type1, type2);
			}
		} else if(type1 === 'db') {
			if(type2 === 'addrInfo') {
				dbAddrInfoColumns.value = dbAddrInfoColumns.value.filter(item => item.dbAddrInfoKndNm !== 'TOTAL_CNT');
				fnGraphDbAddrInfoStatus(type1, type2);
			} else if(type2 === 'mapInfo') {
				dbMapInfoColumns.value = dbMapInfoColumns.value.filter(item => item.dbMapInfoKndNm !== 'TOTAL_CNT');
				fnGraphDbMapInfoStatus(type1, type2);
			}
		}
	} else if(selectOption === '지도') {
		if(type1 === 'roadName') {
			if(type2 === 'region') { // 도로명(지역별)
				roadSidoCdSelectReg.value = roadSidoCdSelectReg.value.filter(item => item.value !== '00');
				regionColumns.value = regionColumns.value.filter(item => item.roadNmKorNm !== 'TOTAL_CNT');
				//await fnGraphRegionStatus(type1, type2);
        isMapLoading.mapChart01 = true;
				if(!selectedItem02.value) {
					selectedItem02.value = {label: "전체", value: ""};
					isDataLoaded = false;
					fnMapStatus(type1, type2, '');
				} else {
					isDataLoaded = false
					fnMapStatus(type1, type2, selectedItem02.value.value);
				}
			} else if(type2 === 'reason') { // 도로명(부여사유별)
				console.log("부여사유 지도 라디오 버튼 클릭")
				roadSidoCdSelectRegReason.value = roadSidoCdSelectRegReason.value.filter(item => item.value !== '00');
				reasonColumns.value = reasonColumns.value.filter(item => item.roadNmReasonKorNm !== 'TOTAL_CNT');
				//await fnGraphReasonStatus(type1, type2);
        isMapLoading.mapChart02 = true;
				if(!roadNmReasonSelectedItem02.value) {
					roadNmReasonSelectedItem02.value = {label: "전체", value: ""};
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				} else {
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmReasonSelectedItem02.value.value);
				}
			} else if(type2 === 'roadType') { // 도로명(위계별)
				roadSidoCdSelectRegRoadType.value = roadSidoCdSelectRegRoadType.value.filter(item => item.value !== '00');
				roadTypeColumns.value = roadTypeColumns.value.filter(item => item.roadNmTypeKorNm !== 'TOTAL_CNT');
				//await fnGraphRoadTypeStatus(type1, type2);
        isMapLoading.mapChart03 = true;
				if(!roadNmTypeSelectedItem02.value) {
					roadNmTypeSelectedItem02.value = {label: "전체", value: ""};
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				} else {
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmTypeSelectedItem02.value.value);
				}
			}
		} else if(type1 === 'roadNameAddr') {
			if(type2 === 'region') { // 도로명주소(지역별)
				roadNmAddrRegionColumns.value = roadNmAddrRegionColumns.value.filter(item => item.roadNmAddrRegionKorNm !== 'TOTAL_CNT');
				//await fnGraphRoadNmAddrRegionStatus(type1, type2);
        isMapLoading.mapChart04 = true;
				if(!roadNmAddrRegionSelectedItem01.value) {
					console.log("전체");
					roadNmAddrRegionSelectedItem01.value = {label: "전체", value: ""};
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				} else if(roadNmAddrRegionSelectedItem01.value && !roadNmAddrRegionSelectedItem02.value) {
					console.log("시도 선택시");
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrRegionSelectedItem01.value.value);
				} else if(roadNmAddrRegionSelectedItem01.value && roadNmAddrRegionSelectedItem02.value) {
					console.log("시군구 선택시");
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrRegionSelectedItem02.value.value);
				}
			} else if(type2 === 'period') { // 도로명주소(부여시기별)
				roadNmAddrPeriodColumns.value = roadNmAddrPeriodColumns.value.filter(item => item.roadNmAddrPeriodKorNm !== 'TOTAL_CNT');
				//await fnGraphRoadNmAddrPeriodStatus(type1, type2);
        isMapLoading.mapChart05 = true;
				if(!roadNmAddrPeriodSelectedItem01.value && !roadNmAddrPeriodSelectedItem02.value) {
					console.log("전체");
					roadNmAddrPeriodSelectedItem01.value = {label: "전체", value: ""};
					roadNmAddrPeriodSelectedItem02.value = {label: "전체", value: ""};
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				} else if(roadNmAddrPeriodSelectedItem01.value && !roadNmAddrPeriodSelectedItem02.value) {
					console.log("시도 선택시");
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrPeriodSelectedItem01.value.value);
				} else if(roadNmAddrPeriodSelectedItem01.value && roadNmAddrPeriodSelectedItem02.value) {
					console.log("시군구 선택시");
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrPeriodSelectedItem02.value.value);
				}
			}
		} else if(type1 === 'detailAddr') {
			if(type2 === 'region') { // 상세주소(지역별)
				basColumns.value = basColumns.value.filter(item => item.detailAddrKorNm !== 'TOTAL_CNT');
				//await fnGraphDetailAddrStatus(type1, type2);
        isMapLoading.mapChart06 = true;
				if(!detailAddrSelectedItem02.value) {
					console.log("전체");
					detailAddrSelectedItem02.value = {label: "전체", value: ""};
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				} else {
					console.log("전체 아님");
					isDataLoaded = false
					fnMapStatus(type1, type2, detailAddrSelectedItem02.value.value);
				}
			}
		} else if(type1 === 'bas') {
			if(type2 === 'region') { // 기초구역(지역별)
				basColumns.value = basColumns.value.filter(item => item.basKorNm !== 'TOTAL_CNT');
				//await fnGraphBasStatus(type1, type2);
        isMapLoading.mapChart07 = true;
				if(!basSelectedItem01.value) {
					console.log("전체");
					basSelectedItem01.value = {label: "전체", value: ""};
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				} else {
					console.log("전체 아님");
					isDataLoaded = false
					fnMapStatus(type1, type2, basSelectedItem01.value.value);
				}
			}
		}
	} else {
		if(!roadSidoCdSelectReg.value.some(item => item.value === '00')) {
			console.log("!!!!!행정안전부");
			const entireIndex = roadSidoCdSelectReg.value.findIndex(item => item.value === '');
			if(entireIndex !== '-1') {
				roadSidoCdSelectReg.value.splice(entireIndex + 1, 0, {label: '행정안전부', value: '00'});
			} else {
				roadSidoCdSelectReg.value.unshift({label: '행정안전부', value: '00'});
			}
		} else if(!roadSidoCdSelectRegReason.value.some(item => item.value === '00')) {
			console.log("!!!!!행정안전부");
			const entireIndex = roadSidoCdSelectRegReason.value.findIndex(item => item.value === '');
			if(entireIndex !== '-1') {
				roadSidoCdSelectRegReason.value.splice(entireIndex + 1, 0, {label: '행정안전부', value: '00'});
			} else {
				roadSidoCdSelectRegReason.value.unshift({label: '행정안전부', value: '00'});
			}
		} else if(!roadSidoCdSelectRegRoadType.value.some(item => item.value === '00')) {
			console.log("!!!!!행정안전부");
			const entireIndex = roadSidoCdSelectRegRoadType.value.findIndex(item => item.value === '');
			if(entireIndex !== '-1') {
				roadSidoCdSelectRegRoadType.value.splice(entireIndex + 1, 0, {label: '행정안전부', value: '00'});
			} else {
				roadSidoCdSelectRegRoadType.value.unshift({label: '행정안전부', value: '00'});
			}
		}
	}
}

const roadValue = ref(0);
const roadAddrValue = ref(0);
const detailAddrValue = ref(0);
const basValue = ref(0);

const animateNumber = (type, start, end, duration = 2000) => {
	const step = Math.ceil((end - start) / (duration / 16));
	let currentValue = start;
	const interval = setInterval(() => {
		if(currentValue < end) {
			currentValue += step;
			if(currentValue > end) currentValue = end;
			if(type === 'road') {
				roa00.value = currentValue.toString().split('').join(' ');
			} else if(type === 'roadAddr') {
				totCo.value = currentValue.toString().split('').join(' ');
			} else if(type === 'detailAddr') {
				bdtyp00Cnt.value = currentValue.toString().split('').join(' ');
			} else if(type === 'bas') {
				basTotCo.value = currentValue.toString().split('').join(' ');
			}
		} else {
			clearInterval(interval);
		}
	}, 16);
	console.log("interval : ", interval);
}

let dbList;

//건수 조회
const fnRoadNum = async () => {
	try {
		const response = await axios.post('/api/ahs/selectAddrNum',
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		console.log("response : ", response.data);
		
		dbList = response.data || [];
		
		//기준일
		statsYmd.value = dbList.statsYmd;
		
		console.log("dbList : ", dbList);
		
		//도로명
		roadValue.value = parseInt(dbList.ROA_00, 10);
		roa00.value = 100000;
		animateNumber('road', roa00.value, roadValue.value);
		
		roa01.value = dbList.ROA_01;
		roa02.value = dbList.ROA_02;
		roa03.value = dbList.ROA_03;
		roa04.value = dbList.ROA_04;
		
		
		roadStatsYmSelectReg.value = dbList.statisticsRoadYmList.map((item) => ({
			label: item.statsYmText,
			value: item.statsYm
		}));
		
		if(roadStatsYmSelectReg.value.length > 0) {
			selectedItem01.value = roadStatsYmSelectReg.value[0].value;
			selectedItem02.value = roadSidoCdSelectReg.value[0].value;
		};
		
		//도로명주소
		/**
		roadAddrValue.value = parseInt(dbList.TOT_CO, 10);
		totCo.value = 1000000;
		animateNumber('roadAddr', totCo.value, roadAddrValue.value);
		
		//totCo.value = dbList.TOT_CO.toString().split('').join(' ');
		lastCo.value = dbList.LAST_CO;
		thisCo.value = dbList.THIS_CO;
		
		//상세주소
		bdtyp00Cnt.value = dbList.BDTYP_00_CNT.toString().split('').join(' ');
		bdtyp01Cnt.value = dbList.BDTYP_01_CNT;
		bdtyp02Cnt.value = dbList.BDTYP_02_CNT;
		bdtyp03Cnt.value = dbList.BDTYP_03_CNT;
		
		//기초구역
		basTotCo.value = dbList.BAS_TOT_CO.toString().split('').join(' ');
		
		console.log("roa00.value : ", roa00.value);
		console.log("totCo.value : ", totCo.value);
		console.log("bdtyp00Cnt.value : ", bdtyp00Cnt.value);
		console.log("basTotCo.value : ", basTotCo.value);
		
		roadStatsYmSelectReg.value = dbList.statisticsRoadYmList.map(item => ({
			label: item.statsYmText,
			value: item.statsYm
		}));
		
		//상세주소
		jusoStatsYmAuth.value = dbList.timeList.map(item => ({
			label: `${item}년`,
			value: item
		}))
		
		//부여시기 초기값
		roadNmAddrPeriodYear.value = jusoStatsYmAuth.value[0];
		*/
	} catch (error) {
		console.log(error)
	}
}

const fnRoadAddrNum = async () => {
	try {
		const response = await axios.post('/api/ahs/selectAddrNum',
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		console.log("response : ", response.data);
		
		dbList = response.data || [];
		
		//기준일
		statsYmd.value = dbList.statsYmd;
		
		console.log("dbList : ", dbList);
		
		//도로명주소
		roadAddrValue.value = parseInt(dbList.TOT_CO, 10);
		totCo.value = 1000000;
		animateNumber('roadAddr', totCo.value, roadAddrValue.value);
		
		lastCo.value = dbList.LAST_CO;
		thisCo.value = dbList.THIS_CO;
		
		jusoStatsYmAuth.value = dbList.timeList.map(item => ({
			label: `${item}년`,
			value: item
		}))
		
		roadNmAddrPeriodYear.value = jusoStatsYmAuth.value[0];
	} catch (error) {
		console.log(error)
	}
}

const fnDetailAddrNum = async () => {
	try {
		const response = await axios.post('/api/ahs/selectAddrNum',
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		console.log("response : ", response.data);
		
		dbList = response.data || [];
		
		//기준일
		statsYmd.value = dbList.statsYmd;
		
		console.log("dbList : ", dbList);
		
		//상세주소
		
		detailAddrValue.value = parseInt(dbList.BDTYP_00_CNT, 10);
		bdtyp00Cnt.value = 100000;
		animateNumber('detailAddr', bdtyp00Cnt.value, detailAddrValue.value);
		
		//bdtyp00Cnt.value = dbList.BDTYP_00_CNT.toString().split('').join(' ');
		bdtyp01Cnt.value = dbList.BDTYP_01_CNT;
		bdtyp02Cnt.value = dbList.BDTYP_02_CNT;
		bdtyp03Cnt.value = dbList.BDTYP_03_CNT;
		//상세주소
		jusoStatsYmAuth.value = dbList.timeList.map(item => ({
			label: `${item}년`,
			value: item
		}))
	} catch (error) {
		console.log(error)
	}
}

//건수 조회
const fnBasNum = async () => {
	try {
		const response = await axios.post('/api/ahs/selectAddrNum',
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		console.log("response : ", response.data);
		
		dbList = response.data || [];
		
		//기준일
		statsYmd.value = dbList.statsYmd;
		
		console.log("dbList : ", dbList);
		
		basValue.value = parseInt(dbList.BAS_TOT_CO, 10);
		basTotCo.value = 10000;
		animateNumber('bas', basTotCo.value, basValue.value);
		
		//기초구역
		//basTotCo.value = dbList.BAS_TOT_CO.toString().split('').join(' ');
		
		roadStatsYmSelectReg.value = dbList.statisticsRoadYmList.map(item => ({
			label: item.statsYmText,
			value: item.statsYm
		}));
		
	} catch (error) {
		console.log(error)
	}
}

//도로명 주소(시군구 조회)
const fnSelectSig = async (type1, type2, type3, sidoCd, sigCd) => {
	try {
		
		console.log('시도 params: ', sidoCd);
		const params = {
				type1: type1,
				type2: type2,
				type: 'sigSelect',
			}
		
		if(type1 === 'roadNameAddr') {
			if(type2 === 'region') {
				if(sidoCd.value) {
					params.sidoCd = sidoCd.value;
				} else {
					roadNmAddrSigSelectRegRegion.value.splice(0);
				}
				if(sigCd) {
					params.sigCd = sigCd;
				}
			} else if(type2 === 'period') {
				if(sidoCd.value) {
					params.sidoCd = sidoCd.value;
				} else {
					roadNmAddrSigSelectRegPeriod.value.splice(0);
				}
				if(sigCd) {
					params.sigCd = sigCd;
				}
			}
		}
		
		console.log("시군구 params : ", params);
		const response = ref(null);
		
		if(sidoCd.value) {
			response.value = await axios.post('/api/ahs/selectAddrNum',
					qs.stringify(params), 
					{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		}

		if(type2 === 'region') {
			if(sidoCd.value) {
				roadNmAddrSigSelectRegRegion.value = [
					{label: '전체', value: ''},
					...response.value.data.statisticsRoadNmAddrList.map(item =>({
						label: item.sigKorNm,
						value: item.sigCd
					})),
				];
			}
			
			
			if(type3 === 'sido') {
				console.log('sido!!!');
				const sidoCd = roadNmAddrRegionSelectedItem01.value.value || roadNmAddrRegionSelectedItem01.value[0]?.value;
				console.log("시도 : ", sidoCd);
				if(sidoCd === '36') {
					roadNmAddrRegionSelectedItem02.value = roadNmAddrSigSelectRegRegion.value[1];
				} else {
					roadNmAddrRegionSelectedItem02.value = '';
				}
				await fnGraphStatusRoadNmRegionData(type1, type2, sidoCd, '');
				if(selectOption === '지도') {
					fnMap(type1, type2, selectMapChartRoadNmAddrRegion.value);
				}
			} else if(type3 === 'sig') {
				console.log('sig!!!');
				const sidoCd = roadNmAddrRegionSelectedItem01.value.value || roadNmAddrRegionSelectedItem01.value[0]?.value;
				const sigCd = roadNmAddrRegionSelectedItem02.value.value || roadNmAddrRegionSelectedItem02.value[0]?.value;
				console.log("시도 : ", sidoCd, ", " + "시군구 : ", sigCd);
				await fnGraphStatusRoadNmRegionData(type1, type2, sidoCd, sigCd);
				if(selectOption === '지도') {
					fnMap(type1, type2, selectMapChartRoadNmAddrRegion.value);
				}
			}
		} else if(type2 === 'period') {
			if(sidoCd.value) {
				roadNmAddrSigSelectRegPeriod.value = [
					{label: '전체', value: ''},
					...response.value.data.statisticsRoadNmAddrList.map(item =>({
						label: item.sigKorNm,
						value: item.sigCd
					})),
				];
			}
			
			if(type3 === 'sido') {
				const choiceYm = roadNmAddrPeriodYear.value.value || jusoStatsYmAuth.value[0]?.value;
				const sidoCd = roadNmAddrPeriodSelectedItem01.value.value || detailAddrSidoCdSelectReg.value[0]?.value;
				if(sidoCd === '36') {
					roadNmAddrPeriodSelectedItem02.value = roadNmAddrSigSelectRegPeriod.value[1];
				} else {
					roadNmAddrPeriodSelectedItem02.value = '';
				}
				console.log("sidoCd : ", sidoCd, "choiceYm : ", choiceYm);
				await fnGraphStatusRoadNmPeriodData(type1, type2, choiceYm, sidoCd, '');
				if(selectOption === '지도') {
					fnMap(type1, type2, selectMapChartRoadNmAddrRegion.value);
				}
			} else if(type3 === 'sig') {
				const choiceYm = roadNmAddrPeriodYear.value.value || jusoStatsYmAuth.value[0]?.value;
				const sidoCd = roadNmAddrPeriodSelectedItem01.value.value || detailAddrSidoCdSelectReg.value[0]?.value;
				const sigCd = roadNmAddrPeriodSelectedItem02.value.value || '';
				console.log("sidoCd : ", sidoCd, 'sigCd : ', sigCd, "choiceYm : ", choiceYm);
				await fnGraphStatusRoadNmPeriodData(type1, type2, choiceYm, sidoCd, sigCd);
				if(selectOption === '지도') {
					fnMap(type1, type2, selectMapChartRoadNmAddrRegion.value);
				}
			} else {
				console.log("그외");
				const choiceYm = roadNmAddrPeriodYear.value.value || jusoStatsYmAuth.value[0]?.value;
				if(roadNmAddrPeriodSelectedItem01.value && roadNmAddrPeriodSelectedItem02.value) {
					console.log("둘 다 값 있음");
					const sidoCd = roadNmAddrPeriodSelectedItem01.value.value || detailAddrSidoCdSelectReg.value[0]?.value;
					const sigCd = roadNmAddrPeriodSelectedItem02.value.value || '';
					await fnGraphStatusRoadNmPeriodData(type1, type2, choiceYm, sidoCd, sigCd);
					if(selectOption === '지도') {
						fnMap(type1, type2, selectMapChartRoadNmAddrRegion.value);
					}
				} else if(roadNmAddrPeriodSelectedItem01.value && !roadNmAddrPeriodSelectedItem02.value) {
					console.log("시도만 있음");
					const sidoCd = roadNmAddrPeriodSelectedItem01.value.value || detailAddrSidoCdSelectReg.value[0]?.value;
					await fnGraphStatusRoadNmPeriodData(type1, type2, choiceYm, sidoCd, '');
					if(selectOption === '지도') {
						fnMap(type1, type2, selectMapChartRoadNmAddrRegion.value);
					}
				} else {
					await fnGraphStatusRoadNmPeriodData(type1, type2, choiceYm, '', '');
					if(selectOption === '지도') {
						fnMap(type1, type2, selectMapChartRoadNmAddrRegion.value);
					}
				}
			}
		}
		
	} catch (error) {
		console.log(error)
	}
}

//차트 데이터 조회(도로명 - 지역별)
const fnGraphStatusRegionData = async (type1, type2, selectedItem01, selectedItem02) => {
	try {
		const params = {
			type1: type1,
			type2: type2,
		}
		
		if(type1 === 'roadName') {
			if(type2 === 'region') {
				if(selectedItem01) {
					params.statsYm = selectedItem01;
				}
				if(selectedItem02) {
					params.sidoCd = selectedItem02;
				}
			}
		}
		
		console.log("params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const statsYmd = xmlDoc.getElementsByTagName('roadNmstatsYmd')[0].textContent || '';
		const dateMatch = statsYmd.match(/(\d{4}년 \d{1,2}월 \d{1,2}일)/);
		roadNmstatsYmd.value = dateMatch ? dateMatch[0] : '';
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const roadNm1 = Array.from(xmlDoc.getElementsByTagName('roadNm1'));
		
		roadNmRnum.value = [];
		roadNmKorNm.value = [];
		roadNmCnt.value = [];
		roadNmAdmCd.value = [];
		roadNmTotalCnt.value = 0;
		
		const parsedData = Array.from(roadNm1)
		.filter(data => data.getElementsByTagName('korNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			rnum : parseInt(data.getElementsByTagName('rnum')[0]?.textContent || '0'),
			korNm : data.getElementsByTagName('korNm')[0]?.textContent || '',
			admCd : parseInt(data.getElementsByTagName('admCd')[0]?.textContent || '0'),
			cnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		roadNmRnum.value = parsedData.map(item => item.rnum);
		roadNmKorNm.value = parsedData.map(item => item.korNm);
		roadNmAdmCd.value = parsedData.map(item => item.admCd);
		roadNmCnt.value = parsedData.map(item => item.cnt);
		
		const totalData = Array.from(roadNm1).find(data => data.getElementsByTagName('korNm')[0]?.textContent === 'TOTAL_CNT');
		
		if(totalData) {
			roadNmTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
		}
		
		//차트 컬럼
		regionColumns.value = roadNmKorNm.value.map((korNm, index) => ({
			roadNmRnum: roadNmRnum.value[index].toLocaleString(),
			roadNmKorNm: korNm,
			roadNmAdmCd: roadNmAdmCd.value[index],
			roadNmCnt: roadNmCnt.value[index].toLocaleString(),
		}));
		
		fnGraphRegionStatus(type1, type2);
	} catch (error) {
		console.log(error);
	}
}

//차트 데이터 조회(도로명 - 부여사유별)
const fnGraphStatusReasonData = async (type1, type2, roadNmReasonSelectedItem01, roadNmReasonSelectedItem02) => {
	try {
		const params = {
			type1: type1,
			type2: type2,
		}
		
		if(type1 === 'roadName') {
			if(type2 === 'reason') {
				if(roadNmReasonSelectedItem01) {
					params.roadType = roadNmReasonSelectedItem01;
				}
				if(roadNmReasonSelectedItem02) {
					params.sidoCd = roadNmReasonSelectedItem02;
				}
			}
		}
		
		console.log("params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const roadNm2 = Array.from(xmlDoc.getElementsByTagName('roadNm2'));
		
		roadNmReasonRnum.value = [];
		roadNmReasonKorNm.value = [];
		roadNmReasonAdmCd.value = [];
		roadNmReasonCnt.value = [];
		roadNmReg0410.value = [];
		roadNmReg0420.value = [];
		roadNmReg0440.value = [];
		roadNmReg0450.value = [];
		roadNmReg0499.value = [];
		roadNmReasonTotalCnt.value = 0;
		roadNmTotalReg0410.value = 0;
		roadNmTotalReg0420.value = 0;
		roadNmTotalReg0440.value = 0;
		roadNmTotalReg0450.value = 0;
		roadNmTotalReg0499.value = 0;
		
		const parsedData = Array.from(roadNm2)
		.filter(data => data.getElementsByTagName('korNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			rnum : parseInt(data.getElementsByTagName('rnum')[0]?.textContent || '0'),
			korNm : data.getElementsByTagName('korNm')[0]?.textContent || '',
			admCd : parseInt(data.getElementsByTagName('admCd')[0]?.textContent || '0'),
			reg0410 : parseInt(data.getElementsByTagName('reg0410')[0]?.textContent || '0'),
			reg0420 : parseInt(data.getElementsByTagName('reg0420')[0]?.textContent || '0'),
			reg0440 : parseInt(data.getElementsByTagName('reg0440')[0]?.textContent || '0'),
			reg0450 : parseInt(data.getElementsByTagName('reg0450')[0]?.textContent || '0'),
			reg0499 : parseInt(data.getElementsByTagName('reg0499')[0]?.textContent || '0'),
			cnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		roadNmReasonRnum.value = parsedData.map(item => item.rnum);
		roadNmReasonKorNm.value = parsedData.map(item => item.korNm);
		roadNmReasonAdmCd.value = parsedData.map(item => item.admCd);
		roadNmReg0410.value = parsedData.map(item => item.reg0410);
		roadNmReg0420.value = parsedData.map(item => item.reg0420);
		roadNmReg0440.value = parsedData.map(item => item.reg0440);
		roadNmReg0450.value = parsedData.map(item => item.reg0450);
		roadNmReg0499.value = parsedData.map(item => item.reg0499);
		roadNmReasonCnt.value = parsedData.map(item => item.cnt);
		
		const totalData = Array.from(roadNm2).find(data => data.getElementsByTagName('korNm')[0]?.textContent === 'TOTAL_CNT');
		if(totalData) {
			roadNmReasonTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
			roadNmTotalReg0410.value = parseInt(totalData.getElementsByTagName('reg0410')[0]?.textContent || '0');
			roadNmTotalReg0420.value = parseInt(totalData.getElementsByTagName('reg0420')[0]?.textContent || '0');
			roadNmTotalReg0440.value = parseInt(totalData.getElementsByTagName('reg0440')[0]?.textContent || '0');
			roadNmTotalReg0450.value = parseInt(totalData.getElementsByTagName('reg0450')[0]?.textContent || '0');
			roadNmTotalReg0499.value = parseInt(totalData.getElementsByTagName('reg0499')[0]?.textContent || '0');
		}
		
		reasonColumns.value = roadNmReasonKorNm.value.map((korNm, index) => ({
			roadNmReasonRnum: roadNmReasonRnum.value[index].toLocaleString(),
			roadNmReasonKorNm: korNm,
			roadNmReasonAdmCd: roadNmReasonAdmCd.value[index].toLocaleString(),
			roadNmReg0410: roadNmReg0410.value[index].toLocaleString(),
			roadNmReg0420: roadNmReg0420.value[index].toLocaleString(),
			roadNmReg0440: roadNmReg0440.value[index].toLocaleString(),
			roadNmReg0450: roadNmReg0450.value[index].toLocaleString(),
			roadNmReg0499: roadNmReg0499.value[index].toLocaleString(),
			roadNmReasonCnt: roadNmReasonCnt.value[index].toLocaleString(),
		}));
		
		fnGraphReasonStatus(type1, type2);
		
	} catch (error) {
		console.log(error);
	}
}

//차트 데이터 조회(도로명 - 위계별)
const fnGraphStatusRoadTypeData = async (type1, type2, roadNmTypeSelectedItem01, roadNmTypeSelectedItem02) => {
	console.log("selectOption : ", selectOption);
	try {
		const params = {
			type1: type1,
			type2: type2,
		}
		
		if(type1 === 'roadName') {
			if(type2 === 'roadType') {
				if(roadNmTypeSelectedItem01) {
					params.roadType = roadNmTypeSelectedItem01;
				}
				if(roadNmTypeSelectedItem02) {
					params.sidoCd = roadNmTypeSelectedItem02;
				}
			}
		}
		
		console.log("params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const roadNm3 = Array.from(xmlDoc.getElementsByTagName('roadNm3'));
		
		roadNmTypeRnum.value = [];
		roadNmTypeKorNm.value = [];
		roadNmTypeAdmCd.value = [];
		roadNmTypeRoa01.value = [];
		roadNmTypeRoa02.value = [];
		roadNmTypeRoa03.value = [];
		roadNmTypeRoa04.value = [];
		roadNmTypeCnt.value = [];
		roadNmTypeTotalCnt.value = 0;
		roadNmTypeTotalRoa01.value = 0;
		roadNmTypeTotalRoa02.value = 0;
		roadNmTypeTotalRoa03.value = 0;
		roadNmTypeTotalRoa04.value = 0;
		
		const parsedData = Array.from(roadNm3)
		.filter(data => data.getElementsByTagName('korNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			rnum : parseInt(data.getElementsByTagName('rnum')[0]?.textContent || '0'),
			korNm : data.getElementsByTagName('korNm')[0]?.textContent || '',
			admCd : data.getElementsByTagName('admCd')[0]?.textContent || '',
			roa01 : parseInt(data.getElementsByTagName('roa01')[0]?.textContent || '0'),
			roa02 : parseInt(data.getElementsByTagName('roa02')[0]?.textContent || '0'),
			roa03 : parseInt(data.getElementsByTagName('roa03')[0]?.textContent || '0'),
			roa04 : parseInt(data.getElementsByTagName('roa04')[0]?.textContent || '0'),
			cnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		roadNmTypeRnum.value = parsedData.map(item => item.rnum);
		roadNmTypeKorNm.value = parsedData.map(item => item.korNm);
		roadNmTypeAdmCd.value = parsedData.map(item => item.admCd);
		roadNmTypeRoa01.value = parsedData.map(item => item.roa01);
		roadNmTypeRoa02.value = parsedData.map(item => item.roa02);
		roadNmTypeRoa03.value = parsedData.map(item => item.roa03);
		roadNmTypeRoa04.value = parsedData.map(item => item.roa04);
		roadNmTypeCnt.value = parsedData.map(item => item.cnt);
		
		const totalData = Array.from(roadNm3).find(data => data.getElementsByTagName('korNm')[0]?.textContent === 'TOTAL_CNT');
		if(totalData) {
			roadNmTypeTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
			roadNmTypeTotalRoa01.value = parseInt(totalData.getElementsByTagName('roa01')[0]?.textContent || '0');
			roadNmTypeTotalRoa02.value = parseInt(totalData.getElementsByTagName('roa02')[0]?.textContent || '0');
			roadNmTypeTotalRoa03.value = parseInt(totalData.getElementsByTagName('roa03')[0]?.textContent || '0');
			roadNmTypeTotalRoa04.value = parseInt(totalData.getElementsByTagName('roa04')[0]?.textContent || '0');
		}
		
		roadTypeColumns.value = roadNmTypeKorNm.value.map((korNm, index) => ({
			roadNmTypeRnum: roadNmTypeRnum.value[index].toLocaleString(),
			roadNmTypeKorNm: korNm,
			roadNmTypeAdmCd: roadNmTypeAdmCd.value[index].toLocaleString(),
			roadNmTypeRoa01: roadNmTypeRoa01.value[index].toLocaleString(),
			roadNmTypeRoa02: roadNmTypeRoa02.value[index].toLocaleString(),
			roadNmTypeRoa03: roadNmTypeRoa03.value[index].toLocaleString(),
			roadNmTypeRoa04: roadNmTypeRoa04.value[index].toLocaleString(),
			roadNmTypeCnt: roadNmTypeCnt.value[index].toLocaleString(),
		}));
		
		fnGraphRoadTypeStatus(type1, type2);
	} catch (error) {
		console.log(error);
	}
}

//차트 데이터 조회(도로명 - 같은도로명)
const fnGraphStatusSameRoadNmData = async (type1, type2) => {
	try {
		const params = {
			type1: type1,
			type2: type2,
		}
		
		console.log("params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const roadNm4 = Array.from(xmlDoc.getElementsByTagName('roadNm4'));
		
		roadNmSameRnum.value = [];
		roadNmSameKorNm.value = [];
		roadNmSameCnt.value = [];
		roadNmSameTotalCnt.value = 0;
		
		const parsedData = Array.from(roadNm4)
		.filter(data => data.getElementsByTagName('korNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			rnum : parseInt(data.getElementsByTagName('rnum')[0]?.textContent || '0'),
			korNm : data.getElementsByTagName('korNm')[0]?.textContent || '',
			cnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		roadNmSameRnum.value = parsedData.map(item => item.rnum);
		roadNmSameKorNm.value = parsedData.map(item => item.korNm);
		roadNmSameCnt.value = parsedData.map(item => item.cnt);
		
		const totalData = Array.from(roadNm4).find(data => data.getElementsByTagName('korNm')[0]?.textContent === 'TOTAL_CNT');
		if(totalData) {
			roadNmSameTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
		}
		
		sameRoadNmColumns.value = roadNmSameKorNm.value.map((korNm, index) => ({
			roadNmSameRnum: roadNmSameRnum.value[index].toLocaleString(),
			roadNmSameKorNm: korNm,
			roadNmSameCnt: roadNmSameCnt.value[index].toLocaleString(),
		}));
		
		fnGraphSameRoadNmStatus(type1, type2);
	} catch (error) {
		console.log(error);
	}
}

//차트 데이터 조회(도로명주소 - 지역별)
const fnGraphStatusRoadNmRegionData = async (type1, type2, roadNmAddrRegionSelectedItem01, roadNmAddrRegionSelectedItem02) => {
	try {
		console.log("selectOption : ", selectOption);
		const params = {
			type1: type1,
			type2: type2,
		}
		
		console.log("roadNmAddrRegionSelectedItem02 : ", roadNmAddrRegionSelectedItem02);
		
		if(type1 === 'roadNameAddr') {
			if(type2 === 'region') {
				if(roadNmAddrRegionSelectedItem01) {
					params.sidoCd = roadNmAddrRegionSelectedItem01;
				}
				if(roadNmAddrRegionSelectedItem02) {
					params.sigCd = roadNmAddrRegionSelectedItem02;
				}
			}
		}
		
		console.log("데이터 params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		console.log("데이터 response : ", response.data);
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const roadNmAddr1 = Array.from(xmlDoc.getElementsByTagName('roadNmAddr1'));
		
		roadNmAddrRegionRnum.value = [];
		roadNmAddrRegionAdmCd.value = [];
		roadNmAddrRegionKorNm.value = [];
		roadNmAddrRegionCnt.value = [];
		roadNmAddrRegionTotalCnt.value = 0;
		
		const parsedData = Array.from(roadNmAddr1)
		.filter(data => data.getElementsByTagName('korNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			rnum : parseInt(data.getElementsByTagName('rnum')[0]?.textContent || '0'),
			admCd : parseInt(data.getElementsByTagName('admCd')[0]?.textContent || '0'),
			korNm : data.getElementsByTagName('korNm')[0]?.textContent || '',
			cnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		roadNmAddrRegionRnum.value = parsedData.map(item => item.rnum);
		roadNmAddrRegionAdmCd.value = parsedData.map(item => item.admCd);
		roadNmAddrRegionKorNm.value = parsedData.map(item => item.korNm);
		roadNmAddrRegionCnt.value = parsedData.map(item => item.cnt);
		
		const totalData = Array.from(roadNmAddr1).find(data => data.getElementsByTagName('korNm')[0]?.textContent === 'TOTAL_CNT');
		if(totalData) {
			roadNmAddrRegionTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
		}
		
		roadNmAddrRegionColumns.value = roadNmAddrRegionKorNm.value.map((korNm, index) => ({
			roadNmAddrRegionRnum: roadNmAddrRegionRnum.value[index].toLocaleString(),
			roadNmAddrRegionAdmCd: roadNmAddrRegionAdmCd.value[index].toLocaleString(),
			roadNmAddrRegionKorNm: korNm,
			roadNmAddrRegionCnt: roadNmAddrRegionCnt.value[index].toLocaleString(),
		}));
		
		console.log("roadNmAddrRegionColumns.value : ", roadNmAddrRegionColumns.value);
		
		if(selectOption === '차트') {
			fnGraphRoadNmAddrRegionStatus(type1, type2);
		}
	} catch (error) {
		console.log(error);
	}
}

//차트 데이터 조회(도로명주소 - 부여시기별)
const fnGraphStatusRoadNmPeriodData = async (type1, type2, roadNmAddrPeriodYear, roadNmAddrPeriodSelectedItem01, roadNmAddrPeriodSelectedItem02) => {
	try {
		const params = {
			type1: type1,
			type2: type2,
		}
		
		if(type1 === 'roadNameAddr') {
			if(type2 === 'period') {
				if(roadNmAddrPeriodYear) {
					params.choiceYm = roadNmAddrPeriodYear;
				}
				if(roadNmAddrPeriodSelectedItem01) {
					params.sidoCd = roadNmAddrPeriodSelectedItem01;
				}
				if(roadNmAddrPeriodSelectedItem02) {
					params.sigCd = roadNmAddrPeriodSelectedItem02;
				}
			}
		}
		
		console.log("데이터 params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		//기준일
		const stStatsYmd = xmlDoc.getElementsByTagName('stFormattedDate')[0].textContent || '';
		const edStatsYmd = xmlDoc.getElementsByTagName('edFormattedDate')[0].textContent || '';
		
		roadNmAddrPeriodYmd.value = `${stStatsYmd} ~ ${edStatsYmd}`;
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const roadNmAddr2 = Array.from(xmlDoc.getElementsByTagName('roadNmAddr2'));
		
		roadNmAddrPeriodRnum.value = [];
		roadNmAddrPeriodAdmCd.value = [];
		roadNmAddrPeriodKorNm.value = [];
		roadNmAddrPeriodCnt.value = [];
		roadNmAddrPeriodTotalCnt.value = 0;
		
		const parsedData = Array.from(roadNmAddr2)
		.filter(data => data.getElementsByTagName('korNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			rnum : parseInt(data.getElementsByTagName('rnum')[0]?.textContent || '0'),
			admCd : parseInt(data.getElementsByTagName('admCd')[0]?.textContent || '0'),
			korNm : data.getElementsByTagName('korNm')[0]?.textContent || '',
			cnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		roadNmAddrPeriodRnum.value = parsedData.map(item => item.rnum);
		roadNmAddrPeriodAdmCd.value = parsedData.map(item => item.admCd);
		roadNmAddrPeriodKorNm.value = parsedData.map(item => item.korNm);
		roadNmAddrPeriodCnt.value = parsedData.map(item => item.cnt);
		
		const totalData = Array.from(roadNmAddr2).find(data => data.getElementsByTagName('korNm')[0]?.textContent === 'TOTAL_CNT');
		if(totalData) {
			roadNmAddrPeriodTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
		}
		
		roadNmAddrPeriodColumns.value = roadNmAddrPeriodKorNm.value.map((korNm, index) => ({
			roadNmAddrPeriodRnum: roadNmAddrPeriodRnum.value[index].toLocaleString(),
			roadNmAddrPeriodAdmCd: roadNmAddrPeriodAdmCd.value[index].toLocaleString(),
			roadNmAddrPeriodKorNm: korNm,
			roadNmAddrPeriodCnt: roadNmAddrPeriodCnt.value[index].toLocaleString(),
		}));
		
		if(selectOption === '차트') {
			fnGraphRoadNmAddrPeriodStatus(type1, type2);
		}
		
	} catch (error) {
		console.log(error);
	}
}

//차트 데이터 조회(상세주소 - 지역별)
const fnGraphStatusDetailAddrData = async (type1, type2, detailAddrSelectedItem01, detailAddrSelectedItem02) => {
	try {
		const params = {
			type1: type1,
			type2: type2,
		}
		
		if(type1 === 'detailAddr') {
			if(type2 === 'region') {
				if(detailAddrSelectedItem01) {
					params.bdtyp = detailAddrSelectedItem01;
				}
				if(detailAddrSelectedItem02) {
					params.sidoCd = detailAddrSelectedItem02;
				}
			}
		}
		
		console.log("params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		console.log("response : ", response);
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const detailAddr = Array.from(xmlDoc.getElementsByTagName('detailAddr'));

		detailAddrAdmCd.value = [];
		detailAddrKorNm.value = [];
		detailAddrBdtyp01.value = [];
		detailAddrBdtyp02.value = [];
		detailAddrBdtyp03.value = [];
		detailAddrCnt.value = [];
		detailAddrTotalCnt.value = 0;
		detailAddrTotalBdtyp01.value = 0;
		detailAddrTotalBdtyp02.value = 0;
		detailAddrTotalBdtyp03.value = 0;
		
		const parsedData = Array.from(detailAddr)
		.filter(data => data.getElementsByTagName('korNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			admCd : parseInt(data.getElementsByTagName('admCd')[0]?.textContent || '0'),
			korNm : data.getElementsByTagName('korNm')[0]?.textContent || '',
			bdtyp01 : parseInt(data.getElementsByTagName('bdtyp01')[0]?.textContent || '0'),
			bdtyp02 : parseInt(data.getElementsByTagName('bdtyp02')[0]?.textContent || '0'),
			bdtyp03 : parseInt(data.getElementsByTagName('bdtyp03')[0]?.textContent || '0'),
			cnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		detailAddrAdmCd.value = parsedData.map(item => item.admCd);
		detailAddrKorNm.value = parsedData.map(item => item.korNm);
		detailAddrBdtyp01.value = parsedData.map(item => item.bdtyp01);
		detailAddrBdtyp02.value = parsedData.map(item => item.bdtyp02);
		detailAddrBdtyp03.value = parsedData.map(item => item.bdtyp03);
		detailAddrCnt.value = parsedData.map(item => item.cnt);
		
		const totalData = Array.from(detailAddr).find(data => data.getElementsByTagName('korNm')[0]?.textContent === 'TOTAL_CNT');
		if(totalData) {
			detailAddrTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
			detailAddrTotalBdtyp01.value = parseInt(totalData.getElementsByTagName('bdtyp01')[0]?.textContent || '0');
			detailAddrTotalBdtyp02.value = parseInt(totalData.getElementsByTagName('bdtyp02')[0]?.textContent || '0');
			detailAddrTotalBdtyp03.value = parseInt(totalData.getElementsByTagName('bdtyp03')[0]?.textContent || '0');
		}
		
		detailAddrColumns.value = detailAddrKorNm.value.map((korNm, index) => ({
			detailAddrAdmCd: detailAddrAdmCd.value[index].toLocaleString(),
			detailAddrKorNm: korNm,
			detailAddrBdtyp01: detailAddrBdtyp01.value[index].toLocaleString(),
			detailAddrBdtyp02: detailAddrBdtyp02.value[index].toLocaleString(),
			detailAddrBdtyp03: detailAddrBdtyp03.value[index].toLocaleString(),
			detailAddrCnt: detailAddrCnt.value[index].toLocaleString(),
		}));
		
		if(selectOption === '차트') {
			fnGraphDetailAddrStatus(type1, type2);
		}
	} catch (error) {
		console.log(error);
	}
}

const basMapChoice = async (type1, type2, type3) => {
	console.log("type3 : ", type3);
	if(type3 === '11') {
		basSelectedItem01.value = { 
			label: '서울특별시', value: '11' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '26') {
		basSelectedItem01.value = { 
			label: '부산광역시', value: '26' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '27') {
		basSelectedItem01.value = { 
			label: '대구광역시', value: '27' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '28') {
		basSelectedItem01.value = { 
			label: '인천광역시', value: '28' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '29') {
		basSelectedItem01.value = { 
			label: '광주광역시', value: '29' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '30') {
		basSelectedItem01.value = { 
			label: '대전광역시', value: '30' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '31') {
		basSelectedItem01.value = { 
			label: '울산광역시', value: '31' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '36') {
		basSelectedItem01.value = { 
			label: '세종특별자치시', value: '36' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '41') {
		basSelectedItem01.value = { 
			label: '경기도', value: '41' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '51') {
		basSelectedItem01.value = { 
			label: '강원특별자치도', value: '51' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '43') {
		basSelectedItem01.value = { 
			label: '충청북도', value: '43' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '44') {
		basSelectedItem01.value = { 
			label: '충청남도', value: '44' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '52') {
		basSelectedItem01.value = { 
			label: '전북특별자치도', value: '52' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '46') {
		basSelectedItem01.value = { 
			label: '전라남도', value: '46' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '47') {
		basSelectedItem01.value = { 
			label: '경상북도', value: '47' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '48') {
		basSelectedItem01.value = { 
			label: '경상남도', value: '48' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	} else if(type3 === '50') {
		basSelectedItem01.value = { 
			label: '제주특별자치도', value: '50' 
		};
		fnGraphStatusBasData(type1, type2, type3);
	}
}

//차트 데이터 조회(기초구역 - 지역별)
const fnGraphStatusBasData = async (type1, type2, basSelectedItem01) => {
	try {
		const params = {
			type1: type1,
			type2: type2,
		}
		
		if(type1 === 'bas') {
			if(type2 === 'region') {
				if(basSelectedItem01) {
					params.sidoCd = basSelectedItem01;
				}
			}
		}
		
		console.log("params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const bas = Array.from(xmlDoc.getElementsByTagName('bas'));
		
		basRnum.value = [];
		basAdmCd.value = [];
		basKorNm.value = [];
		basCnt.value = [];
		basTotalCnt.value = 0;
		
		const parsedData = Array.from(bas)
		.filter(data => data.getElementsByTagName('korNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			rnum : parseInt(data.getElementsByTagName('rnum')[0]?.textContent || '0'),
			admCd : parseInt(data.getElementsByTagName('admCd')[0]?.textContent || '0'),
			korNm : data.getElementsByTagName('korNm')[0]?.textContent || '',
			cnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		basRnum.value = parsedData.map(item => item.rnum);
		basAdmCd.value = parsedData.map(item => item.admCd);
		basKorNm.value = parsedData.map(item => item.korNm);
		basCnt.value = parsedData.map(item => item.cnt);
		
		const totalData = Array.from(bas).find(data => data.getElementsByTagName('korNm')[0]?.textContent === 'TOTAL_CNT');
		if(totalData) {
			basTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
		}
		
		basColumns.value = basKorNm.value.map((korNm, index) => ({
			basRnum: basRnum.value[index].toLocaleString(),
			basAdmCd: basAdmCd.value[index].toLocaleString(),
			basKorNm: korNm,
			basCnt: basCnt.value[index].toLocaleString(),
		}));
		
		if(selectOption === '차트') {
			fnGraphBasStatus(type1, type2);
		} else if(selectOption === '지도') {
			fnMap(type1, type2, selectMapChartbas.value);
		}
	} catch (error) {
		console.log(error);
	}
}

//차트 데이터 조회(주소정보이용추이 - 주소정보 다운로드)
const fnGraphStatusDbAddrInfoData = async (type1, type2, dbAddrInfoSelectedItem01, dbAddrInfoSelectedItem02) => {
	try {
		const params = {
			type1: type1,
			type2: type2,
		}
		
		if(type1 === 'db') {
			if(type2 === 'addrInfo') {
				if(dbAddrInfoSelectedItem01) {
					params.choiceYm = dbAddrInfoSelectedItem01;
				}
				if(dbAddrInfoSelectedItem02) {
					params.statsCd = dbAddrInfoSelectedItem02;
				} else {
					params.dbtyp = 'DB'
				}
			}
		}
		
		console.log("params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		//기준일
		const stStatsYmd = xmlDoc.getElementsByTagName('stFormattedDate')[0].textContent || '';
		const edStatsYmd = xmlDoc.getElementsByTagName('edFormattedDate')[0].textContent || '';
		
		dbAddrInfoYmd.value = `${stStatsYmd} ~ ${edStatsYmd}`;
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const db1 = Array.from(xmlDoc.getElementsByTagName('db1'));
		
		dbAddrInfoRnum.value = [];
		dbAddrInfoKndNm.value = [];
		dbAddrInfoCnt.value = [];
		dbAddrInfoKnd.value = [];
		dbAddrInfoTotalCnt.value = 0;
		
		const parsedData = Array.from(db1)
		.filter(data => data.getElementsByTagName('dbKndNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			rnum : parseInt(data.getElementsByTagName('rnum')[0]?.textContent || '0'),
			dbKndNm : data.getElementsByTagName('dbKndNm')[0]?.textContent || '',
			dbKnd : parseInt(data.getElementsByTagName('dbKnd')[0]?.textContent || '0'),
			dbCnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		dbAddrInfoRnum.value = parsedData.map(item => item.rnum);
		dbAddrInfoKndNm.value = parsedData.map(item => item.dbKndNm);
		dbAddrInfoKnd.value = parsedData.map(item => item.dbKnd);
		dbAddrInfoCnt.value = parsedData.map(item => item.dbCnt);
		
		const totalData = Array.from(db1).find(data => data.getElementsByTagName('dbKndNm')[0]?.textContent === 'TOTAL_CNT');
		
		if(totalData) {
			dbAddrInfoTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
		}
		
		//차트 컬럼
		dbAddrInfoColumns.value = dbAddrInfoKndNm.value.map((korNm, index) => ({
			dbAddrInfoRnum: dbAddrInfoRnum.value[index].toLocaleString(),
			dbAddrInfoKndNm: korNm,
			dbAddrInfoKnd: dbAddrInfoKnd.value[index],
			dbAddrInfoCnt: dbAddrInfoCnt.value[index].toLocaleString(),
		}));
		
		//fnGraphRegionStatus(type1, type2);
	} catch (error) {
		console.log(error);
	}
}

//차트 데이터 조회(주소정보이용추이 - 지도(공간)정보 다운로드)
const fnGraphStatusDbMapInfoData = async (type1, type2, dbMapInfoSelectedItem01, dbMapInfoSelectedItem02) => {
	try {
		const params = {
			type1: type1,
			type2: type2,
		}
		
		if(type1 === 'db') {
			if(type2 === 'mapInfo') {
				if(dbMapInfoSelectedItem01) {
					params.choiceYm = dbMapInfoSelectedItem01;
				}
				if(dbMapInfoSelectedItem02) {
					params.statsCd = dbMapInfoSelectedItem02;
				} else {
					params.dbtyp = 'LAY'
				}
			}
		}
		
		console.log("params : ", params);
		
		const response = await axios.post('/api/ahs/selectChart', 
				qs.stringify(params), 
				{headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.data, 'text/xml');
		
		//기준일
		const stStatsYmd = xmlDoc.getElementsByTagName('stFormattedDate')[0].textContent || '';
		const edStatsYmd = xmlDoc.getElementsByTagName('edFormattedDate')[0].textContent || '';
		
		dbMapInfoYmd.value = `${stStatsYmd} ~ ${edStatsYmd}`;
		
		const results = Array.from(xmlDoc.getElementsByTagName('results'));
		const db2 = Array.from(xmlDoc.getElementsByTagName('db2'));
		
		dbMapInfoRnum.value = [];
		dbMapInfoKndNm.value = [];
		dbMapInfoCnt.value = [];
		dbMapInfoKnd.value = [];
		dbMapInfoTotalCnt.value = 0;
		
		const parsedData = Array.from(db2)
		.filter(data => data.getElementsByTagName('dbKndNm')[0]?.textContent !== 'TOTAL_CNT')
		.map(data => ({
			rnum : parseInt(data.getElementsByTagName('rnum')[0]?.textContent || '0'),
			dbKndNm : data.getElementsByTagName('dbKndNm')[0]?.textContent || '',
			dbKnd : parseInt(data.getElementsByTagName('dbKnd')[0]?.textContent || '0'),
			dbCnt : parseInt(data.getElementsByTagName('cnt')[0]?.textContent || '0')
		}));
		
		dbMapInfoRnum.value = parsedData.map(item => item.rnum);
		dbMapInfoKndNm.value = parsedData.map(item => item.dbKndNm);
		dbMapInfoKnd.value = parsedData.map(item => item.dbKnd);
		dbMapInfoCnt.value = parsedData.map(item => item.dbCnt);
		
		const totalData = Array.from(db2).find(data => data.getElementsByTagName('dbKndNm')[0]?.textContent === 'TOTAL_CNT');
		
		if(totalData) {
			dbMapInfoTotalCnt.value = parseInt(totalData.getElementsByTagName('cnt')[0]?.textContent || '0');
		}
		
		//차트 컬럼
		dbMapInfoColumns.value = dbMapInfoKndNm.value.map((korNm, index) => ({
			dbMapInfoRnum: dbMapInfoRnum.value[index].toLocaleString(),
			dbMapInfoKndNm: korNm,
			dbMapInfoKnd: dbMapInfoKnd.value[index],
			dbMapInfoCnt: dbMapInfoCnt.value[index].toLocaleString(),
		}));
		
		//fnGraphRegionStatus(type1, type2);
	} catch (error) {
		console.log(error);
	}
}

//엑셀 다운로드(도로명 - 지역별)
const fnRegionExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~지역별 다운로드");
	
	const regionColumnsExcel = [...regionColumns.value];

	const totalCnt = {
		roadNmKorNm: 'TOTAL_CNT',
		roadNmCnt: roadNmTotalCnt.value.toLocaleString()
	};
	
	regionColumnsExcel.push(totalCnt);
	
	console.log("어이없네", regionColumns);
	
	let header = {
		"roadNmKorNm" : "시도"
		,"roadNmCnt" : "도로수"
	}
	
	let param = {
		"fileNm" : "지역별 도로명통계"
		,"headerEngTitle" : header
		,"dataList" : regionColumnsExcel
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '지역별 도로명통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
} 

//엑셀 다운로드(도로명 - 부여사유별)
const fnReasonExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~부여사유별 다운로드");
	
	const totalCnt = {
		roadNmReasonKorNm: 'TOTAL_CNT',
		roadNmReg0410: roadNmTotalReg0410.value.toLocaleString(),
		roadNmReg0420: roadNmTotalReg0420.value.toLocaleString(),
		roadNmReg0440: roadNmTotalReg0440.value.toLocaleString(),
		roadNmReg0450: roadNmTotalReg0450.value.toLocaleString(),
		roadNmReg0499: roadNmTotalReg0499.value.toLocaleString(),
	};
	
	const reasonColumnsExcel = [...reasonColumns.value];
	reasonColumnsExcel.push(totalCnt);
	
	let header = {
		"roadNmReasonKorNm" : "시도"
		,"roadNmReg0410" : "지명·자연마을이름"
		,"roadNmReg0420" : "지명·자연마을이름"
		,"roadNmReg0440" : "역사적인물·기념"
		,"roadNmReg0450" : "문화재·유적"
		,"roadNmReg0499" : "기타"
	}
	
	let param = {
		"fileNm" : "부여사유별 도로명통계"
		,"headerEngTitle" : header
		,"dataList" : reasonColumnsExcel
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '부여사유별 도로명통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
} 

//엑셀 다운로드(도로명 - 위계별)
const fnRoadTypeExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~위계별 다운로드");
	
	const totalCnt = {
		roadNmTypeKorNm: 'TOTAL_CNT',
		roadNmTypeRoa01: roadNmTypeTotalRoa01.value.toLocaleString(),
		roadNmTypeRoa02: roadNmTypeTotalRoa02.value.toLocaleString(),
		roadNmTypeRoa03: roadNmTypeTotalRoa03.value.toLocaleString(),
		roadNmTypeRoa04: roadNmTypeTotalRoa04.value.toLocaleString(),
	};
	
	const roadTypeColumnsExcel = [...roadTypeColumns.value];
	roadTypeColumnsExcel.push(totalCnt);
	
	let header = {
		"roadNmTypeKorNm" : "시도"
		,"roadNmTypeRoa01" : "고속도로"
		,"roadNmTypeRoa02" : "대로"
		,"roadNmTypeRoa03" : "로"
		,"roadNmTypeRoa04" : "길"
	}
	
	let param = {
		"fileNm" : "위계별 도로명통계"
		,"headerEngTitle" : header
		,"dataList" : roadTypeColumnsExcel
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '위계별 도로명통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
} 

//엑셀 다운로드(도로명 - 같은도로명)
const fnSameRoadNmExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~같은도로명 다운로드");
	
	const totalCnt = {
		roadNmSameKorNm: 'TOTAL_CNT',
		roadNmSameCnt: roadNmSameTotalCnt.value.toLocaleString()
	};
	
	const sameRoadNmColumnsExcel = [...sameRoadNmColumns.value];
	sameRoadNmColumnsExcel.push(totalCnt);
	
	let header = {
		"roadNmSameKorNm" : "시도"
		,"roadNmSameCnt" : "도로명수"
	}
	
	let param = {
		"fileNm" : "같은도로명 통계"
		,"headerEngTitle" : header
		,"dataList" : sameRoadNmColumnsExcel
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '같은도로명 통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
} 

//엑셀 다운로드(도로명주소 - 지역별)
const fnRoadNmRegionExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~도로명주소(지역별) 다운로드");
	
	const totalCnt = {
		roadNmAddrRegionKorNm: 'TOTAL_CNT',
		roadNmAddrRegionCnt: roadNmAddrRegionTotalCnt.value.toLocaleString()
	};
	
	const roadNmAddrRegionColumnsExcel = [...roadNmAddrRegionColumns.value];
	
	roadNmAddrRegionColumnsExcel.push(totalCnt);
	
	
	let header = {
		"roadNmAddrRegionKorNm" : "시도"
		,"roadNmAddrRegionCnt" : "도로명주소"
	}
	
	let param = {
		"fileNm" : "지역별 도로명주소 통계"
		,"headerEngTitle" : header
		,"dataList" : roadNmAddrRegionColumnsExcel
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '지역별 도로명주소 통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
} 

//엑셀 다운로드(도로명주소 - 부여시기별)
const fnRoadNmPeriodExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~도로명주소(부여시기별) 다운로드");
	
	const totalCnt = {
		roadNmAddrPeriodKorNm: 'TOTAL_CNT',
		roadNmAddrPeriodCnt: roadNmAddrPeriodTotalCnt.value.toLocaleString()
	};
	
	const roadNmAddrPeriodColumnsExcel = [...roadNmAddrPeriodColumns.value];
	
	roadNmAddrPeriodColumnsExcel.push(totalCnt);
	
	let header = {
		"roadNmAddrPeriodKorNm" : "시도"
		,"roadNmAddrPeriodCnt" : "도로명주소"
	}
	
	let param = {
		"fileNm" : "부여시기별 도로명주소 통계"
		,"headerEngTitle" : header
		,"dataList" : roadNmAddrPeriodColumnsExcel
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '부여시기별 도로명주소 통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
}

//엑셀 다운로드(상세주소 - 지역별)
const fnDetailAddrExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~상세주소(지역별) 다운로드");
	
	const totalCnt = {
		detailAddrKorNm: 'TOTAL_CNT',
		detailAddrBdtyp01: detailAddrTotalBdtyp01.value.toLocaleString(),
		detailAddrBdtyp02: detailAddrTotalBdtyp02.value.toLocaleString(),
		detailAddrBdtyp03: detailAddrTotalBdtyp03.value.toLocaleString(),
	};
	const detailAddrColumnsExcel = [...detailAddrColumns.value];
	
	detailAddrColumnsExcel.push(totalCnt);
	
	let header = {
		"detailAddrKorNm" : "시도"
		,"detailAddrBdtyp01" : "단독"
		,"detailAddrBdtyp02" : "다가구"
		,"detailAddrBdtyp03" : "근린생활시설"
	}
	
	let param = {
		"fileNm" : "지역별 상세주소 통계"
		,"headerEngTitle" : header
		,"dataList" : detailAddrColumnsExcel
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '지역별 상세주소 통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
} 

//엑셀 다운로드(기초구역 - 지역별)
const fnBasExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~기초구역(지역별) 다운로드");
	
	const totalCnt = {
		basKorNm: 'TOTAL_CNT',
		basCnt: basTotalCnt.value.toLocaleString()
	};
	const basColumnsExcel = [...basColumns.value];
	basColumnsExcel.push(totalCnt);
	
	let header = {
		"basKorNm" : "시도"
		,"basCnt" : "도로명주소"
	}
	
	let param = {
		"fileNm" : "지역별 기초구역 통계"
		,"headerEngTitle" : header
		,"dataList" : basColumnsExcel
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '지역별 기초구역 통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
}

//엑셀 다운로드(주소정보 이용추이 - 주소정보 다운로드)
const fnDbAddrInfoExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~주소정보 이용추이(주소정보다운로드) 다운로드");
	
	const totalCnt = {
		dbAddrInfoKndNm: 'TOTAL_CNT',
		dbAddrInfoCnt: dbAddrInfoTotalCnt.value.toLocaleString()
	};
	
	dbAddrInfoColumns.value.push(totalCnt);
	
	console.log(dbAddrInfoColumns.value);
	
	let header = {
		"dbAddrInfoKndNm" : "종류"
		,"dbAddrInfoCnt" : "이용횟수(단외:회)"
	}
	
	let param = {
		"fileNm" : "주소지용추이 통계"
		,"headerEngTitle" : header
		,"dataList" : dbAddrInfoColumns.value
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '주소지용추이 통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
}

//엑셀 다운로드(주소정보 이용추이 - 지도(공간)정보 다운로드)
const fnDbMapInfoExcelDwnld = async () => {
	console.log("~~~~~~~~~~~~~~~~~~~주소정보 이용추이(지도(공간)정보다운로드) 다운로드");
	
	const totalCnt = {
		dbMapInfoKndNm: 'TOTAL_CNT',
		dbMapInfoCnt: dbMapInfoTotalCnt.value.toLocaleString()
	};
	
	dbMapInfoColumns.value.push(totalCnt);
	
	console.log(dbMapInfoColumns.value);
	
	let header = {
		"dbMapInfoKndNm" : "종류"
		,"dbMapInfoCnt" : "이용횟수(단외:회)"
	}
	
	let param = {
		"fileNm" : "주소지용추이 통계"
		,"headerEngTitle" : header
		,"dataList" : dbMapInfoColumns.value
	}
	
	axios.post('/api/jusoCommon/cmn-excel-download', param, {responseType: 'blob'})
	.then(response => {
		console.log("엑셀", response);
		const blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = '주소지용추이 통계.xlsx';
		link.click();
	})
    .catch(error =>{
		console.error("error =>", error);
		alert(error.response.data.message);
	})
}

//차트 그리기(도로명 - 지역별)
const fnGraphRegionStatus = async (type1, type2) => {
	console.log("차트 그리기");
	await nextTick();
	
	//차트변경시 기존 차트 지우기
	const bfrDom = document.getElementById('barChart');
	const bfrChart = echarts.init(bfrDom);
	if (bfrChart) {
		bfrChart.dispose();
	}
	
	const chartDom = document.getElementById('barChart');
	
	if(chartDom) {
		
		const myChart = echarts.init(chartDom);
		
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'roadName') {
			if(type2 === 'region') {
				maxCnt = Math.max(...roadNmCnt.value);
				console.log('도로명 maxXnt : ', maxCnt);
				maxValue = Math.ceil(maxCnt / 1000) * 1000;
				console.log('도로명 maxValue : ', maxValue);
				console.log("차트 타입 : ", selectChartRegion.value);
				if(selectChartRegion.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {},
							xAxis: {
								type: 'category',
								data: roadNmKorNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: roadNmCnt.value.map((cnt, index) => {
										const opacity = Math.max(0.3, cnt / maxCnt);
										return {
											value: cnt,
											itemStyle: {
												color: `rgba(0, 128, 0, ${opacity})`
											}
										}
									}),
									type: 'bar',
									label: {
										show: true,
										position: 'top',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartRegion.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					console.log("roadNmKorNm 값 : ", roadNmKorNm);
					option = {
							tooltip: {},
							yAxis: {
								type: 'category',
								data: roadNmKorNm.value,
								axisLabel: {
									interval: 0,
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: roadNmCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(0, 128, 0, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'right',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartRegion.value === 'setDoughnutChart') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setDoughnutChart");
					option = {
							tooltip: {},
							series: [
								{
									type: 'pie',
									radius: ['40%', '70%',],
									data: roadNmKorNm.value.map((name, index) => ({
										name: name,
										value: roadNmCnt.value[index]
									})),
									label: {
										show: true,
										formatter: '{b}'
									}
								},
							],
						};
				}
				myChart.on('click', async function (params) {
					console.log('차트 클릭됨', params);
					selectOption = '차트';
					const selectedRegion = roadSidoCdSelectReg.value.find(item => item.label === params.name);
					if(selectedRegion) {
						selectedItem02.value = selectedRegion;
						if(selectedItem01.value.value) {
							console.log('selectedItem01 값 있음 : ', selectedItem01.value.value);
							fnGraphStatusRegionData(type1, type2, selectedItem01.value.value, selectedItem02.value.value);
						} else {
							console.log('selectedItem01 값 없음');
							fnGraphStatusRegionData(type1, type2, selectedItem01.value, selectedItem02.value.value);
						}
					}
				})
				myChart.setOption(option);
				window.addEventListener('resize', () => {
					myChart.resize();
				});
			}
		}
	}
};

//차트 그리기(도로명 - 부여사유별)
const fnGraphReasonStatus = async (type1, type2) => {
	await nextTick();
	//차트변경시 기존 차트 지우기
	const bfrDom = document.getElementById('barChart2');
	const bfrChart = echarts.init(bfrDom);
	if (bfrChart) {
		bfrChart.dispose();
	}
	
	const chartDom2 = document.getElementById('barChart2');
	if(chartDom2) {
		
		const myChart2 = echarts.init(chartDom2);
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'roadName') {
			if(type2 === 'reason') {
				maxCnt = Math.max(...roadNmReasonCnt.value);
				maxValue = Math.ceil(maxCnt / 1000) * 1000;
				if(selectChartReason.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {
								trigger: 'item',
								formatter: (params) => {
									const korNm = roadNmReasonKorNm.value[params.dataIndex];
									const regName = params.seriesName;
									const value = params.value;
									const color = params.color;
									return `
										<div style="display: flex; align-items:cneter;">
										<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
										${regName}<br>
										${korNm} : ${value.toLocaleString()}
										</div>
										`;
								}
							},
							legend: {
								data: ['지명자〮연마을이름', '행정구역명칭', '역사적인물기〮념', '문화재유〮적', '기타'],
								selectedMode: 'multiple'
							},
							xAxis: {
								type: 'category',
								data: roadNmReasonKorNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									name: '기타',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0499.value,
									itemStyle: {color: '#35354a'},
								},
								{
									name: '문화재유〮적',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0450.value,
									itemStyle: {color: '#59917d'},
								},
								{
									name: '역사적인물기〮념',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0440.value,
									itemStyle: {color: '#fadca0'},
								},
								{
									name: '행정구역명칭',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0420.value,
									itemStyle: {color: '#fca97c'},
								},
								{
									name: '지명자〮연마을이름',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0410.value,
									itemStyle: {color: '#fc7651'},
								},
								{
									name: '전체',
									type: 'bar',
									stack: 'total',
									data: roadNmReasonCnt.value.map(cnt => 0),
									label: {
										show: true,
										position: 'top',
										formatter: (params) => roadNmReasonCnt.value[params.dataIndex].toLocaleString(),
										color: '#000'
									},
									tooltip: {show: false}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartReason.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					console.log("roadNmReasonKorNm 값 : ", roadNmReasonKorNm);
					option = {
							tooltip: {
								trigger: 'item',
								formatter: (params) => {
									const korNm = roadNmReasonKorNm.value[params.dataIndex];
									const regName = params.seriesName;
									const value = params.value;
									const color = params.color;
									return `
										<div style="display: flex; align-items:cneter;">
										<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
										${regName}<br>
										${korNm} : ${value.toLocaleString()}
										</div>
										`;
								}
							},
							legend: {
								data: ['지명자〮연마을이름', '행정구역명칭', '역사적인물기〮념', '문화재유〮적', '기타'],
								selectedMode: 'multiple'
							},
							yAxis: {
								type: 'category',
								data: roadNmReasonKorNm.value,
								axisLabel: {
									interval: 0,
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									name: '기타',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0499.value,
									itemStyle: {color: '#35354a'},
								},
								{
									name: '문화재유〮적',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0450.value,
									itemStyle: {color: '#59917d'},
								},
								{
									name: '역사적인물기〮념',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0440.value,
									itemStyle: {color: '#fadca0'},
								},
								{
									name: '행정구역명칭',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0420.value,
									itemStyle: {color: '#fca97c'},
								},
								{
									name: '지명자〮연마을이름',
									type: 'bar',
									stack: 'total',
									data: roadNmReg0410.value,
									itemStyle: {color: '#fc7651'},
								},
								{
									name: '전체',
									type: 'bar',
									stack: 'total',
									data: roadNmReasonCnt.value.map(cnt => 0),
									label: {
										show: true,
										position: 'right',
										formatter: (params) => roadNmReasonCnt.value[params.dataIndex].toLocaleString(),
										color: '#000'
									},
									tooltip: {show: false}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartReason.value === 'setDoughnutChart') {
					//부여사유 미선택시
					if(roadNmReasonSelectedItem01.value.value === '' || roadNmReasonSelectedItem01.value.value === undefined || roadNmReasonSelectedItem01.value === '' || roadNmReasonSelectedItem01.value === undefined) {
						console.log("!!!!부여사유 미선택시");
						//시/도 미선택시
						if(roadNmReasonSelectedItem02.value.value === '' || roadNmReasonSelectedItem02.value.value === undefined) {
							console.log("!!!!부여사유 미선택시 + 시/도 미선택시");
							const totalReg0410 = roadNmReg0410.value.reduce((acc, cur) => acc + cur, 0);
							const totalReg0420 = roadNmReg0420.value.reduce((acc, cur) => acc + cur, 0);
							const totalReg0440 = roadNmReg0440.value.reduce((acc, cur) => acc + cur, 0);
							const totalReg0450 = roadNmReg0450.value.reduce((acc, cur) => acc + cur, 0);
							const totalReg0499 = roadNmReg0499.value.reduce((acc, cur) => acc + cur, 0);
							
							option = {
								tooltip: {
									trigger: 'item',
									formatter: (params) => {
										const korNm = params.name;
										const regName = params.seriesName;
										const value = params.value;
										const color = params.color;
										return `
											<div style="display: flex; align-items:cneter;">
											<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
											${korNm} : ${value.toLocaleString()}
											</div>
											`;
									}
								},
								series: [{
									type: 'pie',
									radius: ['40%', '70%',],
									data: [
										{value: totalReg0410, name: '지명자〮연마을이름'},
										{value: totalReg0420, name: '행정구역 명칭'},
										{value: totalReg0440, name: '역사적인물기〮념'},
										{value: totalReg0450, name: '문화재유〮적'},
										{value: totalReg0499, name: '기타'},
									]
								}]
							}
						//시/도 선택시
						} else if(roadNmReasonSelectedItem02.value.value != '' || roadNmReasonSelectedItem02.value.value != undefined) {
							console.log("!!!!부여사유 미선택시 + 시/도 선택시");
							const totalReg0410 = roadNmReg0410.value.reduce((acc, cur) => acc + cur, 0);
							const totalReg0420 = roadNmReg0420.value.reduce((acc, cur) => acc + cur, 0);
							const totalReg0440 = roadNmReg0440.value.reduce((acc, cur) => acc + cur, 0);
							const totalReg0450 = roadNmReg0450.value.reduce((acc, cur) => acc + cur, 0);
							const totalReg0499 = roadNmReg0499.value.reduce((acc, cur) => acc + cur, 0);
							
							option = {
								tooltip: {
									trigger: 'item',
									formatter: (params) => {
										const korNm = params.name;
										const regName = params.seriesName;
										const value = params.value;
										const color = params.color;
										return `
											<div style="display: flex; align-items:cneter;">
											<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
											${korNm} : ${value.toLocaleString()}
											</div>
											`;
									}
								},
								series: [{
									type: 'pie',
									radius: ['40%', '70%',],
									data: [
										{value: totalReg0410, name: '지명자〮연마을이름'},
										{value: totalReg0420, name: '행정구역 명칭'},
										{value: totalReg0440, name: '역사적인물기〮념'},
										{value: totalReg0450, name: '문화재유〮적'},
										{value: totalReg0499, name: '기타'},
									]
								}]
							}
						}
					//부여사유 선택시
					} else if(roadNmReasonSelectedItem01.value.value != '' || roadNmReasonSelectedItem01.value.value != undefined  || roadNmReasonSelectedItem01.value != '' || roadNmReasonSelectedItem01.value != undefined) {
						console.log("!!!!부여사유 선택시");
						//시/도 미선택시
						if(roadNmReasonSelectedItem02.value.value === '' || roadNmReasonSelectedItem02.value.value === undefined) {
							console.log("!!!!부여사유 선택시 + 시/도 미선택시");
							option = {
									tooltip: {},
									series: [
										{
											type: 'pie',
											radius: ['40%', '70%',],
											data: roadNmReasonKorNm.value.map((name, index) => ({
												name: name,
												value: roadNmReasonCnt.value[index]
											})),
											label: {
												show: true,
												formatter: '{b}'
											}
										},
									],
								};
						//시/도 선택시
						} else if(roadNmReasonSelectedItem02.value.value != '' || roadNmReasonSelectedItem02.value.value != undefined) {
							console.log("!!!!부여사유 선택시 + 시/도 선택시");
							option = {
									tooltip: {},
									series: [
										{
											type: 'pie',
											radius: ['40%', '70%',],
											data: roadNmReasonKorNm.value.map((name, index) => ({
												name: name,
												value: roadNmReasonCnt.value[index]
											})),
											label: {
												show: true,
												formatter: '{b}'
											}
										},
									],
									
								};
						}
					}
				}
				myChart2.on('click', async function (params) {
					console.log('차트 클릭됨', params);
					selectOption = '차트';
					const selectedReason = roadSidoCdSelectRegReason.value.find(item => item.label === params.name);
					if(selectedReason) {
						roadNmReasonSelectedItem02.value = selectedReason;
						if(roadNmReasonSelectedItem01.value.value) {
							console.log('roadNmReasonSelectedItem01 값 있음 : ', roadNmReasonSelectedItem01.value.value);
							fnGraphStatusReasonData(type1, type2, roadNmReasonSelectedItem01.value.value, roadNmReasonSelectedItem02.value.value);
						} else {
							console.log('roadNmReasonSelectedItem01 값 없음');
							fnGraphStatusReasonData(type1, type2, roadNmReasonSelectedItem01.value, roadNmReasonSelectedItem02.value.value);
						}
					} else {
						if(roadNmReasonSelectedItem01.value.value) {
							console.log('/////////////roadNmReasonSelectedItem01 값 있음 : ', roadNmReasonSelectedItem01.value.value);
							fnGraphStatusReasonData(type1, type2, roadNmReasonSelectedItem01.value.value, roadNmReasonSelectedItem02.value.value);
						} else {
							console.log('/////////////roadNmReasonSelectedItem01 값 없음');
							if(params.name === '지명자〮연마을이름') {
								roadNmReasonSelectedItem01.value = roadNmChoiceStatsCdAuth.value[1];
								fnGraphStatusReasonData(type1, type2, roadNmReasonSelectedItem01.value, roadNmReasonSelectedItem02.value.value);
							} else if(params.name === '행정구역 명칭') {
								roadNmReasonSelectedItem01.value = roadNmChoiceStatsCdAuth.value[2];
								fnGraphStatusReasonData(type1, type2, roadNmReasonSelectedItem01.value, roadNmReasonSelectedItem02.value.value);
							} else if(params.name === '역사적인물기〮념') {
								roadNmReasonSelectedItem01.value = roadNmChoiceStatsCdAuth.value[3];
								fnGraphStatusReasonData(type1, type2, roadNmReasonSelectedItem01.value, roadNmReasonSelectedItem02.value.value);
							} else if(params.name === '문화재유〮적') {
								roadNmReasonSelectedItem01.value = roadNmChoiceStatsCdAuth.value[4];
								fnGraphStatusReasonData(type1, type2, roadNmReasonSelectedItem01.value, roadNmReasonSelectedItem02.value.value);
							} else if(params.name === '기타') {
								roadNmReasonSelectedItem01.value = roadNmChoiceStatsCdAuth.value[5];
								fnGraphStatusReasonData(type1, type2, roadNmReasonSelectedItem01.value, roadNmReasonSelectedItem02.value.value);
							}
						}
					}
				})
				
				console.log("!!!!option : ", option);
				myChart2.setOption(option);
				window.addEventListener('resize', () => {
					myChart2.resize();
				});
			}
		}
	}
};

//차트 그리기(도로명 - 위계별)
const fnGraphRoadTypeStatus = async (type1, type2) => {
	console.log("차트 그리기");
	await nextTick();
	
	//차트변경시 기존 차트 지우기
	const bfrDom = document.getElementById('barChart3');
	const bfrChart = echarts.init(bfrDom);
	if (bfrChart) {
		bfrChart.dispose();
	}
	
	const chartDom3 = document.getElementById('barChart3');
	if(chartDom3) {
		const myChart3 = echarts.init(chartDom3);
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'roadName') {
			if(type2 === 'roadType') {
				maxCnt = Math.max(...roadNmTypeCnt.value);
				maxValue = Math.ceil(maxCnt / 1000) * 1000;
				if(selectChartRoadType.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {
								trigger: 'item',
								formatter: (params) => {
									const korNm = roadNmTypeKorNm.value[params.dataIndex];
									const regName = params.seriesName;
									const value = params.value;
									const color = params.color;
									return `
										<div style="display: flex; align-items:cneter;">
										<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
										${regName}<br>
										${korNm} : ${value.toLocaleString()}
										</div>
										`;
								}
							},
							legend: {
								data: ['고속도로', '대로', '로', '길'],
								selectedMode: 'multiple'
							},
							xAxis: {
								type: 'category',
								data: roadNmTypeKorNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									name: '고속도로',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeRoa01.value,
									itemStyle: {color: '#b9deb6'},
								},
								{
									name: '대로',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeRoa02.value,
									itemStyle: {color: '#d9ebd8'},
								},
								{
									name: '길',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeRoa04.value,
									itemStyle: {color: '#bd9666'},
								},
								{
									name: '로',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeRoa03.value,
									itemStyle: {color: '#faefcd'},
								},
								{
									name: '전체',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeCnt.value.map(cnt => 0),
									label: {
										show: true,
										position: 'top',
										formatter: (params) => roadNmTypeCnt.value[params.dataIndex].toLocaleString(),
										color: '#000'
									},
									tooltip: {show: false}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartRoadType.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					option = {
							tooltip: {
								trigger: 'item',
								formatter: (params) => {
									const korNm = roadNmTypeKorNm.value[params.dataIndex];
									const regName = params.seriesName;
									const value = params.value;
									const color = params.color;
									return `
										<div style="display: flex; align-items:cneter;">
										<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
										${regName}<br>
										${korNm} : ${value.toLocaleString()}
										</div>
										`;
								}
							},
							legend: {
								data: ['고속도로', '대로', '로', '길'],
								selectedMode: 'multiple'
							},
							yAxis: {
								type: 'category',
								data: roadNmTypeKorNm.value,
								axisLabel: {
									interval: 0,
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									name: '고속도로',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeRoa01.value,
									itemStyle: {color: '#b9deb6'},
								},
								{
									name: '대로',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeRoa02.value,
									itemStyle: {color: '#d9ebd8'},
								},
								{
									name: '길',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeRoa04.value,
									itemStyle: {color: '#bd9666'},
								},
								{
									name: '로',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeRoa03.value,
									itemStyle: {color: '#faefcd'},
								},
								{
									name: '전체',
									type: 'bar',
									stack: 'total',
									data: roadNmTypeCnt.value.map(cnt => 0),
									label: {
										show: true,
										position: 'right',
										formatter: (params) => roadNmTypeCnt.value[params.dataIndex].toLocaleString(),
										color: '#000'
									},
									tooltip: {show: false}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartRoadType.value === 'setDoughnutChart') {
					//위계구분 미선택시
					if(roadNmTypeSelectedItem01.value.value === '' || roadNmTypeSelectedItem01.value.value === undefined || roadNmTypeSelectedItem01.value === '' || roadNmTypeSelectedItem01.value === undefined) {
						console.log("!!!!위계구분 미선택시");
						//시/도 미선택시
						if(roadNmTypeSelectedItem02.value.value === '' || roadNmTypeSelectedItem02.value.value === undefined) {
							console.log("!!!!위계구분 미선택시 + 시/도 미선택시");
							const totalRoa01 = roadNmTypeRoa01.value.reduce((acc, cur) => acc + cur, 0);
							const totalRoa02 = roadNmTypeRoa02.value.reduce((acc, cur) => acc + cur, 0);
							const totalRoa03 = roadNmTypeRoa03.value.reduce((acc, cur) => acc + cur, 0);
							const totalRoa04 = roadNmTypeRoa04.value.reduce((acc, cur) => acc + cur, 0);
							
							option = {
								tooltip: {
									trigger: 'item',
									formatter: (params) => {
										const korNm = params.name;
										const regName = params.seriesName;
										const value = params.value;
										const color = params.color;
										return `
											<div style="display: flex; align-items:cneter;">
											<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
											${korNm} : ${value.toLocaleString()}
											</div>
											`;
									}
								},
								series: [{
									type: 'pie',
									radius: ['40%', '70%',],
									data: [
										{value: totalRoa01, name: '고속도로'},
										{value: totalRoa02, name: '대로'},
										{value: totalRoa03, name: '로'},
										{value: totalRoa04, name: '길'},
									]
								}]
							}
						//시/도 선택시
						} else if(roadNmTypeSelectedItem02.value.value != '' || roadNmTypeSelectedItem02.value.value != undefined) {
							console.log("!!!!위계구분 미선택시 + 시/도 선택시");
							const totalRoa01 = roadNmTypeRoa01.value.reduce((acc, cur) => acc + cur, 0);
							const totalRoa02 = roadNmTypeRoa02.value.reduce((acc, cur) => acc + cur, 0);
							const totalRoa03 = roadNmTypeRoa03.value.reduce((acc, cur) => acc + cur, 0);
							const totalRoa04 = roadNmTypeRoa04.value.reduce((acc, cur) => acc + cur, 0);
							
							option = {
								tooltip: {
									trigger: 'item',
									formatter: (params) => {
										const korNm = params.name;
										const regName = params.seriesName;
										const value = params.value;
										const color = params.color;
										return `
											<div style="display: flex; align-items:cneter;">
											<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
											${korNm} : ${value.toLocaleString()}
											</div>
											`;
									}
								},
								series: [{
									type: 'pie',
									radius: ['40%', '70%',],
									data: [
										{value: totalRoa01, name: '고속도로'},
										{value: totalRoa02, name: '대로'},
										{value: totalRoa03, name: '로'},
										{value: totalRoa04, name: '길'},
									]
								}]
							}
						}
					//부여사유 선택시
					} else if(roadNmTypeSelectedItem01.value.value != '' || roadNmTypeSelectedItem01.value.value != undefined  || roadNmTypeSelectedItem01.value != '' || roadNmTypeSelectedItem01.value != undefined) {
						console.log("!!!!위계구분 선택시");
						//시/도 미선택시
						if(roadNmTypeSelectedItem02.value.value === '' || roadNmTypeSelectedItem02.value.value === undefined) {
							console.log("!!!!위계구분 선택시 + 시/도 미선택시");
							
							console.log("roadNmTypeKorNm : ", roadNmTypeKorNm);
							console.log("roadNmTypeCnt : ", roadNmTypeCnt);
							option = {
									tooltip: {},
									series: [
										{
											type: 'pie',
											radius: ['40%', '70%',],
											data: roadNmTypeKorNm.value.map((name, index) => ({
												name: name,
												value: roadNmTypeCnt.value[index]
											})),
											label: {
												show: true,
												formatter: '{b}'
											}
										},
									],
								};
						//시/도 선택시
						} else if(roadNmTypeSelectedItem02.value.value != '' || roadNmTypeSelectedItem02.value.value != undefined) {
							console.log("!!!!위계구분 선택시 + 시/도 선택시");
							option = {
									tooltip: {},
									series: [
										{
											type: 'pie',
											radius: ['40%', '70%',],
											data: roadNmTypeKorNm.value.map((name, index) => ({
												name: name,
												value: roadNmTypeCnt.value[index]
											})),
											label: {
												show: true,
												formatter: '{b}'
											}
										},
									],
									
								};
						}
					}
				}
				
				myChart3.on('click', async function (params) {
					console.log('차트 클릭됨', params);
					selectOption = '차트';
					const selectedRoadType = roadSidoCdSelectRegRoadType.value.find(item => item.label === params.name);
					if(selectedRoadType) {
						roadNmTypeSelectedItem02.value = selectedRoadType;
						console.log('roadNmTypeSelectedItem02.value', selectedRoadType);
						if(roadNmTypeSelectedItem01.value.value) {
							console.log('roadNmTypeSelectedItem01 값 있음 : ', roadNmTypeSelectedItem01.value.value);
							fnGraphStatusRoadTypeData(type1, type2, roadNmTypeSelectedItem01.value.value, roadNmTypeSelectedItem02.value.value);
						} else {
							console.log('roadNmTypeSelectedItem01 값 없음');
							fnGraphStatusRoadTypeData(type1, type2, roadNmTypeSelectedItem01.value, roadNmTypeSelectedItem02.value.value);
						}
					} else {
						console.log('/////////////파이차트일 경우');
						if(roadNmTypeSelectedItem01.value.value) {
							console.log('/////////////roadNmTypeSelectedItem01 값 있음 : ', roadNmTypeSelectedItem01.value.value);
							fnGraphStatusRoadTypeData(type1, type2, roadNmTypeSelectedItem01.value.value, roadNmTypeSelectedItem02.value.value);
						} else {
							console.log('/////////////roadNmTypeSelectedItem01 값 없음');
							if(params.name === '고속도로') {
								roadNmTypeSelectedItem01.value = roadTypeCd.value[1];
								fnGraphStatusRoadTypeData(type1, type2, roadNmTypeSelectedItem01.value, roadNmTypeSelectedItem02.value.value);
							} else if(params.name === '대로') {
								roadNmTypeSelectedItem01.value = roadTypeCd.value[2];
								fnGraphStatusRoadTypeData(type1, type2, roadNmTypeSelectedItem01.value, roadNmTypeSelectedItem02.value.value);
							} else if(params.name === '로') {
								roadNmTypeSelectedItem01.value = roadTypeCd.value[3];
								fnGraphStatusRoadTypeData(type1, type2, roadNmTypeSelectedItem01.value, roadNmTypeSelectedItem02.value.value);
							} else if(params.name === '길') {
								roadNmTypeSelectedItem01.value = roadTypeCd.value[4];
								fnGraphStatusRoadTypeData(type1, type2, roadNmTypeSelectedItem01.value, roadNmTypeSelectedItem02.value.value);
							}
						}
					}
				})
				
				console.log("!!!!option : ", option);
				myChart3.setOption(option);
				window.addEventListener('resize', () => {
					myChart3.resize();
				});
			}
		}
	}
};

//차트 그리기(도로명 - 같은도로명)
const fnGraphSameRoadNmStatus = async (type1, type2) => {
	console.log("차트 그리기");
	await nextTick();
	
	//차트변경시 기존 차트 지우기
	const bfrDom = document.getElementById('barChart4');
	const bfrChart = echarts.init(bfrDom);
	if (bfrChart) {
		bfrChart.dispose();
	}
	
	const chartDom4 = document.getElementById('barChart4');
	if(chartDom4) {
		
		const myChart4 = echarts.init(chartDom4);
		
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'roadName') {
			if(type2 === 'sameRoadNm') {
				maxCnt = Math.max(...roadNmSameCnt.value);
				maxValue = Math.ceil(maxCnt / 100) * 100;
				console.log("차트 타입 : ", selectChartSameRoadNm.value);
				if(selectChartSameRoadNm.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {},
							xAxis: {
								type: 'category',
								data: roadNmSameKorNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: roadNmSameCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'top',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartSameRoadNm.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					option = {
							tooltip: {},
							yAxis: {
								type: 'category',
								data: roadNmSameKorNm.value,
								axisLabel: {
									interval: 0,
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: roadNmSameCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'right',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartSameRoadNm.value === 'setDoughnutChart') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setDoughnutChart");
					option = {
							tooltip: {},
							series: [
								{
									type: 'pie',
									radius: ['40%', '70%',],
									data: roadNmSameKorNm.value.map((name, index) => ({
										name: name,
										value: roadNmSameCnt.value[index]
									})),
									label: {
										show: true,
										formatter: '{b}'
									}
								},
							],
						};
				}
				myChart4.setOption(option);
				window.addEventListener('resize', () => {
					myChart4.resize();
				});
			}
		}
	}
};

//차트 그리기(도로명주소 - 지역별)
const fnGraphRoadNmAddrRegionStatus = async (type1, type2) => {
	console.log("차트 그리기");
	await nextTick();
	
	//차트변경시 기존 차트 지우기
	const bfrDom = document.getElementById('barChart5');
	if (bfrDom) {
		const bfrChart = echarts.init(bfrDom);
		if (bfrChart) {
			bfrChart.dispose();
		}
	}
	
	const chartDom5 = document.getElementById('barChart5');
	if(chartDom5) {
		const myChart5 = echarts.init(chartDom5);
		
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'roadNameAddr') {
			if(type2 === 'region') {
				maxCnt = Math.max(...roadNmAddrRegionCnt.value);
				maxValue = Math.ceil(maxCnt / 1000) * 1000;
				if(selectChartRoadNmAddrRegion.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {},
							xAxis: {
								type: 'category',
								data: roadNmAddrRegionKorNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
									hideOverlap: true
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: roadNmAddrRegionCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'top',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartRoadNmAddrRegion.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					option = {
							tooltip: {},
							yAxis: {
								type: 'category',
								data: roadNmAddrRegionKorNm.value,
								axisLabel: {
									interval: 0,
									hideOverlap: true
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: roadNmAddrRegionCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'right',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartRoadNmAddrRegion.value === 'setDoughnutChart') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setDoughnutChart");
					option = {
							tooltip: {},
							series: [
								{
									type: 'pie',
									radius: ['40%', '70%',],
									data: roadNmAddrRegionKorNm.value.map((name, index) => ({
										name: name,
										value: roadNmAddrRegionCnt.value[index]
									})),
									label: {
										show: true,
										formatter: '{b}'
									}
								},
							],
						};
				}
				myChart5.on('click', async function (params) {
					console.log('차트 클릭됨', params);
					selectOption = '차트';
					const selectedRoadNmAddrSido = detailAddrSidoCdSelectReg.value.find(item => item.label === params.name);
					const selectedRoadNmAddrSig = roadNmAddrSigSelectRegRegion.value.find(item => item.label === params.name);
					console.log("selectedRoadNmAddrSig : ", selectedRoadNmAddrSig);
					console.log("selectedRoadNmAddrSido : ", selectedRoadNmAddrSido);
					if(selectedRoadNmAddrSido && !selectedRoadNmAddrSig) {
						roadNmAddrRegionSelectedItem01.value = selectedRoadNmAddrSido;
						console.log('roadNmAddrRegionSelectedItem01.value', roadNmAddrRegionSelectedItem01.value);
						if(roadNmAddrRegionSelectedItem01.value.value) {
							console.log('selectedItem01 값 있음 : ', roadNmAddrRegionSelectedItem01.value.value);
							if(roadNmAddrRegionSelectedItem02.value.value) {
								console.log("시군구도 선택");
								fnGraphStatusRoadNmRegionData(type1, type2, roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);								
							} else {
								console.log("시도만 선택");
								fnSelectSig('roadNameAddr', 'region', 'sido', roadNmAddrRegionSelectedItem01.value, '')
								//fnGraphStatusRoadNmRegionData(type1, type2, roadNmAddrRegionSelectedItem01.value.value, '');
							}
						} else {
							console.log('실패');
						}
					} else {
						if(selectedRoadNmAddrSig.value === '36110') {
							roadNmAddrRegionSelectedItem01.value = selectedRoadNmAddrSido;
						}
						roadNmAddrRegionSelectedItem02.value = selectedRoadNmAddrSig;
						console.log('시군구 선택 : ', roadNmAddrRegionSelectedItem02.value);
						fnGraphStatusRoadNmRegionData(type1, type2, roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
					}
				});
				
				myChart5.setOption(option);
				window.addEventListener('resize', () => {
					myChart5.resize();
				});
			}
		}
	}
};

//차트 그리기(도로명주소 - 부여시기별)
const fnGraphRoadNmAddrPeriodStatus = async (type1, type2) => {
	console.log("차트 그리기");
	await nextTick();
	
	//차트변경시 기존 차트 지우기
	const bfrDom = document.getElementById('barChart6');
	const bfrChart = echarts.init(bfrDom);
	if (bfrChart) {
		bfrChart.dispose();
	}
	
	const chartDom6 = document.getElementById('barChart6');
	if(chartDom6) {
		const myChart6 = echarts.init(chartDom6);
		
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'roadNameAddr') {
			if(type2 === 'period') {
				maxCnt = Math.max(...roadNmAddrPeriodCnt.value);
				maxValue = Math.ceil(maxCnt / 1000) * 1000;
				
				if(selectChartRoadNmAddrPeriod.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {},
							xAxis: {
								type: 'category',
								data: roadNmAddrPeriodKorNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
									hideOverlap: true
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: roadNmAddrPeriodCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(61, 93, 255, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'top',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartRoadNmAddrPeriod.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					option = {
							tooltip: {},
							yAxis: {
								type: 'category',
								data: roadNmAddrPeriodKorNm.value,
								axisLabel: {
									interval: 0,
									hideOverlap: true
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: roadNmAddrPeriodCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(61, 93, 255, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'right',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartRoadNmAddrPeriod.value === 'setDoughnutChart') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setDoughnutChart");
					option = {
							tooltip: {},
							series: [
								{
									type: 'pie',
									radius: ['40%', '70%',],
									data: roadNmAddrPeriodKorNm.value.map((name, index) => ({
										name: name,
										value: roadNmAddrPeriodCnt.value[index]
									})),
									label: {
										show: true,
										formatter: '{b}'
									}
								},
							],
						};
				}
				myChart6.on('click', async function (params) {
					console.log('차트 클릭됨', params);
					selectOption = '차트';
					const selectedRoadNmAddrSido = detailAddrSidoCdSelectReg.value.find(item => item.label === params.name);
					const selectedRoadNmAddrSig = roadNmAddrSigSelectRegPeriod.value.find(item => item.label === params.name);
					console.log("selectedRoadNmAddrSido : ", selectedRoadNmAddrSido); 
					console.log("selectedRoadNmAddrSig : ", selectedRoadNmAddrSig);
					if(selectedRoadNmAddrSido && !selectedRoadNmAddrSig) {
						roadNmAddrPeriodSelectedItem01.value = selectedRoadNmAddrSido;
						console.log('roadNmAddrRegionSelectedItem01.value', roadNmAddrPeriodSelectedItem01.value);
						if(roadNmAddrPeriodSelectedItem01.value.value) {
							console.log('selectedItem01 값 있음 : ', roadNmAddrPeriodSelectedItem01.value.value);
							if(roadNmAddrPeriodSelectedItem02.value) {
								console.log("시군구도 선택");
								fnGraphStatusRoadNmPeriodData(type1, type2, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);								
							} else {
								console.log("시도만 선택");
								fnSelectSig('roadNameAddr', 'period', 'sido', roadNmAddrPeriodSelectedItem01.value, '')
							}
						} else {
							console.log('실패');
						}
					} else {
						if(selectedRoadNmAddrSig.value === '36110') {
							roadNmAddrPeriodSelectedItem01.value = selectedRoadNmAddrSido;
						}
						roadNmAddrPeriodSelectedItem02.value = selectedRoadNmAddrSig;
						console.log('시군구 선택 : ', roadNmAddrPeriodSelectedItem02.value);
						fnGraphStatusRoadNmPeriodData(type1, type2, roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
					}
				});
				myChart6.setOption(option);
				window.addEventListener('resize', () => {
					myChart6.resize();
				});
			}
		}
	}
};

//차트 그리기(상세주소 - 지역별)
const fnGraphDetailAddrStatus = async (type1, type2) => {
	console.log("차트 그리기");
	await nextTick();
	
	//차트변경시 기존 차트 지우기
	const bfrDom = document.getElementById('barChart7');
	const bfrChart = echarts.init(bfrDom);
	if (bfrChart) {
		bfrChart.dispose();
	}
	
	const chartDom7 = document.getElementById('barChart7');
	if(chartDom7) {
		const myChart7 = echarts.init(chartDom7);
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'detailAddr') {
			if(type2 === 'region') {
				maxCnt = Math.max(...detailAddrCnt.value);
				console.log('maxXnt : ', maxCnt);
				maxValue = Math.ceil(maxCnt / 1000) * 1000;
				console.log('maxValue : ', maxValue);
				console.log("상세주소(지역별) 차트 타입 : ", selectChartDetailAddr.value);
				if(selectChartDetailAddr.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {
								trigger: 'item',
								formatter: (params) => {
									const korNm = detailAddrKorNm.value[params.dataIndex];
									const regName = params.seriesName;
									const value = params.value;
									const color = params.color;
									return `
										<div style="display: flex; align-items:cneter;">
										<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
										${regName}<br>
										${korNm} : ${value.toLocaleString()}
										</div>
										`;
								}
							},
							legend: {
								data: ['단독', '다가구', '근린생활시설'],
								selectedMode: 'multiple'
							},
							xAxis: {
								type: 'category',
								data: detailAddrKorNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									name: '근린생활시설',
									type: 'bar',
									stack: 'total',
									data: detailAddrBdtyp03.value,
									itemStyle: {color: '#bae1e8'},
								},
								{
									name: '다가구',
									type: 'bar',
									stack: 'total',
									data: detailAddrBdtyp02.value,
									itemStyle: {color: '#79a2b5'},
								},
								{
									name: '단독',
									type: 'bar',
									stack: 'total',
									data: detailAddrBdtyp01.value,
									itemStyle: {color: '#2e396e'},
								},
								{
									name: '전체',
									type: 'bar',
									stack: 'total',
									data: detailAddrCnt.value.map(cnt => 0),
									label: {
										show: true,
										position: 'top',
										formatter: (params) => detailAddrCnt.value[params.dataIndex].toLocaleString(),
										color: '#000'
									},
									tooltip: {show: false}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartDetailAddr.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					option = {
							tooltip: {
								trigger: 'item',
								formatter: (params) => {
									const korNm = detailAddrKorNm.value[params.dataIndex];
									const regName = params.seriesName;
									const value = params.value;
									const color = params.color;
									return `
										<div style="display: flex; align-items:cneter;">
										<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
										${regName}<br>
										${korNm} : ${value.toLocaleString()}
										</div>
										`;
								}
							},
							legend: {
								data: ['단독', '다가구', '근린생활시설'],
								selectedMode: 'multiple'
							},
							yAxis: {
								type: 'category',
								data: detailAddrKorNm.value,
								axisLabel: {
									interval: 0,
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									name: '근린생활시설',
									type: 'bar',
									stack: 'total',
									data: detailAddrBdtyp03.value,
									itemStyle: {color: '#fadca0'},
								},
								{
									name: '다가구',
									type: 'bar',
									stack: 'total',
									data: detailAddrBdtyp02.value,
									itemStyle: {color: '#fca97c'},
								},
								{
									name: '단독',
									type: 'bar',
									stack: 'total',
									data: detailAddrBdtyp01.value,
									itemStyle: {color: '#fc7651'},
								},
								{
									name: '전체',
									type: 'bar',
									stack: 'total',
									data: detailAddrCnt.value.map(cnt => 0),
									label: {
										show: true,
										position: 'right',
										formatter: (params) => detailAddrCnt.value[params.dataIndex].toLocaleString(),
										color: '#000'
									},
									tooltip: {show: false}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartDetailAddr.value === 'setDoughnutChart') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setDoughnutChart");
					console.log("///부여건물유형 길이", detailAddrSelectedItem01.value);
					console.log("///시도 길이", detailAddrSelectedItem02.value);

					//위계구분 미선택시
					if(detailAddrSelectedItem01.value.value === '' || detailAddrSelectedItem01.value.value === undefined || detailAddrSelectedItem01.value === '' || detailAddrSelectedItem01.value === undefined) {
						console.log("!!!!상세주소(지역별) 부여건물유형 미선택시");
						//시/도 미선택시
						if(detailAddrSelectedItem02.value.value === '' || detailAddrSelectedItem02.value.value === undefined) {
							console.log("!!!!상세주소(지역별) 부여건물유형 미선택시 + 시/도 미선택시");
							const totalbdtyp01 = detailAddrBdtyp01.value.reduce((acc, cur) => acc + cur, 0);
							const totalbdtyp02 = detailAddrBdtyp02.value.reduce((acc, cur) => acc + cur, 0);
							const totalbdtyp03 = detailAddrBdtyp03.value.reduce((acc, cur) => acc + cur, 0);
							
							option = {
								tooltip: {
									trigger: 'item',
									formatter: (params) => {
										const korNm = params.name;
										const regName = params.seriesName;
										const value = params.value;
										const color = params.color;
										return `
											<div style="display: flex; align-items:cneter;">
											<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
											${korNm} : ${value.toLocaleString()}
											</div>
											`;
									}
								},
								series: [{
									type: 'pie',
									radius: ['40%', '70%',],
									data: [
										{value: totalbdtyp01, name: '단독'},
										{value: totalbdtyp02, name: '다가구'},
										{value: totalbdtyp03, name: '근린생활시설'},
									]
								}]
							}
						//시/도 선택시
						} else if(detailAddrSelectedItem02.value.value != '' || detailAddrSelectedItem02.value.value != undefined) {
							console.log("!!!!상세주소(지역별) 부여건물유형 미선택시 + 시/도 선택시");
							const totalbdtyp01 = detailAddrBdtyp01.value.reduce((acc, cur) => acc + cur, 0);
							const totalbdtyp02 = detailAddrBdtyp02.value.reduce((acc, cur) => acc + cur, 0);
							const totalbdtyp03 = detailAddrBdtyp03.value.reduce((acc, cur) => acc + cur, 0);
							
							option = {
								tooltip: {
									trigger: 'item',
									formatter: (params) => {
										const korNm = params.name;
										const regName = params.seriesName;
										const value = params.value;
										const color = params.color;
										return `
											<div style="display: flex; align-items:cneter;">
											<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 5px; margin-top: 5px;"></span>
											${korNm} : ${value.toLocaleString()}
											</div>
											`;
									}
								},
								series: [{
									type: 'pie',
									radius: ['40%', '70%',],
									data: [
										{value: totalbdtyp01, name: '단독'},
										{value: totalbdtyp02, name: '다가구'},
										{value: totalbdtyp03, name: '근린생활시설'},
									]
								}]
							}
						}
					//부여사유 선택시
					} else if(detailAddrSelectedItem01.value.value != '' || detailAddrSelectedItem01.value.value != undefined  || detailAddrSelectedItem01.value != '' || detailAddrSelectedItem01.value != undefined) {
						console.log("!!!!상세주소(지역별) 부여건물유형 선택시");
						//시/도 미선택시
						if(detailAddrSelectedItem02.value.value === '' || detailAddrSelectedItem02.value.value === undefined) {
							console.log("!!!!상세주소(지역별) 부여건물유형 선택시 + 시/도 미선택시");
							
							option = {
									tooltip: {},
									series: [
										{
											type: 'pie',
											radius: ['40%', '70%',],
											data: detailAddrKorNm.value.map((name, index) => ({
												name: name,
												value: detailAddrCnt.value[index]
											})),
											label: {
												show: true,
												formatter: '{b}'
											}
										},
									],
								};
						//시/도 선택시
						} else if(detailAddrSelectedItem02.value.value != '' || detailAddrSelectedItem02.value.value != undefined) {
							console.log("!!!!상세주소(지역별) 부여건물유형 선택시 + 시/도 선택시");
							option = {
									tooltip: {},
									series: [
										{
											type: 'pie',
											radius: ['40%', '70%',],
											data: detailAddrKorNm.value.map((name, index) => ({
												name: name,
												value: detailAddrCnt.value[index]
											})),
											label: {
												show: true,
												formatter: '{b}'
											}
										},
									],
									
								};
						}
					}
				}
				
				myChart7.on('click', async function (params) {
					console.log('차트 클릭됨', params);
					selectOption = '차트';
					const selectedDetailAddr = detailAddrSidoCdSelectReg.value.find(item => item.label === params.name);
					if(selectedDetailAddr) {
						detailAddrSelectedItem02.value = selectedDetailAddr;
						console.log('detailAddrSelectedItem02.value', selectedDetailAddr);
						if(detailAddrSelectedItem01.value.value) {
							console.log('detailAddrSelectedItem01 값 있음 : ', detailAddrSelectedItem01.value.value);
							fnGraphStatusDetailAddrData(type1, type2, detailAddrSelectedItem01.value.value, detailAddrSelectedItem02.value.value);
						} else {
							console.log('detailAddrSelectedItem01 값 없음');
							fnGraphStatusDetailAddrData(type1, type2, detailAddrSelectedItem01.value, detailAddrSelectedItem02.value.value);
						}
					} else {
						console.log('/////////////파이차트일 경우');
						if(detailAddrSelectedItem01.value.value) {
							console.log('/////////////detailAddrSelectedItem01 값 있음 : ', detailAddrSelectedItem01.value.value);
							fnGraphStatusDetailAddrData(type1, type2, detailAddrSelectedItem01.value.value, detailAddrSelectedItem02.value.value);
						} else {
							console.log('/////////////detailAddrSelectedItem01 값 없음');
							if(params.name === '단독') {
								detailAddrSelectedItem01.value = bdtypCd.value[1];
								fnGraphStatusDetailAddrData(type1, type2, detailAddrSelectedItem01.value, detailAddrSelectedItem02.value.value);
							} else if(params.name === '다가구') {
								detailAddrSelectedItem01.value = bdtypCd.value[2];
								fnGraphStatusDetailAddrData(type1, type2, detailAddrSelectedItem01.value, detailAddrSelectedItem02.value.value);
							} else if(params.name === '근린생활시설') {
								detailAddrSelectedItem01.value = bdtypCd.value[3];
								fnGraphStatusDetailAddrData(type1, type2, detailAddrSelectedItem01.value, detailAddrSelectedItem02.value.value);
							}
						}
					}
				})
				
				console.log("!!!!option : ", option);
				myChart7.setOption(option);
				window.addEventListener('resize', () => {
					myChart7.resize();
				});
			}
		}
	}
};

//차트 그리기(기초구역 - 지역별)
const fnGraphBasStatus = async (type1, type2) => {
	console.log("차트 그리기");
	await nextTick();
	
	//차트변경시 기존 차트 지우기
	const bfrDom = document.getElementById('barChart8');
	const bfrChart = echarts.init(bfrDom);
	if (bfrChart) {
		bfrChart.dispose();
	}
	
	const chartDom8 = document.getElementById('barChart8');
	if(chartDom8) {
		const myChart8 = echarts.init(chartDom8);
		
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'bas') {
			if(type2 === 'region') {
				maxCnt = Math.max(...basCnt.value);
				maxValue = Math.ceil(maxCnt / 1000) * 1000;
				if(selectChartbas.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {},
							xAxis: {
								type: 'category',
								data: basKorNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: basCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'top',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartbas.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					option = {
							tooltip: {},
							yAxis: {
								type: 'category',
								data: basKorNm.value,
								axisLabel: {
									interval: 0,
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: basCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'right',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartbas.value === 'setDoughnutChart') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setDoughnutChart");
					option = {
							tooltip: {},
							series: [
								{
									type: 'pie',
									radius: ['40%', '70%',],
									data: basKorNm.value.map((name, index) => ({
										name: name,
										value: basCnt.value[index]
									})),
									label: {
										show: true,
										formatter: '{b}'
									}
								},
							],
						};
				}
				
				myChart8.on('click', async function (params) {
					selectOption = '차트';
					console.log('차트 클릭됨', params);
					const selectedBas = detailAddrSidoCdSelectReg.value.find(item => item.label === params.name);
					if(selectedBas) {
						basSelectedItem01.value = selectedBas;
						if(basSelectedItem01.value.value) {
							console.log('basSelectedItem01 값 있음 : ', basSelectedItem01.value.value);
							fnGraphStatusBasData(type1, type2, basSelectedItem01.value.value);
						} else {
							console.log('basSelectedItem01 값 없음');
							fnGraphStatusBasData(type1, type2, basSelectedItem01.value);
						}
					}
				})
				
				myChart8.setOption(option);
				window.addEventListener('resize', () => {
					myChart8.resize();
				});
			}
		}
	}
};

//차트 그리기(주소정보이용추이 - 주소정보 다운로드)
const fnGraphDbAddrInfoStatus = async (type1, type2) => {
	console.log("차트 그리기");
	await nextTick();
	const chartDom9 = document.getElementById('barChart9');
	if(chartDom9) {
		const myChart9 = echarts.init(chartDom9);
		
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'db') {
			if(type2 === 'addrInfo') {
				maxCnt = Math.max(...dbAddrInfoCnt.value);
				maxValue = Math.ceil(maxCnt / 1000) * 1000;
				if(selectChartDbAddrInfo.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {},
							xAxis: {
								type: 'category',
								data: dbAddrInfoKndNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: dbAddrInfoCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'top',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartDbAddrInfo.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					option = {
							tooltip: {},
							yAxis: {
								type: 'category',
								data: dbAddrInfoKndNm.value,
								axisLabel: {
									interval: 0,
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: dbAddrInfoCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'right',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartDbAddrInfo.value === 'setDoughnutChart') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setDoughnutChart");
					option = {
							tooltip: {},
							series: [
								{
									type: 'pie',
									radius: ['40%', '70%',],
									data: dbAddrInfoKndNm.value.map((name, index) => ({
										name: name,
										value: dbAddrInfoCnt.value[index]
									})),
									label: {
										show: true,
										formatter: '{b}'
									}
								},
							],
						};
				}
				myChart9.setOption(option);
				window.addEventListener('resize', () => {
					myChart9.resize();
				});
			}
		}
	}
};

//차트 그리기(주소정보이용추이 - 지도(공간)정보 다운로드)
const fnGraphDbMapInfoStatus = async (type1, type2) => {
	console.log("차트 그리기");
	await nextTick();
	const chartDom10 = document.getElementById('barChart10');
	if(chartDom10) {
		const myChart10 = echarts.init(chartDom10);
		
		let option;
		let maxCnt;
		let maxValue;
		
		if(type1 === 'db') {
			if(type2 === 'mapInfo') {
				maxCnt = Math.max(...dbMapInfoCnt.value);
				maxValue = Math.ceil(maxCnt / 1000) * 1000;
				if(selectChartDbMapInfo.value === 'setBarChartX') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartX");
					option = {
							tooltip: {},
							xAxis: {
								type: 'category',
								data: dbMapInfoKndNm.value,
								axisLabel: {
									rotate: 45,
									interval: 0,
								}
							},
							yAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: dbMapInfoCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'top',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("차트 option : ", option);
				} else if(selectChartDbMapInfo.value === 'setBarChartY') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setBarChartY");
					option = {
							tooltip: {},
							yAxis: {
								type: 'category',
								data: dbMapInfoKndNm.value,
								axisLabel: {
									interval: 0,
								}
							},
							xAxis: {
								type: 'value',
								min: 0,
								max: maxValue,
								interval: maxValue / 5,
							},
							series: [
								{
									data: dbMapInfoCnt.value.map((cnt, index) => ({
										value: cnt,
										itemStyle: {
											color: `rgba(247, 70, 12, ${cnt / maxCnt})`,
										}
									})),
									type: 'bar',
									label: {
										show: true,
										position: 'right',
										formatter: (params) => {
											return params.value.toLocaleString();
										}
									}
								},
							],
						};
					console.log("option", option);
				} else if(selectChartDbMapInfo.value === 'setDoughnutChart') {
					console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~setDoughnutChart");
					option = {
							tooltip: {},
							series: [
								{
									type: 'pie',
									radius: ['40%', '70%',],
									data: dbMapInfoKndNm.value.map((name, index) => ({
										name: name,
										value: dbMapInfoCnt.value[index]
									})),
									label: {
										show: true,
										formatter: '{b}'
									}
								},
							],
						};
				}
				myChart10.setOption(option);
				window.addEventListener('resize', () => {
					myChart10.resize();
				});
			}
		}
	}
};

/**
 * 메뉴별 맵 정보 분류
 * @param type1
 * @param type2
 * @param mapType
 */
const fnMap = (type1, type2, mapType) => {
	console.log("맵차트 : ", mapType);
	
	if(type1 === 'roadName') {
		if(type2 === 'region') {
      isMapLoading.mapChart01 = true;
			if(mapType === 'mapColorChart') {
				console.log('mapColorChart');
				console.log("selectedItem02 : ", selectedItem02.value);
				isDataLoaded = false
				fnMapStatus(type1, type2, selectedItem02.value.value);
			} else if(mapType === 'mapBubbleChart') {
				console.log('mapBubbleChart');
				isDataLoaded = false
				fnMapStatus(type1, type2, selectedItem02.value.value);
			}
		} else if(type2 === 'reason') {
      isMapLoading.mapChart02 = true;
			if(mapType === 'mapColorChart') {
				console.log('mapColorChart');
				console.log("roadNmReasonSelectedItem02 : ", roadNmReasonSelectedItem02.value);
				isDataLoaded = false
				fnMapStatus(type1, type2, roadNmReasonSelectedItem02.value.value);
			} else if(mapType === 'mapBubbleChart') {
				console.log('mapBubbleChart');
				isDataLoaded = false
				fnMapStatus(type1, type2, roadNmReasonSelectedItem02.value.value);
			}
		} else if(type2 === 'roadType') {
      isMapLoading.mapChart03 = true;
			if(mapType === 'mapColorChart') {
				console.log('mapColorChart');
				console.log("roadNmTypeSelectedItem02 : ", roadNmTypeSelectedItem02.value);
				isDataLoaded = false
				fnMapStatus(type1, type2, roadNmTypeSelectedItem02.value.value);
			} else if(mapType === 'mapBubbleChart') {
				console.log('mapBubbleChart');
				isDataLoaded = false
				fnMapStatus(type1, type2, roadNmTypeSelectedItem02.value.value);
			}
		}
	} else if(type1 === 'roadNameAddr') {
		if(type2 === 'region') {
      isMapLoading.mapChart04 = true;
			if(mapType === 'mapColorChart') {
				console.log('mapColorChart');
				console.log('roadNmAddrRegionSelectedItem01.value : ', roadNmAddrRegionSelectedItem01.value);
				console.log('roadNmAddrRegionSelectedItem02.value : ', roadNmAddrRegionSelectedItem02.value);
				if(roadNmAddrRegionSelectedItem01.value && !roadNmAddrRegionSelectedItem02.value.value) {
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrRegionSelectedItem01.value.value);
				} else if(roadNmAddrRegionSelectedItem01.value && roadNmAddrRegionSelectedItem02.value) {
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrRegionSelectedItem02.value.value);
				} else {
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				}
			} else if(mapType === 'mapBubbleChart') {
				console.log('mapBubbleChart');
				if(roadNmAddrRegionSelectedItem01.value && !roadNmAddrRegionSelectedItem02.value.value) {
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrRegionSelectedItem01.value.value);
				} else if(roadNmAddrRegionSelectedItem01.value && roadNmAddrRegionSelectedItem02.value) {
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrRegionSelectedItem02.value.value);
				} else {
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				}
			}
		} else if(type2 === 'period') {
      isMapLoading.mapChart05 = true;
			if(mapType === 'mapColorChart') {
				console.log('mapColorChart');
				if(roadNmAddrPeriodSelectedItem01.value && !roadNmAddrPeriodSelectedItem02.value.value) {
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrPeriodSelectedItem01.value.value);
				} else if(roadNmAddrPeriodSelectedItem01.value && roadNmAddrPeriodSelectedItem02.value) {
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrPeriodSelectedItem02.value.value);
				} else {
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				}
			} else if(mapType === 'mapBubbleChart') {
				console.log('mapBubbleChart');
				if(roadNmAddrPeriodSelectedItem01.value && !roadNmAddrPeriodSelectedItem02.value.value) {
					console.log("시도 있음");
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrPeriodSelectedItem01.value.value);
				} else if(roadNmAddrPeriodSelectedItem01.value && roadNmAddrPeriodSelectedItem02.value) {
					console.log("시도/시군구 있음")
					isDataLoaded = false
					fnMapStatus(type1, type2, roadNmAddrPeriodSelectedItem02.value.value);
				} else {
					console.log("전체")
					isDataLoaded = false
					fnMapStatus(type1, type2, '');
				}
			}
		}
	} else if(type1 === 'detailAddr') {
		if(type2 === 'region') {
      isMapLoading.mapChart06 = true;
			if(mapType === 'mapColorChart') {
				console.log('mapColorChart');
				isDataLoaded = false
				fnMapStatus(type1, type2, detailAddrSelectedItem02.value.value);
			} else if(mapType === 'mapBubbleChart') {
				console.log('mapBubbleChart');
				isDataLoaded = false
				fnMapStatus(type1, type2, detailAddrSelectedItem02.value.value);
			}
		}
	} else if(type1 === 'bas') {
		if(type2 === 'region') {
      isMapLoading.mapChart07 = true;
			if(mapType === 'mapColorChart') {
				console.log('mapColorChart');
				isDataLoaded = false
				fnMapStatus(type1, type2, basSelectedItem01.value.value);
			} else if(mapType === 'mapBubbleChart') {
				console.log('mapBubbleChart');
				isDataLoaded = false
				fnMapStatus(type1, type2, basSelectedItem01.value.value);
			}
		}
	}
}

let isDataLoaded = false;

/**
 * 맵 데이터 세팅
 * @param type1
 * @param type2
 * @param admCd
 */
const fnMapStatus = (type1, type2, admCd) => {
	console.log("admCd : ", admCd);
	if(selectOption = '지도') {
		console.log("fnMapStatus selectOption : ", selectOption);
			axios.post('/api/ahs/main-map', {
				admCd: admCd,
				dataType : 'buld',
			}).then(response => {
				
				console.log("isDataLoaded : ", isDataLoaded);
				
				if(isDataLoaded) {
					return;
				}
				
				const jsonString = response.data.results;
				const geoJsonData = JSON.parse(jsonString);
				
				isDataLoaded = true;
				
				console.log("geoJsonData1 : ", geoJsonData);
				
				let features;
				
				if(geoJsonData.allInfo) {
					features = geoJsonData.allInfo.features;
				} else {
					features = geoJsonData.featureInfo.features;
				}
				
				console.log("selectMapChartRoadNmAddrPeriod : ", selectMapChartRoadNmAddrPeriod.value);
				
				if(features) {
					console.log("features : ", features);
					if(type1 === 'roadName') {
						//도로명(지역별)
						if(type2 === 'region') {
							const updateFeatures = features.map((feature, index) => {
								const colADmSe = feature.properties.COL_ADM_SE;
								const matchedRegion = regionColumns.value.find(region => region.roadNmAdmCd == colADmSe);
								console.log("matchedReg", matchedRegion);
								if(matchedRegion) {
									feature.properties.name = matchedRegion.roadNmKorNm;
									feature.properties.roadNmCnt = matchedRegion.roadNmCnt;
									feature.id = (index + 1).toString();
									return feature;
								}
								return null;
							})
							.filter(feature => feature !== null);
							
							const updateGeoData = {
									...geoJsonData.allInfo,
									features: updateFeatures
							};
							
							console.log("updateGeoData : ", updateGeoData);
							if(selectMapChartRegion.value === 'mapColorChart') {
								console.log("맵차트");
								renderMap(updateGeoData);
							} else if(selectMapChartRegion.value === 'mapBubbleChart') {
								console.log("맵버블차트");
								renderMap(updateGeoData);
							}
              isMapLoading.mapChart01 = false;
						//도로명(부여사유별)
						} else if(type2 === 'reason') {
							const updateFeatures = features.map((feature, index) => {
								
								const colADmSe = feature.properties.COL_ADM_SE;
								const matchedRegion = reasonColumns.value.find(reason => reason.roadNmReasonAdmCd.replace(/,/g, '') == colADmSe);
								
								if(matchedRegion) {
									feature.properties.name = matchedRegion.roadNmReasonKorNm;
									feature.properties.roadNmReasonCnt = matchedRegion.roadNmReasonCnt;
								}
								
								feature.id = (index + 1).toString();
								
								return feature;
							})
							
							const updateGeoData = {
									...geoJsonData.allInfo,
									features: updateFeatures
							};
							
							console.log("부여사유별 updateGeoData : ", updateGeoData);
							if(selectMapChartRegion.value === 'mapColorChart') {
								console.log("맵차트");
								roadNmReasonMap(updateGeoData);
							} else if(selectMapChartRegion.value === 'mapBubbleChart') {
								console.log("맵버블차트");
								roadNmReasonMap(updateGeoData);
							}
              isMapLoading.mapChart02 = false;
						//도로명(위계별)
						} else if(type2 === 'roadType') {
							const updateFeatures = features.map((feature, index) => {
								
								const colADmSe = feature.properties.COL_ADM_SE;
								const matchedRegion = roadTypeColumns.value.find(roadType => roadType.roadNmTypeAdmCd.replace(/,/g, '') == colADmSe);
								
								if(matchedRegion) {
									feature.properties.name = matchedRegion.roadNmTypeKorNm;
									feature.properties.roadNmTypeCnt = matchedRegion.roadNmTypeCnt;
								}
								
								feature.id = (index + 1).toString();
								
								return feature;
							})
							
							const updateGeoData = {
									...geoJsonData.allInfo,
									features: updateFeatures
							};
							
							console.log("위계별 updateGeoData : ", updateGeoData);
							if(selectMapChartRoadType.value === 'mapColorChart') {
								console.log("맵차트");
								roadNmRoadTypeMap(updateGeoData);
							} else if(selectMapChartRoadType.value === 'mapBubbleChart') {
								console.log("맵버블차트");
								roadNmRoadTypeMap(updateGeoData);
							}
              isMapLoading.mapChart03 = false;
						}
					} else if(type1 === 'roadNameAddr') {
						//도로명주소(지역별)
						if(type2 === 'region') {
							console.log("roadNmAddrRegionColumns.value : ", roadNmAddrRegionColumns.value);
							const updateFeatures = features.map((feature, index) => {
								const colADmSe = feature.properties.EMD_CD ? feature.properties.EMD_CD : feature.properties.COL_ADM_SE;
								const matchedRegion = roadNmAddrRegionColumns.value.find(region => region.roadNmAddrRegionAdmCd.replace(/,/g, '') == colADmSe);
								
								if(matchedRegion) {
									feature.properties.name = matchedRegion.roadNmAddrRegionKorNm;
									feature.properties.roadNmAddrRegionCnt = matchedRegion.roadNmAddrRegionCnt;
								}
								
								feature.id = (index + 1).toString();
								
								return feature;
							})
							
							const updateGeoData = {
									...geoJsonData.allInfo,
									features: updateFeatures
							};
							
							console.log("도로명주소(지역별) updateGeoData : ", updateGeoData);
							if(selectMapChartRoadNmAddrRegion.value === 'mapColorChart') {
								console.log("맵차트");
								roadNmAddrRegionMap(updateGeoData);
							} else if(selectMapChartRoadNmAddrRegion.value === 'mapBubbleChart') {
								console.log("맵버블차트");
								roadNmAddrRegionMap(updateGeoData);
							}
              isMapLoading.mapChart04 = false;
						//도로명주소(부여시기별)
						} else if(type2 === 'period') {
							console.log("roadNmAddrPeriodColumns.value : ", roadNmAddrPeriodColumns.value);
							const updateFeatures = features.map((feature, index) => {
								const colADmSe = feature.properties.EMD_CD ? feature.properties.EMD_CD : feature.properties.COL_ADM_SE;
								const matchedRegion = roadNmAddrPeriodColumns.value.find(region => region.roadNmAddrPeriodAdmCd.replace(/,/g, '') == colADmSe);
								
								if(matchedRegion) {
									feature.properties.name = matchedRegion.roadNmAddrPeriodKorNm;
									feature.properties.roadNmAddrPeriodCnt = matchedRegion.roadNmAddrPeriodCnt;
								}
								
								feature.id = (index + 1).toString();
								
								return feature;
							})
							
							const updateGeoData = {
									...geoJsonData.allInfo,
									features: updateFeatures
							};
							
							console.log("도로명주소(부여시기별) updateGeoData : ", updateGeoData);
							console.log("selectMapChartRoadNmAddrPeriod.value : ", selectMapChartRoadNmAddrPeriod.value);
							if(selectMapChartRoadNmAddrPeriod.value === 'mapColorChart') {
								console.log("맵차트");
								roadNmAddrPeriodMap(updateGeoData);
							} else if(selectMapChartRoadNmAddrPeriod.value === 'mapBubbleChart') {
								console.log("맵버블차트");
								roadNmAddrPeriodMap(updateGeoData);
							}
              isMapLoading.mapChart05 = false;
						}
					//상세주소(지역별)
					} else if(type1 === 'detailAddr') {
						if(type2 === 'region') {
							console.log("상세주소 detailAddrColumns : ", detailAddrColumns);
							const updateFeatures = features.map((feature, index) => {
								
								const colADmSe = feature.properties.COL_ADM_SE;
								const matchedRegion = detailAddrColumns.value.find(reason => reason.detailAddrAdmCd.replace(/,/g, '') == colADmSe);
								
								if(matchedRegion) {
									feature.properties.name = matchedRegion.detailAddrKorNm;
									feature.properties.detailAddrCnt = matchedRegion.detailAddrCnt;
								}
								
								feature.id = (index + 1).toString();
								
								return feature;
							})
							
							const updateGeoData = {
									...geoJsonData.allInfo,
									features: updateFeatures
							};
							
							console.log("상세주소(지역별) updateGeoData : ", updateGeoData);
							if(selectMapChartDetailAddr.value === 'mapColorChart') {
								console.log("맵차트");
								detailAddrRegionMap(updateGeoData);
							} else if(selectMapChartDetailAddr.value === 'mapBubbleChart') {
								console.log("맵버블차트");
								detailAddrRegionMap(updateGeoData);
							}
              isMapLoading.mapChart06 = false;
						}
					//기초구역(지역별)
					} else if(type1 === 'bas') {
						if(type2 === 'region') {
							const updateFeatures = features.map((feature, index) => {
								
								const colADmSe = feature.properties.COL_ADM_SE;
								const matchedRegion = basColumns.value.find(reason => reason.basAdmCd.replace(/,/g, '') == colADmSe);
								
								if(matchedRegion) {
									feature.properties.name = matchedRegion.basKorNm;
									feature.properties.basCnt = matchedRegion.basCnt;
								}
								
								feature.id = (index + 1).toString();
								
								return feature;
							})
							
							const updateGeoData = {
									...geoJsonData.allInfo,
									features: updateFeatures
							};
							
							console.log("기추구역(지역별) updateGeoData : ", updateGeoData);
							if(selectMapChartbas.value === 'mapColorChart') {
								console.log("맵차트");
								basRegionMap(updateGeoData);
							} else if(selectMapChartbas.value === 'mapBubbleChart') {
								console.log("맵버블차트");
								basRegionMap(updateGeoData);
							}
              isMapLoading.mapChart07 = false;
						}
					}
				} else {
					console.log("에러");
				}
		    }).catch(e => {
		      	console.log('fnGetGeoJsonData Fail', e);
		    });
	}
}

//도로명(지역별) 지도
const renderMap = async (geoJsonData) => {
	console.log("selectMapChartRegion.value : ", selectMapChartRegion.value);
	await nextTick();
	const mapChartDom = document.getElementById('mapChart');
	
	console.log("mapChartDom : ", mapChartDom);
	
	const mapChart = echarts.init(mapChartDom);
	
	mapChart.hideLoading();
	echarts.registerMap('customMap', geoJsonData);
	
	console.log("geoJsonData : ", geoJsonData);
	
	const maxRoadNmCnt = Math.max(...geoJsonData.features.map(feature => {
		console.log("feature.properties.roadNmCnt : ", feature.properties.roadNmCnt);
		const countStr = feature.properties.roadNmCnt ? feature.properties.roadNmCnt.replace(/,/g, '') : 0;
		const count = Number(countStr);
		if(isNaN(count)){
			console.log(`${feature.properties.roadNmKorNm} : ${countStr}`)
		}
		return isNaN(count) ? 0 : count;
	}));
	
	console.log("maxRoadNmCnt : ", maxRoadNmCnt);
	
	const roundedMax = Math.ceil(maxRoadNmCnt / 10) * 10;
	
	if(!selectedItem02.value) {
		selectedItem02.value = {label: '전체', value: ''};
	}
	
	const titleValue = selectedItem02.value.label === '전체' 
		? '전국' 
		: '{underline|전국} > ' + selectedItem02.value.label;
	const paddingValue = selectedItem02.value.label.length > 5 ? [9, 20] : [9, 10];
	
		if(mapChart) {
			if(selectMapChartRegion.value === 'mapColorChart') {
				const option = {
						title: {
							text: titleValue,
							position: 'left',
							top: '5%',
							textStyle: {
								rich: {
									underline: {
										textDecoration: 'underline',
										fontSize: 10,
									}
								},
								color: '#5a5c5a',
								fontSize: 10,
							},
							borderColor: '#5a5c5a',
							borderWidth: 1,
							borderRadius: 3,
							padding: paddingValue,
							triggerEvent: true,
						},
						visualMap: {
							min: 0,
							max: roundedMax,
							text: ['High', 'Low'],
							realtime: false,
							calculable: true,
							inRange: {
								color: ['#90ee90', '#32cd32', '#008000']
							},
							outRange: {
								color: ['rgba(0, 0, 0, 0)']
							},
							right: '2%',
							formatter: (value) => Math.floor(value).toLocaleString()
						},
						tooltip: {
							formatter: (params) => {
								const count = params.data ? params.data.properties.roadNmCnt : 0;
								return `${params.name}<br/>${count}(건)`;
							}
						},
						series: [
							{
								type: 'map',
								map: 'customMap',
								scaleLimit: {
									min: 1,
									max: 7
								},
								roam: true,
								label: {
									show: selectedItem02.value.label !== '전체',
									fontSize: 10,
									formatter: (params) => {
										return `${params.name}`;
									}
								},
								labelLayout: {
									hideOverlap: true
								},
								itemStyle: {
									borderColor: '#fff',
									borderWidth: 0.5
								},
								data: geoJsonData.features.map(feature => ({
									//id: feature.id,
									name: feature.properties.name,
									value: feature.properties.roadNmCnt ? Number(feature.properties.roadNmCnt.replace(/,/g, '')) : 0,
									properties: feature.properties
								}))
							}
						]
				};
			console.log("option : ", option);
			
			mapChart.clear();
			mapChart.setOption(option);
			
			mapChart.on('click', async (params) => {
				console.log("params : ", params);
				
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart.getOption().title[0]);
					
					const currentOption = mapChart.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							selectedItem02.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRegionData('roadName', 'region', selectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadName', 'region', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					if(admCd.length === 2) {
						console.log("admCd : ", admCd);
						selectedItem02.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnGraphStatusRegionData('roadName', 'region', selectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('roadName', 'region', admCd);
					}
				} else {
					console.log("실패");
				} 
			})
			
			window.addEventListener('resize', () => {
				mapChart.resize();
			});
			
		} else if(selectMapChartRegion.value === 'mapBubbleChart') {
			console.log("버블차트");
			const getCenter = (coordinates) => {
				let totalX = 0, totalY = 0, count = 0;
				const traverseCoordinates = (coords) => {
					coords.forEach(coord => {
						if(Array.isArray(coord)) {
							if(coord.length === 2) {
								totalX += coord[0];
								totalY += coord[1];
								count++;
							} else {
								traverseCoordinates(coord);
							}
						}
					})	
				};
				
				if(coordinates.geometry.type === 'Polygon') {
					traverseCoordinates(coordinates.geometry.coordinates);
				} else if(coordinates.geometry.type === 'MultiPolygon') {
					coordinates.geometry.coordinates.forEach(polygonCoords => {
						traverseCoordinates(polygonCoords)
					})
				}
				
				if(count > 0) {
					return [totalX / count, totalY / count];
				} else {
					return [NaN, NaN];
				}
			}
			
			const maxCnt = Math.max(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmCnt ? Number(feature.properties.roadNmCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}));
			
			const minCnt = Math.min(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmCnt ? Number(feature.properties.roadNmCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}))
			
			console.log("maxCnt : ", maxCnt, " minCnt : ", minCnt)
			
			const getColorForCount = (count) => {
				const percentage = (count - minCnt) / (maxCnt - minCnt);
				const red = Math.floor(0 - (percentage * 100));
				const green = Math.floor(128 - (percentage * 50));
				const blue = Math.floor(0 - (percentage * 5));
				
				return `rgb(${red}, ${green}, ${blue})`
			};
			
			const option = {
					title: {
						text: titleValue,
						position: 'left',
						top: '5%',
						textStyle: {
							rich: {
								underline: {
									textDecoration: 'underline',
									fontSize: 10,
								}
							},
							color: '#5a5c5a',
							fontSize: 10,
						},
						borderColor: '#5a5c5a',
						borderWidth: 1,
						borderRadius: 3,
						padding: paddingValue,
						triggerEvent: true,
					},
					tooltip: {
						formatter: (params) => {
							const count = params.data ? params.data.properties.roadNmCnt : 0;
							return `${params.name}<br/>${count}(건)`;
						}
					},
					geo: {
						map: 'customMap',
						roam: true,
						scaleLimit: {
							min: 1,
							max: 7
						},
						itemStyle: {
							areaColor: '#ffffff',
							borderColor: '#dcdcdc',
							borderWidth: 1,
						},
						emphasis: {
							label: {
								show: false
							}
						}
					},
					series: [
						{
							type: 'scatter',
							map: 'customMap',
							coordinateSystem: 'geo',
							symbolSize: (val) => {
								const value = val[2];
								const maxSize = 70;
								const minSize = 30;
								return Math.max(minSize, (value / maxRoadNmCnt) * maxSize);
							},
							label: {
								formatter: (params) => {
									return `${params.name}`;
								},
								fontSize: 10,
								color: '#000',
								show: selectedItem02.value.label !== '전체',
								labelLayout: {
									hideOverlap: true
								},
							},
							itemStyle: {
								normal: {
									color: (params) => {
										const count = params.data.properties.roadNmCnt ? Number(params.data.properties.roadNmCnt.replace(/,/g, '')) : 0;
										return getColorForCount(count);
									},
									opacity: 0.7
								},
							},
							data: geoJsonData.features.map(feature => {
								const center = getCenter(feature);
								return {
									name: feature.properties.name,
									value: [...center, feature.properties.roadNmCnt ? Number(feature.properties.roadNmCnt.replace(/,/g, '')) : 0],
									properties: feature.properties
								}
							})
						}]
			};
			
			console.log("option : ", option);
			
			mapChart.clear();
			mapChart.setOption(option);
			
			mapChart.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart.getOption().title[0]);
					
					const currentOption = mapChart.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							selectedItem02.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRegionData('roadName', 'region', selectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadName', 'region', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					if(admCd.length === 2) {
						console.log("admCd : ", admCd);
						selectedItem02.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnGraphStatusRegionData('roadName', 'region', selectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('roadName', 'region', admCd);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart.resize();
			});
		}
	} else {
		console.log("error");
	}
}


//도로명(부여사유별) 지도
const roadNmReasonMap = async (geoJsonData) => {
	
	await nextTick();
	const mapChartDom2 = document.getElementById('mapChart2');
	const mapChart2 = echarts.init(mapChartDom2);
	
	mapChart2.hideLoading();
	echarts.registerMap('roadNmreasonMap', geoJsonData);
	
	console.log("geoJsonData : ", geoJsonData);
	
	const maxRoadNmCnt = Math.max(...geoJsonData.features.map(feature => {
		const countStr = feature.properties.roadNmReasonCnt ? feature.properties.roadNmReasonCnt.replace(/,/g, '') : 0;
		const count = Number(countStr);
		return isNaN(count) ? 0 : count;
	}));
	
	console.log("maxRoadNmCnt : ", maxRoadNmCnt);
	
	const roundedMax = Math.ceil(maxRoadNmCnt / 10) * 10;
	
	if(!roadNmReasonSelectedItem02.value) {
		roadNmReasonSelectedItem02.value = {label: '전체', value: ''};
	}
	
	const titleValue = roadNmReasonSelectedItem02.value.label === '전체' 
		? '전국' 
		: '{underline|전국} > ' + roadNmReasonSelectedItem02.value.label;
	
	const paddingValue = roadNmReasonSelectedItem02.value.label.length > 5 ? [9, 20] : [9, 10];
	
		if(mapChart2) {
			if(selectMapChartReason.value === 'mapColorChart') {
				const option = {
						title: {
							text: titleValue,
							position: 'left',
							top: '5%',
							textStyle: {
								rich: {
									underline: {
										textDecoration: 'underline',
										fontSize: 10,
									}
								},
								color: '#5a5c5a',
								fontSize: 10,
							},
							borderColor: '#5a5c5a',
							borderWidth: 1,
							borderRadius: 3,
							padding: paddingValue,
							triggerEvent: true,
						},
						visualMap: {
							min: 0,
							max: roundedMax,
							text: ['High', 'Low'],
							realtime: false,
							calculable: true,
							inRange: {
								color: ['#ffac91', '#ff8057', '#f7460c']
							},
							outRange: {
								color: ['rgba(0, 0, 0, 0)']
							},
							right: '2%',
							formatter: (value) => Math.floor(value).toLocaleString()
						},
						tooltip: {
							formatter: (params) => {
								const count = params.data ? params.data.properties.roadNmReasonCnt : 0;
								return `${params.name}<br/>${count}(건)`;
							}
						},
						series: [
							{
								type: 'map',
								map: 'roadNmreasonMap',
								scaleLimit: {
									min: 1,
									max: 7
								},
								roam: true,
								label: {
									show: roadNmReasonSelectedItem02.value.label !== '전체',
									fontSize: 10,
									formatter: (params) => {
										return `${params.name}`;
									}
								},
								labelLayout: {
									hideOverlap: true
								},
								itemStyle: {
									borderColor: '#fff',
									borderWidth: 0.5
								},
								data: geoJsonData.features.map(feature => ({
									//id: feature.id,
									name: feature.properties.name,
									value: feature.properties.roadNmReasonCnt ? Number(feature.properties.roadNmReasonCnt.replace(/,/g, '')) : 0,
									properties: feature.properties
								}))
							}
						]
				};
			console.log("option : ", option);
			
			mapChart2.clear();
			mapChart2.setOption(option);
			

			mapChart2.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart2.getOption().title[0]);
					
					const currentOption = mapChart2.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmReasonSelectedItem02.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusReasonData('roadName', 'reason', roadNmReasonSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadName', 'reason', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					if(admCd.length === 2) {
						console.log("admCd : ", admCd);
						roadNmReasonSelectedItem02.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnGraphStatusReasonData('roadName', 'reason', roadNmReasonSelectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('roadName', 'reason', admCd);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart2.resize();
			});
		} else if(selectMapChartReason.value === 'mapBubbleChart') {
			console.log("버블차트");
			
			const getCenter = (coordinates) => {
				let totalX = 0, totalY = 0, count = 0;
				const traverseCoordinates = (coords) => {
					coords.forEach(coord => {
						if(Array.isArray(coord)) {
							if(coord.length === 2) {
								totalX += coord[0];
								totalY += coord[1];
								count++;
							} else {
								traverseCoordinates(coord);
							}
						}
					})	
				};
				
				if(coordinates.geometry.type === 'Polygon') {
					traverseCoordinates(coordinates.geometry.coordinates);
				} else if(coordinates.geometry.type === 'MultiPolygon') {
					coordinates.geometry.coordinates.forEach(polygonCoords => {
						traverseCoordinates(polygonCoords)
					})
				}
				
				if(count > 0) {
					return [totalX / count, totalY / count];
				} else {
					return [NaN, NaN];
				}
			}
			
			const maxCnt = Math.max(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmReasonCnt ? Number(feature.properties.roadNmReasonCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}));
			
			const minCnt = Math.min(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmReasonCnt ? Number(feature.properties.roadNmReasonCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}))
			
			const getColorForCount = (count) => {
				const percentage = (count - minCnt) / (maxCnt - minCnt);
				const red = Math.floor(247 - (percentage * 100));
				const green = Math.floor(70 - (percentage * 50));
				const blue = Math.floor(12 - (percentage * 5));
				
				return `rgb(${red}, ${green}, ${blue})`
			};
			
			const option = {
					title: {
						text: titleValue,
						position: 'left',
						top: '5%',
						textStyle: {
							rich: {
								underline: {
									textDecoration: 'underline',
									fontSize: 10,
								}
							},
							color: '#5a5c5a',
							fontSize: 10,
						},
						borderColor: '#5a5c5a',
						borderWidth: 1,
						borderRadius: 3,
						padding: paddingValue,
						triggerEvent: true,
					},
					tooltip: {
						formatter: (params) => {
							const count = params.data ? params.data.properties.roadNmReasonCnt : 0;
							return `${params.name}<br/>${count}(건)`;
						}
					},
					geo: {
						map: 'roadNmreasonMap',
						roam: true,
						scaleLimit: {
							min: 1,
							max: 7
						},
						itemStyle: {
							areaColor: '#ffffff',
							borderColor: '#dcdcdc',
							borderWidth: 1,
						},
						emphasis: {
							label: {
								show: false
							}
						}
					},
					series: [
						{
							type: 'scatter',
							map: 'roadNmreasonMap',
							coordinateSystem: 'geo',
							symbolSize: (val) => {
								const value = val[2];
								const maxSize = 70;
								const minSize = 30;
								return Math.max(minSize, (value / maxRoadNmCnt) * maxSize);
							},
							label: {
								formatter: (params) => {
									return `${params.name}`;
								},
								fontSize: 10,
								color: '#000',
								show: roadNmReasonSelectedItem02.value.label !== '전체',
								labelLayout: {
									hideOverlap: true
								},
							},
							itemStyle: {
								normal: {
									color: (params) => {
										const count = params.data.properties.roadNmReasonCnt ? Number(params.data.properties.roadNmReasonCnt.replace(/,/g, '')) : 0;
										return getColorForCount(count);
									},
									opacity: 0.7
								},
							},
							data: geoJsonData.features.map(feature => {
								const center = getCenter(feature);
								return {
									name: feature.properties.name,
									value: [...center, feature.properties.roadNmReasonCnt ? Number(feature.properties.roadNmReasonCnt.replace(/,/g, '')) : 0],
									properties: feature.properties
								}
							})
						}]
			};
			
			console.log("option : ", option);
			
			mapChart2.clear();
			mapChart2.setOption(option);
			
			mapChart2.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart2.getOption().title[0]);
					
					const currentOption = mapChart2.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmReasonSelectedItem02.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusReasonData('roadName', 'reason', roadNmReasonSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadName', 'reason', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					if(admCd.length === 2) {
						const admCd = params.data.properties.COL_ADM_SE;
						console.log("admCd : ", admCd);
						roadNmReasonSelectedItem02.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnGraphStatusReasonData('roadName', 'reason', roadNmReasonSelectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('roadName', 'reason', admCd);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart2.resize();
			});
		}
	} else {
		console.log("error");
	}
}

//도로명(위계별) 지도
const roadNmRoadTypeMap = async (geoJsonData) => {
	await nextTick();
	const mapChartDom3 = document.getElementById('mapChart3');
	const mapChart3 = echarts.init(mapChartDom3);
	
	mapChart3.hideLoading();
	echarts.registerMap('roadNmRoadTypeMap', geoJsonData);
	
	console.log("geoJsonData : ", geoJsonData);
	
	const maxRoadNmCnt = Math.max(...geoJsonData.features.map(feature => {
		const countStr = feature.properties.roadNmTypeCnt ? feature.properties.roadNmTypeCnt.replace(/,/g, '') : 0;
		const count = Number(countStr);
		return isNaN(count) ? 0 : count;
	}));
	
	console.log("maxRoadNmCnt : ", maxRoadNmCnt);
	
	const roundedMax = Math.ceil(maxRoadNmCnt / 10) * 10;
	
	if(!roadNmTypeSelectedItem02.value) {
		roadNmTypeSelectedItem02.value = {label: '전체', value: ''};
	}
	
	const titleValue = roadNmTypeSelectedItem02.value.label === '전체' 
		? '전국' 
		: '{underline|전국} > ' + roadNmTypeSelectedItem02.value.label;
		
	const paddingValue = roadNmTypeSelectedItem02.value.label.length > 5 ? [9, 20] : [9, 10];
	
		if(mapChart3) {
			if(selectMapChartRoadType.value === 'mapColorChart') {
				const option = {
						title: {
							text: titleValue,
							position: 'left',
							top: '5%',
							textStyle: {
								rich: {
									underline: {
										textDecoration: 'underline',
										fontSize: 10,
									}
								},
								color: '#5a5c5a',
								fontSize: 10,
							},
							borderColor: '#5a5c5a',
							borderWidth: 1,
							borderRadius: 3,
							padding: paddingValue,
							triggerEvent: true,
						},
						visualMap: {
							min: 0,
							max: roundedMax,
							text: ['High', 'Low'],
							realtime: false,
							calculable: true,
							inRange: {
								color: ['#9288d1', '#6556cc', '#3720c9']
							},
							outRange: {
								color: ['rgba(0, 0, 0, 0)']
							},
							right: '2%',
							formatter: (value) => Math.floor(value).toLocaleString()
						},
						tooltip: {
							formatter: (params) => {
								const count = params.data ? params.data.properties.roadNmTypeCnt : 0;
								return `${params.name}<br/>${count}(건)`;
							}
						},
						series: [
							{
								type: 'map',
								map: 'roadNmRoadTypeMap',
								scaleLimit: {
									min: 1,
									max: 7
								},
								roam: true,
								label: {
									show: roadNmTypeSelectedItem02.value.label !== '전체',
									fontSize: 10,
									formatter: (params) => {
										return `${params.name}`;
									}
								},
								labelLayout: {
									hideOverlap: true
								},
								itemStyle: {
									borderColor: '#fff',
									borderWidth: 0.5
								},
								data: geoJsonData.features.map(feature => ({
									//id: feature.id,
									name: feature.properties.name,
									value: feature.properties.roadNmTypeCnt ? Number(feature.properties.roadNmTypeCnt.replace(/,/g, '')) : 0,
									properties: feature.properties
								}))
							}
						]
				};
			console.log("option : ", option);
			
			mapChart3.clear();
			mapChart3.setOption(option);
			
			mapChart3.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart3.getOption().title[0]);
					
					const currentOption = mapChart3.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmTypeSelectedItem02.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadTypeData('roadName', 'roadType', roadNmTypeSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadName', 'roadType', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
						const admCd = params.data.properties.COL_ADM_SE;
						console.log("admCd : ", admCd);
						if(admCd.length === 2) {
							roadNmTypeSelectedItem02.value = {
								label: params.data.properties.name,
								value: admCd
							};
							await fnGraphStatusRoadTypeData('roadName', 'roadType', roadNmTypeSelectedItem01.value.value, admCd);
							isDataLoaded = false
							fnMapStatus('roadName', 'roadType', admCd);
						}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart3.resize();
			});
		} else if(selectMapChartRoadType.value === 'mapBubbleChart') {
			console.log("버블차트");
			
			const getCenter = (coordinates) => {
				let totalX = 0, totalY = 0, count = 0;
				const traverseCoordinates = (coords) => {
					coords.forEach(coord => {
						if(Array.isArray(coord)) {
							if(coord.length === 2) {
								totalX += coord[0];
								totalY += coord[1];
								count++;
							} else {
								traverseCoordinates(coord);
							}
						}
					})	
				};
				
				if(coordinates.geometry.type === 'Polygon') {
					traverseCoordinates(coordinates.geometry.coordinates);
				} else if(coordinates.geometry.type === 'MultiPolygon') {
					coordinates.geometry.coordinates.forEach(polygonCoords => {
						traverseCoordinates(polygonCoords)
					})
				}
				
				if(count > 0) {
					return [totalX / count, totalY / count];
				} else {
					return [NaN, NaN];
				}
			}
			
			const maxCnt = Math.max(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmTypeCnt ? Number(feature.properties.roadNmTypeCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}));
			
			const minCnt = Math.min(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmTypeCnt ? Number(feature.properties.roadNmTypeCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}))
			
			const getColorForCount = (count) => {
				const percentage = (count - minCnt) / (maxCnt - minCnt);
				const red = Math.floor(55 - (percentage * 100));
				const green = Math.floor(32 - (percentage * 50));
				const blue = Math.floor(201 - (percentage * 5));
				
				return `rgb(${red}, ${green}, ${blue})`
			};
			
			const option = {
					title: {
						text: titleValue,
						position: 'left',
						top: '5%',
						textStyle: {
							rich: {
								underline: {
									textDecoration: 'underline',
									fontSize: 10,
								}
							},
							color: '#5a5c5a',
							fontSize: 10,
						},
						borderColor: '#5a5c5a',
						borderWidth: 1,
						borderRadius: 3,
						padding: paddingValue,
						triggerEvent: true,
					},
					tooltip: {
						formatter: (params) => {
							const count = params.data ? params.data.properties.roadNmTypeCnt : 0;
							return `${params.name}<br/>${count}(건)`;
						}
					},
					geo: {
						map: 'roadNmRoadTypeMap',
						roam: true,
						scaleLimit: {
							min: 1,
							max: 7
						},
						itemStyle: {
							areaColor: '#ffffff',
							borderColor: '#dcdcdc',
							borderWidth: 1,
						},
						emphasis: {
							label: {
								show: false
							}
						}
					},
					series: [
						{
							type: 'scatter',
							map: 'roadNmRoadTypeMap',
							coordinateSystem: 'geo',
							symbolSize: (val) => {
								const value = val[2];
								const maxSize = 70;
								const minSize = 30;
								return Math.max(minSize, (value / maxRoadNmCnt) * maxSize);
							},
							label: {
								formatter: (params) => {
									return `${params.name}`;
								},
								fontSize: 10,
								color: '#000',
								show: roadNmTypeSelectedItem02.value.label !== '전체',
								labelLayout: {
									hideOverlap: true
								},
							},
							itemStyle: {
								normal: {
									color: (params) => {
										const count = params.data.properties.roadNmTypeCnt ? Number(params.data.properties.roadNmTypeCnt.replace(/,/g, '')) : 0;
										return getColorForCount(count);
									},
									opacity: 0.7
								},
							},
							data: geoJsonData.features.map(feature => {
								const center = getCenter(feature);
								return {
									name: feature.properties.name,
									value: [...center, feature.properties.roadNmTypeCnt ? Number(feature.properties.roadNmTypeCnt.replace(/,/g, '')) : 0],
									properties: feature.properties
								}
							})
						}]
			};
			
			console.log("option : ", option);
			
			mapChart3.clear();
			mapChart3.setOption(option);
			
			mapChart3.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart3.getOption().title[0]);
					
					const currentOption = mapChart3.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmTypeSelectedItem02.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadTypeData('roadName', 'roadType', roadNmTypeSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadName', 'roadType', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					if(admCd.length === 2) {
						const admCd = params.data.properties.COL_ADM_SE;
						console.log("admCd : ", admCd);
						roadNmTypeSelectedItem02.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnGraphStatusRoadTypeData('roadName', 'roadType', roadNmTypeSelectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('roadName', 'roadType', admCd);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart3.resize();
			});
		}
	} else {
		console.log("error");
	}
}

//도로명주소(지역별) 지도
const roadNmAddrRegionMap = async (geoJsonData) => {
	await nextTick();
	const mapChartDom8 = document.getElementById('mapChart8');
	const mapChart8 = echarts.init(mapChartDom8);
	
	mapChart8.hideLoading();
	echarts.registerMap('roadNmAddrRegionMap', geoJsonData);
	
	console.log("geoJsonData : ", geoJsonData);
	
	const maxRoadNmCnt = Math.max(...geoJsonData.features.map(feature => {
		const countStr = feature.properties.roadNmAddrRegionCnt ? feature.properties.roadNmAddrRegionCnt.replace(/,/g, '') : 0;
		const count = Number(countStr);
		return isNaN(count) ? 0 : count;
	}));
	
	console.log("maxRoadNmCnt : ", maxRoadNmCnt);
	
	const roundedMax = Math.ceil(maxRoadNmCnt / 10) * 10;
	
	if(!roadNmAddrRegionSelectedItem01.value) {
		roadNmAddrRegionSelectedItem01.value = {label: '전체', value: ''};
	}
	
	if(!roadNmAddrRegionSelectedItem02.value) {
		roadNmAddrRegionSelectedItem02.value = {label: '전체', value: ''};
	}
	
	const titleValue = (() => {
		if(roadNmAddrRegionSelectedItem01.value.label === '전체') {
			return '전국';
		} else if(roadNmAddrRegionSelectedItem01.value.label != '전체' && roadNmAddrRegionSelectedItem02.value.label === '전체') {
			return '{underline|전국} > ' + roadNmAddrRegionSelectedItem01.value.label;
		} else {
			return `{underline|전국} > {underline|${roadNmAddrRegionSelectedItem01.value.label}} > ${roadNmAddrRegionSelectedItem02.value.label}` ;
		}
	});
	
	const paddingValue = roadNmAddrRegionSelectedItem01.value.label.length > 5 ? [9, 20] : [9, 10];
	
		if(mapChart8) {
			if(selectMapChartRoadNmAddrRegion.value === 'mapColorChart') {
				const option = {
						title: {
							text: titleValue(),
							triggerEvent: true,
							position: 'left',
							top: '5%',
							textStyle: {
								rich: {
									underline: {
										textDecoration: 'underline',
										fontSize: 10,
									}
								},
								color: '#5a5c5a',
								fontSize: 10,
							},
							borderColor: '#5a5c5a',
							borderWidth: 1,
							borderRadius: 3,
							padding: paddingValue
						},
						visualMap: {
							min: 0,
							max: roundedMax,
							text: ['High', 'Low'],
							realtime: false,
							calculable: true,
							inRange: {
								color: ['#ffac91', '#ff8057', '#f7460c']
							},
							outRange: {
								color: ['rgba(0, 0, 0, 0)']
							},
							right: '2%',
							formatter: (value) => Math.floor(value).toLocaleString()
						},
						tooltip: {
							formatter: (params) => {
								const count = params.data ? params.data.properties.roadNmAddrRegionCnt : 0;
								return `${params.name}<br/>${count}(건)`;
							}
						},
						series: [
							{
								type: 'map',
								map: 'roadNmAddrRegionMap',
								scaleLimit: {
									min: 1,
									max: 7
								},
								roam: true,
								label: {
									show: roadNmAddrRegionSelectedItem01.value.label !== '전체',
									fontSize: 10,
									formatter: (params) => {
										return `${params.name}`;
									}
								},
								labelLayout: {
									hideOverlap: true
								},
								itemStyle: {
									borderColor: '#fff',
									borderWidth: 0.5
								},
								data: geoJsonData.features.map(feature => ({
									//id: feature.id,
									name: feature.properties.name,
									value: feature.properties.roadNmAddrRegionCnt ? Number(feature.properties.roadNmAddrRegionCnt.replace(/,/g, '')) : 0,
									properties: feature.properties
								}))
							}
						]
				};
			console.log("option : ", option);
			
			mapChart8.clear();
			mapChart8.setOption(option);
			
			mapChart8.off('click');
			mapChart8.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart8.getOption().title[0]);
					
					const currentOption = mapChart8.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmAddrRegionSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadNameAddr', 'region', '');
						}
					} else if(titleParts.length === 3) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmAddrRegionSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadNameAddr', 'region', '');
						} else if(params.event.offsetX < 100) {
							console.log(`${titleParts[1]} 클릭`);
							if(titleParts[1] === '서울특별시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '서울특별시', value: '11' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '부산광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '부산광역시', value: '26' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '대구광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '대구광역시', value: '27' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '인천광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '인천광역시', value: '28' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '광주광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '광주광역시', value: '29' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '대전광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '대전광역시', value: '30' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '울산광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '울산광역시', value: '31' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '세종특별자치시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '세종특별자치시', value: '36' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '세종특별자치시', value: '36110' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '경기도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '경기도', value: '41' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '강원특별자치도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '강원특별자치도', value: '51' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '충청북도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '충청북도', value: '43' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '충청남도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '충청남도', value: '44' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '전북특별자치도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '전북특별자치도', value: '52' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '전라남도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '전라남도', value: '46' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '경상북도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '경상북도', value: '47' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '경상남도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '경상남도', value: '48' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '제주특별자치도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '제주특별자치도', value: '50' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} 
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					if(admCd.length == 5) {
						console.log("1111111111111111admCd : ", admCd);
						if(!params.data.properties.EMD_CD) {
							roadNmAddrRegionSelectedItem02.value = {
								label: params.data.properties.name,
								value: admCd
							};
						}
						await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('roadNameAddr', 'region', admCd);
					} else {
						console.log("시도 값 넘기기");
						roadNmAddrRegionSelectedItem01.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnSelectSig('roadNameAddr', 'region', 'sido', roadNmAddrRegionSelectedItem01.value, '');
						isDataLoaded = false
						fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart8.resize();
			});
		} else if(selectMapChartRoadNmAddrRegion.value === 'mapBubbleChart') {
			console.log("버블차트");
			
			const getCenter = (coordinates) => {
				let totalX = 0, totalY = 0, count = 0;
				const traverseCoordinates = (coords) => {
					coords.forEach(coord => {
						if(Array.isArray(coord)) {
							if(coord.length === 2) {
								totalX += coord[0];
								totalY += coord[1];
								count++;
							} else {
								traverseCoordinates(coord);
							}
						}
					})	
				};
				
				if(coordinates.geometry.type === 'Polygon') {
					traverseCoordinates(coordinates.geometry.coordinates);
				} else if(coordinates.geometry.type === 'MultiPolygon') {
					coordinates.geometry.coordinates.forEach(polygonCoords => {
						traverseCoordinates(polygonCoords)
					})
				}
				
				if(count > 0) {
					return [totalX / count, totalY / count];
				} else {
					return [NaN, NaN];
				}
			}
			
			const maxCnt = Math.max(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmAddrRegionCnt ? Number(feature.properties.roadNmAddrRegionCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}));
			
			const minCnt = Math.min(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmAddrRegionCnt ? Number(feature.properties.roadNmAddrRegionCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}))
			
			const getColorForCount = (count) => {
				console.log("도로명주소 지역별 카운트 : ", count);
				const percentage = (count - minCnt) / (maxCnt - minCnt);
				const red = Math.floor(247 - (percentage * 100));
				const green = Math.floor(70 - (percentage * 50));
				const blue = Math.floor(12 - (percentage * 5));
				
				return `rgb(${red}, ${green}, ${blue})`
			};
			
			const option = {
					title: {
						text: titleValue(),
						top: '5%',
						triggerEvent: true,
						textStyle: {
							rich: {
								underline: {
									textDecoration: 'underline',
									fontSize: 10,
								}
							},
							color: '#5a5c5a',
							fontSize: 10,
						},
						borderColor: '#5a5c5a',
						borderWidth: 1,
						borderRadius: 3,
						padding: paddingValue
					},
					tooltip: {
						formatter: (params) => {
							const count = params.data ? params.data.properties.roadNmAddrRegionCnt : 0;
							return `${params.name}<br/>${count}(건)`;
						}
					},
					geo: {
						map: 'roadNmAddrRegionMap',
						roam: true,
						scaleLimit: {
							min: 1,
							max: 7
						},
						itemStyle: {
							areaColor: '#ffffff',
							borderColor: '#dcdcdc',
							borderWidth: 1,
						},
						emphasis: {
							label: {
								show: false
							}
						}
					},
					series: [
						{
							type: 'scatter',
							map: 'roadNmAddrRegionMap',
							coordinateSystem: 'geo',
							symbolSize: (val) => {
								const value = val[2];
								const maxSize = 70;
								const minSize = 30;
								return Math.max(minSize, (value / maxRoadNmCnt) * maxSize);
							},
							label: {
								formatter: (params) => {
									return `${params.name}`;
								},
								fontSize: 10,
								color: '#000',
								show: roadNmAddrRegionSelectedItem01.value.label !== '전체',
								labelLayout: {
									hideOverlap: true
								},
							},
							itemStyle: {
								normal: {
									color: (params) => {
										const count = params.data.properties.roadNmAddrRegionCnt ? Number(params.data.properties.roadNmAddrRegionCnt.replace(/,/g, '')) : 0;
										return getColorForCount(count);
									},
									opacity: 0.7
								},
							},
							data: geoJsonData.features.map(feature => {
								const center = getCenter(feature);
								return {
									name: feature.properties.name,
									value: [...center, feature.properties.roadNmAddrRegionCnt ? Number(feature.properties.roadNmAddrRegionCnt.replace(/,/g, '')) : 0],
									properties: feature.properties
								}
							})
						}]
			};
			
			console.log("option : ", option);
			
			mapChart8.clear();
			mapChart8.setOption(option);
			
			mapChart8.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart8.getOption().title[0]);
					
					const currentOption = mapChart8.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmAddrRegionSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadNameAddr', 'region', '');
						}
					} else if(titleParts.length === 3) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmAddrRegionSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadNameAddr', 'region', '');
						} else if(params.event.offsetX < 100) {
							console.log(`${titleParts[1]} 클릭`);
							if(titleParts[1] === '서울특별시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '서울특별시', value: '11' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '부산광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '부산광역시', value: '26' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '대구광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '대구광역시', value: '27' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '인천광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '인천광역시', value: '28' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '광주광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '광주광역시', value: '29' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '대전광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '대전광역시', value: '30' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '울산광역시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '울산광역시', value: '31' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '세종특별자치시') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '세종특별자치시', value: '36' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '세종특별자치시', value: '36110' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '경기도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '경기도', value: '41' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '강원특별자치도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '강원특별자치도', value: '51' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '충청북도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '충청북도', value: '43' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '충청남도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '충청남도', value: '44' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '전북특별자치도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '전북특별자치도', value: '52' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '전라남도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '전라남도', value: '46' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '경상북도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '경상북도', value: '47' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '경상남도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '경상남도', value: '48' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '제주특별자치도') {
								roadNmAddrRegionSelectedItem01.value = { 
									label: '제주특별자치도', value: '50' 
								};
								roadNmAddrRegionSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, roadNmAddrRegionSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
							} 
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					console.log("admCd : ", admCd);
					if(admCd.length > 3) {
						if(!params.data.properties.EMD_CD) {
							roadNmAddrRegionSelectedItem02.value = {
								label: params.data.properties.name,
								value: admCd
							};
						}
						await fnGraphStatusRoadNmRegionData('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('roadNameAddr', 'region', admCd);
					} else {
						console.log("시도 값 넘기기");
						roadNmAddrRegionSelectedItem01.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnSelectSig('roadNameAddr', 'region', 'sido', roadNmAddrRegionSelectedItem01.value, '');
						isDataLoaded = false
						fnMapStatus('roadNameAddr', 'region', roadNmAddrRegionSelectedItem01.value.value);
					}
				} else {
					console.log("실패");
				}
			})
			window.addEventListener('resize', () => {
				mapChart8.resize();
			});
		}
	} else {
		console.log("error");
	}
}

//도로명주소(부여시기별) 지도
const roadNmAddrPeriodMap = async (geoJsonData) => {
	await nextTick();
	const mapChartDom9 = document.getElementById('mapChart9');
	const mapChart9 = echarts.init(mapChartDom9);
	
	mapChart9.hideLoading();
	echarts.registerMap('roadNmAddrPeriodMap', geoJsonData);
	
	console.log("geoJsonData : ", geoJsonData);
	
	const maxRoadNmCnt = Math.max(...geoJsonData.features.map(feature => {
		const countStr = feature.properties.roadNmAddrPeriodCnt ? feature.properties.roadNmAddrPeriodCnt.replace(/,/g, '') : 0;
		const count = Number(countStr);
		return isNaN(count) ? 0 : count;
	}));
	
	console.log("maxRoadNmCnt : ", maxRoadNmCnt);
	
	const roundedMax = Math.ceil(maxRoadNmCnt / 10) * 10;
	
	if(!roadNmAddrPeriodSelectedItem01.value) {
		roadNmAddrPeriodSelectedItem01.value = {label: '전체', value: ''};
	}
	
	if(!roadNmAddrPeriodSelectedItem02.value) {
		roadNmAddrPeriodSelectedItem02.value = {label: '전체', value: ''};
	}
	
	const titleValue = (() => {
		if(roadNmAddrPeriodSelectedItem01.value.label === '전체') {
			return '전국';
		} else if(roadNmAddrPeriodSelectedItem01.value.label != '전체' && roadNmAddrPeriodSelectedItem02.value.label === '전체') {
			return '{underline|전국} > ' + roadNmAddrPeriodSelectedItem01.value.label;
		} else {
			return `{underline|전국} > {underline|${roadNmAddrPeriodSelectedItem01.value.label}} > ${roadNmAddrPeriodSelectedItem02.value.label}` ;
		}
	});
	
	const paddingValue = roadNmAddrPeriodSelectedItem01.value.label.length > 5 ? [9, 20] : [9, 10];
	
		if(mapChart9) {
			if(selectMapChartRoadNmAddrPeriod.value === 'mapColorChart') {
				const option = {
						title: {
							text: titleValue(),
							triggerEvent: true,
							position: 'left',
							top: '5%',
							textStyle: {
								rich: {
									underline: {
										textDecoration: 'underline',
										fontSize: 10,
									}
								},
								color: '#5a5c5a',
								fontSize: 10,
							},
							borderColor: '#5a5c5a',
							borderWidth: 1,
							borderRadius: 3,
							padding: paddingValue
						},
						visualMap: {
							min: 0,
							max: roundedMax,
							text: ['High', 'Low'],
							realtime: false,
							calculable: true,
							inRange: {
								color: ['#9288d1', '#6556cc', '#3720c9']
							},
							outRange: {
								color: ['rgba(0, 0, 0, 0)']
							},
							right: '2%',
							formatter: (value) => Math.floor(value).toLocaleString()
						},
						tooltip: {
							formatter: (params) => {
								const count = params.data ? params.data.properties.roadNmAddrPeriodCnt : 0;
								return `${params.name}<br/>${count}(건)`;
							}
						},
						series: [
							{
								type: 'map',
								map: 'roadNmAddrPeriodMap',
								scaleLimit: {
									min: 1,
									max: 7
								},
								roam: true,
								label: {
									show: roadNmAddrPeriodSelectedItem01.value.label !== '전체',
									fontSize: 10,
									formatter: (params) => {
										return `${params.name}`;
									}
								},
								labelLayout: {
									hideOverlap: true
								},
								itemStyle: {
									borderColor: '#fff',
									borderWidth: 0.5
								},
								data: geoJsonData.features.map(feature => ({
									//id: feature.id,
									name: feature.properties.name,
									value: feature.properties.roadNmAddrPeriodCnt ? Number(feature.properties.roadNmAddrPeriodCnt.replace(/,/g, '')) : 0,
									properties: feature.properties
								}))
							}
						]
				};
			console.log("option : ", option);
			
			mapChart9.clear();
			mapChart9.setOption(option);
			
			mapChart9.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart9.getOption().title[0]);
					
					const currentOption = mapChart9.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmAddrPeriodSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadNameAddr', 'period', '');
						}
					} else if(titleParts.length === 3) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmAddrPeriodSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadNameAddr', 'period', '');
						} else if(params.event.offsetX < 100) {
							console.log(`${titleParts[1]} 클릭`);
							if(titleParts[1] === '서울특별시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '서울특별시', value: '11' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '부산광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '부산광역시', value: '26' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '대구광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '대구광역시', value: '27' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '인천광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '인천광역시', value: '28' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '광주광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '광주광역시', value: '29' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '대전광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '대전광역시', value: '30' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '울산광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '울산광역시', value: '31' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '세종특별자치시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '세종특별자치시', value: '36' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '세종특별자치시', value: '36110' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '경기도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '경기도', value: '41' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '강원특별자치도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '강원특별자치도', value: '51' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '충청북도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '충청북도', value: '43' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '충청남도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '충청남도', value: '44' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '전북특별자치도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '전북특별자치도', value: '52' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '전라남도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '전라남도', value: '46' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '경상북도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '경상북도', value: '47' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '경상남도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '경상남도', value: '48' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '제주특별자치도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '제주특별자치도', value: '50' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} 
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					console.log("admCd : ", admCd);
					if(admCd.length > 3) {
						if(!params.data.properties.EMD_CD) {
							roadNmAddrPeriodSelectedItem02.value = {
								label: params.data.properties.name,
								value: admCd
							};
						}
						console.log("roadNmAddrPeriodYear.value : ", roadNmAddrPeriodYear.value);
						await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value.value, roadNmAddrPeriodSelectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('roadNameAddr', 'period', admCd);
					} else {
						console.log("시도 값 넘기기");
						roadNmAddrPeriodSelectedItem01.value = {
							label: params.data.properties.name,
							value: admCd
						};
						roadNmAddrPeriodSelectedItem01.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnSelectSig('roadNameAddr', 'period', 'sido', roadNmAddrPeriodSelectedItem01.value, '');
						isDataLoaded = false
						fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart9.resize();
			});
		} else if(selectMapChartRoadNmAddrPeriod.value === 'mapBubbleChart') {
			console.log("버블차트");
			
			const getCenter = (coordinates) => {
				let totalX = 0, totalY = 0, count = 0;
				const traverseCoordinates = (coords) => {
					coords.forEach(coord => {
						if(Array.isArray(coord)) {
							if(coord.length === 2) {
								totalX += coord[0];
								totalY += coord[1];
								count++;
							} else {
								traverseCoordinates(coord);
							}
						}
					})	
				};
				
				if(coordinates.geometry.type === 'Polygon') {
					traverseCoordinates(coordinates.geometry.coordinates);
				} else if(coordinates.geometry.type === 'MultiPolygon') {
					coordinates.geometry.coordinates.forEach(polygonCoords => {
						traverseCoordinates(polygonCoords)
					})
				}
				
				if(count > 0) {
					return [totalX / count, totalY / count];
				} else {
					return [NaN, NaN];
				}
			}
			
			const maxCnt = Math.max(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmAddrPeriodCnt ? Number(feature.properties.roadNmAddrPeriodCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}));
			
			const minCnt = Math.min(...geoJsonData.features.map(feature => {
				const count = feature.properties.roadNmAddrPeriodCnt ? Number(feature.properties.roadNmAddrPeriodCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}))
			
			const getColorForCount = (count) => {
				console.log("도로명주소 부여시기별 카운트 : ", count);
				const percentage = (count - minCnt) / (maxCnt - minCnt);
				const red = Math.floor(55 - (percentage * 100));
				const green = Math.floor(32 - (percentage * 50));
				const blue = Math.floor(201 - (percentage * 5));
				
				return `rgb(${red}, ${green}, ${blue})`
			};

			const option = {
					title: {
						text: titleValue(),
						triggerEvent: true,
						position: 'left',
						top: '5%',
						textStyle: {
							rich: {
								underline: {
									textDecoration: 'underline',
									fontSize: 10,
								}
							},
							color: '#5a5c5a',
							fontSize: 10,
						},
						borderColor: '#5a5c5a',
						borderWidth: 1,
						borderRadius: 3,
						padding: paddingValue
					},
					tooltip: {
						formatter: (params) => {
							const count = params.data ? params.data.properties.roadNmAddrPeriodCnt : 0;
							return `${params.name}<br/>${count}(건)`;
						}
					},
					geo: {
						map: 'roadNmAddrPeriodMap',
						roam: true,
						scaleLimit: {
							min: 1,
							max: 7
						},
						itemStyle: {
							areaColor: '#ffffff',
							borderColor: '#dcdcdc',
							borderWidth: 1,
						},
						emphasis: {
							label: {
								show: false
							}
						}
					},
					series: [
						{
							type: 'scatter',
							map: 'roadNmAddrPeriodMap',
							coordinateSystem: 'geo',
							symbolSize: (val) => {
								const value = val[2];
								const maxSize = 70;
								const minSize = 30;
								return Math.max(minSize, (value / maxRoadNmCnt) * maxSize);
							},
							label: {
								formatter: (params) => {
									return `${params.name}`;
								},
								fontSize: 10,
								color: '#000',
								show: roadNmAddrPeriodSelectedItem01.value.label !== '전체',
								labelLayout: {
									hideOverlap: true
								},
							},
							itemStyle: {
								normal: {
									color: (params) => {
										const count = params.data.properties.roadNmAddrPeriodCnt ? Number(params.data.properties.roadNmAddrPeriodCnt.replace(/,/g, '')) : 0;
										return getColorForCount(count);
									},
									opacity: 0.7
								},
							},
							data: geoJsonData.features.map(feature => {
								const center = getCenter(feature);
								return {
									name: feature.properties.name,
									value: [...center, feature.properties.roadNmAddrPeriodCnt ? Number(feature.properties.roadNmAddrPeriodCnt.replace(/,/g, '')) : 0],
									properties: feature.properties
								}
							})
						}]
			};
			
			console.log("option : ", option);
			
			mapChart9.clear();
			mapChart9.setOption(option);
			
			mapChart9.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart9.getOption().title[0]);
					
					const currentOption = mapChart9.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmAddrPeriodSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadNameAddr', 'period', '');
						}
					} else if(titleParts.length === 3) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							roadNmAddrPeriodSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('roadNameAddr', 'period', '');
						} else if(params.event.offsetX < 100) {
							console.log(`${titleParts[1]} 클릭`);
							if(titleParts[1] === '서울특별시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '서울특별시', value: '11' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrRegionSelectedItem01.value.value);
							} else if(titleParts[1] === '부산광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '부산광역시', value: '26' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '대구광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '대구광역시', value: '27' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '인천광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '인천광역시', value: '28' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '광주광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '광주광역시', value: '29' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '대전광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '대전광역시', value: '30' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '울산광역시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '울산광역시', value: '31' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '세종특별자치시') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '세종특별자치시', value: '36' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '세종특별자치시', value: '36110' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '경기도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '경기도', value: '41' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '강원특별자치도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '강원특별자치도', value: '51' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '충청북도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '충청북도', value: '43' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '충청남도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '충청남도', value: '44' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '전북특별자치도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '전북특별자치도', value: '52' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '전라남도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '전라남도', value: '46' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '경상북도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '경상북도', value: '47' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '경상남도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '경상남도', value: '48' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} else if(titleParts[1] === '제주특별자치도') {
								roadNmAddrPeriodSelectedItem01.value = { 
									label: '제주특별자치도', value: '50' 
								};
								roadNmAddrPeriodSelectedItem02.value = { 
									label: '전체', value: '' 
								};
								await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value, roadNmAddrPeriodSelectedItem01.value.value, roadNmAddrPeriodSelectedItem02.value.value);
								isDataLoaded = false
								fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
							} 
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					console.log("admCd : ", admCd);
					if(admCd.length > 3) {
						if(!params.data.properties.EMD_CD) {
							roadNmAddrPeriodSelectedItem02.value = {
								label: params.data.properties.name,
								value: admCd
							};
						}	
						
						console.log("roadNmAddrPeriodYear.value : ", roadNmAddrPeriodYear.value);
						
						await fnGraphStatusRoadNmPeriodData('roadNameAddr', 'period', roadNmAddrPeriodYear.value.value, roadNmAddrPeriodSelectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('roadNameAddr', 'period', admCd);
					} else {
						console.log("시도 값 넘기기");
						roadNmAddrPeriodSelectedItem01.value = {
							label: params.data.properties.name,
							value: admCd
						};
						roadNmAddrPeriodSelectedItem01.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnSelectSig('roadNameAddr', 'period', 'sido', roadNmAddrPeriodSelectedItem01.value, '');
						isDataLoaded = false
						fnMapStatus('roadNameAddr', 'period', roadNmAddrPeriodSelectedItem01.value.value);
					}
				} else {
					console.log("실패");
				}
			})
			window.addEventListener('resize', () => {
				mapChart9.resize();
			});
		}
	} else {
		console.log("error");
	}
}

//상세주소(지역별) 지도
const detailAddrRegionMap = async (geoJsonData) => {
	await nextTick();
	const mapChartDom6 = document.getElementById('mapChart6');
	const mapChart6 = echarts.init(mapChartDom6);
	
	mapChart6.hideLoading();
	echarts.registerMap('detailAddrRegionMap', geoJsonData);
	
	console.log("geoJsonData : ", geoJsonData);
	
	const maxRoadNmCnt = Math.max(...geoJsonData.features.map(feature => {
		const countStr = feature.properties.detailAddrCnt ? feature.properties.detailAddrCnt.replace(/,/g, '') : 0;
		const count = Number(countStr);
		return isNaN(count) ? 0 : count;
	}));
	
	console.log("maxRoadNmCnt : ", maxRoadNmCnt);
	
	const roundedMax = Math.ceil(maxRoadNmCnt / 10) * 10;
	
	if(!detailAddrSelectedItem02.value) {
		detailAddrSelectedItem02.value = {label: '전체', value: ''};
	}
	
	const titleValue = detailAddrSelectedItem02.value.label === '전체' 
		? '전국' 
		: '{underline|전국} > ' + detailAddrSelectedItem02.value.label;
	
	const paddingValue = detailAddrSelectedItem02.value.label.length > 5 ? [9, 20] : [9, 10];
	
		if(mapChart6) {
			if(selectMapChartDetailAddr.value === 'mapColorChart') {
				const option = {
						title: {
							text: titleValue,
							position: 'left',
							top: '5%',
							textStyle: {
								rich: {
									underline: {
										textDecoration: 'underline',
										fontSize: 10,
									}
								},
								color: '#5a5c5a',
								fontSize: 10,
							},
							borderColor: '#5a5c5a',
							borderWidth: 1,
							borderRadius: 3,
							padding: paddingValue,
							triggerEvent: true,
						},
						visualMap: {
							min: 0,
							max: roundedMax,
							text: ['High', 'Low'],
							realtime: false,
							calculable: true,
							inRange: {
								color: ['#ffac91', '#ff8057', '#f7460c']
							},
							outRange: {
								color: ['rgba(0, 0, 0, 0)']
							},
							right: '2%',
							formatter: (value) => Math.floor(value).toLocaleString()
						},
						tooltip: {
							formatter: (params) => {
								const count = params.data ? params.data.properties.detailAddrCnt : 0;
								return `${params.name}<br/>${count}(건)`;
							}
						},
						series: [
							{
								type: 'map',
								map: 'detailAddrRegionMap',
								scaleLimit: {
									min: 1,
									max: 7
								},
								roam: true,
								label: {
									show: detailAddrSelectedItem02.value.label !== '전체',
									fontSize: 10,
									formatter: (params) => {
										return `${params.name}`;
									}
								},
								labelLayout: {
									hideOverlap: true
								},
								itemStyle: {
									borderColor: '#fff',
									borderWidth: 0.5
								},
								data: geoJsonData.features.map(feature => ({
									//id: feature.id,
									name: feature.properties.name,
									value: feature.properties.detailAddrCnt ? Number(feature.properties.detailAddrCnt.replace(/,/g, '')) : 0,
									properties: feature.properties
								}))
							}
						]
				};
			console.log("option : ", option);
			
			mapChart6.clear();
			mapChart6.setOption(option);
			
			mapChart6.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart6.getOption().title[0]);
					
					const currentOption = mapChart6.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							detailAddrSelectedItem02.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusDetailAddrData('detailAddr', 'region', detailAddrSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('detailAddr', 'region', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					if(admCd.length === 2) {
						console.log("admCd : ", admCd);
						detailAddrSelectedItem02.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnGraphStatusDetailAddrData('detailAddr', 'region', detailAddrSelectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('detailAddr', 'region', admCd);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart6.resize();
			});
			
		} else if(selectMapChartDetailAddr.value === 'mapBubbleChart') {
			console.log("버블차트");
			
			const getCenter = (coordinates) => {
				let totalX = 0, totalY = 0, count = 0;
				const traverseCoordinates = (coords) => {
					coords.forEach(coord => {
						if(Array.isArray(coord)) {
							if(coord.length === 2) {
								totalX += coord[0];
								totalY += coord[1];
								count++;
							} else {
								traverseCoordinates(coord);
							}
						}
					})	
				};
				
				if(coordinates.geometry.type === 'Polygon') {
					traverseCoordinates(coordinates.geometry.coordinates);
				} else if(coordinates.geometry.type === 'MultiPolygon') {
					coordinates.geometry.coordinates.forEach(polygonCoords => {
						traverseCoordinates(polygonCoords)
					})
				}
				
				if(count > 0) {
					return [totalX / count, totalY / count];
				} else {
					return [NaN, NaN];
				}
			}
			
			const maxCnt = Math.max(...geoJsonData.features.map(feature => {
				const count = feature.properties.detailAddrCnt ? Number(feature.properties.detailAddrCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}));
			
			const minCnt = Math.min(...geoJsonData.features.map(feature => {
				const count = feature.properties.detailAddrCnt ? Number(feature.properties.detailAddrCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}))
			
			const getColorForCount = (count) => {
				const percentage = (count - minCnt) / (maxCnt - minCnt);
				const red = Math.floor(247 - (percentage * 100));
				const green = Math.floor(70 - (percentage * 50));
				const blue = Math.floor(12 - (percentage * 5));
				
				return `rgb(${red}, ${green}, ${blue})`
			};
			
			const option = {
					title: {
						text: titleValue,
						position: 'left',
						top: '5%',
						textStyle: {
							rich: {
								underline: {
									textDecoration: 'underline',
									fontSize: 10,
								}
							},
							color: '#5a5c5a',
							fontSize: 10,
						},
						borderColor: '#5a5c5a',
						borderWidth: 1,
						borderRadius: 3,
						padding: paddingValue,
						triggerEvent: true,
					},
					tooltip: {
						formatter: (params) => {
							const count = params.data ? params.data.properties.detailAddrCnt : 0;
							return `${params.name}<br/>${count}(건)`;
						}
					},
					geo: {
						map: 'detailAddrRegionMap',
						roam: true,
						scaleLimit: {
							min: 1,
							max: 7
						},
						itemStyle: {
							areaColor: '#ffffff',
							borderColor: '#dcdcdc',
							borderWidth: 1,
						},
						emphasis: {
							label: {
								show: false
							}
						}
					},
					series: [
						{
							type: 'scatter',
							map: 'detailAddrRegionMap',
							coordinateSystem: 'geo',
							symbolSize: (val) => {
								const value = val[2];
								const maxSize = 70;
								const minSize = 30;
								return Math.max(minSize, (value / maxRoadNmCnt) * maxSize);
							},
							label: {
								formatter: (params) => {
									return `${params.name}`;
								},
								fontSize: 10,
								color: '#000',
								show: detailAddrSelectedItem02.value.label !== '전체',
								labelLayout: {
									hideOverlap: true
								},
							},
							itemStyle: {
								normal: {
									color: (params) => {
										const count = params.data.properties.detailAddrCnt ? Number(params.data.properties.detailAddrCnt.replace(/,/g, '')) : 0;
										return getColorForCount(count);
									},
									opacity: 0.7
								},
							},
							data: geoJsonData.features.map(feature => {
								const center = getCenter(feature);
								return {
									name: feature.properties.name,
									value: [...center, feature.properties.detailAddrCnt ? Number(feature.properties.detailAddrCnt.replace(/,/g, '')) : 0],
									properties: feature.properties
								}
							})
						}]
			};
			
			console.log("option : ", option);
			
			mapChart6.clear();
			mapChart6.setOption(option);
			
			mapChart6.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart6.getOption().title[0]);
					
					const currentOption = mapChart6.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							detailAddrSelectedItem02.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusDetailAddrData('detailAddr', 'region', detailAddrSelectedItem01.value.value, '');
							isDataLoaded = false
							fnMapStatus('detailAddr', 'region', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					if(admCd.length === 2) {
						console.log("admCd : ", admCd);
						detailAddrSelectedItem02.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnGraphStatusDetailAddrData('detailAddr', 'region', detailAddrSelectedItem01.value.value, admCd);
						isDataLoaded = false
						fnMapStatus('detailAddr', 'region', admCd);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart6.resize();
			});
		}
	} else {
		console.log("error");
	}
}

//기초구역(지역별) 지도
const basRegionMap = async (geoJsonData) => {
	await nextTick();
	const mapChartDom7 = document.getElementById('mapChart7');
	const mapChart7 = echarts.init(mapChartDom7);
	
	mapChart7.hideLoading();
	echarts.registerMap('basRegionMap', geoJsonData);
	
	console.log("geoJsonData : ", geoJsonData);
	
	const maxRoadNmCnt = Math.max(...geoJsonData.features.map(feature => {
		const countStr = feature.properties.basCnt ? feature.properties.basCnt.replace(/,/g, '') : 0;
		const count = Number(countStr);
		return isNaN(count) ? 0 : count;
	}));
	
	console.log("maxRoadNmCnt : ", maxRoadNmCnt);
	
	const roundedMax = Math.ceil(maxRoadNmCnt / 10) * 10;
	
	if(!basSelectedItem01.value) {
		basSelectedItem01.value = {label: '전체', value: ''};
	}
	
	const titleValue = basSelectedItem01.value.label === '전체' 
		? '전국' 
		: '{underline|전국} > ' + basSelectedItem01.value.label;
	
	const paddingValue = basSelectedItem01.value.label.length > 5 ? [9, 20] : [9, 10];
	
		if(mapChart7) {
			if(selectMapChartbas.value === 'mapColorChart') {
				const option = {
						title: {
							text: titleValue,
							position: 'left',
							top: '5%',
							textStyle: {
								rich: {
									underline: {
										textDecoration: 'underline',
										fontSize: 10,
									}
								},
								color: '#5a5c5a',
								fontSize: 10,
							},
							borderColor: '#5a5c5a',
							borderWidth: 1,
							borderRadius: 3,
							padding: paddingValue,
							triggerEvent: true,
						},
						visualMap: {
							min: 0,
							max: roundedMax,
							text: ['High', 'Low'],
							realtime: false,
							calculable: true,
							inRange: {
								color: ['#ffac91', '#ff8057', '#f7460c']
							},
							outRange: {
								color: ['rgba(0, 0, 0, 0)']
							},
							right: '2%',
							formatter: (value) => Math.floor(value).toLocaleString()
						},
						tooltip: {
							formatter: (params) => {
								const count = params.data ? params.data.properties.basCnt : 0;
								return `${params.name}<br/>${count}(건)`;
							}
						},
						series: [
							{
								type: 'map',
								map: 'basRegionMap',
								scaleLimit: {
									min: 1,
									max: 7
								},
								roam: true,
								label: {
									show: basSelectedItem01.value.label !== '전체',
									fontSize: 10,
									formatter: (params) => {
										return `${params.name}`;
									}
								},
								labelLayout: {
									hideOverlap: true
								},
								itemStyle: {
									borderColor: '#fff',
									borderWidth: 0.5
								},
								data: geoJsonData.features.map(feature => ({
									//id: feature.id,
									name: feature.properties.name,
									value: feature.properties.basCnt ? Number(feature.properties.basCnt.replace(/,/g, '')) : 0,
									properties: feature.properties
								}))
							}
						]
				};
			console.log("option : ", option);
			
			mapChart7.clear();
			mapChart7.setOption(option);
			
			mapChart7.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart7.getOption().title[0]);
					
					const currentOption = mapChart7.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							basSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusBasData('bas', 'region', '');
							isDataLoaded = false
							fnMapStatus('bas', 'region', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					if(admCd.length === 2) {
						console.log("admCd : ", admCd);
						basSelectedItem01.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnGraphStatusBasData('bas', 'region', admCd);
						isDataLoaded = false
						fnMapStatus('bas', 'region', admCd);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart7.resize();
			});
			
		} else if(selectMapChartbas.value === 'mapBubbleChart') {
			console.log("버블차트");
			
			const maxCnt = Math.max(...geoJsonData.features.map(feature => {
				const count = feature.properties.detailAddrCnt ? Number(feature.properties.basCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}));
			
			const minCnt = Math.min(...geoJsonData.features.map(feature => {
				const count = feature.properties.detailAddrCnt ? Number(feature.properties.basCnt.replace(/,/g, '')) : 0;
				return isNaN(count) ? 0 : count;
			}))
			
			const getColorForCount = (count) => {
				const percentage = (count - minCnt) / (maxCnt - minCnt);
				const red = Math.floor(55 - (percentage * 100));
				const green = Math.floor(32 - (percentage * 50));
				const blue = Math.floor(201 - (percentage * 5));
				
				return `rgb(${red}, ${green}, ${blue})`
			};
			
			const getCenter = (coordinates) => {
				let totalX = 0, totalY = 0, count = 0;
				const traverseCoordinates = (coords) => {
					coords.forEach(coord => {
						if(Array.isArray(coord)) {
							if(coord.length === 2) {
								totalX += coord[0];
								totalY += coord[1];
								count++;
							} else {
								traverseCoordinates(coord);
							}
						}
					})	
				};
				
				if(coordinates.geometry.type === 'Polygon') {
					traverseCoordinates(coordinates.geometry.coordinates);
				} else if(coordinates.geometry.type === 'MultiPolygon') {
					coordinates.geometry.coordinates.forEach(polygonCoords => {
						traverseCoordinates(polygonCoords)
					})
				}
				
				if(count > 0) {
					return [totalX / count, totalY / count];
				} else {
					return [NaN, NaN];
				}
			}
			
			const option = {
					title: {
						text: titleValue,
						position: 'left',
						top: '5%',
						textStyle: {
							rich: {
								underline: {
									textDecoration: 'underline',
									fontSize: 10,
								}
							},
							color: '#5a5c5a',
							fontSize: 10,
						},
						borderColor: '#5a5c5a',
						borderWidth: 1,
						borderRadius: 3,
						padding: paddingValue,
						triggerEvent: true,
					},
					tooltip: {
						formatter: (params) => {
							const count = params.data ? params.data.properties.basCnt : 0;
							return `${params.name}<br/>${count}(건)`;
						}
					},
					geo: {
						map: 'basRegionMap',
						roam: true,
						scaleLimit: {
							min: 1,
							max: 7
						},
						itemStyle: {
							areaColor: '#ffffff',
							borderColor: '#dcdcdc',
							borderWidth: 1,
						},
						emphasis: {
							label: {
								show: false
							}
						}
					},
					series: [
						{
							type: 'scatter',
							map: 'basRegionMap',
							coordinateSystem: 'geo',
							symbolSize: (val) => {
								const value = val[2];
								const maxSize = 70;
								const minSize = 30;
								return Math.max(minSize, (value / maxRoadNmCnt) * maxSize);
							},
							label: {
								formatter: (params) => {
									return `${params.name}`;
								},
								fontSize: 10,
								color: '#000',
								show: basSelectedItem01.value.label !== '전체',
								labelLayout: {
									hideOverlap: true
								},
							},
							itemStyle: {
								normal: {
									color: (params) => {
										const count = params.data.properties.basCnt ? Number(params.data.properties.basCnt.replace(/,/g, '')) : 0;
										if(count > 1000) {
											return '#f7460c';
										} else if(count >= 500) {
											return '#ff8057';
										} else {
											return '#ffac91';
										}
									},
									opacity: 0.7
								},
							},
							data: geoJsonData.features.map(feature => {
								const center = getCenter(feature);
								return {
									name: feature.properties.name,
									value: [...center, feature.properties.basCnt ? Number(feature.properties.basCnt.replace(/,/g, '')) : 0],
									properties: feature.properties
								}
							})
						}]
			};
			
			console.log("option : ", option);
			
			mapChart7.clear();
			mapChart7.setOption(option);
			
			mapChart7.on('click', async (params) => {
				console.log("params : ", params);
				if(params.componentType === 'title') {
					console.log('선택값 : ', mapChart7.getOption().title[0]);
					
					const currentOption = mapChart7.getOption();
					const title = currentOption.title[0].text;
					
					console.log("title: ", title);
					const parts = title.replace(/{underline\|/g, '').split('>').map(part => part.trim());
					console.log("parts: ", parts);
					
					const titleParts = parts.map(part => part.replace(/}/g, ''));
					
					console.log("titleParts: ", titleParts);
					
					if(titleParts.length === 2) {
						if(params.event.offsetX < 50) {
							console.log('전국 클릭');
							basSelectedItem01.value = { 
								label: '전체', value: '' 
							};
							await fnGraphStatusBasData('bas', 'region', '');
							isDataLoaded = false
							fnMapStatus('bas', 'region', '');
						}
					}
				} else if(params.data && params.data.properties.COL_ADM_SE) {
					const admCd = params.data.properties.COL_ADM_SE;
					if(admCd.length === 2) {
						console.log("admCd : ", admCd);
						basSelectedItem01.value = {
							label: params.data.properties.name,
							value: admCd
						};
						await fnGraphStatusBasData('bas', 'region', admCd);
						isDataLoaded = false
						fnMapStatus('bas', 'region', admCd);
					}
				} else {
					console.log("실패");
				}
			})
			
			window.addEventListener('resize', () => {
				mapChart7.resize();
			});
		}
	} else {
		console.log("error");
	}
}

onMounted(async () => {
	//건수
	await fnRoadNum();
	//도로명
	await fnGraphStatusRegionData('roadName', 'region', selectedItem01.value, selectedItem02.value);
	await fnGraphStatusReasonData('roadName', 'reason', roadNmReasonSelectedItem01.value, roadNmReasonSelectedItem02.value);
	await fnGraphStatusRoadTypeData('roadName', 'roadType', roadNmTypeSelectedItem01.value, roadNmTypeSelectedItem02.value);
	await fnGraphStatusSameRoadNmData('roadName', 'sameRoadNm');
});

</script>

<style>
.p-highlight a {color:#3399ff;}
</style>