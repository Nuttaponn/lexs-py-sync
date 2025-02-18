import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BuddhistEraPipe } from './buddhist.pipe';
import { ConvertDomPipePipe } from './convert-dom-pipe.pipe';
import { DatauriPipe } from './datauri.pipe';
import { EmptyFormatPipe } from './empty-format.pipe';
import { AcctNumberFormatterPipe } from './format-acctNumber.pipe';
import { NumberDecimalPipe } from './number-decimal.pipe';
import { PhonePipe } from './phone.pipe';
import { Sec2minPipe } from './sec2min.pipe';
import { ThaiCitizenIDPipe } from './thai-citizen-id.pipe';
import { RefNoPipe } from './refNo.pipe';

@NgModule({
  declarations: [
    DatauriPipe,
    BuddhistEraPipe,
    AcctNumberFormatterPipe,
    NumberDecimalPipe,
    PhonePipe,
    ThaiCitizenIDPipe,
    Sec2minPipe,
    EmptyFormatPipe,
    ConvertDomPipePipe,
    RefNoPipe
  ],
  imports: [CommonModule],
  exports: [
    DatauriPipe,
    BuddhistEraPipe,
    AcctNumberFormatterPipe,
    NumberDecimalPipe,
    PhonePipe,
    ThaiCitizenIDPipe,
    Sec2minPipe,
    EmptyFormatPipe,
    ConvertDomPipePipe,
    RefNoPipe
  ],
})
export class PipeModule {}
