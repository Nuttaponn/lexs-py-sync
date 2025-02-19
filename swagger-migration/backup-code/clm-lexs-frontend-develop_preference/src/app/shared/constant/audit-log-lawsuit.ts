import { SimpleSelectOption } from '@spig/core';

const lawsuitAction = [
  'ยกเลิก task บันทึกคำฟ้อง',
  'อัปโหลดใบเสร็จ',
  'ปิด',
  'เพิ่ม',
  'อนุมัติ',
  'ไม่อนุมัติ',
  'บันทึกร่าง',
  'เสร็จสิ้น',
  'ส่ง',
  'อัปโหลดยืนยันการชำระเงิน',
  'ชำระค่าธรรมเนียมศาล',
  'สร้าง task บันทึกคำฟ้อง',
  'บันทึกข้อมูลคำฟ้อง',
  'แก้ไขข้อมูลคำฟ้อง',
  'ลบข้อมูลคำฟ้อง',
  'อนุมัติการบันทึกคำฟ้อง',
  'ปฏิเสธการบันทึกคำฟ้อง',
  'ยกเลิก',
  'รวมเลขที่กฏหมาย',
  'อนุมัติการรวมเลขที่กฏหมาย',
  'ปฏิเสธการรวมเลขที่กฏหมาย',
  'อัปโหลด',
  'รับ',
  'อัปเดท',
  'ลบ',
  'อนุมัติการแก้ไขข้อมูลทรัพย์นอกจำนอง',
  'ปฏิเสธการแก้ไขข้อมูลทรัพย์นอกจำนอง',
  'บันทึก',
  'แก้ไข',
  'อนุมัติการเปลี่ยนแปลง',
  'ปฏิเสธการเปลี่ยนแปลง',
  'มอบหมายคดี',
  'โอนงาน',
  'อัพโหลดเอกสาร',
  'เลือกเอกสารในหน้าค้นหา',
  'ขออัพโหลดเอกสารใหม่',
  'ตรวจสอบเอกสารเสร็จสิ้น',
  'ตรวจสอบเอกสารอีกครั้ง',
  'เปลี่ยนสถานะ task บันทึกคำฟ้อง',
  'ทนายความส่งเรื่องพิจารณา',
  'ทนายบันทึกอุทธรณ์/งดอุทธรณ์ แบบมีเงื่อนไข',
  'ส่งกลับแก้ไข',
  'เลือกทรัพย์',
  'เสร็จสิ้นงาน',
  'มอบหมายทนายความออกหมายบังคับคดี',
  'บันทึกวันที่ยื่น',
  'บันทึกวันที่ได้รับผล',
  'บันทึกสำเร็จแต่ไม่อนุมัติ',
  'สั่งการยึดทรัพย์จำนอง',
  'บันทึกการรับต้นฉบับ',
  'ปฏิเสธรับต้นฉบับ',
  'ปฏิเสธรับต้นฉบับเกิน',
  'ชำระค่าธรรมเนียมการยึดทรัพย์',
  'มอบหมายทนายตั้งเรื่องยึดทรัพย์',
  'สร้างรายการทรัพย์',
  'อัปโหลดเอกสารเกี่ยวกับธนาคารและคดี',
  'อัปโหลดเอกสารเกี่ยวกับผู้ติดต่อ',
  'สั่งการถอนการบังคับคดี',
  'ยกเลิกสั่งการถอนการบังคับคดี',
  'ตรวจอบคำสั่งการถอนการบังคับคดีและแนะนำทนาย',
  'ตรวจอบคำสั่งการถอนการบังคับคดีและมอบหมายทนาย',
  'อัปโหลด หนังสือคำสั่งให้ถอนการบังคับคดี',
  'บันทึกชะลอบังคับคดี',
  'อนุมัติ/ไม่อนุมัติ',
  'บันทึกความเห็น',
  'ยืนยันขยายระยะเวลาชะลอบังคับคดี',
  'ยกเลิกชะลอบังคับคดี',
  'บันทึกแบบร่าง',
  'ดาวน์โหลดฟอร์มเอกสารยินยอมให้โจทก์แถลงงดการขาย',
  'อัปโหลดเอกสารยินยอมให้โจทก์แถลงงดการขาย',
  'ยืนยันคำสั่งการถอนยึดทรัพย์',
  'มอบหมายเสร็จสิ้น',
  'Submit Request',
  'นำเสนอออกแคชเชียร์เช็คโอนกรรมสิทธิ์',
  'นำเสนอการตัดบัญชีชำระหนี้',
  'อนุมัติการตัดบัญชีชำระหนี้',
  'ส่งกลับแก้ไขการตัดบัญชีชำระหนี้',
];

