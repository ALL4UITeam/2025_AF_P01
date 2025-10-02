<template>
<div class="mainSearchBoxBasic" :class="{'searchCurrent': searchCurrent}">
    <Button class="mainSearchBoxBasic__searchAdress" title="검색창으로 이동" @click="searchCurrentRecentSearches">
        주소를 검색해보세요!
    </Button>
    <div :class="['mainSearchBoxBasic__quickMenu', {fixed: isFixed, mobileType: isMobile}]">
        <Button class="mainSearchBoxBasic__quickButton" title="지도로 찾기" @click="scrollToTop">
            <span class="mainSearchBoxBasic__quickText">지도로 찾을래요.</span>
        </Button>
    </div>
</div>

<div class="resultLayerPopup" :class="{'mainResultActive': searchCurrent}">
    <div class="resultLayerPopup__close">
        <Button class="resultLayerPopup__closeButton" title="검색 결과 닫기" @click="searchCurrentRecentSearches">
            <i aria-hidden="true" class="bi bi-x" />
            <span class="blind">검색 결과 닫기</span>
        </Button>
    </div>

    <div :class="['mainSearchBox', {current : subHeaderIsActiveRecentSearches}]">
        <label for="headerSearch"><span class="blind">검색어 입력</span></label>
        <InputText 
            v-model="inqCndParams.keyword"
            placeholder="검색어를 입력하세요."
            title="검색어를 입력"
            id="mainHeaderSearch"
            autocomplete="off"
            @input="fnSolrAutoComplete"
            @keydown.enter="recentSearchesResultRef"
            v-if="!coordinateMode"
        />
        <InputText 
            v-model="inqCndParams.keyword"
            placeholder="예) [경위도] 126.8979, 37.5767 / [TM] 946833, 1953210"
            title="x, y 좌표를 입력"
            id="mainHeaderSearch"
            autocomplete="off"
            @keydown.enter="recentSearchesResultRef"
            v-if="coordinateMode"
        />
        <Button v-if="inqCndParams.keyword" @click="clearInput" class="clearButton" title="삭제">
        <span class="blind">삭제</span>
        <i aria-hidden="true" class="bi bi-x" />
        </Button>
        
        <!-- 최근검색어 영역 -->
        <div>
	        <Button class="mainSearchBox__recentSearchesButtonMore" :title="subHeaderIsActiveRecentSearches ? '최근검색어 보기' : '최근검색어 닫기'" @click="subHeaderToggleActiveRecentSearches">
	            <span class="blind">{{ subHeaderIsActiveRecentSearches ? '최근검색어 보기' : '최근검색어 닫기' }}</span>
	            <i aria-hidden="true" class="bi bi-caret-down-fill" />
	        </Button>
	        
	        <div class="recentSearches" @focusin="handleFocusIn" v-if="subHeaderIsActiveRecentSearches">
	        
	            <div class="recentSearches__box" v-if="!isAutoCompleteOpen || autoCompleteDataList.length < 1">
	            <p class="recentSearches__title">최근검색어</p>
	            <ul class="recentSearches__list">
	                <li v-for="(item, index) in recentSearches" :key="index">
	                <Button class="recentSearches__text" title="" @click="setModelValue(item.value)">
	                    <span class="recentSearches__searchText">{{ item.value }}</span>
	                </Button>
	                <span class="recentSearches__date">{{ item.date }}</span>
	                <Button class="recentSearches__button" title="검색어 삭제" @click="clearRecentSearches(index)" >
	                    <i aria-hidden="true" class="bi bi-x" />
	                    <span class="blind">검색어 삭제</span>
	                </Button>
	                </li>
	            </ul>
	            </div>
	            <!--  -->
	            <div class="recentSearches__box" v-if="isAutoCompleteOpen && autoCompleteDataList.length > 0">
	            <ul v-if="autoCompleteDataList.length" class="recentSearches__list">
			      <li v-for="(suggestions, index) in autoCompleteDataList" :key="index">
			        <Button class="recentSearches__text" title="" @click="selectSuggesion(suggestions)">
			          <span class="recentSearches__searchText">{{ suggestions }}</span>
			        </Button>
			      </li>
			    </ul>
	            </div>
	            
	            <div class="recentSearches__recentSearchesfunction">
	                <Button class="recentSearches__recentSearchesfunctionButton" @click="clearRecentSearches()">전체삭제</Button>
	                <div>
	                    <Button class="recentSearches__recentSearchesfunctionButton" @click="subHeaderToggleActiveRecentSearches">닫기</Button>
	                </div>
	            </div>
	        </div>
        </div>
        
        <Button class="searchButton" title="검색" @click="recentSearchesResultRef">
            <i aria-hidden="true" class="bi bi-search" />
            <span class="irText">검색</span>
        </Button>
    </div>
	
	<!-- 검색조건 체크박스 영역 -->
    <div class="resultLayerPopup__headerFunction mainResult">
        <div class="resultLayerPopup__functionList" v-for="checkList of categoriesResult" :key="checkList.key">
            <Checkbox v-model="selectedCategoriesResult"  :inputId="checkList.key" name="checkListResult" :value="checkList.label" @change="chgCheckBox(checkList.label)" />
            <label class="resultLayerPopup__functionLabel" :for="checkList.key">{{ checkList.label }}</label>
        </div>
    </div>

    <div :style="{display: recentSearchesResult ? 'block' : 'none'}">
        <p class="resultLayerPopup__resultText" v-if="searchMode.schResultMode === 'SOLR'">
            검색어 
            <strong class="text">"{{ searchKeyword }}"</strong>
            에 대한 검색결과 총 
            <strong class="text">{{ pageInfo.totalRecords.toLocaleString() }}</strong>건입니다.
        </p>
        <p class="resultLayerPopup__resultText" v-if="searchMode.schResultMode === 'POST'">
            <strong class="text">
            검색 결과가 없어 주변 주소로 검색한 결과 총 {{ pageInfo.totalRecords.toLocaleString() }}건입니다.
            </strong>
        </p>
		<p class="resultLayerPopup__administration" v-if="searchMode.hemdSearch">
            <span class="commonBullet">※</span> 해당주소는 행정동으로 검색된 주소입니다.<br />
            검색 편의를 위해 제공하는 참고정보로 검색 목적 이외에 다른 용도로 사용할 수 없습니다.
        </p>
        
        <div class="honorLoad__wrap" v-if="searchMode.honorRoadMode">
            <div class="honorLoad__title">명예도로</div>
            <ul class="honorLoad__textWrap">
                <li v-for="(item, index) in honorRoadData" :key="index">
                    <span class="honorLoad__text">
                        <strong class="str">"{{ item.hrNm }}" ({{ item.siNm }} {{ item.sggNm }})</strong> 명예도로가 존재합니다. 
                    </span>
                    <Button class="honorLoad__button" title="명예도로 검색" @click="honorRoadView(item)">명예도로 검색 <i aria-hidden="true" class="bi bi-arrow-right"/></Button>
                </li>
            </ul>
        </div>
        
        <div class="resultLayerPopup__innerWrap">
            <!-- 필터검색 영역 -->
		    <div class="resultLayerPopup__detailSearchBox" v-if="isLargeDataVisible">
		      <div class="resultLayerPopup__detailSearchBoxInner">
		        <label for="resultCityItems" class="blind">시/도</label>
		       <CustomDropdown class="resultLayerPopup__form selectStype01" inputId="sidoList" :options="itemsCity" optionLabel="label" optionValue="label" v-model="filterParams.ctpvCd" title="시/도 선택" placeholder="시/도 선택" />
		
		        <label for="resultRoadNameItems" class="blind">도로명</label>
		        <CustomDropdown class="resultLayerPopup__form selectStype02" inputId="sggList" :options="itemsCounty" optionLabel="value" optionValue="value" v-model="filterParams.roadNm" title="도로명 선택" placeholder="도로명 선택" />
		        
		        <Button class="resultLayerPopup__detailSearchButton" @click="filterSearch()">
		          <i aria-hidden="true" class="bi bi-search" />검색
		        </Button>
		      </div>
		      <p class="resultLayerPopup__detailSearchBoxTip">
		      	<i aria-hidden="true" class="bi bi-exclamation-circle-fill" v-if="pageInfo.totalRecords == '0'"/>주소검색 결과가 많습니다. 도로명을 선택하여 검색 범위를 좁힐 수 있습니다.
		      </p>
		    </div>
            
            <!-- 정렬기능 영역 -->
            <div class="resultLayerPopup__filter" v-if="pageInfo.totalRecords > 0">
                <div class="resultLayerPopup__radio" v-for="checkList in categoriesRadio" :key="checkList.key">
                    <RadioButton v-model="selectedCategoriesRadio" :inputId="checkList.key" :value="checkList.name" @change="sortChange"/>
                    <label :for="checkList.key">{{ checkList.name }}</label>
                </div>
                <p class="resultLayerPopup__filterTip"><i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 입력한 키워드가 선택한 항목에 포함되는 주소정보가 우선정렬 되고, 도로명주소 순으로 정렬됩니다.</p>
            </div>
            
            <!-- 검색결과 부분 -->
            <div class="resultLayerPopup__scrollWrap" v-if="pageInfo.totalRecords > 0">
                <Scrollpanel class="resultLayerPopup__scroll">
                <DataTable :value="searchDataList" ref="dataTableRef" >
                    <ul class="resultLayerPopup__list">
                        <li v-for="(item, index) in searchDataList" :key="index">
                            <div class="resultLayerPopup__detailBox">
                                <div class="resultLayerPopup__detailBoxNumber">{{ item.rowNumber }}</div>
                                <!-- 검색결과 상단 (더보기 안할 시) -->
                                <div class="resultLayerPopup__listDetail basic">
                                	<!-- 도로명주소 (통합검색) -->
                                    <p class="resultLayerPopup__listDetailTitle" v-if="schMode == 'hstry'">
                                        <strong>도로명주소</strong>
                                    </p>
                                    <p class="resultLayerPopup__listDetailTitle" v-if="schMode == 'aot'">
                                        <strong>사물이름</strong>
                                    </p>
                                    
                                    <!-- 통합검색 -->
                                    <div class="resultLayerPopup__listDetailContent" v-if="schMode == 'hstry'">
                                        <div class="resultLayerPopup__innerBox" v-if="isKorMode[index]">
                                            <strong >{{ item.schEngRoadNm }}</strong>
                                            <span class="resultLayerPopup__copy">
                                                <Button class="commonButton__resultButton" title="주소복사하기" @click="copy(item.schEngRoadNm)">복사</Button>
                                            </span>
                                            <span class="resultLayerPopup__abolition" v-if="item.ablYn === '1'">
                                            	<i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 폐지
                                            </span>
                                        </div>
                                        
                                        <div class="resultLayerPopup__innerBox" v-else>
                                            <strong >{{ item.schKorRoadNm }}</strong>
                                            <span class="resultLayerPopup__copy">
                                                <Button class="commonButton__resultButton" title="주소복사하기" @click="copy(item.schKorRoadNm)">복사</Button>
                                            </span>
                                            <span class="resultLayerPopup__abolition" v-if="item.ablYn === '1'">
                                            	<i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 폐지
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- 사물주소 -->
                                    <div class="resultLayerPopup__listDetailContent" v-if="schMode == 'aot'">
                                        <div class="resultLayerPopup__innerBox">
                                            <strong >{{ item.objNm }}</strong>
                                            <span class="resultLayerPopup__copy">
                                                <Button class="commonButton__resultButton" title="주소복사하기" @click="copy(item.objNm)">복사</Button>
                                            </span>
                                            <span class="resultLayerPopup__abolition" v-if="item.ablYn === '1'">
                                            	<i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 폐지
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- 지번주소 (통합검색) -->
                                    <p class="resultLayerPopup__listDetailTitle" v-if="schMode == 'hstry'">지번</p>
                                    <p class="resultLayerPopup__listDetailTitle" v-if="schMode == 'aot'">도로명주소</p>
                                    <div class="resultLayerPopup__listDetailContent" v-if="schMode == 'hstry'">
                                        <p class="resultLayerPopup__innerBox" v-if="isKorMode[index]">{{ item.schEngJibunNm }}</p>
                                        <p class="resultLayerPopup__innerBox" v-else>{{ item.schKorJibunNm }}</p>
                                        <div class="resultLayerPopup__relatedAddress" v-if="item.relJibun">
                                            <span class="resultLayerPopup__relatedAddressTitle">관련지번</span> {{ item.relJibun }}
                                        </div>
                                        
                                        <div class="resultLayerPopup__detailAdressFunction">
                                            <Button class="resultLayerPopup__detailAdressButton" @click="detailAdressToggleActive(index)" :class="{active : detailAdressActive[index]}" :title="detailAdressActive[index] ? '상세주소(동·층·호) 닫기' : '상세주소(동·층·호) 열기'">
                                                <span>상세주소(동·층·호) 보기</span> <i aria-hidden="true" :class="detailAdressButtonIcon(index)" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div class="resultLayerPopup__listDetailContent" v-if="schMode == 'aot'">
                                        <p class="resultLayerPopup__innerBox" v-if="isKorMode[index]">{{ item.bdEngSn }}</p>
                                        <p class="resultLayerPopup__innerBox" v-else>{{ item.bdSnTxt }}</p>
                                    </div>
                                </div>
                                
                                <!-- 검새결과 더보기 클릭 시 영역 -->
                                <!-- 통합검색 -->
                                <div class="resultLayerPopup__function" v-if="schMode == 'hstry'">
                                    <div class="resultLayerPopup__functionPostalCodeWrap" >
                                        <strong class="resultLayerPopup__functionPostalCodeText">
                                            우편번호
                                        </strong>
                                        <span class="resultLayerPopup__functionPostalCodeNumber">
                                            {{ item.zipCl }}
                                        </span>
                                    </div>
                                    <div class="resultLayerPopup__apt" v-if="item.aphusYn === '1'">
                                        아파트
                                    </div>
                                    <Button class="resultLayerPopup__functionButton en" title="영문보기" @click="toggleView(index)"> 
			                   			<span class="resultLayerPopup__en">{{ isKorMode[index] ? '국문보기' : '영문보기' }}</span> 
			                		</Button>
                                    <Button class="resultLayerPopup__functionButton load" @click="roadInfoPop(item.rdMgtSn)" title="도로명정보">
                                        도로명정보
                                    </Button>
                                    <Button class="resultLayerPopup__functionButton map" title="지도에서 찾기" @click="mapViewOnShowDialog(item)">
                                        지도보기
                                    </Button>
                                </div>
                                
                                <!-- 사물주소 -->
                                <div class="resultLayerPopup__function" v-if="schMode == 'aot'" style="margin-left: 100px;">
                                    <Button class="resultLayerPopup__functionButton en" title="영문보기" @click="toggleView(index)"> 
			                   			<span class="resultLayerPopup__en">{{ isKorMode[index] ? '국문보기' : '영문보기' }}</span> 
			                		</Button>
                                    <Button class="resultLayerPopup__functionButton map" title="지도에서 찾기" @click="mapViewOnShowDialog(item)">
                                        지도보기
                                    </Button>
                                </div>
                                
                            </div>
                            
                            <!-- 동, 층, 호 -->
                            <div class="resultLayerPopup__detailAdress" :class="{detailAdressActive : detailAdressActive}" v-if="detailAdressActive[index]">
                                <ul class="resultLayerPopup__eastWestFloor">
                                    <li>
					                  <label for="east" class="blind">동 선택하기</label>
					                  <CustomDropdown class="resultLayerPopup__eastWestFloorSelect" inputId="east" :options="dongItems[index]" optionLabel="label" optionValue="value" v-model="detailParams.bddgMgno" @change="changeFloor(index)" title="동 선택하기" placeholder='동을 선택하세요.' />
					                </li>
					                <li>
					                  <label for="west" class="blind">층 선택하기</label>
					                  <CustomDropdown class="resultLayerPopup__eastWestFloorSelect" inputId="west" :options="floorItems[index]" optionLabel="label" optionValue="value" v-model="detailParams.bdflMgno" @change="changeHo(index)" title="층 선택하기" placeholder='층을 선택하세요.' />
					                </li>
					                <li>
					                  <label for="floor" class="blind">호 선택하기</label>
					                  <CustomDropdown class="resultLayerPopup__eastWestFloorSelect" inputId="floor" :options="hoItems[index]" optionLabel="label" optionValue="value" v-model="detailParams.bdhoMgno" title="호 선택하기" placeholder='호을 선택하세요.' />
					                </li>
                                </ul>
                                <div class="resultLayerPopup__innerBox">
                                    {{ item.schKorRoadNm }} 
                                    <span class="resultLayerPopup__copy">
                                        <Button class="commonButton__resultButton" title="주소복사하기" @click="copy(item.schKorRoadNm)">복사</Button>
                                    </span>
                                </div>
                                <p class="resultLayerPopup__eastWestFloorTip"><span class="commonBullet">※</span> 위 주소는 '호'에 '층'정보가 포함되어 있어 층을 생략하고 표기할 수 있습니다.</p>
                            </div>
                            
                            <!--  -->
                            <div class="resultLayerPopup__moreFunction" v-if="schMode == 'hstry'">
                                <Button class="resultLayerPopup__moreButton" @click="moreToggleActive(index)" :class="{active : moreActive[index]}" :title="moreActive[index] ? '더보기 접기' : '더보기 펼치기'" >
                                    <i aria-hidden="true" :class="moreButtonIcon(index)" /> {{ moreActive[index] ? '접기' : '더보기' }}
                                </Button>
                                <div class="resultLayerPopup__listDetail more" :class="{moreActive : moreActive}" v-if="moreActive[index]">
                                    <p class="resultLayerPopup__listDetailTitle">영문</p>
                                    <div class="resultLayerPopup__listDetailContent">
                                        <div class="resultLayerPopup__innerBox">
                                            {{ item.schEngRoadNm }}
                                            <Button class="resultLayerPopup__commonButton type01" @click="postToggleActive" :title="postActive ? '우편주소 표기방법 접기' : '우편주소 표기방법 펼치기'">
                                                <span>우편주소 표기방법</span> <i aria-hidden="true" class="bi bi-arrow-right" />
                                            </Button>
                                        </div>
                                        <div v-if="postActive">
                                        	<p class="resultLayerPopup__enText" :class="{active : postActive}">{{ item.zipEngNm }}</p>
	                                        <div class="resultLayerPopup__notation" :class="{active : postActive}">
	                                            <p class="resultLayerPopup__notationTitle">상세주소(동,층,호)를 포함한 영문 우편주소 표기방법 안내</p>
	                                            <dl class="resultLayerPopup__notationList">
	                                                <dt>유형1</dt>
	                                                <dd>
	                                                    <p class="resultLayerPopup__notationListTitle">&quot;동&quot;과 &quot;호&quot;  표기</p>
	                                                    <p class="resultLayerPopup__notationListDetail">주소가 &quot;세종특별자치시 도움6로 42&quot; 이고 &quot;705동 1104호&quot; 인경우</p>
	                                                    <p class="resultLayerPopup__notationListEn">705-1104, 42 Doum 6-ro, Sejong-si, 30112, Republic pf Korea</p>
	                                                </dd>
	                                                <dt>유형2</dt>
	                                                <dd>
	                                                    <p class="resultLayerPopup__notationListTitle">&quot;층&quot;  표기</p>
	                                                    <p class="resultLayerPopup__notationListDetail">주소가 &quot;세종특별자치시 도움6로 42&quot; 이고 &quot;3층&quot; 인경우</p>
	                                                    <p class="resultLayerPopup__notationListEn">3F, 42 Doum 6-ro, Sejong-si, 30112, Republic pf Korea</p>
	                                                </dd>
	                                                <dt>유형3</dt>
	                                                <dd>
	                                                    <p class="resultLayerPopup__notationListTitle">&quot;지하&quot;  표기</p>
	                                                    <p class="resultLayerPopup__notationListDetail">주소가 &quot;세종특별자치시 도움6로 42&quot; 이고 &quot;지하102&quot; 인경우</p>
	                                                    <p class="resultLayerPopup__notationListEn">B102, 42 Doum 6-ro, Sejong-si, 30112, Republic pf Korea</p>
	                                                </dd>
	                                            </dl>
	                                        </div>
                                        </div>
                                    </div>
                                    <p class="resultLayerPopup__listDetailTitle" v-if="item.ablYn === '0'">관할주민센터</p>
                                    <div class="resultLayerPopup__listDetailContent" v-if="item.ablYn === '0'">
                                        <ul class="resultLayerPopup__communityCenter">
                                            <li>{{ item.siNm }} {{ item.sggNm }} {{ item.juminCenter_01 }}
                                                <span class="resultLayerPopup__phone"><i aria-hidden="true" class="bi bi-telephone-fill" /> {{ item.juminCenterNumber_01 }} </span>
                                            </li>
                                            <li v-if="item.juminCenter_02 != null">{{ item.siNm }} {{ item.sggNm }} {{ item.juminCenter_02 }}
                                                <span class="resultLayerPopup__phone"><i aria-hidden="true" class="bi bi-telephone-fill" /> {{ item.juminCenterNumber_02 }} </span>
                                            </li>
                                        </ul>
                                        <ul class="resultLayerPopup__tip">
                                            <li><span class="commonBullet">※</span> 관할주민센터는 참고정보이며, 실제와 다를 수 있습니다.</li>
                                            <li v-if="item.juminCenter_02 != null"><span class="commonBullet">※</span> 해당주소는 관할주민센터가 2개이므로, 자세한 사항은 자치단체에 문의하시기 바랍니다.</li>
                                        </ul>
                                    </div>
                                    <p class="resultLayerPopup__listDetailTitle">상세건물명</p>
                                    <div class="resultLayerPopup__listDetailContent">
                                        <p class="resultLayerPopup__innerBox">{{ item.detBdNm }}</p>
                                    </div>
                                    <p class="resultLayerPopup__listDetailTitle">주소변동이력</p>
                                    <div class="resultLayerPopup__listDetailContent">
                                        <span class="resultLayerPopup__listDetailContentGap">
                                            <Button class="resultLayerPopup__commonButton" title="변동이력검색" @click="changeHistoryOnShowDialog(item)" id="changeHistoryOnShow">
                                                <span>변동이력검색</span> <i aria-hidden="true" class="bi bi-arrow-right" />
                                            </Button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="resultLayerPopup__moreFunction" v-if="schMode == 'aot'">
                                <Button class="resultLayerPopup__moreButton" @click="moreToggleActive(index)" :class="{active : moreActive[index]}" :title="moreActive[index] ? '더보기 접기' : '더보기 펼치기'" >
                                    <i aria-hidden="true" :class="moreButtonIcon(index)" /> {{ moreActive[index] ? '접기' : '더보기' }}
                                </Button>
                                <div class="resultLayerPopup__listDetail more" :class="{moreActive : moreActive}" v-if="moreActive[index]">
                                    <p class="resultLayerPopup__listDetailTitle">영문</p>
                                    <div class="resultLayerPopup__listDetailContent">
                                        <div class="resultLayerPopup__innerBox">
                                            {{ item.bdEngSn }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </DataTable>
                </Scrollpanel>
            </div>
            <TemplatePaginator class="resultLayerPopup__paging" :pageInfo="pageInfo" @reload-list="onPaging"/>

            <!-- 지도에서 찾기 (미니맵) -->
            <MiniMapPopup ref="miniMapPop" />
			
			<!-- 도로명 정보 팝업 -->
			<Dialog class="commonDialog" id="dlg" :visible="dialogVisible" modal :closable="false" :aria-controls="dialogVisible ? 'dlg' : null" :aria-expanded="dialogVisible ? true : false">
			  <template #header>
			    <Button id="dialogFocus" class="dialogCloseButton" @click="closeDialog">
			      <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
			    </Button>
			  </template>
			  <ContentTitle v-if="roadDetail != null" :title="`${roadDetail.siNm} ${roadDetail.sggNm} ${roadDetail.rdNm}`" fontSize="30px" marginTop="0" mobileFontSize="20px"/>
			  <div class="commonTable__wrap">
			    <table class="commonTable__detail">
			      <caption>도로명 테이블입니다. 항목은 기점, 종점, 고시일, 효력발생일, 길이가 있습니다.</caption>
			      <colgroup>
			        <col style="width:30%" />
			        <col />
			      </colgroup>
			      <tbody>
			        <tr>
			          <th>기점</th>
			          <td>{{ roadDetail.srtCn }}</td>
			        </tr>
			        <tr>
			          <th>종점</th>
			          <td>{{ roadDetail.endCn }}</td>
			        </tr>
			        <tr>
			          <th>고시일</th>
			          <td>{{ roadDetail.noticeYmd }}</td>
			        </tr>
			        <tr>
			          <th>효력발생일</th>
			          <td>{{ roadDetail.effectDe }}</td>
			        </tr>
			        <tr>
			          <th>길이(M)</th>
			          <td>{{ roadDetail.roadLt }}</td>
			        </tr>
			        <tr>
			          <th>부여사유</th>
			          <td>{{ roadDetail.grantDe }}</td>
			        </tr>
			      </tbody>
			    </table>
			  </div>
			  <div class="table__alignCenter">
			    <Button class="table__button" @click="fnSearchRoadMap()">도로구간 보기</Button>
			  </div>
			</Dialog>


           	<!-- 변동이력 팝업 -->
            <Dialog class="commonDialog" id="changeHistory" :visible="changeHistoryDialogVisible" modal :closable="false" 
            :aria-controls="changeHistoryDialogVisible ? 'changeHistory' : null" :aria-expanded="changeHistoryDialogVisible ? true : false" style="width: 1200px;">
                <template #header>      
                    <Button id="changeHistoryDialogFocus" class="dialogCloseButton" @click="changeHistoryCloseDialog">
                        <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
                    </Button>
                </template>
                <ContentTitle :title="historyTitle" fontSize="30px" marginTop="0" mobileFontSize="20px" />
                <p class="changeHistory__text"><span class="commonBullet">※</span> 2015년 12월 31일이후 변동이력만 조회됩니다.</p>
            	
                <DataTable class="tableStyle01 noneLine" :value="historyDataList" ref="dataTableRef2">
                    <Column header="변동일자" field="updtDt" colspan="2" />
		    		<Column header="주소" colspan="7">
		    			<template #body="slotProps">
		    				<div v-if="slotProps.data.rnAddr">{{ slotProps.data.rnAddr }}</div>
		    				<div v-if="slotProps.data.jibunAddr">{{ slotProps.data.jibunAddr }}</div>
		    			</template>
		    		</Column>
                    <Column header="고시여부" field="ancmntYn" colspan="2"/>
                    <Column header="읍면동" field="emdNm" colspan="2" />
                    <Column header="변동구분" field="jobSeNm" colspan="2"/>
                    <Column header="사유" field="chgSn" colspan="2"/>
                </DataTable>
            </Dialog>
        </div>
    </div>
</div>

</template>  
<script setup>
import { onMounted, ref, onBeforeUnmount, computed ,watch, nextTick, reactive } from "vue";
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext'
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";
import Scrollpanel from 'primevue/scrollpanel'
import Dialog from 'primevue/dialog';
import HeaderSearchBox from '@components/search_box/HeaderSearchBox.vue';
import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
import CustomPaginator from '@components/paginator/CustomPaginator.vue';
import ContentTitle from '@components/title/ContentTitle.vue';
import axios from 'axios';
import TemplatePaginator from "@/components/paginator/templatePaginator.vue";
import { sidoDataLoad, sggDataLoad } from '@/common/jusoCommon.ts'   //[공용컴포넌트]시도 데이터, 시군구 데이터
import { useRouter } from 'vue-router';

//라우터
const router = useRouter();

//페이징 변수
const pageSize = ref(5);
const currentPage = ref(0);

//체크박스 리스트
const categoriesResult = ref([
	{label: '사물주소 검색', key: "A", title: "사물주소 검색"},
	{label: '폐지된 주소정보 포함', key: "B", title: "폐지된 주소정보 포함"},
	{label: '좌표검색', key: "D", title: "좌표검색"},
	{label: '자동완성 사용 안함', key: "C", title: "자동완성 사용 안함"},
])

//정렬 리스트
const categoriesRadio = ref([
	{name: '정확도순', key: "RA", title: "정확도순"},
	{name: '도로명 포함', key: "RB", title: "도로명 포함"},
	{name: '지번 포함', key: "RC", title: "지번 포함"},
])

//자동완성 사용 안함은 체크상태로 초기화
const selectedCategoriesResult = ref(['자동완성 사용 안함']);

//좌표 검색 구분
const coordinateMode = ref(false);

/*----------------------------------------------------------------------- 통합검색 관련 */

//검색수행 모드
const schMode = ref("hstry");

//검색 결과 구분
const searchMode = reactive({});

//검색 수행 후 키워드 담는 변수
const searchKeyword = ref('');

//검색결과 변수
const searchDataList = ref([]);
const dataTableRef = ref(null);

//명예도로 검색결과 변수
const honorRoadData = ref([]);

//검색결과 영문/국문모드
const isKorMode = ref([]);

//검색조건 초기화변수
const inqCndParams = reactive({
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

//페이징변수
const pageInfo = reactive({
	first: 0
	, totalRecords: 0     		 			//전체 데이터 수
	, currentRecords: 0    		 			//현재 보여지는 데이터 수
	, totalPages: 0        	     			//전체 페이지 수
	, page: currentPage.value	 			//현재 페이지
	, size: pageSize.value 		 			//한 페이지당 데이터 수
	, orders: [{
		property: ''               			//정렬할 속성 이름
		, direction: ''            			//정렬 방향(ASC 또는 DESC)
	}]
});

//검색수행
const recentSearchesResultRef = () => {

	if(inqCndParams.keyword === '' || inqCndParams.keyword == null) {
		alert('검색키워드는 2자리 이상 입력해 주시기 바랍니다.');
		return false;
	} else if(inqCndParams.keyword.length < 2) {
		alert('검색키워드는 2자리 이상 입력해 주시기 바랍니다.');
		return false;
	} else {
		if(inqCndParams.strSearchType === "COORDINATE") {
			const coordinatePattern = /^[+-]?(\d+(\.\d*)?|\.\d+),\s*[+-]?(\d+(\.\d*)?|\.\d+)$/;
			const isValid = ref(true);
			const cleanedValue = inqCndParams.keyword.replace(/\s+/g, '');
			isValid.value = coordinatePattern.test(cleanedValue);

			//입력값 유효성 체크
			if (!isValid.value) {
				alert("X, Y 형태로 입력해주세요.\n예) [경위도] 126.8979, 37.5767 / [TM] 946833, 1953210");
				return false;
			} else {
				let param = cleanedValue.split(",");
				const formatPattern = /^\d*\.\d+$/;

				//소수점이 있으면 경위도값    		
				if (formatPattern.test(param[0]) && formatPattern.test(param[1])) {
					//경위도값 범위 체크
					if (param[0] < 124 || param[0] > 133) {
						alert("유효하지 않은 경위도 X값 입니다.\n범위 : 124이상 ~ 133미만");
						return false;
					}
					
					if (param[1] < 33 || param[1] > 44) {
						alert("유효하지 않은 경위도 Y값 입니다.\n범위 : 33이상 ~ 44미만");
						return false;
					}
				} else {
					//소수점이 없고 경위도값 범위에 포함
					if ((param[0] > 123 && param[0] < 133) && (param[1] > 32 && param[1] < 44)) {
						alert("경위도값은 소수점을 입력해야 합니다.\n예) 126.8979, 37.5767");
						return false;
					}
				}
			}
		}
		
		//최근검색어 저장
		historyKeywordSave();
		
		// 조회 실행
		inqCndParams.pageable.page = 0;
		console.log("검색 파라미터 ->> ", inqCndParams);
		axiosCall();
	}
}

//solr 호출
const axiosCall = async () => {
	if(inqCndParams.strAotYn === "N") {
		//통합검색
		schMode.value = "hstry";
		axios.post('/api/solr/solrKeywordSearch', inqCndParams)
			.then((response) => {
				const data = response.data;
				console.log("############# SOLR 통합검색결과 ->> ", response);
				if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
					const totalElements = data.results.totalElements;
					const pageSize = data.results.size;
					const currentPage = data.results.pageable.pageNumber;
					searchDataList.value = data.results.content.map((item, index) => {
 						const rowNumber = currentPage * pageSize + index + 1;
						return {
							...item,
							rowNumber: rowNumber
						}
					})
					
					pageInfo.totalRecords = data.results.totalElements;
					pageInfo.currentRecords = data.results.numberOfElements;
					pageInfo.totalPages = data.results.totalPages;
					
					//검색 결과 100건 이상시 도로명 필터검색 제공
					if (data.results.totalElements > 100) {
						isLargeDataVisible.value = true;	
					} else {
						isLargeDataVisible.value = false;
						filterParams.ctpvCd = "";
						filterParams.roadNm = "";
					}
					
					//검색 결과 행정동일시
					if (data.results.content[0].hemdSearch === "Y") {
						searchMode.hemdSearch = true;
					} else {
						searchMode.hemdSearch = false;
					}
					searchMode.schResultMode = data.results.content[0].schMode;
				} else {
					searchDataList.value.splice(0);
					pageInfo.totalRecords = 0;
					pageInfo.currentRecords = 0;
					pageInfo.totalPages = 0;
				}
			})
			.catch(error => {
				console.error("error =>", error);
			});
		
	} else {
		//사물주소 검색
		schMode.value = "aot";
		axios.post('/api/solr/solrAotSearch', inqCndParams)
			.then((response) => {
				const data = response.data;
				console.log("############# SOLR 사물주소결과 ->> ", response);
				if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
					const totalElements = data.results.totalElements;
					const pageSize = data.results.size;
					const currentPage = data.results.pageable.pageNumber;
					searchDataList.value = data.results.content.map((item, index) => {
						const rowNumber = currentPage * pageSize + index + 1;
						return {
							...item,
							rowNumber: rowNumber
						}
					})
					
					pageInfo.totalRecords = data.results.totalElements;
					pageInfo.currentRecords = data.results.numberOfElements;
					pageInfo.totalPages = data.results.totalPages;
					
					//검색 결과 100건 이상시 도로명 필터검색 제공
					if (data.results.totalElements > 100) {
						isLargeDataVisible.value = true;	
					} else {
						isLargeDataVisible.value = false;
						filterParams.ctpvCd = "";
						filterParams.roadNm = "";
					}
					
				} else {
					searchDataList.value.splice(0);
					pageInfo.totalRecords = 0;
					pageInfo.currentRecords = 0;
					pageInfo.totalPages = 0;
				}
			})
			.catch(error => {
				console.error("error =>", error);
			});
	}
	
	//명예도로 검색
	axios.post('/api/solr/solrHonorRoadSearch', inqCndParams)
		.then((response) => {
			const data = response.data;
			if (data.results.length > 0) {
				honorRoadData.value = data.results;
				searchMode.honorRoadMode = true;

			} else {
				honorRoadData.value = [];
				searchMode.honorRoadMode = false;  
			}
		})
		.catch(error => {
			console.error("error =>", error);
		});

		subHeaderIsActiveRecentSearches.value = false;
		searchKeyword.value = inqCndParams.keyword;
}

//페이징 버튼 클릭
const onPaging = params => {
	pageInfo.page = params.page !== undefined ? params.page + 1 : 1;
	pageInfo.size = params.rows ? params.rows : pageInfo.size;
      
	inqCndParams.pageable.page = pageInfo.page - 1;
	inqCndParams.pageable.size = pageInfo.size;
      
	console.log("검색 파라미터 ->> ", inqCndParams);
	axiosCall();
}

const toggleView = (index) => {
	isKorMode.value[index] = !isKorMode.value[index];
}

/*----------------------------------------------------------------------- 최근검색어 관련 */

//최근검색어 리스트 변수
const recentSearches = ref([]);

//최근검색어 활성화 여부
const subHeaderIsActiveRecentSearches = ref(false);

//최근검색어 검색어 클릭시 검색창으로 값 바인딩 후 검색수행
const setModelValue = (value) => {
	inqCndParams.keyword = value;
	subHeaderIsActiveRecentSearches.value = false;
	recentSearchesResultRef();
}

//최근검색어 삭제
const clearRecentSearches = (index) => {
  debugger
	if(index == 0 || index != undefined) {
		recentSearches.value.splice(index, 1);
		localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
	} else {
		recentSearches.value = [];
		localStorage.removeItem('recnetSearches');
	}
}

//검색영역 최근검색어 토글기능
const subHeaderToggleActiveRecentSearches = () => {
    subHeaderIsActiveRecentSearches.value = !subHeaderIsActiveRecentSearches.value;
}

const recentSearchesResult = ref(false);

//최근검색어 저장
const historyKeywordSave = () => {
	recentSearchesResult.value = true
	if (inqCndParams.keyword.trim() === '') return;

	const newSearch = {
		value : inqCndParams.keyword,
		date : new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
	};

  // 검색어 중복 체크
  recentSearches.value.some((item, idx, arr) => {
    if (item.value === newSearch.value) {
      arr.splice(idx, 1);
      return true;
    } else {
      return false;
    }
  });

	recentSearches.value.unshift(newSearch);

	if(recentSearches.value.length > 10) recentSearches.value.pop();
	localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
}

/*----------------------------------------------------------------------- 상세주소 관련 */

//상세주소
const dongItems = ref([]);  	//동
const floorItems = ref([]);  	//층
const hoItems = ref([]);  		//호

//상세주소 결과 - 더보기 접기 펼치기 기능
const detailAdressActive = ref([]);

//상세주소 검색 파라미터
const detailParams = reactive({});

//상세주소 조회 - 동조회
const selectDongList = (index) => {
	console.log("index : " + index);
	// 임시 데이터
	detailParams.schMode = "D";
	detailParams.adrMngNo = "BBT00000451110093788";
	axios.post('/api/search/selectJusoDetail', detailParams)
		.then((response) => {
			const data = response.data.results;
			if (data.length > 0) {
				dongItems.value[index] = data.map((item) => ({
					value: item.KEY,
					label: item.VALUE,
				}))
			}
		})
        .catch(error => {
			console.error("error =>", error);
        });
}
    
//상세주소 조회 - 층조회
const changeFloor = (index) => {
	detailParams.schMode = "F";
	axios.post('/api/search/selectJusoDetail', detailParams)
		.then((response) => {
			const data = response.data.results;
			if (data.length > 0) {
	    		floorItems.value[index] = data.map((item) => ({
					value: item.KEY,
					label: item.VALUE,
				}))
			}
		})
        .catch(error => {
			console.error("error =>", error);
        });
}
    
//상세주소 조회 - 호조회
const changeHo = (index) => {
	detailParams.schMode = "H";
	axios.post('/api/search/selectJusoDetail', detailParams)
		.then((response) => {
			const data = response.data.results;
			if (data.length > 0) {
				hoItems.value[index] = response.data.results.map((item) => ({
					value: item.KEY,
					label: item.VALUE,
				}))
			}
    })
    .catch(error => {
		console.error("error =>", error);
    });
}

const detailAdressToggleActive = (index) => {
	detailAdressActive.value[index] = !detailAdressActive.value[index];
	selectDongList(index);
}

const detailAdressButtonIcon = (index) => {
	return detailAdressActive.value[index] ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
}
    
/*----------------------------------------------------------------------- 변동이력 관련 */

//변동이력 검색결과 테이블
const dataTableRef2 = ref(null);

//변동이력 팝업 헤더
const historyTitle = ref(null);

//변동이력 검색결과
const historyDataList = ref([]);

//변동이력 검색
const changeHistoryDialogVisible = ref(false);

//변동이력 팝업 오픈
const changeHistoryOnShowDialog = async(item) => {
	changeHistoryDialogVisible.value = true;

	setTimeout(() => {
		document.querySelector('#changeHistoryDialogFocus').focus();
	}, 0);
	await nextTick();
	const headers = document.querySelectorAll('th[role="columnheader"]');
	
	headers.forEach(header => {
		header.setAttribute('scope', 'col');
	})

	const dataTableEl = dataTableRef.value.$el.querySelector('.p-datatable-table');
	if (dataTableEl) {
		const caption = document.createElement('caption');
		caption.textContent = '변동이력 테이블입니다. 변동일자, 주소, 고시여부, 읍면동, 변동구분을 제공합니다.';
		dataTableEl.prepend(caption);
	}
        
	historyTitle.value = item.rdNm;
	selectHistory(item.id, item.rdNm);
}
    
//변동이력 조회
const selectHistory = (id, rdNm) => {
	schMode.value = "hstry";
	detailParams.adrMngNo = "BBT00000451110087495";
	axios.post('/api/search/selectHistroyList', detailParams)
		.then((response) => {
			const data = response.data.results;
			console.log("############# result ->> ", data);
			historyDataList.value = data;
		})
        .catch(error => {
        	console.error("error =>", error);
        });
}

//변동이력 팝업 종료
const changeHistoryCloseDialog = () => {
	changeHistoryDialogVisible.value = false;
	document.querySelector('#changeHistoryOnShow').focus();
}

/*----------------------------------------------------------------------- 도로명 필터 관련 */

//지역선택 드롭다운 변수
const itemsCity = ref([]);
const itemsCounty = ref([]);

//도로명 필터검색 여부
const isLargeDataVisible = ref(false);

//필터링 검색 파라미터
const filterParams = reactive({
	keyword : ''
	,ctpvCd : ''
	,roadNm : ''
	,strSearchType : "HSTRY"
	,strFirstSort : "none"
	,strAblYn : "N"
	,strAotYn : "N"
	,strSynnYn : null
	,strHstryYn : "Y"
	,reqFrom : "RN_SEARCH_KOR_WEB"
	,checkMoblieYn : "N"
	,strFunctionName : "Y"
	,pageable : {
		page : currentPage.value,
		size : pageSize.value,
	}
});

watch(() => filterParams.ctpvCd, (newVal) => {
	if (newVal != "시/도 선택") {
		filterParams.keyword = newVal + " " + searchKeyword.value;
		solrRoadSearch();
	} 
})
    
//시도 데이터 (jusoCommon.ts)
const loadSidoData = async () => {
	try {
		const data = await sidoDataLoad();
		itemsCity.value = [{ label: '시/도 선택', value: null }, ...data];
	} catch (error) {
		console.error('error =>', error);
	}
}
    
//도로명 조회
const solrRoadSearch = () => {
	console.log("############## filterParams ->>", filterParams);
	axios.post('/api/solr/solrFilterSearch', filterParams)
		.then((response) => {
			const data = response.data.results;
			console.log('data ->', data);
			if (data.length > 0) {
				itemsCounty.value = data.map((item) => ({
					value: item,
				}))
			} 
		})
        .catch(error => {
        	console.error("error =>", error);
        });
}
    
//도로명 필터검색
const filterSearch = () => {
	if (filterParams.roadNm === "") {
		alert("도로명을 선택해주세요.");
		return false;
	} else {
		inqCndParams.keyword = filterParams.roadNm;
		
		//최근검색어 저장
		historyKeywordSave();
		inqCndParams.pageable.page = 0;
		axiosCall();
	}
}
    
/*----------------------------------------------------------------------- 정렬 관련 */

//정렬기준을 정확도순 체크상태로 초기화
const selectedCategoriesRadio = ref('정확도순');

//정렬기능
const sortChange = (newValue) => {
	if (selectedCategoriesRadio.value === "도로명 포함") {
		inqCndParams.strFirstSort = "road";
	} else if(selectedCategoriesRadio.value === "지번 포함") {
		inqCndParams.strFirstSort = "location";
	} else {
		inqCndParams.strFirstSort = "none";
	}
	console.log("검색 파라미터 ->> ", inqCndParams);
	axiosCall();
}
    
/*----------------------------------------------------------------------- 자동완성 관련 */

//자동완성 조회 파라미터
const autoParams = reactive({
	keyword : ''
	, autoStart : 0
	, autoRow : 30
	, type : 'AUTO'
})

//자동완성 여부
const isAutoCompleteOpen = ref(false);

//자동완성 결과 변수
const autoCompleteDataList = ref([]);

//체크박스 선택 이벤트
const chgCheckBox = (label) => {
	if(label === "자동완성 사용 안함") {
		const isChecked = selectedCategoriesResult.value.includes(label);
		if(isChecked) {
			isAutoCompleteOpen.value = false;
		} else {
			isAutoCompleteOpen.value = true;
		}
	}

	if(label === "사물주소 검색") {
		const isChecked = selectedCategoriesResult.value.includes(label);
		if(isChecked) {
			inqCndParams.strAotYn = "Y"
		} else {
			inqCndParams.strAotYn = "N"
		}
	}

	if(label === "폐지된 주소정보 포함") {
		const isChecked = selectedCategoriesResult.value.includes(label);
		if(isChecked) {
			inqCndParams.strAblYn = "Y";
		} else {
			inqCndParams.strAblYn = "N";
		}
	}
	
	if(label === "좌표검색") {
		const isChecked = selectedCategoriesResult.value.includes(label);
		if(isChecked) {
			coordinateMode.value = true;
			inqCndParams.strSearchType = "COORDINATE";
		} else {
			coordinateMode.value = false;
			inqCndParams.strSearchType = "HSTRY";
		}
	}
}
    
//자동완성 조회
const fnSolrAutoComplete = (event) => {
	if(isAutoCompleteOpen.value) {
		if(event.target.value.length > 0) {
			autoParams.keyword = event.target.value;
			console.log("############ 자동완성 조회 ->> ", autoParams);
			axios.post('/api/solr/solrAutocomplete', autoParams)
				.then((response) => {
					const data = response.data;
					console.log("############ 자동완성 :: ", data);
					if (data.results != undefined && data.results.length > 0) {
						autoCompleteDataList.value = data.results.map(item => item.autoComplete || item);
						subHeaderIsActiveRecentSearches.value = true;
					} else {
						autoCompleteDataList.value.splice(0);
					}
				})
				.catch(error => {
					console.error("error =>", error);
				});
		}
	}
};

//자동완성 선택 시
const selectSuggesion = (val) => {
	inqCndParams.pageable.page = 0;
	inqCndParams.keyword = val;
	console.log("검색 파라미터 ->> ", inqCndParams);
	recentSearchesResultRef();
}
    
/*----------------------------------------------------------------------- 도로명정보 팝업 관련 */

//도로명 정보 조회결과
const roadDetail = ref({});

//도로명 정보 팝업 활성화
const dialogVisible = ref(false);

//도로명 정보 팝업 조회
const roadInfoPop = (rdMgtSn) => {
	console.log('############ rdMgtSn -->', rdMgtSn);
	let testRdMgtSn = "1144022113001";
	if (rdMgtSn != null) {
		axios.get('/api/ahs/selectRoadLocation/' + testRdMgtSn)
			.then((data) => {
				if (data.data !== null) {
					console.log("테스트 =======>", data.data.results.list[0])
					Object.assign(roadDetail.value, data.data.results.list[0]);
					roadDetail.value.noticeYmd = formatData(roadDetail.value.noticeYmd);
					roadDetail.value.effectDe = formatData(roadDetail.value.effectDe);
					roadDetail.value.roadLt = roadDetail.value.roadLt.toLocaleString();
				}
			})
            .catch(error => {
            	console.error("error =>", error);
            });
	}
	dialogVisible.value = true;
}

//도로명정보 팝업 종료
const closeDialog = () => {
	dialogVisible.value = false;
}
    
//팝업 고시일, 효력발생일 포맷
const formatData = (dateStr) => {
	if (dateStr && dateStr.length === 8) {
		return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
	}
	return dateStr;
}
  
//도로구간보기(새창)
const fnSearchRoadMap = () => {
	//도로구간 데이터 (도로명코드, 도로명, 시군구코드)
	const roadNmCd = "2113001";
	const roadNm = "마포대로";
	const lgvCd = "11440";
	let url = '/map/totalMapView?';
	url += `searchType=roadNm&rdCd=${roadNmCd}&rdNm=${roadNm}&sigCd=${lgvCd}`;
	const width = window.innerWidth;
	const height = window.innerHeight;
	window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
}

/* ------------------------------------------------------------------------------------------------------- */
//도로명 복사
const copy = (val) => {
	const el = document.createElement('textarea');
	el.value = val;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
	alert("도로명주소가 클립보드로 복사되었습니다.\n" + val);
}

//검색결과 미니맵 변수
const miniMapPop = ref(null);

//미니맵 오픈
const mapViewOnShowDialog = (item) => {
	miniMapPop.value.show(item);
}

//검색어 초기화
const clearInput = () => {
	inqCndParams.keyword = '';
	setTimeout(() => {
		const inputElement = document.querySelector('.mainSearchBox input');
		if (inputElement) {
            inputElement.focus();
        }
	}, 0);
};

//명예도로 메뉴 이동
const honorRoadView = (data) => {
	console.log("############# 명예도로 화면 이동 ->> ", data);
	router.push({ 
		path: '/ahu/ahuHonorRoadList',  
		query: { khnrdNm: data.hrNm } 
	});
}

//검색창 확장 토글
const searchCurrent = ref(false);
const searchCurrentRecentSearches = () => {
	searchCurrent.value = !searchCurrent.value;
}

//우편주소 표기방법 토글
const postActive = ref(false);
const postToggleActive = () => {
	postActive.value = !postActive.value;
}

//더보기 토글
const moreActive = ref([]);
const moreToggleActive = (index) => {
	moreActive.value[index] = !moreActive.value[index];
}

const moreButtonIcon = (index) => {
	return moreActive.value[index] ? 'bi bi-dash' : 'bi bi-plus';
}

const isFixed = ref(false);
const handleScroll = () => {
	isFixed.value = window.scrollY > 20;
}

const isMobile = ref(false);
const checkWindowSize = () => {
	isMobile.value = window.innerWidth <= 1080;
}

const scrollToTop = () => {
  const url = '/map/totalMapView';
  const width = window.innerWidth;
  const height = window.innerHeight;
  window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);

  window.scrollTo({top:0, behavior: 'smooth'});
}

onMounted(() => {
	loadSidoData();
	window.addEventListener('scroll', handleScroll);
	checkWindowSize();
 	window.addEventListener('resize', checkWindowSize);

 	//최근검색어
 	const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
 	recentSearches.value = savedSearches;
})
     
onBeforeUnmount(() => {
	window.removeEventListener('scroll', handleScroll);
 	window.removeEventListener('resize', checkWindowSize);
})

 </script>