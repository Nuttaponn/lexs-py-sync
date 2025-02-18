import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageBannerComponent } from '@app/shared/components/message-banner/message-banner.component';
import { MessageEmptyComponent } from '@app/shared/components/message-empty/message-empty.component';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { DopaComponent } from './dopa.component';

describe('DopaComponent', () => {
  let component: DopaComponent;
  let fixture: ComponentFixture<DopaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DopaComponent, MessageEmptyComponent, MessageBannerComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DopaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
