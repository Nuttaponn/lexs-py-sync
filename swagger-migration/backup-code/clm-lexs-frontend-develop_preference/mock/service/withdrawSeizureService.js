function getWithdrawSeizureList() {
  return {
    withdrawSeizureId: 1,
    reasonWithdrawSeizures: '',
    status: 'CANCELLED',
    rejectReason:
      'สเตริโอจัมโบ้ ภูมิทัศน์นิวส์ ธุรกรรมเยอบีร่าฮ็อตแหววฮิบรู แอ็คชั่นโครนาลิมิตรอยัลตี้เวิร์ค แดนซ์ ตู้เซฟรีโมท ตอกย้ำเอาต์ไตรมาสโปลิศ รอยัลตี้ฟลุคสะกอมเกย์แทงโก้ แซ็กโซโฟนปาสเตอร์บู๊ลิมูซีน คอนแทคงั้นไมค์เซฟตี้ปฏิสัมพันธ์ ไทม์อีสต์ช็อปปิ้ง สเตย์ สเต็ปรูบิก ไกด์ แม็กกาซีน เอ๋',
    actorId: '1234',
    litigationCaseId: 506,
    withdrawSeizureType: 'TYPE1',
    isContactResponseForExpense: true,
    debtPaidAmount: '0.00',
    withdrawSeizureGroups: [
      {
        withdrawSeizuresGroupId: 1,
        collaterals: [
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
        consentDocuments: [
          {
            id: 1,
            ownerId: '11111',
            ownerName: 'นายกอไก่ นามสกุลกอไก่',
            ledId: 11111,
            ledName: '<สำนักงานบังคับคดี>',
            collList: ['0000001','0000002', '0000003'],
            createTimestamp: '',
            updateTimestamp: '2023-06-15T16:15:33+07:00',
            document: {
              documentId: 1,
              documentTemplate: {
                documentTemplateId: 'LEXSF110',
                documentName: 'เอกสารยินยอมให้โจทก์แถลง งดการขาย'
              },
              imageSource: 'LEXS',
              imageId: '1234',
              imageName: '',
              reuploadable: true // if status = R2E06-01-A_CREATE then true else false
            }
          }
        ]
      },
    ],
  };
}

function getWithdrawSeizureLed() {
  return {
    withdrawSeizureId: 31,
    reasonWithdrawSeizures: '01',
    status: 'PENDING',
    actorId: '460022',
    actorName: 'นาย ธนัญชัย อัศวมงคล',
    litigationCaseId: 10217,
    withdrawSeizureType: 'COL',
    createdTimestamp: '2023-06-15T16:15:33+07:00',
    isContactResponseForExpense: true,
    debtPaidAmount: '33000000.00',
    withdrawSeizureLed: {
      withdrawSeizureLedId: 98,
      civilCourtNo: 'ผบE19/4771',
      civilCourtName: 'ศาลจังหวัดสิงห์บุรี',
      ledId: 17,
      ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
      ledRefNo: '2002',
      ledRefNoDate: '2023-06-13',
      publicAuctionLawyerId: 'K4005',
      publicAuctionLawyerName: 'นาย พันธวัสส์ ขำสัจจา',
      status: 'R2E06-05-E_CREATE',
      resultDate: '2023-06-26T00:00:00+07:00',
      withdrawSeizureLedDocuments: [
        {
          documentTemplate: {
            documentTemplateId: 'LEXSF111',
            documentName: 'หนังสือแจ้งถอนการยึดทรัพย์',
          },
          active: true,
          isSubContract: false,
        },
        {
          documentTemplate: {
            documentTemplateId: 'LEXSF112',
            documentName: 'คำแถลงสวมสิทธิ์แทนโจทก์',
          },
          active: true,
          isSubContract: false,
        },
        {
          documentTemplate: {
            documentTemplateId: 'LEXSF121',
            documentName: 'คำแถลงขอถอนการยึดทรัพย์และรับค่าใช้จ่ายคืน',
          },
          active: true,
          isSubContract: false,
        },
        {
          documentTemplate: { documentTemplateId: 'LEXSF122', documentName: 'ใบขอรับเงินคืน' },
          active: true,
          isSubContract: false,
        },
        {
          documentTemplate: {
            documentTemplateId: 'LEXSF123',
            documentName: 'รายงานเจ้าหน้าที่คืนเงินให้ธนาคาร',
          },
          active: true,
          isSubContract: false,
        },
        {
          documentTemplate: {
            documentTemplateId: 'LEXSF124',
            documentName: 'สำเนาเช็คที่ธนาคารได้รับเงินวางประกันค่าใช้จ่ายคืน',
          },
          active: true,
          isSubContract: false,
        },
      ],
      withdrawSeizureLedGroups: [
        {
          withdrawSeizuresGroupId: 537,
          collaterals: [
            {
              collateralId: '99000086',
              collateralType: 'ที่ดิน',
              collateralSubType: 'ตราจอง',
              documentNo: '8411',
              collateralDetails:
                'ประเภทเอกสารสิทธิ์  ตราจอง  เลขที่  8411  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/5236C2010  เนื้อที่  5  ไร่  3  งาน  50.00  ตร.วา ตำบล  โสธร  อำเภอ  เมืองฉะเชิงเทรา  จังหวัด  ฉะเชิงเทรา',
              totalAppraisalValue: '18800000.00',
              ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
              status: 'SEIZURED',
              owners: [{ ownerId: '8096855', ownerName: ' ' }],
              withdrawSeizureResult: 'U',
              withdrawSeizureReason: '01',
              remark: '',
            },
            {
              collateralId: '99000084',
              collateralType: 'ที่ดิน',
              collateralSubType: 'โฉนด',
              documentNo: '9640',
              collateralDetails:
                'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  9640  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/5136 I 1620  เนื้อที่  8  ไร่  2  งาน  26.00  ตร.วา ตำบล  คลองนครเนื่องเขต  อำเภอ  เมืองฉะเชิงเทรา  จังหวัด  ฉะเชิงเทรา',
              totalAppraisalValue: '24052000.00',
              ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
              status: 'SEIZURED',
              owners: [{ ownerId: '8096855', ownerName: ' ' }],
              withdrawSeizureResult: 'U',
              withdrawSeizureReason: '01',
              remark: '',
            },
          ],
          contacts: [
            {
              withdrawSeizuresContactId: 21669,
              personId: '8096855',
              firstName: 'MOCKFIRST',
              lastName: 'MOCKLAST',
              isMainContact: true,
              identificationNo: '3503537002533',
              relation: 'ผู้กู้หลัก',
              paidFeeAmount: '5000.00',
            },
            {
              withdrawSeizuresContactId: 21670,
              firstName: 'TUNVA',
              lastName: 'PARDEE',
              telephoneNo: '0954874747',
              isMainContact: false,
              paidFeeAmount: '0.00',
            },
            {
              withdrawSeizuresContactId: 21671,
              firstName: 'GUNYA',
              lastName: 'PARDEE',
              telephoneNo: '0956545465',
              isMainContact: false,
              paidFeeAmount: '0.00',
            },
          ],
          withdrawSeizureLedGroupDocuments: [
            {
              documentTemplate: {
                documentTemplateId: 'LEXSF125',
                documentName: 'รายงานเจ้าหน้าที่แจ้งจำนวนเงินที่ต้องวางเพิ่ม',
              },
              active: true,
              isSubContract: false,
            },
            {
              documentTemplate: {
                documentTemplateId: 'LEXSF126',
                documentName: 'ใบรับเงินค่าธรรมเนียมยึดแล้วไม่มีการขายฯ',
              },
              active: true,
              isSubContract: false,
            },
          ],
          consentDocuments: [
            {
              id: 1,
              ownerId: '11111',
              ownerName: '',
              ledId: 11111,
              ledName: '',
              collList: ['1','2'],
              createTimestamp: '',
              updateTimestamp: '2023-06-15T16:15:33+07:00',
              document: {
                documentId: 1,
                documentTemplate: {
                  documentTemplateId: 'LEXSF110',
                  documentName: 'เอกสารยินยอมให้โจทก์แถลง งดการขาย'
                },
                imageSource: 'LEXS',
                imageId: '',
                imageName: '',
                reuploadable: true // if status = R2E06-01-A_CREATE then true else false
              }
            }
          ],
        },
        {
          withdrawSeizuresGroupId: 538,
          collaterals: [
            {
              collateralId: '99000114',
              collateralType: 'ตราสารทุน',
              collateralSubType: 'ใบสำคัญแสดงสิทธิในการจองซื้อหุ้นสามัญ',
              documentNo: '14293',
              collateralDetails: 'ผู้ออกใบหุ้น  -  จำนวนหุ้น  -',
              totalAppraisalValue: '0.00',
              ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
              status: 'SEIZURED',
              owners: [{ ownerId: '8096855', ownerName: ' ' }],
              withdrawSeizureResult: 'S',
              withdrawSeizureReason: '01',
              remark: '',
            },
          ],
          contacts: [
            {
              withdrawSeizuresContactId: 21672,
              firstName: 'MESA',
              lastName: 'PARDEE',
              telephoneNo: '0958485865',
              isMainContact: true,
              paidFeeAmount: '0.00',
            },
            {
              withdrawSeizuresContactId: 21673,
              firstName: 'MEENA',
              lastName: 'PARDEE',
              telephoneNo: '0954586856',
              isMainContact: false,
              paidFeeAmount: '0.00',
            },
          ],
          withdrawSeizureLedGroupDocuments: [
            {
              documentTemplate: {
                documentTemplateId: 'LEXSF125',
                documentName: 'รายงานเจ้าหน้าที่แจ้งจำนวนเงินที่ต้องวางเพิ่ม',
              },
              active: true,
              isSubContract: false,
            },
            {
              documentTemplate: {
                documentTemplateId: 'LEXSF126',
                documentName: 'ใบรับเงินค่าธรรมเนียมยึดแล้วไม่มีการขายฯ',
              },
              active: true,
              isSubContract: false,
            },
          ],
        },
      ],
    },
  };
}

function getWithdrawSeizureExcution() {
  return {
    litigationId: 'LE2566040019',
    litigationCases: [
      {
        litigationCaseId: 10393,
        courtBlackCaseNo: 'ผบE19/4732',
        courtRedCaseNo: 'คพR21/3018',
        withdrawSeizure: [
          {
            withdrawSeizureId: 20,
            reasonWithdrawSeizures: '01',
            status: 'R2E06-02-B_CREATE',
            actorId: '460013',
            actorName: 'นาย นันทวัต ชนีภาพ',
            litigationCaseId: 10393,
            withdrawSeizureType: 'COL',
            isContactResponseForExpense: true,
            debtPaidAmount: '10000000.00',
            withdrawSeizureLeds: [],
          },
          {
            withdrawSeizureId: 19,
            reasonWithdrawSeizures: '01',
            status: 'PENDING',
            actorId: '460013',
            actorName: 'นาย นันทวัต ชนีภาพ',
            litigationCaseId: 10393,
            withdrawSeizureType: 'COL',
            createdTimestamp: '2023-06-02T14:17:39+07:00',
            isContactResponseForExpense: true,
            debtPaidAmount: '10000000.00',
            withdrawSeizureLeds: [
              {
                withdrawSeizureLedId: 18,
                civilCourtNo: 'ผบE19/4732',
                civilCourtName: 'ศาลจังหวัดชัยบาดาล',
                ledId: 84,
                ledName: 'สำนักงานบังคับคดีจังหวัดลพบุรี สาขาชัยบาดาล',
                ledRefNo: '12334',
                ledRefNoDate: '2023-06-02',
                publicAuctionLawyerId: 'K3602',
                publicAuctionLawyerName: 'นางสาว นาดีญา ลงแก',
                status: 'R2E06-05-E_CREATE',
                resultDate: '2023-06-15T00:00:00+07:00',
                withdrawSeizureLedDocuments: [
                  {
                    documentId: '884123',
                    documentTemplate: {
                      documentTemplateId: 'LEXSF111',
                      documentName: 'หนังสือแจ้งถอนการยึดทรัพย์',
                    },
                    imageSource: 'LEXS',
                    imageId: 'c7af35ea-7696-485d-931a-d47d004b7318',
                    imageName: '1686628321352-vert.jpg',
                    uploadTimestamp: '2023-06-13T12:00:05+07:00',
                    active: true,
                    allowedUploadFlag: 'N',
                    isSubContract: false,
                  },
                  {
                    documentTemplate: {
                      documentTemplateId: 'LEXSF112',
                      documentName: 'คำแถลงสวมสิทธิ์แทนโจทก์',
                    },
                    active: true,
                    allowedUploadFlag: 'Y',
                    isSubContract: false,
                  },
                  {
                    documentTemplate: {
                      documentTemplateId: 'LEXSF121',
                      documentName: 'คำแถลงขอถอนการยึดทรัพย์และรับค่าใช้จ่ายคืน',
                    },
                    active: true,
                    allowedUploadFlag: 'N',
                    isSubContract: false,
                  },
                  {
                    documentTemplate: {
                      documentTemplateId: 'LEXSF122',
                      documentName: 'ใบขอรับเงินคืน',
                    },
                    active: true,
                    allowedUploadFlag: 'N',
                    isSubContract: false,
                  },
                  {
                    documentTemplate: {
                      documentTemplateId: 'LEXSF123',
                      documentName: 'รายงานเจ้าหน้าที่คืนเงินให้ธนาคาร',
                    },
                    active: true,
                    allowedUploadFlag: 'N',
                    isSubContract: false,
                  },
                  {
                    documentTemplate: {
                      documentTemplateId: 'LEXSF124',
                      documentName: 'สำเนาเช็คที่ธนาคารได้รับเงินวางประกันค่าใช้จ่ายคืน',
                    },
                    active: true,
                    allowedUploadFlag: 'N',
                    isSubContract: false,
                  },
                ],
                withdrawSeizureLedGroups: [
                  {
                    withdrawSeizuresGroupId: 57,
                    collaterals: [
                      {
                        collateralId: '43330',
                        collateralType: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                        collateralSubType: 'โฉนด',
                        documentNo: '3143',
                        collateralDetails:
                          'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  3143  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/-  เนื้อที่  3  ไร่  1  งาน  80.00  ตร.วา ตำบล  อ่าวน้อย  อำเภอ  เมืองประจวบคีรีขันธ์  จังหวัด  ประจวบคีรีขันธ์',
                        totalAppraisalValue: '7099000.00',
                        ledName: 'สำนักงานบังคับคดีจังหวัดลพบุรี สาขาชัยบาดาล',
                        status: 'SEIZURED',
                        owners: [{ ownerId: '9758654', ownerName: 'MOCKTITLEMOCKFIRST MOCKLAST' }],
                        withdrawSeizureResult: 'U',
                        withdrawSeizureReason: '04',
                        remark: 'test',
                      },
                    ],
                    contacts: [
                      {
                        withdrawSeizuresContactId: 79,
                        personId: '12913496',
                        firstName: 'MOCKFIRST',
                        lastName: 'MOCKLAST',
                        isMainContact: true,
                        relation: 'ผู้ค้ำประกัน',
                        paidFeeAmount: '55555555.00',
                      },
                    ],
                  },
                ],
                withdrawSeizureLedGroupDocuments: [
                  {
                    documentTemplate: {
                      documentTemplateId: 'LEXSF125',
                      documentName: 'รายงานเจ้าหน้าที่แจ้งจำนวนเงินที่ต้องวางเพิ่ม',
                    },
                    active: true,
                    isSubContract: false,
                  },
                  {
                    documentTemplate: {
                      documentTemplateId: 'LEXSF126',
                      documentName: 'ใบรับเงินค่าธรรมเนียมยึดแล้วไม่มีการขายฯ',
                    },
                    active: true,
                    isSubContract: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

function getSeizureExcution() {
  return {
    litigationId: 'LE2566040019',
    litigationCases: [
      {
        litigationCaseId: 10393,
        courtBlackCaseNo: 'ผบE19/4732',
        courtRedCaseNo: 'คพR21/3018',
        litigationCaseCollateralsCount: 26,
        seizures: [
          {
            seizureId: 134,
            createdTimestamp: '2023-05-31T12:05:01+07:00',
            seizureCollaterals: [
              {
                collateralId: '43330',
                collateralType: '2',
                collateralSubType: '1',
                collateralTypeDesc: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                collateralSubTypeDesc: 'โฉนด',
                documentNo: '3143',
                ownerFullName: 'MOCKTITLEMOCKFIRST MOCKLAST',
                totalAppraisalValue: '7099000.00',
                collateralCmsStatus: 'Pledge',
                collateralCaseLexStatus: 'SEIZURED',
                collateralDetails:
                  'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  3143  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/-  เนื้อที่  3  ไร่  1  งาน  80.00  ตร.วา ตำบล  อ่าวน้อย  อำเภอ  เมืองประจวบคีรีขันธ์  จังหวัด  ประจวบคีรีขันธ์',
                seizureStatus: 'COMPLETED',
                seizureResultFlag: true,
              },
            ],
            seizureLeds: [
              {
                id: 222,
                seizureId: 134,
                ledId: 84,
                ledName: 'สำนักงานบังคับคดีจังหวัดลพบุรี สาขาชัยบาดาล',
                ledRefNo: '12334',
                ledRefNoDate: '2023-06-02',
                ledRefNoEditable: false,
                onsiteLawyerId: 'K3602',
                status: 'COMPLETED',
                createdTimestamp: '2023-05-31T12:05:01+07:00',
                completedTimestamp: '2023-06-02T13:23:47+07:00',
                seizureLedType: 'MAIN',
                isDocumentsRequired: true,
                isFeePaid: true,
                isEligibleToRecordSeizureResult: true,
                documents: [
                  {
                    imageSource: 'LEXS',
                    imageId: '96fe53b2-5066-4d4e-9d33-21664fe5e185',
                    imageName: 'file',
                    documentDate: '2023-06-02T13:21:03+07:00',
                    reuploadable: false,
                    uploadType: 'DIRECT_UPLOAD',
                    documentTemplate: {
                      documentTemplateId: 'LEXSF106',
                      documentName: 'คําขอยึดทรัพย์อสังหาริมทรัพย์',
                      optional: false,
                    },
                  },
                  {
                    imageSource: 'LEXS',
                    imageId: '5f3441a7-d452-43f9-b828-4671fc44fd52',
                    imageName: 'file',
                    documentDate: '2023-06-02T13:21:06+07:00',
                    reuploadable: false,
                    uploadType: 'DIRECT_UPLOAD',
                    documentTemplate: {
                      documentTemplateId: 'LEXSF108',
                      documentName: 'คำขอนำส่งต้นฉบับเอกสาร',
                      optional: false,
                    },
                  },
                  {
                    imageSource: 'LEXS',
                    imageId: '365fb3bb-1e5a-43dd-9488-b40d89cfa646',
                    imageName: 'payment_slip_สำนักงานบังคับคดีจังหวัดปทุมธานี.pdf',
                    documentDate: '2023-06-02T13:21:13+07:00',
                    reuploadable: false,
                    uploadType: 'INVOICE',
                    documentTemplate: {
                      documentTemplateId: 'LEXSF119',
                      documentName: 'ใบแจ้งหนี้ค่าธรรมเนียมตั้งเรื่องยึดทรัพย์',
                      optional: false,
                    },
                  },
                  {
                    imageSource: 'LEXS',
                    imageId: '57b4c0af-0795-4bb9-ba10-f95ca4bb91fd',
                    imageName: 'ใบเสร็จ - Chayapon Patpunna.pdf',
                    documentDate: '2023-06-02T13:21:24+07:00',
                    reuploadable: false,
                    uploadType: 'RECEIPT',
                    documentTemplate: {
                      documentTemplateId: 'LEXSF120',
                      documentName: 'ใบเสร็จค่าธรรมเนียมการยึดทรัพย์',
                      optional: false,
                    },
                  },
                  {
                    imageSource: 'LEXS',
                    imageId: 'f6205053-0530-43be-9ecc-916d26b1ab65',
                    imageName: 'file',
                    documentDate: '2023-06-02T13:21:28+07:00',
                    reuploadable: false,
                    uploadType: 'DIRECT_UPLOAD',
                    documentTemplate: {
                      documentTemplateId: 'LEXSF105',
                      documentName: 'รายงานการยึดทรัพย์',
                      optional: false,
                    },
                  },
                  {
                    uploadType: 'DIRECT_UPLOAD',
                    documentTemplate: {
                      documentTemplateId: 'LEXSF107',
                      documentName: 'คําขอยึดทรัพย์ต่างสํานักงาน',
                      optional: true,
                    },
                  },
                ],
                collaterals: [
                  {
                    collateralId: '43330',
                    collateralType: '2',
                    collateralSubType: '1',
                    collateralTypeDesc: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                    collateralSubTypeDesc: 'โฉนด',
                    documentNo: '3143',
                    ownerFullName: 'MOCKTITLEMOCKFIRST MOCKLAST',
                    totalAppraisalValue: '7099000.00',
                    collateralCmsStatus: 'Pledge',
                    collateralCaseLexStatus: 'SEIZURED',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  3143  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/-  เนื้อที่  3  ไร่  1  งาน  80.00  ตร.วา ตำบล  อ่าวน้อย  อำเภอ  เมืองประจวบคีรีขันธ์  จังหวัด  ประจวบคีรีขันธ์',
                    seizureStatus: 'COMPLETED',
                    seizureResultFlag: true,
                  },
                ],
                feePaidTimestamp: '2023-06-02T13:21:15+07:00',
              },
            ],
            unMappedCollaterals: [],
          },
        ],
      },
    ],
  };
}

function getWithdrawnCammands() {
  return {
    litigationId: 'LE2566040004',
    litigationCases: [
      {
        litigationCaseId: '1',
        courtBlackCaseNo: 'ผบE19/4771',
        courtRedCaseNo: 'คพR21/3000',
        withdrawSeizure: [
          {
            withdrawSeizureId: 27,
            reasonWithdrawSeizures: '',
            status: 'CANCELLED',
            statusName: '',
            actorId: '460022',
            litigationCaseId: 10217,
            withdrawSeizureType: 'COL',
            isContactResponseForExpense: true,
            debtPaidAmount: '0.00',
            rejectReason: 'test rejected',
            withdrawSeizureGroups: [],
          },
          {
            withdrawSeizureId: 29,
            reasonWithdrawSeizures: '02',
            status: 'CANCELLED',
            statusName: '',
            actorId: '460022',
            litigationCaseId: 10217,
            withdrawSeizureType: 'COL',
            createdTimestamp: '2023-06-13T18:31:00+07:00',
            isContactResponseForExpense: true,
            debtPaidAmount: '10000.00',
            withdrawSeizureGroups: [],
          },
          {
            withdrawSeizureId: 30,
            reasonWithdrawSeizures: '02',
            status: 'CORRECT_PENDING',
            statusName: 'รอแก้ไข ถอนการยึดทรัพย์',
            actorId: '460022',
            litigationCaseId: 10217,
            withdrawSeizureType: 'COL',
            isContactResponseForExpense: true,
            debtPaidAmount: '',
            withdrawSeizureGroups: [
              {
                withdrawSeizuresGroupId: 437,
                collaterals: [
                  {
                    collateralId: '10332',
                    collateralType: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                    collateralSubType: 'โฉนด',
                    documentNo: '517',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  517  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/1ต1อ15  เนื้อที่  0  ไร่  1  งาน  82.00  ตร.วา ตำบล  ช้างคลาน  อำเภอ  เมืองเชียงใหม่  จังหวัด  เชียงใหม่',
                    totalAppraisalValue: '35545000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '13211244' }, { ownerId: '13211245' }],
                  },
                  {
                    collateralId: '99000084',
                    collateralType: 'ที่ดิน',
                    collateralSubType: 'โฉนด',
                    documentNo: '9640',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  9640  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/5136 I 1620  เนื้อที่  8  ไร่  2  งาน  26.00  ตร.วา ตำบล  คลองนครเนื่องเขต  อำเภอ  เมืองฉะเชิงเทรา  จังหวัด  ฉะเชิงเทรา',
                    totalAppraisalValue: '24052000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000085',
                    collateralType: 'ที่ดิน',
                    collateralSubType: 'นส.3ก',
                    documentNo: '8795',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  นส.3ก  เลขที่  8795  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/5136IV8830-9  เนื้อที่  0  ไร่  0  งาน  91.00  ตร.วา ตำบล  ทรายกองดิน  อำเภอ  มีนบุรี  จังหวัด  กรุงเทพมหานคร',
                    totalAppraisalValue: '1601600.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000086',
                    collateralType: 'ที่ดิน',
                    collateralSubType: 'ตราจอง',
                    documentNo: '8411',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  ตราจอง  เลขที่  8411  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/5236C2010  เนื้อที่  5  ไร่  3  งาน  50.00  ตร.วา ตำบล  โสธร  อำเภอ  เมืองฉะเชิงเทรา  จังหวัด  ฉะเชิงเทรา',
                    totalAppraisalValue: '18800000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000087',
                    collateralType: 'ที่ดิน',
                    collateralSubType: 'นส.3',
                    documentNo: '7960',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  นส.3  เลขที่  7960  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/-  เนื้อที่  0  ไร่  2  งาน  58.00  ตร.วา ตำบล  ช่องนนทรี  อำเภอ  ยานนาวา(พระโขนง)  จังหวัด  กรุงเทพมหานคร',
                    totalAppraisalValue: '231571000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000088',
                    collateralType: 'ที่ดิน',
                    collateralSubType: 'นส.3ข',
                    documentNo: '15967',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  นส.3ข  เลขที่  15967  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/5042IV2854-12  เนื้อที่  0  ไร่  2  งาน  94.00  ตร.วา ตำบล  ท่าทอง  อำเภอ  เมืองพิษณุโลก  จังหวัด  พิษณุโลก',
                    totalAppraisalValue: '588000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดปทุมธานี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000091',
                    collateralType: 'ที่ดิน',
                    collateralSubType: 'โฉนดตราจอง',
                    documentNo: '74551',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  โฉนดตราจอง  เลขที่  74551  เลขที่ดิน/เล่มที่  /-  หน้าสำรวจ/ระวาง  /5136IV8640-5  เนื้อที่  0  ไร่  0  งาน  51.80  ตร.วา ตำบล  บึงคำพร้อย  อำเภอ  ลำลูกกา  จังหวัด  ปทุมธานี',
                    totalAppraisalValue: '647500.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000092',
                    collateralType: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                    collateralSubType: 'โฉนด',
                    documentNo: '9681',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  โฉนด  เลขที่  9681  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/5น10อ  เนื้อที่  1  ไร่  0  งาน  18.00  ตร.วา ตำบล  ดอนกรวย  อำเภอ  ดำเนินสะดวก  จังหวัด  ราชบุรี',
                    totalAppraisalValue: '0.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000093',
                    collateralType: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                    collateralSubType: 'นส.3ก',
                    documentNo: '7231',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  นส.3ก  เลขที่  7231  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/7น.20อ.  เนื้อที่  0  ไร่  1  งาน  5.00  ตร.วา ตำบล  หน้าพระลาน  อำเภอ  เมืองสระบุรี  จังหวัด  สระบุรี',
                    totalAppraisalValue: '13500000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000094',
                    collateralType: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                    collateralSubType: 'ตราจอง',
                    documentNo: '10064',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  ตราจอง  เลขที่  10064  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/78ต.28อ.  เนื้อที่  0  ไร่  0  งาน  34.30  ตร.วา ตำบล  คอหงส์  อำเภอ  หาดใหญ่  จังหวัด  สงขลา',
                    totalAppraisalValue: '0.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000095',
                    collateralType: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                    collateralSubType: 'นส.3',
                    documentNo: '7232',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  นส.3  เลขที่  7232  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/7น.20อ.  เนื้อที่  0  ไร่  0  งาน  16.00  ตร.วา ตำบล  หน้าพระลาน  อำเภอ  เมืองสระบุรี  จังหวัด  สระบุรี',
                    totalAppraisalValue: '4500000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000096',
                    collateralType: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                    collateralSubType: 'นส.3ข',
                    documentNo: '55712',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  นส.3ข  เลขที่  55712  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/-  เนื้อที่  1  ไร่  0  งาน  56.40  ตร.วา ตำบล  คอกกระบือ  อำเภอ  เมืองสมุทรสาคร  จังหวัด  สมุทรสาคร',
                    totalAppraisalValue: '0.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000099',
                    collateralType: 'ที่ดินพร้อมสิ่งปลูกสร้าง',
                    collateralSubType: 'โฉนดตราจอง',
                    documentNo: '61054',
                    collateralDetails:
                      'ประเภทเอกสารสิทธิ์  โฉนดตราจอง  เลขที่  61054  เลขที่ดิน/เล่มที่  -/-  หน้าสำรวจ/ระวาง  -/-  เนื้อที่  0  ไร่  0  งาน  0.00  ตร.วา ตำบล  คอกกระบือ  อำเภอ  เมืองสมุทรสาคร  จังหวัด  สมุทรสาคร',
                    totalAppraisalValue: '0.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000100',
                    collateralType: 'อาคารสิ่งปลูกสร้าง',
                    collateralSubType: 'อาคารสิ่งปลูกสร้าง',
                    documentNo: '14151',
                    collateralDetails:
                      'ชื่ออาคาร  -  เลขที่สิ่งปลูกสร้าง  MOCK  สถานที่ตั้ง  - - -  ตำบล  ท่าอิฐ  อำเภอ  เมืองอุตรดิตถ์  จังหวัด  อุตรดิตถ์',
                    totalAppraisalValue: '0.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดอุตรดิตถ์',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000102',
                    collateralType: 'คอนโดมิเนียม/อาคารชุด/ห้องชุด',
                    collateralSubType: 'คอนโดมิเนียม/อาคารชุด/ห้องชุด',
                    collateralDetails:
                      'ชื่ออาคาร  นภาลัยคอนโดมิเนียม  ห้อง  1001  ชั้น  10  สถานที่ตั้ง  - - -  ตำบล  คอหงส์  อำเภอ  หาดใหญ่  จังหวัด  สงขลา',
                    totalAppraisalValue: '1364750.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000104',
                    collateralType: 'เครื่องจักร',
                    collateralSubType: 'ไม่มีประเภทย่อย',
                    collateralDetails:
                      'เลขทะเบียนเครื่องจักร  363262012717  ชื่ออาคาร  -  ที่ตั้ง  89/2 - -  ตำบล  บางปลา  อำเภอ  บางพลี  จังหวัด  สมุทรปราการ',
                    totalAppraisalValue: '600000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000105',
                    collateralType: 'สิทธิการเช่า',
                    collateralSubType: 'สิทธิการเช่าสิ่งปลูกสร้าง',
                    documentNo: '',
                    collateralDetails:
                      'ผู้เช่า  -  ชื่ออาคาร  ลุมพินีคอนโด  เลขที่สิ่งปลูกสร้าง  1124  สถานที่ตั้ง  - - -  ตำบล  นาท่ามเหนือ  อำเภอ  เมืองตรัง  จังหวัด  ตรัง',
                    totalAppraisalValue: '17200000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000106',
                    collateralType: 'สิทธิการเช่า',
                    collateralSubType: 'สิทธิเหนือที่ดินและสิทธิเก็บกิน',
                    documentNo: '14284',
                    collateralDetails:
                      'ผู้เช่า  -  ชื่ออาคาร  ศุภาลัย  เลขที่สิ่งปลูกสร้าง  1909  สถานที่ตั้ง  - - -  ตำบล  ท่าอิฐ  อำเภอ  เมืองอุตรดิตถ์  จังหวัด  อุตรดิตถ์',
                    totalAppraisalValue: '1300000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดนนทบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000107',
                    collateralType: 'สินค้า',
                    collateralSubType: 'ไม่มีประเภทย่อย',
                    documentNo: '14286',
                    collateralDetails:
                      'ประเภท  สินค้า  ประเภทสินค้า  ไม่มีประเภทย่อย  จำนวน  200 ตัน  มูลค่า  1,227,000.00  บาท',
                    totalAppraisalValue: '1227000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000112',
                    collateralType: 'ตราสารทุน',
                    collateralSubType: 'หุ้นสามัญ',
                    documentNo: '133',
                    collateralDetails: 'ผู้ออกใบหุ้น  -  จำนวนหุ้น  1,000,000',
                    totalAppraisalValue: '15620000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000113',
                    collateralType: 'ตราสารทุน',
                    collateralSubType: 'หุ้นบุริมสิทธิ์',
                    documentNo: '14291',
                    collateralDetails: 'ผู้ออกใบหุ้น  -  จำนวนหุ้น  -',
                    totalAppraisalValue: '1234000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000114',
                    collateralType: 'ตราสารทุน',
                    collateralSubType: 'ใบสำคัญแสดงสิทธิในการจองซื้อหุ้นสามัญ',
                    documentNo: '14293',
                    collateralDetails: 'ผู้ออกใบหุ้น  -  จำนวนหุ้น  -',
                    totalAppraisalValue: '0.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดฉะเชิงเทรา',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000115',
                    collateralType: 'ตราสารทุน',
                    collateralSubType: 'ใบสำคัญแสดงสิทธิในการจองซื้อหุ้นกู้',
                    documentNo: '14298',
                    collateralDetails: 'ผู้ออกใบหุ้น  -  จำนวนหุ้น  -',
                    totalAppraisalValue: '1600000.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดอุตรดิตถ์',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                  {
                    collateralId: '99000116',
                    collateralType: 'ตราสารทุน',
                    collateralSubType: 'ใบสำคัญแสดงสิทธิในเงินปันผล หรือดอกเบี้ยจากหลักทรัพย์',
                    documentNo: '24036',
                    collateralDetails: 'ผู้ออกใบหุ้น  -  จำนวนหุ้น  -',
                    totalAppraisalValue: '0.00',
                    ledName: 'สำนักงานบังคับคดีจังหวัดกาญจนบุรี',
                    status: 'SEIZURED',
                    owners: [{ ownerId: '8096855', ownerName: ' ' }],
                  },
                ],
                contacts: [
                  {
                    withdrawSeizuresContactId: 21542,
                    personId: '8096855',
                    firstName: 'MOCKFIRST',
                    lastName: 'MOCKLAST',
                    isMainContact: true,
                    identificationNo: '3503537002533',
                    relation: 'ผู้กู้หลัก',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

module.exports = {
  getWithdrawSeizureList: getWithdrawSeizureList(),
  getWithdrawSeizureLed: getWithdrawSeizureLed(),
  getWithdrawSeizureExcution: getWithdrawSeizureExcution(),
  getSeizureExcution: getSeizureExcution(),
  getWithdrawnCammands: getWithdrawnCammands(),
};
