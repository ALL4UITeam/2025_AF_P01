<!-- 스타일가이드 페이지용 컴포넌트.
Container.vue처럼 해당 컴포넌트도 라우터 경로에 따라 다른 가이드 콘텐츠들을 보여줍니다.

가이드 콘텐츠들은 src\components\contents\guide 폴더에 있습니다.
-->

<template>
	<ul id="skipArea" class="skipArea">
		<li><a class="outline_light" href="#GNB">메인메뉴 바로가기</a></li>
		<li><a class="outline_light" href="#CONTENT">본문 바로가기</a></li>
	</ul>

	<nav id="GNB" class="navbar navbar-expand-lg navbar-dark bg-primary">
		<div class="container">
			<router-link class="navbar-brand outline_light" to="/guide">
				<img src="@/assets/images/common/logo-juso.svg" alt="주소정보관리시스템 로고" />
			</router-link>

			<button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<i class="bi bi-list"></i>
			</button>

			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav ms-auto mb-2 mb-lg-0">
					<li class="nav-item" v-for="(item,index) in gnbs" :key="index">
						<router-link class="nav-link outline_light" :class="gnbConditions(index)" :to=item.path>{{ item.name }}</router-link>
					</li>
				</ul>
			</div>
		</div>
	</nav>

	<Index v-if="path === '/guide'"/>
	<StylePage v-else-if="path === '/guide/style'"/>
	<Pages v-else-if="$route.params.id === 'page'"/>
	<ComponentList v-else-if="path === '/guide/component'"/>
	<ButtonPage v-else-if="path === '/guide/component/button'"/>
	<FormPage v-else-if="path === '/guide/component/form'"/>
	<TabPage v-else-if="path === '/guide/component/tab'"/>
	<TableListPage v-else-if="path === '/guide/component/tablelist'"/>
	<AccordionPage v-else-if="path === '/guide/component/accordion'"/>
	<DialogBoxPage v-else-if="path === '/guide/component/dialog'"/>
	<EtcPage v-else-if="path === '/guide/component/etc'"/>
	<TopAreaPage v-else-if="path === '/guide/component/top'"/>
	<GnbPage v-else-if="path === '/guide/component/gnb'"/>
	<SearchFormPage v-else-if="path === '/guide/component/searchForm'"/>
	<SubComponentPage v-else-if="path === '/guide/component/subComponent'"/>

	<footer class="py-4">
		<div class="container">
			<div class="row">
				<div class="col-lg-6 col-xxl-6 my-2">
					<div class="text-lg-start text-xxl-start text-center">Copyright &copy; IFcommunity 2023</div>
				</div>
				<div class="col-lg-6 col-xxl-6 my-2 flex justify-content-end align-items-end">
					<div class="text-lg-end text-xxl-end text-center ms-4"><img class="ci" src="@/assets/images/guide/이프커뮤니티_영문.png" style="height:36px;" /></div>
				</div>
			</div><!-- .row -->
		</div>
	</footer>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import Index from '@/components/contents/guide/Index.vue'
import StylePage from '@/components/contents/guide/Style.vue'
import Pages from '@/components/contents/guide/Pages.vue'
import ComponentList from '@/components/contents/guide/ComponentList.vue'
import ButtonPage from '@/components/contents/guide/component/ButtonPage.vue'
import FormPage from '@/components/contents/guide/component/FormPage.vue'
import TabPage from '@/components/contents/guide/component/TabPage.vue'
import TableListPage from '@/components/contents/guide/component/TableListPage.vue'
import AccordionPage from '@/components/contents/guide/component/AccordionPage.vue'
import DialogBoxPage from '@/components/contents/guide/component/DialogBoxPage.vue'
import EtcPage from '@/components/contents/guide/component/EtcPage.vue'
import TopAreaPage from '@/components/contents/guide/component/TopAreaPage.vue'
import GnbPage from '@/components/contents/guide/component/GnbPage.vue'
import SearchFormPage from '@/components/contents/guide/component/SearchFormPage.vue'
import SubComponentPage from '@/components/contents/guide/component/SubComponentPage.vue'

const route = useRoute();

const path = computed(() =>route.path);

onMounted(() => {
  document.body.classList.add('guide_page');
  document.body.classList.add('index');
});

const gnbs = ref([
    { name: 'Home', path: '/guide' },
    { name: '스타일', path: '/guide/style' },
    { name: '컴포넌트', path: '/guide/component' },
    { name: '페이지', path: '/guide/page/1' },
]);

const gnbConditions = (index) => {
	if(path.value.startsWith('/guide/component')){
		return index === 2 && 'router-link-active';
	} else if(path.value.startsWith('/guide/page')){
		return index === 3 && 'router-link-active';
	}
}
</script>

