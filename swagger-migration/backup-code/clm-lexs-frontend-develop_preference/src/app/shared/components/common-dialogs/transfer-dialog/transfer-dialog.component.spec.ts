import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageBannerComponent } from '@app/shared/components/message-banner/message-banner.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { TransferDialogComponent } from './transfer-dialog.component';

describe('TransferDialogComponent', () => {
  let component: TransferDialogComponent;
  let fixture: ComponentFixture<TransferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferDialogComponent, MessageBannerComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
