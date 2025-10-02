<template>
  <Dialog class="commonDialog" id="certification" :visible="certificationDialogVisible" modal :closable="false"
    :aria-controls="certificationDialogVisible ? 'certification' : null" :aria-expanded="certificationDialogVisible ? true : false" >
    <template #header>
      <Button id="certificationDialogFocus" class="dialogCloseButton" @click="fnHideCertificationDialog">
        <i aria-hidden="true" class="bi bi-x" /><span class="blind">팝업닫기</span>
      </Button>
    </template>
    <ContentTitle title="본인 인증" fontSize="30px" marginTop="0" mobileFontSize="20px" />
    <ul class="identityVerification">
      <li class="type01">
        <p class="identityVerification__title">사용중인<br /><strong>휴대폰 전화번호</strong>로 인증</p>
        <div class="identityVerification__buttonWrap">
          <Button class="identityVerification__button" title="휴대폰 인증하기" @click.prevent="fnPhoneCertification">
            <span class="identityVerification__text">휴대폰 인증</span>
            <i aria-hidden="true" class="bi bi-arrow-right" />
          </Button>
        </div>
      </li>
      <li class="type02">
        <p class="identityVerification__title">본인 명의<br /><strong>아이핀 계정</strong>으로 인증</p>
        <div class="identityVerification__buttonWrap">
          <Button class="identityVerification__button" title="아이핀 인증하기" @click.prevent="fnIpinCertification">
            <span class="identityVerification__text">아이핀 인증</span>
            <i aria-hidden="true" class="bi bi-arrow-right" />
          </Button>
        </div>
      </li>
    </ul>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import ContentTitle from '@components/title/ContentTitle.vue';

let pType = '';
//본인 인증 임시
const certificationDialogVisible = ref(false);

// 모달 열기
const fnShowCertificationDialog = (type) => {
  if (type){
    pType = type;
  } else {
    pType = '';
  }
  certificationDialogVisible.value = true;
  setTimeout(() => {
    document.querySelector('#certificationDialogFocus.dialogCloseButton').focus();
  }, 0);
}

// 모달 닫기
const fnHideCertificationDialog = () => {
  certificationDialogVisible.value = false;
  document.querySelector('#certificationOnShowDialog').focus();
  emit('fnCloseModal');
}

// 휴대폰 인증
const fnPhoneCertification = () => {
  certificationDialogVisible.value = false;
  document.querySelector('#certificationOnShowDialog').focus();
  fnGetDpcnIdntyCdNm();
}

// 아이핀 인증
const fnIpinCertification = () => {
  certificationDialogVisible.value = false;
  document.querySelector('#certificationOnShowDialog').focus();
}

// 인증키 생성 후 전달
const fnGetDpcnIdntyCdNm = () => {
  emit('fnGetDpcnIdntyCdNm', {di : 'MC0GCCqGSIb3DQIJAyEAE3DZOmiaTxsIITcXi2POls8EbbDMvgY7bxgNQ3Rhris=', type: pType});
}

const emit = defineEmits(['fnGetDpcnIdntyCdNm', 'fnCloseModal']);

defineExpose({
  fnShowCertificationDialog,
  fnHideCertificationDialog,
  fnGetDpcnIdntyCdNm
});

</script>