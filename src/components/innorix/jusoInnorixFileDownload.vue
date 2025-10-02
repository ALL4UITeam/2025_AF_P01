<template>
  <Panel header="Download" >
    <div id="downloadBox"></div>
    <button label="선택 다운로드" @click="downloadSelectedFiles">선택 다운로드</button>
    <button label="전체 다운로드" @click="downloadAllFiles">전체 다운로드</button>
  </Panel>
</template>

<script setup>
import { onMounted, ref, defineProps } from "vue";
import axios from 'axios';

const props = defineProps({
	fileArray: {
		type: Array,
		default: () => [],
	}
})

let downloadBox = {}
const fileMgno = ref('PFM20240000000002095');
const tmpfileMgno = ref('');

function downloadSelectedFiles() {
  downloadBox.downloadSelectedFiles()
}

async function downloadAllFiles() {
	for(const file of props.fileArray) {
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
			link.href = URL.createObjectURL(new Blob([response.data], {type: 'application/octet-stream'}));
			link.download = file.fileNm
			console.log("link", link);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch(error) {
			console.log("error : ", error);
		}
	}
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
	console.log("props.fileArray : ", props.fileArray);
  const innorixUploadUrl = `/api/innorix/upload`

  downloadBox = innorix.create({
    el: '#downloadBox', // 컨트롤 출력 HTML 객체 ID
    agent: false, // true = Agent 설치, false = html5 모드 사용
    installUrl: '../install/install.html', // Agent 설치 페이지
    width: '100%',
    height: '100%',
    multiSelect: true
  });
  
  console.log("downloadBox : ", downloadBox);
  
  const formattedFileArray = props.fileArray.map((file, index) => ({
	  printFileName: file.fileNm,
	  fileSize: file.fileSz || 0,
	  downloadUrl: `${innorixUploadUrl}?fileID=${index + 1}`,
  }))
  
  console.log("formattedFileArray : ", formattedFileArray);

  downloadBox.on('loadComplete', function () {
    downloadBox.presetDownloadFiles(formattedFileArray)
  })
})
</script>