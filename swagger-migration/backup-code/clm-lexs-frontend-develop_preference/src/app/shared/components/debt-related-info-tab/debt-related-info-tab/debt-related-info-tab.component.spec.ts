import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionBarComponent } from '@app/shared/components/action-bar/action-bar.component';
import { MessageEmptyComponent } from '@app/shared/components/message-empty/message-empty.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { DebtRelatedInfoTabComponent } from './debt-related-info-tab.component';

describe('DebtRelatedInfoTabComponent', () => {
  let component: DebtRelatedInfoTabComponent;
  let fixture: ComponentFixture<DebtRelatedInfoTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebtRelatedInfoTabComponent, ActionBarComponent, MessageEmptyComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtRelatedInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
