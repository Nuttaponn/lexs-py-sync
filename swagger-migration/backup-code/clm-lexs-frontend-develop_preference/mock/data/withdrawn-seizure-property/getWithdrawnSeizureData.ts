import { WithdrawSeizureResponse } from "@lexs/lexs-client";
import { lastValueFrom, of } from "rxjs";
export const getWithdrawnSeizureData = (withdrawSeizureId: number): Promise<WithdrawSeizureResponse> => {
  return lastValueFrom(
    of({
      withdrawSeizureId: 1,
      reasonWithdrawSeizures: '3',
      status: 'R2E06-01-A_CREATE',
      actorId: '1234',
      litigationCaseId: 506,
      withdrawSeizureType: 'TYPE1',
      isContactResponseForExpense: true,
      debtPaidAmount: 500,
      withdrawSeizureGroups: [
        {
          withdrawSeizuresGroupId: 1,
          collaters: [
            {
              collateralId: '160800005',
              collateralType: 'ที่ดิน',
              collateralSubType: 'โฉนด',
              documentNo: '77644',
              collateralDetails:
                'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  77644  เลขที่ดิน/เล่มที่  123/-  หน้าสำรวจ/ระวาง  -/5136IV 8042-3  เนื้อที่  0  ไร่  0  งาน  16.00  ตร.วา ตำบล  บึงลาดสวาย  อำเภอ  ลำลูกกา  จังหวัด  ปทุมธานี',
              status: 'SEIZURED',
              owners: [
                {
                  ownerId: '9885544',
                  ownerName: 'MOCKFIRST MOCKLAST',
                  consentDocument: {
                    documentId: 768379,
                    documentTemplate: {
                      documentTemplateId: 'LEXSD006',
                      documentName: 'สรุปหลักประกัน',
                    },
                    imageSource: 'LEXS',
                    imageId: 'ae166ade-10be-4750-8b24-5c4e9b7dec88',
                    imageName: 'NOTICE_LETTER defact.pdf',
                  },
                },
              ],
            },
            {
              collateralId: '160800006',
              collateralType: 'ที่ดิน',
              collateralSubType: 'โฉนด',
              documentNo: '15963',
              collateralDetails:
                'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  15963  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/-  เนื้อที่  1  ไร่  0  งาน  0.00  ตร.วา ตำบล  มหาสวัสดิ์  อำเภอ  บางกรวย  จังหวัด  นนทบุรี',
              status: 'SEIZURED',
              owners: [
                {
                  ownerId: '9885544',
                  ownerName: 'MOCKFIRST MOCKLAST',
                  consentDocument: {
                    documentId: 768380,
                    documentTemplate: {
                      documentTemplateId: 'LEXSD007',
                      documentName: 'ใบเปลี่ยนชื่อ',
                    },
                    imageSource: '',
                    imageId: '',
                    imageName: '',
                  },
                },
              ],
            },
          ],
          contacts: [
            {
              withdrawSeizuresContactId: 1,
              personId: 'LXPER20230000000111',
              firstName: 'test ',
              lastName: 'reject',
              isMainContact: true,
              identificationNo: '9120791270991',
              relation: 'ผู้กู้หลัก',
            },
          ],
        },
      ],
    })
  );
}
