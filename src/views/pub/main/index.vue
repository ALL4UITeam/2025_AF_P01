<script setup>
import { ref, reactive, computed, onMounted, defineAsyncComponent } from "vue";
import AOS from 'aos';
import MainHeader from '@components/main/MainHeader.vue';
import MainFooter from '@components/common/Footer.vue';
import MainCarousel from '@components/main/MainCarousel.vue';
import MainSearchBox from '@components/main/MainSearchBox.vue';
import MainIndustrial from '@components/main/MainIndustrial.vue';
import MainEtc from '@components/main/MainEtc.vue';
import MainEventPopup from '@components/main/MainEventPopup.vue';

const showInform = ref(false);
const showOther = ref(false);

const MainInform = defineAsyncComponent(() => import('@components/main/MainInform.vue'));
const MainOther = defineAsyncComponent(() => import('@components/main/MainOther.vue'));





import axios from 'axios';
import ContentTitle from '@/components/title/ContentTitle.vue';
import Dialog from 'primevue/dialog';
import {useUserCountLogStore} from "@/stores/userCountLog";
//import InnorixFileUpload from '@/components/innorix/JusoInnorixFileUpload.vue';


const todayNot = ref(false);

/* 이노릭스 관련 */
let downloadBox = {};
let fileArray = [];

const qaDialogVisible = ref(null);

const innorixDownloadUrl = `/api/innorix/download`;
async function downloadAllFiles() {
    for (const file of fileArray) {
        const fileMgno = file.fileMgno;
        const fileSn = file.fileSn;
        const fileDownloadUrl = `${innorixDownloadUrl}/${fileMgno}/${fileSn}`;
        try {
            const response = await axios({
                url: fileDownloadUrl,
                method: 'GET',
                responseType: 'blob'
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([response.data], { type: 'application/octet-stream' }));
            link.download = file.fileNm;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            //    console.log("error : ", error);
        }
    }
}

// 팝업 상세조회
// const popTtl = ref(null);
// const popCn = ref(null);

const popTtl = ref([]);
const popCn = ref([]);

const popupDataList = ref([])

const qaCloseDialog = () => {
    qaDialogVisible.value = false;
}



// 팝업 조회
function selectPopup() {
    axios.post('/api/jusoCommon/selectPopupList')
        .then((response) => {
            const data = response.data;
            if (data.popupList?.length > 0) {

                popupDataList.value = data.popupList.map((popupList, index) => ({
                    id: index,
                    title: popupList.popupTtl,
                    content: popupList.popupContsCn,
                    hideForToday: false,
                }))
                qaDialogVisible.value = true;
                console.log('popupDataList', popupDataList)
            }
            if (data.fileList?.length > 0) {
                fileArray = response.data.fileList;
            }
        })
        .finally(() => {
            //이노릭스 다운로드
            //downloadBox = innorix.create({
            //    el: '#downloadBox', // 컨트롤 출력 HTML 객체 ID
            //    agent: false, // true = Agent 설치, false = html5 모드 사용
            //    installUrl: '../install/install.html', // Agent 설치 페이지
            //    width: 300,
            //    height: 60
            //})
            //
            //downloadBox.on('loadComplete', function (p) {
            //    // console.log("loadComplete ->> ", p);
            //    downloadBox.presetDownloadFiles(fileArray);
            //});
        });
}

// 접속자수 통계 세부분류 추가
// 연결통계유형코드 WK00:웹(국문), WE00:웹(영문), MK00:모바일(국문), ME00:모바일(영문)
// 웹/모바일 구분은 백엔드에서 추가됨
const fnUserCountLog = () => {
  const userCountLog = useUserCountLogStore();
  userCountLog.callUserCountLog('K00');
}

//팝업 내용 줄바꿈
const formatContent = (content) => {
    return content.replace(/\n/g, '<br>');
}


//자정에 localStorage 초기화
const resetLocalStorage = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
        //자정이후에 localStorage초기화
        popupDataList.value.forEach(popup => {
            localStorage.removeItem(`popup_hidden_${popup.id}`)
        });
    }, timeUntilMidnight);


}

//팝업 필터링 : 보이지 않아야하는 팝업 제거
const filteredPopupDataList = computed(() => {
    return popupDataList.value.filter((popup) => {
        //오늘 하루 보지 않기
        if (localStorage.getItem(`popup_hiden_${popup.id}`)) {
            return false;
        }
        return true;
    })
})

