import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { RouterService } from '@app/shared/services/router.service';
import { LitigationDetailDto } from '@lexs/lexs-client';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-deferment-debt-summary',
  templateUrl: './deferment-debt-summary.component.html',
  styleUrls: ['./deferment-debt-summary.component.scss'],
})
export class DefermentDebtSummaryComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public litigationDetailDto!: LitigationDetailDto;
  public litigationId!: string;

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private lawsuitService: LawsuitService,
    private taskService: TaskService
  ) {
    this.subs.add(this.route.queryParams.subscribe(value => (this.litigationId = value['litigationId'])));
  }

  async ngOnInit(): Promise<void> {
    await this.fetchCurrentLitigationDetail();
    this.litigationDetailDto = this.lawsuitService.currentLitigation || this.taskService.litigationDetail;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onBack() {
    if (this.routerService.previousUrl.startsWith('/main/task/detail')) {
      this.routerService.back(false);
    } else {
      this.routerService.back();
    }
  }

  async fetchCurrentLitigationDetail() {
    await this.lawsuitService.getLitigation(this.litigationId);
  }
}
