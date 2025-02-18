import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageEmptyComponent } from '@app/shared/components/message-empty/message-empty.component';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';

import { AddSubAccountComponent } from './add-sub-account.component';

describe('AddSubAccountComponent', () => {
  let component: AddSubAccountComponent;
  let fixture: ComponentFixture<AddSubAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSubAccountComponent, MessageEmptyComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
