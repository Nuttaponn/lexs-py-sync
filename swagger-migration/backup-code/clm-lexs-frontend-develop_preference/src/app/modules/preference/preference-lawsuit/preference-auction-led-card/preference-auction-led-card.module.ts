import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PreferenceAuctionLedCardComponent } from './preference-auction-led-card.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: PreferenceAuctionLedCardComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(AppRoutes), CommonModule],
})
export class PreferenceAuctionLedCardModule { }
