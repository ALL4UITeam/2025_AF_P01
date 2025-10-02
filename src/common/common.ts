import { useCookies } from 'vue3-cookies'
import { useLoadingStore } from '@/stores/ui.loading';
import { useMsgBoxStore, MessageBoxButtons, DialogResult } from "@/stores/ui.msgBox";


// jQuery 전역 함수

// TypeScript 타입 : https://www.typescriptlang.org/docs/handbook/basic-types.html
export default {
  fnAddComma(value: number | string) {
    let valueStr = '';
    if (typeof value == 'number') {
      valueStr = value.toString();
    } else {
      valueStr = value;
    }

    return valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  // 다음 항목으로 포커스 이동
  // 참고 : https://stackoverflow.com/questions/39820797/vue-js-focus-next-input-on-enter
  focusNext(event: any) {
    const elem = event.target
    if (elem.form != null) {
      const currentIndex = Array.from(elem.form.elements).indexOf(elem)
      elem.form.elements
        .item(currentIndex < elem.form.elements.length - 1 ? currentIndex + 1 : 0)
        //.focus()
        .select()
    } else {
      //event.target.nextElementSibling.focus()
      event.target.nextElementSibling.select()
    }
  },
  focus(id: any) {
    if (typeof id === 'string') {
      $('#' + id).focus()
    } else {
      $(id).focus()
    }
  },
  // 쿠키 불러오기
  getCookie(keyName: string) {
    return useCookies().cookies.get(keyName)
  },
  // 쿠키 저장
  setCookie(keyName: string, value: string) {
    useCookies().cookies.set(keyName, value)
  },
  // Form Data를 JSON Params 형태로 변환
  formToJson(form: any) {
    const formData = new FormData(form) // reference to form element
    const data = {} // need to convert it before using not with XMLHttpRequest
    for (let [key, val] of formData.entries()) {
      Object.assign(data, { [key]: val })
    }
    return data
  },

  async modalAlert(msg: string, ok?: any): Promise<DialogResult> {
    const msgBoxStore = useMsgBoxStore();
    let dr = DialogResult.None;

    await new Promise((resolve) => {
      msgBoxStore.show(msg, "알림", MessageBoxButtons.OK, resolve);
    }).then((result) => {
      dr = result as DialogResult;

      if (ok != undefined && typeof ok == 'function') {
        ok();
      }
    });

    return dr;
  },
  async modalConfirm(msg: string, ok?: any, cancel?: any): Promise<DialogResult> {
    const msgBoxStore = useMsgBoxStore();
    let dr = DialogResult.None;

    await new Promise((resolve) => {
      msgBoxStore.show(msg, "Confirm", MessageBoxButtons.OKCancel, resolve);
    }).then((result) => {
      dr = result as DialogResult;

      if (result != undefined) {
        if (result == DialogResult.OK) {
          if (ok != undefined && typeof ok == 'function') {
            ok();
          }
        } else if (result == DialogResult.Cancel) {
          if (cancel != undefined && typeof cancel == 'function') {
            cancel();
          }
        }
      }
    });

    return dr;
  },
  /** 조회조건 초기화
   */
  initSearchPanel() {
    // 날짜 css 변경
    $('.filter_box .set_date_box').each(function (index: Number, el1: any) {
      $(el1).find('span').each(function (index: Number, el2: any) {
        const $calendar = $(el2).find(':input:first');
        if ($calendar) {
          $calendar.addClass("sel_date").removeClass("p-inputtext").removeClass("p-component");
        }
        })
    });

    // 드롭다운 css 변경
    $('.filter_box .p-dropdown').each(function (index: Number, el1: any) {
      $(el1).css('border-radius', '0px');
      $(el1).css('height', '36.6px');

      $(el1).find('span').each(function (index: Number, el2: any) {
        $(el2).css('padding', '0.5rem 0.75rem')
      });
    });
  },
  /** 로딩창 보이기
   *
   * @param time 표시할 시간(s) [기본값: 무한대]
   */
  showLoading(time: number|null = null) {
    const loadingStore = useLoadingStore();
    loadingStore.show();
    if (time) {
      setTimeout(() => {
        loadingStore.hide();
      }, time);
    }
  },
  /** 로딩창 숨기기
   */
  hideLoading() {
    const loadingStore = useLoadingStore();
    loadingStore.hide();
  },
  /** 비밀번호 검증
   */
  checkPassword(p_pw : string) {
    //참고 : https://java119.tistory.com/71
    let pw = p_pw;
    let num = pw.search(/[0-9]/g);
    let eng = pw.search(/[a-z]/ig);
    //let spe = pw.search(/[`~!@@#$%^&*|\\\'\";:\/?]/gi);
    let spe = pw.search(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\")]/g);
    let spa = pw.search(/\s/);
    let chkcount = 0;
    if(num >= 0) chkcount++;
    if(eng >= 0) chkcount++;
    if(spe >= 0) chkcount++;
    //console.log("pw : "+pw);
    //console.log("pw.length : "+pw.length);
    //console.log("num : "+num);
    //console.log("eng : "+eng);
    //console.log("spe : "+spe);
    //console.log("spa : "+spa);
    //console.log("chkcount : "+chkcount);
    if(spa != -1) {
      //alert("비밀번호는 공백 없이 입력해주세요.");
      return false;
    }
    if(
      pw.length < 8
      || (pw.length >= 8 && pw.length < 10 && chkcount < 3)
      || (pw.length >= 10 && chkcount < 2)
    ) {
      //alert("비밀번호는 영문, 숫자, 특수문자 중 2종류 이상 조합하여 최소 10자리 이상 또는 3종류 이상을 조합하여 최소 8자리 이상의 길이로 구성해주세요.");
      return false;
    }

    return true;
  },
  isMobile() {
    const regex = /iPhone|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson|LG|SAMSUNG|Samsung/i;
    return regex.test(navigator.userAgent);
  }
}