export const SeizureUploadDialogModel = {
  title: 'อัปโหลดใบแจ้งการชำระเงิน (PDF ไม่เกิน 30MB)',
  upload_title: 'ใบแจ้งการชำระเงิน',
  uploadInfo: {
    taskId: '',
    cif: '',
    documentTemplateId: '',
  },
  isUploaded: false,
  isRequired: false,
  isSubmitted: false,
};

export const SeizureUploadReceiptDialogModel = {
  title: 'อัปโหลดใบเสร็จรับเงิน (PDF ไม่เกิน 30 MB)',
  upload_title: 'ใบเสร็จ',
  uploadInfo: {
    taskId: '',
    cif: '',
    documentTemplateId: '',
  },
  isUploaded: false,
  isRequired: false,
  isSubmitted: false,
};

export const SeizureUploadDialogForm = {
  amount: 0,
  companyCode: '',
  imageId: '',
  imageName: '',
  invoiceDueDate: '',
  invoiceId: 0,
  ledName: '',
  paid: false,
  paidTimestamp: '',
  redCaseNo: '',
  refNo1: '',
  refNo2: '',
  uploadFlag: false,
};

export const SeizureUploadReceiptForm = {
  amount: 0,
  blackCaseNo: '',
  court: '',
  imageId: '',
  imageName: '',
  ledName: '',
  receiptBookNo: '',
  receiptNo: '',
  redCaseNo: '',
};
