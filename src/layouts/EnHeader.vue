<template>
	<ul id="skipArea" class="skip__navi">
	    <li><a href="javascript:void(0);">Contents Quick View</a></li>
	</ul>
	
	<div class="enHeader">
	    <h1 class="enHeader__enLogo"><a href="/main/engMain"><img src="@images/en/img_logo_en.png" alt="Road Name Address" /></a></h1>
	    <ul class="enHeader__list">
	        <li>
	            <router-link to="/main/engMain" class="enHeader__mainMenu">About <i aria-hidden="true" class="bi bi-box-arrow-up-right"></i></router-link>
	        </li>
	        <li>
	            <router-link to="/main/engMain" @click="fnMoveEngMap" class="enHeader__mainMenu">Maps <i aria-hidden="true" class="bi bi-box-arrow-up-right"></i></router-link>
	        </li>
	        <li>
	            <router-link to="/ahi/ahiEngReferBoardList" class="enHeader__mainMenu">Publications</router-link>
	        </li>
	    </ul>
	    <div class="enHeader__etcFunction">
	        <Button class="enHeader__language" @click="fnMoveKorMain">KR</Button>
	    </div>
	</div>
</template>
<script setup>
import Button from 'primevue/button'

//영문지도 팝업 오픈
const fnMoveEngMap = () => {
	const url = '/map/engMapView';
	const width = window.innerWidth;
	const height = window.innerHeight;
	window.open(url, 'popup', `width=${width},height=${height},scrollbars=yes,fullscreen=yes`);
	window.scrollTo({top:0, behavior: 'smooth'});
}

//국문 메인 이동
const fnMoveKorMain = () => {
	window.location.href = '/';
}

</script>
<style lang="scss" scoped>
@import url('@scss/contents/en/enMain.scss');
</style>