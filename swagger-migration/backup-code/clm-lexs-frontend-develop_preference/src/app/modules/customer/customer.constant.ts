export const RELATION = [
  {
    text: 'ผู้จัดการมรดกของผู้กู้หลัก',
    value: 'MAIN_BORROWER_TRUSTEE',
  },
  {
    text: 'ผู้จัดการมรดกของผู้กู้ร่วม',
    value: 'CO_BORROWER_TRUSTEE',
  },
  {
    text: 'ผู้จัดการมรดกของผู้ค้ำประกัน',
    value: 'GUARANTOR_TRUSTEE',
  },
  {
    text: 'ทายาทผู้มีสิทธิ์รับมรดก',
    value: 'MAIN_BORROWER_HEIR',
  },
  {
    text: 'ผู้รับชำระหนี้แทน',
    value: 'STAND_IN_PAYER',
  },
  {
    text: 'ผู้รับสภาพหนี้',
    value: 'DEBT_ACCEPTOR',
  },
  {
    text: 'ผู้เซ็นต์หนังสือรับสภาพความรับผิด',
    value: 'DEBT_ACCEPT_SIGNER',
  },
  {
    text: 'จำเลยร่วม',
    value: 'CO_DEFENDANT',
  },
];

export const FULL_RELATION = [
  {
    text: 'ผู้กู้หลัก',
    value: 'MAIN_BORROWER',
  },
  {
    text: 'ผู้กู้ร่วม',
    value: 'CO_BORROWER',
  },
  {
    text: 'ผู้ค้ำประกัน',
    value: 'GUARANTOR',
  },
  ...RELATION,
];

export const relationMapper = new Map<string | string, string>([
  ['MAIN_BORROWER', 'ผู้กู้หลัก'],
  ['CO_BORROWER', 'ผู้กู้ร่วม'],
  ['GUARANTOR', 'ผู้ค้ำ'],
  ['COLLATERAL_OWNER', 'ผู้ถือกรรมสิทธิ์'],
  ['MAIN_BORROWER_HEIR', 'ทายาทผู้มีสิทธิ์รับมรดก'],
  ['CO_BORROWER_HEIR', 'ทายาทผู้มีสิทธิ์รับมรดก'],
  ['GUARANTOR_HEIR', 'ทายาทผู้มีสิทธิ์รับมรดก'],
  ['MAIN_BORROWER_TRUSTEE', 'ผู้จัดการมรดกของผู้กู้หลัก'],
  ['CO_BORROWER_TRUSTEE', 'ผู้จัดการมรดกของผู้กู้ร่วม'],
  ['GUARANTOR_TRUSTEE', 'ผู้จัดการมรดกของผู้ค้ำประกัน'],
  ['STAND_IN_PAYER', 'ผู้รับชำระหนี้แทน'],
  ['DEBT_ACCEPTOR', 'ผู้รับสภาพหนี้'],
  ['DEBT_ACCEPT_SIGNER', 'ผู้เซ็นต์หนังสือรับสภาพความผิด'],
  ['CO_DEFENDANT', 'จำเลยร่วม'],
]);
