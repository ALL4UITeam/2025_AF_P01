const defaultDateDelimiter = '-';
const defaultTimeDelimiter = ':';
const defaultDateTimeDelimiter = ' ';
const defaultMilisecondsDelimiter = '.';
const defaultDateFormat = 'yyyy-MM-dd';
const defaultDateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
const defaultDateTimeFormat2 = 'yyyy-MM-dd HH:mm:ss.fff';
const defaultTimeFormat = 'HH:mm:ss';
const defaultTimeFormat2 = 'HH:mm';
//--------------------------------------------------
//--------------------------------------------------
export default {
  ibPreset: {
    // eslint-disable-next-line no-useless-escape
    DateTime: { Type: 'Date', Align: 'Center', Format: 'yyyy-MM-dd HH:mm:ss', EditFormat: 'yyyyMMddHHmmss', DataFormat: defaultDateTimeFormat, Size: 14, EditMask: '^\d*$', EmptyValue: '<span style="color:#AAAA">숫자만 입력(ex:20230514123456)</span>'},
    // eslint-disable-next-line no-useless-escape
    Date: { Type: 'Date', Align: 'Center', Format: 'yyyy-MM-dd', EditFormat: 'yyyyMMdd', DataFormat: defaultDateFormat, Size: 8, EditMask: '^\d*$', EmptyValue: '<span style="color:#AAAA">년,월,일 순으로 숫자만 입력해 주세요.</span>'},
    // eslint-disable-next-line no-useless-escape
    Time: { Type: 'Date', Align: 'Center', Format: 'HH:mm', EditFormat: 'HHmm', DataFormat: 'HH:mm:ss', Size: 6, /*EditMask: '^\d*$',*/ EmptyValue: '<span style="color:#AAAA">시,분,초 순으로 6개 숫자만 입력해 주세요.</span>'},
    // eslint-disable-next-line no-useless-escape
    Month: { Type: 'Int', Align: 'Center', Format: '#월', /*EditMask: '^\d*$',*/ EmptyValue: '<span style="color:#AAAA">숫자만 입력(ex:20230514123456)</span>'}
  },

  // defaultDataFormat: 'yyyy-MM-dd HH:mm:ss',
  dateForTime: '0001-01-01',


  /**
   * 8자리 문자포맷의 날짜를 전달받은 구분자로 포맷을 전달
   * @param dateString
   * @param splitter
   */
  getDateSlice: (dateString:string, splitter:string = '.') => {
    if (dateString && dateString.length === 8) {
      return `${dateString.slice(0, 4)}${splitter}${dateString.slice(4, 6)}${splitter}${dateString.slice(6)}`;
    }
    return dateString;
  },
  /** 일시 데이터에 날짜(년월일) 포맷 적용하기 (기본포맷: yyyy-MM-dd)
   * @param date 포맷을 적용하기 위한 일시 데이터
   * @param format 적용할 포맷 (기본값: yyyy-MM-dd)
   * @returns 포맷 적용된 문자열 반환
   */
  getDateFormat: function (dateParam: Date | string, format: string = defaultDateFormat) {
    return this.getDateTimeFormat(dateParam, format);
  },
  /** 일시 데이터에 일시(년월일 시분초) 포맷 적용하기 (기본포맷: yyyy-MM-dd HH:mm:ss)
   * @param date 포맷을 적용하기 위한 일시 데이터
   * @param format 적용할 포맷 (기본값: yyyy-MM-dd)
   * @returns 포맷 적용된 문자열 반환
   */
  getDateTimeFormat: function (dateParam: Date | string, format: string = defaultDateTimeFormat) {


    if(dateParam == null || dateParam == '') {
      return '';
    }

    let date;

    if (dateParam instanceof Date) {
      date = dateParam;
    } else {
      try {
        if (dateParam.startsWith(this.dateForTime)) {
          date = new Date(this.dateForTime);
          const timeStr = dateParam.replace(this.dateForTime, '').replace('T', '').replace('Z', '').trim();
          const [h, m, s, ms] = timeStr.split(':').map(Number);
          date.setHours(h == undefined? 0: h);
          date.setMinutes(m == undefined? 0: m);
          date.setSeconds(s == undefined? 0: s);
          date.setMilliseconds(ms == undefined? 0: ms);
        } else {
          date = new Date(dateParam);
        }
      } catch {
        return '';
      }
    }

    const yyyy = lpad('' + date.getFullYear(), 4, '0');;
    const MM = lpad('' + (date.getMonth() + 1), 2, '0');
    const dd = lpad('' + date.getDate(), 2, '0');
    const HH = lpad('' + date.getHours(), 2, '0');
    const mm = lpad('' + date.getMinutes(), 2, '0');
    const ss = lpad('' + date.getSeconds(), 2, '0');
    const fff = lpad('' + date.getMilliseconds(), 3, '0');

    format = format.replace(/yyyy/g, yyyy);
    format = format.replace(/MM/g, MM);
    format = format.replace(/dd/g, dd);
    format = format.replace(/HH/g, HH);
    format = format.replace(/mm/g, mm);
    format = format.replace(/ss/g, ss);
    format = format.replace(/fff/g, fff);

    return format;
  },
  getDateTimeFormatYesterDay: function (dateParam: Date | string, format: string = defaultDateTimeFormat) {


    if(dateParam == null || dateParam == '') {
      return '';
    }

    let date;

    if (dateParam instanceof Date) {
      date = dateParam ;
      date.setDate(date.getDate() -1);
    } else {
      try {
        if (dateParam.startsWith(this.dateForTime)) {
          date = new Date(this.dateForTime);
          date.setDate(date.getDate() -1);
          const timeStr = dateParam.replace(this.dateForTime, '').replace('T', '').replace('Z', '').trim();
          const [h, m, s, ms] = timeStr.split(':').map(Number);
          date.setHours(h == undefined? 0: h);
          date.setMinutes(m == undefined? 0: m);
          date.setSeconds(s == undefined? 0: s);
          date.setMilliseconds(ms == undefined? 0: ms);
        } else {
          date = new Date(dateParam);
          date.setDate(date.getDate() -1);
        }
      } catch {
        return '';
      }
    }

    const yyyy = lpad('' + date.getFullYear(), 4, '0');;
    const MM = lpad('' + (date.getMonth() + 1), 2, '0');
    const dd = lpad('' + date.getDate(), 2, '0');
    const HH = lpad('' + date.getHours(), 2, '0');
    const mm = lpad('' + date.getMinutes(), 2, '0');
    const ss = lpad('' + date.getSeconds(), 2, '0');
    const fff = lpad('' + date.getMilliseconds(), 3, '0');

    format = format.replace(/yyyy/g, yyyy);
    format = format.replace(/MM/g, MM);
    format = format.replace(/dd/g, dd);
    format = format.replace(/HH/g, HH);
    format = format.replace(/mm/g, mm);
    format = format.replace(/ss/g, ss);
    format = format.replace(/fff/g, fff);

    return format;
  },
  /** 일시 데이터에 일시(ms포함)(년월일 시분초ms) 포맷 적용하기 (기본포맷: yyyy-MM-dd HH:mm:ss.fff)
   * @param date 포맷을 적용하기 위한 일시 데이터
   * @param format 적용할 포맷 (기본값: yyyy-MM-dd)
   * @returns 포맷 적용된 문자열 반환
   */
  getDateTimeFormat2: function (dateParam: Date | string, format: string = defaultDateTimeFormat2) {
    return this.getDateTimeFormat(dateParam, format);
  },
  /** 일시 데이터에 시간(시분초) 포맷 적용하기 (기본포맷: HH:mm:ss)
   * @param date 포맷을 적용하기 위한 일시 데이터
   * @param format 적용할 포맷 (기본값: yyyy-MM-dd)
   * @returns 포맷 적용된 문자열 반환
   */
  getTimeFormat: function (dateParam: Date | string, format: string = defaultTimeFormat) {
    return this.getDateTimeFormat(dateParam, format);
  },
  /** 일시 데이터에 시간(초 제외)(시분) 포맷 적용하기 (기본포맷: HH:mm)
   * @param date 포맷을 적용하기 위한 일시 데이터
   * @param format 적용할 포맷 (기본값: yyyy-MM-dd)
   * @returns 포맷 적용된 문자열 반환
   */
  getTimeFormat2: function (dateParam: Date | string, format: string = defaultTimeFormat2) {
    return this.getDateTimeFormat(dateParam, format);
  },

  //--------------------------------------------------

  /** 현재 년도를 문자열로 반환 (포맷: yyyy)
   * @returns
   */
  getCurrentYear: function () {
    const today = new Date();
    return this.getDateTimeFormat(today, 'yyyy');
  },
  /** 현재 년월을 문자열로 반환 (포맷: yyyy-MM)
   * @param delimiter 년 월의 구분자
   * @returns
   */
  getCurrentMonth: function (delimiter: string = defaultDateDelimiter) {
    return this.getDateTimeFormat(new Date(), 'yyyy' + delimiter + 'MM');
  },
  /** 현재 년월일을 문자열로 반환 (포맷: yyyy-MM-dd)
   *
   * @param delimiter 년 월 일 구분자
   * @returns
   */
  getCurrentDay: function (delimiter: string = defaultDateDelimiter) {
    return this.getDateTimeFormat(new Date(), 'yyyy' + delimiter + 'MM' + delimiter + 'dd');
  },
  /** 현재 날짜를 문자열로 반환 getCurrentDay()와 동일함
   *
   * @param delimiter
   * @returns
   */
  getToday: function (delimiter: string = defaultDateDelimiter) {
    return this.getDateTimeFormat(new Date(), 'yyyy' + delimiter + 'MM' + delimiter + 'dd');
  },
  /** 현재 일시를 문자열로 반환
   *
   * @param dateDelimiter 년 월 일 구분자
   * @param dateTimeDelimiter 날짜 시간 구분자
   * @param timeDelimiter 시 분 초 구분자
   * @returns
   */
  getNow: function (dateDelimiter: string = defaultDateDelimiter, dateTimeDelimiter: string = defaultDateTimeDelimiter, timeDelimiter: string = defaultTimeDelimiter) {
    return this.getDateTimeFormat(new Date(), 'yyyy' + dateDelimiter + 'MM' + dateDelimiter + 'dd' + dateTimeDelimiter + 'HH' + timeDelimiter + 'mm' + timeDelimiter + 'ss');
  },
  /** 현재 일시를 문자열로 반환 (밀리초 포함)
   *
   * @param dateDelimiter 년 월 일 구분자
   * @param dateTimeDelimiter 날짜 시간 구분자
   * @param timeDelimiter 시 분 초 구분자
   * @param milisecondsDelimiter 시간 밀리초 구분자
   * @returns
   */
  getNow2: function (dateDelimiter: string = defaultDateDelimiter, dateTimeDelimiter: string = defaultDateTimeDelimiter, timeDelimiter: string = defaultTimeDelimiter, milisecondsDelimiter: string = defaultMilisecondsDelimiter) {
    return this.getDateTimeFormat(new Date(), 'yyyy' + dateDelimiter + 'MM' + dateDelimiter + 'dd' + dateTimeDelimiter + 'HH' + timeDelimiter + 'mm' + timeDelimiter + 'ss' + milisecondsDelimiter + 'fff');
  },
  /** 어제 날짜를 문자열로 반환 getCurrentDay()와 동일함
   *
   * @param delimiter
   * @returns
   */
  getYesterday: function (delimiter: string = defaultDateDelimiter) {
    return this.getDateTimeFormatYesterDay(new Date(), 'yyyy' + delimiter + 'MM' + delimiter + 'dd');
  },

  //--------------------------------------------------

  addDate(p_date: string, p_year: number, p_month: number, p_day: number) {
    if (p_date == undefined || p_date == null) {
      return '';
    }

    //구분자 세팅
    let ch = '';
    if (p_date.indexOf('-') >= 0) {
      ch = '-';
    }
    if (p_date.indexOf('.') >= 0) {
      ch = '.';
    }

    //구분자 삭제
    // eslint-disable-next-line no-useless-escape
    p_date = p_date.replace(/\-/g, '').replace(/\./g, '');
    const yyyy = p_date.substr(0, 4);
    const mm = p_date.substr(4, 2);
    const dd = p_date.substr(6, 2);

    //날짜 계산
    const date = new Date(
      Number(yyyy) + Number(p_year),
      Number(mm) - 1 + Number(p_month),
      Number(dd) + Number(p_day)
    )

    //문자로 변환
    const year: string = '' + date.getFullYear();
    let month: string = '' + (date.getMonth() + 1);
    let day: string = '' + date.getDate();
    if (Number(month) < 10) month = '0' + month;
    if (Number(day) < 10) day = '0' + day;

    //리턴
    return year + ch + month + ch + day;
  },

  parseDate(p_date: string) {
    if (p_date == undefined || p_date == null) {
      return null;
    }

    //구분자 세팅
    let ch = '';
    if (p_date.indexOf('-') >= 0) {
      ch = '-';
    }
    if (p_date.indexOf('.') >= 0) {
      ch = '.';
    }

    //구분자 삭제
    // eslint-disable-next-line no-useless-escape
    p_date = p_date.replace(/\-/g, '').replace(/\./g, '');

    //날짜
    if (p_date.length == 8) {
      const yyyy = Number(p_date.substr(0, 4));
      const mm = Number(p_date.substr(4, 2)) - 1;
      const dd = Number(p_date.substr(6, 2));
      const date = new Date(yyyy, mm, dd);
      return date;
    }
    //날짜+시간
    else if (p_date.length == 14) {
      const yyyy = Number(p_date.substr(0, 4));
      const mm = Number(p_date.substr(4, 2)) - 1;
      const dd = Number(p_date.substr(6, 2));
      const hh = Number(p_date.substr(8, 2));
      const mi = Number(p_date.substr(10, 2));
      const ss = Number(p_date.substr(12, 2));
      const date = new Date(yyyy, mm, dd, hh, mi, ss);
      return date;
    } else {
      return null;
    }
  },

  //--------------------------------------------------

  /** 일시 정보에서 초,밀리초를 리셋 - UI Component에서 초,밀리초를 지원하지 않기 때문
   *
   * @param date
   */
  trimForDateTime(date: Date | undefined) {
    return trimDateTime(date, 'ssfff');
  },

  /** 일시 정보에서 시,분,초,밀리초를 리셋 - UI Component에서 초,밀리초를 지원하지 않기 때문
   *
   * @param date
   */
  trimForDate(date: Date | undefined) {
    return trimDateTime(date, 'HHmmssfff');
  },

  /** 일시 정보에서 년,월,일,초,밀리초를 리셋 - UI Component에서 초,밀리초를 지원하지 않기 때문
   *
   * @param date
   */
  trimForTime(date: Date | undefined) {
    return trimDateTime(date, 'yyyyMMddssfff');
  },

  /** 일시 정보에서 월,일,시,분,초,밀리초를 리셋
   *
   * @param date
   */
  trimForYear(date: Date | undefined) {
    return trimDateTime(date, 'MMddHHmmssfff');
  },

  /** 일시 정보에서 일,시,분,초,밀리초를 리셋
   *
   * @param date
   */
  trimForYearMonth(date: Date | undefined) {
    return trimDateTime(date, 'ddHHmmssfff');
  },

  /** 일시 정보에서 시,분,초,밀리초를 리셋
   *
   * @param date
   */
  trimForYearMonthDay(date: Date | undefined) {
    return trimDateTime(date, 'HHmmssfff');
  },
}

