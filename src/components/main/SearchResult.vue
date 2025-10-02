<template>
			<div id="totalResultBox">
                <div class="resultLayerPopup__innerWrap" style="">	
                    <p class="resultLayerPopup__resultText" v-if="searchMode.schResultMode != 'POST' && searchKeyword != '' && !engKeywordToggle">
                        검색어 <strong class="text">"</strong><strong class="text" v-dompurify-html="searchKeyword"/><strong class="text">"</strong> 에 대한 검색결과 총 <strong class="text">{{ pageInfo.totalRecords.toLocaleString() }}</strong>건입니다.
                    </p>
                    <p class="resultLayerPopup__resultText" v-if="searchMode.schResultMode == 'POST'">
                        검색어 <strong class="text">"{{ searchKeyword }}"</strong>에 대한<br />검색 결과가 없어 <strong class="text">주변 주소</strong>로 검색한 결과 총 <strong class="text">{{ pageInfo.totalRecords.toLocaleString() }}</strong>건입니다.
                    </p>
                    <p class="resultLayerPopup__resultText" v-if="engKeywordToggle">
                        입력한 <strong class="text">"{{ searchKeyword }}"</strong> 검색 결과가 없어<br>검색어 <strong class="text">"{{ engToKorKeyword }}"</strong>에 대한 검색 결과 총 <strong class="text">{{ pageInfo.totalRecords.toLocaleString() }}</strong> 건입니다.
                    </p>
                    <p class="resultLayerPopup__administration" v-if="searchMode.hemdSearch">
						<span class="commonBullet">※</span> 해당주소는 행정동으로 검색된 주소입니다.<br />
						검색 편의를 위해 제공하는 참고정보로 검색 목적 이외에 다른 용도로 사용할 수 없습니다.
					</p><br/>
                    <!-- 명예도로 1건일때 -->
                    <div class="honorLoad__wrap" v-if="searchMode.honorRoadMode">
                        <div class="honorLoad__title">명예도로</div>
                        <ul class="honorLoad__textWrap">
                            <!-- 다건일때 -->
                            <li class="honorLoad__li__top" style="margin-top: 0;" v-if="honorRoadData.length > 1 && !honorMode">
                                <span class="honorLoad__text">
                                    <strong class="str">"{{ honorRoadData[0].hrNm }}" ({{ honorRoadData[0].siNm }} {{ honorRoadData[0].sggNm }})</strong> 명예도로 외 <strong class="str">{{ honorRoadData.length-1 }}건</strong>이 존재합니다. 
                                </span>
                            </li>
                            
                            <li v-if="honorRoadData.length > 1 && honorMode" v-for="(item, index) in honorRoadData" :key="index">
                                <span class="honorLoad__text">
                                    <strong class="str">"{{ item.hrNm }}" ({{ item.siNm }} {{ item.sggNm }})</strong><span class="moCotent">명예도로가 존재합니다.</span>
                                </span>
                                <a href="javascript:void(0);" class="honorLoad__button" title="명예도로 검색" @click="honorRoadView(item)">상세보기 <i aria-hidden="true" class="bi bi-arrow-right"></i></a>
                            </li>
                            
                            <!-- 단건일때 -->
                            <li v-if="honorRoadData.length == undefined">
                                <span class="honorLoad__text">
                                    <strong class="str">"{{ honorRoadData.hrNm }}" ({{ honorRoadData.siNm }} {{ honorRoadData.sggNm }})</strong><span class="moCotent">명예도로가 존재합니다.</span>
                                </span>
                                <a href="javascript:void(0);" class="honorLoad__button" title="명예도로 검색" @click="honorRoadView(honorRoadData)">상세보기 <i aria-hidden="true" class="bi bi-arrow-right"></i></a>
                            </li>
                        </ul>
                        
                        <div class="honorLoad__functionBox" v-if="honorRoadData.length > 1">
                            <button type="button" class="honorLoad__button02 open" title="더보기" style="display: block;" @click="honorLoadMore()" v-if="!honorMode">자세히 보기 <i aria-hidden="true" class="bi bi-chevron-down"></i></button>
                            <button type="button" class="honorLoad__button02 close" title="더보기" style="display: block;" @click="honorLoadMore()" v-if="honorMode">닫기 <i aria-hidden="true" class="bi bi-chevron-up"></i></button>
                        </div>
                    </div>
                    <!-- //명예도로 1건일때 -->

                    <!-- 검색결과가 없는 경우 -->
                    <div class="resultLayerPopup__noSearchResults" v-if="searchResultVind == false">
                        <p class="resultLayerPopup__noSearchResultText"><br><br>검색결과가 없는 경우<br> 도로에 부여된 기초번호를 이용하여 위치를 조회할 수 있습니다.</p>
                        <div class="resultLayerPopup__noSearchResultsMap">
                            <p class="resultLayerPopup__noSearchResultsMapTitle">지도에서 위치찾기</p>
                            <p class="resultLayerPopup__noSearchResultsMapText">도로명주소 안내도를 확인하여<br>기초번호로 위치를 조회할 수 있습니다.</p>
                            <div class="resultLayerPopup__noSearchResultsMapButton">
                                <button class="commonButton__button" title="위치찾기" @click="emit('mapCall', chkSearchRoadResult)">
                                    <span class="commonButton__text">위치찾기</span>
                                    <i aria-hidden="true" class="bi bi-box-arrow-up-right" style="display:flex;"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- //검색결과가 없는 경우 -->
                    
                    <!-- 시/도, 도로명 필터 -->      
                    <div class="resultLayerPopup__detailSearchBox" v-if="isLargeDataVisible">
                        <div class="resultLayerPopup__detailSearchBoxInner">
                            <label for="selectGroupBySido" class="blind">시/도</label>
                            <select id="selectGroupBySido" class="resultLayerPopup__select selectStype01" title="시/도 선택" v-model="filterParams.ctpvCd">
                                <option value="" selected>시/도 선택</option>
                                <option v-for="option in itemsCity" :key="option.value" :value="option.value">
                                	{{ option.label }}
                                </option>
                            </select>
                            <label for="selectGroupByRoad" class="blind">도로명</label>
                            <select id="selectGroupByRoad" class="resultLayerPopup__select selectStype02" title="도로명 선택" v-model="filterParams.roadNm">
                                <option value="" selected>도로명 선택</option>
                                <option v-for="option in itemsCounty" :key="option.value" :value="option.value">
                                	{{ option.label }}
                                </option>
                            </select>
                            <button class="resultLayerPopup__detailSearchButton" type="button" title="시/도, 도로명 검색하기" @click="filterSearch">
                                <i aria-hidden="true" class="bi bi-search"></i>검색
                            </button>
                        </div>
                        <p class="resultLayerPopup__detailSearchBoxTip">
                            <i aria-hidden="true" class="bi bi-exclamation-circle-fill"></i>주소검색 결과가 많습니다. 도로명을 선택하여 검색 범위를 좁힐 수 있습니다.
                        </p>
                    </div>
                    <!-- 시/도, 도로명 필터 -->     

                    <!-- 정렬 -->
		            <div class="resultLayerPopup__filter" v-if="pageInfo.totalRecords > 0">
		                <div class="resultLayerPopup__radio" v-for="checkList in categoriesRadio" :key="checkList.key" @keydown="handleKeydown">
		                    <input type="radio" v-model="selectedCategoriesRadio" :id="checkList.key" :value="checkList.name" @change="sortChange"/>
		                    <label :for="checkList.key">{{ checkList.name }}</label>
		                </div>
		                <p class="resultLayerPopup__filterTip"><i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 입력한 키워드가 선택한 항목에 포함되는 주소정보가 우선정렬 되고, 도로명주소 순으로 정렬됩니다.</p>
		            </div>

                    <div class="resultLayerPopup__scroll">
                        <!-- <div class="p-scrollpanel-wrapper"> -->
                            <div class="p-scrollpanel-content">
                                <ul class="resultLayerPopup__list">
                                    <li v-for="(item, index) in searchDataList" :key="index">
                                    
                                        <div class="resultLayerPopup__detailBox">
                                            <div class="resultLayerPopup__detailBoxNumber">{{ item.rowNumber }}</div>
                                            <div class="resultLayerPopup__listDetail basic">
                                                <div class="resultLayerPopup__listDetailContent moContent">
                                                    <span class="number">{{ item.zipCl }}</span>
                                                    <span class="resultLayerPopup__abolition" v-if="(item.ablYn === '1' && item.ntfcDe == '1') || (item.ablYn === '1' && item.ntfcDe == '0')">
                                                    	<i aria-hidden="true" class="bi bi-exclamation-circle-fill"></i> 
                                                    	폐지
                                                    </span>
                                                    <span class="resultLayerPopup__history" v-if="item.hstryYn === '2.0'">
                                                    	<i aria-hidden="true" class="bi bi-exclamation-circle-fill"></i>
                                                    	이력</span>
                                                    <span class="resultLayerPopup__unpublished" v-if="item.ablYn != '1' && item.ntfcDe == '0'">
                                                    	<i aria-hidden="true" class="bi bi-exclamation-circle-fill"></i>
                                                    	미고시
                                                    </span>
                                                    <button type="button" class="resultLayerPopup__english" @click="toggleView(index)">영문</button>
                                                    <button class="resultLayerPopup__copyButton kor" type="button" title="주소복사하기" @click="copy(schMode == 'hstry' ? item.schKorRoadNm : item.bdSnTxt)" v-if="!isKorMode[index]">복사</button>
                                                    <button class="resultLayerPopup__copyButton eng" type="button" title="주소복사하기" @click="copy(schMode == 'hstry' ? item.schEngRoadNm : item.bdEngSn)" v-if="isKorMode[index]">복사</button>
                                                </div>
                                                <p class="resultLayerPopup__listDetailTitle">
                                                	<div v-if="schMode == 'hstry'">
	                                                    <strong>도로명주소</strong>
                                                	</div>
                                                	<div v-if="schMode == 'aot'">
	                                                    <span>사물이름</span>
                                                	</div>
                                                </p>
                                                
                                                <div class="resultLayerPopup__listDetailContent pcContent">
                                                    <div class="resultLayerPopup__innerBox">
                                                        <strong class="roadNameText" v-if="schMode == 'hstry'">
