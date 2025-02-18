import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { BuddhistEraPipe } from '@spig/core';
import { MessageBannerComponent } from '../../message-banner/message-banner.component';

import { CommitmentAccountSelectComponent } from './commitment-account-select.component';

describe('CommitmentAccountSelectComponent', () => {
  let component: CommitmentAccountSelectComponent;
  let fixture: ComponentFixture<CommitmentAccountSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommitmentAccountSelectComponent, MessageBannerComponent, BuddhistEraPipe],
      imports: [...UnittestImports],
      providers: [
        ...UnittestProviders,
        Configuration,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentAccountSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
