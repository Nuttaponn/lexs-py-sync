import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnDetailInfoComponent } from './withdrawn-detail-info.component';

describe('WithdrawnDetailInfoComponent', () => {
  let component: WithdrawnDetailInfoComponent;
  let fixture: ComponentFixture<WithdrawnDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnDetailInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
