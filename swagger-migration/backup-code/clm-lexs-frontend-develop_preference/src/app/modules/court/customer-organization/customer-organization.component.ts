import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { CourtService } from '../court.service';

@Component({
  selector: 'app-customer-organization',
  templateUrl: './customer-organization.component.html',
  styleUrls: ['./customer-organization.component.scss'],
})
export class CustomerOrganizationComponent implements OnInit {
  courtVerdictForm!: UntypedFormGroup;

  constructor(private courtService: CourtService) {}

  ngOnInit(): void {
    this.courtVerdictForm = this.courtService.courtVerdictForm;
    this.courtVerdictForm.get('acknowledgement')?.addValidators(Validators.required);
    this.courtVerdictForm.get('acknowledgement')?.updateValueAndValidity();
  }

  getControl(name: string): any {
    return this.courtVerdictForm.get(name);
  }
}