/** 문자열 앞에 특정 문자열을 반복하여 채운 후 반환하기
 * @param str 대상 문자열
 * @param padLength 대상 문자열에 특정 문자열을 모두 채운 후 길이
 * @param padString 대상 문자열 앞에 채우기위한 문자열 (일반적으로 문자를 사용)
 * @returns 대상 문자열 앞에 특정 문자열을 채운 후 반환
 */
const lpad = (str:string, padLength:number, padString:string) => {
  str = '' + str;

  while(str.length < padLength)
    str = padString + str;

  return str
};

/** 일시 정보에서 년,월,일,시,분,초,밀리초를 선택하여 리셋
 *
 * @param date
 * @param target
 */
const trimDateTime = (date: Date | undefined, target: String = 'ssfff') => {

  if (date != undefined) {
    if (target.indexOf('yyyy') >= 0) {
      date.setFullYear(1901);
      date.setFullYear(date.getFullYear() - 1900);
    }
    if (target.indexOf('MM') >= 0) {
      date.setMonth(0);
    }
    if (target.indexOf('dd') >= 0) {
      date.setDate(1);
    }
    if (target.indexOf('HH') >= 0) {
      date.setHours(0);
    }
    if (target.indexOf('mm') >= 0) {
      date.setMinutes(0);
    }
    if (target.indexOf('ss') >= 0) {
      date.setSeconds(0);
    }
    if (target.indexOf('fff') >= 0) {
      date.setMilliseconds(0);
    }
  }

  return date;
};
