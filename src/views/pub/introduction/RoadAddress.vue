<template>
  <CommonBreadcrumb />
  <HeaderTitle title="도로명주소 소개" ref="titleRef" />
  <!-- krds-in-page-navigation-type -->

  <!-- In page navigation -->
  <div
    class="krds-in-page-navigation-area"
    ref="navRef"
    :style="isStuck ? 'top: 1rem;' : ''"
  >
    <div class="in-page-navigation-header">
      <p class="quick-caption">이 페이지의 구성</p>
      <p class="quick-title">도로명주소 소개</p>
    </div>
    <nav class="in-page-navigation-list">
      <ul>
        <li
          v-for="item in navItems"
          :key="item.id"
          :class="{ active: activeSection === item.id }"
        >
          <a href="#" @click.prevent="scrollTo(item.id)" v-html="item.label" />
        </li>
      </ul>
    </nav>
  </div>
  <!-- //In page navigation -->
  <!-- //krds-in-page-navigation-type -->

  <div class="introduction-section" id="section_01">
  <div class="introduction-title-container">
    <div class="info-box">
      <h2 class="title">도로명주소란?</h2>

      <div class="desc">
        "도로명주소”란 부여된 도로명, 기초번호, 건물번호, 상세주소에 의하여
        건물의 주소를 <br />
        표기하는 방식으로, 도로에는 도로명을 부여하고, 건물에는 도로에 따라
        규칙적으로 <br />
        건물번호를 부여하여 도로명과 건물번호 및 상세주소(동 · 층 · 호)로
        표기하는 주소제도입니다.
      </div>

      <div class="road-address-intro">
        <div class="item" v-for="item in roadIntroList" :key="item.title">
          <strong>{{ item.title }}</strong>
          <ul>
            <li v-for="list in item.list" :key="list.title">
              {{ list.title }}
            </li>
          </ul>
          <div class="image-box">
            <img :src="item.image" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  <IntroductionSection title="지번과 도로명주소 비교" id="section_02">
    <div class="road-address-compare">
      <div class="item">
        <strong>지번 주소</strong>
        <div class="compare-table">
          <div class="lables">구성</div>
          <div class="values">
            <span>동, 리+지번 </span>
            <i class="arrow"></i>
            <span>토지중심</span>
          </div>
        </div>
        <div class="compare-table">
          <div class="lables">주된 용도</div>
          <div class="values">
            <span>토지관리 (토지번호)</span>
            <i class="arrow"></i>
            <span>토지 표시 (재산권보호)</span>
          </div>
        </div>
      </div>
      <div class="item v2">
        <strong>도로명주소</strong>
        <div class="compare-table">
          <div class="lables">구성</div>
          <div class="values">
            <span>도로명+건물번호</span>
            <i class="arrow"></i>
            <span>건물중심</span>
          </div>
        </div>
        <div class="compare-table">
          <div class="lables">주된 용도</div>
          <div class="values">
            <span>위치이동 (건물번호)</span>
            <i class="arrow"></i>
            <span>주소 표시 (위치안내)</span>
          </div>
        </div>
      </div>
    </div>
  </IntroductionSection>
  <IntroductionSection
    title="주소 표기방법"
    description="도로명주소,  이렇게 씁니다."
    id="section_03"
  >
    <div class="road-address-examples">
      <div class="address-converter">
        <div class="address-converter-1">
          <div class="l">
            <div class="round">지번 주소</div>
            <div class="sample-value">시/도 시/군/구 읍/면</div>
            <div class="sample-value">동 / 리 지번</div>
            <div class="sample-value">공동주택명 동 / 층 / 호</div>
          </div>
          <div class="r">
            <div class="round">도로명 주소</div>
            <div class="sample-value"><span>동일</span>지번과 동일</div>
            <div class="sample-value"><span>변경</span>도로명 건물번호</div>
            <div class="sample-value"><span>유사</span>동 / 층 / 호</div>
          </div>
        </div>
        <div class="address-converter-2">
          <div>+ 법정동, 공동주택명</div>
          <ul class="round-list">
            <li>
              시/도 + 시/군/구 + 읍/면 + 도로명 + 건물번호 + 상세주소(동/층/호)
              + (참고항목)
            </li>
            <li>참고항목 = 법정동, 공동주택 명칭</li>
          </ul>
        </div>
      </div>
      <div class="address-converter-example">
        <div class="item">
          <div class="sign-item">단독주택</div>
          <div class="address-item">
            서울특별시 서초구<br />
            <span>반포대로23길 6 (서초동)</span>
          </div>
        </div>
        <div class="item">
          <div class="sign-item">업무용빌딩</div>
          <div class="address-item">
            서울특별시 종로구 <span>세종대로 209,</span>
            1403호 (세종로)
          </div>
        </div>
        <div class="item">
          <div class="sign-item">공동주택</div>
          <div class="address-item">
            서울특별시 영등포구 <span>여의나루로 5,</span>
            505동 1402호 (여의도동, 여의도아파트)
          </div>
        </div>
      </div>
    </div>

    <div class="road-address-rules">
      <div class="rule-card">
        <h4>
          <div>도로명은 <em>붙여</em> 씁니다</div>
        </h4>
        <div class="rule-examples">
          <div class="correct">
            <span class="label">O</span>
            <span class="text text1">국회대로62길</span>
          </div>
          <div class="incorrect">
            <span class="label">X</span>
            <span class="text">국회대로 62길</span>
          </div>
        </div>
      </div>
      <div class="rule-card">
        <h4>
          도로명과 건물번호 사이는
          <div><em>띄어</em> 씁니다</div>
        </h4>
        <div class="rule-examples">
          <div class="correct">
            <span class="label">O</span>
            <span class="text text2">국회대로62길 9</span>
          </div>
          <div class="incorrect">
            <span class="label">X</span>
            <span class="text">국회대로62길9</span>
          </div>
        </div>
      </div>
      <div class="rule-card">
        <h4>
          건물번호와 동/층/호 사이에는
          <div><em>쉼표(,)</em>를 사용합니다</div>
        </h4>
        <div class="rule-examples">
          <div class="correct">
            <span class="label">O</span>
            <span class="text">삭주로 89, 201동 101호</span>
          </div>
          <div class="incorrect">
            <span class="label">X</span>
            <span class="text">삭주로 89 201동 101호</span>
          </div>
        </div>
      </div>
    </div>
  </IntroductionSection>
  <IntroductionSection
    title="도로명주소 부여방법"
    description="도로명과 건물번호,  이렇게 이루어졌습니다."
    id="section_04"
  >
    <div class="road-grant-method">
      <div class="lg">
        <img src="@images/introduction/road/grant-1.png" alt="" />
      </div>
      <div class="sm-list">
        <div class="item">
          <strong>도로명은?</strong>
          <p>
            도로구간마다 부여한 이름으로, 주된 명사에<br />
            도로별 구분기준인 <b>대로, 로, 길</b>을 붙여서 부여
          </p>
        </div>
        <div class="item">
          <strong>건물번호는?</strong>
          <p>
            도로시작점에서 20m 간격으로 왼쪽은 홀수,<br />
            오른쪽은 짝수를 부여
          </p>
        </div>
        <div class="item">
          <strong>도로구간 설정</strong>
          <p>직진성 ·연속성을 고려, <br />서 → 동 , 남 → 북 방향으로 설정</p>
        </div>
        <div class="item">
          <strong>건물번호 부여</strong>
          <p>
            주된 출입구에 인접한 도로의 기초번호 사용 원칙<br />
            (건물번호 부여 대상은 생활의 근거가 되는 건물)
          </p>
        </div>
      </div>
    </div>

    <div class="road-grant-info">
      <div class="figure">
        <div class="img">
          <img src="@images/introduction/road/info-1.png" alt="" />
        </div>
        <div class="caption">
          <ol>
            <li data-i="1">
              현위치는 ‘중앙로’의 도로 시작지점 ‘1’부터 (→)방향으로 ‘중앙로
              359’까지 도로명주소가 부여되어 있음
            </li>
            <li data-i="2">
              현위치는 ‘대한대로’의 중간지점 ‘10’부터 (↑)방향으로 ‘대한대로
              600’까지 있음
            </li>
            <li data-i="3">
              교차로에 설치되며 왼쪽(←)은 ‘7’이하 오른쪽은 ‘9’이상의 건물들이
              있음
            </li>
            <li data-i="4">‘중앙로’를 기점으로 왼쪽은 홀수, 오른쪽은 짝수</li>
          </ol>
          <ol>
            <li data-i="5">대로 : 8차로 이상</li>
            <li data-i="6">로 : 2차로에서 7차로까지</li>
            <li data-i="7">길 : ‘로’보다 좁은 도로</li>
            <li data-i="8">건물사이 간격은 약 20m</li>
          </ol>
        </div>
      </div>
    </div>

    <IntroductionSection2 title="도로명주소 부여방법">
      <div class="grid-col-2">
        <div class="box-col">
          <div class="subject"><em>일련번호</em> 부여방식</div>
          <div class="img">
            <img src="@images/introduction/road/info-2.png" alt="" />
          </div>
          <div class="caption">
            <div>대로/로의 도로명+<em>일련번호</em>+길</div>
            <p>
              ‘대로/로’에서 분기되는 ‘길’에 분기되는 지점의 일련번호를 이용하여
              <br />도로명 부여
            </p>
          </div>
        </div>
        <div class="box-col">
          <div class="subject"><em>기초번호 </em> 부여방식</div>
          <div class="img">
            <img src="@images/introduction/road/info-3.png" alt="" />
          </div>
          <div class="caption">
            <div>대로/로의 도로명+<em>기초번호</em>+길</div>
            <p>
              ‘대로/로’에서 분기되는 ‘길’에 분기되는 지점의 기초번호를
              이용하여<br />
              도로명 부여
            </p>
          </div>
        </div>
        <div class="box-col">
          <div class="subject">그 외 숫자방식</div>
          <div class="img">
            <img src="@images/introduction/road/info-4.png" alt="" />
          </div>
          <div class="caption">
            <div>사직1길, 사직2길, 백송1길</div>
            <p>
              일정지역의 ‘로/길’에서 지역특성에 맞는 일련번호를 이용하여 도로명
              부여
            </p>
          </div>
        </div>
        <div class="box-col">
          <div class="subject"><em>추가</em>로 분기되는 경우</div>
          <div class="img">
            <img src="@images/introduction/road/info-5.png" alt="" />
          </div>
          <div class="caption">
            <div>대OO로3가길, OO로3번나길 ...</div>
            <p>
              기초번호방식 또는 일련번호방식의 ‘길’에서 추가로 분기되는 ‘길’에
              <br />
              가, 나, 다 순으로 추가하여 도로명 부여
            </p>
          </div>
        </div>
      </div>
    </IntroductionSection2>

    <IntroductionSection2 title="건물번호 부여방법">
      <div class="grid-col-1">
        <div class="box-col">
          <div class="img">
            <img src="@images/introduction/road/info-6.png" alt="" />
          </div>
          <div class="caption">
            <div>
              2개의 도로에 출입구가 접한 경우 큰 도로의 출입구를 기준으로 하여
              건물번호를 부여한다.
            </div>
            <p class="fg">※ 건물 소유자 등이 원하는 경우 달리할 수 있음</p>
          </div>
        </div>
      </div>
      <div class="grid-col-2">
        <div class="box-col">
          <div class="subject"><em>부번</em>의 사용</div>
          <div class="img">
            <img src="@images/introduction/road/info-6-2.png" alt="" />
          </div>
          <div class="caption">
            <ul class="round-list">
              <li>하나의 구간에 여러 개의 건물이 있는 경우</li>
              <li>하나의 구간에 종속구간이 있는 경우</li>
            </ul>
          </div>
        </div>
        <div class="box-col">
          <div class="subject"><em>지하</em>의 사용</div>
          <div class="img">
            <img src="@images/introduction/road/info-6-3.png" alt="" />
          </div>
          <div class="caption">
            <p>도로에 위치한 지하상가는 건물번호 앞에 ‘지하’를 함께 표기</p>
          </div>
        </div>
      </div>
    </IntroductionSection2>
    <IntroductionSection2 title="상세주소 부여방법">
      <div class="grid-col-3">
        <div class="details-group">
          <em>동번호</em>
          <p>
            아라비아 숫자를 일련번호로 부여하거나 한글을 이용
            (101동,102동,103동.../ 가동,나동,다동...)
          </p>
          <div>
            ※ 주 출입구를 기준으로 시계 반대 방향 부여 권장<i
              class="v-arrw"
            ></i>
            주된 진입방향
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">일렬형</div>
          <div class="image">
            <img src="@images/introduction/road/info-7.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">트리형</div>
          <div class="image">
            <img src="@images/introduction/road/info-8.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">광장형</div>
          <div class="image">
            <img src="@images/introduction/road/info-9.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">병렬형</div>
          <div class="image">
            <img src="@images/introduction/road/info-10.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">링형</div>
          <div class="image">
            <img src="@images/introduction/road/info-11.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">메트릭스형</div>
          <div class="image">
            <img src="@images/introduction/road/info-12.png" alt="" />
          </div>
        </div>
      </div>

      <div class="grid-col-3">
        <div class="details-group">
          <em>층수</em>
          <p>지표면을 기준으로 지상은 일련번호, 지하층은 ‘지하’를 붙여 표기</p>
          <div>
            ※ 지하층이 1개인 경우에는 지하 1층은 지하층으로 표기,[범례]<i
              class="v-arrw"
            ></i
            >주된 진입방향 M,L,G층 : M (Main : 주층), L (Lobby : 로비), G
            (Garage : 주차장)
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">수직형</div>
          <div class="image">
            <img src="@images/introduction/road/info-13.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">지하 벙커형</div>
          <div class="image">
            <img src="@images/introduction/road/info-14.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">구름다리형</div>
          <div class="image">
            <img src="@images/introduction/road/info-15.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">필로티형</div>
          <div class="image">
            <img src="@images/introduction/road/info-16.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">M, L, G 층</div>
          <div class="image">
            <img src="@images/introduction/road/info-17.png" alt="" />
          </div>
        </div>
      </div>

      <div class="grid-col-3 _grid2">
        <div class="details-group">
          <em>호수</em>
          <p>
            아라비아 숫자를 순차적으로
            사용(101호,102호.../1호,2호.../지하1호,지하2호.../지하 101호,지하
            102호...)
          </p>
          <div>
            ※ 주 출입구를 기준으로 시계 반대 방향 부여 권장,[범례]
            <i class="v-arrw"></i>
            주된 진입방향
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">직선 배치형</div>
          <div class="image">
            <img src="@images/introduction/road/info-18.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">달팽이 배치형</div>
          <div class="image">
            <img src="@images/introduction/road/info-19.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">직선 배치형</div>
          <div class="image">
            <img src="@images/introduction/road/info-20.png" alt="" />
          </div>
        </div>
        <div class="box-col-2">
          <div class="subject">달팽이 배치형</div>
          <div class="image">
            <img src="@images/introduction/road/info-21.png" alt="" />
          </div>
        </div>
      </div>
    </IntroductionSection2>
  </IntroductionSection>
  <IntroductionSection title="주소정보시설 보는 방법" id="section_05">
    <div class="road-grant-info">
      <div class="figure">
        <div class="img">
          <img src="@images/introduction/road/how.png" alt="" />
        </div>
        <div class="caption">
          <ol>
            <li data-i="1">
              <strong>한 방향용 도로명판</strong>
              <div>
                도로 시작지점 ‘1’ (→)방향으로 ‘중앙로 19’까지 기초번호를 안내
              </div>
            </li>

            <li data-i="2">
              <strong>기초번호판</strong>
              <div>
                교차로에 설치. 왼쪽 (←)은 ‘5’이하, 오른쪽(→)은 ‘9’이상의
                도로명과 기초번호를 안내
              </div>
            </li>

            <li data-i="3">
              <strong>양방향용 도로명판</strong>
              <div>
                교차로에 설치. 왼쪽 (←)은 ‘5’이하, 오른쪽(→)은 ‘9’이상의
                도로명과 기초번호를 안내
              </div>
            </li>

            <li data-i="4">
              <strong>한 방향용 도로명판</strong>
              <div>
                현위치는 도로 끝지점 ‘19’ (←)방향으로 ‘중앙로 1’까지 도로명과
                기초번호를 안내
              </div>
            </li>
          </ol>
          <ol>
            <li data-i="5">
              <strong>앞쪽 방향용 도로명판</strong>
              <div>현위치는 ‘대한대로’의 12번 지점, 도로 끝점은 60번</div>
            </li>

            <li data-i="6">
              <strong>예고용 도로명판</strong>
              <div>현위치에서 200m 전방에 중앙로가 있음</div>
            </li>

            <li data-i="7">
              <strong>건물번호판</strong>
              <div>도로명과 건물번호로 구성</div>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div class="building-number">
      <div class="subject">건물번호판</div>
      <div class="building-grid">
        <div class="col-lg col">
          <strong>일반용</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-22.png" alt=""
            /></span>
            <span
              ><img src="@images/introduction/road/info-23.png" alt=""
            /></span>
          </div>
        </div>
        <div class="col-md col">
          <strong>광장형</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-24.png" alt=""
            /></span>
          </div>
        </div>
        <div class="col-md col">
          <strong>광장형</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-25.png" alt=""
            /></span>
          </div>
        </div>
      </div>
      <div class="building-grid none">
        <div class="col">
          <strong>자율형 건물번호판</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-26.png" alt=""
            /></span>
            <span
              ><img src="@images/introduction/road/info-27.png" alt=""
            /></span>
            <span
              ><img src="@images/introduction/road/info-28.png" alt=""
            /></span>
            <span
              ><img src="@images/introduction/road/info-29.png" alt=""
            /></span>
            <span
              ><img src="@images/introduction/road/info-30.png" alt=""
            /></span>
            <span
              ><img src="@images/introduction/road/info-31.png" alt=""
            /></span>
          </div>
        </div>
      </div>
    </div>

    <div class="building-number">
      <div class="subject">도로명판</div>

      <div class="building-grid">
        <div class="col col-lg">
          <strong>한 방향용(시작지점)</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-32.png" alt=""
            /></span>
          </div>

          <div class="desc-list">
            <dl>
              <dt>강남대로</dt>
              <dd>넓은 길, 시작시점을 의미</dd>
            </dl>
            <dl>
              <dt>1 <i class="v-arrw-2"></i></dt>
              <dd>현 위치는 도로 시작점 ‘1’</dd>
            </dl>
            <dl>
              <dt>1 <i class="v-arrw-2"></i>699</dt>
              <dd>강남대로는 6.99km (699 X 10m)</dd>
            </dl>
          </div>
        </div>
        <div class="col col-lg">
          <strong>한 방향용(끝지점)</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-33.png" alt=""
            /></span>
          </div>

          <div class="desc-list">
            <dl>
              <dt>대정로23번길</dt>
              <dd>
                ‘대정로’ 시작지점에서부터 약 230m 지점에서<br />왼쪽으로 분기된
                도로
              </dd>
            </dl>
            <dl>
              <dt>65 <i class="v-arrw-2"></i></dt>
              <dd>현 위치는 도로 끝지점 ‘65’</dd>
            </dl>
            <dl>
              <dt>1 <i class="v-arrw-2"></i>65</dt>
              <dd>이 도로는 650m (65 X 10m)</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="building-grid">
        <div class="col col-lg">
          <strong>양방향용(교차지점)</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-34.png" alt=""
            /></span>
          </div>

          <div class="desc-list">
            <dl>
              <dt>중앙로</dt>
              <dd>전방 교차 도로는 중앙로</dd>
            </dl>
            <dl>
              <dt>92</dt>
              <dd>좌측으로 92번 이하 건물 위치</dd>
            </dl>
            <dl>
              <dt>96</dt>
              <dd>우측 96번 이상 건물 위치</dd>
            </dl>
          </div>
        </div>
        <div class="col col-lg">
          <strong>앞쪽 방향용(진행방향)</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-35.png" alt=""
            /></span>
          </div>
          <div class="desc-list">
            <dl>
              <dt>사임당로</dt>
              <dd>중간지점을 의미</dd>
            </dl>
            <dl>
              <dt>92 <i class="v-arrw-2"></i></dt>
              <dd>현 위치는 도로상의 92번</dd>
            </dl>
            <dl>
              <dt>92 <i class="v-arrw-2"></i>250</dt>
              <dd>남은 거리는 1.5km (250-92) X 10m)</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="building-grid">
        <div class="col col-lg">
          <strong>예고용 도로명판</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-36.png" alt=""
            /></span>
          </div>

          <div class="desc-list">
            <dl>
              <dt>종로</dt>
              <dd>현 위치에서 다음에 나타날 도로는 ‘종로’</dd>
            </dl>
            <dl>
              <dt>200m</dt>
              <dd>현 위치로부터 전방 200m에 예고한 도로가 있음</dd>
            </dl>
          </div>
        </div>
        <div class="col col-lg">
          <strong>한 방향용(끝지점)</strong>
          <div class="image-box">
            <span
              ><img src="@images/introduction/road/info-37.png" alt=""
            /></span>
          </div>

          <div class="desc-list">
            <dl>
              <dt>종로</dt>
              <dd>도로명</dd>
            </dl>
            <dl>
              <dt>2345</dt>
              <dd>기초번호</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="building-grid none">
        <div class="col">
          <strong>“방향”을 나타내는 도로명주소 도로명판</strong>
          <div class="image-box grid-image">
            <span>
              <em>한방향용(기점)</em>
              <img src="@images/introduction/road/info-37-2.png" alt="" />
            </span>
            <span>
              <em>한방향용(종점)</em>
              <img src="@images/introduction/road/info-37-3.png" alt="" />
            </span>
            <span>
              <em>앞쪽 방향용</em>
              <img src="@images/introduction/road/info-37-4.png" alt="" />
            </span>
            <span>
              <em>양 방향용</em>
              <img src="@images/introduction/road/info-37-5.png" alt="" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </IntroductionSection>
  <IntroductionSection
    title="도로명주소 영문 표기방법"
    description="작은단위 -> 큰단위 순으로 표기,<br>참고항목(법정동, 공동주택명)은 주소의 간결화를 위해 표기하지 않을 수 있으나, 필요할 경우 맨 앞(상세주소 앞)에 괄호로 표기"
    id="section_06"
  >
    <div class="address-sample p-0">
      <div class="box">
        <span>예시</span><b>경상남도 통영시 학림1길 수상11-32</b>
        <p>(W11-32 Hangnim 1-gil, Tongueong-si, Gyeongsangnam-do)</p>
      </div>
    </div>

    <IntroductionSection2 title="주요 구성요소 표기방법">
      <div class="eng-address-grid">
        <div class="col">
          <strong>행정구역명칭</strong>
          <div class="address-sample">
            <div class="box">
              <span>예시</span><b>서울특별시 강남구 강남대로10길 109</b>
              <p>109 Gangnam-daero 10-gil, Gangnam-gu, Seoul</p>
            </div>
          </div>
          <div class="desc">
            ‘국어의 로마자 표기법’에 따라 전체를 로마자로 표기하되 <br />
            특별시와 광역시의 경우는 행정구역단위(-si)생략 가능
          </div>
        </div>
        <div class="col">
          <strong>도로명</strong>
          <div class="address-sample">
            <div class="box">
              <span>예시</span><b>경기도 양주시 시민로5번길 18</b>
              <p>18 Simin-ro 5beon-gil, Yangju-si, Gyeonggi-do</p>
            </div>
          </div>
          <div class="desc">
            로마자로 표기하며 도로의 구분기준인 ‘대로, 로, 길(번길)‘은<br />
            ‘-daero, -ro, -gil(beon-gil)’로 표기
            <p class="fg">
              ※ 필요에 따라 영어식 표기(Blvd. St. Rd. 등) 병기 가능
            </p>
          </div>
        </div>
        <div class="col col-lg">
          <strong>상세주소</strong>
          <div class="rows">
            <div class="address-sample">
              <div class="box">
                <span>예시</span
                ><b>대구광역시 수성구 달구벌대로323번길 56, 705동 1104호</b>
                <p>
                  ① 705-dong 1104-ho, 56 Dalgubeol-daero 323beon-gil,<br />Suseong-gu,
                  Daegu
                </p>
                <p>
                  ② 705-1104, 56 Dalgubeol-daero 323beon-gil,<br />Suseong-gu,
                  Daegu
                </p>
              </div>
            </div>
            <div class="address-sample">
              <div class="box">
                <span>예시</span><b>강원도 춘천시 퇴계로77번길 42, 3층 </b>
                <p>
                  3-cheung, 42 Toegye-ro 77beon-gil, Chuncheon-si, Gangwon-do
                </p>
              </div>
            </div>
          </div>
          <div class="desc">
            ‘동’, ‘층’, ‘호’는 로마자 표기를 원칙으로 하되, 널리 사용되는 표현인
            경우 영어식 표기<br />
            (’동’, ‘층’, ‘호’ 생략, ‘층’ -> ‘F’, ‘지하’ -> ‘B’) 사용가능
          </div>
        </div>
      </div>
    </IntroductionSection2>
  </IntroductionSection>
  <IntroductionSection
    title="상세주소"
    description="상세주소는 도로명주소의 건물번호 뒤에 표시되는 동·층·호 정보로, 원룸·다가구주택·단독주택 중 2가구 이상 거주주택, 일반상가, 업무용 빌딩 등 임대하고 있는 건물에 부과합니다."
    id="section_07"
  >
    <div class="detailed-address">
      <div class="detailed-address-1">
        <img src="@images/introduction/road/info-38.png" alt="" />
      </div>
      <div class="detailed-address-2">
        <div class="col">
          <div class="subject">상세주소는 왜 필요한가?</div>
          <div class="desc">
            건물 내 정확한 위치 안내로 우편물·택배 등의 전달·수취가<br />정확하며
            응급상황 발생 시 신속한 대응이 가능합니다.
          </div>
          <div class="image">
            <img src="@images/introduction/road/info-39.png" alt="" />
          </div>
        </div>
        <div class="col">
          <div class="subject">누가 상세주소 부여 신청을 할 수 있나요?</div>
          <div class="desc">
            원룸·다가구주택·세대구분형 공동주택 등의 소유자 또는 임차인입니다.
            <br />
            임차인은 소유자가 동의하는 경우 바로 신청이 가능하고,
            <br />소유자에게 상세주소 부여 요청 후<br />소유자가 신청하지 않을
            경우 14일 후에 직접 신청할 수 있습니다.
          </div>
          <div class="image">
            <img src="@images/introduction/road/info-40.png" alt="" />
          </div>
        </div>
        <div class="col col-lg">
          <div class="subject">상세주소 신청방법은?</div>
          <div class="desc">
            <ul class="round-list">
              <li>
                <b>인터넷 접수 :</b> 정부민원포털 민원24 (www.minwon.go.kr)
              </li>
              <li>
                <b>우편 및 방문 접수 :</b> 건물의 관할 소재지 시ㆍ군ㆍ구청
                도로명주소 담당
              </li>
            </ul>
            <p>
              ※ 신청서류 : 신청서, 상세주소, 신청도면 등 (임차인 신청 시)
              임차인임을 확인할 수 있는 서류 등
            </p>
          </div>
          <div class="image">
            <img src="@images/introduction/road/info-41.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </IntroductionSection>
  <IntroductionSection title="입체주소" id="section_08">
    <div class="dimensional-address">
      <div class="subject">입체주소란?</div>
      <p>
        도로명 부여 대상 도로가 지상도로에서 입체도로(고가도로,지하도로),
        내부도로(건물, 구조물 안 통로)로 확대
      </p>

      <div class="dimensional-address-list">
        <strong>입체도로</strong>
        <b>공중 또는 지하에 설치된 도로 및 통로</b>
        <ul class="round-list">
          <li>고가도로: 공중에 설치된 도로 및 통로</li>
          <li>지하도로: 지하에 설치된 도로 및 통로</li>
        </ul>
      </div>
      <div class="dimensional-address-list">
        <strong>내부도로</strong>
        <b>건물 또는 구조물의 내부에 설치된 도로 및 통로</b>
        <ul class="round-list">
          <li>건물의 내부에 설치된 도로 및 통로</li>
          <li>건물이 아닌 구조물의 내부에 설치된 도로 및 통로</li>
        </ul>
      </div>

      <div class="dimensional-address-sample">
        <div><img src="@images/introduction/road/info-f1.png" alt="" /></div>
        <div><img src="@images/introduction/road/info-f2.png" alt="" /></div>
        <div><img src="@images/introduction/road/info-f3.png" alt="" /></div>
      </div>
    </div>
  </IntroductionSection>
  <IntroductionSection title="입체주소의 부여방법" id="section_09">
    <div class="dimensional-method">
      <div class="image-box">
        <img src="@images/introduction/road/info-43.png" alt="" />
      </div>

      <div class="dimensional-grid">
        <div class="col">
          <div class="subject">1) 입체도로 등의 도로명 부여</div>
          <div class="address-sample">
            <div class="box">
              <span>예시</span>
              <b>서울특별시 송파구잠실역중앙통로 110</b>
            </div>
          </div>
          <ul class="round-list">
            <li>
              도로명을 부여하는 도로를 지상도로 외에
              <u
                >입체도로(지하 고가 도로), 내부도로(지하상가 통행로 등)까지
                확대</u
              >
            </li>
            <li>
              지상도로의 도로명은 현재와 같이 ‘대로, 로, 길’로 부여하되,
              입체도로와 내부 통로는 각각의 도로 유형과 장소
            </li>
            <li>
              (고가도로 등 / 지하철역 지하상가 이름)를 나타내는 명칭을 포함하여
              부여
            </li>
          </ul>
        </div>
        <div class="col">
          <div class="subject">
            2) 행정구역 미결정 지역에서의 도로명주소 표기 방법
          </div>
          <div class="address-sample">
            <div class="box">
              <span>예시</span>
              <b
                >‘전라북도 새만금지구 새만금중앙대로3’→ 행정구역이<br />결정되면,
                ‘전라북도 ㅇㅇ시(군) 새만금중앙대로3’으로 전환</b
              >
            </div>
          </div>
          <ul class="round-list">
            <li>
              새만금 등 행정구역이 아직 결정되지 않은 지역에서 도로명주소를
              사용할 때 <br /><b>“행정구역 명칭”</b> 대신에
              <b>“사업지역 명칭”</b>을 사용
            </li>
            <li>
              행정구역이 결정된 이후에는 해당 시 도와 시 군 구의 명칭으로 바꾸어
              <br />
              사용하도록 하여 주소변경에 따른 불편을 없도록 하였습니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </IntroductionSection>
  <IntroductionSection title="입체도로의 도로명판의 종류" id="section_10">
    <div class="dimensional-board-grid">
      <div class="subject">한방향용</div>
      <div class="col">
        <strong>벽면 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v1.png" alt="" />
        </div>
      </div>
      <div class="col">
        <strong>천장 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v2.png" alt="" />
        </div>
      </div>
    </div>
    <div class="dimensional-board-grid">
      <div class="subject">양방향용</div>
      <div class="col">
        <strong>벽면 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v3.png" alt="" />
        </div>
      </div>
      <div class="col">
        <strong>천장 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v4.png" alt="" />
        </div>
      </div>
    </div>
    <div class="dimensional-board-grid">
      <div class="subject">예고용</div>
      <div class="col">
        <strong>벽면 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v5.png" alt="" />
        </div>
      </div>
      <div class="col">
        <strong>천장 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v6.png" alt="" />
        </div>
      </div>
    </div>
    <div class="dimensional-board-grid">
      <div class="subject">터널, 지하도로 등의 기초번호판의 구조</div>
      <div class="col col-lg">
        <div class="image">
          <img src="@images/introduction/road/info-v7.png" alt="" />
        </div>
      </div>
    </div>
    <div class="dimensional-board-grid g4">
      <div class="subject">내부도로 기초번호판 구조</div>
      <div class="col col-sm">
        <strong>일반용</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v7-2.png" alt="" />
        </div>
      </div>
      <div class="col col-sm">
        <strong>둥근 기둥용</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v7-3.png" alt="" />
        </div>
      </div>
      <div class="col">
        <strong>각진 기둥용</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v7-4.png" alt="" />
        </div>
      </div>
    </div>
    <div class="dimensional-board-grid">
      <div class="subject">건물번호판의 구조</div>
      <div class="col">
        <strong>벽면 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v8.png" alt="" />
        </div>
      </div>
      <div class="col">
        <strong>천장 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v9.png" alt="" />
        </div>
      </div>
    </div>
    <div class="dimensional-board-grid">
      <div class="subject">사물주소판의 구조</div>
      <div class="col">
        <strong>벽면 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v10.png" alt="" />
        </div>
      </div>
      <div class="col">
        <strong>천장 부착형</strong>
        <div class="image">
          <img src="@images/introduction/road/info-v11.png" alt="" />
        </div>
      </div>
    </div>

    <div class="dimensional-merit">
      <div class="subject">
        새로운 도로명주소법이 개정됨에 따라 재난 및 위급상황 발생 시 신속한 구조
        구급활동이 가능 해질 뿐 아니라, 드론 배송이나 자율주행 등 4차산업
        핵심기술을 생활에 적용할 수 있는 기반이 마련될것으로 기대하고 있습니다.
      </div>
      <div class="rows">
        <div class="col">
          <div class="icon">
            <img src="@images/introduction/road/info-v12.png" alt="" />
          </div>
          <div class="desc">
            <strong>드론배달</strong>
            <ul class="round-list">
              <li>이동경로</li>
              <li>배달점</li>
            </ul>
          </div>
        </div>
        <div class="col">
          <div class="icon">
            <img src="@images/introduction/road/info-v13.png" alt="" />
          </div>
          <div class="desc">
            <strong>사물인터넷</strong>
            <ul class="round-list">
              <li>버스정류장</li>
              <li>지진 옥외대피장소</li>
              <li>분리수거함</li>
            </ul>
          </div>
        </div>
        <div class="col">
          <div class="icon">
            <img src="@images/introduction/road/info-v14.png" alt="" />
          </div>
          <div class="desc">
            <strong>자율주행차</strong>
            <ul class="round-list">
              <li>주차장 입구</li>
              <li>이동경로</li>
            </ul>
          </div>
        </div>
        <div class="col">
          <div class="icon">
            <img src="@images/introduction/road/info-v15.png" alt="" />
          </div>
          <div class="desc">
            <strong>실내 내비게이션</strong>
            <ul class="round-list">
              <li>상세주소</li>
              <li>입체복합공간</li>
              <li>지하철역</li>
            </ul>
          </div>
        </div>
        <div class="col">
          <div class="icon">
            <img src="@images/introduction/road/info-v16.png" alt="" />
          </div>
          <div class="desc">
            <strong>자율주행로봇 배달</strong>
            <ul class="round-list">
              <li>이동경로</li>
              <li>배달점</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </IntroductionSection>
