import { InjectionToken } from '@angular/core';

export interface FormControlInvalidMsgOptions {
  errorKey: string;
  useTranslate?: boolean;
  message: string;
}

export const FORM_CONTROL_INVALID_MSG_OPTIONS = new InjectionToken<FormControlInvalidMsgOptions[]>(
  'FormControlInvalidMsgOptions'
);

function defaultOptions() {
  return [
    { errorKey: 'required', useTranslate: true, message: 'FORM_ERROR_MSG.REQUIRED' },
    { errorKey: 'pattern', useTranslate: true, message: 'FORM_ERROR_MSG.INVALID' },
    { errorKey: 'email', useTranslate: true, message: 'FORM_ERROR_MSG.INVALID' },
    { errorKey: 'duplicate', useTranslate: true, message: 'FORM_ERROR_MSG.INVALID' },
    { errorKey: 'minlength', useTranslate: true, message: 'FORM_ERROR_MSG.INVALID' },
    { errorKey: 'maxlength', useTranslate: true, message: 'FORM_ERROR_MSG.INVALID' },
    { errorKey: 'min', useTranslate: true, message: 'FORM_ERROR_MSG.INVALID' },
    { errorKey: 'max', useTranslate: true, message: 'FORM_ERROR_MSG.INVALID' },
    { errorKey: 'match', useTranslate: true, message: 'FORM_ERROR_MSG.INVALID' },
    { errorKey: 'incorrect', useTranslate: true, message: 'FORM_ERROR_MSG.INCORRECT' },
    { errorKey: 'exceed', useTranslate: true, message: 'FORM_ERROR_MSG.EXCEED' },
    { errorKey: 'morethandebt', useTranslate: true, message: 'FORM_ERROR_MSG.MORETHANDEBT' },
  ];
}

function arrayUnique(array: FormControlInvalidMsgOptions[]) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i]['errorKey'] === a[j]['errorKey']) a.splice(j--, 1);
    }
  }
  return a;
}

export const FormControlInvalidMsgOptions = {
  applyDefault(opt: FormControlInvalidMsgOptions[]) {
    return arrayUnique(opt.concat(defaultOptions()));
  },
};
