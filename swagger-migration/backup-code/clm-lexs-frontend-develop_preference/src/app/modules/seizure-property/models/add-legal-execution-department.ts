import { EFilingPaymentMethod } from '@app/shared/constant';
import { SimpleSelectOption } from '@spig/core';

export interface AddLegalExecutionDepartmentContext {
  offices: SimpleSelectOption[];
  selectedOffice?: number | null;
  selectedEFiling?: EFilingPaymentMethod | null;
  forceSelectEFiling?: boolean;
}

export interface AddLegalExecutionDepartmentResult {
  selectedOffice: SimpleSelectOption;
  selectedEFiling: EFilingPaymentMethod;
}
