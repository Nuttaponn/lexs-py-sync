export const litigationCcaseParent = {
  content: [
    {
      litigationId: '255602000288', // lw_litigation.litigation_id
      customerId: '389483', // lw_litigation.customer_id
      customerName: 'บจ. 000000389483', //gn_customers.name
      litigationStatus: '0410', // lw_litigation.litigation_status
      litigationStatusDesc: 'ศาลชั้นต้นมีคำพิพากษา/พิพากษายอม', //ad_legal_statuses.name
      amdResponseUnitCode: '108785', //when gn_customers.amd_response_unit_code is null then gn_customers.response_unit_code else gn_customers.amd_response_unit_code
      amdResponseUnitName: 'ฝ่ายปรับโครงสร้างหนี้ 3', //when gn_customers.amd_response_unit_code is null then gn_customers.response_unit_name else gn_customers.amd_response_unit_name
    },
    {
      litigationId: '255602000289',
      customerId: '389483',
      customerName: 'บจ. 000000389483',
      litigationStatus: '0503',
      litigationStatusDesc: 'ออกคำบังคับ',
      amdResponseUnitCode: '108785',
      amdResponseUnitName: 'ฝ่ายปรับโครงสร้างหนี้ 3',
    },
  ],
}
