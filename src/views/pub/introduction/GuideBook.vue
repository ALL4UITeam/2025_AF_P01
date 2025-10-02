<script setup>
import { ref, onMounted, computed } from 'vue'
import {useRoute} from "vue-router";

const pageIdx = ref(1)
const contentClass = computed(() => {
  if (pageIdx.value === 1) return 'section-book cover'
  if (pageIdx.value === 2) return 'section-book list'
  return 'section-book section-book1'
})

const route = useRoute();

const showPrevButton = computed(() => pageIdx.value > 3 && pageIdx.value <= 29)
const showNextButton = computed(() => pageIdx.value >= 3 && pageIdx.value < 29)

const updateActiveNav = () => {
  const links = document.querySelectorAll('.guideNav__link')
  links.forEach(link => link.classList.remove('active'))

  if (pageIdx.value >= 3 && pageIdx.value <= 20) {
    links[0].classList.add('active')
  } else if (pageIdx.value >= 21 && pageIdx.value <= 25) {
    links[1].classList.add('active')
  }
}

const curState = (page) => {
  const guides = document.querySelectorAll('div[id^="guide"]')
  guides.forEach(guide => guide.classList.add('off'))
  
  const currentGuide = document.querySelector(`#guide${page}`)
  if (currentGuide) {
    currentGuide.classList.remove('off')
  }

  const formattedPage = page.toString().padStart(2, '0')
  const curPageElement = document.querySelector('#curPage')
  if (curPageElement) {
    curPageElement.textContent = formattedPage
  }
}

const prevPage = () => {
  if (pageIdx.value > 1) {
    pageIdx.value--
    curState(pageIdx.value)
    updateActiveNav()
  }
}

const nextPage = () => {
  if (pageIdx.value < 29) {
    pageIdx.value++
    curState(pageIdx.value)
    updateActiveNav()
  }
}

const before = () => {
  const activeGuide = document.querySelector('div[id^="guide"]:not(.off)');
  if (activeGuide?.id) {
    const getId = activeGuide.id.split('guide')[1];
    if (getId === "3") {
      const prevButton = document.querySelector('.content.prev');
      if (prevButton) {
        prevButton.style.display = 'none';
      }
      return;
    }
    pageIdx.value = parseInt(getId) - 1;
    curState(pageIdx.value);
    updateActiveNav();
  }
}

const after = () => {
  const activeGuide = document.querySelector('div[id^="guide"]:not(.off)');
  if (activeGuide?.id) {
    const getId = activeGuide.id.split('guide')[1];
    if (getId === "29") {
      const nextButton = document.querySelector('.content.next');
      if (nextButton) {
        nextButton.style.display = 'none';
      }
      return;
    }
    pageIdx.value = parseInt(getId) + 1;
    curState(pageIdx.value);
    updateActiveNav();
  }
}

const goToPage = (page) => {
  pageIdx.value = page
  curState(pageIdx.value)
  updateActiveNav()
}

onMounted(() => {
  if(route.query?.pageIdx) {
    pageIdx.value = Number(route.query.pageIdx);
  }
  curState(pageIdx.value)
  updateActiveNav()
})
</script>