<!-- 
                                                           {{ !isKorMode[index] ? (item.siNm + ' ' + (_.isEmpty(item.sggNm) ? '' : item.sggNm + ' ')
                                                            + (_.isEmpty(item.riNm) ? '' : item.emdNm + ' ') + item.rdNmStr + ' ' + (_.isEmpty(item.udrtYn) ? '' : item.udrtYn + ' ')
                                                            + item.bdMaSn + (item.bdSbSn > 0 ?  '-' + item.bdSbSn : '') + ' ' + (_.isEmpty(item.riNm) ?'(' + item.emdNm + ')' : '') ) : item.schEngRoadNm }}
 -->
                                                           {{ !isKorMode[index] ? item.schKorRoadNm : item.schEngRoadNm }}
                                                        </strong>
                                                        <span class="roadNameText">{{ item.objNm }}</span>
                                                        <div class="addrEngInfo" style="display: none;">
                                                            <strong>{{ item.schEngJibunNm }}</strong>
                                                        </div>
                                                        <span class="resultLayerPopup__copy type01" v-if="schMode == 'hstry'">
                                                            <button class="commonButton__resultButton kor" type="button" title="주소복사하기" @click="copy(item.schKorRoadNm)" v-if="!isKorMode[index]">복사</button>
                                                            <button class="commonButton__resultButton eng" type="button" title="주소복사하기" @click="copy(item.schEngRoadNm)" v-if="isKorMode[index]">복사</button>
                                                        </span>
                                                        <span class="resultLayerPopup__abolition" v-if="(item.ablYn === '1' && item.ntfcDe == '1') || (item.ablYn === '1' && item.ntfcDe == '0')">
			                                            	<i aria-hidden="true" class="bi bi-exclamation-circle-fill" /> 폐지
			                                            </span>
			                                            <span class="resultLayerPopup__history" v-if="item.hstryYn === '2.0'">
			                                            	<i aria-hidden="true" class="bi bi-exclamation-circle-fill"></i>이력
			                                            </span>
			                                            <span class="resultLayerPopup__unpublished" v-if="item.ablYn != '1' && item.ntfcDe == '0'">
			                                            	<i aria-hidden="true" class="bi bi-exclamation-circle-fill"></i>미고시
			                                            </span>
                                                    </div>
                                                </div>
                                                <p v-if="schMode == 'hstry'" class="resultLayerPopup__listDetailTitle">지번</p>
                                                <p v-if="schMode == 'aot'" class="resultLayerPopup__listDetailTitle"><strong>사물주소</strong></p>
                                                <div class="resultLayerPopup__listDetailContent jibun">
                                                    <p class="resultLayerPopup__innerBox">
                                                        <span class="roadNameText" v-if="schMode == 'hstry' && !isKorMode[index]" v-dompurify-html="item.schKorJibunNmBold"/>
                                                        <span class="roadNameText" v-if="schMode == 'hstry' && isKorMode[index]" v-dompurify-html="item.schEngJibunNm"/>
                                                        <strong class="roadNameText" v-if="schMode == 'aot'">{{ !isKorMode[index] ? item.bdSnTxt : item.bdEngSn }}</strong>
                                                        <span class="resultLayerPopup__copy type01" v-if="schMode == 'aot'">
                                                            <button class="commonButton__resultButton kor" type="button" title="주소복사하기" @click="copy(item.bdSnTxt)" v-if="!isKorMode[index]">복사</button>
                                                            <button class="commonButton__resultButton eng" type="button" title="주소복사하기" @click="copy(item.bdEngSn)" v-if="isKorMode[index]">복사</button>
                                                        </span>
                                                        <span v-if="!isKorMode[index]" class="addrEngInfo" style="display: none;" v-dompurify-html="">
                                                            {{ !isKorMode[index] ? item.schKorJibunNm : item.schEngJibunNm }}
                                                        </span>
                                                        <span v-else class="addrEngInfo" style="display: none;">
                                                            {{ !isKorMode[index] ? item.schKorJibunNm : item.schEngJibunNm }}
                                                        </span>
                                                    </p>
			                                        <div class="resultLayerPopup__relatedAddress" v-if="item.relJibun">
			                                            <span class="resultLayerPopup__relatedAddressTitle">관련지번</span> {{ item.relJibun }}
			                                        </div>
			                                        
			                                        <div class="resultLayerPopup__detailAdressFunction" v-if="(inqCndParams.strAotYn == 'N') && item.adrDcCount != '0' && item.secAdrYn == null">
						                                <button class="resultLayerPopup__detailAdressButton" @click="detailAdressToggleActive(index, item)" :class="{active : detailAdressActive[index]}" :title="detailAdressActive[index] ? '상세주소(동·층·호) 닫기' : '상세주소(동·층·호) 열기'">
						                                    <span>상세주소(동·층·호) 보기</span>
						                                    <i aria-hidden="true" class="bi bi-chevron-down"></i>
						                                </button>
				                            		</div>
			                                        
                                                </div>
                                            </div>
                                            <div class="resultLayerPopup__function">
                                                <div class="resultLayerPopup__functionPostalCodeWrap">
                                                    <strong class="resultLayerPopup__functionPostalCodeText" v-if="schMode == 'hstry'">
                                                        우편번호
                                                    </strong>
                                                    <strong class="resultLayerPopup__functionPostalCodeNumber">
                                                        {{ item.zipCl }}
                                                    </strong>
                                                </div>
                                                <div class="resultLayerPopup__apt pcContent" v-if="item.aphusYn == '1'">아파트</div>                        
                                                <button type="button" class="resultLayerPopup__functionButton en pcContent" title="영문보기" @click="toggleView(index)">{{ isKorMode[index] ? '국문' : '영문' }}</button>
                                                <div class="btnChangeLang viewEng" style="display: none;"></div>
                                                <button type="button" class="resultLayerPopup__functionButton load" title="도로명정보" v-if="schMode == 'hstry'" @click="fnRoadInfo(item.rdMgtSn)">도로명정보</button>
                                                <button id="btnMiniMaplist1" type="button" class="resultLayerPopup__functionButton map" @click="mapViewOnShowDialog(item)" title="지도에서 찾기" v-if="item.ablYn != '1'">지도보기</button>
                                            </div>
                                        </div>
                                        
			                            <!-- 동, 층, 호 -->
										<div class="resultLayerPopup__detailAdress" :class="{detailAdressActive : detailAdressActive}" v-if="detailAdressActive[index]">
			                                <ul class="resultLayerPopup__eastWestFloor">
			                                    <li class="sel_addrInfo">
													<label for="east" class="blind">동 선택하기</label>
													<!-- <CustomDropdown class="resultLayerPopup__eastWestFloorSelect" inputId="east" :options="dongItems[index]" optionLabel="label" optionValue="value" v-model="detailParams.bddgMgno" @change="changeFloor(index)" title="동 선택하기" placeholder='동을 선택하세요.' /> -->
													<select id="selectGroupBySido" class="eastWestFloor__select" title="동 선택" v-model="detailParamsJuso[index].bddgMgno" @change="changeFloor(index)">
						                                <option value="">동을 선택하세요.</option>
						                                <option v-for="option in dongItems[index]" :key="option.value" :value="option.value">
						                                	{{ option.label }}
						                                </option>
						                            </select>
								                </li>
								                <li class="sel_addrInfo">
								                  <label for="west" class="blind">층 선택하기</label>
								                  <!-- <CustomDropdown class="resultLayerPopup__eastWestFloorSelect" inputId="west" :options="floorItems[index]" optionLabel="label" optionValue="value" v-model="detailParams.bdflMgno" @change="changeHo(index)" title="층 선택하기" placeholder='층을 선택하세요.' /> -->
													<select id="selectGroupBySido" class="eastWestFloor__select" title="층 선택" v-model="detailParamsJuso[index].bdflMgno" @change="changeHo(index)">
						                                <option value="">층을 선택하세요.</option>
						                                <option v-for="option in floorItems[index]" :key="option.value" :value="option.value">
						                                	{{ option.label }}
						                                </option>
						                            </select>
								                </li>
								                <li class="sel_addrInfo">
								                  <label for="floor" class="blind">호 선택하기</label>
								                  <!-- <CustomDropdown class="resultLayerPopup__eastWestFloorSelect" inputId="floor" :options="hoItems[index]" optionLabel="label" optionValue="value" v-model="detailParams.bdhoMgno" title="호 선택하기" placeholder='호을 선택하세요.' /> -->
													<select id="selectGroupBySido" class="eastWestFloor__select" title="호 선택" v-model="detailParamsJuso[index].bdhoMgno" @change="detailJuso(item.schKorRoadNm, index)" >
						                                <option value="">호를 선택하세요.</option>
						                                <option v-for="option in hoItems[index]" :key="option.value" :value="option.value">
						                                	{{ option.label }}
						                                </option>
						                            </select>
								                </li>
			                                </ul>
			                                
			                                <div v-if="detailParamsJuso[index].bdhoMgno">
				                                <div class="resultLayerPopup__innerBox">
				                                    {{ detailParamsJuso[index].fullJuso }} 
				                                    <span class="resultLayerPopup__copy">
				                                        <Button class="commonButton__resultButton" title="주소복사하기" @click="copy(detailParamsJuso[index].fullJuso)">복사</Button>
				                                    </span>
				                                </div>
				                                <p class="resultLayerPopup__eastWestFloorTip" v-if="detailParamsJuso[index].dongInFloorValid"><span class="commonBullet">※</span> 위 주소는 '호'에 '층'정보가 포함되어 있어 층을 생략하고 표기할 수 있습니다.</p>
			                                </div>
			                            </div>
                                        
                                        <div class="resultLayerPopup__moreFunction">
                                            <button class="resultLayerPopup__moreButton" type="button" title="더보기 펼치기" @click="moreToggleActive(index)" :class="{active : moreActive[index]}" :title="moreActive[index] ? '더보기 접기' : '더보기 펼치기'" >
                                                <i aria-hidden="true" class="bi bi-plus" v-if="!moreActive[index]"></i>
                                                <i aria-hidden="true" class="bi bi-dash" v-if="moreActive[index]"></i>
                                                <span>{{ moreActive[index] ? '접기' : '더보기' }}</span>
                                            </button>
                                            
                                            <div class="resultLayerPopup__listDetail more" :class="{moreActive : moreActive}" v-if="moreActive[index]">
                                                <p class="resultLayerPopup__listDetailTitle">영문</p>
                                                <div class="resultLayerPopup__listDetailContent">
                                                    <div class="resultLayerPopup__innerBox post">
                                                    	{{ schMode == 'hstry' ? item.schEngRoadNm : (( item.bdMaSn ? item.bdMaSn : "" ) + (item.bdSbSn ? "-" + item.bdSbSn : "") + 
                                                        " " + item.rdEngNm + ", " + item.sggEngNm + ", " + item.siEngNm ) }}
                                                        <button id="engAddr_dt_button_1" class="resultLayerPopup__commonButton type01 postButton" type="button" v-if="schMode == 'hstry'" :title="postActive ? '우편주소 표기방법 접기' : '우편주소 표기방법 펼치기'" @click="postToggleActive">
                                                            <span>우편주소 표기방법</span>
                                                            <i aria-hidden="true" class="bi bi-arrow-right"></i>
                                                        </button>
                                                        
														<button id="engAddr_dt_button_2" class="resultLayerPopup__commonButton type01 postButton" v-if="schMode == 'aot' && objList.includes(item.objKndCd)" type="button" title="출입구정보 열기" @click="objToggleActive(index)">
					                                        <span>출입구정보</span> 
		                                                    <i aria-hidden="true" class="bi bi-arrow-right"></i>
			                                    		</button>
                                                    </div>
                                                    
                                                    <div>
	                                                    <div id="engAddr_dt_button_1_div" class="resultLayerPopup__postDetail" :class="{active : postActive}" v-if="postActive && schMode == 'hstry'">
	                                                        <p id="engAddr_dt_button_1_enText" class="resultLayerPopup__enText" :class="{active : postActive}">
	                                                            {{ item.zipEngNm }}
	                                                        </p>
	                                                        <div id="engAddr_dt_button_1_notation" class="resultLayerPopup__notation" :class="{active : postActive}">
	                                                            <p class="resultLayerPopup__notationTitle">상세주소(동,층,호)를 포함한 영문 우편주소 표기방법 안내</p>
	                                                            <dl class="resultLayerPopup__notationList">
	                                                                <dt>유형1</dt>
	                                                                <dd>
	                                                                    <p class="resultLayerPopup__notationListTitle">"동"과 "호"  표기</p>
	                                                                    <p class="resultLayerPopup__notationListDetail">주소가 "세종특별자치시 도움6로 42"이고 "705동 1104호"인 경우</p>
	                                                                    <p class="resultLayerPopup__notationListEn">705-1104, 42Doum 6-ro, Sejong-si, 30112, Republic of Korea</p>
	                                                                </dd>
	                                                                <dt>유형2</dt>
	                                                                <dd>
	                                                                    <p class="resultLayerPopup__notationListTitle">"층"  표기</p>
	                                                                    <p class="resultLayerPopup__notationListDetail">주소가 "세종특별자치시 도움6로 42"이고 "3층"인 경우</p>
	                                                                    <p class="resultLayerPopup__notationListEn">3F, 42Doum 6-ro, Sejong-si, 30112, Republic of Korea</p>
	                                                                </dd>
	                                                                <dt>유형3</dt>
	                                                                <dd>
	                                                                    <p class="resultLayerPopup__notationListTitle">"지하"  표기</p>
	                                                                    <p class="resultLayerPopup__notationListDetail">주소가 "세종특별자치시 도움6로 42"이고 "지하102"인 경우</p>
	                                                                    <p class="resultLayerPopup__notationListEn">B102, 42Doum 6-ro, Sejong-si, 30112, Republic of Korea</p>
	                                                                </dd>
	                                                            </dl>
	                                                        </div>
	                                                    </div>
	                                                    
														<div v-if="objActive[index] && schMode == 'aot' && objList.includes(item.objKndCd)" id="engAddr_dt_button_1_notation" class="resultLayerPopup__postDetail active" :class="{active : objActive[index]}">
						                                    <div class="resultLayerPopup__notation">
						                                    	<div class="tab_content">
						                                    		<p style="font-size: 25px; margin-bottom: 20px;">출입구정보</p>
							                                    	<table class="resultLayerPopup__addressOfThingContentTable">
							                                    		<caption class="blind">사물주소 정보 테이블로 순번, 구분, 주소, 출입구 정보를 제공합니다.</caption>
																		<colgroup>
																			<col class="cols20">
																			<col class="cols20">
																			<col class="colsAuto">
																			<col class="cols20">
																		</colgroup>
																		<thead>
																			<tr>
																				<th>순번</th>
																				<th>{{ item.objKndCd == "T30101" ? "층" : "구분"}}</th>
																				<th>{{ item.objKndCd == "T30101" ? "출입구" : "주소"}}</th>
																				<th>{{ item.objKndCd == "T30101" ? "사물주소" : "출입구"}}</th>
																			</tr>
																		</thead>
																		<tbody>
																			<tr v-if="objActive" v-for="(info, idx) in item.objadresInfo" >
																				<td class="center">{{ idx+1 }}</td>
																				<td class="center">{{ item.objKndCd == "T30101" ? (!info.floCo ? "1층" : info.floCo + "층") : (!info.pointSe ? "-" : info.pointSe) }}</td>
																				<td class="center">{{ item.objKndCd == "T30101" ? "등록" : info.bdSn }}</td>
																				<td class="center">{{ item.objKndCd == "T30101" ? info.bdSn : (info.reprsntYn == 'Y' ? '주출입구' : '보조출입구') }}</td>
																			</tr>
																		</tbody>
																	</table>
																</div>
															</div>
				                                			</div>
                                                    	</div>
                                               	</div>
                                                
                                                <p class="resultLayerPopup__listDetailTitle" v-if="item.ablYn === '0'">관할주민센터</p>			
                                                <div class="resultLayerPopup__listDetailContent" v-if="item.ablYn === '0'">
                                                    <ul class="resultLayerPopup__communityCenter">
                                                            <li>{{ item.siNm }} {{ item.sggNm }} {{ item.juminCenter_01 }}
                                                                <span class="resultLayerPopup__phone">
                                                                    <a :href="`tel:${item.juminCenterNumber_01}`" title="관할주민센터 전화연결">
                                                                        <i aria-hidden="true" class="bi bi-telephone-fill"></i>
                                                                        {{ item.juminCenterNumber_01 }}
                                                                    </a>
                                                                </span>
                                                            </li>
                                                    </ul>
                                                    <ul class="resultLayerPopup__tip">
                                                        <li>
                                                            <span class="commonBullet">※</span>관할주민센터는 참고정보이며, 실제와 다를 수 있습니다.
                                                        </li>
                                                    </ul>
                                                </div>
                                                <p class="resultLayerPopup__listDetailTitle" v-if="schMode == 'hstry' && item.detBdNm != '-'">상세건물명</p>			
                                                <div class="resultLayerPopup__listDetailContent" v-if="schMode == 'hstry' && item.detBdNm != '-'">
                                                    <ul class="resultLayerPopup__communityCenter">
                                                            <li>{{ item.detBdNm }}
                                                            </li>
                                                    </ul>
                                                </div>
                                                
                                                <p class="resultLayerPopup__listDetailTitle" v-if="schMode == 'hstry'">주소변동이력 </p>
                                                <div class="resultLayerPopup__listDetailContent recordButtonWrap" tabindex="1" v-if="schMode == 'hstry'">
                                                    <span class="resultLayerPopup__listDetailContentGap">
                                                        <button class="resultLayerPopup__commonButton recordButton" type="button" title="변동이력검색" @click="changeHistoryOnShowDialog(item)">
                                                            <span>변동이력검색</span><i aria-hidden="true" class="bi bi-arrow-right"></i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        <!-- </div>  -->
                    </div>

	                <div class="result__paging" v-if="pageInfo.totalPages > 1">
		                <a title="첫페이지" class="first" @click.prevent="onPaging({ page: 0 })">
		                	<span class="blind">첫페이지</span>
		                </a>
						<a title="이전페이지" class="prev" v-if="pageInfo.totalPages > 10" @click.prevent="onPaging({ page: pageList[0] - 10 })">
							<span class="blind">이전페이지</span>
						</a>
						
						<!-- 페이징 부분 -->
						<div v-for="(item, index) in pageList" :key="index">
							<strong v-if="(inqCndParams.pageable.page == 0 && item == 0) || item == inqCndParams.pageable.page">{{ item+1 }}</strong>
							<a v-else :title="`${item+1}페이지`" @click.prevent="onPaging({ page: item })">{{ item+1 }}</a>
						</div>
						
						<a title="다음페이지" class="next" v-if="pageInfo.totalPages > 10" @click.prevent="onPaging({ page: pageList[pageList.length-1] + 1 })">
							<span class="blind">다음페이지</span>
						</a>
						<a title="끝페이지" class="last" @click.prevent="onPaging({ page: pageInfo.totalPages-1 })">
							<span class="blind">끝페이지</span>
						</a>
					</div>

                </div>
                
				<!-- 지도에서 찾기 (미니맵) -->
				<MiniMapPopup ref="miniMapPop" />
				
				<!-- 
                <div id="map" class="resultMapViewDialog" role="dialog" :style="{ display: miniMapPop === true ? 'flex' : 'none' }">
                    <div class="resultMapViewDialog__map">
                        <button type="button" class="mapDialogCloseButton" @click="mapViewOnHideDialog">
                            <i aria-hidden="true" class="bi bi-x"></i><span class="blind">팝업닫기</span>
                        </button>
                        <div class="resultMapViewDialog__mapFunctionWrap">
                            <div class="resultMapViewDialog__mapFunction">
                                <button title="확대" onclick="javascript:map_zoomContNew('in');">
                                    <i aria-hidden="true" class="bi bi-plus-lg"></i>
                                    <span class="blind">확대</span>
                                </button>
                                <button title="축소" onclick="javascript:map_zoomContNew('out');">
                                    <i aria-hidden="true" class="bi bi-dash-lg"></i>
                                    <span cla ss="blind">축소</span>
                                </button>
                            </div>
                        </div>
                        <div class="miniMap" id="totalSearchMiniMap"><MapEditor ref="comMapEditor" @mapLoaded="fnMapLoaded" lang="ko" :apikey="MAP_APIKEY"/></div>
                    </div>
                    <div class="resultMapViewDialog__content"> 
                        <div class="resultMapViewDialog__function">
                            <button type="button" class="resultMapViewDialog__button guide popupGoMap" title="안내도 보기" @click="fnSearchTotalMap">안내도 보기</button>
                            <button type="button" class="resultMapViewDialog__button road" title="도로구간 보기">도로구간 보기</button>
                            <button type="button" class="resultMapViewDialog__button guide popupGoMapRoad" title="안내도 보기" style="display: none;">안내도 보기</button>
                            <button type="button" class="resultMapViewDialog__button roadName" title="도로명주소 보기">도로명주소</button>
                        </div>
                        <div class="resultMapViewDialog__address road">
                            <div class="resultMapViewDialog__addressTitle">도로명주소</div>
                            <p class="resultMapViewDialog__addressContent" id="info_road_name">{{ miniMapData.schKorRoadNm }}
                            </p>
                            <div class="resultMapViewDialog__addressTitle">지번</div>
                            <p class="resultMapViewDialog__addressContent" id="info_land_lot">{{ miniMapData.schKorJibunNm }}</p>
                            <div class="resultMapViewDialog__addressTitle">우편번호</div>
                            <p class="resultMapViewDialog__addressContent" id="info_zip_code">{{ miniMapData.zipCl }}</p>
                        </div> 
                        <div class="resultMapViewDialog__address roadName">
                            <div class="resultMapViewDialog__addressTitle">도로명</div>
                            <p class="resultMapViewDialog__addressContent" id="roadName_info_road_name">{{ miniMapData.schKorRoadNm }}</p>
                            <div class="resultMapViewDialog__addressTitle">기점/종점</div>
                            <p class="resultMapViewDialog__addressContent" id="roadName_info_srt_end_cn">{{ miniMapData.rdNmStr }}</p>
                            <div class="resultMapViewDialog__addressTitle">부여사유</div>
                            <p class="resultMapViewDialog__addressContent" id="roadName_info_grant_de_value"></p>
                            <div class="resultMapViewDialog__addressTitle">고시일</div>
                            <p class="resultMapViewDialog__addressContent" id="roadName_info_notice_ymd"></p>
                            <div class="resultMapViewDialog__addressTitle">효력발생일</div>
                            <p class="resultMapViewDialog__addressContent" id="roadName_info_effect_ymd"></p>
                            <div class="resultMapViewDialog__addressTitle">길이(m)</div>
                            <p class="resultMapViewDialog__addressContent" id="roadName_info_road_lt_value"></p>
                        </div>
                    </div>
                </div>
                 -->
                
                <!-- 주소변동이력 레이어팝업 -->
                <div class="changeHistory__wrap" :style="{ display: changeHistoryPop === true ? 'flex' : 'none' }">
					<div class="changeHistory">
				    	<button type="button" class="changeHistory__close" id="btn_close_changeHistory" @click="changeHistoryCloseDialog">
				            <i aria-hidden="true" class="bi bi-x"></i><span class="blind">팝업닫기</span>
				        </button>
				        <p class="changeHistory__title history">{{ historyTitle }}</p>
				        <p class="changeHistory__text"><span class="commonBullet">※</span> 2015년 12월 31일이후 변동이력만 조회됩니다.</p>
				        <div class="changeHistory__scroll">
				        	<div class="changeHistory__tableWrap">
				        		<table class="changeHistory__table">
					        		<caption>변동이력 테이블입니다. 변동일자, 주소, 고시여부, 읍면동, 변동구분을 제공합니다.</caption>
					        		<thead>
					        			<tr>
											<th>변동일자</th>
						        			<th>주소</th>
						        			<th>고시여부</th>
						        			<th>변동구분</th>
						        			<th>변동사유</th>
					        			</tr>
					        		</thead>
					        		<tbody>
					        			<tr v-if="historyDataList.length > 0" v-for="(item, index) in historyDataList" :key="index">
					        				<td>{{ item.chgDt }}</td>
					        				<td class="alignLeft">[도로명주소] {{ item.rnAddr }}<br>[지번] {{ item.jibun }}</td>
					        				<td>{{ item.chgResNm == "폐지" ? "-" : (item.ntfcYn == "1" ? "고시" : "미고시" ) }}</td>
					        				<td>{{ item.chgResNm }}</td>
					        				<td>{{ item.chgResNmDtl ? item.chgResNmDtl : "-" }}</td>
					        			</tr>
					        			<tr v-if="historyDataList.length == 0">
					        				<td colspan="6">조회된 데이터가 없습니다.</td>
					        			</tr>
					        		</tbody>
				        		</table>
				        	</div>
				        </div>
				    </div>
                </div>

                <!-- 도로명정보 레이어팝업 -->
                <div class="changeHistory__wrap" :style="{ display: roadInfoPop === true ? 'flex' : 'none' }">
					<div class="changeHistory">
				    	<button type="button" class="changeHistory__close" id="btn_close_addrRoad" @click="closeDialog">
				            <i aria-hidden="true" class="bi bi-x"></i><span class="blind">팝업닫기</span>
				        </button>
				        <p class="changeHistory__title">{{roadDetail.siNm}} {{roadDetail.sggNm}} {{roadDetail.rdNm}}</p>
				        <p class="changeHistory__text"></p>
				        <div class="changeHistory__scroll">
			        		<div class="table__vertical">
			        			<table class="">
			        				<caption>도로명주소 설명표로 기점, 종점, 고시일, 길이(m)에 대한 정보를 제공합니다.</caption>
			        				<colgroup>
			        					<col style="width:25%">
			        					<col style="width:75%">
			        				</colgroup>
			        				<tbody>
			        					<tr>
			        						<th scope="row">기점</th>
			        						<td>{{ roadDetail.srtCn }}</td>
			        					</tr>
			        					<tr>
			        						<th scope="row">종점</th>
			        						<td>{{ roadDetail.endCn }}</td>
			        					</tr>
			        					<tr>
			        						<th scope="row">고시일</th>
			        						<td>{{ roadDetail.noticeYmd }}</td>
			        					</tr>
			        					<tr
			        						><th scope="row">효력발생일</th>
			        						<td>{{ roadDetail.effectDe }}</td>
			        					</tr>
			        					<tr>
			        						<th scope="row">길이(m)</th>
			        						<td>{{ roadDetail.roadLt }}</td>
			        					</tr>
			        					<tr>
			        						<th scope="row">도로명 부여사유</th>
			        						<td>{{ roadDetail.grantDe }}</td>
			        					</tr>
			        				</tbody>
			        			</table>
			        		</div>
			        		<div class="table__footerButton">
			        			<button type="button" @click="fnSearchRoadMap(roadDetail)" class="table__button" title="새창으로 도로구간 보기">새창으로 도로구간 보기</button>
			        		</div>
						</div>
					</div>
                </div>

            </div>
