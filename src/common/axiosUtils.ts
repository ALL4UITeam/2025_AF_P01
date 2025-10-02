import axios from 'axios';
import $common from '@/common/common';
import $msgUtils from '@/common/messageUtils';
import { setInterceptors } from "@/api/common/interceptors";

const api = setInterceptors(axios.create());

const fnThen = (url: string, response: any, resolve: any, reject: any, options?: any) => {

  if(response.data !== null && response.data.status !== null && response.data.status === 401) {
    // 토큰 만료
    return;
  }

  if (options != undefined && options.showLoading) {
    $common.hideLoading();
  }

  if (options != undefined && options.usingRawResonse) {
    resolve(response);
  } else {
    if (response.data !== null && response.data.results !== undefined && response.data.message !== undefined) {
      if (options != undefined && options.id != undefined) {
        response.data.$id$ = options.id;
      }
      resolve(response.data);

    } else {
      const data:any = {};
      data.message = $msgUtils.get($msgUtils.cmm.warn.nonStdMsgFormats);
      data.messageType = $msgUtils.warn;
      data.results = response;
      data.status = 200;
      data.timestamp = new Date();

      if (options != undefined && options.id != undefined) {
        data.$id$ = options.id;
      }

      if (options != undefined && options.showErrorMessage != undefined && options.showErrorMessage) {
        $common.modalAlert($msgUtils.get($msgUtils.cmm.warn.nonStdMsgFormats), () => {
          reject(data);
        });
      } else {
        reject(data);
      }
    }
  }
}
const fnCatch = (url: string, error: any, reject: any, options?: any) => {

  if(error.response !== null && error.response.status !== null && error.response.status === 401) {
    // 토큰 만료
    return;
  }

  if (options != undefined && options.showLoading) {
    $common.hideLoading();
  }

  if (options != undefined && options.usingRawResonse) {
    console.log(`오류 데이터(${url}):`);
    console.log(error);

    reject(error);
  } else {

    if (error.response != undefined &&
      error.response.data !== null &&
      error.response.data.results !== undefined &&
      error.response.data.message !== undefined) {
        console.log(`오류 데이터(${url}):`);
        console.log(error.response.data);

        if (options != undefined && options.id != undefined) {
          error.response.data.$id$ = options.id;
        }

        if (options != undefined && options.showErrorMessage != undefined && options.showErrorMessage) {
          $common.modalAlert(error.response.data.message, () => {
            reject(error.response.data);
          });
        } else {
          reject(error.response.data);
        }
    } else {
      const data:any = {};
      data.message = $msgUtils.get($msgUtils.cmm.warn.nonStdMsgFormats);
      data.messageType = $msgUtils.error;
      data.results = error;
      data.status = 500;
      data.timestamp = new Date();

      if (options != undefined && options.id != undefined) {
        data.$id$ = options.id;
      }

      if (options != undefined && options.showErrorMessage != undefined && options.showErrorMessage) {
        $common.modalAlert($msgUtils.get($msgUtils.cmm.warn.nonStdMsgFormats), () => {
          reject(data);
        });
      } else {
        reject(data);
      }
    }
  }
}
const getOptions = (params?:any) => {
  const options = {
    id: null,                       // API 호출 주체에 대한 고유 아이디 (여러 API 호출에 대한 공통 콜백함수 처리시 필요)
    showErrorMessage: true,         // 에러메시지를 팝업으로 띄울지 여부
    showLoading: false,             // API를 호출한 이후 응답을 받을 때까지 스피너를 표시할지 여부
    usingRawResonse: false,         // 원시 응답데이터를 사용하지 여부 (임시용 - 기존 시스템 화면에서 백엔드 수정 없이 프론트엔드에 적용하기 위함)
  }

  if (params != undefined) {
    if (params instanceof Object) {
      if ('$id$' in params) {
        options.id = params.$id$;
        params.$id$ = undefined;
      } else if ('$showErrorMessage$' in params) {
        options.showErrorMessage = params.$showErrorMessage$;
        params.$showErrorMessage$ = undefined;
      } else if ('$showLoading$' in params) {
        options.showLoading = params.$showLoading$;
        params.$showLoading$ = undefined;
      } else if ('$usingRawResonse$' in params) {
        options.usingRawResonse = params.$usingRawResonse$;
        params.$usingRawResonse$ = undefined;
      }
    }
  }
  return options;
}

export default {
  /** 리소스 조회
   *    - QueryString을 통해 전달
   *    - 목록조회, 단건조회
   * @param url 상대 주소
   * @param params
   * @returns
   */
  get: function(url: string, params?: any) {
    const options = getOptions(params);
    if (options.showLoading) {
      $common.showLoading();
    }

    if (url.startsWith('/api')) {
      url = `${url}`;
    }

    return new Promise((resolve, reject) => {
        api.get(url, { params })
          .then(async (response: any) => { await fnThen(url, response, resolve, reject, options);  })
          .catch(async (error: any) => { await fnCatch(url, error, reject, options); });
      });
  },
  post: function(url: string, params?: any, config?: any) {
    const options = getOptions(params);
    if (options.showLoading) {
      $common.showLoading();
    }

    if (url.startsWith('/api')) {
      url = `${url}`;
    }

    return new Promise((resolve, reject) => {
      api.post(url, params, config)
        .then(async (response: any) => { await fnThen(url, response, resolve, reject, options);  })
        .catch(async (error: any) => { await fnCatch(url, error, reject, options); });
    });
  },
  put: function(url: string, params?: any) {
    const options = getOptions(params);
    if (options.showLoading) {
      $common.showLoading();
    }

    if (url.startsWith('/api')) {
      url = `${url}`;
    }

    return new Promise((resolve, reject) => {
      api.put(url, params)
        .then(async (response: any) => { await fnThen(url, response, resolve, reject, options);  })
        .catch(async (error: any) => { await fnCatch(url, error, reject, options); });
    });
  },
  patch: function(url: string, params?: any) {
    const options = getOptions(params);
    if (options.showLoading) {
      $common.showLoading();
    }

    if (url.startsWith('/api')) {
      url = `${url}`;
    }

    return new Promise((resolve, reject) => {
      api.patch(url, params)
        .then(async (response: any) => { await fnThen(url, response, resolve, reject, options);  })
        .catch(async (error: any) => { await fnCatch(url, error, reject, options); });
    });
  },
  delete: function(url: string, params?: any) {
    const options = getOptions(params);
    if (options.showLoading) {
      $common.showLoading();
    }

    if (url.startsWith('/api')) {
      url = `${url}`;
    }

    return new Promise((resolve, reject) => {
      api.delete(url, params)
        .then(async (response: any) => { await fnThen(url, response, resolve, reject, options);  })
        .catch(async (error: any) => { await fnCatch(url, error, reject, options); });
    });
  },
}