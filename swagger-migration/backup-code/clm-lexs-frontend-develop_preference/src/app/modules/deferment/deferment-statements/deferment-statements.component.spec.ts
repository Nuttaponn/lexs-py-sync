import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefermentStatementsComponent } from './deferment-statements.component';

describe('DefermentStatementsComponent', () => {
  let component: DefermentStatementsComponent;
  let fixture: ComponentFixture<DefermentStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefermentStatementsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefermentStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
