import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLitigationComponent } from './detail-litigation.component';

describe('DetailLitigationComponent', () => {
  let component: DetailLitigationComponent;
  let fixture: ComponentFixture<DetailLitigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailLitigationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailLitigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