<template>
  <div id="content" :class="contentClass">
    <a @click="before" class="content prev" :style="{ display: showPrevButton ? 'flex' : 'none' }">
      <i aria-hidden="true" class="bi bi-arrow-left"></i>
      <span class="blind">이전</span>
    </a>
    <a @click="after" class="content next" :style="{ display: showNextButton ? 'flex' : 'none' }">
      <i aria-hidden="true" class="bi bi-arrow-right"></i>
      <span class="blind">다음</span>
    </a>
    <div class="guideNav__wrap">
      <div class="guideNav__list">
        <a @click="() => goToPage(3)" title="Chapter #01 도로명주소? 로 바로가기" 
          :class="['guideNav__link type01', { active: pageIdx >= 3 && pageIdx <= 20 }]">
          <div class="guideNav__text">도로명주소 <span class="guideNav__number">#01</span></div>
          <i aria-hidden="true" class="bi bi-arrow-right"></i>
        </a>
        <a @click="() => goToPage(21)" title="Chapter #02 사물주소? 로 바로가기"
          :class="['guideNav__link type02', { active: pageIdx >= 21 && pageIdx <= 25 }]">
          <div class="guideNav__text">사물주소 <span class="guideNav__number">#02</span></div>
          <i aria-hidden="true" class="bi bi-arrow-right"></i>
        </a>
        <a @click="() => goToPage(26)"
          :class="['guideNav__link type04', { active: pageIdx === 26 }]">
          <div class="guideNav__text">장소지능 <span class="guideNav__number">#03</span></div>
          <i aria-hidden="true" class="bi bi-arrow-right"></i>
        </a>
        <a @click="() => goToPage(27)" 
          :class="['guideNav__link type05', { active: pageIdx === 27 }]">
          <div class="guideNav__text">수상시설물 <span class="guideNav__number">#04</span></div>
          <i aria-hidden="true" class="bi bi-arrow-right"></i>
        </a>
        <a @click="() => goToPage(28)" 
          :class="['guideNav__link type06', { active: pageIdx === 28 }]">
          <div class="guideNav__text">국가지점번호 <span class="guideNav__number">#05</span></div>
          <i aria-hidden="true" class="bi bi-arrow-right"></i>
        </a>
        <a @click="() => goToPage(29)" 
          :class="['guideNav__link type07', { active: pageIdx === 29 }]">
          <div class="guideNav__text">국가기초구역 <span class="guideNav__number">#06</span></div>
          <i aria-hidden="true" class="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
    <div id="guide1">
      <h1><strong>도로명주소 소개 <span>Guide book</span></strong><span>Introduce Road name address</span></h1>
    </div>
    <div id="guide2" class="off">
      <div class="guideChapter__wrap">
        <div class="guideChapter__list">
          <div class="guideChapter__box">
            <a @click="() => goToPage(3)" title="Chapter #01 도로명주소? 로 바로가기" class="guideChapter__link type01">
              <div class="guideChapter__title">Chapter #01</div>
              <div class="guideChapter__text">
                도로명주소 
                <i aria-hidden="true" class="bi bi-arrow-right"></i>
              </div>
            </a>
          </div>
          <div class="guideChapter__box">
            <a @click="() => goToPage(21)" title="Chapter #02 사물주소? 로 바로가기" class="guideChapter__link type02">
              <div class="guideChapter__title">Chapter #02</div>
              <div class="guideChapter__text">
                사물주소 
                <i aria-hidden="true" class="bi bi-arrow-right"></i>
              </div>
            </a>
          </div>
          <div class="guideChapter__box">
            <a @click="() => goToPage(26)" class="guideChapter__link type04">
              <div class="guideChapter__title">Chapter #03</div>
              <div class="guideChapter__text">
                장소지능 
                <i aria-hidden="true" class="bi bi-arrow-right"></i>
              </div>
            </a>
          </div>
          <div class="guideChapter__box">
            <a @click="() => goToPage(27)" class="guideChapter__link type05">
              <div class="guideChapter__title">Chapter #04</div>
              <div class="guideChapter__text">
                수상시설물 
                <i aria-hidden="true" class="bi bi-arrow-right"></i>
              </div>
            </a>
          </div>
          <div class="guideChapter__box">
            <a @click="() => goToPage(28)" class="guideChapter__link type06">
              <div class="guideChapter__title">Chapter #05</div>
              <div class="guideChapter__text">
                국가지점번호 
                <i aria-hidden="true" class="bi bi-arrow-right"></i>
              </div>
            </a>
          </div>
          <div class="guideChapter__box">
            <a @click="() => goToPage(29)" class="guideChapter__link type07">
              <div class="guideChapter__title">Chapter #06</div>
              <div class="guideChapter__text">
                국가기초구역
                <i aria-hidden="true" class="bi bi-arrow-right"></i>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div> 
    
    <div id="guide3" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_01.jpg" alt="chapter 1.도로명주소란? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1 도로명주소란?</h3>
        <p>"도로명주소"란 부여된 도로명, 기초번호, 건물번호, 상세주소에 의하여 건물의 주소를 표기하는 방식으로, 도로에는 도로명을 부여하고, 건물에는 도로에 따라 규칙적으로 건물번호를 부여하여 도로명과 건물번호 및 상세주소(동 &middot; 층 &middot; 호)로 표기하는 주소제도입니다.</p>
        <h4>생활이 편리해집니다.</h4>
        <ul>
          <li>체계적인 도로명주소 사용으로 길찾기가 수월해집니다.</li>
          <li>화재나 범죄 등 긴급한 상황에서 신속하게 대응합니다.</li>
        </ul>
        <h4>국가경쟁력이 높아집니다.</h4>
        <ul>
          <li>세계적으로 보편화된 도로명주소를 사용함으로써 국가경쟁력이 높아집니다</li>
          <li>물류비 절감 등 사회 &middot; 경제적 비용이 줄어듭니다.</li>
        </ul>
        <h4>지번과 도로명주소 비교</h4>
        <table>
        <caption> 지번과 도로명주소 구성 및 주된 용도 비교 표 테이블로 구분, 지번, 도로명주소 정보를 제공합니다.</caption>
          <thead>
            <tr>
              <th scope="col">구분</th>
              <th scope="col">지번</th>
              <th scope="col">도로명주소</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">구성</th>
              <td>동,리+지번  &rarr; 토지 중심</td>
              <td>도로명+건물번호 &rarr; 건물중심</td>
            </tr>
            <tr>
              <th scope="row">주된 용도</th>
              <td>토지관리(토지번호) &rarr; 토지 표시(재산권보호)</td>
              <td>위치이동(건물번호) &rarr; 주소 표시(위치안내)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="guide4" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_02.jpg" alt="chapter 1.주소 표기방법 > 도로명주소, 이렇게 씁니다. - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1 주소 표기방법</h3>
        <h4>도로명주소,  이렇게 씁니다.</h4>
        <div>
          <p>지번  &rarr; 도로명주소</p>
          <p>시/도  시/군/구   읍/면  &rarr;<span>동일</span> 지번과 동일</p>
          <p>동 / 리 지번 &rarr;<span>변경</span> 도로명 건물번호</p>
          <p>공동주택명  동 / 층 / 호 &rarr;<span>유사</span> 동 / 층 / 호</p>
          <p>+ 법정동, 공동주택명</p>
        </div>
        <ul>
          <li>시/도 + 시/군/구 + 읍/면 + 도로명 + 건물번호 + 상세주소(동/층/호) + (참고항목)</li>
          <li>참고항목 = 법정동, 공동주택 명칭</li>
        </ul>
        <ul>
          <li><strong>파란색 바탕 오각형 판 - 단독주책</strong>서울특별시 서초구 <em>반포대로23길 6(서초동)</em></li>
          <li><strong>파란색 바탕 오각형 판 - 업무용빌딩</strong>서울특별시 종로구 <em>세종대로 209</em>, 1403호(세종로)</li>
          <li><strong>파란색 바탕 오각형 판 - 공동주택</strong>서울특별시 영등포구  <em>여의나루로 5</em>, 505동 1402호(여의도동, 여의도아파트)</li>
        </ul>
        <table>
          <caption>도로명주소 표기방법 안내표 테이블로 설명, 옳은 표기예시, 옳지 않은 표기 예시 정보를 제공합니다.</caption>
          <thead>
            <tr>
              <th scope="col">설명</th>
              <th scope="col">옳은 표기 예시</th>
              <th scope="col">옳지 않은 표기 예시</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">도로명은 붙여 씁니다.</th>
              <td>국회대로62길 (O)</td>
              <td>국회대로 62길 (X)</td>
            </tr>
            <tr>
              <th scope="row">도로명과 건물번호 사이는 띄어 씁니다</th>
              <td>국회대로62길 9 (O)</td>
              <td>국회대로 62길9 (X)</td>
            </tr>
            <tr>
              <th scope="row">건물번호와 동/층/호 사이에는 쉼표(,) 를 사용합니다</th>
              <td>삭주로 89, 201동 101호 (O)</td>
              <td>삭주로 89 201동 101호 (X)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="guide5" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_03.jpg" alt="chapter 1.도로명주소 부여방법 > 도로명과 건물번호, 이렇게 이루어졌습니다. - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1  도로명주소 부여방법</h3>
        <h4>도로명과 건물번호,  이렇게 이루어졌습니다.</h4>
        <div>
          <p>
            파란색 바탕 오각형 판
            상단 - 세종대로 Sejong-daero<span>-도로명</span>
            하단 - 209  <span>-건물번호</span>
          </p>
        </div>
        <ul>
          <li>
            <h5>도로명은?</h5>
            도로구간마다 부여한 이름으로, 주된 명사에 도로별 구분기준인 대로, 로, 길을 붙여서 부여
          </li>
          <li>
            <h5>건물번호는?</h5>
            도로시작점에서 20m 간격으로 왼쪽은 홀수, 오른쪽은 짝수를 부여
          </li>
          <li>
            <h5>도로구간 설정</h5>
            직진성·연속성을 고려, 서 -> 동 , 남 -> 북 방향으로 설정
          </li>
          <li>
            <h5>건물번호 부여</h5>
            주된 출입구에 인접한 도로의 기초번호 사용 원칙 (건물번호 부여 대상은 생활의 근거가 되는 건물)
          </li>
        </ul>
        <div>
          <ol>
            <li>1번 시작지점 표지판 이미지 (오른쪽이 부등호 모양으로 생긴 오각형의 표지판) 중앙로 Jungang-ro 1 → 359</li>
            <li>2번 진행방향 표지판 이미지 (직사각형의 표지판) 대한대로 Daehan-daero 10 ↑ 600</li>
            <li>3번 교차지점 표지판 이미지 (양쪽이 부등호 모양으로 생긴 육각형의 표지판) 7 중앙로 Jungang-ro 9 </li>
            <li>4번 하얀색 테두리에 파란색 바탕인 오각형 판 하얀색 글씨, 상단: 중앙로8번길 Jungang-ro 8beon-gil, 하단: 1 (왼쪽)과  상단: 중앙로8번길 Jungang-ro 8beon-gil, 하단: 2 (오른쪽)</li>
            <li>5번 파란색 테두리 하얀색 바탕인 원형 파란색 글씨 대로</li>
            <li>6번 파란색 테두리 하얀색 바탕인 원형 파란색 글씨 로</li>
            <li>7번 파란색 테두리 하얀색 바탕인 원형 파란색 글씨 길</li>
            <li>8번 하얀색 테두리에 파란색 바탕인 오각형 판 하얀색 글씨, 상단: 대한대로 Daehan-daero, 하단: 12 와 상단: 대한대로 Daehan-daero, 하단: 10</li>
          </ol>	
        </div>
        <ol>
          <li>1번 현위치는 '중앙로'의 도로 시작점'1'부터 (→)방향으로 '중앙로 359'까지 도로명주소가 부여되어 있음</li>
          <li>2번 현위치는 '대한대로'의 중간지점 '10'부터 (↑)방향으로 '대한대로 600'까지 있음</li>
          <li>3번 교차로에 설치되며 왼쪽(←)은 '7'이하 오른쪽은 '9'이상의 건물들이 있음</li>
          <li>4번 '중앙로'를 기점으로 왼쪽은 홀수, 오른쪽은 짝수</li>
          <li>5번 대로: 8차로 이상</li>
          <li>6번 로: 2차로에서 7차로까지</li>
          <li>7번 길: '로'보다 좁은 도로</li>
          <li>8번 건물사이 간격은 약 20m</li>
        </ol>			
      </div>
    </div>
    <div id="guide6" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_04.jpg" alt="chapter 1.도로명주소 부여방법 > (1)도로명 부여방법 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1  도로명주소 부여방법</h3>
        <h4>(1) 도로명 부여방법</h4>
        <div>
          <h5><strong>일련번호</strong> 부여방식</h5>
          <dl>
            <dt>대로/로의 도로명+<strong>일련번호</strong>+길</dt>
            <dd>대로/로에서 분기되는 길에 분기되는 지점의 일련번호를 이용하여 도로명 부여</dd>
          </dl>
        </div>
        <div>
          <h5><strong>기초번호</strong> 부여방식</h5>
          <dl>
            <dt>대로/로의 도로명+<strong>기초번호</strong>+길</dt>
            <dd>대로/로에서 분기되는 길에 분기되는 지점의 기초번호를 이용하여 도로명 부여</dd>
          </dl>
        </div>
        <div>
          <h5>그 외 숫자방식</h5>
          <dl>
            <dt>사직1길, 사직2길, 백송1길</dt>
            <dd>일정지역의 로/길에서 지역특성에 맞는 일련번호를 이용하여 도로명 부여</dd>
          </dl>
        </div>
        <div>
          <h5><strong>추가</strong>로 분기되는 경우</h5>
          <dl>
            <dt>OO로3가길, OO로3번나길...</dt>
            <dd>기초번호방식 또는 일련번호방식의 길에서 추가로 분기되는 길에 가, 나, 다 순을 추가하여 도로명 부여</dd>
          </dl>
        </div>
      </div>
    </div>
    <div id="guide7" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_05.jpg" alt="chapter 1.도로명주소 부여방법 > (2)건물번호 부여방법 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1  도로명주소 부여방법</h3>
        <h4>(2) 건물번호 부여방법</h4>
        <div>
          <p>2개의 도로에 출입구가 접한 경우 큰 도로의 출입구를 기준으로 하여 건물번호를 부여한다.</p>
          <p >※건물 소유자 등이 원하는 경우 달리할 수 있음</p>
        </div>
        <div>
          <h5><strong>부번</strong>의 사용</h5>
          <ul>
            <li>하나의 구간에 여러 개의 건물이 있는 경우</li>
            <li>하나의 구간에 종속구간이 있는 경우</li>
          </ul>
        </div>
        <div>
          <h5><strong>지하</strong>의 사용</h5>
          <p>도로에 위치한 지하상가는 건물번호 앞에 지하를 함께 표기</p>
        </div>
      </div>
    </div>
    <div id="guide8" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_06.jpg" alt="chapter 1.도로명주소 부여방법 > 3)상세주소 부여방법(1/3) - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1  도로명주소 부여방법</h3>
        <h4>(3) 상세주소 부여방법 (1/3)</h4>
        <div>
          <h5>동번호</h5>
          <p>※ 주 출입구를 기준으로 시계 반대 방향 부여 권장, [범례] &rarr; : 주된 진입방향</p>
        </div>
        <table>
          <caption>도로명주소 - 상세주소 - 동번호 : 일렬형, 트리형, 광장형, 병렬형, 링형, 메트릭스형 정보를 제공하는 표</caption>
          <colgroup>
            <col style="width:320px"/>
            <col style="width:320px"/>
            <col style="width:320px"/>
          </colgroup>
          <thead>
            <tr>
              <th colspan="3">아라비아 숫자를 일련번호로 부여하거나 한글을 이용 (101동, 102동, 103동.../ 가동, 나동, 다동...)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th id="table_ex1">일렬형</th>
              <th id="table_ex2">트리형</th>
              <th id="table_ex3">광장형</th>
            </tr>
            <tr>
              <td headers="table_ex1">일렬형 예시 이미지 - 주된 진입방향 (→) 방향으로 부터 우측 101동, 102동, 103동 부여</td>
              <td headers="table_ex2">트리형 예시 이미지 - 주된 진입방향 (→) 방향으로 부터 우측에서 좌측으로 1동, 2동, 3동, 4동, 5동, 6동 부여</td>
              <td headers="table_ex3">광장형 예시 이미지 - 주 출입구 기준으로 시계 반대방향으로 1동, 2동, 3동 부여</td>
            </tr>
            <tr>
              <th id="table_ex4">병렬형</th>
              <th id="table_ex5">링형</th>
              <th id="table_ex6">메트릭스형</th>
            </tr>
            <tr>
              <td headers="table_ex4">병렬형 예시 이미지 - 주된 진입방향 (→) 방향으로 부터 우측은 1동, 2동, 3동/ 좌측은 6동, 5동, 4동으로 부여</td>
              <td headers="table_ex5">링형 예시 이미지 - 주된 진입방향 (→) 방향으로 부터 시계반대방향으로 가동, 나동, 다동, 라동, 마동으로 부여</td>
              <td headers="table_ex6">메트릭스형 예시 이미지 - 주된 진입방향 (→) 방향을 따라 1동, 2동, 3동 4동, 5동 6동 부여</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="guide9" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_07.jpg" alt="chapter 1.도로명주소 부여방법 > 3)상세주소 부여방법(2/3) - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1  도로명주소 부여방법</h3>
        <h4>(3) 상세주소 부여방법 (2/3)</h4>
        <div>
          <h5>층수</h5>
          <p>※지하층이 1개인 경우에는 지하 1층은 지하층으로 표기 [범례] &rarr; : 주된 진입방향 M,L,G층 : M(Main:주층), L(Lobby:로비), G(Garage:주차장)</p>
        </div>
        
        <table>
          <caption>도로명주소 - 상세주소 - 층수 : 수직형, 지하벙커형, 구름다리형, 필로타형, M,L,G층 정보를 제공하는 표</caption>
          <colgroup>
            <col style="width:320px"/>
            <col style="width:320px"/>
            <col style="width:320px"/>
          </colgroup>
          <thead>
            <tr>
              <th colspan="3">지표면을 기준으로 지상은 일련번호, 지하층은 '지하'를 붙여 표기</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th id="table_ex7">수직형</th>
              <th id="table_ex8">지하 벙커형</th>
              <th id="table_ex9" class="no-bd-right">구름다리형</th>
            </tr>
            <tr>
              <td headers="table_ex7">수직형 예시 이미지 - 지표면에서 주된 진입방향(→)으로 아래(↓)방향 지하1층, 지하2층 / 윗(↑)방향 1층, 2층, 3층, 4층 부여</td>
              <td headers="table_ex8">지하 벙커형 예시 이미지 - 지표면에서 주된 진입방향(↓)으로 지하1층, 지하2층, 지하3층 부여</td>
              <td headers="table_ex9" class="no-bd-right">구름다리형 예시 이미지 - 지표면에서 주된 진입방향(→) 1층, 2층, 3층, 4층 부여</td>
            </tr>
            <tr>
              <th id="table_ex10">필로티형</th>
              <th id="table_ex11">M,L,G층</th>
              <th>&nbsp;</th>
            </tr>
            <tr>
              <td headers="table_ex10">필로티형 예시 이미지 - 지표면의 주차장에서 주된 진입방향(↑) 2층, 3층 부여</td>
              <td headers="table_ex11">M,L,G층 예시 이미지 - 지표면에서 주된 진입방향(→) 아래(↓)방향 지하층/ 윗(↑)방향 1층, 2층- 로비 부여안함 </td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="guide10" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_08.jpg" alt="chapter 1.도로명주소 부여방법 > 3)상세주소 부여방법(3/3) - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1  도로명주소 부여방법</h3>
        <h4>(3) 상세주소 부여방법 (3/3)</h4>
        <div>
          <h5>호수</h5>
          <p>※ 주 출입구를 기준으로 시계 반대 방향 부여 권장, [범례] <span>회색네모 부분</span> : 주된 진입방향</p>
        </div>
        <table>
          <caption>도로명주소 - 상세주소 - 호수 : 직선 배치형, 달팽이 배치형, 병렬 배치형, H자 모양 배치형 정보를 제공하는 표</caption>
          <colgroup>
            <col style="width:320px"/>
            <col style="width:320px"/>
            <col style="width:320px"/>
          </colgroup>
          <thead>
            <tr>
              <th colspan="3">아라비아 숫자를 순차적으로 사용(101호, 102호.../1호, 2호.../지하1호, 지하2호.../지하 101호, 지하 102호...)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th id="table_ex12">직선 배치형</th>
              <th id="table_ex13">달팽이 배치형</th>
              <th id="table_ex14">병렬 배치형 (비선호 숫자를 제외한 경우)</th>
            </tr>
            <tr>
              <td headers="table_ex12">직선 배치형 이미지 예시 - 주출입구 기준으로 좌→우 직선으로 101호, 102호, 103호, 104호 부여</td>
              <td headers="table_ex13">달팽이 배치형 이미지 예시 - 주된 진입방향(→) 기준 시계반대방향으로 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112 부여 </td>
              <td headers="table_ex14">병렬 배치형 (비선호 숫자를 제외한 경우) 이미지 예시 - 주된 진입방향(→)으로 우측 101호, 102호, 103호, 105호/ 좌측 109호, 108호, 107호, 106호 부여</td>
            </tr>
            <tr>
              <th id="table_ex15">H자 모양 배치형</th>
              <th>&nbsp;</th>
              <th>&nbsp;</th>
            </tr>
            <tr>
              <td headers="table_ex15">H자 모양 배치형 이미지 예시 - 주된 집입방향 (↓)으로 시계반대방향으로 102, 103, 104, 105, 107, 108, 109, 110, 111, 112 부여 </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="guide11" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_09.jpg" alt="chapter 1.도로명주소 보는방법 > 안내시설 보는 방법 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1 도로명주소 보는방법</h3>
        <h4>안내시설 보는 방법</h4>
        <div>
          <ol>
            <li><span>1</span>시작지점 표지판 이미지 (오른쪽이 부등호 모양으로 생긴 오각형의 표지판) 중앙로 Jungang-ro 1 → 19</li>
            <li><span>2</span>기초번호판 이미지 (사각형 모양의 번호판) 상단 : 도로명 (중앙로 Jungang-ro) , 하단 : 기초번호 (3)</li>
            <li><span>3</span>교차지점 표지판 이미지 (양쪽이 부등호 모양으로 생긴 육각형의 표지판) 5 중앙로 Jungang-ro 9 </li>
            <li><span>4</span>끝지점 표지판 이미지 (왼쪽이 부등호 모양으로 생긴 오각형의 표지판) 1 ← 19 중앙로 Jungang-ro</li>
            <li><span>5</span>진행방향 표지판 이미지 (직사각형의 표지판) 대한대로 Daehan-daero 12 ↑ 60</li>
            <li><span>6</span>예고용 도로명판 이미지(직사각형의 표지판) 중앙로 Jungang-ro 200m</li>
            <li><span>7</span>하얀색 테두리에 파란색 바탕인 오각형 판 하얀색 글씨, 상단: 중앙로 Jungang-ro 20beon-gil, 하단: 2 </li>
          </ol>	
        </div>
        <div>
          <ul>
            <li><span>1</span><p><strong>시작지점</strong><span>도로 시작지점 '1' [→]방향으로 '중앙로 19'까지 있음</span></p></li>
            <li><span>2</span><p><strong>기초번호판</strong><span>도로명, 기초번호로 구성 / 현위치는 '중앙로 3'</span></p></li>
            <li><span>3</span><p><strong>교차지점</strong><span>교차로에 설치, 왼쪽 [←]은 '5'이하 오른쪽[→]은 '9'이상의 건물이 있음</span></p></li>
            <li><span>4</span><p><strong>끝지점</strong><span>현위치는 도로 끝지점 '19' [←]방향으로 '중앙로1'까지 있음</span></p></li>
          </ul>
          <ul>
            <li><span>5</span><p><strong>진행중인 도로</strong><span>현위치는 대한대로의 12번 지점, 도로 끝지점은 60번</span></p></li>
            <li><span>6</span><p><strong>예고용 도로명판</strong><span>현위치에서 200m 전방에 중앙로가 있음</span></p></li>
            <li><span>7</span><p><strong>건물번호판</strong><span>도로명과 건물번호로 구성</span></p></li>
          </ul>
        </div>
      </div>
    </div>
    <div id="guide12" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_10.jpg" alt="chapter 1.도로명주소 보는방법 > 건물번호판 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1 도로명주소 보는방법</h3>
        <h4>건물번호판</h4>
        <div>
          <table>
            <caption>용도에 따른 건물번호판 테이블로  일반용 정보를 제공합니다.</caption>
            <thead>
              <tr>
                <th scope="col" colspan="2" id="table_ex16">일반용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td headers="table_ex16">하얀색 테두리에 파란색 바탕인 오각형 판 하얀색 글씨, 상단 - 세종대로 Sejong-daero, 하단 - 209</td>
                <td headers="table_ex16">하얀색 테두리에 파란색 바탕인 정사각형 판 하얀색 글씨, 상단 - 중앙로, 중앙 - 35, 하단 - Jungang-ro</td>
              </tr>
            </tbody>
          </table>
          <table>
            <caption>용도에 따른 건물번호판 테이블로 관공서용, 문화재/관광지용 정보를 제공합니다.</caption>
            <thead>
              <tr>
                <th scope="col" id="table_ex17">관공서용</th>
                <th scope="col" id="table_ex18">문화재, 관광지용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td headers="table_ex17">파란색 테두리에 하얀색 바탕인 원형 판 파란색 글씨, 상단 - 관공서 아이콘, 중앙 - 6, 하단 - 문연로 Munnyeon-ro</td>
                <td headers="table_ex18">갈색 테두리에 하얀색 바탕인 윗면이 둥근 사각형 판 갈색 글씨, 상단 - 아이콘,  중앙 - 24, 하단 - 보성길 Boseong-gil</td>
              </tr>
            </tbody>
          </table>
          <div>
            <p>자율형 건물번호판</p>
            <ul>
              <li><span>사진 예시 1</span>고층빌딩 중간에 449라는 건물 번호를 주황색 조명으로 환하게 표시해주고 있다.</li>
              <li><span>사진 예시 2</span>갈색의 2층 빌라 중간 벽면에 하얀색 글자로 도로명판 내용을 표시해주고 있다.</li>
              <li><span>사진 예시 3</span>건물이 4개가 있고 각각 건물 1층 코너 중간벽면에 꺾어지는 도로명판이 부착되어있다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div id="guide13" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_11.jpg" alt="chapter 1.도로명주소 보는방법 > 도로명판 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1 도로명주소 보는방법</h3>
        <h4>도로명판</h4>
        <div>
          <h5>시작지점</h5>
          <p>시작지점 표지판 이미지 (오른쪽이 부등호 모양으로 생긴 오각형의 표지판) 강남대로 Gangnam-daero 1 → 699</p>
          <ul>
            <li><strong>강남대로</strong>넓은 길, '시작시점을 의미'</li>
            <li><strong>1 &rarr;</strong>현 위치는 도로 시작지점 '1'</li>
            <li><strong>1 &rarr; 699</strong>강남대로는 6.99km (699 X 10m)</li>
          </ul>
        </div>
        <div>
          <h5>끝지점</h5>
          <p>끝지점 표지판 이미지 (왼쪽이 부등호 모양으로 생긴 오각형의 표지판) 1 ← 65 대정로23번길 Daejeong-ro 23beon-gil</p>
          <ul>
            <li><strong>대정로23번길</strong>대정로 시작지점에서 부터 약 230m지점에서 왼쪽으로 분기된 도로</li>
            <li><strong>&larr; 65</strong>현 위치는 도로 끝지점 '65'</li>
            <li><strong>1 &rarr; 65</strong>이 도로는 650m (65 X 10m)</li>
          </ul>
        </div>
        
        <div>
          <h5>교차지점</h5>
          <p>교차지점 표지판 이미지 (양쪽이 부등호 모양으로 생긴 육각형의 표지판) 92 중앙로 Jungang-ro 96</p>
          <ul>
            <li><strong>중앙로</strong>전방 교차 도로는 중앙로</li>
            <li><strong>92</strong>좌측으로 92번 이하 건물 위치</li>
            <li><strong>96</strong>우측으로 96번 이상 건물 위치</li>
          </ul>
        </div>
        <div>
          <h5>진행방향</h5>
          <p>진행방향 표지판 이미지 (직사각형의 표지판) 사임당로 Saimdang-ro 92 ↑ 250</p>
          <ul>
            <li><strong>사임당로</strong>중간지점을 의미</li>
            <li><strong>92 &rarr;</strong>현 위치는 도로상의 92번</li>
            <li><strong>92 &rarr; 250</strong>남은 거리는 1.5km ((250-92) X 10m)</li>
          </ul>
        </div>		
      </div>
    </div>
    <div id="guide14" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_12.jpg" alt="chapter 1.도로명주소 보는방법 > 도로명판 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1 도로명주소 보는방법</h3>
        <h4>도로명판</h4>
        <div>
          <div>
            <h5>기초번호판</h5>
            <p>기초번호판 이미지 (사각형 모양의 번호판) 상단 : 도로명 (종로 Jong-ro) , 하단 : 기초번호 (2345)</p>
          </div>
          <div>
            <h5>예고용 도로명판</h5>
            <p>예고용 도로명판 이미지 (직사각형의 표지판) 종로 Jong-ro 200m</p>
            <ul>
              <li><strong>종로</strong>현 위치에서 다음에 나타날 도로는 종로</li>
              <li><strong>200m</strong>현 위치로부터 전방 200m에 예고한 도로가 있음</li>
            </ul>
          </div>
        </div>
        <table>
          <caption>"방향"을 나타내는 도로명주소 도로명판 테이블로 한방향용, 앞쪽 방향용, 양 방향용 정보를 제공합니다.</caption>
          <thead>
            <tr>
              <th scope="col" colspan="2">한방향용</th>
              <th scope="col" rowspan="2">앞쪽 방향용</th>
              <th scope="col" rowspan="2">양 방향용</th>
            </tr>
            <tr>
              <th scope="col">기점</th>
              <th scope="col">종점</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>기점 표지판 이미지 (오른쪽이 부등호 모양으로 생긴 오각형의 표지판) 방배로 Bangbae-ro 1 → 71</td>
              <td>종점 표지판 이미지 (왼쪽이 부등호 모양으로 생긴 오각형의 표지판) 1 → 71 방배로 Bangbae-ro</td>
              <td>앞쪽 방향용 표지판 이미지 (직사각형의 표지판) 방배로 Bangbae-ro 1 ↑ 71</td>
              <td>양 방향용 표지판 이미지 (양쪽이 부등호 모양으로 생긴 육각형의 표지판) 71 방배로 Bangbae-ro 1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="guide15" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_13.jpg" alt="chapter 1.도로명주소 영문 표기방법 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1 도로명주소 영문 표기방법</h3>
        <div>
          <p><strong><em>작은단위 → 큰단위</em> 순으로 표기, 참고항목(법정동, 공동주택명)은 주소의 간결화를 위해 표기하지 않을 수 있으나, 필요할 경우 맨 앞(상세주소 앞)에 괄호로 표기</strong></p>
          <div>
            <span>예시) </span>
            <div>
              <p>서울특별시 광진구 광나루로507길 78, 101동 102호(광장동, 신도아파트)<span>(Gwangjang-dong, Sindo APT), 101-dong 102-ho, 78, Gwangnaru-ro 507-gil, Gwangjin-gu, Seoul</span></p>
            </div>
          </div>
        </div>		
        <div>
          <h4>주요 구성요소 표기방법</h4>
          <ul>
            <li>
              <h5>행정구역명칭</h5>
              <p>국어의 로마자 표기법'에 따라 전체를 로마자로 표기하되 특별시와 광역시의 경우는 행정구역단위(-si)생략 가능</p>
              <div>
                <span>예시) </span>
                <p>서울특별시 강남구 강남대로10길 109 <span>109, Gangnam-daero 10-gil, Gangnam-gu, Seoul</span></p>
              </div>
            </li>
            <li>
              <h5>도로명</h5>
              <p>로마자로 표기하며 도로의 구분기준인 '대로, 로, 길(번길)'은 '-daero, -ro, -gil(beon-gil)'로 표기<strong>※ 필요에 따라 영어식 표기(Blvd. St. Rd. 등) 병기 가능</strong></p>
              <div>
                <span>예시) </span>
                <p>경기도 양주시 시민로5번길 18</p>
                <ol>
                  <li>18, Simin-ro 5beon-gil, Yangju-si, Gyeonggi-do</li>
                </ol>
              </div>
            </li>
            <li>
              <h5>상세주소</h5>
              <p>'동', '층', '호'는 로마자 표기를 원칙으로 한다.</p>
              <div>
                <span>예시) </span>
                <p>대구광역시 수성구 달구벌대로323번길 56, 705동 1104호</p>
                <ol>
                  <li><span>표기 예제1</span>705-dong 1104-ho, 56, Dalgubeol-daero 323beon-gil, Suseong-gu, Daegu</li>
                  <li><span>표기 예제2</span>705-1104, 56, Dalgubeol-daero 323beon-gil, Suseong-gu, Daegu</li>
                </ol>
                <p>강원특별자치도 춘천시 퇴계로77번길 42, 3층</p>
                <ol>
                  <li>3-cheung, 42, Toegye-ro 77beon-gil, Chuncheon-si, Gangwon-do</li>
                </ol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="guide16" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_14.jpg" alt="chapter 1.상세주소란? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1 상세주소란?</h3>
        <div>
          <p><strong>상세주소는 도로명주소의 건물번호 뒤에 표시되는 <em>동·층·호 정보</em>로, <em>원룸·다가구주택·단독주택 중 2가구 이상 거주주택, 일반상가, 업무용 빌딩</em>등 임대하고 있는 건물에 부과합니다.</strong></p>
          <div>
            <span>행정구역 - 서울특별시 중구</span>
            <span>도로명 건물번호 - 세종대로 1200,</span>
            <span>상세주소 - ○○○동 ○○○호</span>
          </div>
        </div>		
        <div>
          <h4>상세주소는 왜 필요한가?</h4>
          <p><strong>건물 내 정확한 위치 안내로 <em>우편물·택배 등의 전달·수취가 정확하며 응급상황 발생 시 신속한 대응</em>이 가능합니다.</strong></p>
        </div>
      </div>
    </div>

    <div id="guide17" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_15.jpg" alt="chapter 1.도로명주소 상세주소란? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 1 상세주소란?</h3>
        <div>
          <h4>누가 상세주소 부여 신청을 할 수 있나요?</h4>
          <p><strong><em>원룸·다가구주택 등의 소유자 또는 임차인</em>입니다. 임차인은 소유자가 동의하는 경우 바로 신청이 가능하고, 
          소유자에게 상세주소 부여 요청 후 <em>소유자가 신청하지 않을 경우 14일 후에 직접 신청</em>할 수 있습니다.</strong></p>
        </div>		
        <div>
          <h4>상세주소 신청방법은?</h4>
          <ul>
          <li>인터넷 접수 : 정부민원포털 민원24<em>(wwww.minwon.go.kr)</em></li>
          <li>우편 및 방문접수 : 건물의 관할 소재지 시·군·구청 도로명주소 담당<br>
          ※신청서류 : 신청서, 상세주소, 신청도면 등
          </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="guide18" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_16.jpg" alt="chapter 1.도로명주소 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>입체주소란?</h3>
        <div>
          <h4>도로명 부여 대상 도로가 지상도로에서 입체도로(고가도로, 지하도로), 내부도로(건물, 구조물, 안 통로)로 확대</h4>
          <p>
            <strong><em>입체도로</em> : 공중 또는 지하에 설치된 도로 및 통로</strong>
            <strong>고가도로 : 공중에 설치된 도로 및 통로</strong>
            <strong>지하도로 : 지하에 설치된 도로 및 통로</strong>
          </p>
          <p>
            <strong><em>내부도로</em> : 건물 또는 구조물의 내부에 설치된 도로 및 통로</strong>
            <strong>건물의 내부에 설치된 도로 및 통로</strong>
            <strong>건물이 아닌 구조물의 내부에 설치된 도로 및 통로</strong>
          </p>
        </div>
        <div>
          <h4>입체주소의 부여방법</h4>
          <ul>
            <li>1)입체도로 등의 도로명 부여</li>
            <li>도로명을 부여하는 도로를 지상도로외 입체도로(지하 고가도로), 내부도로(지하상가 통행로)까지 확대</li>
            <li>지상도로의 도로명은 현재화 같이 '대로, 로, 길'로 부여하되, 입체도로와 내부도로는 각각의 도로 유형과 장소(고가도로 / 지하철 / 지하상가 이름)를 나타내는 명칭을 포함하여 부여</li>
            <li>예시) 서울특별시 송파구 잠실역중앙통로 110</li>
            <li>2)행정구역 미결정 지역에서의 도로명주소 표기방법</li>
            <li>새만금 등 행정구역이 아직 결정되지 않은 지역에서 도로명조소를 사용할 때 "행정구역 며칭" 대신에 사업지역 명칭을 사용</li>
            <li>행정구역이 결정된 이후에는 해당 시 도와 시군구의 명칭으로 바꾸어 사용하도록 하여 주소변경에 따른 불편이 없도록 하였습니다.</li>
            <li>예시)'전북특별자치도 새만금지구 새만금중앙대로 3' > 행정구역이 결정되면 '전북특별자치도 ㅇㅇ시(군) 새만금중앙대로3'으로 전환</li>
          </ul>
        </div>
      </div>
    </div>
    <div id="guide19" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_17.jpg" alt="chapter 1.도로명주소 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>입체주소란?</h3>
        <div>
          <h4>입체도로의 도로명판의 종류</h4>
        </div>
        <div>
          <ul>
            <li>1) 한방향용</li>
            <li>2) 양방향용</li>
            <li>3) 앞쪽향용</li>
            <li>4) 예고용</li>
            <li>터널 지하도로 등 기초번호판의 구조</li>
            <li>내부도로 기초번호판의 구조</li>
            <li>건물번호판의 구조</li>
            <li>사물주소판의 구조</li>
          </ul>
        </div>
      </div>
    </div>
    <div id="guide20" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c01_18.jpg" alt="chapter 1 도로명주소 - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>입체주소란?</h3>
        <div>
          <p><strong>새로운 도로명주소법이 개정됨에 따라 재난 및 위급상황 발생 시 신속한 구조구급활동이 가능 해질뿐 아니라, 드론배송이나 자율주행 등 4차산업 핵심기술을 생활에 적용할수있는 기반이 마련될것으로 기대하고 있습니다.</strong></p>
        </div>
      </div>
    </div>
    <!-- 2 -->
    <div id="guide21" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c02_01.jpg" alt="chapter 2.상세주소란? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 2 사물주소</h3>
        <div>
          <p><strong><em>사물주소란 주소부여가 어려운 곳에 도로명과 기초번호를 이용하여 사물에 부여한 주소</em>
            안전사고 발생 시 신속 대응 지원 및 내비게이션등에 안내체계 마련을 위해 도로명과 기초번호를 이용하여 구성한 사물주소 정보를 제공</strong>
            *기초번호 : 전신주 등에 표시
          </p>
        </div>
        <div>
          <h4>사물주소 표기</h4>
          <ul>
            <li>1)시설물 (시설 및 장소, 이하'시설물')이 건물등의 밖에 있는 경우
              행정구역+도로명+사물번호+사물유형
              (예시) '서울특별시 강남구 학동로 2 비상급수시설
            </li>
            <li>
              행정구역 + 도로명 +건물번호 + , + 사물번호 + 사물유형
              예) 서울특별시 종로구 중학천길 42, 201호 무인발급기
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="guide22" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c02_02.jpg" alt="chapter 2.상세주소란? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 2 사물주소</h3>
        <div>
          <h4>사물/공간주소 정보 시설 유형</h4>
        </div>
        <div>
          <h4>1) 육고승강기</h4>
          <ul>
            <li>도로와 육교간 이동을 위하여 설치한 승강기</li>
            <li>육교승강기의 형상을 면형으로 표시</li>
            <li>승강기 출입구의 중심점</li>
          </ul>

          <h4>2) 둔치주차장</h4>
          <ul>
            <li>하천의 둔치에 설치된 노의 주차장</li>
            <li>둔치주차장의 주차면과 차장 이동이 가능한 번위를 포함한 경계를 면형으로 표시</li>
            <li>도로와 연결된 출입구의 중심정</li>
          </ul>

          <h4>3) 지진옥외 대피장소</h4>
          <ul>
            <li>긴급대피 목적으로 지진 발생 시 대피지구 내에 10분 이내에 대피 가능한 안전한 장소</li>
            <li>건물과 옹벽 담장 등의 시설을 제회한 대피장소(공터)의 경계를 면형으로 표시</li>
            <li>출입구가 있는 경우 도로와 연결된 출입구의 중심점, 출입구가 없이 개방되어진 경우 다중의 접근이 편리한 통행로의 중심점</li>
          </ul>

          <h4>4) 버스정류장</h4>
          <ul>
            <li>버스가사람을 태우서나 내려주기 위하여 머무는 일정한 장소</li>
            <li>버스정류장 안내표지 또는 승차대의 중심점을 점형으로 표시</li>
            <li>버스정류장 안내표지 또는 승차대의 중심점</li>
          </ul>

          <h4>5) 택시승강장</h4>
          <ul>
            <li>택시운송사업용 자동차가 승객을 승하차 시키거나, 태우기 위한 대기장소 또는 구역</li>
            <li>택시승강장 안내표지 또는 승차대의 중심점을 점형으로 표시</li>
            <li>택시승강장 안내표지 또는 승차대의 중심점</li>
          </ul>

          <h4>6) 졸음쉼터</h4>
          <ul>
            <li>졸음운전으로 인한 사고 예방 및 휴식 공간 제공을 위해 휴게소간 간격이 먼 구간에 설치하여 이용객에게 휴식공간을 제공하는 장소</li>
            <li>졸음쉼터로 사용되는 주차장 시설 및 가속 감속 차선을 포함하여 면형으로 표시</li>
            <li>도로의 실폭에서 졸음쉼터의 가속 감속차선이 시작되는 지점</li>
          </ul>

          <h4>7) 지진해일긴급대피장소</h4>
          <ul>
            <li>긴급(임시) 피난을 목적으로 지진해일 발생 시 10분 이내에 대피가 가능한 안전한 장소</li>
            <li>대피장소로 운동장, 주차장, 건물옥상, 도로위 등의 경계를 면형으로 표시</li>
            <li>출입구가 있는 경우 도로와 연결된 출입구의 중심점, 출입구가 없이 개방되어 있는 경우 다중의 접근이 편리한 통행로의 중심점</li>
          </ul>

          <h4>8) 소공원</h4>
          <ul>
            <li>소규모 토지를 이용하여 도시민의 휴식 및 정서 함양을 위하여 설치하는 공원</li>
            <li>운동 및 놀이시설, 휴게시설 등 부대시설을 포함한 공원 경계를 면형으로 표시</li>
            <li>출입구가 있는 경우 도로와 연결된 출입구의 중심점, 출입구가 없이 개발된 경우 다중의 접근이 편리한 통행로의 중심점</li>
          </ul>
        </div>
      </div>
    </div>
    <div id="guide23" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c02_03.jpg" alt="chapter 2.상세주소란? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 2 사물주소</h3>
        <div>
          <h4>사물/공간주소 정보 시설 유형</h4>
        </div>
        <div>
          <h4>9) 어린이공원</h4>
          <ul>
            <li>어린이의 보건 및 정서생활의 향상에 이바지하기 위하여 설치하는 공원</li>
            <li>운동 및 놀이시설, 휴게시설 등 부대시설을 모두 포함한 공원 경계를 면형으로 표시</li>
            <li>출입구가 있는 경우 도로와 연결된 출입구의 중심점, 출입구가 없이 개방되어 있는 경우 다중의 접근이 편리한 통행로의 중심점</li>
          </ul>

          <h4>10) 비상급수시설</h4>
          <ul>
            <li>전쟁 혹은 지진, 풍수해 등의 자연재해로 국가적 비상재난이 발생하였을 때, 상수도의 파괴와 오염에 대비하여 식수, 생활용수의 확보를 위해 마련된 시설</li>
            <li>비상급수시설의 중심점을 점형으로 표시</li>
            <li>비상급수시설의 중심점</li>
          </ul>

          <h4>11) 인명구조함</h4>
          <ul>
            <li>인명을 구조하기 위해 필요한 장비를 보관하는 시설이나 장치</li>
            <li>인명구조함의 중심점을 점형으로 표시</li>
            <li>인명구조함의 중심점</li>
          </ul>

          <h4>12) 드론배달점</h4>
          <ul>
            <li>물품을 적재하여 드론이 이륙하고, 배달을 위해 착륙 후 물푸믈 인출할 수 있는 주소기반 이착륙 지점</li>
            <li>드론배달점 설치 지점을 점형으로 표시</li>
            <li>드론배달점 설치 지점</li>
          </ul>

          <h4>13)주차장</h4>
          <ul>
            <li>도로의 노면 또는 노면외의 일정한 구역에 설치된 주차장</li>
            <li>노상주차장의 주차면과 주차장 경계를 면형으로 표시</li>
            <li>출입구가 있는 경우, 도로와 연결된 출입구의 중심점 또는 출입구가 없는 경우 차량이 진입하는 방향의 첫 번째 주차면 경계의 중심점</li>
          </ul>

          <h4>14)전기차충전소</h4>
          <ul>
            <li>전기르 연료로 사용하는 자동차에 전기를 충전하기 위한 장소</li>
            <li>전기차 충전시설과 주차면을 포함한 경계를 면형으로 표시</li>
            <li>차량이 진입하는 방향의 충전소 경계의 중심점</li>
          </ul>

          <h4>15)공중전화</h4>
          <ul>
            <li>일반인이 누구나 이용할 수 있도록 공공장소에 설치된 전화기</li>
            <li>공중전화 또는 각 공중전화부스의 중심점을 점형으로 표시</li>
            <li>공중전화 또는 각 공중전화부스의 중심점</li>
          </ul>

          <h4>16)우체통</h4>
          <ul>
            <li>편지나 우편물을 수령하고 보관하는 장치</li>
            <li>우체통의 중심점을 점형으로 표시</li>
            <li>우체통의 중심점</li>
          </ul>
        </div>
      </div>
    </div>
    <div id="guide24" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c02_04.jpg" alt="chapter 2.상세주소란? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 2 사물주소</h3>
        <div>
          <h4>사물/공간주소 정보 시설 유형</h4>
        </div>
        <div>
          <h4>16)우체통</h4>
          <ul>
            <li>편지나 우편물을 수령하고 보관하는 장치</li>
            <li>우체통의 중심점을 점형으로 표시</li>
            <li>우체통의 중심점</li>
          </ul>

          <h4>17)전동휠체어 급속 충전기</h4>
          <ul>
            <li>노인 및 장애인의 편의를 위해 전동휠체어 및 전동스쿠터를 충전할 수 있도록 설치된 장치</li>
            <li>전동휠체어 급속충전기의 중심점을 점형으로 표시</li>
            <li>전동휠체어 급속 충전기의 중심점</li>
          </ul>

          <h4>18)자전거거치대</h4>
          <ul>
            <li>자전거의 주차, 보관 등을 위해 자전거를 지탱할 수 있도록 공공장소에 설치한 장치</li>
            <li>자전거거치대에 해당하는 경계를 면형으로 표시</li>
            <li>자전거거치대 형상의 경계선 중 도로와 가장 인접한 경계선의 중심점</li>
          </ul>

          <h4>19)비상소화장치</h4>
          <ul>
            <li>소방호스 등을 소방용수시설에 연결하여 화재를 진압하는 시설이나 장치</li>
            <li>비상소화장치의 중심점을 점형으로 표시</li>
            <li>비상소화장치의 중심점</li>
          </ul>

          <h4>20)무더위쉼터</h4>
          <ul>
            <li>더위를 피해 쉴 수 있도록 공공시설,광장,공원 등에 설치 또는 지정한 시설물 및 장소</li>
            <li>무더위쉼터 시설물 및 장소의 중심점을 점형으로 표시</li>
            <li>무더위쉼터 시설물 및 장소의 중심점</li>
          </ul>

          <h4>21)민방위 대피시설</h4>
          <ul>
            <li>민방위사태 발생이 주민의 생명과 재산을 보호하기 위해 지정된 시설</li>
            <li>민방위 대피시설 출입구의 중심을 점형으로 표시</li>
            <li>민방위 대피시설 출입구의 중심점</li>
          </ul>

          <h4>22)어린이 놀이시설</h4>
          <ul>
            <li>어린이 놀이가구가 설치된 실외의 놀이터</li>
            <li>어린이 놀이시설에 해당하는 경계를 면형으로 표시</li>
            <li>출입구가 있는 경우 도로와 연결된 출입구의 중심점 또는 출입구가 없이 개방되어 있는 경우 다중의 접근이 편리한 통행로의 중심점</li>
          </ul>

          <h4>23)음식판매 자동차 허가구역</h4>
          <ul>
            <li>음식판매 자동차(푸드트럭) 영업이 가능하도록 지방자치 단계에서 조례로 정한 구역</li>
            <li>음식판매 자동차(푸드트럭) 영업장소 구획면이 표시된 경계를 면형으로 표시 *구획면이 없는 경우 영업중인 푸드트럭을 모두 포함하는 경계를 면형으로 표시</li>
            <li>출입구가 있는 경우 도로와 연결된 출입구의 중심점 또는 출입구가 없이 개방되어 있는 경우 다중의 접근이 편리한 통핼로의 중심점</li>
          </ul>
        </div>
      </div>
    </div>
    <div id="guide25" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c02_05.jpg" alt="chapter 2.상세주소란? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 2 사물주소</h3>
        <div>
          <h4>사물주소 사용 예시 ) 시설물과 공간에 사용되고 있습니다.</h4>
          <p>
            사물주소 12종
            1) 육고승강기(사진)
            2) 둔치주차장(사진)
            3) 지진옥외 대피장소(사진)
            4) 버스정류장(사진)
            5) 택시승강장(사진)
            6) 졸음쉼터(사진)
            7) 지진해일긴급대피장소(사진)
            8) 소공원(사진)
            9) 어린이공원(사진)
            10) 비상급수시설(사진)
            11) 인명구조함(사진)
            12) 드론배달점(사진)
            13)주차장
            14)전기차충전소
            15)공중전화
            16)우체통
            17)전동휠체어 급속충전기
            18)자전거거치대
            19)비상소화장치
            20)무더위쉼터
            21)민방위 대피시설
            22)어린이 놀이시설
            23)음식판매 자동차 허가구역
          </p>
        </div>
        <div>
          <h4>상세주소 신청방법은?</h4>
          <ul>
            <li>인터넷 접수 : 정부민원포털 민원24<em>(wwww.minwon.go.kr)</em></li>
            <li>우편 및 방문접수 : 건물의 관할 소재지 시·군·구청 도로명주소 담당<br>
              ※신청서류 : 신청서, 상세주소, 신청도면 등
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 2 -->
    <!-- 4 -->
    <div id="guide26" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c03_01.jpg" alt="chapter 3. 장소지능? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 4 장소지능?</h3>
        <h4>장소지능 출입구정보란?</h4>
        <p>기존 건물의 주 출입구의 정보제공에서 다양한 이동체별(교통약자,로봇 등) 맞춤형 출입구 정보제공을 위한 출입구 정보제공 확대(출입구 유형 및 구분, 진입로 형태)</p>
        <div>
          종전(건물 주 출입구) > 개선 - 건물 주 출입구,출입구유형(보행,차량,혼용) - 출입구 구분(주/보조, 동 출입구, 주차장 출입구) - 진입로 형태 (수평,경사,계단,엘리베이터) 등
        </div>
        <h4>출입구 정보 구축 예시</h4>
        <div>
          건물군(보조출입구) - 차량출입구,
          건물군(주출입구) - 차량출입구,
          건물군(보조출입구) - 보행출입구,
          건물군(주출입구) - 보행출입구,
        </div>
      </div>
    </div>
    <!-- 4-->
    <!-- 5-->
    <div id="guide27" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c04_01.jpg" alt="chapter 4.수상시설물 ? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 5 수상시설물?</h3>
        <h4>수상시설물 주소부여란?</h4>
        <p>기존 지상에 위치한 건물에만 부여하던 도로명 주소를 해상펜션, 양식장 등 수상(해상)에 위치한 시설물까지 확대부여</p>
        <h4>수상시설물 주소부여 방법</h4>
        <p>육지와의 접합 여부에 따라 국문: '수상', 영문'W'로 표기하며 시설물의 형태(건물/시설물)등에 따라 도로명주소, 사물주소, 국가지점번호로 부여</p>
        <div>
          해상낚시터 임대업장,
          해상굴판매장,
          바다공중화장실,
          해상펜션(콘도),
          죽방렴,
          양식장
        </div>
        <p>예)경상남도 통영시 학람1길 수상 11-32(W11-32 Hangnim 1-gil, Togueong-si, Gyeongsangnam-do )</p>
      </div>
    </div>
    <!-- 5-->
    <!-- 6-->
    <div id="guide28" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c05_01.jpg" alt="chapter 5.국가지점번호? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 9 국가지점번호</h3>
        <div>
          <h4>국가지점번호의 의미</h4>
          <ul>
            <li>기후 변화로 인한 대형 산불, 태풍과 같은 재난안전사고에 신송하게 대응 할 수 있다</li>
            <li>논,밭,산악지역 등에서 벌어지는 범죄대처 및 응급 구조용으로 활용된다</li>
          </ul>

          <h4>국가지점번호 표기</h4>
          <ul>
            <li>산악 등에는 국가지점번호를 사용하여 모든 공간을 주소로 표시</li>
            <li>한글 2글자 + 숫자 8자리 예시)라마 2120 0425</li>
          </ul>

          <h4>국가지점번호 예시</h4>
          <ul>
            <li>1) 산악지대(사진)</li>
            <li>2) 해안가 위험지대(사진)</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 6-->
    <!-- 7-->
    <div id="guide29" class="off">
      <div class="book"><div class="inner"><img src="@images/introduction/guidebook/GuideBook_c06_01.jpg" alt="chapter 6.국가기초구역? - 자세한 내용은 본문 내용을 참고하세요."></div></div>
      <div class="accessibility">
        <h1>도로명주소 안내시스템</h1>
        <h2>도로명주소 소개</h2>
        <h3>chapter 7 국가기초구역이란?</h3>
        <h4>국가기초구역이란?</h4>
        <p>각종 관할구역(통계, 우편, 소방, 경찰 등)을 관리하기 위해 나눈 도로명주소를 기반으로 국토를 읍 면 동의 면적보다 작게 일정한 경계를 정하며 나눈 구역</p>
        <h4>구역번호란?</h4>
        <p>국가기초구역마다 부여한 번호로 5자리 숫자로 구성 앞 2자리*시 도 구분) 끝 3자리 시 군 구 내 일련번호 국가기초구역번호는 우편번호로 사용</p>
        <div>서울 01-09,경기 10-20,인천 21-23,강원 24-26, 충북 27-29 ,세종30,충남31-33,대전34-35,경북36-40,대구41-43,울산44-45,부산46-49,경남50-53,전북54-56,전남57-60,광주61-62, 제주 63</div>
      </div>
    </div>
    <!-- 7-->
    <div class="footer">
      <div class="inner">
        <p class="copy">Copyright &copy; Ministry of the Interior and Safety. All Rights reserved.</p>
        <div class="links">
          <a class="pdf" href="/dn.do?fileName=GuideBook_kor.pdf&amp;realFileName=GuideBook_kor.pdf&amp;regYmd=2024" title="가이드북 다운로드">PDF 파일 다운로드</a>
          <a class="eng" href="/CommonPageLink.do?link=/eng/about/GuideBook" title="가이드북 영문보기">English</a>
        </div>
        <div class="nav">
          <p class="current">
            <span>29</span>
            <span class="hidden">페이지 중</span>
            <strong id="curPage">{{ pageIdx.toString().padStart(2, '0') }}</strong>
            <span class="hidden">페이지</span>
          </p>
          <a class="go list" @click="() => goToPage(2)" title="목차 페이지로 이동">목차 페이지</a>
          <a class="go first" @click="() => goToPage(1)" title="첫 페이지로 이동">첫 페이지</a>
          <a class="go prev" @click="prevPage" title="이전 페이지로 이동">이전 페이지</a>
          <a class="go next" @click="nextPage" title="다음 페이지로 이동">다음 페이지</a>
          <a class="go end" @click="() => goToPage(29)" title="마지막 페이지로 이동">마지막 페이지</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/** 가이드북 **/
