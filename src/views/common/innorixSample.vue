<script setup>
import { onMounted, ref } from "vue";
import Button from 'primevue/button'
import axios from 'axios'


import InnorixFileUpload from '@/components/innorix/InnorixFileUpload.vue';
// import InnorixFileDownload from '@/components/innorix/InnorixFileDownload.vue';

let box = {}
let downloadBox = {}
let combineBox = {}
const fileMgno = ref('PFM20240000000002095');
const tmpfileMgno = ref('');
function openFileDialog() {
  box.openFileDialog()
}

function onUpload() {
  box.upload()
}

function downloadSelectedFiles() {
  downloadBox.downloadSelectedFiles()
}

function downloadAllFiles() {
  downloadBox.download()
}

/* combine */

function onCombineOpenFile() {
  combineBox.openFileDialog()
}

function onCombineUpload() {
  let postParams = {
    bizCode: 'aot'
  }
  combineBox.setPostData(postParams);
  // combineBox.setCustomHeader({"Authorization": localStorage.getItem("grantType") + " " + localStorage.getItem("accessToken")});
  combineBox.upload();
}

function onCombineDownloadSelectedFiles() {
  combineBox.downloadSelectedFiles()
}

function onCombineDownloadAllFiles() {
  combineBox.download()
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

const onUpdateFileMgNo = (data) => {
  console.log('onUpdateFileMgNo ', data);
  fileMgno.value = data;
}

const onDownloadUrl = (data) => {
  console.log('onDownloadUrl ', data);
}

const onImagePreview = (data) => {
  console.log('onImagePreview ', data);
}

/* 임시 */
const onTmpUpdateFileMgNo = (data) => {
  console.log('onUpdateFileMgNo ', data);
  tmpfileMgno.value = data;
}

const onTmpDownloadUrl = (data) => {
  console.log('onTmpDownloadUrl ', data);
}

const onTmpImagePreview = (data) => {
  console.log('onTmpImagePreview ', data);
}

onMounted(() => {
  const innorixUploadUrl = `/api/innorix/upload`
  box = innorix.create({
    el: '#fileControl', // 컨트롤 출력 HTML 객체 ID
    agent: false, // true = Agent 설치, false = html5 모드 사용
    installUrl: '../install/install.html', // Agent 설치 페이지
    uploadUrl: innorixUploadUrl, // 업로드 URL
    width: 300,
    height: 60
  })

  box.on('uploadComplete', function (p) {
    console.log('uploadComplete', p.files)
  })

  downloadBox = innorix.create({
    el: '#downloadBox', // 컨트롤 출력 HTML 객체 ID
    agent: false, // true = Agent 설치, false = html5 모드 사용
    installUrl: '../install/install.html', // Agent 설치 페이지
    width: 300,
    height: 60
  })

  downloadBox.on('loadComplete', function (p) {
    //const urlBase = location.href.substring(0, location.href.lastIndexOf("/") + 1);

    downloadBox.presetDownloadFiles(fileArray)
    /*axios.get(tempTop5Url, { withCredentials: true }).then(res => {
      console.log('loadComplete', res.data);
      downloadBox.presetDownloadFiles(res.data);
    });*/
  })

  combineBox = innorix.create({
    el: '#combineBox', // 컨트롤 출력 HTML 객체 ID
    // transferMode: 'both', // 업로드, 다운로드 혼합사용
    // transferMode: 'download', // 다운로드
    transferMode: 'upload', // 업로드
    agent: false, // true = Agent 설치, false = html5 모드 사용
    uploadUrl: innorixUploadUrl, // 업로드 URL
    maxFileCount: 1,
    width: 300,
    height: 60
  })

  combineBox.on('loadComplete', function (p) {
    // combineBox.presetDownloadFiles(fileArray)
  });

  combineBox.on('uploadComplete', function (p) {

    let f = p.files;
    console.log('files ', f);
    for(let i = 0; i < f.length; i++) {
      const fileObj = {
        printFileName: f[i].clientFileName,
        fileSize: f[i].fileSize,
        downloadUrl: innorixDownloadUrl + '?fileID=' + (fileArray.length + 1)
      }
      fileArray.push(fileObj)
    }
    combineBox.removeAllFiles();
    console.log(fileArray);
    // combineBox.presetDownloadFiles(fileArray);
  });
})


</script>

<template>
  <!-- contentsArea -->

  <!-- section -->
  <div class="contentWrap">
    <Panel header="Upload" class="section" toggleable>
      <div id="fileControl"></div>
      <div class="mt-1" style="display: flex">
        <button class="p-button-sm mr-1" label="파일추가" @click.prevent="openFileDialog" style="border:2px solid black; padding:10px;">파일추가</button>
        <button class="p-button-sm mr-1" label="업로드" @click.prevent="onUpload" style="border:2px solid black; padding:10px;">업로드</button>
      </div>
    </Panel>

    <Panel header="Download" class="section" toggleable>
      <div id="downloadBox"></div>
      <div class="mt-1" style="display: flex">
        <Button
          class="p-button-sm mr-1"
          label="선택 다운로드"
          severity="secondary"
          @click="downloadSelectedFiles"
        />
        <Button
          class="p-button-sm mr-1"
          label="전체 다운로드"
          severity="secondary"
          @click="downloadAllFiles"
        />
      </div>
    </Panel>

    <Panel header="Upload Download 혼용" class="section" toggleable>
      <div id="combineBox"></div>
      <div class="mt-1" style="display: flex">
        <button
          class="p-button-sm mr-1"
          label="파일추가"
          @click.prevent="onCombineOpenFile"
          style="border:2px solid black; padding:10px;"
        >파일추가</button>
        <button
          class="p-button-sm mr-1"
          label="업로드"
          @click.prevent="onCombineUpload"
          style="border:2px solid black; padding:10px;"
        >업로드</button>
        <button
          class="p-button-sm mr-1"
          label="선택 다운로드"
          severity="secondary"
          @click="onCombineDownloadSelectedFiles"
          style="border:2px solid black; padding:10px;"
        >선택 다운로드</button>

        <button
          class="p-button-sm mr-1"
          label="전체 다운로드"
          severity="secondary"
          @click="onCombineDownloadAllFiles"
          style="border:2px solid black; padding:10px;"
        >전체 다운로드</button>
      </div>
    </Panel>

    <!--            <DaipFileUpload
                  componentId="cvpl" @updateFileMgno="onUpdateFileMgNo" bizCode="ado" :fileMgno="fileMgno" class="noHeader sm" />-->
<!--    <InnorixFileUpload bizCode="ado" componentId="cvpl" @updateFileMgno="onUpdateFileMgNo"-->
<!--                       @downloadUrl="onDownloadUrl" @imagePreview="onImagePreview"-->
<!--                       :fileMgno="fileMgno" maxUploadFile="5"/>-->

<!--    <InnorixFileUpload bizCode="tmp" @updateFileMgno="onTmpUpdateFileMgNo"-->
<!--                       @downloadUrl="onTmpDownloadUrl" @imagePreview="onTmpImagePreview"-->
<!--                       :fileMgno="tmpfileMgno" maxUploadFile="5"/>-->
  </div>
</template>