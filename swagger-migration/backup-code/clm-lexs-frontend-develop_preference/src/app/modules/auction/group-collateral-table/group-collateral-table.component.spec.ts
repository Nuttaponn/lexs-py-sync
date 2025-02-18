import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCollateralTableComponent } from './group-collateral-table.component';

describe('GroupCollateralTableComponent', () => {
  let component: GroupCollateralTableComponent;
  let fixture: ComponentFixture<GroupCollateralTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupCollateralTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCollateralTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
