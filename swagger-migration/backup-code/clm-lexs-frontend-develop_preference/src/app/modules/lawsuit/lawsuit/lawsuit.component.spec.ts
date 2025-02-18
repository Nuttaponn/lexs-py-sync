import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterDataService } from '@app/shared/services/master-data.service';
import { SessionService } from '@app/shared/services/session.service';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import '@testing-library/jest-dom';
import { LawsuitComponent } from './lawsuit.component';

describe('LawsuitComponent', () => {
  let component: LawsuitComponent;
  let fixture: ComponentFixture<LawsuitComponent>;
  let masterDataService: MasterDataService;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LawsuitComponent],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration],
    }).compileComponents();
    masterDataService = TestBed.inject(MasterDataService);
    sessionService = TestBed.inject(SessionService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LawsuitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
  it('should have advanceOptions, currentUser, dataScopeCode when call ngOnInit', async () => {
    await component.ngOnInit();
    // advanceOptions
    expect(component.advanceOptions).not.toBeNull();
    // currentUser
    expect(component.currentUser).not.toBeNull();
    // dataScopeCode
    expect(component.dataScopeCode).not.toBeNull();
  });
  it("should have isTeamLawsuit = True when dataScopeCode = 'TEAM' && dataScopeCode = 'ORGANIZATION' ", async () => {
    let user = { dataScopeCode: 'TEAM' };

    sessionService.currentUser = user;
    await component.ngOnInit();
    expect(component.isTeamLawsuit).toBeTruthy();

    user.dataScopeCode = 'ORGANIZATION';
    sessionService.currentUser = user;
    await component.ngOnInit();
    expect(component.isTeamLawsuit).toBeTruthy();
  });
  it("should have isTeamLawsuit = False when dataScopeCode = 'SELF' ", async () => {
    let user = { dataScopeCode: 'SELF' };

    sessionService.currentUser = user;
    await component.ngOnInit();
    expect(component.isTeamLawsuit).toBeFalsy();
  });
});
