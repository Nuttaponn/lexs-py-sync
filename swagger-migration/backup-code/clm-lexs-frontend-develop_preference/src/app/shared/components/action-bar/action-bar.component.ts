import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivationEnd, Data, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { RouterService } from '../../services/router.service';

export interface SubButtonModel {
  name: string;
  icon: string;
  text: string;
  disabled: boolean;
  class?: string;
}

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnInit, OnDestroy {
  //MAIN ACTION BUTTONS
  //Primary button, this serves for action such as add, approve, done, etc.
  @Input() hasPrimaryButton!: boolean;
  @Input() disabledPrimaryButton!: boolean;
  @Input() primaryButtonText!: string;
  @Input() primaryButtonTextString!: string;
  @Input() displayPrimaryButtonTextString!: boolean;
  @Input() primaryButtonIcon!: string;
  @Output() primaryButtonHandler = new EventEmitter<any>();

  //Reject button, this serves for action such as reject, cease case
  @Input() hasRejectButton!: boolean;
  @Input() disabledRejectButton!: boolean;
  @Input() rejectNormalBtnStyle!: boolean;
  @Input() rejectButtonText!: string;
  @Input() rejectButtonIcon!: string;
  @Output() rejectButtonHandler = new EventEmitter<any>();

  //Save button
  @Input() hasSaveButton!: boolean;
  @Input() saveButtonText!: string;
  @Input() disabledSaveButton!: boolean;
  @Output() saveButtonHandler = new EventEmitter<any>();

  //Cancel button
  @Input() hasCancelButton!: boolean;
  @Input() cancelButtonText!: string;
  @Input() disabledCancelButton!: boolean;
  @Input() cancelButtonIcon!: string;
  @Output() cancelButtonHandler = new EventEmitter<any>();

  //Edit button
  @Input() hasEditButton!: boolean;
  @Input() editButtonText!: string;
  @Input() disabledEditButton!: boolean;
  @Input() editButtonIcon!: string;
  @Input() editButtonPrimary: boolean = false;
  @Output() editButtonHandler = new EventEmitter<any>();

  //Deferment Execution button
  @Input() hasDefermantExeButton!: boolean;
  @Input() defermantExeButtonText!: string;
  @Input() disabledDefermantExeButton!: boolean;
  @Input() defermantExeButtonIcon!: string;
  @Input() defermantExeButtonPrimary: boolean = false;
  @Output() defermantExeButtonHandler = new EventEmitter<any>();

  //Delete button
  @Input() hasDeleteButton!: boolean;
  @Input() deleteButtonText!: string;
  @Input() deleteButtonIcon!: string;
  @Input() deleteButtonPositive: boolean = false;
  @Input() disabledDeleteButton!: boolean;
  @Input() deleteButtonClasses!: string;
  @Output() deleteButtonHandler = new EventEmitter<any>();

  //Back button
  @Input() hasBackButton: boolean = true;
  @Input() backButtonText!: string;
  @Input() disabledBackButton!: boolean;
  @Output() backButtonHandler = new EventEmitter<any>();

  //Sub Buttons
  @Input() subButtonList: Array<SubButtonModel> = [];
  @Output() subButtonHandler = new EventEmitter<any>();

  //DISPLAY FLAG FOR ACTION BAR TITLE INFO & STATUS
  @Input() showNavBarInformation!: boolean;

  // Set max sub button at 1 for R1.3
  @Input() maxSubButton = 1;
  public isMoreExpanded = false;
  public hasMainActionButton = false;
  public routerData!: Data;
  private subs = new SubSink();

  constructor(
    private router: Router,
    private routerService: RouterService
  ) {
    this.subs.add(
      this.router.events.subscribe(event => {
        if (event instanceof ActivationEnd) {
          if (event.snapshot && event.snapshot.data && event.snapshot.data['header']) {
            this.routerData = event.snapshot.data;
          }
        }
      })
    );
  }

  ngOnInit() {
    this.hasMainActionButton =
      this.hasPrimaryButton ||
      this.hasRejectButton ||
      this.hasSaveButton ||
      this.hasCancelButton ||
      this.hasEditButton ||
      this.hasDeleteButton;
  }

  subBtnClick(subBtnName: string): void {
    this.subButtonHandler.emit({ name: subBtnName });
    this.isMoreExpanded = false;
  }

  primaryAction(): void {
    this.primaryButtonHandler.emit({ name: 'Primary Event' });
  }

  reject(): void {
    this.rejectButtonHandler.emit({ name: 'Reject Event' });
  }

  save(): void {
    this.saveButtonHandler.emit({ name: 'Save Event' });
  }

  cancel(): void {
    this.cancelButtonHandler.emit({ name: 'Cancel Event' });
  }

  edit(): void {
    this.editButtonHandler.emit({ name: 'Edit Event' });
  }

  delete(): void {
    this.deleteButtonHandler.emit({ name: 'Delete Event' });
  }

  back(): void {
    this.backButtonHandler.emit({ name: 'Back Event' });
  }

  defermentExecution() {
    this.defermantExeButtonHandler.emit({ name: 'Deferment Event' });
  }

  onNavigatePage(path: string) {
    this.routerService.navigateTo(path);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
