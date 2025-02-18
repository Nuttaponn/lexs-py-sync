import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { AccountComponent } from './account/account.component';
import { BondComponent } from './bond/bond.components';
import { BuildingComponent } from './building/building.component';
import { CollateralInfoRoutingModule } from './collateral-info-routing.module';
import { CollateralInfoComponent } from './collateral-info.component';
import { CondoComponent } from './condo/condo.component';
import { CooperativeStockComponent } from './cooperative-stock/cooperative-stock.component';
import { LandInfoComponent } from './land-info/land-info.component';
import { LeaseholdComponent } from './leasehold/leasehold.component';
import { MachineComponent } from './machine/machine.component';
import { MainCollateralComponent } from './main-collateral/main-collateral.component';
import { OtherComponent } from './other/other.component';
import { SalaryComponent } from './salary/salary.component';
import { StockCertificationComponent } from './stock-certification/stock-certification.component';
import { VehicleComponent } from './vehicle/vehicle.component';

@NgModule({
  declarations: [
    CollateralInfoComponent,
    MainCollateralComponent,
    LandInfoComponent,
    BuildingComponent,
    AccountComponent,
    MachineComponent,
    BondComponent,
    StockCertificationComponent,
    CondoComponent,
    SalaryComponent,
    VehicleComponent,
    LeaseholdComponent,
    CooperativeStockComponent,
    OtherComponent,
  ],
  imports: [CommonModule, SpigCoreModule, SpigShareModule, TranslateModule, SharedModule, CollateralInfoRoutingModule],
  exports: [CollateralInfoComponent],
})
export class CollateralInfoModule {}
