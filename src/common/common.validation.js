import * as yup from "yup";
import $msgUtils from '@/common/messageUtils';

export const commonRules = {
  email: yup.string().required($msgUtils.get($msgUtils.cmm.warn.requiredFieldsEmpty)).email($msgUtils.cmm.warn.defaultMsg),
  fullName: yup.string().required($msgUtils.get($msgUtils.cmm.warn.requiredFieldsEmpty)),
  password: yup.string().required($msgUtils.get($msgUtils.cmm.warn.requiredFieldsEmpty)).min(6,'6글자 이상을 입력해주세요'),
  passwordConfirm: yup.string().required($msgUtils.get($msgUtils.cmm.warn.requiredFieldsEmpty))
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.'),
}