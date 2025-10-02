import common from "@/common/common";
import { useMenuLogStore } from "@/stores/menuLog";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // [URL 예외처리 루틴]
      path: "/:pathMatch(.*)*", // 모든 경로에 매칭되는 catch-all 라우트
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
    },
    {
      path: "/",
      name: "index",
      component: () => import("@/views/pub/main/index.vue"),
      meta: { layout: "NoneLayout", title: "도로명주소 안내시스템" },
    },
    {
      path: "/map",
      name: "map",
      component: () => import("@/views/MapSample.vue"),
    },
    {
      path: "/common/innorixSample",
      name: "innorixSample",
      component: () => import("@/views/common/innorixSample.vue"),
      meta: { layout: "DefaultLayout", title: "Main" },
    },
    {
      path: "/ahu/ahuPrintMapPopup",
      name: "ahuPrintMapPopup",
      component: () => import("@/views/pub/map/totalMapPrintPopup.vue"),
    },
    {
      path: "/introduction/GuideBook",
      name: "/introduction/GuideBook",
      component: () => import("@/views/pub/introduction/GuideBook.vue"),
      meta: {
        layout: "NoneLayout",
        title: "도로명주소 소개 | 도로명주소 안내시스템",
      },
    },

    {
      path: "/introduction/RoadAddress",
      name: "/introduction/RoadAddress",
      component: () => import("@/views/pub/introduction/RoadAddress.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "도로명주소 소개 | 도로명주소 소개",
        secondDepth: "도로명주소 소개",
        menu: "도로명주소 소개",
      },
    },
    {
      path: "/introduction/ObjectAddress",
      name: "introduction/ObjectAddress",
      component: () => import("@/views/pub/introduction/ObjectAddress.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "도로명주소 소개 | 사물주소 소개",
        secondDepth: "도로명주소 소개",
        menu: "사물 주소 소개",
      },
    },
    {
      path: "/introduction/WaterFacilities",
      name: "introduction/WaterFacilities",
      component: () => import("@/views/pub/introduction/WaterFacilities.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "도로명주소 소개 | 수상시설물 주소 소개",
        secondDepth: "도로명주소 소개",
        menu: "수상시설물 주소 소개",
      },
    },
    {
      path: "/introduction/NationalDistrict",
      name: "introduction/NationalDistrict",
      component: () => import("@/views/pub/introduction/NationalDistrict.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "도로명주소 소개 | 국가기초구역 소개",
        secondDepth: "도로명주소 소개",
        menu: "국가기초구역 소개",
      },
    },
    {
      path: "/introduction/LocationEntrance",
      name: "introduction/LocationEntrance",
      component: () => import("@/views/pub/introduction/LocationEntrance.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "도로명주소 소개 | 장소지능 출입구 소개",
        secondDepth: "도로명주소 소개",
        menu: "장소지능 출입구 소개",
      },
    },
    {
      path: "/introduction/NationalPoint",
      name: "introduction/NationalPoint",
      component: () => import("@/views/pub/introduction/NationalPoint.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "도로명주소 소개 | 국가지점번호 소개",
        secondDepth: "도로명주소 소개",
        menu: "국가지점번호 소개",
      },
    },
    {
      path: "/map/totalMapView",
      name: "totalMapView",
      // component: () => import('@/views/pub/map/IntegratedMap_pc.vue'),
      component: () => {
        return common.isMobile()
          ? import("@/views/pub/map/IntegratedMap_mo.vue")
          : import("@/views/pub/map/IntegratedMap_pc.vue");
      },
      meta: {
        layout: "IntegratedMapLayout",
        title: "통합지도 < 주소정보활용 | 도로명주소 안내시스템",
      },
    },
    {
      path: "/map/totalMapView_mo",
      name: "totalMapView_mo",
      component: () => import("@/views/pub/map/IntegratedMap_mo.vue"),
      meta: {
        layout: "IntegratedMapLayout",
        title: "통합지도 < 주소정보활용 | 도로명주소 안내시스템",
      },
    },
    {
      path: "/aht/AhtAddressTransformOffer",
      name: "AhtAddressTransformOffer",
      component: () => import("@/views/pub/aht/AhtAddressTransformOffer.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "주소전환 < 주소정보활용 | 도로명주소 안내시스템",
        secondDepth: "주소정보활용",
        menu: "주소전환",
      },
    },
    {
      path: "/aht/ahtAddressTransformThousand",
      name: "ahtAddressTransformThousand",
      props: true,
      component: () =>
        import("@/views/pub/aht/ahtAddressTransformThousand.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "3000건 이하 주소전환 < 주소정보활용 | 도로명주소 안내시스템",
        secondDepth: "주소정보활용",
        menu: "3000건 이하 주소전환",
        data: null,
      },
    },
    {
      path: "/aht/ahtAddressTransformMillionOffer",
      name: "ahtAddressTransformMillionOffer",
      props: true,
      component: () =>
        import("@/views/pub/aht/ahtAddressTransformMillionOffer.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "100만건 이하 주소전환 < 주소정보활용 | 도로명주소 안내시스템",
        secondDepth: "주소정보활용",
        menu: "100만건 이하 주소전환",
      },
    },
    {
      path: "/ahu/ahuRoadNameAncmntList",
      name: "ahuRoadNameAncmntList",
      component: () => import("@/views/pub/ahu/ahuRoadNameAncmntList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "도로명 주소 조회 < 주소정보조회 | 도로명주소 안내시스템",
        secondDepth: "주소정보조회",
        menu: "도로명 주소 조회",
      },
    },
    {
      path: "/ahu/ahuRoadNameDataList",
      name: "ahuRoadNameDataList",
      component: () => import("@/views/pub/ahu/ahuRoadNameDataList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "도로명 정보 조회 < 주소정보조회 | 도로명주소 안내시스템",
        secondDepth: "주소정보조회",
        menu: "도로명 정보 조회",
      },
    },
    {
      path: "/ahu/ahuObjectAddrList",
      name: "ahuObjectAddrList",
      component: () => import("@/views/pub/ahu/ahuObjectAddrList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "사물 주소 조회 < 주소정보조회 | 도로명주소 안내시스템",
        secondDepth: "주소정보조회",
        menu: "사물 주소 조회",
      },
    },
    {
      path: "/ahu/ahuKarbSbdList",
      name: "ahuKarbSbdList",
      component: () => import("@/views/pub/ahu/ahuKarbSbdList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "우편 번호 조회 < 주소정보조회 | 도로명주소 안내시스템",
        secondDepth: "주소정보조회",
        menu: "우편 번호 조회",
      },
    },
    {
      path: "/ahu/ahuBrnchNoMkrgList",
      name: "ahuBrnchNoMkrgList",
      component: () => import("@/views/pub/ahu/ahuBrnchNoMkrgList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "지점 번호 조회 < 주소정보조회 | 도로명주소 안내시스템",
        secondDepth: "주소정보조회",
        menu: "지점 번호 조회",
      },
    },
    {
      path: "/ahu/ahuHonorRoadList",
      name: "ahuHonorRoadList",
      props: true,
      component: () => import("@/views/pub/ahu/ahuHonorRoadList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "명예도로 조회 < 주소정보조회 | 도로명주소 안내시스템",
        secondDepth: "주소정보조회",
        menu: "명예도로 조회",
      },
    },
    {
      path: "/ahi/ahiBgGalleryBoardList",
      name: "ahiBgGalleryBoardList",
      component: () => import("@/views/pub/ahi/ahiBgGalleryBoardList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "아름다운 길 < 주소이야기 | 도로명주소 안내시스템",
        secondDepth: "주소이야기",
        menu: "아름다운 길",
      },
    },
    {
      path: "/ahi/ahiReferBoardList",
      name: "ahiReferBoardList",
      component: () => import("@/views/pub/ahi/ahiReferBoardList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "홍보자료실 조회 < 주소이야기 | 도로명주소 안내시스템",
        secondDepth: "주소이야기",
        menu: "홍보자료",
      },
    },
    {
      path: "/ahi/ahiReferBoardDetail",
      name: "ahiReferBoardDetail",
      component: () => import("@/views/pub/ahi/ahiReferBoardDetail.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "홍보자료실 상세조회 < 주소이야기 | 도로명주소 안내시스템",
        secondDepth: "주소이야기",
        menu: "홍보자료",
      },
    },
    {
      path: "/ahi/ahiReferVideoList",
      name: "ahiReferVideoList",
      component: () => import("@/views/pub/ahi/ahiReferVideoList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "영상 자료실 < 주소이야기 | 도로명주소 안내시스템",
        secondDepth: "주소이야기",
        menu: "홍보자료",
      },
    },
    {
      path: "/ahi/ahiReferCardNewsList",
      name: "ahiReferCardNewsList",
      component: () => import("@/views/pub/ahi/ahiReferCardNewsList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "카드뉴스 조회 < 주소이야기 | 도로명주소 안내시스템",
        secondDepth: "주소이야기",
        menu: "홍보자료",
      },
    },
    {
      path: "/ahi/ahiReferCardNewsDetail",
      name: "ahiReferCardNewsDetail",
      component: () => import("@/views/pub/ahi/ahiReferCardNewsDetail.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "카드뉴스 상세조회 < 주소이야기 | 도로명주소 안내시스템",
        secondDepth: "주소이야기",
        menu: "홍보자료",
      },
    },
    {
      path: "/ahs/ahsInfoMyArea",
      name: "ahsInfoMyArea",
      props: true,
      component: () => import("@/views/pub/ahs/ahsInfoMyArea.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "우리 집 주소는? < 주소이야기 | 도로명주소 안내시스템",
        secondDepth: "주소이야기",
        menu: "우리 집 주소는?",
      },
    },
    {
      path: "/ahs/ahsRnsStatis",
      name: "/ahs/ahsRnsStatis",
      component: () => import("@/views/pub/ahs/ahsRnsStatis.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "주소통계 < 주소이야기 | 도로명주소 안내시스템",
        secondDepth: "주소이야기",
        menu: "주소통계",
      },
    },
    {
      path: "/ahs/ahsInfographic",
      name: "/ahs/ahsInfographic",
      component: () => import("@/views/pub/ahs/ahsInfographic.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "도로명주소 인포그래픽 < 주소이야기 | 도로명주소 안내시스템",
        secondDepth: "주소이야기",
        menu: "도로명주소 인포그래픽",
      },
    },
    {
      path: "/ahi/ahiGuideMapSidoList",
      name: "ahiGuideMapSidoList",
      component: () => import("@/views/pub/ahi/ahiGuideMapSidoList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "지자체 안내도 < 주소정보활용 | 도로명주소 안내시스템",
        secondDepth: "주소정보활용",
        menu: "지자체 안내도",
      },
    },
    {
      path: "/ahh/ahhNoticeBoardList",
      name: "ahhNoticeBoardList",
      component: () => import("@/views/pub/ahh/ahhNoticeBoardList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "공지사항 목록 < 주소소통마당 | 도로명주소 안내시스템",
        secondDepth: "주소소통마당",
        menu: "공지사항",
      },
    },
    {
      path: "/ahh/ahhNoticeBoardDetail",
      name: "/ahh/ahhNoticeBoardDetail",
      component: () => import("@/views/pub/ahh/ahhNoticeBoardDetail.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "공지사항 상세 < 주소소통마당 | 도로명주소 안내시스템",
        secondDepth: "주소소통마당",
        menu: "공지사항",
      },
    },
    {
      path: "/ahh/ahhFaqBoardList",
      name: "ahhFaqBoardList",
      component: () => import("@/views/pub/ahh/ahhFaqBoardList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "자주묻는질문(FAQ) < 주소소통마당 | 도로명주소 안내시스템",
        secondDepth: "주소소통마당",
        menu: "자주묻는질문(FAQ)",
      },
    },
    {
      path: "/ahh/ahhEngAddrIdentity",
      name: "ahhEngAddrIdentity",
      component: () => import("@/views/pub/ahh/ahhEngAddrIdentity.vue"),
      meta: {
        layout: "DefaultLayout",
        title:
          "주소동일성 영문증명서 발급 < 주소정보활용 | 도로명주소 안내시스템",
        secondDepth: "주소정보활용",
        menu: "주소동일성 영문증명서 발급",
      },
    },
    {
      path: "/ahh/ahhEngAddrIdentityWrite",
      name: "ahhEngAddrIdentityWrite",
      component: () => import("@/views/pub/ahh/ahhEngAddrIdentityWrite.vue"),
      meta: {
        layout: "DefaultLayout",
        title:
          "주소동일성 영문증명서 신청 < 주소정보활용 | 도로명주소 안내시스템",
        secondDepth: "주소정보활용",
        menu: "주소동일성 영문증명서 발급",
      },
    },
    {
      path: "/ahh/ahhEngAddrIdentityList",
      name: "ahhEngAddrIdentityList",
      component: () => import("@/views/pub/ahh/ahhEngAddrIdentityList.vue"),
      meta: {
        layout: "DefaultLayout",
        title:
          "주소동일성 영문증명서 신청내역 목록 < 주소정보활용 | 도로명주소 안내시스템",
        secondDepth: "주소정보활용",
        menu: "주소동일성 영문증명서 발급",
      },
    },
    {
      path: "/ahh/ahhEngAddrIdentityDetail",
      name: "ahhEngAddrIdentityDetail",
      component: () => import("@/views/pub/ahh/ahhEngAddrIdentityDetail.vue"),
      meta: {
        layout: "DefaultLayout",
        title:
          "주소동일성 영문증명서 신청내역 상세 < 주소정보활용 | 도로명주소 안내시스템",
        secondDepth: "주소정보활용",
        menu: "주소동일성 영문증명서 발급",
      },
    },
    {
      path: "/ahh/ahhNewsBoardList",
      name: "ahhNewsBoardList",
      component: () => import("@/views/pub/ahh/ahhNewsBoardList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "언론보도 목록 < 주소소통마당 | 도로명주소 안내시스템",
        secondDepth: "주소소통마당",
        menu: "언론보도",
      },
    },
    {
      path: "/ahh/ahhNewspaperList",
      name: "ahhNewspaperList",
      component: () => import("@/views/pub/ahh/ahhNewspaperList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "언론보도 목록 < 주소소통마당 | 도로명주소 안내시스템",
        secondDepth: "주소소통마당",
        menu: "언론보도",
      },
    },
    {
      path: "/ahh/ahhContributedArticleList",
      name: "ahhContributedArticleList",
      component: () => import("@/views/pub/ahh/ahhContributedArticleList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "언론보도 목록 < 주소소통마당 | 도로명주소 안내시스템",
        secondDepth: "주소소통마당",
        menu: "언론보도",
      },
    },
    {
      path: "/ahh/ahhNewsBoardDetail",
      name: "/ahh/ahhNewsBoardDetail",
      component: () => import("@/views/pub/ahh/ahhNewsBoardDetail.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "언론보도 상세 < 주소소통마당 | 도로명주소 안내시스템",
        secondDepth: "주소소통마당",
        menu: "언론보도",
      },
    },
    {
      path: "/ahh/ahhNotifyBoardList",
      name: "ahhNotifyBoardList",
      component: () => import("@/views/pub/ahh/ahhNotifyBoardList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "불편신고 게시판 < 주소소통마당 | 도로명주소 안내시스템",
        secondDepth: "주소소통마당",
        menu: "불편신고",
      },
    },
    {
      path: "/Privacy",
      name: "Privacy.vue",
      component: () => import("@/components/common/Privacy.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "개인정보처리방침 | 도로명주소 안내시스템",
        secondDepth: "도로명주소 안내시스템",
        menu: "개인정보처리방침",
      },
    },
    {
      path: "/Terms",
      name: "Terms.vue",
      component: () => import("@/components/common/Terms.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "이용약관 | 도로명주소 안내시스템",
        secondDepth: "도로명주소 안내시스템",
        menu: "이용약관",
      },
    },
    {
      path: "/ahh/ahhLegal",
      name: "ahhLegal",
      component: () => import("@/views/pub/ahh/ahhLegal.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "법령정보 | 도로명주소 안내시스템",
        secondDepth: "도로명주소 안내시스템",
        menu: "법령정보",
      },
    },
    {
      path: "/ahh/ahhManagerInfoList",
      name: "ahhManagerInfoList",
      component: () => import("@/views/pub/ahh/ahhManagerInfoList.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "담당자 연락처 | 도로명주소 안내시스템",
        secondDepth: "도로명주소 안내시스템",
        menu: "담당자 연락처",
      },
    },
    {
      path: "/Directions",
      name: "Directions.vue",
      component: () => import("@/components/common/Directions.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "찾아오시는 길 | 도로명주소 안내시스템",
        secondDepth: "도로명주소 안내시스템",
        menu: "찾아오시는 길",
      },
    },
    {
      path: "/Sitemap",
      name: "Sitemap",
      component: () => import("@/components/common/Sitemap.vue"),
      meta: {
        layout: "DefaultLayout",
        title: "사이트맵 | 도로명주소 안내시스템",
        secondDepth: "도로명주소 안내시스템",
        menu: "사이트맵",
      },
    },
    {
      path: "/main/engMain",
      name: "engMain",
      props: true,
      component: () => import("@/views/pub/main/EngMain.vue"),
      meta: { layout: "EnMainLayout", title: "Road Name Address" },
    },
    {
      path: "/EnGuideBook",
      name: "/EnGuideBook",
      component: () => import("@/views/pub/en/EnGuideBook.vue"),
      meta: { layout: "NoneLayout", title: "About | Road name address" },
    },
    {
      path: "/map/engMapView",
      name: "engMapView",
      component: () => import("@/views/pub/map/engMapView.vue"),
      meta: {
        layout: "IntegratedMapLayout",
        title: "Maps | Road Name Address",
      },
    },
    {
      path: "/ahi/ahiEngReferBoardList",
      name: "ahiEngReferBoardList",
      component: () => import("@/views/pub/ahi/ahiEngReferBoardList.vue"),
      meta: {
        layout: "EnMainLayout",
        title: "Publications | Road Name Address",
      },
    },
    {
      path: "/ahi/ahiEngReferBoardDetail",
      name: "ahiEngReferBoardDetail",
      component: () => import("@/views/pub/ahi/ahiEngReferBoardDetail.vue"),
      meta: {
        layout: "EnMainLayout",
        title: "Publications | Road Name Address",
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const menuLog = useMenuLogStore();
  if (to.path !== "/" && document.getElementById("innorixjs") === null) {
    injectScript("/assets/innorix/innorix.js", "innorixjs", "script");
    injectScript("/assets/jquery/dist/jquery.js", "jqueryjs", "script");
    injectScript("/assets/jquery-ui/dist/jquery-ui.js", "jqueryuijs", "script");

    injectScript("/assets/innorix/innorix.css", "innorixcss", "link");
    injectScript(
      "/assets/jquery-ui/dist/themes/base/jquery-ui.css",
      "jquery-uicss",
      "link"
    );

    import("primevue/resources/themes/lara-light-teal/theme.css");
    import("primeicons/primeicons.css");
    import("bootstrap-icons/font/bootstrap-icons.min.css");
    import("@/assets/scss/_function.scss");
    import("@/assets/scss/all.scss");
    import("ol/ol.css");

    import("xml-utils");
    import("geotiff");
    import("ol/geom/flat/inflate");
    import("ol/format");
  }

  to.matched.forEach((rt) => {
    if (menuLog && to.path !== "/redirect" && to.path === rt.path) {
      menuLog.callMenuLog(to.path);
    }
  });

  if (to.path === "/") {
    document.body.classList.add("layoutMain");
    document.body.style.backgroundColor = "#f2f5fa";
  } else {
    document.body.classList.remove("layoutMain");
    document.body.style.backgroundColor = "";
  }

  return next();
});

const injectScript = (url: string, id: string, elmtType: string) => {
  const elmt = document.createElement(elmtType);
  elmt.src = url;
  elmt.id = id;
  document.getElementsByTagName("head")[0].appendChild(elmt);
};

export default router;
