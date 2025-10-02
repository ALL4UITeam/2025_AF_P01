// import { getUserInfo } from '@/stores/login/loginInfo.ts';

import lodash from "lodash";
import $common from "@/common/common";

export function setInterceptors(instance) {
  // Add a request interceptor
  instance.interceptors.request.use(
    function (config) {
      if(lodash.isEmpty(localStorage.getItem("accessToken"))) {
        $common.modalAlert("세션이 만료되었습니다.", () => {
          window.location.href = "/";
          return config;
        });
      }
      config.headers.Authorization = localStorage.getItem("grantType") + " " + localStorage.getItem("accessToken")
      // console.log('setInterceptors ', config);
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  // Add a response interceptor
  instance.interceptors.response.use(
    async function (response) {
      if(response.data.status === 401) {
        await $common.modalAlert("토큰이 만료되었습니다.", () => {
          window.location.href = "/";
        });
      }
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    async function (error) {
      if(error.response.status === 401) {
        await $common.modalAlert("토큰이 만료되었습니다.", () => {
          window.location.href = "/";
        });
      }
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    },
  );
  return instance;
}
