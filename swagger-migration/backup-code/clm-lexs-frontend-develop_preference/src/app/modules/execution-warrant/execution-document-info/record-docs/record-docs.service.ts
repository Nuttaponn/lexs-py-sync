import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecordDocsService {
  private _uplaodedDocuments: any[] = [];
  public get uplaodedDocuments(): any[] {
    return this._uplaodedDocuments;
  }
  public set uplaodedDocuments(value: any[]) {
    this._uplaodedDocuments = value;
  }

  constructor() {}
}
