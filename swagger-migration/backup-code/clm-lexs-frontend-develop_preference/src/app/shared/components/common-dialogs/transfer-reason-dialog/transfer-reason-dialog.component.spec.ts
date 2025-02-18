import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageBannerComponent } from '@app/shared/components/message-banner/message-banner.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { TransferReasonDialogComponent } from './transfer-reason-dialog.component';

describe('TransferReasonDialogComponent', () => {
  let component: TransferReasonDialogComponent;
  let fixture: ComponentFixture<TransferReasonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferReasonDialogComponent, MessageBannerComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
