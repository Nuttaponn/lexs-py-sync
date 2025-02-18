import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageBannerComponent } from '@app/shared/components/message-banner/message-banner.component';
import { MessageEmptyComponent } from '@app/shared/components/message-empty/message-empty.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { ModalAssignLawsuitComponent } from './modal-assign-lawsuit.component';

describe('ModalAssignLawsuitComponent', () => {
  let component: ModalAssignLawsuitComponent;
  let fixture: ComponentFixture<ModalAssignLawsuitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalAssignLawsuitComponent, MessageBannerComponent, MessageEmptyComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAssignLawsuitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
