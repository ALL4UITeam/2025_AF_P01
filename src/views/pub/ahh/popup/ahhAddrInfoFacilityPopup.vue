<script setup>
    import { ref, nextTick, computed } from "vue";
	import CustomDropdown from '@components/dropdown/CustomDropdown.vue';
	import InputGroup from 'primevue/inputgroup'
	import InputText from 'primevue/inputtext'
    import Button from 'primevue/button'
    import DataTable from 'primevue/datatable'
    import Column from 'primevue/column'
    import Dialog from 'primevue/dialog';
    import Textarea from 'primevue/textarea';
    import FileUpload from 'primevue/fileupload';
	import CustomVerticalDataTable from '@components/table/CustomVerticalDataTable.vue';

    //셀렉트박스
    const selectedItem1 = ref(null);
    const selectedItem2 = ref(null);
    const items1 = ref([
        {label:'서울특별시', value:'11'},
        {label:'부산광역시', value:'26'},
    ]);
    const items2 = ref([
        {label:'시/군/구', value:'1'},
        {label:'시/군/구', value:'2'},
    ]);

    //테이블
    const users = ref([
        {
            no:'1', 
            title:'usertext1', 
            date:'n22@maver.cpm',
            inquiry:'n22@maver.cpm',
            attachment:'n22@maver.cpm',
        },
    ]);

    const columns = ref([
        {field: 'no', header: 'No', sortable:false},
        {field: 'title', header: '문의내용', sortable:false},
        {field: 'inquiry', header: '조회', sortable:false},
        {field: 'date', header: '등록일', sortable:false},
        {field: 'attachment', header: '첨부', sortable:false},

    ])

    const rows = ref(10);
    const totalRecords = ref(50);

    const onPageUpdate = (event) => {
        console.log(event);
    }

    const caption = ref('dsadsadas');


    //모달팝업
    const dialogVisible = ref(false);
    const selectedProduct = ref({});
    const openButton = ref(null);
    const contentState = ref('dafault');
    
    console.log('contentState.value', contentState.value);

    
    const showDialog = (event) => {
        contentState.value = 'dafault';
        dialogVisible.value = true;
        openButton.value = event.target;
    }
    const closeDialog = () => {
        contentState.value = 'default';
        dialogVisible.value = false;
    }
    const onShowDialog = async() => {
        await nextTick();
        const dialogElement = document.getElementById('test');
        // const dialogElement = document.querySelector('p-dialog');
        if (dialogElement) {
        dialogElement.focus();
        }  
    }
    const onHideDialog = async() => {
        await nextTick();
        openButton.value.focus();
    }
    const dialogTitle = computed(() => {
        switch (contentState.value) {
            case 'default':
            return 'default타이틀';
            case 'register1':
            return 'register1타이틀';
            case 'register2':
            return 'register2타이틀';
        }
    })

    //textarea - 주소정보시설물 훼손신고
    const textareaValue = ref('');
    const textareaValueLength = computed(() => textareaValue.value.length);

    //파일 업로드 - 주소정보시설물 훼손신고
    const fileName =ref('');

    //시/도
    const selectedItemRef01 = ref(null);
    const city1 = ref([
    {label:'서울특별시', value:'11'},
    {label:'부산광역시', value:'26'},
    {label:'대구광역시', value:'27'},
    {label:'인천광역시', value:'28'},
    {label:'광주광역시', value:'29'},
    {label:'대전광역시', value:'30'},
    {label:'울산광역시', value:'31'},
    {label:'세종특별자치시', value:'36'},
    {label:'경기도', value:'41'},
    {label:'강원특별자치도', value:'51'},
    {label:'충청북도', value:'43'},
    {label:'충청남도', value:'44'},
    {label:'전북특별자치도', value:'52'},
    {label:'전라남도', value:'46'},
    {label:'경상북도', value:'47'},
    {label:'경상남도', value:'48'},
    {label:'제주특별자치도', value:'50'},
    ]);

    //시/군/구
    const selectedItemRef02 = ref(null);
    const county1 = ref([
        {label:'강남구', value:'ny'},
        {label:'강동구', value:'nr'},
        {label:'성북구', value:'nm'},
        {label:'도봉구', value:'sd'},
    ]);

