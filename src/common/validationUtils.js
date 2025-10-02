export default {
  nvl(str) {
    // eslint-disable-next-line no-undef
    return !($.isEmptyObject(str) || $.isEmptyObject(str.replace(/ /g, '')));
  },
  /*
 * @author Myung Ho Lim
 *
 * 이메일 정규식 체크
 * @param 체크 할 문자열
 */
  validEmail(str) {
    const filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return filter.test(str);
  },
  /*
 * @author Myung Ho Lim
 *
 * 문자열 길이 체크
 * @param 체크 할 문자열
 */
  validLen(str, minSize, maxSize) {
    let strSize = 0;

    if(this.nvl(str)){
      strSize = str.length;
    }
    return !(strSize < minSize || strSize > maxSize);
  },
  /*
 * @author Myung Ho Lim
 *
 * 문자열 숫자만 허용 체크
 * @param 체크 할 문자열
 */
  validNum(str) {
    const filter = /^[0-9]*$/;
    return filter.test(str);
  },
  /*
 * @author Myung Ho Lim
 *
 * 문자열 영문,숫자만 허용 체크
 * @param 체크 할 문자열
 */
  validEngNum(str) {
    const filter = /^[A-Za-z0-9]*$/;
    return filter.test(str);
  },
  strToOnlyNumber(str) {
    if(!this.nvl(str))	return "";
    return str.replace(/[^0-9]/g,"");
  },
  /*
 * @author Myung Ho Lim
 *
 * 000000000, 00-000-0000 형식의 하이픈 포멧의 전화번호증 포멧 검증
 * 070 or 한국 지역번호 기준으로 검증
 * 지역번호 + 3or4자리 + 4자리 검증
 * @param 체크 할 전화번호 문자열
 * @param 구분자 (null, -)
 * @return true:false
 */
  validPhone(telStr, splitStr) {
    if(!this.nvl(telStr))	return false;

    const telRule1 = /^(070|02|051|053|032|062|042|052|044|031|033|042|041|063|061|054|055|064|[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
    const telRule2 = /^(070|02|051|053|032|062|042|052|044|031|033|042|041|063|061|054|055|064|[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/;

    if(splitStr == null || splitStr === ""){
      return telRule1.test(this.strToOnlyNumber(telStr));
    }else if(splitStr === "-"){
      return telRule2.test(this.strToOnlyNumber(telStr));
    }
    return false;
  },
  /*
 * @author Myung Ho Lim
 *
 * 0000000000, 000-000-0000 형식의 하이픈 포멧의 핸드폰번호 포멧 검증
 * 010, 011,016, 017, 018, 019 시작번호로 체크
 * 3자리 + 3or4자리 + 4자리 검증
 * @param 체크 할 문자열
 * @param 구분자 (null, -)
 * @return true:false
 */
  validMobile(phStr, splitStr){
    if(!this.nvl(phStr))	return false;

    const phRule1 = /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/;
    const phRule2 = /^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/;

    if(splitStr == null || splitStr === ""){
      return phRule1.test(phStr);
    }else if(splitStr === "-"){
      return phRule2.test(phStr);
    }
    return false;
  },
  /*
 * @author Myung Ho Lim
 *
 * 날자 타입 YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD 포멧 검증
 * @param 체크 할 문자열
 * @param 구분자 (null, -, /)
 * @return true:false
 */
  isDate(dateStr,splitStr){

    if(!this.nvl(dateStr))	return false;

    const DateRule1 = /^\d{4}\d{2}\d{2}$/;
    const DateRule2 = /^\d{4}-\d{2}-\d{2}$/;
    const DateRule3 = /^\d{4}\/\d{2}\/\d{2}$/;

    if(splitStr == null || splitStr === ""){
      if(DateRule1.test(dateStr)){
        return true;
      }
    }else if(splitStr === "-"){
      if(DateRule2.test(dateStr)){
        return true;
      }
    }else if(splitStr === "/"){
      if(DateRule3.test(dateStr)){
        return true;
      }
    }
    return false;
  },
  /*
 * @author Myung Ho Lim
 *
 * 날자 타입 YYYYMMDD, YYYY-MM-DD, YYYY/MM/DD 생년월일 포멧 검증
 * 1900년대 이후의 생년월일 체크
 * @param 체크 할 문자열
 * @param 구분자 (null, -, /)
 * @return true:false
 */
  validBirthDay(dateStr, splitStr){

    if(!this.nvl(dateStr))	return false;

    const DateRule1 = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
    const DateRule2 = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const DateRule3 = /^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/;

    if(splitStr == null || splitStr === ""){
      if(this.isDate(dateStr,splitStr) && DateRule1.test(dateStr)){
        return true;
      }
    }else if(splitStr === "-"){
      if(this.isDate(dateStr,splitStr) && DateRule2.test(dateStr)){
        return true;
      }
    }else if(splitStr === "/"){
      if(this.isDate(dateStr,splitStr) && DateRule3.test(dateStr)){
        return true;
      }
    }
    return false;
  }

}
