/**
 * KTB Backend for Frontend APIs.
 *
 * Contact: 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { TransferInfo } from './transferInfo';


export interface TransferOfPropertyRequest { 
    referenceNum?: string;
    transferDate?: string;
    transferInfo?: TransferInfo;
    transferResult?: number;
    transferResultReason?: string;
}

