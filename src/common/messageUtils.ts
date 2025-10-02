import ko_cmm from '@/common/messages/ko/cmm';
import ko_temp from '@/common/messages/ko/temp';
// To Do(업무공통): 신규 업무 메시지 파일 import

// [삭제 금지] 다국어 확장을 위해 준비된 코드
// import en_cmm from '@/common/messages/en/cmm';
// import en_temp from '@/common/messages/en/temp';

export default {
    info: 'info',
    warn: 'warn',
    error: 'error',
    confirm: 'confirm',

    cmm: ko_cmm,        // 편집기에서 메시지 정의 바로가기를 사용하기 위함
    temp: ko_temp,
    // To Do(업무공통): 신규 업무 메시지 파일 등록 (선택사항)

    /**
     * 모든 (정의된)메시지 파일 읽어오기
     * @param {*} lang 다국어 옵션: ko - 한국어 | en - 영어
     */
    init: function(lang: string) {

        // 다국어를 위한 메시지 처리
        const messages = {
            ko: {
                cmm: {},
                temp: {},
                // To Do(업무공통): 신규 업무 메시지 목록
                ssnp: {},
                arg: {},
                arr: {},
            },

            // [삭제 금지] 다국어 확장을 위해 준비된 코드
            en: {
                // cmm: {},
                // temp: {},
            },
        };

        Object.assign(messages.ko.cmm, ko_cmm);
        Object.assign(messages.ko.temp, ko_temp);
        // To Do(업무공통): 신규 업무 메시지 assign

        // [삭제 금지] 다국어 확장을 위해 준비된 코드
        // Object.assign(messages.en.cmm, en_cmm);
        // Object.assign(messages.en.temp, en_temp);

        //--------------------------------------------------
        // 메시지 상수를 사용하기 위한 처리
        if (lang == undefined || lang == 'ko') {
            Object.assign(this, messages.ko);
        } else if (lang == 'en') {
            Object.assign(this, messages.en);
        }
    },

    /**
     * 메시지 얻기
     * @param {*} msgKey 정의된 메시지 코드
     * @param {*} options 메시지 파라미터 : case1 - {0} {1}... | case2 - {[key] : [value]}
     * @returns 파라미터를 적용하여 완성된 메시지를 반환 (파라미터가 없는 경우 msg 그대로 반환)
     */
    get: (msgKey: string, options?: any) => {
        let retVal = msgKey;

        if (options) {
            if (options instanceof Array) {
                retVal = msgKey.replace(/\{(\d+)\}/g, (match, index) => {
                    const valueIndex = parseInt(index);
                    if (options != undefined && options.length > valueIndex) {
                        return options[valueIndex] !== undefined ? options[valueIndex] : match;
                    } else {
                        return '';
                    }
                });
            } else if (options instanceof Object) {
                retVal = msgKey.replace(/\{(\w+)\}/g, (match, key) => {
                    if (options != undefined) {
                        return options[key] !== undefined ? options[key] : match;
                    } else {
                        return '';
                    }
                });
            } else {
                retVal = msgKey.replace(/\{(\d+)\}/g, (match, index) => {
                    const valueIndex = parseInt(index);
                    if (options != undefined && options.length > valueIndex) {
                        return options[valueIndex] !== undefined ? options[valueIndex] : match;
                    } else {
                        return '';
                    }
                });
            }
        }

        return retVal;
    },
}