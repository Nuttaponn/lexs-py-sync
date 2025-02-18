/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { PaymentAgentFeeAmt } from './paymentAgentFeeAmt';
import { Account } from './account';
import { CusFeeAmtResult } from './cusFeeAmtResult';
import { PaymentBankFeeAmt } from './paymentBankFeeAmt';
import { ComFeeAmtResult } from './comFeeAmtResult';


export interface PaymentDetail { 
    comAcct?: Account;
    comAmt?: number;
    comFeeAmtResult?: ComFeeAmtResult;
    cusAcct?: Account;
    cusFeeAmtResult?: CusFeeAmtResult;
    feeAmt?: number;
    otherFeeAmt?: number;
    paymentAgentFeeAmt?: PaymentAgentFeeAmt;
    paymentBankFeeAmt?: PaymentBankFeeAmt;
    pmtID?: number;
    seq?: number;
}