</template>
<script setup>
import CommonBreadcrumb from "@/components/breadcrumb/CommonBreadcrumb.vue";
import IntroductionSection from "@/components/introduction/IntroductionSection.vue";
import IntroductionSection2 from "@/components/introduction/IntroductionSection2.vue";
import HeaderTitle from "@/components/title/HeaderTitle.vue";
import { nextTick, onMounted, onUnmounted, ref } from "vue";

const titleRef = ref(null); // HeaderTitle
const navRef = ref(null); // krds-in-page-navigation-type
const isStuck = ref(false);

const checkPosition = () => {
  const titleEl = titleRef.value?.$el || titleRef.value;
  const navEl = navRef.value;

  if (!titleEl || !navEl) return;

  const titleTop = titleEl.getBoundingClientRect().top + window.scrollY;
  const navTop = navEl.getBoundingClientRect().top + window.scrollY;

  const scrollY = window.scrollY;

  isStuck.value = scrollY + 10 >= titleTop;
};

onMounted(async () => {
  await nextTick();
  checkPosition();
  updateActiveSection;
  window.addEventListener("scroll", checkPosition);
  window.addEventListener("scroll", updateActiveSection);
  window.addEventListener("resize", checkPosition);
});

onUnmounted(() => {
  window.removeEventListener("scroll", checkPosition);
  window.removeEventListener("scroll", updateActiveSection);
  window.removeEventListener("resize", checkPosition);
});

