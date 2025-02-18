import { Pipe, PipeTransform } from '@angular/core';
import { DOC_TEMPLATE } from '@app/shared/constant';

@Pipe({
  name: 'attibuteDocument',
})
export class AttibuteDocumentPipe implements PipeTransform {
  transform(element: any, ...args: unknown[]): boolean {
    let attibuteName = args[0];
    let statusCode = args[1];
    let collumnName = args[2];
    let templatePrimary = [DOC_TEMPLATE.LEXSD002_1, DOC_TEMPLATE.LEXSD002_2, DOC_TEMPLATE.LEXSD001];

    switch (attibuteName) {
      case 'disabled':
        if (collumnName === 'received' || collumnName === 'rejectOriginalReceived') {
          return (
            element.sent !== true ||
            (element.received &&
              (element?.updateFlag === null || element?.updateFlag === undefined) &&
              statusCode === 'IN_PROGRESS') ||
            element.hasOriginalCopy !== true ||
            (element.received && element.hasSave)
          );
        } else if (collumnName === 'sent') {
          return (
            templatePrimary.includes(element?.documentTemplate?.documentTemplateId) ||
            (element.sent &&
              (element?.updateFlag === null || element?.updateFlag === undefined) &&
              statusCode === 'IN_PROGRESS') ||
            element.hasOriginalCopy !== true ||
            element.storeOrganization === '001000' ||
            (element.sent && element.hasSave)
          );
        }

        break;
      case 'inactive':
        if (collumnName === 'sent') {
          return (
            templatePrimary.includes(element?.documentTemplate?.documentTemplateId) ||
            (element.sent &&
              (element?.updateFlag === null || element?.updateFlag === undefined) &&
              statusCode === 'IN_PROGRESS') ||
            element.storeOrganization === '001000' ||
            (element.sent && element.hasSave)
          );
        }

        break;

      default:
        break;
    }
    return false;
  }
}
