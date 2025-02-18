import { Injectable } from '@angular/core';
import { SeizureFeeControllerService, SeizureInvoiceDto, SeizureReceiptDto, SeizureRequest } from '@lexs/lexs-client';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeizureUploadDialogService {
  successMsg = 'Success message';
  invalidMsg = 'Invalid message';

  constructor(private seizureUploadDialogService: SeizureFeeControllerService) {}

  private _seizureInvoiceDto!: SeizureInvoiceDto;
  public get seizureInvoiceDto(): SeizureInvoiceDto {
    return this._seizureInvoiceDto;
  }
  public set seizureInvoiceDto(value: SeizureInvoiceDto) {
    this._seizureInvoiceDto = value;
  }

  async getInvoice(seizureLedId: number): Promise<SeizureInvoiceDto> {
    return await lastValueFrom(this.seizureUploadDialogService.getInvoice(seizureLedId));
  }

  async payment(seizureLedId: number): Promise<any> {
    return await lastValueFrom(this.seizureUploadDialogService.payment(seizureLedId));
  }

  async saveSeizureFeeReceipt(seizureLedId: number, seizureRequest: SeizureRequest): Promise<any> {
    return await lastValueFrom(this.seizureUploadDialogService.saveSeizureFeeReceipt(seizureLedId, seizureRequest));
  }

  async uploadSeizureFeeInvoice(seizureLedId: number, file: Blob): Promise<SeizureInvoiceDto> {
    return await lastValueFrom(this.seizureUploadDialogService.uploadSeizureFeeInvoice(seizureLedId, file));
  }

  async uploadSeizureFeeReceipt(seizureLedId: number, file: Blob): Promise<SeizureReceiptDto> {
    return await lastValueFrom(this.seizureUploadDialogService.uploadSeizureFeeReceipt(seizureLedId, file));
  }
}
