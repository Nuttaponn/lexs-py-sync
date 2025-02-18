import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnershipTransferComponent } from './ownership-transfer.component';

describe('OwnershipTransferComponent', () => {
  let component: OwnershipTransferComponent;
  let fixture: ComponentFixture<OwnershipTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnershipTransferComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnershipTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