const lawsuitObject = [
  'คำฟ้องคดี',
  'เลขที่กฏหมาย',
  'บันทึกผลการนำส่งคำบังคับ',
  'การชะลอดำเนินคดี',
  'บันทึกผลการพิพากษา',
  'บันทึกคำบังคับ',
  'เอกสารต้นฉบับ',
  'ออกคำบังคับ',
  'การยุติดำเนินคดี',
  'เอกสาร(ใบเหลือง)',
  'ข้อมูลการติดตาม',
  'หมายเลขติดตาม',
  'คดี',
  'บอกกล่าว',
  'ทรัพย์นอกจำนอง',
  'การบอกกล่าวทวงถาม',
  'ผู้เกี่ยวข้อง',
  'ผู้ค้ำประกัน',
  'งาน',
  'เอกสารประกอบการฟ้อง',
  'รายการเอกสาร',
  'อนุมัติผลการพิพากษา',
  'การบันทึกขอพิจารณาอุทธรณ์',
  'บันทึกผลการพิพากษาตามยอม',
  'การพิจารณาอุทธรณ์',
  'วันนัดพิจารณา',
  'รายงานกระบวนพิจารณา',
  'การบันทึกอุทธรณ์/งดอุทธรณ์ แบบมีเงื่อนไข',
  'ทรัพย์ที่ถูกชะลอ',
  'ทนายความฝ่ายบังคับคดี',
  'หนังสือมอบอำนาจของทนาย',
  'คำขอออกหมายบังคับคดี',
  'ผลของคำขอออกหมายบังคับคดี',
  'หลักประกัน',
  'เอกสารต้นฉบับเบิกที่ DIMS',
  'เอกสารต้นฉบับเตรียมโดยหน่วยงานดูแลลูกหนี้',
  'เลขที่เก็บ',
  'บันทึกผลการยึดทรัพย์ของสำนักงานบังคับคดี',
  'เอกสารคำขอยึดทรัพย์ อสังหาริมทรัพย์',
  'รายงานการยึดทรัพย์',
  'คำขอยึดทรัพย์ต่างสำนักงาน',
  'ใบแจ้งหนี้ค่าธรรมเนียมตั้งเรื่องยึดทรัพย์',
  'การยึดทรัพย์',
  'สั่งการถอนยึดทรัพย์',
  'บันทึกผลการถอนยึดทรัพย์',
  'บันทึกร่างคำสั่งการถอนการบังคับคดี',
  'ยกเลิกคำสั่งการถอนการบังคับคดี',
  'ยืนยันคำสั่งการถอนการบังคับคดี',
  'อนุมัติคำสั่งการถอนบังคับคดี',
  'แนะนำทนายสำหรับการถอนการบังคับคดี',
  'มอบหมายทนายสำหรับการถอนการบังคับคดี',
  'บันทึกผลการถอนการบังคับคดี',
  'บันทึกแบบร่างผลการถอนยึดทรัพย์',
  'มอบหมายทนายสำหรับการถอนยึดทรัพย์',
  'แนะนำทนายสำหรับการถอนยึดทรัพย์',
  'อนุมัติคำสั่งการถอนยึดทรัพย์',
  'มอบหมายงานให้ทนายความฝ่ายขาย',
  'ส่งคำขอประเมินทรัพย์ราคา/ศักยภาพทรัพย์',
];

export const AUDIT_LAWSUIT_ACTION_LOV: SimpleSelectOption[] = lawsuitAction.map(item => {
  return { text: item, value: item } as SimpleSelectOption;
});

export const AUDIT_LAWSUIT_OBJECT_LOV: SimpleSelectOption[] = lawsuitObject.map(item => {
  return { text: item, value: item } as SimpleSelectOption;
});