//닫기버튼
const handleClose = (popup) => {
    if (popup.hideForToday) {
        //하루동안 보이지 않기 저정
        localStorage.setItem(`popup_hiden_${popup.id}`, 'true');
    }
    //팝업 리스트에서 제거
    popupDataList.value = popupDataList.value.filter((p) => p.id !== popup.id);
};

// 로드 함수
onMounted(() => {
  selectPopup();
  //[팝업]새로고침 시 로컬 스토리지 기반 초기화
  resetLocalStorage();

  // 접속자수 통계 로그
  fnUserCountLog();

  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.id === 'informSection') {
          showInform.value = true;
        } else if (entry.target.id === 'otherSection') {
          showOther.value = true;
        }
      }
    });
  }, {
    threshold: 0.1
  });

  const informSection = document.getElementById('informSection');
  const otherSection = document.getElementById('otherSection');

  if (informSection) observer.observe(informSection);
  if (otherSection) observer.observe(otherSection);
});

//팝업 다른위치 설정
const computedStyle = (popup) => {
    return {
        top: `${popup.id * 210}px`,
        left: `${popup.id * 100}px`,
        position: 'absolute'
    }
}

</script>

<template>
    <!-- <MainEventPopup /> -->

<!--    <MainCarousel />-->

<!--    <MainSearchBox />-->

    <!-- 산업서비스 -->
<!--    <MainIndustrial />-->

    <!-- 주소정보누리집이 알려드릴게요. -->
<!--    <MainInform />-->

    <!-- 도로명 국민 편의에 한발 더 가까이 -->
<!--    <MainOther />-->


  <div class="skip__navi"><a href="#mainHeaderSearch">본문바로가기</a></div>
  <MainHeader />
  <div class="content" id="contentArea">
    <MainEventPopup />
    <MainSearchBox />
    <MainCarousel />

    <!-- 산업서비스 -->
    <MainIndustrial />

    <!-- 주소정보누리집이 알려드릴게요. -->
    <div id="informSection">
      <MainInform v-if="showInform" />
    </div>

    <!-- 도로명 국민 편의에 한발 더 가까이 -->
    <div id="otherSection">
      <MainOther v-if="showOther" />
    </div>
    <MainEtc />
  </div>
  <MainFooter />






    <!-- 팝업 -->
    <!-- <div v-for="popup in popupDataList" :key="popup.id" class="mainLayerPopup" :style="computedStyle(popup)"> -->
    <div v-for="popup in filteredPopupDataList" :key="popup.id" class="mainLayerPopup" :style="computedStyle(popup)">
        <p class="mainLayerPopup__title">
            {{ popup.title }}
        </p>
        <div class="mainLayerPopup__inner">
            <p class="mainLayerPopup__text" v-dompurify-html="formatContent(popup.content)">
            </p>
        </div>
        <div class="mainLayerPopup__footer">
            <!--하루동안 보지 않기-->
            <div class="mainLayerPopup__footerCheck">
                <Checkbox :id="'checkbox_' + popup.id" :value="popup.id" v-model="popup.hideForToday" />
                <label for="'checkbox_' + popup.id">오늘 하루 보지 않기</label>
            </div>
            <Button class="mainLayerPopup__close" @click="handleClose(popup)">
                <i aria-hidden="true" class="bi bi-x-lg"></i>
                <span class="blind">닫기</span>
            </Button>
        </div>
    </div>
</template>
<!-- 팝업 -->


<!--<style lang="scss" scoped>-->
<!--@import url('@scss/contents/main/main.scss');-->
<!--</style>-->

<style lang="scss" scoped>
[data-aos] {
  pointer-events: none;
  &.aos-animate {
    pointer-events: auto;
  }
}

[data-aos="fade-up"] {
  transform: translate3d(0, 20px, 0);
  opacity: 0;
  &.aos-animate {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

[data-aos="fade-right"] {
  transform: translate3d(-20px, 0, 0);
  opacity: 0;
  &.aos-animate {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

[data-aos="fade-left"] {
  transform: translate3d(20px, 0, 0);
  opacity: 0;
  &.aos-animate {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.aos-init[data-aos][data-aos].aos-animate {
  transition-property: transform, opacity;
  transition-timing-function: ease-in-out;
}
</style>