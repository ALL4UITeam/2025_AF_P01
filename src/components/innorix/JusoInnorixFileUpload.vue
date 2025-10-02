<template>
 	<div class="fileUpload innorixBackground" :class="props.job">
		<Panel header="Upload">
			<div :id="props.job"></div>
		</Panel>
	</div>
	<div class="innorixButtonBox">
		<Button class="innorixButtonBox__button type01" label="파일첨부" @click.prevent="openFileDialog" title="파일첨부하기"/>
	</div>
</template>
<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import Panel from 'primevue/panel';
import lodash from "lodash";
import $common from "@/common/common";
import axios from 'axios';
import Button from 'primevue/button'
import('/public/assets/innorix/innorix.css');

/**
 * type01 (jpg, jpeg, png) - 불편신고
 * type02 (txt, xls, xlsx) - 3000건 주소전환
 * type03 (txt) - 100만건 주소전환 
 * type04 (pdf) - 주소동일성 영문증명서 발급
 */

const props = defineProps({
    job : {
      type: String,
      required: true,
    },
    fileArray: {
		type: Array,
		default: () => [],
	}
});

defineExpose({ onUpload, deleteFile });
let box = {};
let cnt = 0;
let isFileAttached = false;

const emit = defineEmits(['files-added', 'send-fileMgno']);
const openFileDialog = () => {
	box.openFileDialog();
}

function onUpload() {
	if (box.fileList.files.length == 0 ||box.fileList.files == null) {
		alert('첨부된 파일이 없습니다.');
		return false;
	}
	box.upload();
}

function deleteFile() {
	box.removeAllFiles();
	if (props.job === 'type04') {
		isFileAttached = false;
	}
}

function removeSession() {
	axios.post('/api/innorix/removeFileMgNo', null)
		.then((response) => {
			console.log("response -> ", response);
		})
		.catch((error) => {
			console.error("error =>", error);
		});
}

onMounted(() => {
	let innorixUploadUrl = `/api/innorix/upload`;
  
	if(props.job == 'type02'){ 
		//100만건 주소전환
		innorixUploadUrl = `/api/innorix/addressTransformThousandUpload`;
	}else if(props.job == 'type03'){ 
		//3000건 주소전환
		innorixUploadUrl = `/api/innorix/addressTransformMillionUpload`;
	}
  
	box = innorix.create({
		el: '#' + props.job,					// 컨트롤 출력 HTML 객체 ID
		agent: false, 							// true = Agent 설치, false = html5 모드 사용
		installUrl: '../install/install.html',	// Agent 설치 페이지
		uploadUrl: innorixUploadUrl,			// 업로드 URL
		width: '100%',
		height: '60px',
	})
	
	//초기화 이벤트
	box.on('loadComplete', function () {
		console.log("props.fileArray", props.fileArray);
		//주소동일성 영문증명서, 기존 첨부파일 존재시 파일트리에 로드
		if (props.job == 'type04') { 
			if (props.fileArray.length > 0 && props.fileArray[0].fileMgno != "") {
				const url = `/api/innorix/upload`
				const formattedFileArray = props.fileArray.map((file, index) => ({
					printFileName: file.printFileName,
					fileSize: file.fileSz || 0,
					downloadUrl: `${url}?fileID=${index + 1}`,
				})) 
				box.presetDownloadFiles(formattedFileArray);
				isFileAttached = true;
			}
		}
	}) 
 
	//업로드 완료 이벤트
	box.on('uploadComplete', function (p) {
		console.log('uploadComplete ->', p);
		if(props.job == 'type04' || props.job == 'type03' || props.job == 'type02'){
			emit('send-fileMgno', p.files[0]);
		} else {
			emit('send-fileMgno', p.files[0].fileMgNo);
		}
		removeSession();    
	})
  
	box.on('beforeAddFiles', function(p) {
		console.log('beforeAddFiles ->', p);
		if(props.job === 'type04') {
			const file = p[0].file.name;
			const fileType = file.split('.').pop().toLowerCase();
		  
			if(fileType !== 'pdf') {
				alert('불가능');
				return false;
			}
		}
	})
	  
	//파일첨부 이후 이벤트
	box.on('afterAddFiles', function(p) {
		console.log('afterAddFiles -> ', p);
		//주소전환, 주소동일성 파일 첨부개수 1개 초과시 이전 인덱스의 첨부파일 제거
		if ((props.job == 'type02' || props.job == 'type03' || props.job == 'type04') && box.fileList.files.length > 1) {
			cnt = box.fileList.files.length;
			for (var i=1; i<cnt; i++) {
				box.removeFileByIndex(0);
			}
			emit('files-added',box.fileList.files);
		}
		
		if (props.job == 'type04') {
			//주소동일성 영문증명서 발급
			if (p[0].file) {
				const file = p[0].file.name;
				const fileType = file.split('.').pop().toLowerCase();
			
				if (fileType !== 'pdf') {
					alert('지원하지 않는 형식의 파일입니다.\n다시 선택하여 주십시오.');
					box.removeAllFiles();
					isFileAttached = false;
				} else {
					emit('files-added', p);
					isFileAttached = true;
				}
			} else {
				const fileType = p[0].printFileName.split('.').pop().toLowerCase();
			
				if (fileType !== 'pdf') {
					alert('지원하지 않는 형식의 파일입니다.\n다시 선택하여 주십시오.');
					box.removeAllFiles();
					isFileAttached = false;
				} else {
					emit('files-added', p);
					isFileAttached = true;
				}
			}
		} else if (props.job == 'type01') { 
			//불편신고
			const fileType = p[0].printFileName.split('.').pop().toLowerCase();
		
			if (fileType != 'jpg' && fileType != 'png' && fileType != 'jpeg') {
				alert("불편신고는 jpg, jpeg, png 파일 첨부만 지원합니다.");
				box.removeFileByIndex(box.fileList.files.length-1);
				isFileAttached = false;
			} else {
				emit('files-added', p);
				isFileAttached = true;
			}
			
			if (box.fileList.files.length > 6) {
				alert("파일은 6개까지 첨부가능합니다.");
				cnt = box.fileList.files.length;
				for (var i=6; i<cnt; i++) {
					box.removeFileByIndex(6);
				}
				emit('files-added',box.fileList.files);
			}
			
		} else {
			emit('files-added',box.fileList.files);
		}
		const element = document.getElementsByClassName("btn-group");
		element[0].style.removeProperty("display");
	});
  
	box.on('beforeRemoveFiles', function(p) {
		console.log("beforeRemoveFiles -> ", p);
		if(props.job == 'type04') {
			if(p != undefined) {
				isFileAttached = false;
				p[0] = "";
				emit('files-added', p);
			}
		}
	});
})

</script>
<style lang="scss">
.innorixBackground {
    .innorix_basic div.irx_infoBox {
      background: transparent;
    }
    &.type01 {
        .innorix_basic {
            background:#fff url('@images/common/bg_innorix01.png') no-repeat 50%;
        }
    }
    &.type02 {
        .innorix_basic {
            background:#fff url('@images/common/bg_innorix02.png') no-repeat 50%;
        }
    }
}
</style>