const activeSection = ref("section_01");

const navItems = [
  { id: "section_01", label: "도로명주소란?" },
  { id: "section_02", label: "지번과 도로명주소<br>비교" },
  { id: "section_03", label: "주소 표기방법" },
  { id: "section_04", label: "도로명주소 부여방법" },
  { id: "section_05", label: "주소정보시설 보는 <br>방법" },
  { id: "section_06", label: "도로명주소 영문<br>표기 방법" },
  { id: "section_07", label: "상세주소" },
  { id: "section_08", label: "입체주소란?" },
  { id: "section_09", label: "도로명주소 부여방법" },
  { id: "section_10", label: "입체도로의 <br>도로명판의 종류" },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    const offset = 100;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

const updateActiveSection = () => {
  const offset = 120;
  let currentId = navItems[0].id;

  for (const item of navItems) {
    const section = document.getElementById(item.id);
    if (section) {
      const top = section.getBoundingClientRect().top;
      if (top - offset < 0) {
        currentId = item.id;
      }
    }
  }

  activeSection.value = currentId;
};

const roadIntroList = [
  {
    title: "생활이 편리해집니다.",
    list: [
      {
        title: "체계적인 도로명주소 사용으로 길찾기가 수월해집니다.",
      },
      {
        title: "화재나 범죄 등 긴급한 상황에서 신속하게 대응합니다.",
      },
    ],
    image: "/src/assets/images/introduction/road/img-1.png",
  },
  {
    title: "국가경쟁력이 높아집니다. ",
    list: [
      {
        title:
          "세계적으로 보편화된 도로명주소를 사용함으로써 국가경쟁력이 높아집니다.",
      },
      {
        title: "물류비 절감 등 사회 · 경제적 비용이 줄어듭니다.",
      },
    ],
    image: "/src/assets/images/introduction/road/img-2.png",
  },
];
</script>
