/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface ReceiveDto { 
    createDate?: string;
    creditNote?: string;
    currentAssigneeId?: string;
    currentAssigneeName?: string;
    displayMaker?: string;
    makerFullName?: string;
    makerId?: string;
    paidAmount?: string;
    payer?: string;
    payerDisplayName?: string;
    receiveNo?: string;
    receiveStatus?: string;
    receiveStatusName?: string;
    receiveType?: string;
    receiverBranch?: Array<string>;
    refundAmount?: string;
    runningNumber?: number;
    sla?: number;
    slaDays?: string;
    statusCode?: string;
    statusName?: string;
    taskCode?: string;
    taskId?: number;
    taskName?: string;
}

