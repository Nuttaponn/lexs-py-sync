import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { TMode } from '@app/shared/models';
import { LoggerService } from '@app/shared/services/logger.service';
import {
  AuctionDetails,
  AuctionDetailsAssetOwner,
  AuctionDetailsLexsDefendant,
  AuctionLexsCollateralDto,
} from '@lexs/lexs-client';
export interface AuctionLexsCollateralDtoWithAsset extends AuctionLexsCollateralDto {
  assetObligationBy?: string;
  assetId?: number;
}
@Component({
  selector: 'app-auc-announement-verify-collateral-detail',
  templateUrl: './auc-announement-verify-collateral-detail.component.html',
  styleUrls: ['./auc-announement-verify-collateral-detail.component.scss'],
})
export class AucAnnounementVerifyCollateralDetailComponent implements OnInit {
  @Input() title: string = 'ANNOUNCE_VERIFY_COLLATERAL.TITLE_VERIFY_COLLATERAL_DETAIL';
  @Input() mode: TMode = 'EDIT';
  @Input() actionType: 'VERIFY' | 'MAPPING' = 'VERIFY';
  @Input() data: Array<AuctionLexsCollateralDto> = [];
  @Input() dataToVerify: AuctionDetails | undefined;
  @Input() dataForm!: UntypedFormGroup;
  @Input() config: any;
  @Input() tableColumns: any;
  @Input() selectCollateralId: any;

  @Output() onUpdateSelectItem = new EventEmitter<any>();
  @Output() onReSelectCollateral = new EventEmitter<any>();

