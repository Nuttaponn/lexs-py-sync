/* eslint-disable @typescript-eslint/no-explicit-any */

import { rest } from 'msw';

export const createMockHandlers = [
  rest.get('http://lexsdev.krungthai/ktb/rest/lexs/v1/master-data/legal-status', (req, res, ctx) => {
    return res(
      ctx.json({
        legalStatus: [
          { name: 'สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง', value: '0100' },
          { name: 'อนุมัติให้ดำเนินคดี', value: '0103' },
          { name: 'วันที่ทนายความรับเรื่อง', value: '0104' },
          { name: 'สถานะบอกกล่าวทวงถาม', value: '0200' },
          { name: 'มอบเรื่องให้ทนายดำเนินการบอกกล่าว', value: '0202' },
          { name: 'มอบเรื่องให้ทนาย', value: '0203' },
          { name: 'บอกกล่าวทวงถาม', value: '0204' },
          { name: 'สถานะยื่นฟ้องอาญา', value: '0300' },
          { name: 'มอบเรื่องให้ทนายฟ้องอาญา', value: '0302' },
          {
            name: 'ยื่นฟ้องอาญา อยู่ระหว่างการพิจารณาของศาล',
            value: '0303',
          },
          {
            name: 'ยื่นฟ้องอาญา อยู่ระหว่างการพิจารณาของศาลปรากฎหมายเลขคดีดำ',
            value: '0304',
          },
          {
            name: 'ยื่นฟ้องอาญา อยู่ระหว่างการพิจารณาของศาลปรากฏทุนทรัพย์',
            value: '0305',
          },
          {
            name: 'ยื่นฟ้องอาญา อยู่ระหว่างการพิจารณาของศาลปรากฏข้อหาความผิด',
            value: '0306',
          },
          { name: 'ศาลอาญามีคำพิพากษาปรากฎหมายเลขคดีแดง', value: '0307' },
          { name: 'ศาลอาญามีคำพิพากษาปรากฏวันพิพากษา', value: '0308' },
          { name: 'ศาลอาญาออกหมายจับ', value: '0309' },
          { name: 'สถานะยื่นฟ้องแพ่ง', value: '0400' },
          { name: 'มอบเรื่องให้ทนายฟ้องแพ่ง', value: '0402' },
          {
            name: 'วันที่ยื่นฟ้องแพ่ง อยู่ระหว่างการพิจารณาของศาล',
            value: '0403',
          },
          {
            name: 'อยู่ระหว่างการพิจารณาของศาล ปรากฎหมายเลขคดีดำ',
            value: '0404',
          },
          { name: 'ทุนทรัพย์ยื่นฟ้องแพ่ง', value: '0405' },
          { name: 'ข้อหาความผิดที่ยื่นฟ้องแพ่ง', value: '0406' },
          {
            name: 'ฟ้องแพ่ง อยู่ระหว่างการสืบพยานโจทก์/จำเลย',
            value: '0407',
          },
          {
            name: 'ศาลชั้นต้นมีคำพิพากษา(ปรากฏเลขคดีแดง)',
            value: '0408',
          },
          { name: 'วันที่ศาลชั้นต้นมีคำพิพากษา', value: '0409' },
          { name: 'ศาลชั้นต้นมีคำพิพากษา/พิพากษายอม', value: '0410' },
          { name: 'ธนาคารยื่นอุทธรณ์คำพิพากษา', value: '0411' },
          { name: 'ศาลอุทธรณ์มีคำพิพากษา', value: '0412' },
          { name: 'ธนาคารยื่นฎีกาคำพิพากษาศาลอุทธรณ์', value: '0413' },
          { name: 'ศาลฎีกามีคำพิพากษา', value: '0414' },
          { name: 'วันที่สืบหาทรัพย์ในชั้นฟ้องแพ่ง', value: '0415' },
          { name: 'สถานะยึดทรัพย์', value: '0500' },
          {
            name: 'มอบเรื่องให้ทนายดำเนินการบังคับคดี บังคับคดี',
            value: '0502',
          },
          { name: 'ออกคำบังคับ', value: '0503' },
          { name: 'ออกหมายบังคับคดี', value: '0504' },
          { name: 'ยึดทรัพย์', value: '0505' },
          {
            name: 'วิธีการยึดทรัพย์ (ยึดทั้งหมด หรือ ยึดบางส่วน)',
            value: '0506',
          },
          {
            name: 'ประเภทของทรัพย์ที่ยึด (ทรัพย์จำนอง หรือ ทรัพย์นอกจำนอง)',
            value: '0507',
          },
          {
            name: 'จำนวนเจ้าหนี้อื่นยื่นขอเฉลี่ยหนี้จากทรัพย์ที่ยึด',
            value: '0508',
          },
          { name: 'วันที่ร้องขัดทรัพย์', value: '0509' },
          { name: 'ผลของการร้องขัดทรัพย์', value: '0510' },
          { name: 'วันที่สืบหาทรัพย์ในชั้นยึดทรัพย์', value: '0511' },
          { name: 'สถานะการขายทอดตลาด', value: '0600' },
          {
            name: 'มอบเรื่องให้ทนายดำเนินการขายทรัพย์ บังคับคดี',
            value: '0602',
          },
          { name: 'อยู่ระหว่างขายทอดตลาดทรัพย์', value: '0603' },
          { name: 'ผู้ซื้อทรัพย์ได้', value: '0604' },
          { name: 'ขายทอดตลาดแล้วเสร็จ', value: '0605' },
          { name: 'วันที่ร้องคัดค้านการขาย', value: '0606' },
          { name: 'วันที่โอนทรัพย์', value: '0607' },
          {
            name: 'โอนทรัพย์ (โอนทั้งหมด / โอนบางส่วน)ในชั้นขายทอดตลาด',
            value: '0608',
          },
          { name: 'วันที่รับเงินจากการขายทอดตลาด', value: '0609' },
          { name: 'วันที่สืบหาทรัพย์ในชั้นขายทอดตลาด', value: '0610' },
          { name: 'สถานะยื่นฟ้องคดีล้มละลาย', value: '0700' },
          { name: 'มอบเรื่องให้ทนายยื่นฟ้องล้มละลาย', value: '0702' },
          { name: 'บอกกล่าวให้ชำระหนี้ตามคำพิพากษาล้ม', value: '0703' },
          { name: 'วันที่ยื่นฟ้องล้มละลาย', value: '0704' },
          { name: 'คดีดำฟ้องล้มละลาย', value: '0705' },
          { name: 'ทุนทรัพย์ที่ยื่นฟ้องล้มละลาย', value: '0706' },
          { name: 'คดีแดงฟ้องล้มละลาย', value: '0707' },
          { name: 'สถานะศาลมีคำสั่งพิทักษ์ทรัพย์เด็ดขาด', value: '0800' },
          {
            name: 'มอบเรื่องให้ทนายดำเนินการพิทักษ์ทรัพย์',
            value: '0802',
          },
          { name: 'กรณีบุคคลภายนอกหรือธนาคารเป็นโจทก์', value: '0803' },
          {
            name: 'คดีดำของศาลล้มละลาย(คดีอยู่ในขั้นศาลพิทักษ์ทรัพย์)',
            value: '0804',
          },
          {
            name: 'คดีแดงของศาลล้มละลาย(คดีอยู่ในขั้นศาลพิทักษ์ทรัพย์)',
            value: '0805',
          },
          { name: 'ศาลสั่งพิทักษ์ทรัพย์ชั่วคราว', value: '0806' },
          { name: 'ศาลสังพิทักษ์ทรัพย์เด็ดขาด', value: '0807' },
          { name: 'วันที่ประกาศในราชกิจจา', value: '0808' },
          { name: 'วันที่จพท.ประกาศคำสั่งศาล', value: '0809' },
          {
            name: 'วันที่ศาลเห็นชอบประนีประนอมหนี้ก่อนล้ม',
            value: '0810',
          },
          {
            name: 'วันที่ศาลเห็นชอบประนีประนอมหนี้หลังล้ม',
            value: '0811',
          },
          { name: 'สถานะยื่นขอรับชำระหนี้คดีล้มละลาย', value: '0900' },
          { name: 'มอบเรื่องให้ทนายยื่นขอรับชำระหนี้', value: '0902' },
          { name: 'วันที่ยื่นขอรับชำระหนี้คดีล้มละลาย', value: '0903' },
          {
            name: 'ทุนทรัพย์ที่ยืนขอรับชำระหนี้คดีล้มละลาย',
            value: '0904',
          },
          {
            name: 'หลักประกันที่ปรากฎในขั้นตอนขอรับชำระหนี้ (มี/ไม่มี)',
            value: '0905',
          },
          {
            name: 'วันที่ศาลสั่งให้ได้รับชำระหนี้คดีล้มละลาย',
            value: '0906',
          },
          {
            name: 'จำนวนเงินที่ศาลสั่งให้ได้รับชำระหนี้คดีล้มละลาย',
            value: '0907',
          },
          { name: 'วันที่ขายทอดตลาดทรัพย์ในคดีล้มละลาย', value: '0908' },
          { name: 'ผู้ชื้อทรัพย์ได้ในชั้นคดีล้มละลาย', value: '0909' },
          {
            name: 'วันที่ขายทรัพย์แล้วเสร็จในคดีล้มละลาย',
            value: '0910',
          },
          { name: 'วันที่ร้องคัดค้านการขายในคดีล้มละลาย', value: '0911' },
          { name: 'วันที่โอนทรัพย์ในคดีล้มละลาย', value: '0912' },
          {
            name: 'โอนทรัพย์ (โอนทั้งหมด / โอนบางส่วน)ในชั้นยื่นขอรับชำระหนี้คดีล้ม',
            value: '0913',
          },
          {
            name: 'วันที่รับส่วนแบ่งจากเจ้าพนักงานพิทักษ์ทรัพย์',
            value: '0914',
          },
          {
            name: 'วันที่สืบหาทรัพย์ในชั้นยื่นขอรับชำระหนี้คดีล้ม',
            value: '0915',
          },
          {
            name: 'วันที่ศาลเห็นชอบประนีประนอมหนี้ก่อนล้ม',
            value: '0916',
          },
          {
            name: 'วันที่ศาลมีคำสั่งให้ล้มละลาย / ไม่ล้มละลาย',
            value: '0917',
          },
          {
            name: 'วันที่ศาลเห็นชอบประนีประนอมหนี้หลังล้ม',
            value: '0918',
          },
          { name: 'วันที่ปิดคดี', value: '0919' },
          { name: 'ยื่นขอรับชำระหนี้บุริมสิทธ์', value: '1000' },
          {
            name: 'มอบเรื่องให้ยื่นขอรับชำระหนี้บุริมสิทธิ์',
            value: '1002',
          },
          { name: 'คดีแดงที่โจทก์อื่นยื่นฟ้อง', value: '1003' },
          { name: 'โจทก์อื่นยึดทรัพย์จำนอง', value: '1004' },
          { name: 'วันที่ยื่นขอรับชำระหนี้บุริมสิทธิ์', value: '1005' },
          {
            name: 'ทุนทรัพย์ที่ยื่นขอรับชำระหนี้บุริมสิทธิ์',
            value: '1006',
          },
          {
            name: 'วันที่ศาลมีคำสั่งให้ธนาคารได้รับชำระหนี้',
            value: '1007',
          },
          {
            name: 'จำนวนเงินที่ศาลมีคำสั่งให้ธนาคารได้รับชำระหนี้',
            value: '1008',
          },
          {
            name: 'วันที่ขายในชั้นยื่นขอรับชำระหนี้บุริมสิทธิ์',
            value: '1009',
          },
          {
            name: 'ผู้ชื้อทรัพย์ได้ในชั้นยื่นขอรับชำระหนี้บุริมสิทธิ์',
            value: '1010',
          },
          {
            name: 'วันที่ขายทรัพย์แล้วเสร็จในชั้นยื่นขอยื่นขอรับชำระหนี้บุริมสิทธิ์',
            value: '1011',
          },
          { name: 'ธนาคารร้องคัดค้านการขาย', value: '1012' },
          { name: 'โอนทรัพย์มาเป็นของธนาคาร', value: '1013' },
          {
            name: 'โอนทรัพย์ (โอนทั้งหมด / โอนบางส่วน)ในชั้นยื่นขอรับชำระหนี้บุริมสิทธิ์',
            value: '1014',
          },
          { name: 'วันที่รับเงินจากการขายทอดตลาด', value: '1015' },
          {
            name: 'วันที่สืบหาทรัพย์ ในชั้นยื่นขอรับชำระหนี้บุริมสิทธิ์',
            value: '1016',
          },
          { name: 'ยื่นขอเฉลี่ยหนี้จากการขาย', value: '1100' },
          {
            name: 'มอบเรื่องให้ยื่นขอเฉลี่ยหนี้จากการขาย',
            value: '1102',
          },
          { name: 'วันที่ธนาคารยื่นขอเฉลี่ยทรัพย์', value: '1103' },
          { name: 'จำนวนเงินที่ยื่นขอเฉลี่ยทรัพย์', value: '1104' },
          { name: 'คดีแดงที่โจทก์อื่นยื่นฟ้อง', value: '1105' },
          {
            name: 'วันที่ศาลมีคำสั่งให้ได้รับชำระส่วนเฉลี่ยทรัพย์',
            value: '1106',
          },
          {
            name: 'จำนวนเงินที่ศาลมีคำสั่งให้ได้รับชำระหนี้',
            value: '1107',
          },
          { name: 'วันที่ธนาคารได้รับส่วนเฉลี่ยทรัพย์', value: '1108' },
          {
            name: 'จำนวนเงินที่ได้รับรับส่วนเฉลี่ยในชั้นยื่นขอเฉลี่ยทรัพย์',
            value: '1109',
          },
          { name: 'วันที่ขายทอดตลาดทรัพย์', value: '1110' },
          {
            name: 'ผู้ชื้อทรัพย์ได้ชั้นยื่นขอเฉลี่ยหนี้จากการขาย',
            value: '1111',
          },
          {
            name: 'วันที่ขายทรัพย์แล้วเสร็จในชั้นยื่นขอเฉลี่ยหนี้จากการขาย',
            value: '1112',
          },
          { name: 'วันที่ร้องคัดค้านการขาย', value: '1113' },
          {
            name: 'วันที่รับเงินจากการขายทอดตลาดในชั้นยื่นขอเฉลี่ยทรัพย์',
            value: '1114',
          },
          {
            name: 'วันที่สืบหาทรัพย์ในชั้นยื่นขอเฉลี่ยหนี้จากการขาย',
            value: '1115',
          },
          { name: 'สถานะฟื้นฟูกิจการ', value: '1200' },
          { name: 'มอบเรื่องให้ทนายดำเนินการ(ฟื้นฟู)', value: '1202' },
          { name: 'ประเภทของผู้ยื่นขอฟื้นฟูกิจการ', value: '1203' },
          { name: 'วันที่ยื่นคำร้องขอฟื้นฟูกิจการ', value: '1204' },
          { name: 'คดีดำที่ยื่นขอฟื้นฟูกิจการ', value: '1205' },
          { name: 'ศาลยกคำร้องฟื้นฟูกิจการ', value: '1206' },
          { name: 'วันที่ศาลมีคำสั่งให้ฟื้นฟูกิจการ', value: '1207' },
          {
            name: 'ศาลมีคำสั่งให้ฟื้นฟูกิจการ ปรากฎหมายเลขคดีแดงที่ยื่นฟื้นฟู',
            value: '1208',
          },
          { name: 'ศาลมีคำสั่งตั้งผู้ทำแผนฟื้นฟู', value: '1209' },
          { name: 'วันที่ส่งแผนฟื้นฟู', value: '1210' },
          { name: 'วันที่โฆษณาคำสั่งศาลให้ฟื้นฟูกิจการ', value: '1211' },
          {
            name: 'วันที่ธนาคารยื่นขอชำระหนี้ในการฟื้นฟูกิจการ',
            value: '1212',
          },
          {
            name: 'จำนวนเงินที่ธนาคารยื่นขอชำระหนี้ในการฟื้นฟูกิจการ',
            value: '1213',
          },
          {
            name: 'วันที่ศาลมีคำสั่งให้ธนาคารได้รับชำระหนี้(ฟื้นฟู)',
            value: '1214',
          },
          {
            name: 'จำนวนเงินที่ศาลสั่งให้ธนาคารรับชำระหนี้ในการฟื้นฟูกิจการ',
            value: '1215',
          },
          { name: 'ศาลมีคำสั่งเห็นชอบกับแผนฟื้นฟูฯ', value: '1216' },
          { name: 'ศาลมีคำสั่งให้ยกเลิกแผนฟื้นฟูฯ', value: '1217' },
          { name: 'ศาลมีคำสั่งพิทักษ์ทรัพย์เด็ดขาด', value: '1218' },
          {
            name: 'วันที่โฆษณาคำสั่งพิทักษ์ทรัพย์เด็ดขาด',
            value: '1219',
          },
          { name: 'ถอนฟ้อง', value: '3001' },
          { name: 'ศาลพิพากษาตามยอม', value: '3101' },
          { name: 'สถานะยกฟ้อง', value: '3200' },
          {
            name: 'ศาลพิพากษายกฟ้อง - เนื่องจากคดีขาดอายุความ',
            value: '3201',
          },
          {
            name: 'ศาลพิพากษายกฟ้อง - เนื่องจากหนี้ไม่ได้มีอยู่จริง',
            value: '3202',
          },
          {
            name: 'ศาลพิพากษายกฟ้อง - เนื่องจากธนาคารไม่มีสิทธิฟ้องเป็นคดีใหม่ได้',
            value: '3203',
          },
          { name: 'ศาลพิพากษาจำหน่ายคดี', value: '3301' },
          { name: 'ศาลมีคำสั่งขอพิจารณาคดีใหม่', value: '3401' },
          { name: 'ศาลมีคำสั่งให้ตามคำร้องคดีใหม่', value: '3402' },
          { name: 'ศาลมีคำสั่งให้ยกคำร้องคดีใหม่', value: '3403' },
          { name: 'ศาลพิพากษาให้ชำระหนี้เต็มตามฟ้อง', value: '3501' },
          { name: 'ศาลพิพากษาให้ชำระหนี้ไม่เต็มตามฟ้อง', value: '3502' },
          { name: 'ศาลพิพากษาตามยอม', value: '3503' },
          { name: 'ศาลพิพากษา : ไม่ระบุ', value: '3504' },
          { name: 'ศาลพิพากษาให้ชำระหนี้เต็มตามฟ้อง', value: '3601' },
          { name: 'ศาลพิพากษาให้ชำระหนี้ไม่เต็มตามฟ้อง', value: '3602' },
          { name: 'ศาลพิพากษาตามยอม', value: '3603' },
          { name: 'ศาลพิพากษา : ไม่ระบุ', value: '3604' },
          {
            name: 'ไม่ได้ยื่นขอรับชำระหนี้คดีล้มละลาย (และมิได้เป็นเจ้าหนี้มีประกัน)',
            value: '3701',
          },
          {
            name: 'ยื่นขอรับชำระหนี้คดีล้มละลาย(หน้าจอยื่นขอรับชำระหนี้คดีล้มฯ)',
            value: '3702',
          },
          {
            name: 'ศาลมีคำสั่งพิทักษ์ทรัพย์เด็ดขาด และได้ยื่นขอรับชำระหนี้คดีล้มละลาย(หน้าจอพิทักษ์ทรัพย์)',
            value: '3703',
          },
          {
            name: 'ศาลมีคำสั่งพิทักษ์ทรัพย์เด็ดขาด และไม่ได้ยื่นขอรับชำระหนี้คดีล้มละลาย และเป็นเจ้าหนี้มีประกัน(หน้าจอพิทักษ์ทรัพย์)',
            value: '3704',
          },
          {
            name: 'ศาลมีคำสั่งพิทักษ์ทรัพย์เด็ดขาด และไม่ระบุ การยื่น/ไม่ยิ่นขอรับชำระหนี้คดีล้มละลาย(หน้าจอพิทักษ์ทรัพย์)',
            value: '3705',
          },
          { name: 'ศาลมีคำสั่งปลดล้มละลาย', value: '3801' },
          { name: 'ศาลมีคำสั่งยกเลิกล้มละลาย', value: '3900' },
          {
            name: 'ศาลมีคำสั่งยกเลิกล้มละลาย (ม.135(1) เนื่องจาก จพท.ไม่อาจดำเนินการให้ได้ผลประโยชน์แก่เจ้าหนี้ทั้งหลาย)',
            value: '3901',
          },
          {
            name: 'ศาลมีคำสั่งยกเลิกล้มละลาย (ม.135(2) เนื่องจากลูกหนี้ไม่สมควรถูกพิพากษาให้ล้มละลาย)',
            value: '3902',
          },
          {
            name: 'ศาลมีคำสั่งยกเลิกล้มละลาย (ม.135(1) เนื่องจาก จพท.ไม่อาจดำเนินการให้ได้ผลประโยชน์แก่เจ้าหนี้ทั้งหลาย)',
            value: '3903',
          },
          {
            name: 'ศาลมีคำสั่งยกเลิกล้มละลาย (ม.135(2) เนื่องจากลูกหนี้ไม่สมควรถูกพิพากษาให้ล้มละลาย)',
            value: '3904',
          },
          {
            name: 'ศาลมีคำสั่งยกเลิกล้มละลาย (ม.135(3) เนื่องจากหนี้สินของบุคคลล้มละลายได้ชำระเต็มจำนวนแล้ว)',
            value: '3905',
          },
          {
            name: 'ศาลมีคำสั่งยกเลิกล้มละลาย (ม.135(4) เนื่องจาก จพท.ได้แบ่งทรัพย์สินครั้งสุดท้ายหรือไม่มีทรัพย์สินจะแบ่งให้เจ้าหนี้แล้ว)',
            value: '3906',
          },
          { name: 'คำสั่งให้ล้มละลาย', value: '4001' },
          { name: 'คำสั่งให้ประนอมหนี้ก่อนล้มละลาย', value: '4101' },
          { name: 'คำสั่งให้ประนอมหนี้หลังล้มละลาย', value: '4102' },
          { name: 'คำสั่งให้ได้รับชำระหนี้', value: '4201' },
          { name: 'คำสั่งให้ปิดคดี', value: '4301' },
        ],
      })
    );
  }),
  rest.get('http://lexsdev.krungthai/ktb/rest/lexs/v1/litigation', (req, res, ctx) => {
    return res(
      ctx.json({
        content: [
          {
            litigationId: 'MOCKX0002',
            customerId: '000002225999',
            customerName: 'NAME_000002225999',
            lawyerOfficeCode: '108054',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerName: 'admin Tangerine',
            amdResponseUnitCode: '108784',
            amdUserId: '620438',
            litigationStatus: '0103',
            litigationStatusDesc: 'อนุมัติให้ดำเนินคดี',
            defermentStatus: 'NORMAL',
            flag: '',
            aoUserId: '552344',
            aoUserName: 'ศุภมาส แจ้งกระจ่าง',
          },
          {
            litigationId: 'MOCKX0001',
            customerId: '000002225999',
            customerName: 'NAME_000002225999',
            lawyerOfficeCode: '108054',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerName: 'admin Tangerine',
            amdResponseUnitCode: '108784',
            amdUserId: '620438',
            litigationStatus: '0103',
            litigationStatusDesc: 'อนุมัติให้ดำเนินคดี',
            defermentStatus: 'NORMAL',
            flag: '',
            aoUserId: '552344',
            aoUserName: 'ศุภมาส แจ้งกระจ่าง',
          },
          {
            litigationId: 'MOCKCOL034',
            customerId: '000004479122',
            customerName: 'NAME_000004479122',
            blackCaseNo: 'BC341',
            redCaseNo: 'RC341',
            dpd: 7205,
            lawyerOfficeCode: '1000',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerId: 'k7723T',
            lawyerName: 'บุญประกอบ จองจิตบริสุทธิ์',
            ownerBranchCode: '108423',
            litigationStatus: '0100',
            litigationStatusDesc: 'สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง',
            defermentStatus: 'NORMAL',
            flag: '',
          },
          {
            litigationId: 'MOCKCOL034',
            customerId: '000004479122',
            customerName: 'NAME_000004479122',
            blackCaseNo: 'BC342',
            dpd: 7205,
            lawyerOfficeCode: '1000',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerId: 'k7723T',
            lawyerName: 'บุญประกอบ จองจิตบริสุทธิ์',
            ownerBranchCode: '108423',
            litigationStatus: '0100',
            litigationStatusDesc: 'สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง',
            defermentStatus: 'NORMAL',
            flag: '',
          },
          {
            litigationId: 'MOCKCOL033',
            customerId: '000004479122',
            customerName: 'NAME_000004479122',
            blackCaseNo: 'BC331',
            redCaseNo: 'RC331',
            dpd: 7205,
            lawyerOfficeCode: '1000',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerId: 'k7723T',
            lawyerName: 'บุญประกอบ จองจิตบริสุทธิ์',
            ownerBranchCode: '108423',
            litigationStatus: '0100',
            litigationStatusDesc: 'สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง',
            defermentStatus: 'NORMAL',
            flag: '',
          },
          {
            litigationId: 'MOCKCOL033',
            customerId: '000004479122',
            customerName: 'NAME_000004479122',
            blackCaseNo: 'BC332',
            dpd: 7205,
            lawyerOfficeCode: '1000',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerId: 'k7723T',
            lawyerName: 'บุญประกอบ จองจิตบริสุทธิ์',
            ownerBranchCode: '108423',
            litigationStatus: '0100',
            litigationStatusDesc: 'สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง',
            defermentStatus: 'NORMAL',
            flag: '',
          },
          {
            litigationId: 'MOCKCOL032',
            customerId: '000004479122',
            customerName: 'NAME_000004479122',
            blackCaseNo: 'BC321',
            redCaseNo: 'RC321',
            dpd: 7205,
            lawyerOfficeCode: '1000',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerId: 'k7723T',
            lawyerName: 'บุญประกอบ จองจิตบริสุทธิ์',
            ownerBranchCode: '108423',
            litigationStatus: '0100',
            litigationStatusDesc: 'สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง',
            defermentStatus: 'NORMAL',
            flag: '',
          },
          {
            litigationId: 'MOCKCOL032',
            customerId: '000004479122',
            customerName: 'NAME_000004479122',
            blackCaseNo: 'BC322',
            dpd: 7205,
            lawyerOfficeCode: '1000',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerId: 'k7723T',
            lawyerName: 'บุญประกอบ จองจิตบริสุทธิ์',
            ownerBranchCode: '108423',
            litigationStatus: '0100',
            litigationStatusDesc: 'สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง',
            defermentStatus: 'NORMAL',
            flag: '',
          },
          {
            litigationId: 'MOCKCOL031',
            customerId: '000004479122',
            customerName: 'NAME_000004479122',
            blackCaseNo: 'BC311',
            redCaseNo: 'RC311',
            dpd: 7205,
            lawyerOfficeCode: '1000',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerId: 'k7723T',
            lawyerName: 'บุญประกอบ จองจิตบริสุทธิ์',
            ownerBranchCode: '108423',
            litigationStatus: '0100',
            litigationStatusDesc: 'สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง',
            defermentStatus: 'NORMAL',
            flag: '',
          },
          {
            litigationId: 'MOCKCOL031',
            customerId: '000004479122',
            customerName: 'NAME_000004479122',
            blackCaseNo: 'BC312',
            dpd: 7205,
            lawyerOfficeCode: '1000',
            lawyerOfficeName: 'บริษัท กรุงไทยกฎหมาย จำกัด',
            lawyerId: 'k7723T',
            lawyerName: 'บุญประกอบ จองจิตบริสุทธิ์',
            ownerBranchCode: '108423',
            litigationStatus: '0100',
            litigationStatusDesc: 'สถานะอนุมัติให้ดำเนินคดี/รับเรื่อง',
            defermentStatus: 'NORMAL',
            flag: '',
          },
        ],
        pageable: {
          sort: { empty: false, unsorted: false, sorted: true },
          offset: 0,
          pageNumber: 0,
          pageSize: 10,
          paged: true,
          unpaged: false,
        },
        totalPages: 17,
        last: false,
        totalElements: 163,
        size: 10,
        number: 0,
        sort: { empty: false, unsorted: false, sorted: true },
        numberOfElements: 10,
        first: true,
        empty: false,
      })
    );
  }),
  rest.post(
    'https://lexsdev.krungthai/ktb/rest/lexs/v1/financial/pay-court-fee/:id/read-payment-form',
    (req, res, ctx) => {
      return res(
        ctx.json({
          paymentImageId: '7008a0d8-fe19-43a4-9992-a4ff6c89e84a',
          companyCode: '97001',
          ref1: '9920220923001319',
          amount: '300.00',
        })
        /** Error Response  */
        // ctx.status(422),
        // ctx.json([
        //   {
        //     "code": "F013", // over due date
        //     // "code": "F012", // payment timeout
        //     // "code": "F001", // ref1 dup
        //   }
        // ])
      );
    }
  ),
  rest.post('https://lexsdev.krungthai/ktb/rest/lexs/v1/financial/pay-court-fee/:id/payment', (req, res, ctx) => {
    return res(
      ctx.json({
        taskId: 926,
        responseCode: '00',
        responseMessage: 'Payment Success',
      })
    );
  }),
  rest.post(
    'https://lexsdev.krungthai/ktb/rest/lexs/v1/financial/pay-court-fee/:id/read-confirm-form',
    (req, res, ctx) => {
      return res(
        ctx.status(422),
        ctx.json([
          {
            code: 'F013',
            message: 'convert file error.',
            description: '[Confirmation] file name : Confirm_LE2022080005_59.pdf',
          },
        ])
        // ctx.json({
        //   confirmImageId: "16a311c4-48eb-4398-875f-70a133b0a061",
        //   blackCaseNo: "พE60/2565",
        //   caseDate: "2022-09-23T14:28:00+07:00",
        //   appointmentDate: "2022-09-26T09:00:00+07:00",
        //   courtFee: "440000.00",
        //   totalAmount: "440554.00",
        //   deliveryFeeForPleadings: "550.00",
        //   documentPreparationFee: "4.00"
        // })
      );
    }
  ),
];
