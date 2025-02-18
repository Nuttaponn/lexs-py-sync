import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentPreparationResolver {
  constructor() {}

  async resolve(): Promise<boolean> {
    // const customerId: string = this.customerService?.customerDetail?.customerId || this.lawsuitService?.currentLitigation?.customerId || ''
    // const response: PageOfDocumentAuditLogDto = await this.customerService.inquiryDocumentAuditLog(customerId || '', '', 0, 10);
    // this.documentService.pageOfDocumentAuditLog = response;
    return true;
  }
}
