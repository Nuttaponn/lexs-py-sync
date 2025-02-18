export const collateralMock = {
  "collaterals": [
    {
      "collateralId": "001",
      "collateralType": "xx",
      "collateralSubType": "xx",
      "documentNo": "xx",
      "collateralDetails": "xxx", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
      "ownerFullName": "xx", // Join from gn_collateral_owners if more than one owner found , just concatenate all name of person_id
      "totalAppraisalValue": 1000000.00, // total_appraisal_value from gn_collateral
      "appraisalDate": "2023-05-01", // from gn_collateral
      "policyNos": ["xxxxxx", "yyyyyyyy"], // join from gn_collateral_insurance_policies
      "litigations": [
        {
          "litigationId": "xx", // litigation_id from lw_litication_collaterals
          "redCaseNo": ["11111", "222222"], // lw_litication_cases.red_case_no under litigation_id
        }
      ],
      "status": "xx" // left join from lw_litigation_case_collaterals
    }, {
      "collateralId": "002",
      "collateralType": "xx",
      "collateralSubType": "xx",
      "documentNo": "xx",
      "collateralDetails": "xxx", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
      "ownerFullName": "xx", // Join from gn_collateral_owners if more than one owner found , just concatenate all name of person_id
      "totalAppraisalValue": 1000000.00, // total_appraisal_value from gn_collateral
      "appraisalDate": "2023-05-01", // from gn_collateral
      "policyNos": ["xxxxxx", "yyyyyyyy"], // join from gn_collateral_insurance_policies
      "litigations": [
        {
          "litigationId": "xx", // litigation_id from lw_litication_collaterals
          "redCaseNo": ["11111", "222222"], // lw_litication_cases.red_case_no under litigation_id
        }
      ],
      "status": "xx" // left join from lw_litigation_case_collaterals
    }, {
      "collateralId": "003",
      "collateralType": "xx",
      "collateralSubType": "xx",
      "documentNo": "xx",
      "collateralDetails": "xxx", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
      "ownerFullName": "xx", // Join from gn_collateral_owners if more than one owner found , just concatenate all name of person_id
      "totalAppraisalValue": 1000000.00, // total_appraisal_value from gn_collateral
      "appraisalDate": "2023-05-01", // from gn_collateral
      "policyNos": ["xxxxxx", "yyyyyyyy"], // join from gn_collateral_insurance_policies
      "litigations": [
        {
          "litigationId": "xx", // litigation_id from lw_litication_collaterals
          "redCaseNo": ["11111", "222222"], // lw_litication_cases.red_case_no under litigation_id
        }
      ],
      "status": "xx" // left join from lw_litigation_case_collaterals
    }, {
      "collateralId": "004",
      "collateralType": "xx",
      "collateralSubType": "xx",
      "documentNo": "xx",
      "collateralDetails": "xxx", // https://ktbinnovation.atlassian.net/wiki/spaces/LEXS/pages/2755231786
      "ownerFullName": "xx", // Join from gn_collateral_owners if more than one owner found , just concatenate all name of person_id
      "totalAppraisalValue": 1000000.00, // total_appraisal_value from gn_collateral
      "appraisalDate": "2023-05-01", // from gn_collateral
      "policyNos": ["xxxxxx", "yyyyyyyy"], // join from gn_collateral_insurance_policies
      "litigations": [
        {
          "litigationId": "xx", // litigation_id from lw_litication_collaterals
          "redCaseNo": ["11111", "222222"], // lw_litication_cases.red_case_no under litigation_id
        }
      ],
      "status": "xx" // left join from lw_litigation_case_collaterals
    }
  ]

}
