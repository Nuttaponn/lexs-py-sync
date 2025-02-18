import { NameValuePair, PreferenceGroupDto, PreferenceDetails } from '@lexs/lexs-client';
import ExecuteTypeEnum = PreferenceGroupDto.ExecuteTypeEnum;
import ExecuteCaseTypeEnum = PreferenceDetails.ExecuteCaseTypeEnum;
import SellEnum = PreferenceDetails.SellEnum;
import {DOC_TEMPLATE} from "@shared/constant";

export interface CustomNameValuePair extends NameValuePair {
  docId?: string;
}
// ประเภทหมาย
export const executeType: CustomNameValuePair[] = [
  { name: 'หมายส่งโฉนดจากกรมบังคับคดี', value: ExecuteTypeEnum.DeedLed, docId: DOC_TEMPLATE.LEXSF311 },
  { name: 'ประกาศขายทอดตลาด', value: ExecuteTypeEnum.Auction, docId: DOC_TEMPLATE.LEXSF137MINUS2  },
  { name: 'รายงานการยึด', value: ExecuteTypeEnum.Seizure, docId: DOC_TEMPLATE.LEXSF105  },
  { name: 'อื่นๆ', value: ExecuteTypeEnum.Other, docId: DOC_TEMPLATE.LEXSF061  },
];

// ประเภทสั่งการ
export const executeCaseTypeEnum: NameValuePair[] = [
  { name: 'กรุณาเลือก', value: '' },
  { name: 'สั่งการยื่นบุริมสิทธิ', value: ExecuteCaseTypeEnum.Preference },
  { name: 'สั่งการไม่ยื่นบุริมสิทธิแต่ยังมีภาระหนี้', value: ExecuteCaseTypeEnum.NotPreferranceHaveDebt },
  { name: 'สั่งการไม่ยื่นบุริมสิทธิและแถลงไม่มีภาระหนี้จำนอง', value: ExecuteCaseTypeEnum.NotPreferranceNotDebt },
];

// เหตุผลที่ไม่ยื่นขอรับชำระหนี้
export const rejectReason: NameValuePair[] = [
  { name: 'กรุณาเลือก', value: '' },
  { name: 'อยู่ระหว่างเจรจากับโจทก์อื่น', value: PreferenceDetails.RejectReasonEnum.DiscussPlaintiff },
  { name: 'อยู่ระหว่างผ่อนชำระกับโจทก์อื่น', value: PreferenceDetails.RejectReasonEnum.PayPlaintiff },
  { name: 'โจทก์อื่นถอนการยึด', value: PreferenceDetails.RejectReasonEnum.WithdrawConfiscation },
  { name: 'อื่นๆ', value: PreferenceDetails.RejectReasonEnum.Other },
];

// วิธีการขาย
export const sell: NameValuePair[] = [
  { name: 'กรุณาเลือก', value: '' },
  { name: 'ขายโดยติดจำนอง', value: SellEnum.Mortgage },
  { name: 'ขายโดยปลอดจำนอง', value: SellEnum.NotMortgage },
];


