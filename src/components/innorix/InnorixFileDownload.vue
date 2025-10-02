<template>
  <Panel header="Download" >
    <div id="downloadBox"></div>
    <button label="선택 다운로드" @click="downloadSelectedFiles">선택 다운로드</button>
    <button label="전체 다운로드" @click="downloadAllFiles">전체 다운로드</button>
  </Panel>
</template>

<script setup>
import { onMounted, ref } from "vue";

let downloadBox = {}
const fileMgno = ref('PFM20240000000002095');
const tmpfileMgno = ref('');

function downloadSelectedFiles() {
  downloadBox.downloadSelectedFiles()
}

function downloadAllFiles() {
  downloadBox.download()
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


onMounted(() => {
  const innorixUploadUrl = `/api/innorix/upload`

  downloadBox = innorix.create({
    el: '#downloadBox', // 컨트롤 출력 HTML 객체 ID
    agent: false, // true = Agent 설치, false = html5 모드 사용
    installUrl: '../install/install.html', // Agent 설치 페이지
    width: '100%',
    height: '100px'
  })

  downloadBox.on('loadComplete', function (p) {
    downloadBox.presetDownloadFiles(fileArray)
  })
})
</script>