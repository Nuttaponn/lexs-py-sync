import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';

interface TastDto {
  no?: string;
  docdetail?: string;
  docdate?: Date;
  saveas?: string;
  savedate?: Date;
}

@Component({
  selector: 'app-preference-document-led',
  standalone: true,
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, PipesModule],
  templateUrl: './preference-document-led.component.html',
  styleUrl: './preference-document-led.component.scss',
})
export class PreferenceDocumentLedComponent implements OnInit {
  docData: Array<TastDto> = [];
  docDataTemp: Array<TastDto> = [];
  displayedColumns: string[] = ['no', 'docdetail', 'docdate', 'saveas', 'savedate'];
  isedit = false;

  constructor() {}

  ngOnInit(): void {
    let en = {} as TastDto;
    en.no = '1';
    en.docdetail = 'abc';
    en.docdate = new Date();
    en.saveas = 'xxx';
    en.savedate = new Date();
    this.docData.push(en);

    en = {} as TastDto;
    en.no = '2';
    en.docdetail = 'def';
    en.docdate = new Date();
    en.saveas = 'xxx';
    en.savedate = new Date();
    this.docData.push(en);
  }

  savesenddoc() {
    this.isedit = true;
    this.docDataTemp = JSON.parse(JSON.stringify(this.docData));
  }
  save() {
    this.docData = this.docDataTemp;
    this.isedit = false;
  }
  cancel() {
    this.isedit = false;
  }

  onDateChange(i: any, value: Date) {
    let en = this.docDataTemp.find(x => x.no === i);
    if (en) {
      en.docdate = value;
    }
  }
}
