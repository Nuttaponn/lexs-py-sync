import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionBarComponent } from '@app/shared/components/action-bar/action-bar.component';
import { MessageBannerComponent } from '@app/shared/components/message-banner/message-banner.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { updateTrackingStatusComponent } from './update-tracking-status.component';

describe('updateTrackingStatusComponent', () => {
  let component: updateTrackingStatusComponent;
  let fixture: ComponentFixture<updateTrackingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [updateTrackingStatusComponent, ActionBarComponent, MessageBannerComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(updateTrackingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
