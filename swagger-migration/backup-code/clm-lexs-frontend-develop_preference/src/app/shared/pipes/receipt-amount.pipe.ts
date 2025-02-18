import { Pipe, PipeTransform } from '@angular/core';
import { TransferOrderDto } from '@lexs/lexs-client';

@Pipe({
  name: 'receiptAmount',
})
export class ReceiptAmountPipe implements PipeTransform {
  transform(value: any, ...args: any[]): unknown {
    const type = args[0];
    let transferOrders = value.transferOrders;
    switch (type) {
      case 'CLEARING':
        return this.sumClearingAmountAmount(transferOrders);
      case 'TOTAL':
        return this.sumTotalAmount(value);
      default:
        return '-';
    }
  }

  sumTotalAmount(value: any) {
    let list = value.transferOrders || [];
    let outboundTransferTransaction = value.outboundTransferTransaction || [];
    let sum: number = 0;
    for (let index = 0; index < list.length; index++) {
      const trf: any = list[index];
      let receiveT = trf.receiveTransactions
        ?.map((t: any) => Number(t?.clearingAmount))
        .reduce((acc?: number, value?: number) => acc! + value!, 0);
      let transferT = trf.transferTransactions
        ?.map((t: any) => Number(t?.sendAmount))
        .reduce((acc?: number, value?: number) => acc! + value!, 0);
      sum = sum + receiveT + transferT;
    }
    if (outboundTransferTransaction && outboundTransferTransaction.length > 0) {
      let outboundT = outboundTransferTransaction
        ?.map((t: any) => Number(t?.sendAmount))
        .reduce((acc?: number, value?: number) => acc! + value!, 0);
      sum = sum + outboundT;
    }
    return sum;
  }

  sumClearingAmountAmount(list: TransferOrderDto) {
    return list?.receiveTransactions
      ?.map(t => Number(t?.clearingAmount))
      .reduce((acc?: number, value?: number) => acc! + value!, 0);
  }
}