</template> 
<script setup>
import { onMounted, onUnmounted , ref, reactive, onBeforeUnmount, computed ,watch, nextTick, defineExpose } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from 'axios';
import MiniMapPopup from "@/components/map/MiniMapPopup.vue";
import {useLoadingStore} from "@/stores/ui.loading";
import _ from 'lodash';
import { validateJuso, checkValidate1, checkValidate2, keyWordMin, keyWordMax, keyWordIsNumber, keyWordIsMaxNumber, regExpCheckJuso, checkValidate3 } from '@/common/histrySearchValidUtil.js'

const router = useRouter();
const route = useRoute();
const loadingStore = useLoadingStore();
let isSendParams = false;

const props = defineProps({
    call: {
        type: String,
        default: ''
    },
});

const emit = defineEmits(['sendRoadNm', 'mapCall']);

//정렬 리스트
const categoriesRadio = ref();

/*----------------------------------------------------------------------- 통합검색 관련 */

//뒤로가기 상태 여부, 뒤로가기로 검색수행시 true상태로 변경
const bfrSearchMode = ref(false);

//검색수행 모드
const schMode = ref("hstry");

//검색 결과 구분
const searchMode = reactive({
	schResultMode : "SOLR"
	, hemdSearch : ""
	, honorRoadMode : ""
});

