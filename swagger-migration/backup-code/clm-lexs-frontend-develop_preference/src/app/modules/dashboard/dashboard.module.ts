import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';
import { SpigCoreModule, SpigShareModule } from '@spig/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ArrowChartComponent } from './arrow-chart/arrow-chart.component';
import { DoughnutChartV2Component } from './doughnut-chart-v2/doughnut-chart-v2.component';

@NgModule({
  declarations: [DashboardComponent, StackedBarChartComponent, ArrowChartComponent, DoughnutChartV2Component],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SpigShareModule,
    SpigCoreModule,
    SharedModule,
    TranslateModule,
    // PipesModule,
  ],
})
export class DashboardModule {}
