import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandDialogComponent } from './expand-dialog.component';

describe('ErrorDialogComponent', () => {
  let component: ExpandDialogComponent;
  let fixture: ComponentFixture<ExpandDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
