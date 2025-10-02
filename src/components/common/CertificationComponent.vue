<template>
    <PrimeDialog class="commonDialog" id="dlg" :visible="certificationShow" :closable="false" modal @hide="onHideDialog" 
        :aria-controls="certificationShow ? 'dlgExample' : null" :aria-expanded="certificationShow ? true : false">
        <template #header>
            <PrimeButton id="dialogFocus" class="dialogCloseButton" @click="closeDialog">
                <i class="bi bi-x"></i><span class="blind">팝업닫기</span>
            </PrimeButton>
        </template>
        <ContentTitle title="본인 인증" fontSize="30px" marginTop="0" mobileFontSize="20px" />
        <ul class="identityVerification">
            <li class="type01">
                <p class="identityVerification__title">사용중인<br /><strong>휴대폰에 설치된 앱</strong>으로 간편 인증</p>
                <div class="identityVerification__buttonWrap">
                    <PrimeButton class="identityVerification__button" title="간편 인증하기" @click.prevent="requestKGAuth('01')">
                        <span class="identityVerification__text">간편 인증</span>
                        <i class="bi bi-arrow-right"></i>
                    </PrimeButton>
                </div>
            </li>
            <li class="type02">
                <p class="identityVerification__title">사용중인<br /><strong>휴대폰 전화번호</strong>로 인증</p>
                <div class="identityVerification__buttonWrap">
                    <PrimeButton class="identityVerification__button" title="휴대폰 인증하기" @click.prevent="requestKGAuth('03')">
                        <span class="identityVerification__text">휴대폰 인증</span>
                        <i class="bi bi-arrow-right"></i>
                    </PrimeButton>
                </div>
            </li>
        </ul>
    </PrimeDialog>
</template>


<script>
import { ref, nextTick } from "vue";
import { useRouter } from 'vue-router';

import axios from 'axios';
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';
import ContentTitle from '@/components/title/ContentTitle.vue';

//포스트 메세지 콘솔창 테스트  : 
export default {
    name: 'CertificationComponent',
    props: {
        show: {
            type: Boolean,
            default: true
        },
        redirectTo: {
            type: String,
            default :"/"
        }
    },
    watch: {
        show(newVal) {
            this.certificationShow = newVal;
        },
        redirectTo(newVal){
            this.certificationRedirectTo = newVal;
        }
    },
    components:{
        PrimeButton : Button,
        PrimeDialog : Dialog ,
        ContentTitle,
    },
    data(props) { 

        const router = useRouter();

        return {
            certificationShow: ref(props.show), 
            certificationRedirectTo: ref(props.redirectTo),
            router : router,
            popupWindow : null
        };
    },
    mounted() {
        window.addEventListener('message', this.handleMessage);
    },
    beforeUnmount() {
        window.removeEventListener('message', this.handleMessage);
    },
    methods: {
        handleMessage(event) {
            if (event.source !== this.popupWindow) return;

            const msg = event.data;
            
            if (msg?.type != 'INICIS_AUTH_COMPLETE' && msg?.type != 'NICE_AUTH_COMPLETE') return;
            
            if(msg?.authProvider == 'temporary'){
                let ciIdntfr = msg?.ciIdntfr;
                console.log(ciIdntfr);
                if(ciIdntfr != "" && ciIdntfr != null){
                    axios.get('/api/common/certificationKG/setCiIdntfr', {params: {ciIdntfr: ciIdntfr}})
                        .then((res) => {
                            if (res.data.results.success == true) {
                                this.isvisible = true;
                                this.startTimer();
                            } 
                        })
                        .catch(error => {
                            console.error("error =>", error);
                        });
                }
                else if (ciIdntfr == "" || ciIdntfr == null){
                    alert("인증할 CI나 DI 코드를 입력해야 임시인증이 진행됩니다.");
                    return false;
                }
            }

            if (msg?.type == 'INICIS_AUTH_COMPLETE' || msg?.type == 'NICE_AUTH_COMPLETE'){
            	if (this.certificationRedirectTo == "/ahh/ahhNotifyBoardList") {
                    this.certificationShow = false;
                    this.$emit('popupClose', true);
                    this.$emit('job');
            	} else if (this.certificationRedirectTo == "/aht/AhtAddressTransformOffer"){
                    this.certificationShow = false;
                    this.$emit('popupClose', true);
                    this.$emit('job');
            	} else if (this.certificationRedirectTo == "/ahh/ahhEngAddrIdentityList"){
                    this.certificationShow = false;
                    this.$emit('popupClose', true);
                    this.$emit('job');
            	} else {
	                this.router.push({ 
	                    path: this.certificationRedirectTo, 
	                    state: { data : JSON.stringify('{}') }
	                });
            	}
            }
            else{
                alert("알수없는 이유로 인증에 실패했습니다.\n잠시 후 다시 시도해주세요.");
            }
            window.removeEventListener('message', this.handleMessage);
        },
        onShowDialog() {
            this.certificationShow = true;
        },
        closeDialog() {
            this.certificationShow = false;
            this.$emit('popupClose', true);
        },
        async onHideDialog(){
            await nextTick();
        },
        requestKGAuth(reqSvcCd) {
            
            const width = 400;
            const height = 640;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            const certificationInfo = {
                redirectTo: this.certificationRedirectTo,
                reqSvcCd : reqSvcCd,//["01":간편인증, "02":전자서명, "03":본인확인]
            };

            //인증 요청 정보 호출
            axios.post('/api/common/certificationKG/request', certificationInfo)
            .then((res) => {
                if (res.data != '') {
                	console.log(123);

                    this.popupWindow = window.open('', 'sa_popup', `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`);

                    if (!this.popupWindow) {
                        alert('팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.');
                        return;
                    }

                    //폐쇄망에서 인증 SKIP을 위한 코드
                    let html =
                    "<!DOCTYPE html>" +
                    "<html><head><meta charset=\"UTF-8\"></head><body>" +
                    "<script>" +
                    "    let ciIdntfr = prompt('폐쇄망이므로 임시인증을 진행합니다. 임시인증할 CI나 DI 코드를 입력해주세요. (조회할 게시물의 CI, DI값)');" +
                    "    window.opener.postMessage(" +
                    "        {authProvider : 'temporary', type: 'INICIS_AUTH_COMPLETE', ciIdntfr : ciIdntfr }," +
                    "        '*'" +
                    "        );" +
                    "    window.close();" +
                    "<\/script>" +
                    "</body></html>";

                    this.popupWindow.document.write(html);

                    //popupWindow.document.write(res.data);
                    this.popupWindow.document.close(); // <- 이거 빠지면 onload 이벤트 작동 안 함
                } else {
                    alert('인증 요청 데이터를 불러올 수 없습니다.\n잠시 후 다시 시도해주세요.');
                }
            })
            .catch(error => {
                console.error("error =>", error);
            });
        },
    }
};
</script>