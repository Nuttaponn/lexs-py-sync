import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncePropertyListComponent } from './announce-property-list.component';

describe('AnnouncePropertyListComponent', () => {
  let component: AnnouncePropertyListComponent;
  let fixture: ComponentFixture<AnnouncePropertyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnouncePropertyListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncePropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