</script>

<template>
    <h3 class="common__title01">불편신고 게시판</h3>

    <dl>
        <dt>불편신고 게시판 이용 안내</dt>
        <dd>주소정보시설물 훼손신고 및 기타 불편신고 내역을 안내하는 게시판 입니다.</dd>
        <dd>불편신고 등록하기를 이용하여 간편하게 신고할 수 있습니다. (모바일 웹에서도 이용 가능)</dd>
    </dl>

    <div>
        <Button 
        @click="showDialog($event)" 
        title="등록하기"
        :aria-controls="dialogVisible ? 'dlg' : null"
        :aria-expanded="dialogVisible ? true : false"
        >
        등록하기
        </Button>
        <Button title="나의 문의내역(본인인증을 하지 않았을 경우 본인인증 새창으로 열림)">나의 문의내역</Button>
    </div>

    <div>
        <strong>검색조건</strong>
        <CustomDropdown :options="items1" v-model="selectedItem1" title="시/도" placeholder="시/도" />
        <CustomDropdown :options="items2" v-model="selectedItem2" title="시/도/구" placeholder="시/도/구" />

        <Button icon="bi bi-search" severity="warning" title="검색" />
    </div>

    <CustomVerticalDataTable 
        :caption="caption"
        :items="users" 
        :columns="columns" 
        :paginator="true" 
        :rows="rows" 
        :totalRecords="totalRecords" 
        :rowPageOption="[10,20,30]"
        @update:page="onPageUpdate" 
    />
    <Dialog id="dlg" 
    :visible="dialogVisible" 
    modal 
    :closable="false" 
    @hide="onHideDialog"
    @show="onShowDialog">
        <template #header>
        {{dialogTitle}}
        <Button id="test" @click="closeDialog">닫기</Button>
        </template>
        <div v-if="contentState === 'dafault'">
            <ul>
                <li>
                    <p>주소정보시설물 훼손신고</p>
                    <Button @click="contentState = 'register1'" label="주소정보시설물 훼손신고 등록하기" >등록하기</Button>
                </li>
                <li>
                    <p>기타 불편신고</p>
                    <Button @click="contentState = 'register2'" label="기타 불편신고 등록하기">등록하기</Button>
                </li>
            </ul>
        </div>
        <div v-else-if="contentState === 'register1'">
            <div>
                <span>*</span>필수입력
            </div>
            <p>지역선택</p>
            <div>
                <CustomDropdown :options="city1" v-model="selectedItemRef01" title="시/도선택" placeholder="시/도" />
                <CustomDropdown :options="county1" v-model="selectedItemRef02" title="시/군/구선택" placeholder="시/군/구" />
            </div>
            <p>사진첨부</p>

            <div>
                <InputText :value="fileName" readonly />
                <FileUpload mode="basic" :auto="true" name="demo[]" url="./upload" customUpload  chooseLabel="파일선택"  />
            </div>

            <ul>
                <li>※ 첨부가능한 파일 확장자 : jpg, jpeg, png</li>
                <li>※ 첨부파일 최대크기 : 10MB</li>
            </ul>

            <div class="">
                <p class="">신고내용 
                    <span class="">(별도 의견이 있는 경우 300자 이내로 입력)</span>
                </p>
                <div><span class="">{{textareaValueLength}}</span>/300</div>
            </div>

            <Textarea v-model="textareaValue" autoResize rows="5" cols="30"></Textarea>

            <p>※ 신고를 위해서는 본인인증(휴대폰, 아이핀) 절차가 필요합니다.
            </p>

            <Button label="등록하기">등록</Button>
            <Button @click="contentState = 'dafault'" label="글쓰기 취소">취소</Button>
        </div>
        <div v-else-if="contentState === 'register2'">
            <p>ㄹㅇㄴ</p>
            
            <Button @click="contentState = 'dafault'" label="글쓰기 취소">취소</Button>
        </div>
    </Dialog>
</template>


<style lang="scss" scoped>

</style>