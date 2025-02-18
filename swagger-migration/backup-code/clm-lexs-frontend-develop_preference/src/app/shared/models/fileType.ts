export type BlobType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/octet-stream'
  | 'image/jpg'
  | 'image/jpeg';
export const BlobType = {
  EXCEL_SHEET: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' as BlobType,
  DOC_SHEET: 'application/msword' as BlobType,
  DOCX_SHEET: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' as BlobType,
  PDF: 'application/pdf' as BlobType,
  OCTET_STREAM: 'application/octet-stream' as BlobType,
  JPG: 'image/jpg' as BlobType,
  JPEG: 'image/jpeg' as BlobType,
};

export type FileType = '.pdf' | '.xlsx' | '.doc' | '.docx';
export const FileType = {
  EXCEL_SHEET: '.xlsx' as FileType,
  DOC_SHEET: '.doc' as FileType,
  DOCX_SHEET: '.docx' as FileType,
  PDF: '.pdf' as FileType,
};

export const FileTypeMapper = new Map<string, string>([
  [BlobType.EXCEL_SHEET, FileType.EXCEL_SHEET],
  [BlobType.DOC_SHEET, FileType.DOC_SHEET],
  [BlobType.DOCX_SHEET, FileType.DOCX_SHEET],
  [BlobType.PDF, FileType.PDF],
  [BlobType.OCTET_STREAM, FileType.PDF],
]);

export const maxFileSize = 30;
export const acceptFile_PDF_JPG = [BlobType.PDF, BlobType.JPG, BlobType.JPEG];
export const accept_PDF = [BlobType.PDF];
export const acceptFile_EXCEL_SHEET = [BlobType.EXCEL_SHEET];
