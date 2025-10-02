
<script setup>
import { onMounted, ref } from "vue";
import Panel from 'primevue/panel';

let box = {}
const fileMgno = ref('PFM20240000000002095');
const tmpfileMgno = ref('');

const openFileDialog = () => {
  box.openFileDialog()
}

const onUpload = () => {
  let postParams = {
    bizCode: 'aot'
  }
  box.setPostData(postParams)
  box.upload()
}

const innorixDownloadUrl = `/api/innorix/download`
const fileArray = [
  {
    printFileName: 'INNORIX WP 브로셔.pdf',
    fileSize: 877745,
    downloadUrl: innorixDownloadUrl + '?fileID=1'
  },
  {
    printFileName: 'INNORIX WP Brochure.pdf',
    fileSize: 2853506574,
    downloadUrl: innorixDownloadUrl + '?fileID=2'
  }
]

const isText= ref(true);

onMounted(() => {
  const innorixUploadUrl = `/api/innorix/upload`

  box = innorix.create({
    el: '#fileControl', // 컨트롤 출력 HTML 객체 ID
    agent: false, // true = Agent 설치, false = html5 모드 사용
    installUrl: '../install/install.html', // Agent 설치 페이지
    uploadUrl: innorixUploadUrl, // 업로드 URL
    width: '100%',
    height: '60px'
  })


  box.on('afterAddFiles', function (p) {
    console.log('afterAddFiles', p.files)
    
  })

  const ircElements = document.querySelectorAll('.irx-preview-image');
  ircElements.forEach((el) => {
    el.setAttribute('alt', '사용안하는 이미지');
  })

  box.on('uploadComplete', function (p) {
    console.log('uploadComplete', p.files)
    
    console.log('테스트', isText.value);
    isText.value = !isText.value;
  })


})
</script>
<template>
<div class="fileUpload">
    <Panel header="Upload" >
      <div id="fileControl"></div>
      <button @click="openFileDialog"><span class="blind">파일첨부</span></button>
    </Panel>
</div>
</template>


<style lang="scss">

</style>