//검색 수행 후 키워드 담는 변수
const searchKeyword = ref('');

//검색결과 변수
const searchDataList = ref([]);

//영문으로 입력시 한글변환한 키워드
const engToKorKeyword = ref('');

const engKeywordToggle = ref(false);

//명예도로 검색결과 변수
const honorRoadData = ref({});

//검색결과 국/영문모드
const isKorMode = ref([]);

//검색 수행 파라미터 페이징 변수
const pageSize = ref(5);
const currentPage = ref(0);

//페이지 리스트 담는 변수
const pageList = ref([]);

const searchResultVind = ref(true);

//사물주소 출입구정보 보기용 사물주소코드 배열
const objList = ['T30101','T30201','T30301','T30601','T30302','T30501','T31601','T30202','T30701'];

//우편주소 표기방법 토글
const objActive = ref([]);
const objToggleActive = (index) => {
	objActive.value[index] = !objActive.value[index];
}

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

// 페이징 유지용 변수
const onPagingParams = reactive({});

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

//페이징 버튼 클릭
const onPaging = params => {
	
	// if (!inqCndParams.keyword) {
	// 	if (searchKeyword.value) {
	// 		inqCndParams.keyword = searchKeyword.value;
	// 	} else {
	// 		alert('검색어를 입력해주세요!');
	// 		return false;
	// 	}
	// }
	
	if (params.page < 0 || (params.page == pageInfo.totalPages)) {
		return false;
	}
	
	pageInfo.page = params.page !== undefined ? params.page + 1 : 1;
	pageInfo.size = params.rows ? params.rows : pageInfo.size;
	onPagingParams.pageable.page = pageInfo.page - 1;
	onPagingParams.pageable.size = pageInfo.size;
	axiosCall(true);
	
	detailParamsJuso.forEach((item, index) => {
		item.bddgMgno = '';
		item.bdflMgno = '';
		item.bdhoMgno = '';
	});
	
	const target = document.getElementById('target');
	target.scrollIntoView({behavior:'smooth'});
}

//페이징처리
const pagination = async(data) => {
	
	let totalElements = data.results.totalElements;
	let currentPage = data.results.pageable.pageNumber;
	
	if((currentPage == 0 && pageList.value.length == 0) 
			|| (currentPage != 0 && currentPage % 10 == 0) 
			|| currentPage == 0 || data.results.last == true) {
		pageList.value.length = 0;
		//마지막페이지
		if (data.results.last == true) {
			let tmpcur = currentPage - (currentPage % 10);
			for(let i=currentPage; i>=tmpcur; i--) {
				pageList.value.push(i);
				pageList.value.sort((a, b) => a - b);
			}
		//다음버튼 클릭하였을때 마지막 리스트인 경우
		} else if ((pageInfo.totalPages - data.results.number) < 10){
			for(let i=currentPage; i<=pageInfo.totalPages-1; i++) {
				pageList.value.push(i);
			}
		//보통 페이징 처리
		} else {
			for(let i=currentPage; i<currentPage+10; i++) {
				pageList.value.push(i);
			}
		}
	}
}

const insertString = (key, index, string) => {
	if (index > 0) {
		return key.substring(0,index) + string + key.substring(index,key.length);
	} else {
		return string+key;
	}
}

//검색 유효성 체크
const recentSearchesResultRef = (param) => {

	param.keyword = validateJuso(param.keyword);
	
	//주소 체크
	if (!checkValidate1(param.keyword)) {
		return false;
	} else if (!checkValidate2(param.keyword)) {
		return false;
	} else if (!keyWordMin(param.keyword)) {
		return false;
	} else if (!keyWordMax(param.keyword)) {
		return false;
	} else if (!keyWordIsNumber(param.keyword)) {
		return false;
	} else if (!keyWordIsMaxNumber(param.keyword)) {
		return false;
	}
	
	param.keyword = regExpCheckJuso(param.keyword);
	
	//인천 남구 -> 미추홀구 명칭변경 안내문구
	checkValidate3(param.keyword);
	
	//부모 컴포넌트에서 받아온 파라미터 복제
	Object.assign(inqCndParams , param);
	
	if (inqCndParams.strSearchType === "COORDINATE") {
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

			if (param[0] < 124 || ( 133 <= param[0] && param[0] < 705680) || 1388291 < param[0]) {
				alert("유효하지 않은 경위도 X값 입니다.\n범위 : [경위도] 124이상 ~ 133미만 / [TM] 705,680이상 ~ 1,388,291이하");
				return;
			}
	
			if (param[1] < 33 || ( 44 <= param[1] && param[1] < 1349270) || 2581448 < param[1]) {
				alert("유효하지 않은 경위도 Y값 입니다.\n범위 : [경위도] 33이상 ~ 44미만 / [TM] 1,349,270이상 ~ 2,581,448이하");
				return;
			}
		}
	}
	
	inqCndParams.pageable.page = 0;
	// 페이징을 위해서 검색 파라미터 복제
	Object.assign(onPagingParams, inqCndParams);
	axiosCall();
}

//검색 수행
const axiosCall = async (params) => {

	if (params){
		isSendParams = true;
    	Object.assign(inqCndParams, onPagingParams);
	} else {
		isSendParams = false;
	}

	loadingStore.show();
	const currentPage = ref(0);
	
	honorMode.value = false;
	engKeywordToggle.value = false;
	let url = "/api/solr/solrKeywordSearch";
	schMode.value = "hstry";

	if(inqCndParams.strAotYn === "Y") {
		url = "/api/solr/solrAotSearch";
		schMode.value = "aot";
		
		categoriesRadio.value = ([
			{name: '정확도순', key: "RA", title: "정확도순"},
			{name: '도로명 포함', key: "RB", title: "도로명 포함"}
		]);
	} else {
		categoriesRadio.value = ([
			{name: '정확도순', key: "RA", title: "정확도순"},
			{name: '도로명 포함', key: "RB", title: "도로명 포함"},
			{name: '지번 포함', key: "RC", title: "지번 포함"}
		]);
	}
	
	if(/[a-zA-Z]/.test(inqCndParams.keyword)){
		inqCndParams.keyword = inqCndParams.keyword.toLowerCase();
	};
	
	console.log("inqCndParams", inqCndParams);

	await axios.post(url, inqCndParams)
		.then((response) => {
			console.log("solrSearchResponse -> ", response);
			const data = response.data;
			if (data.results != undefined && data.results.content != undefined && data.results.content.length > 0) {
				const totalElements = data.results.totalElements;
				const pageSize = data.results.size;
				currentPage.value = data.results.pageable.pageNumber;
					searchDataList.value = data.results.content.map((item, index) => {
						const rowNumber = currentPage.value * pageSize + index + 1;
						
						if (inqCndParams.strAotYn != "Y") {
							//키워드와 일치하는 주소 bold처리
							let keywordArr = inqCndParams.keyword.split(" ");
							for (let i=0; i<keywordArr.length; i++) {
								if (i == 0) {
									item.schKorJibunNmBold = item.schKorJibunNm.replaceAll(keywordArr[i], '<strong>'+keywordArr[i]+'</strong>')
								} else {
									item.schKorJibunNmBold = item.schKorJibunNmBold.replaceAll(keywordArr[i], '<strong>'+keywordArr[i]+'</strong>')
								}
							}
						}
						return {
							...item,
							rowNumber: rowNumber
						}
					})
				
				console.log('searchDataList.value ->', searchDataList.value);
					
				if (schMode.value == "aot") {
					searchDataList.value.forEach((item, index) => {
						item.objadresInfo = [JSON.parse(item.objadresInfo)];
						item.bdEngSn = ( item.bdMaSn ? item.bdMaSn : "" ) + (item.bdSbSn ? "-" + item.bdSbSn : "") + " " + item.rdEngNm + ", " + item.sggEngNm + ", " + item.siEngNm;
					})
				}
				
				console.log('searchDataList.value ->', searchDataList.value);
				pageInfo.totalRecords = data.results.totalElements;
				pageInfo.currentRecords = data.results.numberOfElements;
				pageInfo.totalPages = data.results.totalPages;
				
				if(pageInfo.totalPages != 0) {
					pagination(data);
				}
				
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

				const resetParams = {};
				//검색 키워드가 영문일때 한글로 변환 여부
				if (data.results?.content?.length > 0 && data.results.content[0].engYn == "Y") {
					searchKeyword.value = inqCndParams.keyword;
					inqCndParams.keyword = data.results.content[0].originKeyword;
					engToKorKeyword.value = data.results.content[0].originKeyword;
					engKeywordToggle.value = true;
					resetParams.keyword = engToKorKeyword.value;
				} else {
					resetParams.keyword = inqCndParams.keyword;
				}

				// 페이징 검색이거나 정렬 검색인 경우 검색 조건 유지
				if(isSendParams) {
					resetParams.strSearchType  = inqCndParams.strSearchType; //검색구분
					resetParams.strAblYn  = inqCndParams.strAblYn; //폐지여부
					resetParams.strAotYn  = inqCndParams.strAotYn; //사물주소여부
				}
				emit('sendRoadNm', resetParams);
				
				searchMode.schResultMode = data.results.content[0].schMode;
				
				if (inqCndParams.strAotYn !== "Y" && pageInfo.totalRecords > 50) {
					let filterParam = {
						"totalCount" : pageInfo.totalRecords,
						"ablYn" : inqCndParams.ablYn
					}
					solrFilterSearch(filterParam);
				}
				
				if(schMode.value == "hstry" || schMode.value == "aot") {
					searchKeyword.value = data.results.content[0].originKeyword;
				}
				
				searchResultVind.value = true;
	
			} else {
				searchKeyword.value = inqCndParams.keyword;
				searchDataList.value.splice(0);
				pageInfo.totalRecords = 0;
				pageInfo.currentRecords = 0;
				pageInfo.totalPages = 0;
				isLargeDataVisible.value = false;
				searchResultVind.value = false;
				
				chkSearchRoad();
			}
		})
		.catch(error => {
			console.error("error =>", error);
		})
		.finally(() =>{
			//명예도로 검색
			axios.post('/api/solr/solrHonorRoadSearch', inqCndParams)
				.then((response) => {
					const data = response.data;
					if (data.results.length > 0) {
						honorRoadData.value = data.results;
						searchMode.honorRoadMode = true;
		
					} else {
						if (honorRoadData.value) honorRoadData.value = null;
						searchMode.honorRoadMode = false;  
					}
				})
				.catch(error => {
					console.error("error =>", error);
				});
		});

	//검색수행시 검색결과에 따라 매핑된 기존 select박스 값 초기화
	if (itemsCity.value) itemsCity.value.splice(0);
	if (itemsCounty.value) itemsCounty.value.splice(0);
	if (filterRoadNmResult.value) filterRoadNmResult.value.splice(0);
	if (dongItems.value) dongItems.value.splice(0);
	if (floorItems.value) floorItems.value.splice(0);
	if (hoItems.value) hoItems.value.splice(0);
	isKorMode.value.splice(0);
	detailAdressActive.value.splice(0);
	moreActive.value.splice(0);
	objActive.value.splice(0);
	
	detailParamsJuso.forEach(function(val, i) {
		val.bddgMgno = '';
		val.bdflMgno = '';
		val.bdhoMgno = '';
		val.fullJuso = '';
	});
	
	//뒤로가기 버튼으로 들어온 상태가 아닌 경우 키워드 적재
	if(bfrSearchMode.value == false) {
		history.pushState({ popupOpen: true, keyword: inqCndParams.keyword }, '');
	}
	loadingStore.hide();
	return true;
}

const chkSearchRoadResult = ref();