.off {display:none}
[id*="guide"]{width: 100%;height: 100%}
[id*="engGuide"]{width: 100%;height: 100%}

/* 도로명주소 소개 - 도로명주소란? */
.section-book {position:absolute; left:0; top:0; right:0; bottom:60px; border-top:5px solid #186bb9; overflow:auto}
.section-book .book {padding:55px 60px 0;background: #fff;}
.section-book .book .inner {max-width:1310px; min-width:1000px; margin:0 auto}
.section-book .book .inner img {display:block; width:100%}
.section-book .accessibility {position:absolute; top:-9999px; left:-9999px; width:1px; height:1px;}
.section-book .footer {position:fixed; left:0; right:0; bottom:0; background:#000;font-size: 13px;}
.section-book .footer .inner {padding:15px 60px}
.section-book .footer .inner:after {content:""; display:block; clear:both}
.section-book .footer .inner .copy {float:left; color:#c3c3c3; height:30px; line-height:30px}
.section-book .footer .inner .nav {float:right; height:30px; position:relative; padding:0 74px 0 100px}
.section-book .footer .inner .nav .go {position:absolute; top:50%; margin-top:-15px; width:30px; height:30px; text-indent:-9999px}
.section-book .footer .inner .nav .prev {left:60px; background:url(@images/introduction/guidebook/btn-book-prev.gif)}
.section-book .footer .inner .nav .prev:hover,
.section-book .footer .inner .nav .prev:focus {background:url(@images/introduction/guidebook/btn-book-prev-active.gif)}
.section-book .footer .inner .nav .next {right:30px; background:url(@images/introduction/guidebook/btn-book-next.gif)}
.section-book .footer .inner .nav .next:hover,
.section-book .footer .inner .nav .next:focus {background:url(@images/introduction/guidebook/btn-book-next-active.gif)}
.section-book .footer .inner .nav .list {left:0; background:url(@images/introduction/guidebook/btn-book-list.gif)}
.section-book .footer .inner .nav .list:hover,
.section-book .footer .inner .nav .list:focus {background:url(@images/introduction/guidebook/btn-book-list-active.gif)}
.section-book .footer .inner .nav .first {left:30px; background:url(@images/introduction/guidebook/btn-book-first.gif)}
.section-book .footer .inner .nav .first:hover,
.section-book .footer .inner .nav .first:focus {background:url(@images/introduction/guidebook/btn-book-first-active.gif)}
.section-book .footer .inner .nav .end {right:0; background:url(@images/introduction/guidebook/btn-book-end.gif)}
.section-book .footer .inner .nav .end:hover,
.section-book .footer .inner .nav .end:focus {background:url(@images/introduction/guidebook/btn-book-end-active.gif)}
.section-book .footer .inner .nav .current {overflow:hidden}
.section-book .footer .inner .nav .current:after {content:""; display:block; clear:both}
.section-book .footer .inner .nav .current {color:#747474}
.section-book .footer .inner .nav .current strong,
.section-book .footer .inner .nav .current span {height:30px; line-height:30px; font-size:20px; font-weight:bold}
.section-book .footer .inner .nav .current span {float:right}
.section-book .footer .inner .nav .current strong {float:left; position:relative; color:#fff; margin-right:12px; padding-right:16px}
.section-book .footer .inner .nav .current strong:after {content:""; position:absolute; right:0; top:50%; margin-top:-8px; height:15px; border-right:1px solid #808080}
.section-book .footer .inner .nav .current .hidden {position:absolute; left:-9999px}
.section-book .footer .inner .links {position:absolute; left:50%; top:50%; margin-top:-10px; margin-left:-110px; width:220px; text-align:center}
.section-book .footer .inner .links a {display:inline-block; height:20px; text-align:left; text-indent:-9999px}
.section-book .footer .inner .links a ~ a {margin-left:56px}
.section-book .footer .inner .links .home {width:24px; background:url(@images/introduction/guidebook/btn-home.gif) 50% 50% no-repeat}
.section-book .footer .inner .links .pdf {width:18px; background:url(@images/introduction/guidebook/btn-download-pdf.gif) 50% 50% no-repeat}
.section-book .footer .inner .links .eng {width:44px; background:url(@images/introduction/guidebook/btn-eng.gif) 50% 50% no-repeat}
.section-book .footer .inner .links .kr  {width:44px; background:url(@images/introduction/guidebook/btn-kr.gif) 50% 50% no-repeat}

/* 표지 */
.section-book.cover {border-top:none; background:#283978 url(@images/introduction/guidebook/img-guidebook0.gif) center center no-repeat}
.section-book.cover h1 {position:absolute; left:0; top:50%; width:100%; margin-top:-105px; padding:20px 0 20px 60px; font-weight:400; font-size:50px; color:#fff}
.section-book.cover h1:after {display:block; content:""; clear:both}
.section-book.cover h1 > span {float:right; height:90px; margin-right:60px; padding-right:133px; font-size:18px; line-height:90px; vertical-align:middle; background:url(@images/introduction/guidebook/logo-h1.png) right center no-repeat}
.section-book.cover h1 > span.engLogo {float:right; height:90px; margin-right:60px; padding-right:133px; font-size:18px; line-height:90px; vertical-align:middle; background:url(@images/introduction/guidebook/logo-eng-h1.png) right center no-repeat}

.section-book.cover h1 > strong {position:relative; height:90px; font-weight:400; line-height:90px; vertical-align:middle}
.section-book.cover h1 > strong:after {display:inline-block; content:""; position:absolute; bottom:-30px; left:0; width:100%; height:6px; border-radius:6px; background:#fff}
.section-book.cover h1 > strong > span {margin-left:11px; color:#fece00}
/* 차례 */
.section-book.list {height:100%; border-top:none; background:#283978}
.section-book.list ul {width:100%; height:100%}
.section-book.list ul:after {display:block; content:""; clear:both}
.section-book.list ul li {float:left; position:relative; height:100%; font-size:16px; color:#fff; vertical-align:middle; -webkit-box-sizing:border-box; -moz-box-sizing:border-box; -o-box-sizing:border-box; -ms-box-sizing:border-box; box-sizing:border-box;}
.section-book.list #guide2 ul li{width:11%;}
.section-book.list ul li ~ li {border-left:1px solid #3e4d86}
.section-book.list ul li > div {position:absolute; left:40px; top:50%; height:144px; margin-top:-132px}
.section-book.list ul li > a {position:absolute; width: 100%;height: 94%}
.section-book.list ul li strong {display: block; position: relative; padding-top: 42px; font-weight: 400; font-size: 26px;line-height: 26px;}
.section-book.list ul li strong:after {display: inline-block;  content: "";   position: absolute;   top: 16px; left: 0; width: 30px; height: 4px; border-radius: 4px; background: #fff;}

.section-book.list ul li strong > span {display:block; padding-top:7px}

.section-book.list #engGuide2 ul li{width:20%;}

/*페이지 내 이동버튼*/
.section-book .content.prev{position: absolute; left: 0;width: 10%;height: 100%; text-indent:-9999px; background: url(@images/introduction/guidebook/btn-book-left.gif) 50% 50% no-repeat;display: none}
.section-book .content.next{position: absolute; right:0;width: 10%;height: 100%; text-indent:-9999px; background: url(@images/introduction/guidebook/btn-book-right.gif) 50% 50% no-repeat;display: none}
.section-book .content.prev:hover, .section-book .content.prev:focus{background-color: #F0F0F0}
.section-book .content.next:hover, .section-book .content.next:focus{background-color: #F0F0F0}


/* 도로명주소 소개 - 아름다운길 소개 */
.section-book.design { border-top: 5px solid #186bb9; background: #F4EFDD; }
.section-book.main .content.next:hover, .section-book.mian .content.next:focus{background-color: #F4EFDD}
.section-book.design .book { padding: 0px; vertical-align: middle; display: table-cell; text-align: center; vertical-align: middle; }
.section-book.design .off {display:none !important;}
.section-book.design .book .inner > table img { display: block; width: auto; }
.section-book.design .book .inner-out { max-width: 1564px; min-width: 1000px; margin: 0 auto; border: 5px solid #ddd; padding: 1px; background:#fff; }
.section-book.design .book .inner { max-width: 1564px; min-width: 1000px; margin: 1px;}  

/* .section-book.design .content.next { position: absolute; right: 0; top:0; width: 8%; height: 100%; text-indent: -9999px; background: url(@images/introduction/guidebook/btn-book-right.gif) 50% 50% no-repeat; display: none; }
.section-book.design .content.prev { position: absolute;  left: 0; top:0; width: 8%; height: 100%; text-indent: -9999px; background: url(@images/introduction/guidebook/btn-book-left.gif) 50% 50% no-repeat; display: none; } */

.section-book.design .footer .inner .pdf{display: inline-block;margin-left:2%; width: 92px; text-align: center;height: 30px;line-height: 29px; color: #c3c3c3; border: 1px solid #c3c3c3;}
.section-book.design .footer .inner .txtDn{display: inline-block;  width: 125px; text-align: center;height: 30px;line-height: 29px; color: #c3c3c3; border: 1px solid #c3c3c3;}

.section-book.design .inPageList {position: relative;display: block;width: 100%;}
/* .section-book.design .inPageList .btn{ height: 34px; display: block;position: absolute;width: 65px;right: 0; background: url(@images/introduction/guidebook/design/2017/icon-home-blue.png) 0% 50% no-repeat; margin: 5px 15px 5px 5px;z-index: 9999; line-height: 35px; font-size: 16px;color: #1266a8;text-indent: 13px } */

.pageTotal{width: 29%;display: block;float: left;height: 100%;min-width: 423px;}
.pageTitle{width: 100%;margin-top: 22%;height: 110px;}
.pageTitle a{width:422px; height: 110px;display: inline-block;}
.pageList {margin-top: 20px;}
.pageList li{padding-top: 27px;}
.pageList a{width:313px; height: 45px;display: inline-block;margin-left: 85px;}
.blind {display:block;margin:0;position: absolute;z-index:-1;width:1px;height:1px;font-size: 1px;line-height: 1px;color:transparent;border:none;padding:0;overflow:hidden;opacity: 0;filter: alpha(opacity=0);background:none;}

.guideChapter__wrap {
    width: 100%;
    height: 100%;
    /* background:#f2f5fa url("@images/new_guide/img-bg.png") no-repeat left 0 bottom -94px; */
}
.guideChapter__list {
    display: flex;
    padding:120px 20px 0;
}
.guideChapter__box {
    width: 16%;
    border:none;
    flex:1;
    height: 450px;
    height: 450px;
    padding:0 12px;
}
.guideChapter__link {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 450px;
    border-radius: 20px;
    border:1px solid #d9dce2;
    background-color: #fff;
    background-position: left 50% bottom 51px;
    background-repeat: no-repeat;
}

/* .guideChapter__link.type01 {
    background-image: url("@images/new_guide/ic-newmenu-01-1.png");
}
.guideChapter__link.type02 {
    background-image: url("@images/new_guide/ic-newmenu-01-2.png");
}
.guideChapter__link.type03 {
    background-image: url("@images/new_guide/ic-newmenu-01-3.png");
}
.guideChapter__link.type04 {
    background-image: url("@images/new_guide/ic-newmenu-01-4.png");
}
.guideChapter__link.type05 {
    background-image: url("@images/new_guide/ic-newmenu-01-5.png");
}
.guideChapter__link.type06 {
    background-image: url("@images/new_guide/ic-newmenu-01-6.png");
}
.guideChapter__link.type07 {
    background-image: url("@images/new_guide/ic-newmenu-01-7.png");
} */
.guideChapter__title {
    margin-top:50px;
    width: 100%;
    color:#656565;
    font-size:20px;
    font-weight: 500;
    text-align: center;
}
.guideChapter__text {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top:114px;
    width: 100%;
    color:#111;
    font-size:30px;
    font-weight: 500;
    gap:13px;
}
.guideChapter__link i,
.guideNav__link i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    background: #f1f2f3;
    color:#000;
    font-size:18px;
}
@media (max-width: 1550px) {
    .guideChapter__text {
        font-size:26px;
    }
}
@media (max-width: 1440px) {
    .guideChapter__title {
        font-size:20px;
    }
    .guideChapter__text {
        font-size:20px;
        gap:3px;
    }
    .guideChapter__link i,
    .guideNav__link i { 
        width:24px;
        height:24px;
        min-width: 24px;
        font-size:12px;
    }
}

@media (max-width: 1200px) {
    .guideChapter__title {
        font-size:14px;
    }
    .guideChapter__text {
        font-size:14px;
    }
}










.guideChapter__link:hover,
.guideChapter__link:focus {
    border-color:#325ee6;
}
.guideChapter__link:hover .guideChapter__text,
.guideChapter__link:focus .guideChapter__text {
    font-weight: 700;
}
.guideChapter__link:hover .guideChapter__text i,
.guideChapter__link:focus .guideChapter__text i {
    background-image: linear-gradient(to top, #2b6ae5, #5a5de8);
    color:#fff;
}


.guideNav__wrap {
    display:none;
    position: fixed;
    top:0;
    left:0;
    right:0;
    height: 82px;
    padding:11px 35px;
    background: #112560;
}
.guideNav__list {
    display: flex;
    gap:18px;
}
.guideNav__link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex:1;
    height: 60px;
    padding:0 12px 0 48px;
    border-radius: 12px;
    background-color: #fff;
    background-repeat: no-repeat;
}
.guideNav__link.active {
    background-color: #00aaff;
}
.guideNav__link.active .guideNav__text {
    color:#fff;
}
.guideNav__link.active .guideNav__number {
    color:#fff;
}
/* .guideNav__link.type01 {
    background-image: url("@images/new_guide/ic-newmenu-01-01.png");
    background-position: 16px 50%;
}
.guideNav__link.type02 {
    background-image: url("@images/new_guide/ic-newmenu-01-02.png");
    background-position: 16px 50%;
}
.guideNav__link.type03 {
    background-image: url("@images/new_guide/ic-newmenu-01-03.png");
    background-position: 16px 50%;
}
.guideNav__link.type04 {
    background-image: url("@images/new_guide/ic-newmenu-01-04.png");
    background-position: 16px 50%;
}
.guideNav__link.type05 {
    background-image: url("@images/new_guide/ic-newmenu-01-05.png");
    background-position: 16px 50%;
}
.guideNav__link.type06 {
    background-image: url("@images/new_guide/ic-newmenu-01-06.png");
    background-position: 16px 50%;
}

.guideNav__link.type07 {
    background-image: url("@images/new_guide/ic-newmenu-01-07.png");
    background-position: 16px 50%;
} */



.guideNav__text {
    color:#111;
    font-size:20px;
    font-weight: 500;
}
.guideNav__number {
    margin-left:0;
    color:#656565;
    font-size:18px;
    font-weight: 500;
}
.section-book1 {top:82px;}
.section-book1 .guideNav__wrap {
    display:block;
}

.section-book .content.next {
    width: 70px;
    height: 70px;
    right:118px;
    top:50%;
    border-radius: 50%;
    background: #f0f0f0;
    text-indent: initial;
}
.section-book .content.next:hover {
    background-image: linear-gradient(to top, #2b6ae5, #5a5de8);
    color:#fff;
}
.section-book .content.next i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height:100%;
    font-size:26px;
}

.section-book .content.prev {
    width: 70px;
    height: 70px;
    left:118px;
    top:50%;
    border-radius: 50%;
    background: #f0f0f0;
    text-indent: initial;
}
.section-book .content.prev:hover {
    background-image: linear-gradient(to top, #2b6ae5, #5a5de8);
    color:#fff;
}
.section-book .content.prev i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height:100%;
    font-size:26px;
}

@media (max-width: 1750px) {
    .guideNav__text {
        font-size:18px;
    }
}
@media (max-width: 1540px) {
    .section-book .content.prev {
        left:18px;
    }
    .section-book .content.next {
        right:18px;
    }
    .guideNav__link {
        padding:0 12px;
        background: #fff !important;
    }
    .guideNav__link.active {
        background: #00aaff !important;
    }
}
@media (max-width: 1300px) {
    .guideNav__link {justify-content: center;}
    .guideNav__link i {display: none;}
}
@media (max-width: 1100px) {
    .section-book .content.prev {
        left:0;
    }
    .section-book .content.next {
        right:0;
    }
    .guideNav__text {font-size:14px;}
    .guideNav__number {font-size:14px;}
}
@media (max-width: 970px) {
    .guideNav__text {font-size:12px;}
    .guideNav__number {font-size:12px;}
}
@media (max-width: 640px) {
    .guideNav__text {
        display: none;
    }
    .guideNav__link {
        background-color: #fff  !important;;
        background-repeat: no-repeat  !important;;
    }
    .guideNav__link.active {
        background-color: #00aaff  !important;;
        background-repeat: no-repeat  !important;;
    }
    /* .guideNav__link.type01 {
        background-image: url("@images/new_guide/ic-newmenu-01-01.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type02 {
        background-image: url("@images/new_guide/ic-newmenu-01-02.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type03 {
        background-image: url("@images/new_guide/ic-newmenu-01-03.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type04 {
        background-image: url("@images/new_guide/ic-newmenu-01-04.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type05 {
        background-image: url("@images/new_guide/ic-newmenu-01-05.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type06 {
        background-image: url("@images/new_guide/ic-newmenu-01-06.png") !important;;
        background-position: 50% !important;;
    }
    
    .guideNav__link.type07 {
        background-image: url("@images/new_guide/ic-newmenu-01-07.png") !important;;
        background-position: 50% !important;;
    } */
}
</style>

