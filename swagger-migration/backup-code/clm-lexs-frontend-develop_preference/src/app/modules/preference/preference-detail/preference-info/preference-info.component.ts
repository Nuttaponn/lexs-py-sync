import { Component, OnInit } from '@angular/core';
import { PreferenceInfoCommandComponent } from './preference-info-command/preference-info-command.component';
import { PreferenceService } from '../../preference.service';
import { AssignLawyerComponent } from "./assign-lawyer/assign-lawyer.component";
import { PreferenceInfoClaimComponent } from "./preference-info-claim/preference-info-claim.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preference-info',
  standalone: true,
  imports: [
    CommonModule,
    PreferenceInfoCommandComponent,
    AssignLawyerComponent,
    PreferenceInfoClaimComponent
],
  templateUrl: './preference-info.component.html',
  styleUrl: './preference-info.component.scss'
})
export class PreferenceInfoComponent implements OnInit{

  get currentScenario(){
    return this.preferenceService.currentScenario;
  }

  get modeCompPreference(){
    return this.preferenceService.modeCompPreference;
  }

  constructor(private preferenceService : PreferenceService) { }

  ngOnInit(): void {
    
  }



}
