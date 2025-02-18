import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Pageable, PageableObject} from '@lexs/lexs-client';
import { PaginatorActionConfig, PaginatorResultConfig } from '@spig/core';
import saveAs from 'file-saver';
import JSZip from 'jszip';
import moment from 'moment';
import { BlobType, maxFileSize } from '../models';

export const Utils = {
  isObject: (item: any) => {
    return item && typeof item === 'object' && !Array.isArray(item);
  },
  isEmptyObject(obj: any) {
    return !obj || Object.keys(obj)?.length === 0;
  },
  deepMerge: (target: any, ...sources: any): any => {
    if (!sources.length) return target;
    const source = sources.shift();
    if (Utils.isObject(target) && Utils.isObject(source)) {
      for (const key in source) {
        if (Utils.isObject(source[key])) {
          if (!target[key])
            Object.assign(target, {
              [key]: {},
            });
          Utils.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, {
            [key]: source[key],
          });
        }
      }
    }
    return Utils.deepMerge(target, ...sources);
  },
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  saveAsStrToBlobFile(_strFile: any, _fileName: string, _type: BlobType | string = '') {
    const blob = new Blob([_strFile as BlobPart], { type: _type });
    saveAs(blob, _fileName);
  },
  saveAsBlobFile(_data: Blob, _fileName: string) {
    saveAs(_data, _fileName);
  },
  saveAsBase64File(_type: string, _base64Str: string, _fileName: string) {
    const linkSource = `data:${_type};base64,${_base64Str}`;
    const downloadLink = document.createElement('a');
    const fileName = _fileName;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  },
  dateISOString(date: Date) {
    const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const y = date.getFullYear();
    date = new Date(y + '-' + m + '-' + d);
    return date.toISOString().substring(0, 10);
  },
  getCurrentDate() {
    const date = new Date();
    const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const y = date.getFullYear();
    return y + '-' + m + '-' + d;
  },
  bytesToMegaBytes(bytes: number) {
    return parseFloat((bytes / (1024 * 1024)).toFixed(2));
  },
  validateFileSize(fileSize: number, _maxFileSize: number = maxFileSize): boolean {
    return fileSize / 1024 / 1024 > _maxFileSize ? false : true;
  },
  deepClone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  },
  calculateDateDiff(startDate: string | Date, endDate: string | Date) {
    if (typeof startDate === 'string' && typeof endDate === 'string') {
      const firstDate = moment(startDate.indexOf('T') === -1 ? startDate : startDate.split('T')[0]);
      const lastDate = moment(endDate.indexOf('T') === -1 ? endDate : endDate.split('T')[0]);
      return lastDate.diff(firstDate, 'days') + 1;
    } else {
      const firstDate = moment(startDate);
      const lastDate = moment(endDate);
      return lastDate.diff(firstDate, 'days') + 1;
    }
  },
  dateFormat(date: string | Date, format: string) {
    if (date === '') {
      return '';
    }
    return moment(date).format(format);
  },
  setPagination(
    _pageable?: Pageable | PageableObject,
    _numberOfElements: number = 1,
    _totalPages: number = 1,
    _totalElements: number = 0
  ) {
    const _pageNumberOffer =
      _pageable && _pageable.pageSize && _pageable.pageNumber ? _pageable.pageSize * _pageable.pageNumber : 0;
    const resultConfig = {
      fromIndex: _pageNumberOffer + 1,
      toIndex: _pageNumberOffer + _numberOfElements,
      totalElements: _totalElements,
    } as PaginatorResultConfig;
    const actionConfig = {
      totalPages: _totalPages,
      currentPage: (_pageable?.pageNumber || 0) + 1,
      fromPage: 1,
      toPage: _totalPages,
    } as PaginatorActionConfig;
    return { resultConfig, actionConfig };
  },
  getValueArrayObject(objects: Object[], name: string) {
    if (objects.length > 0) {
      let reult: string[] = [];
      objects.forEach(item => {
        const value = (item as any)[name];
        reult.push(value);
      });
      return reult;
    } else {
      return [];
    }
  },
  convertStringToNumber(stringNumber: string): number | undefined {
    if (!stringNumber) return undefined;
    const number = parseFloat(stringNumber.replace(/,/g, ''));
    return number;
  },
  saveAsZip(response: Blob, fileName: string) {
    const blob = new Blob([response as BlobPart], {
      type: 'zip',
    });
    let zip = new JSZip();
    zip.file(`${fileName}.zip`, blob);
    zip.generateAsync({ type: 'blob' }).then(blob => saveAs(blob, `${fileName}.zip`));
  },
  formatThaiIdCard(val: string) {
    let newVal = val;
    newVal = newVal.replace(/\D/g, '');
    // x-xxxx-xxxxx-xx-x card
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 1) {
      newVal = newVal.replace(/^(\d{0,1})/, '$1');
    } else if (newVal.length <= 5) {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,4})/, '$1-$2');
    } else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,4})(\d{0,5})/, '$1-$2-$3');
    } else if (newVal.length <= 12) {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,4})(\d{0,5})(\d{0,2})/, '$1-$2-$3-$4');
    } else {
      newVal = newVal.replace(/^(\d{0,1})(\d{0,4})(\d{0,5})(\d{0,2})(\d{0,1})/, '$1-$2-$3-$4-$5');
    }
    return newVal;
  },
  addDecimal(form: AbstractControl, amount: number) {
    if (form.value && !isNaN(form.value)) {
      let value = form.value as string;
      value = value.replace(/^0+(?=\d)/, '');
      if (value.split('.').length > 1) {
        const after = value.split('.');
        const point = after[1]?.length === 1 ? after[1].concat('0') : after[1].substring(0, amount);
        form.setValue(after[0] + '.' + point);
      } else {
        let zeros = '.';
        for (let i = 0; i < amount; i++) {
          zeros += '0';
        }
        form.setValue(value.concat(zeros));
      }
    }
  },
  validateTaxId(control: AbstractControl): ValidationErrors | null {
    let sum = 0;
    const taxId = control.value.replace(/-/g, '');
    let isTaxIdError = false;
    if (taxId === '' || taxId === null) return { require: true };
    for (let i = 0; i < 12; i++) {
      sum += parseFloat(taxId.charAt(i)) * (13 - i);
      if (i === 11) {
        if ((11 - (sum % 11)) % 10 !== parseFloat(taxId.charAt(12))) {
          isTaxIdError = true;
          break;
        }
      }
    }

    if (isTaxIdError) {
      return { pattern: true };
    }
    return null;
  },
  checkFileSize(bytes: number, limitInMb: number) {
    const fileSizeMb = bytes / (1024 * 1024);
    if (fileSizeMb < limitInMb) {
      return true;
    }
    return false;
  },
  allowNumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  },
  financialStrToNumber(x: string) {
    let temp = x.toString();
    if (temp && temp.includes(',')) {
      return Number.parseFloat(temp.split(',').join(''));
    }
    return Number(x) || 0;
  },

  numberWithCommas(val: number | string) {
    let data = '';
    if (typeof val === 'number') {
      data = val.toFixed(2)?.toString();
    } else if (typeof val === 'string' && val) {
      const parts = val
        .toString()
        .replace(/[^0-9\,\.]*/g, '')
        .replace(/,/g, '')
        .split('.');
      const decimalValue = `${parts[0]}.${parts[1] ? parts[1]?.slice(0, 2) : ''}`;
      data = decimalValue;
    } else {
      data = '';
    }
    return data ? data.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  },
  // Define a function to filter out null or undefined values recursively
  filterNullUndefined(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => {
        if (value === null || value === undefined) {
          return false; // Exclude keys with null or undefined values
        } else if (value instanceof Date) {
          return true; // Include keys with Date object values
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          const filteredObj = this.filterNullUndefined(value);
          return Object.keys(filteredObj).length > 0;
        }
        return true; // Include keys with non-null, non-undefined values
      })
    );
  },
  get10YearFromNow() {
    let years = [];
    let yearNow = new Date().getFullYear();
    for (let index = 0; index > -10; index--) {
      let yearString = yearNow + index + 543;
      let arr = {
        name: yearString.toString(),
        value: yearString.toString(),
      };
      years.push(arr);
    }
    return years;
  },
  getYearFromNow(_index: number = 1) {
    let years = [];
    let yearNow = new Date().getFullYear();
    for (let index = 0; index > -_index; index--) {
      let yearString = yearNow + index + 543;
      let arr = {
        name: yearString.toString(),
        value: yearString.toString(),
      };
      years.push(arr);
    }
    return years;
  },
   findInvalidControls(formGroup: FormGroup): string[] {
    const invalid = [];
    const controls = formGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  },
   updateValueAndValidityAllFormGroup(formGroup: FormGroup) {
    const controls = formGroup.controls;
    for (const name in controls) {
      controls[name].updateValueAndValidity()
    }
  },

};
