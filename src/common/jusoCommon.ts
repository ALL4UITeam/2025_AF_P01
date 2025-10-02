
import { useCookies } from 'vue3-cookies'
import { useLoadingStore } from '@/stores/ui.loading';
import { useMsgBoxStore, MessageBoxButtons, DialogResult } from "@/stores/ui.msgBox";
import { ref, computed, onMounted, watchEffect, onBeforeUnmount, reactive } from "vue";
import axios from 'axios';


// jQuery 전역 함수

// TypeScript 타입 : https://www.typescriptlang.org/docs/handbook/basic-types.html

//시도 데이터 AXIOS
export async function sidoDataLoad () {
  try {
		const response = await axios.post('/api/jusoCommon/selectSidoList')
    const dataArray = response.data;
		
      if(Array.isArray(dataArray)){
        return dataArray.map((item) => ({
          value: item.ctpvCd,
		  label: item.ctpvNm
        }));
      }else {
        // console.error ('Data is not an array:' , dataArray)
        return [];
      }
    }catch (error){
      console.log('ERROR', error)
      // return [];
    }
  }

// export const sggList = ref([]);
// export const sggDataLoad = async (ctpvCd : number) => {
//   try{
//     const response = await axios.post('/api/jusoCommon/selectSggList', {ctpvCd});
//     console.log('Loaded Sgg data : --->', response.data);
//     sggList.value = response.data;
//   }catch (error){
//     console.error('ERROR loading sgg data : --?>', error)
//   }
// }

//시군구 데이터 AXIOS 
export const selectedCtpvCd = ref('')

export async function sggDataLoad (selectSggList:any) {
  try {
		const response = await axios.post('/api/jusoCommon/selectSggList', {ctpvCd : selectSggList})
    const dataArray = response.data;
		// console.log('데이터 레이어 시군구 : ' , dataArray);
      if(Array.isArray(dataArray)){
        return dataArray.map((item) => ({
          value: item.lgvCd,
		      label: item.sggNm,
          lgvReplcCd : item.lgvReplcCd
        }));
      }else {
        // console.error ('Data is not an array [SGG]:' , dataArray)
        return [];
      }
    }catch (error){
      // console.log('ERROR', error)
      return [];
    }
  }

  //읍면동 데이터 AXIOS
  export async function emdDataLoad (selectEmdList:any) {
    try {
      const response = await axios.post('/api/jusoCommon/selectEmdList', {lgvCd : selectEmdList})
      const dataArray = response.data;
      // console.log('데이터 레이어 읍면동 : ' , dataArray);
        if(Array.isArray(dataArray)){
          return dataArray.map((item) => ({
            value: item.emdCd,
            label: item.emdNm
          }));
        }else {
          // console.error ('Data is not an array [SGG]:' , dataArray)
          return [];
        }
      }catch (error){
        // console.log('ERROR', error)
        return [];
      }
    }

  //리 데이터 AXIOS
  export async function stliDataLoad (lgvCd:String, emdCd:String) {
    try {
      const response = await axios.post('/api/jusoCommon/selectStliList', {lgvCd: lgvCd, emdCd : emdCd})
      const dataArray = response.data;
      // console.log('데이터 레이어 리 : ' , dataArray);
        if(Array.isArray(dataArray)){
          return dataArray.map((item) => ({
            value: item.stliCd,
            label: item.stliNm
          }));
        }else {
          // console.error ('Data is not an array [SGG]:' , dataArray)
          return [];
        }
      }catch (error){
        // console.log('ERROR', error)
        return [];
      }
    }
