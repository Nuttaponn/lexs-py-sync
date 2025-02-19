import { SimpleSelectOption } from '@spig/core';

const customerAction = [
  'ที่อยู่ตามทะเบียนราษฎร์',
  'อัปโหลดใบเสร็จ',
  'ปิด',
  'เพิ่ม',
  'บันทึกร่าง',
  'เสร็จสิ้น',
  'ส่ง',
  'อัปโหลดยืนยันการชำระเงิน',
  'ยกเลิก task ตรวจสอบข้อมูลและเอกสาร',
  'ชำระค่าธรรมเนียมศาล',
  'ยกเลิก task บันทึกคำฟ้อง',
  'สร้าง task บันทึกคำฟ้อง',
  'เปลี่ยนสถานะ task บันทึกคำฟ้อง',
  'บันทึกข้อมูลคำฟ้อง',
  'แก้ไขข้อมูลคำฟ้อง',
  'ลบข้อมูลคำฟ้อง',
  'อนุมัติการบันทึกคำฟ้อง',
  'ปฏิเสธการบันทึกคำฟ้อง',
  'รวมเลขที่กฏหมาย',
  'อนุมัติการรวมเลขที่กฏหมาย',
  'ปฏิเสธการรวมเลขที่กฏหมาย',
  'สร้าง task ตรวจสอบข้อมูลและเอกสาร',
  'เริ่มกระบวนการดำเนินคดี',
  'อนุมัติการเริ่มกระบวนการดำเนินคดี',
  'ปฏิเสธการเริ่มกระบวนการดำเนินคดี',
  'รับ',
  'ลบ',
  'อนุมัติการแก้ไขข้อมูลทรัพย์นอกจำนอง',
  'ปฏิเสธการแก้ไขข้อมูลทรัพย์นอกจำนอง',
  'แก้ไข',
  'อนุมัติการเปลี่ยนแปลง',
  'ปฏิเสธการเปลี่ยนแปลง',
  'แจ้งว่ามีการเปลี่ยนชื่อจากสัญญา',
  'แจ้งว่ามีการยกเลิกการเปลี่ยนชื่อจากสัญญา',
  'อัปเดตข้อมูล DOPA/DBD/BRS',
  'แจ้งว่ามีการเปลี่ยนที่อยู่ตามสัญญา',
  'แจ้งว่ามีการยกเลิกการเปลี่ยนที่อยู่ตามสัญญา',
  'มอบหมายคดี',
  'โอนงาน',
  'อัพโหลดเอกสาร',
  'เลือกเอกสารในหน้าค้นหา',
  'ขออัพโหลดเอกสารใหม่',
  'ตรวจสอบเอกสารเสร็จสิ้น',
  'ตรวจสอบเอกสารอีกครั้ง',
];

const customerObject = [
  'บันทึกผลการนำส่งคำบังคับ',
  'บันทึกผลการพิพากษา',
  'บันทึกคำบังคับ',
  'เอกสารต้นฉบับ',
  'ออกคำบังคับ',
  'ข้อมูลและเอกสารลูกค้า',
  'ลูกหนี้',
  'ข้อมูลการติดตาม',
  'คดี',
  'บอกกล่าว',
  'ทรัพย์นอกจำนอง',
  'ผู้ค้ำประกัน',
  'ผู้กู้และ/หรือเกี่ยวข้อง',
  'งาน',
  'เอกสารประกอบการฟ้อง',
  'รายการเอกสาร',
  'ที่อยู่ตามทะเบียนราษฎร์',
  'ผู้เกี่ยวข้อง',
  'คำฟ้องคดี',
  'เลขที่กฏหมาย',
];

export const AUDIT_CUSTOMER_ACTION_LOV: SimpleSelectOption[] = customerAction.map(item => {
  return { text: item, value: item } as SimpleSelectOption;
});

export const AUDIT_CUSTOMER_OBJECT_LOV: SimpleSelectOption[] = customerObject.map(item => {
  return { text: item, value: item } as SimpleSelectOption;
});
