import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOwnershipDetailsComponent } from './transfer-ownership-details.component';

describe('TransferOwnershipDetailsComponent', () => {
  let component: TransferOwnershipDetailsComponent;
  let fixture: ComponentFixture<TransferOwnershipDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferOwnershipDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOwnershipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
