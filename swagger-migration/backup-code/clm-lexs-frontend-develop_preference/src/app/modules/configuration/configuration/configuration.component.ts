import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationMatchingComponent } from '@app/shared/components/configuration-matching/configuration-matching.component';
import { LoggerService } from '@app/shared/services/logger.service';
import { LexsConfig, LexsConfigRequest, ResponseUnitRequest } from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@shared/services/notification.service';
import { SessionService } from '@shared/services/session.service';
import { DropDownConfig } from '@spig/core';
import { SubSink } from 'subsink';
import { ILexsUserOption } from '../config.model';
import { IConfigResolver } from '../configuration.resolver';
import { ConfigurationService } from '../configuration.service';
import { ExtendedKlawConfigDto } from './../config.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  @ViewChild(ConfigurationMatchingComponent) configurationMatchingComp!: ConfigurationMatchingComponent;

  public displayedColumns: string[] = ['no', 'klawName', 'dropdown'];
  isOpened1 = true;
  isOpened2 = true;
  isOpened3 = true;

  actionBar = {
    hasBack: false,
    showNavBarInformation: true,
    hasPrimaryButton: true,
    disabledPrimaryButton: false,
    primaryButtonText: 'CONFIGURATION.BTN_SAVE',
    primaryButtonIcon: 'icon-save-primary',
  };

  originalValue: LexsConfigRequest = {};
  dataSource: Array<any> = [];

  public ddlKTBLaw: DropDownConfig = {
    searchWith: 'fullname',
    displayWith: 'fullname',
    valueField: 'userId',
    searchPlaceHolder: '',
    labelPlaceHolder: 'CONFIGURATION.PLACEHOLDER_KTBLAW_USER',
  };

  configForm: UntypedFormGroup = this.initForm();
  get formConfig() {
    return this.configForm.controls;
  }

  klawForm!: UntypedFormGroup;
  getKlawForm(name: string): any {
    return this.klawForm.get(name);
  }

  private resolverData!: IConfigResolver;
  public ddlcc_kbdOptions: Array<ILexsUserOption> = [];
  public ddlcc_kdnOptions: Array<ILexsUserOption> = [];
  private subs = new SubSink();

  extendedKlawConfigDtos: ExtendedKlawConfigDto[] = [];
  isSubmited: boolean = false;
  isKLawFormInvalid: boolean = true;

  constructor(
    private translate: TranslateService,
    public fb: UntypedFormBuilder,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    public configurationService: ConfigurationService,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) {
    this.resolverData = this.route.snapshot.data['configResolver'] as IConfigResolver;
    this.subs.add(
      this.sessionService.viewAsFetchData.subscribe(value => {
        value && this.fetchInquiryConfig();
      })
    );
  }

  async ngOnInit(): Promise<void> {
    // SET Data for render
    await this.setData();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.configurationService.clearData();
  }

  async fetchInquiryConfig() {
    const inquiryResponse = await this.configurationService.inquiryConfig();
    if (inquiryResponse) {
      this.resolverData.lexsConfigDto = inquiryResponse;
    }
    this.setData();
  }

  initForm(value?: Array<LexsConfig>) {
    return this.fb.group({
      LEXS_DPD: [value ? this.findConfigByKey('LEXS_DPD', value)?.value : null, Validators.required],
      LITIGATION_DPD: [value ? this.findConfigByKey('LITIGATION_DPD', value)?.value : null, Validators.required],
      APPEAL_DURATION: [value ? this.findConfigByKey('APPEAL_DURATION', value)?.value : null, Validators.required],
      PETITION_DURATION: [value ? this.findConfigByKey('PETITION_DURATION', value)?.value : null, Validators.required],
      NOTICE_DURATION: [value ? this.findConfigByKey('NOTICE_DURATION', value)?.value : null, Validators.required],
      DEFAULT_KLAW_USER_ID: [
        value ? this.findConfigByKey('DEFAULT_KLAW_USER_ID', value)?.value : null,
        Validators.required,
      ],
    });
  }

  findConfigByKey(key: string, config: Array<LexsConfig>) {
    return config.find(item => item.key === key);
  }

  getControl(name: string): any {
    return this.configForm.get(name);
  }

  async canDeactivate() {
    if (
      !this.configForm.dirty &&
      !this.klawForm.dirty &&
      this.configurationService.updatedResponseUnitUsers.length === 0
    ) {
      return true;
    }
    return await this.sessionService.confirmExitWithoutSave();
  }

  onDdlKTBLawOptionsSelected(value: string, primaryKey: string, index: number) {
    this.getKlawForm(primaryKey)?.setValue(value);
    this.extendedKlawConfigDtos[index].userId = value;
    this.isKLawFormInvalid = this.klawForm.invalid;
  }

  async onSave() {
    this.isSubmited = true;

    // วน for set new value
    if (!this.configForm.invalid && !this.klawForm.invalid) {
      this.originalValue.configs?.forEach(en => {
        if (en.key && this.formConfig[en.key]) en.value = this.formConfig[en.key].value;
      });

      // Enhance to new feature in R1.3
      this.originalValue.klawConfigs = [];
      for (let extendedKlawConfigDto of this.extendedKlawConfigDtos) {
        this.originalValue.klawConfigs.push({
          userId: extendedKlawConfigDto.userId,
          code: extendedKlawConfigDto.code,
          name: extendedKlawConfigDto.name,
        });
      }

      this.originalValue.responseUnitRequest = [];
      for (let updatedResponseUnitUser of this.configurationService.updatedResponseUnitUsers) {
        for (let detailDto of updatedResponseUnitUser?.responseUnitUserDetailsDto ?? []) {
          if (!!detailDto.updateFlag) {
            const responseUnitRequest: ResponseUnitRequest = {
              effectiveDate: detailDto.effectiveDate,
              id: detailDto.id,
              responseUnitCode: updatedResponseUnitUser.responseUnitCode,
              updateFlag: detailDto.updateFlag,
              userId: detailDto.userId,
            };

            this.originalValue.responseUnitRequest.push(responseUnitRequest);
          }
        }
      }

      try {
        await this.configurationService.updateConfig(this.originalValue);

        this.notificationService.openSnackbarSuccess(this.translate.instant('CONFIGURATION.TOAST_SUCCESS_SAVE'));

        this.setData(true);
        this.configForm.markAsPristine();
        this.klawForm.markAsPristine();
        this.configurationService.clearData();
        this.configurationMatchingComp.initTablePart();
      } catch (e) {
        this.logger.catchError('CATCH ERROR Configuration :: ', e);
      }

      // (* data validation for other sections except ‘การตั้งค่าการจับคู่หน่วยงานดูแลลูก
      // หนี้กับทีมกำกับดูแลงานกฎหมาย’ not change from existing LEXS R1.2)
    } else {
      this.configForm.markAllAsTouched();
      this.klawForm.markAllAsTouched();
    }
  }

  async setData(isNewLexsConfigDto: boolean = false) {
    this.isSubmited = false;

    if (isNewLexsConfigDto) {
      const inquiryResponse = await this.configurationService.inquiryConfig();
      this.resolverData.lexsConfigDto = inquiryResponse;
    }
    const res = this.resolverData.lexsConfigDto || {};

    if (res?.configs) {
      this.configForm = this.initForm(res.configs);
    }

    // KlawConfigDto
    if (res?.klawConfigs) {
      const extendedKlawConfigDtos = [];
      for (let klawConfig of [...res.klawConfigs]) {
        const filteredOptions = this.resolverData.klawOptions?.filter(opt => opt.factionCode === klawConfig.code) ?? [];
        extendedKlawConfigDtos.push({
          ...klawConfig,
          usersList: [...filteredOptions],
          klawName: `${klawConfig.code} - ${klawConfig.name}`,
          primaryKey: this.getKlawPrimaryKey({ ...klawConfig }),
        });
      }
      this.klawForm = this.initKlawForm(extendedKlawConfigDtos);

      this.extendedKlawConfigDtos = [...extendedKlawConfigDtos];
    }
    this.originalValue = res;
  }

  getKlawPrimaryKey(dto: ExtendedKlawConfigDto): string {
    return `${dto.userId}|${dto.code}|${dto.name}}`;
  }

  initKlawForm(dtos: Array<ExtendedKlawConfigDto>) {
    const group: any = {};
    for (let dto of dtos) {
      if (!!dto.primaryKey) {
        group[dto.primaryKey] = new UntypedFormControl(dto.userId || '', Validators.required);
      }
    }
    return new UntypedFormGroup(group);
  }
}