////기초번호 _주소검색시 대로/로/길로 끝나는 단어 분리/////
const chkSearchRoad = () => {
	var splitKeyword = inqCndParams.keyword.split(" ");
	var selArr = [];
	for(var i=0; i<splitKeyword.length; i++) {
		var chk = /로|길|대로$/; 
		if(chk.test(splitKeyword[i])){
		   selArr.push(splitKeyword[i]);
		}
	}
	
	axios.get(`/api/search/road-info/${selArr[selArr.length-1]}`)
		.then((response) => {
			console.log(response);
			chkSearchRoadResult.value = response.data.results;
      // 본번 부번 구분로직
      if(!_.isEmpty(searchKeyword.value) &&  chkSearchRoadResult.value.sidoList?.length) {
        let splitKeyword = searchKeyword.value.split(chkSearchRoadResult.value.rdNm);
        splitKeyword = (splitKeyword.length === 0 ? splitKeyword[0] : splitKeyword[1]).replace(/(^\s*)|(\s*$)/g, "");
        splitKeyword = splitKeyword.replace(/ +/g," ");
        splitKeyword = splitKeyword.split(/ /);

        if(searchKeyword.value.indexOf('-') > -1) {
          let splitKeyword2 = splitKeyword[0];
          if(!_.isEmpty(splitKeyword[1])){
            splitKeyword2 = splitKeyword2 + splitKeyword[1];
            if(!_.isEmpty(splitKeyword[2])){
              splitKeyword2 = splitKeyword2 + splitKeyword[2];
            }
          }
          splitKeyword = splitKeyword2;
          let searchKeywordSplit = splitKeyword.split("-");
          if(checkBdMaSnBdSlno(searchKeywordSplit[0])){
            chkSearchRoadResult.value.bdMaSn = searchKeywordSplit[0];
            if(checkBdMaSnBdSlno(searchKeywordSplit[1])){
              chkSearchRoadResult.value.bdSlno = searchKeywordSplit[1];
            }
          }
        } else {
          if(checkBdMaSnBdSlno(splitKeyword[0])){
            chkSearchRoadResult.value.bdMaSn = splitKeyword[0];
          }
        }
        console.log(chkSearchRoadResult.value);
      }
		})
		.catch(error => {
			console.error("error =>", error);
		});
}

//기초번호 본번, 부번 유효성 체크
const checkBdMaSnBdSlno = (data) => {
  const str = data.replace(/ /g, '');
  if(!_.isEmpty(str) && str !== "0" && !isNaN(str) && str.replace(/[^0-9]/g, "").length < 6){
    return true;
  }else{
    return false;
  }
}

//검색결과 국/영문모드
const toggleView = (index) => {
	isKorMode.value[index] = !isKorMode.value[index];
}

/*----------------------------------------------------------------------- 상세주소 관련 */

//상세주소
const dongItems = ref([]);  	//동
const floorItems = ref([]);  	//층
const hoItems = ref([]);  		//호

//상세주소 결과 토글
const detailAdressActive = ref([]);

//상세주소 검색 파라미터
const detailParams = reactive({});

//상세주소 화면 매핑 변수
const detailParamsJuso = reactive(
	Array.from({ length: 5}, () => ({bddgMgno: '', bdflMgno: '', bdhoMgno: '', fullJuso: '', dongInFloorValid: true}))
);

//상세주소 조회 - 동조회
const selectDongList = (index, item) => {
	detailParams.schMode = "D";
	detailParams.sigCd = item.emdCd;
	detailParams.roadNmCd = item.rdMgtSn.substring(5);
	detailParams.bnmn = item.bdMaSn;
	detailParams.bnsn = item.bdSbSn;
	detailParams.udgdSeCd = item.udrtYn;
	
	axios.post('/api/search/selectJusoDetail', detailParams)
		.then((response) => {
			const data = response.data.results;
			if (data.length > 0) {
				dongItems.value[index] = data.map((item) => ({
						value: item.BDDG_MGNO,
						label: item.BDDG_NM == "0" ? '"동" 표기 없음' : item.BDDG_NM + "동",
				}));
			}
		})
		.catch(error => {
			console.error("error =>", error);
		})
		.finally(() => {
			loadingStore.hide();
		})
}

//상세주소 조회 - 층조회
const changeFloor = (index) => {
	
	if(!detailParamsJuso[index].bddgMgno) {
		floorItems.value.splice(0);
		hoItems.value.splice(0);
		detailParamsJuso[index].bdflMgno = '';
		detailParamsJuso[index].bdhoMgno = '';
		return;
	}
	
	detailParams.schMode = "F";
	detailParams.bddgMgno = detailParamsJuso[index].bddgMgno;
	
	axios.post('/api/search/selectJusoDetail', detailParams)
		.then((response) => {
			const data = response.data.results;
			if (data.length > 0) {
	    		floorItems.value[index] = data.map((item) => ({
					value: item.BDFL_MGNO,
					label: item.UDGD_SE_CD == "0" ? item.BDFL_NM + "층" : "지하 " + item.BDFL_NM + "층",
					udgdSeCd: item.UDGD_SE_CD,
				}))
			}
		})
	    .catch(error => {
			console.error("error =>", error);
	    });
	
	detailParamsJuso[index].bdflMgno = '';
	detailParamsJuso[index].bdhoMgno = '';
}

//상세주소 조회 - 호조회
const changeHo = (index) => {
	
	if(!detailParamsJuso[index].bdflMgno) {
		hoItems.value.splice(0);
		detailParamsJuso[index].bdhoMgno = '';
		return;
	}
	
	detailParams.schMode = "H";
	detailParams.bddgMgno = detailParamsJuso[index].bddgMgno;
	detailParams.bdflMgno = detailParamsJuso[index].bdflMgno;
	
	axios.post('/api/search/selectJusoDetail', detailParams)
		.then((response) => {
			const data = response.data.results;
			if (data.length > 0) {
				hoItems.value[index] = response.data.results.map((item) => ({
					value: item.BDHO_NM + "호",
					label: item.BDHO_NM ? item.BDHO_NM + "호" : '"호" 표기없음',
				}))
			}
		})
		.catch(error => {
			console.error("error =>", error);
		});
	
	detailParamsJuso[index].bdhoMgno = '';
}

//상세주소 최종 주소 만들기
const detailJuso = (juso, idx) => {
	let index = juso.indexOf('(');
	let sliceJuso1 = juso.substring(0, index-1);
	let sliceJuso2 = juso.substring(index);
	
	let dong = '';
	let floor = '';

	//동이 있는 경우 표기
	dongItems.value[idx].forEach(function(val, i) {
		if(val.value == detailParamsJuso[idx].bddgMgno) {
			dong = val.label;
		}
	});
	
	detailParamsJuso[idx].fullJuso = sliceJuso1 + ", " + (dong == '"동" 표기 없음' ? "" : dong) + " " ;

	floorItems.value[idx].forEach(function(val, i) {
		if(val.value == detailParamsJuso[idx].bdflMgno) {
			//지하층 표기
			if(val.udgdSeCd == "1") {
				detailParamsJuso[idx].fullJuso += val.label + " ";
				detailParamsJuso[idx].dongInFloorValid = false;
				return;
			}
	
			//호 정보에 층정보가 없거나, '호'를 포함한 호가 3자리 이하인 경우 층 표기
			let floorTmp = val.label.substring(0, val.label.length-1);
			if (detailParamsJuso[idx].bdhoMgno?.length <= 3 || !detailParamsJuso[idx].bdhoMgno?.startsWith(floorTmp)) {
				detailParamsJuso[idx].fullJuso += val.label + " ";
				detailParamsJuso[idx].dongInFloorValid = false;
			} else {
				detailParamsJuso[idx].dongInFloorValid = true;
			}
		}
	});
	console.log(sliceJuso2);
	
	if (detailParamsJuso[idx].bdhoMgno == "undefined호") {
		detailParamsJuso[idx].fullJuso += " " + sliceJuso2;
	} else {
		detailParamsJuso[idx].fullJuso += detailParamsJuso[idx].bdhoMgno + " " + sliceJuso2;
	}
}

const detailAdressToggleActive = (index, item) => {
	detailAdressActive.value[index] = !detailAdressActive.value[index];
	if (detailAdressActive.value[index] == true) {
		loadingStore.show(); 
		selectDongList(index, item);
	}
}

const detailAdressButtonIcon = (index) => {
	return detailAdressActive.value[index] ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
}

/*----------------------------------------------------------------------- 변동이력 관련 */

//변동이력 팝업 헤더
const historyTitle = ref(null);

//변동이력 검색결과
const historyDataList = ref([]);

//변동이력 검색
const changeHistoryPop = ref(false);

//변동이력 팝업 오픈
const changeHistoryOnShowDialog = (item) => {
	loadingStore.show();
	axios.get('/api/search/history-list/' + item.adrMngNo)
		.then((response) => {
			if (response.data.results.length > 0) {
				const data = response.data.results;
				historyDataList.value = data;
			}
		})
		.catch(error => {
			console.error("error =>", error);
		})
		.finally(() => {
			loadingStore.hide();
			historyTitle.value = item.schKorRoadNm.substring(0, item.schKorRoadNm.indexOf(" ("));
			changeHistoryPop.value = true;
		});
}

//변동이력 팝업 종료
const changeHistoryCloseDialog = () => {
	historyDataList.value.splice(0);
	changeHistoryPop.value = false;
}

/*----------------------------------------------------------------------- 도로명 필터 관련 */

//지역선택 드롭다운 변수
const itemsCity = ref([]);
const itemsCounty = ref([]);
const filterRoadNmResult = ref(null);

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

const solrFilterSearch = async (filterParam) => {
	await axios.post('/api/solr/solrFilterSearch', filterParam)
		.then((response) => {
			const data = response.data.results.solrFilterSearchSidoResponseDto;
			filterRoadNmResult.value = response.data.results.solrFilterSearchRoadNmResponseDto;

			data.forEach(function(val, i) {
				if (i != 0 && itemsCity.value.find(item => item.label == val.sidoNm)) {
					return;
				}
				itemsCity.value.push({ label: val.sidoNm, value: val.sidoCd });
			})
			filterParams.ctpvCd = '';
			filterParams.roadNm = '';
		})
		.catch(error => {
			console.error("error =>", error);
		});
}

//시도에 맞는 도로명만 조회
watch(() => filterParams.ctpvCd, (newVal) => {
	if (itemsCounty.value) {
		itemsCounty.value.splice(0);
	}
	
	filterRoadNmResult.value.forEach(function(val, i) {
		if (newVal == val.sidoCd) {
			itemsCounty.value.push({ label: val.roadName, value: val.roadName });
		}
	})
})

//도로명 필터검색
const filterSearch = () => {
	if (!filterParams.roadNm) {
		alert("도로명을 선택해주세요.");
		return false;
	} else {
		inqCndParams.keyword = filterParams.roadNm;
		inqCndParams.pageable.page = 0;
		bfrSearchMode.value = false;
		
		// 페이징을 위해서 검색 파라미터 복제
		Object.assign(onPagingParams, inqCndParams);
		axiosCall();
		emit('sendRoadNm', { keyword : inqCndParams.keyword });
	}
	filterParams.ctpvCd = null;
}

/*----------------------------------------------------------------------- 정렬 관련 */

//정렬기준을 정확도순 체크상태로 초기화
const selectedCategoriesRadio = ref('정확도순');

const isArrowKey = ref(false);

//방향키로 함수 실행 방지
const handleKeydown = (e) => {
	if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
		isArrowKey.value = true;
		
		setTimeout(() => {
			isArrowKey.value = false;
		}, 100);
	}
}

//정렬기능
const sortChange = (newValue) => {
	if (!isArrowKey.value) {
		if(!inqCndParams.keyword) {
			alert("검색어가 입력되지 않았습니다.");
			return false;
		}
		console.log("selectedCategoriesRadio.value", selectedCategoriesRadio.value);
		if (selectedCategoriesRadio.value === "도로명 포함") {
			inqCndParams.strFirstSort = "road";
		} else if(selectedCategoriesRadio.value === "지번 포함") {
			inqCndParams.strFirstSort = "location";
		} else {
			inqCndParams.strFirstSort = "none";
		}
		console.log("inqCndParams.strFirstSort", inqCndParams.strFirstSort);
		axiosCall();
	}
}

/*----------------------------------------------------------------------- 도로명정보 팝업 관련 */

//도로명 정보 조회결과
const roadDetailInfo = {
	siNm : ''
	,sggNm : '' 
	,rdNm : '' 
	,srtCn : '' 
	,endCn : '' 
	,noticeYmd : '' 
	,effectDe : '' 
	,roadLt : '' 
	,grantDe : '' 
};

//도로명 정보 조회결과
const roadDetail = reactive({});

//도로명 정보 팝업 활성화
const roadInfoPop = ref(false);

//도로명 정보 팝업 조회
const fnRoadInfo = async (rdMgtSn) => {
	await axios.get('/api/ahs/selectRoadLocation/' + rdMgtSn)
		.then((response) => {
			if (response.data.results.list.length > 0) {
				Object.assign(roadDetail, response.data.results.list[0]);
				roadDetail.noticeYmd = formatData(roadDetail.noticeYmd);
				roadDetail.effectDe = formatData(roadDetail.effectDe);
				roadDetail.roadLt = roadDetail.roadLt.toLocaleString();
				roadInfoPop.value = true;
			} else {
				alert("조회된 데이터가 없습니다.");
				return false;
			}
		})
		.catch(error => {
			console.error("error =>", error);
		})
}