  defaultConfig: any = { hasPining: true, hideFilter: true, hidePaging: true };
  mappingData: Array<any> = [];
  isOpened = true;
  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('[AucAnnounementVerifyCollateralDetailComponent][ngOnInit]');
    this.dataForm?.get('result')?.setValue(this.dataToVerify?.isDeedInfoValid === true ? 'CORRECT' : 'INCORRECT');
    if (this.actionType === 'MAPPING') {
      this.defaultConfig = { ...this.defaultConfig, hidePaging: false, hideFilter: false };
      this.mappingData = this.data
        .filter(it => it.ledId == this.dataToVerify?.lexsLedId)
        .map((it: AuctionLexsCollateralDtoWithAsset) => {
          const obj: any = {
            ...it,
            aucRef: 0,
            deedGroupId: 0,
            deedId: 0,
            fsubbidnum: '',
            assettypedesc: it.lexsCollateralTypeDesc || '',
            landtype: it.lexsCollateralSubTypeDesc || '',
            ledOriginalDeedno: it.lexsDocumentNo || '',
            assetDetail: it.lexsCollateralsDescription || '',
            redCaseNo: it.lexsRedCaseNo || '',
            saletypedesc: '',
            debtname: this.getDebtName(it) || '',
            ownername: it.lexsOwnerFullName || '',
            plaintiffname: it.lexsPlaintiffName || '',
            defendantname: '',
            occupant: '',
            ledid: '',
            ledname: it.ledName || '',
            ledOriginalName: '',
            remark: '',
            url: '',
            collateralMatched: false,
            collateralMatchTimestamp: '',
            collateralTypeCode: '',
            collateralSubTypeCode: '',
            collateralDocumentNo: '',
            isDeedInfoValid: '',
            validationNote: '',
            value1: '',
            collateralId: it.collateralId,
            lexsCollateralTypeDesc: '',
            lexsCollateralSubTypeDesc: '',
            lexsCollateralsDescription: '',
            lexsPlaintiffname: '',
            lexsOwnerFullName: '',
            lexsDefendant: it.lexsDefendant as AuctionDetailsLexsDefendant[],
          };
          return obj;
        });
    } else {
      const isAsset = this.dataToVerify?.isNonPledgeAsset;
      const obj: AuctionDetails = {
        ...this.dataToVerify,
        aucRef: 0,
        deedGroupId: 0,
        deedId: 0,
        fsubbidnum: this.dataToVerify?.fsubbidnum || '',
        assettypedesc: isAsset
          ? this.dataToVerify?.assetCollateralTypeDesc || ''
          : this.dataToVerify?.lexsCollateralTypeDesc || '',
        landtype: isAsset
          ? this.dataToVerify?.assetCollateralSubTypeDesc || ''
          : this.dataToVerify?.lexsCollateralSubTypeDesc || '',
        ledOriginalDeedno: isAsset
          ? this.dataToVerify?.assetDocumentNo || ''
          : this.dataToVerify?.collateralDocNo || '',
        assetDetail: isAsset
          ? this.dataToVerify?.assetDescription || ''
          : this.dataToVerify?.lexsCollateralsDescription || '',
        redCaseNo: this.dataToVerify?.lexsRedCaseNo || '',
        saletypedesc: '',
        debtname: isAsset ? this.dataToVerify?.assetObligationBy || '' : '',
        ownername: isAsset
          ? this.getLexsOwnerFullNameAsset(this.dataToVerify?.assetOwners || [])
          : this.dataToVerify?.lexsOwnerFullName || '',
        plaintiffname: isAsset
          ? this.dataToVerify?.assetPlaintiffname || ''
          : this.dataToVerify?.lexsPlaintiffname || '',
        defendantname: '',
        occupant: '',
        ledId: 0,
        ledName: this.dataToVerify?.lexsLedName || '',
        ledOriginalName: this.dataToVerify?.lexsLedName || '',
        remark: '',
        url: '',
        collateralMatched: false,
        collateralMatchTimestamp: '',
        collateralTypeCode: '',
        collateralSubTypeCode: '',
        isDeedInfoValid: false,
        validationNote: '',
        value1: '',
        collateralId: this.dataToVerify?.isNonPledgeAsset
          ? this.dataToVerify?.assetId?.toString()
          : this.dataToVerify?.collateralId,
        lexsCollateralTypeDesc: '',
        lexsCollateralSubTypeDesc: '',
        lexsCollateralsDescription: '',
        lexsPlaintiffname: '',
        lexsOwnerFullName: '',
        lexsDefendant: this.dataToVerify?.lexsDefendant as AuctionDetailsLexsDefendant[],
      };

      this.mappingData = [obj];
    }
  }

  onRadioChang(e: any) {
    this.logger.info('[AucAnnounementVerifyCollateralDetailComponent][ngOnInit]', e);
    if (e === 'INCORRECT') {
      this.dataForm.get('reason')?.addValidators([Validators.required]);
    } else {
      this.dataForm.get('reason')?.removeValidators([Validators.required]);
    }
    this.dataForm.get('reason')?.updateValueAndValidity();
    this.dataForm.get('reason')?.reset();
  }

  updateSelectItem(event: any) {
    this.onUpdateSelectItem.emit(event);
  }

  reSelectCollateral(data?: any) {
    this.onReSelectCollateral.emit(data);
  }

  getLexsOwnerFullNameAsset(assetOwners: Array<AuctionDetailsAssetOwner>) {
    let result: string = '';

    assetOwners.forEach(assetOwner => {
      if (assetOwner.firstName && assetOwner.lastName) {
        if (assetOwner.custTypeConst === 'P') {
          result += `${assetOwner.identificationNo} - ${assetOwner.firstName} ${assetOwner.lastName}, `;
        } else if (assetOwner.custTypeConst === 'C') {
          result += `${assetOwner.identificationNo} - ${assetOwner.firstName}, `;
        } else result += '-, ';
      }
    });

    // Check if there's a non-empty result before slicing
    if (result.length > 0) {
      result = result.slice(0, -2); // Removing the last ', ' from the concatenated string
    }

    return result;
  }

  getDebtName(it: AuctionLexsCollateralDtoWithAsset) {
    if (it.assetId) {
      if (it.assetObligationBy) return it.assetObligationBy || '';
      else return '-';
    } else return it.lexsPlaintiffName || '';
  }
}
