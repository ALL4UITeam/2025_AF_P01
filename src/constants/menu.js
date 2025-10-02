export const menus = [
  {
    title:'주소정책소개',
    subtitle:'국민생활 편의 및 안전을 위한<br />정부가 추진하고 있는 주소정책을<br />확인 할 수 있어요.',
    submenus: [
      {
        type:'link',
        label:'도로명주소 소개',
        href:'/introduction/RoadAddress',
        subtext: '확정 내용 없음.'
      },
      {
        type:'link',
        label:'사물주소 소개',
        href:'/introduction/ObjectAddress',
        subtext: '확정 내용 없음.'
      },
      {
        type:'link',
        label:'수상시설물 주소 소개',
        href:'/introduction/WaterFacilities',
        subtext: '확정 내용 없음.'
      },
      {
        type:'link',
        label:'국가기초구역 소개  ',
        href:'/introduction/NationalDistrict',
        subtext: '확정 내용 없음.'
      },
      {
        type:'link',
        label:'장소지능 출입구 소개',
        href:'/introduction/LocationEntrance',
        subtext: '확정 내용 없음.'
      },
      {
        type:'link',
        label:'국가지점번호 소개',
        href:'/introduction/NationalPoint',
        subtext: '확정 내용 없음.'
      },
      // {
      //   type:'link',
      //   label:'도로명주소?',
      //   action: () => {
      //     const width = window.innerWidth;
      //     const height = window.innerHeight;
      //     window.open('/introduction/GuideBook?pageIdx=3', 'popup', `width=${width},height=${height},scrollbars=yes`);
      //   },
      //   subtext: '부여된 도로명, 건물번호에 의하여 도로명 주소를 표기하는 방식을 확인할 수 있어요.'
      // },
      // {
      //   type:'link',
      //   label:'사물주소',
      //   action: () => {
      //     const width = window.innerWidth;
      //     const height = window.innerHeight;
      //     window.open('/introduction/GuideBook?pageIdx=21', 'popup', `width=${width},height=${height},scrollbars=yes`);
      //   },
      //   subtext: '도로명과 기초번호를 이용하여 시설물에 부여한 사물주소 부여체계를 확인해 보세요.'
      // },
      
 /*     {
        type:'link', 
        label:'입체주소', 
        href:'/common/sample',
        subtext: '3차원 입체공간에 주소를 부여한 상세하고 정확한 입체주소 체계를 확인해 보세요.'
      },*/
      // {
      //   type:'link',
      //   label:'장소지능',
      //   action: () => {
      //     const width = window.innerWidth;
      //     const height = window.innerHeight;
      //     window.open('/introduction/GuideBook?pageIdx=26', 'popup', `width=${width},height=${height},scrollbars=yes`);
      //   },
      //   subtext:'기존 주출입구 외 다양한 이동체별(차량, 로봇, 교통약자) 출입구 정보 확인이 가능합니다.'
      // },
      // {
      //   type:'link',
      //   label:'수상시설',
      //   action: () => {
      //     const width = window.innerWidth;
      //     const height = window.innerHeight;
      //     window.open('/introduction/GuideBook?pageIdx=27', 'popup', `width=${width},height=${height},scrollbars=yes`);
      //   },
      //   subtext:'수상(해상), 해안가에 위치한 각종 시설의 <br />도로명 주소를 확인할 수 있습니다.'
      // },
      // {
      //   type:'link',
      //   label:'국가지점번호',
      //   action: () => {
      //     const width = window.innerWidth;
      //     const height = window.innerHeight;
      //     window.open('/introduction/GuideBook?pageIdx=28', 'popup', `width=${width},height=${height},scrollbars=yes`);
      //   },
      //   subtext:'산악·해안 등에서 긴급상황 발생 시<br/>활용되는 국가지점번호를 확인해 보세요'
      // },
      // {
      //   type:'link',
      //   label:'국가기초구역',
      //   action: () => {
      //     const width = window.innerWidth;
      //     const height = window.innerHeight;
      //     window.open('/introduction/GuideBook?pageIdx=29', 'popup', `width=${width},height=${height},scrollbars=yes`);
      //   },
      //   subtext:'각종 관할구역(통계, 우편, 소방, 경찰 등)을<br/>관리하기 위한 국가기초구역을 확인해 보세요'
      // },
    ],
  },
  {
    title:'주소정보활용',
    subtitle:'편리한 도로명 주소를<br />지도에서 확인하고<br />지번주소를 도로명주소로<br />전환해 보세요!',
    submenus: [
      {
        type:'link', 
        label:'통합지도', 
        action: () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          window.open('/map/totalMapView', 'popup', `width=${width},height=${height},scrollbars=yes`);
        },
        subtext:'건물, 도로, 기초구역 등 도로명주소에<br />대한 위치정보를 확인할 수 있어요.'
      },
      {
        type:'link',
        label:'주소전환',
        href:'/aht/AhtAddressTransformOffer',
        subtext:'지번주소를 도로명주소로 전환하여<br />다운로드 받을 수 있어요.'
      },
      {
        type:'link',
        label:'지자체 안내도',
        href:'/ahi/ahiGuideMapSidoList',
        subtext:'지자체에서 제작한 도로명주소<br />안내지도를 다운받을 수 있어요.'
      },
      {
        type:'link',
        label:'영문증명발급',
        href:'/ahh/ahhEngAddrIdentity',
        subtext:'수출기업 등 국외에서 도로명주소와 지번의<br />' +
            '관계를 입증하는 서류(영문)를 발급 할 수<br />' +
            '있어요.'
      },
    ]
  },
  {
    title:'주소정보조회',
    subtitle:'다양한 주소정책을 통해<br />' +
        '만들어진 주소정보를<br />' +
        '조회하고<br />' +
        '결과를 확인 할 수 있어요!',
    submenus: [
      {
        type:'link',
        label:'도로명 주소 조회',
        href:'/ahu/ahuRoadNameAncmntList',
        subtext:'지자체에서 고시된 도로명주소의 신규,<br />' +
            '변경, 폐지 사항을 확인 할 수 있어요.'
      },
      {
        type:'link',
        label:'도로명 정보 조회',
        href:'/ahu/ahuRoadNameDataList',
        subtext:'도로명코드, 명칭, 영문명 등 도로명정보와 도로구간 위치정보를 확인할 수 있어요.'
      },
      {
        type:'link',
        label:'사물 주소 조회',
        href:'/ahu/ahuObjectAddrList',
        subtext:'다중이용 시설물에 위치를 표시하는<br />' +
            '사물주소를 확인 할 수 있어요.<br />' +
            '예> 육교승강기, 버스정류장 , 졸음쉼터 등'
      },
      {
        type:'link',
        label:'우편 번호 조회',
        href:'/ahu/ahuKarbSbdList',
        subtext:'통계, 소방, 우편 등 일반에 공표하는<br />' +
            '국가기초구역(우편번호)를 확인해 보세요.'
      },
      {
        type:'link',
        label:'지점 번호 조회',
        href:'/ahu/ahuBrnchNoMkrgList',
        subtext:'산악이나 해안에서 긴급상황 발생 시,<br />' +
            '신속하게 위치를 확인 할 수 있는<br />' +
            '국가지점번호를 확인해 보세요.'
      },
      {
        type:'link',
        label:'명예도로 조회',
        href:'/ahu/ahuHonorRoadList',
        subtext:'등록된 명예도로에 대한 정보와 위치를 확인할 수 있어요.'
      },
      // {
      //   type:'link',
      //   label:'입체주소',
      //   href:'/common/sample',
      //   subtext:'기획중'
      // },
    ]
  },
  {
    title:'주소이야기',
    subtitle:'국가주소의 최신동향과<br />' +
        '재미있는 주소이야기를<br />' +
        '확인 할 수 있어요.',
    submenus: [
      {
        type:'link',
        label:'아름다운 길',
        href:'/ahi/ahiBgGalleryBoardList',
        subtext:'한국의 아름다운 길을 보여주는<br />' +
            '대한민국 곳곳의 명소를 확인 할 수 있어요.'
      },
      {
        type:'link',
        label:'홍보자료',
        href:'/ahi/ahiReferBoardList',
        subtext:'국가주소의 최신동향을 카드뉴스,<br />동영상뉴스를 통해 확인해 보세요.'
      },
      {
        type:'link',
        label:'우리 집 주소는?',
        href:'/ahs/ahsInfoMyArea',
        subtext:'우리집 주소를 입력하고, 도로명주소의<br />' +
            '부여내용, 관할주민센터 등 다양한<br />' +
            '정보를 확인 할 수 있어요.'
      },
      {
        type:'link',
        label:'주소통계',
        href:'/ahs/ahsRnsStatis',
        subtext:'도로명 수, 도로명주소 수, 상세주소 등 지역별 현황정보를 그래프와 차트로 볼 수 있어요.'
      },
      {
        type:'link',
        label:'인포그래픽',
        href:'/ahs/ahsInfographic',
        subtext:'새로 부여된 주소의 추이정보와 재미있는 주소이야기를 확인할 수 있어요'
      },
    ]
  },
  {
    title:'주소소통마당',
    subtitle:'궁금한 점 또는 불편한 사항에<br />' +
        '대해 서로 소통하고, 자료를<br />' +
        '제공 받을 수 있어요.',
    submenus: [
      {
        type:'link',
        label:'공지사항',
        href:'/ahh/ahhNoticeBoardList',
        subtext:'주요행사, 이벤트, 서비스 기능개선 등<br />공지사항을 확인 할 수 있어요.'
      },
      {
        type:'link',
        label:'FAQ',
        href:'/ahh/ahhFaqBoardList',
        subtext:'자주 묻는 질문에 대한 질의/답변을<br />한곳에서 확인 할 수 있어요.'
      },
      {
        type:'link',
        label:'언론보도',
        href:'/ahh/ahhNewsBoardList',
        subtext:'뉴스, 신문 등에 등록된 언론보도<br />' +
            '자료를 한곳에서 확인 할 수 있어요.'
      },
      {
        type:'link',
        label:'불편신고',
        href:'/ahh/ahhNotifyBoardList',
        subtext:'서비스 이용 시 불편한 사항이나<br />' +
            '잘못된 정보를 등록하고 답변을 확인<br />' +
            '할 수 있어요.'
      },
    ]
  },
] 