<style lang="scss">
/* 가이드 페이지에서 적용된 다른 css들 때문에 기존 컴포넌트 스타일이 깨져서 이부분들만 따로 정의함.
(실제 페이지에서는 적용되지않음!)
*/

@import "@/assets/css/only_for_guide.css";
@import '@/assets/css/all.css';
@import '@/assets/scss/component.scss';
@import '@/assets/scss/custom.scss';
@import '@/assets/scss/util.scss';
@import '@/assets/scss/fonts.scss';

#CONTENT.guide{min-height: 773px;}

.codeArea{margin-top: 30px;
	code{font-weight: 400; font-size: 18px; line-height: 23px; letter-spacing: -0.4px; max-height: 400px; overflow-y: auto;}
	.btnCopy{display: inline-flex; justify-content: flex-end; width: 100%; font-size: 16px; font-family: 'Noto Sans';}
}

button{border: 0; background: transparent;  padding: 0;}

.descBox{margin-bottom: 20px; padding: 0;
	.desc{margin: 0;}
	.ex{font-weight: bold;}
}

.guide_page{
	.navbar-brand{
		img{object-position: -30px 0;}
	}

    .tableBox{
        .table{
            &::-webkit-scrollbar {width: 14px;}
            &::-webkit-scrollbar-thumb {border: solid transparent; background-clip: padding-box; border-radius: 8px;
            background-color: #767676;}
            &::-webkit-scrollbar-track {background-color: transparent;}
            &::-webkit-scrollbar-button{display: none;}

            p{margin-bottom: 0;}

            tr{border-style: revert; box-shadow: none;}
            th{background-color: var(--surface-g) !important;
                label{
                    &.required::after{content: '*'; font-size: inherit; font-family: inherit; color: var(--red-400);
                    margin-left: 0; line-height: inherit; vertical-align: revert;}
                }
            }

            tbody{border-top-width: 0 !important;}

            &.doubleType{
                colgroup:not(.type01){display: none;}
            }
        }
    }

	.stepWrap{
		.col{flex: none;}
		.row{flex-wrap: nowrap; margin: 0;
			>*{padding: 0; margin: 0; width: auto; max-width: none;}
		}
	}

	.titleArea{
		.text{margin: 0;}
	}

	.fixedWrap{
		.btnFixedClose{position: absolute; bottom: 20px; font-size: 18px; color: #000; font-weight: bold;}
	}

	.loadingBox{position: relative; width: 100%; height: 250px; max-width: 400px; border-radius: 6px; border: 1px solid #000;}

	.guideHeadArea{
		h2.guide{text-transform: uppercase;}
	}

	.topArea{padding: 6px; background-color: var(--surface-g);
		a{text-decoration: none; color: inherit;}
	}

	.mdiArea{
		.mdiList{padding: 0; margin: 0;}
	}

	.utilArea{
		p{margin: 0;}
	}

	.eps{width: 100%; max-width: 100%; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
		&.type01{display: table !important; table-layout: fixed;
			>*{display: table-cell; overflow: hidden; text-overflow: ellipsis;}
		}
		&.type02{width: auto; max-width: none; text-overflow: initial; white-space: initial;
		-webkit-line-clamp: 1; display: -webkit-box; -webkit-box-orient: vertical;}
	}

	.p-sidebar{
		button{margin-right: 0 !important;}
		*{line-height: initial;}
	}

	.bottomMenuArea{
		ul{padding: 0; margin: 0;}
		button{margin-right: 0 !important;}
	}

	svg{vertical-align: initial;}

	article.guide{
		&.search{
			.item{padding: 0 53px; row-gap: 40px;}
		}
	}

	.searchArea{
		button{margin: 0 !important;}
		.ico.search::before{background-color: transparent;}
		.row{margin: 0; flex-wrap: nowrap;
			.itemBox{margin: 0; padding: 0;}
			> *{width: auto; max-width: none; padding: 0; margin: 0;}
		}
		.chkList{margin: 0;
			li{list-style: none;}
		}
	}

	.stateBar{
		ul{margin: 0; padding: 0;}
	}

	.section{
		button{margin: 0 !important;}
	}

	.tabWrap{
		ul{padding: 0; margin: 0;}
	}

	.tooltip{line-height: initial;
		.tooltipText{line-height: initial;}
	}

	.favoriteArea{
		ul{padding: 0; margin: 0;}
		li{list-style: none;}
	}
}
</style>

<style scoped>
.main-wrapper{min-height: 773px;}
.router-link-active{color: #fff;}
</style>