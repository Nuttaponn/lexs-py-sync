import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewAuctionService } from '../../auction-add/new-auction.service';
import { AuctionService } from '../../auction.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-auc-manual-announcement-stepper',
  templateUrl: './auc-manual-announcement-stepper.component.html',
  styleUrl: './auc-manual-announcement-stepper.component.scss'
})
export class AucManualAnnouncementStepperComponent implements OnInit, OnDestroy {
  labels: string[] = [
    'บันทึกข้อมูลประกาศขายทอดตลาด',
    'บันทึกราคาวางหลักประกันและราคาประเมิน',
    'ตรวจสอบข้อมูลประกาศ',
  ]
  matchStatus: string | undefined;
  stepIndex: number = 0;
  private destroy$ = new Subject<void>();
  constructor(
    private auctionService: AuctionService,
    private newAuctionService: NewAuctionService
  ) {}

  ngOnInit(): void {
    this.newAuctionService.matchStatus$
    .pipe(takeUntil(this.destroy$))
    .subscribe((status) => {
      this.matchStatus = status;
      this.updateStepIndex(status);
    })
  }

  ngOnDestroy(): void {
    // Emit a value to complete all observables using takeUntil
    this.destroy$.next();
    this.destroy$.complete();
  }

   // Update the step index based on matchStatus
   private updateStepIndex(status: string | undefined): void {
    switch (status) {
      case 'PENDING_NEW_ANNOUNCE':
        this.stepIndex = 0;
        break;
      case 'PENDING_NEW_DEEDGROUP':
        this.stepIndex = 1;
        break;
      case 'PENDING_NEW_VALIDATE':
        this.stepIndex = 2;
        break;
      default:
        this.stepIndex = 0; // Default to the first step if status is undefined or unexpected
    }
  }

  onStepperClick(event: any, i: number) {
    console.log('onStepperClick', event, i);
  }
}
