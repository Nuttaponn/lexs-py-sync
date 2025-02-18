import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawnSeizurePropertyAssetListComponent } from './withdrawn-seizure-property-asset-list.component';

describe('WithdrawnSeizurePropertyAssetListComponent', () => {
  let component: WithdrawnSeizurePropertyAssetListComponent;
  let fixture: ComponentFixture<WithdrawnSeizurePropertyAssetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawnSeizurePropertyAssetListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawnSeizurePropertyAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