//도로명정보 팝업 종료
const closeDialog = () => {
	Object.assign(roadDetail, roadDetailInfo);
	roadInfoPop.value = false;
}

//팝업 고시일, 효력발생일 포맷
const formatData = (dateStr) => {
	if (dateStr && dateStr.length === 8) {
		return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`;
	}
	return dateStr;
}

//도로구간보기(새창)
const fnSearchRoadMap = (item) => {
	//도로구간 데이터 (도로명코드, 도로명, 시군구코드)
	const roadNmCd = item.rnMgtSn.substring(5);
	const roadNm = item.rdNm;
	const lgvCd = item.rnMgtSn.substring(0, 5);
	let url = '/map/totalMapView?';
	url += `searchType=roadNm&rdCd=${roadNmCd}&rdNm=${roadNm}&sigCd=${lgvCd}`;
	const width = window.innerWidth;
	const height = window.innerHeight;
	window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
}

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

/*----------------------------------------------------------------------- 미니맵 */

//검색결과 미니맵 변수
const miniMapPop = ref(null);

const miniMapToggle = ref(false);

//미니맵 오픈
const mapViewOnShowDialog = (item) => {
	miniMapToggle.value = true;
	miniMapPop.value.show(item);
}

/*----------------------------------------------------------------------- 기타 */
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

const honorMode = ref(false);
const honorLoadMore = () => {
	honorMode.value = !honorMode.value;
}

//명예도로 메뉴 이동
const honorRoadView = (data) => {
	router.push({ 
		path: '/ahu/ahuHonorRoadList',  
		query: { khnrdNm: data.hrNm } 
	});
}

//자식 -> 부모 전달 함수
defineExpose({
	recentSearchesResultRef,
})

//뒤로가기 이벤트 감지
function historyHandler(event){
	if (miniMapToggle.value == true) {
		miniMapPop.value.hide();
		miniMapToggle.value = false;
		return;
	}

	bfrSearchMode.value = true;

	if (event.state && event.state.popupOpen) {
		if (event.state.keyword != undefined) {
			inqCndParams.keyword = event.state.keyword;
    		axiosCall().finally(() => {
				emit('sendRoadNm', { keyword : inqCndParams.keyword });
    		});
		} else {
    		history.replaceState({popupOpen:false}, null);
    		location.reload(true);
        	return false;
		}
    } else {
        // 상태가 없을 경우 레이어 팝업을 닫습니다.
    	history.back();
    }	
}

onMounted(() => {
	// 페이징 복제용
	Object.assign(onPagingParams, inqCndParams);

	history.pushState({ popupOpen: true }, '');
	window.addEventListener('popstate', historyHandler);
	
	window.addEventListener('keydown', function(event) {
		if (miniMapToggle.value == true) {
			if(event.key === 'Esc' || event.key === 'Escape') {
				miniMapPop.value.hide();
				miniMapToggle.value = false;
				return;
			}
		}
	});
});

onBeforeUnmount(() => {
    window.removeEventListener('popstate', historyHandler);
});

/*----------------------------------------------------------------------- 영문 -> 한글 변환 */
 
var engStr = "rRseEfaqQtTdwWczxvgkoiOjpuPhynbml";//영문
var korStr = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ";//한글
var choArr = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";     //초성
var jungArr = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";  //중성
var jongArr = "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"; //종성

//한글조합하기
const korCombination = (src) => {
	if (src == null) {
		return '';
	}
	var result = {
		useKorlen : src.length
	}
	switch (src.length) {
	case 0:
		result.combiKor = src;
		break;
	case 1: // case 1,2
	    result.combiKor = convertEngKor(src);
		break;
	case 2: // case 3,4,5
		var ch1 = src.charAt(0), ch2 = src.charAt(1);
		// 3. 자음 + 자음 : ㄺ
		if (isConsonant(ch1) && isConsonant(ch2)) {
			var combiConsonant = ConsonantCombination(convertEngKor(ch1), convertEngKor(ch2));
			if (combiConsonant) {
				result.combiKor = combiConsonant;
			} else {
				result = korCombination(src.substring(1, 2));
			}
		}
		// 4. 자음 + 모음 : 가
		else if (isConsonant(ch1) && isVowel(ch2)) {
			result.combiKor = combineKor(convertEngKor(ch1), convertEngKor(ch2));
		}
		// 5. 모음 + 모음 : ㅚ
		else if (isVowel(ch1) && isVowel(ch2)) {
			var combiArr = vowelCombination(convertEngKor(ch1), convertEngKor(ch2));
			if (combiArr) {
				result.combiKor = combiArr;
			} else {
				result = korCombination(src.substring(1, 2));
			}
		} else {
			result = korCombination(src.substring(1, 2));
		}
    	break;
	case 3:// case 6, 7
		var ch1 = src.charAt(0), ch2 = src.charAt(1), ch3 = src.charAt(2);
		// 6. 자음 + 모음 + 자음 : 간
		if (isConsonant(ch1) && isVowel(ch2) && isConsonant(ch3)) {
			result.combiKor = combineKor(convertEngKor(ch1), convertEngKor(ch2), convertEngKor(ch3));
		}
		// 7. 자음 + 모음 + 모음 : 과
		else if (isConsonant(ch1) && isVowel(ch2) && isVowel(ch3)) {
			var combiArr = vowelCombination(convertEngKor(ch2), convertEngKor(ch3));
			if (combiArr) {
				result.combiKor = combineKor(convertEngKor(ch1), combiArr);
			} else {
				result = korCombination(src.substring(1, 3));
			}
		} else {
			result = korCombination(src.substring(1, 3));
		}
		break;
	case 4:// 
		var ch1 = src.charAt(0), ch2 = src.charAt(1), ch3 = src.charAt(2), ch4 = src.charAt(3);
		// 8. 자음 + 모음 + 자음 + 자음 : 닭
		if (isConsonant(ch1) && isVowel(ch2) && isConsonant(ch3) && isConsonant(ch4)) {
			var combiConsonant = ConsonantCombination(convertEngKor(ch3), convertEngKor(ch4));
			if (combiConsonant) {
				result.combiKor = combineKor(convertEngKor(ch1), convertEngKor(ch2), combiConsonant);
			} else {
				result = korCombination(src.substring(1, 4));
			}
		}
		// 9. 자음 + 모음 + 모음 + 자음 : 관
		else if (isConsonant(ch1) && isVowel(ch2) && isVowel(ch3) && isConsonant(ch4)) {
			var combiArr = vowelCombination(convertEngKor(ch2), convertEngKor(ch3));
			if (combiArr) {
				result.combiKor = combineKor(convertEngKor(ch1), combiArr, convertEngKor(ch4));
			} else {
				result = korCombination(src.substring(1, 4));
			}
		} else {
			result = korCombination(src.substring(1, 4));
		}
		break;
	case 5:
		var ch1 = src.charAt(0), ch2 = src.charAt(1), ch3 = src.charAt(2), ch4 = src.charAt(3), ch5 = src.charAt(4);
		// 자음 + 모음 + 모음 + 자음 + 자음 : 괅
		if (isConsonant(ch1) && isVowel(ch2) && isVowel(ch3) && isConsonant(ch4) && isConsonant(ch5)) {
			var combiArr = vowelCombination(convertEngKor(ch2), convertEngKor(ch3));
			var combiConsonant = ConsonantCombination(convertEngKor(ch4), convertEngKor(ch5));
			if (combiArr && combiConsonant) {
				result.combiKor = combineKor(convertEngKor(ch1), combiArr, combiConsonant);
			} else {
				result = korCombination(src.substring(1, 5));
			}
		} else {
			result = korCombination(src.substring(1, 5));
		}
		break;
	}
	return result;
}

const korToEng = (src) => {
	var res = "";
	if (src.length == 0) {
		return res;
	}

	for (var i = 0; i < src.length; i++) {
		var ch = src.charAt(i);
		var nCode = ch.charCodeAt(0);
		var result = '';
		var cho, jung, jong;
		if (44032 <= nCode && nCode <= 55203) {
			nCode -= 44032;
			cho = choArr.charAt(Math.floor(nCode / (21 * 28)));
			jung = jungArr.charAt(Math.floor(nCode / 28) % 21);
			jong = jongArr.charAt(nCode % 28 - 1);
			res += convertKorEng(cho);
			var vowelDecombi = voewlDecombination(jung);
			if (vowelDecombi) {
				res += convertKorEng(vowelDecombi);
			} else {
				res += convertKorEng(jung);
			}
			var consonDecombi = consonDecombination(jong);
			if (consonDecombi) {
				res += convertKorEng(consonDecombi);
			} else {
				res += convertKorEng(jong);
			}
		} else if (choArr.indexOf(ch) > -1) {
			res += convertKorEng(ch);
		} else if (jungArr.indexOf(ch) > -1) {
			var vowelDecombi = voewlDecombination(ch);
			if (vowelDecombi) {
				res += convertKorEng(vowelDecombi);
			} else {
				res += convertKorEng(ch);
			}
		} else if (jongArr.indexOf(ch) > -1) {
			var consonDecombi = consonDecombination(ch);
			if (consonDecombi) {
				res += convertKorEng(consonDecombi);
			} else {
				res += convertKorEng(ch);
			}
		} else {
			res += ch;
		}
	}
	return res;
}

const convertEngKor = (src) => {
	var result = '';
	for (var i = 0; i < src.length; i++) {
		var ch = src.charAt(i);
		var index = engStr.indexOf(ch);
		if (index >= 0) {
			result += korStr.charAt(index);
		} else {
			result += ch;
		}
	}
	return result;
}

const convertKorEng = (src) => {
	var result = '';
	for (var i = 0; i < src.length; i++) {
	    var ch = src.charAt(i);
	    var index = korStr.indexOf(ch);
		if (index >= 0) {
			result += engStr.charAt(index);
	    } else {
			result += ch;
		}
	}
	return result;
}

const isEngStr = (ch) => {
	return engStr.indexOf(ch) >= 0;
}

const isVowel = (ch) => {
	return engStr.indexOf(ch) >= 19;
}

const isConsonant = (ch) => {
	return engStr.indexOf(ch) < 19 && engStr.indexOf(ch) >= 0;
}

const engToKor = (src) => {
	var res = "";
	if (src.length == 0) {
		return res;
	}
	var choPosition = -1, jungPosition = -1, jongPosition = -1; // 초성, 중성, 종성
	for (var i = 0; i < src.length; i++) {
		var result = korCombination(src.slice(Math.max(src.length - 5 - i, 0), src.length - i));
		i += result.useKorlen - 1;
		res = result.combiKor + res;
	}
	return res;
}

const combineKor = (cho, jung, jong) => {
	return String.fromCharCode(44032 + choArr.indexOf(cho) * 21 * 28 + jungArr.indexOf(jung) * 28 + jongArr.indexOf(jong) + 1);
}

const vowelCombination = (ch1, ch2) => {
	var result = null;
	if (ch1 == 'ㅗ' && ch2 == 'ㅏ') { // ㅘ
		result = 'ㅘ';
	} else if (ch1 == 'ㅗ' && ch2 == 'ㅐ') { // ㅙ
		result = 'ㅙ';
	} else if (ch1 == 'ㅗ' && ch2 == 'ㅣ') { // ㅚ
		result = 'ㅚ';
	} else if (ch1 == 'ㅜ' && ch2 == 'ㅓ') { // ㅝ
		result = 'ㅝ';
	} else if (ch1 == 'ㅜ' && ch2 == 'ㅔ') { // ㅞ
		result = 'ㅞ';
	} else if (ch1 == 'ㅜ' && ch2 == 'ㅣ') { // ㅟ
		result = 'ㅟ';
	} else if (ch1 == 'ㅡ' && ch2 == 'ㅣ') { // ㅢ
		result = 'ㅢ';
	}
	return result;
}

const voewlDecombination = (ch) => {
	switch (ch) {
	case 'ㅘ':
		return 'ㅗㅏ';
	case 'ㅙ':
		return 'ㅗㅐ';
	case 'ㅚ':
		return 'ㅗㅣ';
	case 'ㅝ':
		return 'ㅜㅓ';
	case 'ㅞ':
		return 'ㅜㅔ';
	case 'ㅟ':
		return 'ㅜㅣ';
	case 'ㅢ':
		return 'ㅡㅣ';
	}
	return null;
}

const ConsonantCombination = (ch1, ch2) => {
	var result = null;
	if (ch1 == 'ㄱ' && ch2 == 'ㅅ') { // ㄳ
		result = 'ㄳ';
	} else if (ch1 == 'ㄴ' && ch2 == 'ㅈ') { // ㄵ
		result = 'ㄵ';
	} else if (ch1 == 'ㄴ' && ch2 == 'ㅎ') { // ㄶ
		result = 'ㄶ';
	} else if (ch1 == 'ㄹ' && ch2 == 'ㄱ') { // ㄺ
		result = 'ㄺ';
	} else if (ch1 == 'ㄹ' && ch2 == 'ㅁ') { // ㄻ
		result = 'ㄻ';
	} else if (ch1 == 'ㄹ' && ch2 == 'ㅂ') { // ㄼ
		result = 'ㄼ';
	} else if (ch1 == 'ㄹ' && ch2 == 'ㅅ') { // ㄽ
		result = 'ㄽ';
	} else if (ch1 == 'ㄹ' && ch2 == 'ㅌ') { // ㄾ
		result = 'ㄾ';
	} else if (ch1 == 'ㄹ' && ch2 == 'ㅍ') { // ㄿ
		result = 'ㄿ';
	} else if (ch1 == 'ㄹ' && ch2 == 'ㅎ') { // ㅀ
		result = 'ㅀ';
	} else if (ch1 == 'ㅂ' && ch2 == 'ㅅ') { // ㅄ
		result = 'ㅄ';
	}
	return result;
}

const consonDecombination = (ch) => {
	switch (ch) {
	case 'ㄳ':
		return 'ㄱㅅ';
	case 'ㄵ':
		return 'ㄴㅈ';
	case 'ㄶ':
		return 'ㄴㅎ';
	case 'ㄺ':
		return 'ㄹㄱ';
	case 'ㄻ':
		return 'ㄹㅁ';
	case 'ㄼ':
		return 'ㄹㅂ';
	case 'ㄽ':
		return 'ㄹㅅ';
	case 'ㄾ':
		return 'ㄹㅌ';
	case 'ㄿ':
		return 'ㄹㅍ';
	case 'ㅀ':
		return 'ㄹㅎ';
	case 'ㅄ':
		return 'ㅂㅅ';
	}
	return null;
}
</script>



<style lang="scss" scoped>
@use '/node_modules/bootstrap-icons/font/bootstrap-icons.min.css';
.resultLayerPopup__resultText .text {color: #fff;}
.resultLayerPopup__innerWrap {width: 100%;max-width: 1294px;margin: 43px auto 0;padding-bottom:36px;}
.resultLayerPopup__resultText + .resultLayerPopup__detailSearchBox {margin-top:40px;}
.honorLoad__wrap + .resultLayerPopup__detailSearchBox {margin-top:20px;}
.resultLayerPopup__administration {margin-top:26px;color:#98a2be;font-size:17px;line-height: 1.65;text-align: center;}
.resultLayerPopup__administration + .resultLayerPopup__innerWrap {margin-top:29px;}
.resultLayerPopup__detailSearchBox {display: flex;justify-content: center;align-items: center;padding: 14px 0;border-radius: 20px;background: #0a1944;}
.resultLayerPopup__detailSearchBoxInner {display: flex;align-items: center;gap: 10px;min-width: 720px;}
.resultLayerPopup__form {border-color: #384e8b !important;background: #102355;}
.resultLayerPopup__form .p-dropdown-label {color: #fff !important;font-weight: normal;font-size: 15px;}
.resultLayerPopup__form.selectStype01 {width: 30%;max-width: 230px;}
.resultLayerPopup__form.selectStype02 {width: 60%;max-width: 440px;}
.resultLayerPopup__detailSearchButton {display: flex;justify-content: center;align-items: center;gap: 10px;width: 100px;height: 38px;border-radius: 10px;background-image: linear-gradient(to top, #2b6ae5, #5a5de8);color:#fff;font-size:16px;}
.resultLayerPopup__detailSearchButton i {width: auto;height: auto;color: #fff;font-size: 18px;}
.resultLayerPopup__detailSearchBoxTip {margin-left:30px;color: #98a2be;font-size: 14px;}
.resultLayerPopup__detailSearchBoxTip .bi {margin-right: 7px;}
.resultLayerPopup__filter {display: flex;align-items: center;margin-top: 18px;gap: 9px;}
.resultLayerPopup__radio {display: flex;align-items: center;gap: 5px;}
.resultLayerPopup__radio label {min-width: 56px;color: #b4bbd2;font-size: 14px;}
.resultLayerPopup__radio:nth-child(2) label {min-width: 70px;}
.resultLayerPopup__radio .p-radiobutton .p-radiobutton-box {border-color: #4e64a1;background: #0b1e50;}
.resultLayerPopup__filterTip {color: #98a2be;font-size: 14px;}
.resultLayerPopup__filterTip .bi {margin-right: 7px;}
.resultLayerPopup__scrollWrap {overflow-y: auto;max-height: 1600px;margin: 25px 0 0 0;}
.resultLayerPopup__scroll .p-scrollpanel-content {padding: 0 0 18px 0;}
.resultLayerPopup__list > li {position: relative;overflow: hidden;margin-top: 18px;border-radius: 20px;background: #fff;}
.resultLayerPopup__list > li:first-child {margin-top: 0;}
.resultLayerPopup__listDetail {position: relative;display: flex;align-items: flex-start;flex-wrap: wrap;width: 100%;gap:1px;/* max-width: 910px; */}
.resultLayerPopup__listDetail.more {display: none;background: #eff2fb;max-width: 100%;padding: 10px 0 10px 60px;}
.resultLayerPopup__listDetail.more .resultLayerPopup__listDetailTitle {background: #dee3f0;}
.resultLayerPopup__listDetail.more.moreActive {display: flex;height: auto;}
.resultLayerPopup__listDetail.basic {margin-left: 10px;}
.resultLayerPopup__listDetailTitle {display: flex;justify-content: center;align-items: center;width: 90px;height: 36px;margin-right: 13px;border-radius: 10px;background: #f0f0f0;color: #000;font-size: 14px;}
.resultLayerPopup__listDetailContent {display: flex;flex-direction: column;width: calc(100% - 170px);min-height: 40px;color: #111;font-size: 13px;}
.resultLayerPopup__listDetailContent.moContent {display: none;}
.resultLayerPopup__listDetailContent.pcContent {display: flex;}
.resultLayerPopup__listDetailContentGap {margin-top: 1px;}
.resultLayerPopup__innerBox {display: flex;align-items: center;min-height: 36px;color: #111;font-size: 17px;}
.resultLayerPopup__innerBox strong {font-size:19px;}
.resultLayerPopup__innerBox .detailAddr_btnWrap .commonButton__resultButton{margin-left: 10px;}
.resultLayerPopup__innerBox .detailAddr_btnWrap .commonButton__resultButton.long{min-width: 40px;}
.resultLayerPopup__copy {display: inline-block;margin-left: 9px;}
.resultLayerPopup__relatedAddress {margin-right: -245px;color: #555;font-size: 16px;}
.resultLayerPopup__relatedAddressTitle {display: inline-flex;align-items: center;justify-content: center;width: 90px;height: 30px;margin-right: 10px;border: 1px solid #ddd;border-radius: 20px;color: #555;font-size: 15px;vertical-align: -1px;}
.resultLayerPopup__detailAdressFunction {margin-top: 14px;}
.resultLayerPopup__functionPostalCodeWrap {display: flex;flex-direction: column;margin-right: 19px;min-width: 57px;justify-content: center;align-items: center;zoom:0.9;}
.resultLayerPopup__functionPostalCodeText {color: #555;font-size: 14px;}
.resultLayerPopup__functionPostalCodeNumber {margin-top: 5px;color: #111;font-size: 24px;font-weight: 500;letter-spacing:0;}
.resultLayerPopup__detailAdressButton {display: flex;align-items: center;height: 34px;padding: 0 14px;background: #e5eaf9;color: #11328e;font-size: 13px;gap: 12px;line-height: 34px;}
.resultLayerPopup__detailAdressButton i {width: auto;height: auto;color: #11328e;font-size: 13px;}
.resultLayerPopup__detailAdressButton.active i {transform: rotate(180deg);}
.resultLayerPopup__apt {position: relative;display: inline-flex;justify-content: center;align-items: center;width: 66px;height: 26px;margin: 20px 10px 0 0;border-radius: 13px;background: #ebf0fd;color: #3e67e7;font-size: 14px;font-weight: 500;zoom:0.9;}
.resultLayerPopup__apt.pcContent {display: inline-flex;}
.resultLayerPopup__apt::after {position: absolute;top: -24px;left: 21px;display: block;content: "";width: 24px;height: 24px;background: url("@images/common/ic-apart.png") no-repeat 50%/24px;}
.resultLayerPopup__detailAdress {display: none;max-width: 955px;margin: 12px 0 10px 158px;padding: 20px 20px 23px;border-radius: 10px;background: #f8f8f8;}
.resultLayerPopup__detailAdress.detailAdressActive {display: block;}
.resultLayerPopup__eastWestFloor {display: flex;width: 100%;gap: 10px;margin-bottom: 7px;}
.resultLayerPopup__eastWestFloor li {width: 33.3%;}
.resultLayerPopup__eastWestFloorSelect {width: 100%;height: 40px !important;}
.resultLayerPopup__eastWestFloorSelect .p-dropdown-label {padding: 0 20px 0 10px !important;line-height: 40px !important;font-size: 14px !important;font-weight: bold !important;}
.resultLayerPopup__eastWestFloorTip {margin-top: 5px;color: #666;font-size: 15px;}
.resultLayerPopup__tip {margin-top: 5px;padding-bottom:5px;}
.resultLayerPopup__tip li {color: #555;font-size: 14px;line-height: 1.75;}
.resultLayerPopup__communityCenter li {margin-top: 6px;color: #111;font-size: 16px;}
.resultLayerPopup__phone {display: inline-block;position: relative;padding-left: 26px;color: #555;font-size:15px;}
.resultLayerPopup__phone i {color: #777;font-size: 13px;}
.resultLayerPopup__phone::after {position: absolute;left: 13px;top: 3px;content: " ";display: block;width: 1px;height: 15px;background: #d5d5d5;}
.resultLayerPopup__detailBox {position: relative;display: flex;align-items: flex-start;justify-content: space-between;padding: 8px;min-height: 129px;}
.resultLayerPopup__detailBoxNumber {display: flex;align-items: center;justify-content: center;min-width: 36px;height: 36px;border-radius: 12px;border: 1px solid #f0f0f0;background: #fff;font-size: 18px;font-weight: bold;}
.resultLayerPopup__function {display: flex;align-items: center;justify-content: flex-end;gap: 10px;}
.resultLayerPopup__functionButton {display: flex;justify-content: center;width: 80px;height: 80px;padding-top: 52px;border-radius: 10px;border: 1px solid #f2f2f2;background-color: #f2f2f2;color: #333;font-size: 14px;zoom:0.9;}
.resultLayerPopup__functionButton.en {background-image: url("@images/common/ic-translate.png");background-repeat: no-repeat;background-position: 50% 14px;background-size: 35px 31px;}
.resultLayerPopup__functionButton.kr {background-image: url("@images/common/ic-translate-2.png");background-repeat: no-repeat;background-position: 50% 14px;background-size: 35px 31px;}
.resultLayerPopup__functionButton.load {background-image: url("@images/common/ic-newmenu-03-2.png");background-repeat: no-repeat;background-position: 50% 16px;background-size: 30px 28px;}
.resultLayerPopup__functionButton.map {background-image: url("@images/common/ic-newmenu-02-1.png");background-repeat: no-repeat;background-position: 50% 15px;background-size: 36px 30px;}
.resultLayerPopup__functionButton:focus, .resultLayerPopup__functionButton:hover, .resultLayerPopup__functionButton.active {border-color: #325ee6;background-color: #fff;}
.resultLayerPopup__moreFunction {position: relative;}
.resultLayerPopup__moreButton {position: absolute;top: -44px;right: 50px;display: flex;align-items: center;justify-content: center;width: 110px;height: 45px;padding-top: 1px;border-radius: 20px 20px 0 0;background: #111;color: #fff;font-size: 16px;gap: 4px;z-index: 1;zoom:0.9;}
.resultLayerPopup__moreButton i {width: auto;height: auto;font-size: 24px;}
.resultLayerPopup__moreButton:focus, .resultLayerPopup__moreButton:hover, .resultLayerPopup__moreButton.active {background-image: linear-gradient(to top, #2b6ae5, #5a5de8);}
.resultLayerPopup__abolition {min-width: 65px;margin-left: 12px;color: #de1c2a;}
.resultLayerPopup__abolition i {margin-right: 6px;}
.resultLayerPopup__unpublished {min-width:76px;margin-left: 12px;color: #000;}
.resultLayerPopup__unpublished i {margin-right: 6px;}
.resultLayerPopup__history {min-width: 65px;margin-left: 12px;color: #000;}
.resultLayerPopup__history i {margin-right: 6px;}
.resultLayerPopup__commonButton {display: inline-flex;align-items: center;height: 36px;padding: 0 14px;background: #e5eaf9;color: #11328e;font-size: 13px;gap: 7px;}
.resultLayerPopup__commonButton i {width: auto;height: auto;color: #11328e;font-size: 12px;}
.resultLayerPopup__commonButton.type01 {margin-left: 10px;}
.resultLayerPopup__enText {position: relative;margin-top: 10px;padding-left: 25px;color: #11328e;}
.resultLayerPopup__enText::after {content: " ";position: absolute;left: 0;top: -5px;width: 16px;height: 16px;border-left: 1px solid #9ea7c1;border-bottom: 1px solid #9ea7c1;}
.resultLayerPopup__postDetail {display:none;}
.resultLayerPopup__postDetail.active {display: block;}
.resultLayerPopup__notation {margin-top: 17px;padding: 10px 15px;border-radius: 10px;background: #fff;}
.resultLayerPopup__notation.active {display: block;}
.resultLayerPopup__notationTitle {color: #111;font-size: 16px;}
.resultLayerPopup__notationList {display: flex;flex-wrap: wrap;gap: 8px 0;margin-top: 13px;}
.resultLayerPopup__notationList dt {display: flex;align-items: center;justify-content: center;width: 64px;height: 28px;border: 1px solid #ddd;border-radius: 18px;background-color: #fff;}
.resultLayerPopup__notationList dd {display: flex;flex-direction: column;gap: 13px;width: calc(100% - 90px);padding: 5px 0 0 9px;}
.resultLayerPopup__notationListTitle {color: #111;font-size: 16px;}
.resultLayerPopup__notationListDetail {color: #555;font-size: 15px;}
.resultLayerPopup__notationListEn {color: #11328e;font-size: 15px;}
.eastWestFloor__select {width: 100%;height: 33px;border-radius: 13px;border: 1px solid #c0c4ca;padding: 0 8px;color: #000;font-size: 15px;appearance: none;background:#fff  url("@images/common/geo-chevron-down@2x2.png") no-repeat right 14px top 50% /14px;}

.resultLayerPopup__paging .p-paginator {background: none;}
.resultLayerPopup__paging .p-paginator .p-paginator-page {color: #8898c4;}
.resultLayerPopup__paging .p-paginator .p-paginator-first, .resultLayerPopup__paging .p-paginator .p-paginator-prev, .resultLayerPopup__paging .p-paginator .p-paginator-next, .resultLayerPopup__paging .p-paginator .p-paginator-last {background-color: #1d3679;color: #fff;}

@media (max-width: 1200px) {
  .resultLayerPopup__detailBoxNumber {display: none;}
  .resultLayerPopup__listDetail.basic {margin:0;}
  .resultLayerPopup__listDetail.more {padding-left:10px;}
  .resultLayerPopup__detailAdress {margin-left:127px;}
}

@media (max-width: 1165px) {
  .resultLayerPopup__detailBox .resultLayerPopup__listDetailTitle {display: none;}
  .resultLayerPopup__listDetailContent {width: 100%;}
  .resultLayerPopup__detailAdress {margin-left:10px;}
  .resultLayerPopup__listDetailContent.recordButtonWrap {margin:-38px 0 0 104px;}
}

@media (max-width: 920px) {
  .resultLayerPopup__filter {display: flex;align-items: flex-start;flex-wrap: wrap;margin-top: 25px;gap: 17px;width: 100%;}
  .honorLoad__wrap + .resultLayerPopup__detailSearchBox {margin-top:10px;}
}

@media (max-width: 900px) {
  .mainSearchBox__recentSearchesButtonMore {padding:0;}
  .mainSearchBoxBasic__quickMenu {min-width: 126px;border-radius: 10px;background-position: 50% 27px;}
  .mainSearchBoxBasic__quickMenu button {padding-top: 72px;}
  .mainSearchBoxBasic__quickText.mo {font-size:21px;}
  .resultLayerPopup {position: relative;margin: 0;padding: 18px 20px;border-radius: 10px;background: #112660;}
  .resultLayerPopup.resultActive {display: block;}
  .resultLayerPopup__close {right: 20px;top: 20px;}
  .resultLayerPopup__closeButton {width: 24px;height: 24px;}
  .resultLayerPopup__closeButton i {font-size:14px;}
  .resultLayerPopup__headerFunction {display: flex;align-items: center;gap: 10px;flex-wrap: wrap;}
  .resultLayerPopup__functionList {gap: 5px;}
  .resultLayerPopup__innerWrap {width: 100%;max-width: 1440px;margin: 30px auto 0;padding-bottom: 0px;}
  .resultLayerPopup__detailSearchBox {display: flex;justify-content: center;align-items: center;flex-direction: column;padding: 30px 0;border-radius: 10px;background: #0a1944;}
  .resultLayerPopup__form {border-color: #384e8b !important;background: #102355;}
  .resultLayerPopup__form .p-dropdown-label {color: #fff !important;font-weight: normal;font-size: 17px;}
  .resultLayerPopup__form.selectStype01 {width: 100%;max-width: 100%;}
  .resultLayerPopup__form.selectStype02 {width: 100%;max-width: 100%;}
  .resultLayerPopup__detailSearchBoxTip .bi {margin-right: 4px;}
  .resultLayerPopup__scrollWrap {max-height: 1600px;margin: 25px 0 0 0;}
  .resultLayerPopup__scroll .p-scrollpanel-content {padding: 0 0 18px 0;}
  .resultLayerPopup__unpublished {min-width:auto;}
  .resultLayerPopup__history {min-width:auto;}
  .resultLayerPopup__abolition {min-width:auto;margin-left:5px;}
  .resultLayerPopup__abolition i {margin-right:3px;}
  .resultLayerPopup__list > li {position: relative;overflow: hidden;min-height: initial;margin-top: 20px;border-radius: 5px;background: #fff;}
  .resultLayerPopup__list > li:first-child {margin-top: 0;}
  .resultLayerPopup__listDetail {position: relative;display: flex;align-items: flex-start;flex-wrap: wrap;width: 100%;}
  .resultLayerPopup__listDetail.basic {margin:0;}
  .resultLayerPopup__listDetail.basic .resultLayerPopup__listDetailTitle {display: none;}
  .resultLayerPopup__listDetail.basic .resultLayerPopup__listDetailContent {order: 2;}
  .resultLayerPopup__listDetail.basic .resultLayerPopup__listDetailContent.post {order: 1;}
  .resultLayerPopup__listDetail.more {padding: 5px 10px;display: none;max-width: 100%;background: #eff2fb;}
  .resultLayerPopup__listDetail.more .resultLayerPopup__listDetailTitle {background: #dee3f0;}
  .resultLayerPopup__listDetail.more.moreActive {display: flex;height: auto;}
  .resultLayerPopup__listDetailTitle:first-child {margin: 0;}
  .resultLayerPopup__listDetailContent {min-height: initial;}
  .resultLayerPopup__listDetailContent.moContent {display: flex;flex-direction: row;align-items: center;}
  .resultLayerPopup__listDetailContent .number {font-size:16px;font-weight: bold;}
  .resultLayerPopup__listDetailContent.pcContent .resultLayerPopup__abolition,
  .resultLayerPopup__listDetailContent.pcContent .resultLayerPopup__unpublished,
  .resultLayerPopup__listDetailContent.pcContent .resultLayerPopup__history {display: none;}
  .resultLayerPopup__detailBox {min-height: 100px;padding: 4px 8px;}
  .resultLayerPopup__innerBox {min-height: initial;margin-top:3px;}
  .resultLayerPopup__innerBox.type01 {padding-right:0;}
  .resultLayerPopup__copy {display:inline-block;margin-left: 9px;}
  .resultLayerPopup__copy.type01 {display:none;}
  .resultLayerPopup__relatedAddress {position: relative;margin: 4px 0 0;padding: 2px 40px 0 0;font-size: 14px;}
  .resultLayerPopup__detailAdressFunction {margin-top: 5px;}
  .resultLayerPopup__detailAdressButton i {width: auto;height: auto;color: #11328e;font-size: 11px;}
  .resultLayerPopup__detailAdress {display: none;max-width: 1058px;margin: 12px 0 0 40px;padding: 24px 24px 27px;border-radius: 10px;background: #f8f8f8;}
  .resultLayerPopup__detailAdress.detailAdressActive {display: block;margin: 0 10px 0 10px;}
  .resultLayerPopup__eastWestFloor {display: flex;width: 100%;gap: 10px;margin-bottom: 7px;}
  .resultLayerPopup__eastWestFloorSelect .p-dropdown-label {line-height: 34px !important;font-size: 14px !important;}
  .resultLayerPopup__eastWestFloorTip {margin-top: 7px;}
  .resultLayerPopup__tip {margin-top: 10px;}
  .resultLayerPopup__phone::after {display: none;}
  .resultLayerPopup__function {display: flex;align-items: center;justify-content: center;gap: 10px;position: absolute;right: 8px;top: 3px;z-index: 1;}
  .resultLayerPopup__functionButton {display: flex;align-items: center;justify-content: center;width: auto;height: auto;padding: 0;border: none;background: none !important;gap: 0;font-size:18px;}
  .resultLayerPopup__functionButton:focus, .resultLayerPopup__functionButton:hover, .resultLayerPopup__functionButton.active {text-decoration: underline;}
  .resultLayerPopup__functionButton + .resultLayerPopup__functionButton {position: relative;overflow: visible;}
  .resultLayerPopup__functionButton + .resultLayerPopup__functionButton::after {content: "";display: block;position: absolute;top: 4px;left: -5px;width: 1px;height: 16px;background: #e5e5e5;}
  .resultLayerPopup__en {height: 15px;padding-left: 27px;background: url("@images/common/img-translate.png") no-repeat 50% 1px/15px 11px;}
  .resultLayerPopup__detailBoxNumber, .resultLayerPopup__functionPostalCodeWrap {display: none;}
  .resultLayerPopup__apt {margin: 0 0 0 5px;border-radius: 8px;background: #ebf0fd;font-size: 14px;}
  .resultLayerPopup__english {display: inline-block;margin-left:10px;padding-left:18px;background: url("@images/common/icon1.png") no-repeat 0 4px/ 13px;color:#0076c7;font-size:16px;}
  .resultLayerPopup__copyButton {display: inline-block;margin-left:10px;padding-left:18px;background: url("@images/common/icon4.png") no-repeat 0 4px/ 13px;color:#0076c7;font-size:16px;}
  .resultLayerPopup__apt::after {display: none;}
  .resultLayerPopup__functionButton.pcContent {display: none;}
  .resultLayerPopup__moreButton {position: absolute;top: -30px;right: 18px;display: flex;align-items: center;justify-content: center;width: 30px;height: 30px;padding-top: 1px;border-radius: 10px 10px 0 0;background: #111;color: #fff;font-size: 0;gap: 0;z-index: 1;}
  .resultLayerPopup__moreButton i {width: auto;height: auto;font-size: 20px;}
  .resultLayerPopup__moreButton:focus, .resultLayerPopup__moreButton:hover, .resultLayerPopup__moreButton.active {background-image: linear-gradient(to top, #2b6ae5, #5a5de8);}
  .resultLayerPopup__commonButton.type01 {margin-left: 10px;min-width: 126px;padding: 0 10px 0 15px;}
  .resultLayerPopup__notation {margin-top: 17px;padding: 15px;border-radius: 10px;background: #fff;}
  .resultLayerPopup__notation.active {display: block;}
  .resultLayerPopup__notationTitle {color: #111;font-size: 12px;height: 500;}
  .resultLayerPopup__notationList {display: flex;flex-wrap: wrap;gap: 15px 0;margin-top: 15px;}
  .resultLayerPopup__notationList dt {display: flex;align-items: center;justify-content: center;width: 40px;height: 20px;border: 1px solid #ddd;border-radius: 10px;background-color: #fff;}
  .resultLayerPopup__notationList dd {display: flex;flex-direction: column;gap: 5px;width: calc(100% - 50px);padding: 2px 0 0 9px;}
  .resultLayerPopup__notationListTitle {color: #111;font-size: 14px;}
  .resultLayerPopup__notationListDetail {color: #555;font-size: 13px;}
  .resultLayerPopup__notationListEn {color: #11328e;font-size: 13px;}
  .resultLayerPopup__paging .p-paginator {background: none;}
  .resultLayerPopup__paging .p-paginator .p-paginator-page {color: #8898c4;}
  .resultLayerPopup__paging .p-paginator .p-paginator-first, .resultLayerPopup__paging .p-paginator .p-paginator-prev, .resultLayerPopup__paging .p-paginator .p-paginator-next, .resultLayerPopup__paging .p-paginator .p-paginator-last {background-color: #1d3679;color: #fff;}
  .resultLayerPopup__administration + .resultLayerPopup__innerWrap {margin-top:19px;}
  .resultLayerPopup__headerFunction {width: 100% !important;margin:10px 0 0 !important;}
}
</style>