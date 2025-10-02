<template>
    <div class="header__certification" v-if="isvisible == true">
        본인인증
        <span class="on">ON</span> 
        <span id="time">{{ time }}</span> 
        <PrimeButton @click="cancelAuth" class="clear" title="로그인 인증해제">인증해제</PrimeButton>
    </div>
    <!-- ※개발환경에서 임시로 편리하게 인증하여 게시물을 조회하기위한 마크업으로 개발 완료 후 삭제나 주석 처리 -->
    <div class="header__certification type02"  v-else>
        <PrimeButton @click="tmpCertification" class="clear" title="임시 인증하기">인증하기</PrimeButton>
    </div>
</template>


<script>
import { useRouter } from 'vue-router';

import axios from 'axios';
import Button from 'primevue/button'

//포스트 메세지 콘솔창 테스트  : 
export default {
    name: 'CertificationDuration',
    components:{
        PrimeButton : Button,
    },
    data() { 
        const router = useRouter();

        return {
            router : router,
            isvisible : false,
            totalSeconds: 30 * 60, 
            intervalId: null,
            time : '29 : 59'
        };
    },
    mounted() {

        //인증 요청 정보 호출
        axios.post('/api/common/certificationKG/chkCertified')
            .then((res) => {
                console.log("인증 여부 체크 " + res.data.results.isCertified);
                if (res.data.results.isCertified == true) {
                    this.startTimer();
                    this.isvisible = true;
                }
            })
            .catch(error => {
                console.error("error =>", error);
            }); 
    },
    beforeUnmount() {
        clearInterval(this.intervalId);
    },
    methods: {
        cancelAuth() {
            clearInterval(this.intervalId);

            //인증 요청 정보 호출
            axios.post('/api/common/certificationKG/clearCertInfo', '')
                .then((res) => {
                    if (res.data.results.success == true) {
                        this.isvisible = false;
                        alert("본인인증이 해제되었습니다.");
                    }
                })
                .catch(error => {
                    console.error("error =>", error);
                });
        },
        startTimer(){
            this.formattedTime();

            this.intervalId = setInterval(()=>{
                if(this.totalSeconds == 300){
                    this.totalSeconds--
                    if(confirm("인증시간이 5분 미만으로 남았습니다. 연장하시겠습니까?")){
                        this.totalSeconds = 30 * 60
                    }
                }
                else if(this.totalSeconds > 0){
                    this.totalSeconds--
                    this.formattedTime();
                }
                else{
                    this.cancelAuth();
                    this.isvisible = false;
                    
                    alert("인증시간 만료로 본인인증이 해제 되었습니다.");

                    this.router.push({ 
                        path: '/'
                    });
                }
            }, 1000);
        },
        formattedTime() {
            const min = String(Math.floor(this.totalSeconds / 60)).padStart(2, '0')
            const sec = String(this.totalSeconds% 60).padStart(2,'0')

            this.time = min + ":" + sec; 
            
        },
        tmpCertification(){
            let ciIdntfr = prompt("임시인증할 CI나 DI 코드를 입력해주세요.\n(조회할 게시물의 CI, DI값)")

            if(ciIdntfr != "" && ciIdntfr != null){
                axios.get('/api/common/certificationKG/setCiIdntfr',{params : {ciIdntfr : ciIdntfr}})
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
            else if (ciIdntfr == ""){
                alert("인증할 CI나 DI 코드를 입력해야 임시인증이 진행됩니다.");
            }
        }
    }
};
</script>
<style>
    .header__certification.type02{
        padding: 6px 7px 6px 7px;
        min-width: unset;
    }
    .header__certification.type02 button{
        margin-left: 0px;;
    }
</style>