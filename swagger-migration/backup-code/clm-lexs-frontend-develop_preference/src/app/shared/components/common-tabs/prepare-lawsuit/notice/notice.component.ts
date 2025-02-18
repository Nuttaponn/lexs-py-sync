import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { LawsuitService } from '@app/modules/lawsuit/lawsuit.service';
import { TaskService } from '@app/modules/task/services/task.service';
import { BlobType, FileType, ITooltip, statusCode, taskCode } from '@app/shared/models';
import { NotificationService } from '@app/shared/services/notification.service';
import { Utils } from '@app/shared/utils';
import {
  CreateAddressRequest,
  DocumentDto,
  DocumentUploadResponse,
  LitigationDetailDto,
  LitigationNoticeDto,
  NewsAnnouncementDto,
  NewsAnnouncementRequest,
  NoticeLetterDto,
  PersonDto,
  PostalDto,
  TaskDetailDto,
  TrackingRequest,
  TrackingRequestItem,
} from '@lexs/lexs-client';
import { TranslateService } from '@ngx-translate/core';
import { DialogOptions } from '@spig/core';
import { DocumentService } from '../../../document-preparation/document.service';
import { UpdateLitigationNoticeDto } from './UpdateLitigationNoticeDto';
import { LETTER_TRACKING_STATUS_TEXTS } from './notice.const';
import { UploadNewspaperComponent } from './upload-newspaper/upload-newspaper.component';
import { UploadNotiComponent } from './upload-noti/upload-noti.component';
import { PrepareLawsuitService } from '../prepare-lawsuit.service';
import { LoggerService } from '@app/shared/services/logger.service';

/* group ของบอกกล่าว */
export interface IGroupByNoticeType {
  groupNo: string;
  deliveryDateTime: string;
  news?: IGroupByPersonId[];
  letter?: IGroupByPersonId[];
}
export interface IGroupByPersonId {
  personId: string;
  relation?: string;
  referencePerson?: PersonDto;
  litigationNoticeDtos: UpdateLitigationNoticeDto[];
  noticeTemplateNo?: string;
}

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss'],
})
export class NoticeComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @ViewChildren(MatTable) table!: QueryList<any>;

  displayedColumns: string[] = [
    'no',
    'noticeNo',
    'addressType',
    'addressDetail',
    'noticeDate',
    'noticeDuration',
    'noticeDueDate',
    'cmdV1',
  ];

  displayedColumnsV2: string[] = [
    'no',
    'noticeNo',
    'addressType',
    'addressDetail',
    'noticeDate',
    'noticeDuration',
    'noticeDueDate',
    'cmdV2',
  ];

  isOpenedList: boolean[] = [];

  public taskId!: number;
  public litigationId!: string;

  public TASK_CODE = taskCode;
  public STATUS_CODE = statusCode;

  public taskDetail: TaskDetailDto = {};
  public taskCode!: taskCode;
  public statusCode!: statusCode;
  public litigationDetail!: LitigationDetailDto;

  public isShowThisPage: boolean = true;
  oldRawLitigationNoticeDtoList: LitigationNoticeDto[] = []; // ใช้สำหรับ DoCheck hook cycle ลบออกได้ถ้าไม่มีการ implement
  updateLitigationNoticeDtoList: UpdateLitigationNoticeDto[] = [];

  litigationNoticeDtoGroupNoList: IGroupByNoticeType[] = [];

  /* for filter and sort noticeList */
  private relationFilter = [
    LitigationNoticeDto.RelationEnum.Guarantor,
    LitigationNoticeDto.RelationEnum.GuarantorTrustee,
    LitigationNoticeDto.RelationEnum.GuarantorHeir,
    LitigationNoticeDto.RelationEnum.MainBorrower,
    LitigationNoticeDto.RelationEnum.MainBorrowerTrustee,
    LitigationNoticeDto.RelationEnum.MainBorrowerHeir,
    LitigationNoticeDto.RelationEnum.CoBorrower,
    LitigationNoticeDto.RelationEnum.CoBorrowerTrustee,
    LitigationNoticeDto.RelationEnum.CoBorrowerHeir,
    LitigationNoticeDto.RelationEnum.CollateralOwner,
    LitigationNoticeDto.RelationEnum.StandInPayer,
    LitigationNoticeDto.RelationEnum.DebtAcceptor,
    LitigationNoticeDto.RelationEnum.DebtAcceptSigner,
  ];

  relationSort = {
    [LitigationNoticeDto.RelationEnum.Guarantor]: 0,
    [LitigationNoticeDto.RelationEnum.GuarantorTrustee]: 1,
    [LitigationNoticeDto.RelationEnum.GuarantorHeir]: 2,
    [LitigationNoticeDto.RelationEnum.MainBorrower]: 3,
    [LitigationNoticeDto.RelationEnum.MainBorrowerTrustee]: 4,
    [LitigationNoticeDto.RelationEnum.MainBorrowerHeir]: 5,
    [LitigationNoticeDto.RelationEnum.CoBorrower]: 6,
    [LitigationNoticeDto.RelationEnum.CoBorrowerTrustee]: 7,
    [LitigationNoticeDto.RelationEnum.CoBorrowerHeir]: 8,
    [LitigationNoticeDto.RelationEnum.CollateralOwner]: 9,
    [LitigationNoticeDto.RelationEnum.StandInPayer]: 10,
    [LitigationNoticeDto.RelationEnum.DebtAcceptor]: 11,
    [LitigationNoticeDto.RelationEnum.DebtAcceptSigner]: 12,
  };

  addressTypeSort = {
    [LitigationNoticeDto.AddressTypeEnum.Registration]: 0,
    [LitigationNoticeDto.AddressTypeEnum.Receivership]: 1,
    [LitigationNoticeDto.AddressTypeEnum.Contract]: 2,
  };

  // ผู้จัดการมรดกของผู้กู้หลัก MAIN_BORROWER_TRUSTEE
  // ผู้จัดการมรดกของผู้กู้ร่วม CO_BORROWER_TRUSTEE
  // ผู้จัดการมรดกของผู้ค้ําประกัน GUARANTOR_TRUSTEE
  // ทายาทของผู้กู้หลัก MAIN_BORROWER_HEIR
  // ทายาทของผู้กู้ร่วม CO_BORROWER_HEIR
  // ทายาทของผู้ค้ําประกัน GUARANTOR_HEIR
  // ผู้รับชําระหนี้แทน STAND_IN_PAYER
  // ผู้รับสภาพหนี้ DEBT_ACCEPTOR
  // ผู้เซ็นต์หนังสือรับสภาพความรับผิด DEBT_ACCEPT_SIGNER
  lookingForDeathCases = [
    LitigationNoticeDto.RelationEnum.MainBorrowerTrustee,
    LitigationNoticeDto.RelationEnum.CoBorrowerTrustee,
    LitigationNoticeDto.RelationEnum.GuarantorTrustee,
    LitigationNoticeDto.RelationEnum.MainBorrowerHeir,
    LitigationNoticeDto.RelationEnum.CoBorrowerHeir,
    LitigationNoticeDto.RelationEnum.GuarantorHeir,
    LitigationNoticeDto.RelationEnum.StandInPayer,
    LitigationNoticeDto.RelationEnum.DebtAcceptor,
    LitigationNoticeDto.RelationEnum.DebtAcceptSigner,
  ];

  isDisabledDownloadBtnLetter = true;

  constructor(
    private translate: TranslateService,
    private lawsuitService: LawsuitService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private documentService: DocumentService,
    private prepareLawsuitService: PrepareLawsuitService,
    private logger: LoggerService
  ) {
    this.route.queryParams.subscribe(value => (this.taskId = value ? value['taskId'] : -1));
  }

  async ngOnInit(): Promise<void> {
    this.litigationId = this.lawsuitService.currentLitigation?.litigationId ?? '-1';
    this.taskDetail = this.taskService.taskDetail;
    this.taskCode = (this.taskDetail?.taskCode as taskCode) || '';
    this.statusCode = (this.taskDetail?.statusCode as statusCode) || '';
    this.litigationDetail = this.taskService.litigationDetail || {};

    await this.getAdjustedLgNoticeDtoList();
    this.setConditionButton();

    this.prepareLawsuitService.refreshInquiryNotices.subscribe(async value => {
      if (!!value) {
        await this.refreshDataNoticeList();
      }
    });
  }

  async refreshDataNoticeList() {
    let result = await this.lawsuitService.inquiryNotices(this.litigationId, this.taskId);
    if (!!!result) return;

    this.lawsuitService.litigationNotice = [...result];

    /* เอาข้อมูลที่ไม่สมบูรณ์ออกให้หมด (ดักเผื่อ) */
    result = result?.filter(dto => !!dto.noticeType && !!dto.personId && !!dto.groupNo);
    this.logger.info('🚀 ~ after sort result:', result);
    result = result
      ?.sort((a, b) => {
        return (a?.noticeTemplateNo ?? '').localeCompare(b?.noticeTemplateNo ?? '');
      })
      .sort((a, b) => {
        return (
          (this.addressTypeSort[a?.addressType ?? ''] ?? 9999) - (this.addressTypeSort[b?.addressType ?? ''] ?? 9999)
        );
      })
      .sort((a, b) => {
        return (this.relationSort[a?.relation ?? ''] ?? 9999) - (this.relationSort[b?.relation ?? ''] ?? 9999);
      });
    this.logger.info('🚀 ~ after sort result:', result);
    this.updateLitigationNoticeDtoList = [...result];
    this.convertRawDataToTableData(this.updateLitigationNoticeDtoList);
    this.logger.info('🚀 ~ after convertRawDataToTableData result:', this.updateLitigationNoticeDtoList);
    this.prepareLawsuitService.refreshInquiryNotices.next(false);
  }

  setConditionButton() {
    /* FIX LEX2-24348 */
    this.isDisabledDownloadBtnLetter =
      this.litigationDetail?.defermentStatus !== 'NORMAL' &&
      !this.litigationNoticeDtoGroupNoList.some(litigationNoticeDtoGroupNo =>
        (litigationNoticeDtoGroupNo.letter ?? []).some(groupByLetterData =>
          (groupByLetterData?.litigationNoticeDtos ?? []).some(obj =>
            ['DOWNLOADED', 'SUCCESS_NOTICE', 'DRAFT_TRACKING', 'SUCCESS_TRACKING', 'SUCCESS_CONFIRM'].includes(
              obj.noticeStatus || ''
            )
          )
        )
      );
  }

  initLawsuitNoticeDataForSave() {
    this.lawsuitService.updateLitigationNoticeDtoList = this.updateLitigationNoticeDtoList;

    const lg = this.documentService?.customer?.litigationId || '';
    if (this.taskCode.includes('RECORD_NOTICE')) {
      const reqList = this.convertNoticeDtoToNoticeLetterReq(this.updateLitigationNoticeDtoList);
      this.lawsuitService.noticeLetterRequest = {
        headerFlag: NewsAnnouncementRequest.HeaderFlagEnum.Draft, //เซ็ตอีกทีจังหวะ save ใน task-detail
        taskId: this.taskId,
        notices: reqList,
      };
    } else if (this.taskCode === 'CONFIRM_NOTICE_LETTER') {
      const reqList = this.convertNoticeDtoToPostalDto(this.updateLitigationNoticeDtoList);
      this.lawsuitService.postalRequest = {
        headerFlag: NewsAnnouncementRequest.HeaderFlagEnum.Submit, //เซ็ตอีกทีจังหวะ save ใน task-detail
        taskId: this.taskId,
        notices: reqList,
      };
    } else if (this.taskCode === 'NEWSPAPER_ANNOUCEMENT') {
      if (this.taskDetail.statusCode === statusCode.FAILED) {
        this.lawsuitService.createNewsRequest = {
          litigationId: lg,
          personIds:
            this.updateLitigationNoticeDtoList
              ?.filter(dto => dto.trackingStatus === statusCode.FAILED)
              .map(dto => dto.personId ?? '-1') ?? [],
          taskId: this.taskId,
        };
      } else {
        const filteredDto =
          this.updateLitigationNoticeDtoList?.filter(
            dto => dto.actionFlag === true && dto.updateFlag === NoticeLetterDto.UpdateFlagEnum.U
          ) ?? [];
        const newsAnnouncementDtoList: NewsAnnouncementDto[] = [];
        filteredDto.forEach(dto => {
          if (!dto.noticeStatus) return;

          const noticeStatus = dto.noticeStatus;

          const newsAnnouncementDto: NewsAnnouncementDto = (({
            firstNoticeDate,
            lastNoticeDate,
            newspaperName,
            noticeDate,
            noticeDueDate,
            noticeId,
            noticeImageId,
            noticeNo,
            updateFlag,
          }) => ({
            firstNoticeDate,
            lastNoticeDate,
            newspaperName,
            noticeDate,
            noticeDueDate,
            noticeId,
            noticeImageId,
            noticeNo,
            updateFlag,
            noticeStatus,
          }))(dto);
          newsAnnouncementDtoList.push(newsAnnouncementDto);
        });

        this.lawsuitService.newsAnnouncementRequest = {
          headerFlag: NewsAnnouncementRequest.HeaderFlagEnum.Draft, //เซ็ตอีกทีจังหวะ save ใน task-detail
          taskId: this.taskId,
          notices: newsAnnouncementDtoList,
        };
      }
    }
  }

  private convertNoticeDtoToNoticeLetterReq(updateList: UpdateLitigationNoticeDto[]) {
    const updateFlagArr = [
      NoticeLetterDto.UpdateFlagEnum.A,
      NoticeLetterDto.UpdateFlagEnum.U,
      NoticeLetterDto.UpdateFlagEnum.D,
    ];
    const filteredDtoList = updateList?.filter(dto => dto.updateFlag && updateFlagArr.includes(dto.updateFlag));

    const reqDtos: NoticeLetterDto[] = [];
    filteredDtoList.forEach(dto => {
      if (!dto.noticeStatus) return;

      const noticeStatus = dto.noticeStatus;

      const reqDto: NoticeLetterDto = (({
        addressId,
        addressType,
        groupNo,
        noticeDate,
        noticeDuration,
        noticeId,
        noticeImageId,
        noticeNo,
        personId,
        relation,
        updateFlag,
      }) => ({
        addressId,
        addressType,
        groupNo,
        noticeDate,
        noticeDuration,
        noticeId,
        noticeImageId,
        noticeNo,
        personId,
        relation,
        updateFlag,
        noticeStatus,
      }))(dto);
      reqDtos.push(reqDto);
    });
    return reqDtos;
  }

  private convertNoticeDtoToPostalDto(updateList: UpdateLitigationNoticeDto[]): PostalDto[] {
    const updateFlag = NoticeLetterDto.UpdateFlagEnum.U;
    const filteredDtoList = updateList?.filter(dto => dto.updateFlag && updateFlag === dto.updateFlag);

    const reqDtos: PostalDto[] = [];
    filteredDtoList.forEach(dto => {
      const reqDto: PostalDto = (({ addressType, noticeId, noticeNo, postalImageId }) => ({
        addressType,
        noticeId,
        noticeNo,
        postalImageId,
      }))(dto);
      reqDtos.push(reqDto);
    });
    return reqDtos;
  }

  async getAdjustedLgNoticeDtoList(): Promise<void> {
    // Call inquiryNotices API every time if item.litigationId !== this.litigationId
    let result = [];
    if (this.lawsuitService.litigationNotice === null) {
      result = await this.lawsuitService.inquiryNotices(this.litigationId, this.taskId);
      this.lawsuitService.litigationNotice = [...result];
    } else {
      if (this.lawsuitService.litigationNotice.every(item => item.litigationId !== this.litigationId)) {
        result = await this.lawsuitService.inquiryNotices(this.litigationId, this.taskId);
        this.lawsuitService.litigationNotice = [...result];
      } else {
        result = this.lawsuitService.litigationNotice;
      }
    }

    if (!result) {
      return;
    }
    /* เอาข้อมูลที่ไม่สมบูรณ์ออกให้หมด (ดักเผื่อ) */
    result = result?.filter(dto => !!dto.noticeType && !!dto.personId && !!dto.groupNo);

    result = result
      ?.sort((a, b) => {
        return (a?.noticeTemplateNo ?? '').localeCompare(b?.noticeTemplateNo ?? '');
      })
      .sort((a, b) => {
        return (
          (this.addressTypeSort[a?.addressType ?? ''] ?? 9999) - (this.addressTypeSort[b?.addressType ?? ''] ?? 9999)
        );
      })
      .sort((a, b) => {
        return (this.relationSort[a?.relation ?? ''] ?? 9999) - (this.relationSort[b?.relation ?? ''] ?? 9999);
      });

    result?.forEach(dto => {
      this.updateLitigationNoticeDtoList.push({
        ...dto,
      });
    });
    this.convertRawDataToTableData([...this.updateLitigationNoticeDtoList]);
  }

  convertRawDataToTableData(result: UpdateLitigationNoticeDto[]) {
    this.litigationNoticeDtoGroupNoList = [];
    this.isOpenedList = [];
    /* filter out */
    result = result?.filter(dto => {
      if (!dto?.relation) return false;
      return this.relationFilter.includes(dto.relation);
    });

    /* group by groupNo -> noticeType -> personId */
    const uniqueGroupNos = [...new Set(result.map(item => `${item.groupNo ?? '-1'}`))];
    for (const groupNo of uniqueGroupNos) {
      if (groupNo === '-1') continue;

      const filteredGroupNoResult = result?.filter(dto => dto.groupNo?.toString() === groupNo);
      let groupData: IGroupByNoticeType = {
        groupNo: groupNo,
        deliveryDateTime: filteredGroupNoResult[0]?.deliveryDateTime ?? '',
        news: [],
        letter: [],
      };
      const uniqueNoticeTypes = [
        ...new Set([LitigationNoticeDto.NoticeTypeEnum.News, LitigationNoticeDto.NoticeTypeEnum.Letter]),
      ];

      for (const uniqueNoticeType of uniqueNoticeTypes) {
        const filteredNoticeTypeResult = filteredGroupNoResult?.filter(
          dto => dto.noticeType?.toString() === uniqueNoticeType
        );

        const uniquePersonIdAndTemplateNos = [
          ...new Set(result.map(item => `${item.personId}_${item.noticeTemplateNo ?? ''}`)),
        ];

        for (const uniquePersonIdAndTemplateNo of uniquePersonIdAndTemplateNos) {
          const filteredPersonIdAndTemplateNoResult = filteredNoticeTypeResult?.filter(
            dto =>
              `${dto.personId?.toString()}_${dto.noticeTemplateNo?.toString() ?? ''}` === uniquePersonIdAndTemplateNo &&
              dto.updateFlag !== NoticeLetterDto.UpdateFlagEnum.D
          );

          if (filteredPersonIdAndTemplateNoResult.length > 0) {
            const personId = filteredPersonIdAndTemplateNoResult[0]?.personId?.toString() ?? '';
            const groupByPersonData: IGroupByPersonId = {
              personId,
              litigationNoticeDtos: filteredPersonIdAndTemplateNoResult,
              relation: filteredPersonIdAndTemplateNoResult[0]?.relation,
              noticeTemplateNo: filteredPersonIdAndTemplateNoResult[0]?.noticeTemplateNo ?? '',
            };

            const foundedRelationEnum = this.relationFilter.find(x => x === groupByPersonData.relation);
            if (foundedRelationEnum && this.lookingForDeathCases.includes(foundedRelationEnum)) {
              /*
              • กรณีที่ 2 : บุคคลเสียชีวิต โดยมีการเพิ่มทายาทเข้ามาใน Litigation detail แล้ว
              - Response ที่จะได้จาก API จะมีเฉพาะบุคคลที่เป็นทายาท
              (LitigationNoticeDto.relation เป็น MAIN_BORROWER_HEIR,
              CO_BORROWER_HEIR หรือ GUARANTOR_HEIR)
              - เอาค่า LitigationNoticeDto.personId ของทายาทนั้นไป look up หา PersonDto
              ใน LitigationDetailDto.personInfo.persons และ
              LitigationDetailDto.personInfo.additionalPersons เพื่อหาตัวทายาท
              - ถ้าพบ นำค่า PersonDto.referencePersonId ไป look up PersonDto ใน ใน
              LitigationDetailDto.personInfo.persons และ
              LitigationDetailDto.personInfo.additionalPersons อีกครั้งเพื่อหาตัวบุคคลที่เสีย
              ชีวิต
              - ถ้าพบ แสดง PersonDto.name, PersonDto.relation, PersonDto.personStatus
              เป็น line ที่อยู่เหนือชื่อของทายาทนั้น ตาม design
              */
              const foundedPerson = [
                ...(this.lawsuitService.currentLitigation?.personInfo?.persons ?? []),
                ...(this.lawsuitService.currentLitigation?.personInfo?.additionalPersons ?? []),
              ].find(dto => dto.personId === personId);
              if (foundedPerson) {
                const deadPerson = [
                  ...(this.lawsuitService.currentLitigation?.personInfo?.persons ?? []),
                  ...(this.lawsuitService.currentLitigation?.personInfo?.additionalPersons ?? []),
                ].find(dto => dto.personId === foundedPerson.referencePersonId);

                if (deadPerson) groupByPersonData.referencePerson = deadPerson;
              }
            }

            if (uniqueNoticeType === 'NEWS') {
              groupData.news?.push(groupByPersonData);
            } else if (uniqueNoticeType === 'LETTER') {
              groupData.letter?.push(groupByPersonData);
            }
          }
        }
      }

      this.litigationNoticeDtoGroupNoList.push(groupData);
      this.isOpenedList.push(true);
    }

    // ส่งค่าไป service ทุกครั้งที่มีการ render view's object ใหม่
    this.initLawsuitNoticeDataForSave();
  }

  async clickUploadConfirmLetter(litigationNoticeDto: LitigationNoticeDto) {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = this.documentService.validateFileType(fileInput.files[index]);
        this.uploadConfirmLetterDocument(litigationNoticeDto, file);
      }
    };
    fileInput.click();
  }

  public async uploadConfirmLetterDocument(litigationNoticeDto: LitigationNoticeDto, file: any) {
    const index = this.findIndexRawDataByNoticeId(litigationNoticeDto?.noticeId ?? -1);

    let res = (await this.documentService.uploadDocument(
      litigationNoticeDto?.primaryCif ?? '',
      litigationNoticeDto?.documentTemplateId ?? '',
      file,
      litigationNoticeDto.litigationId
    )) as DocumentUploadResponse;

    if (!res) {
      this.notificationService.openSnackbarSuccess(` ${this.translate.instant('DOC_PREP.UPLOAD_FAIL')}`);
      return;
    }

    this.lawsuitService.hasEdit = true;

    const newLitigationNoticeDto = {
      ...litigationNoticeDto,
      postalImageId: res.uploadSessionId,
    };

    const updateLitigationNotice = {
      ...newLitigationNoticeDto,
      updateFlag: NoticeLetterDto.UpdateFlagEnum.U,
    };

    this.addOrUpdateDraftOnScreen(newLitigationNoticeDto, updateLitigationNotice, index);

    this.notificationService.openSnackbarSuccess(` ${this.translate.instant('DOC_PREP.UPLOAD_SUCCESS')}`);
  }

  async onClickUploadLetter(litigationNoticeDto: LitigationNoticeDto) {
    const myContext = {
      litigationNoticeDto,
    };

    const index = this.findIndexRawDataByNoticeId(litigationNoticeDto?.noticeId ?? -1);
    if (index < 0) return;

    const dialogSetting: DialogOptions = {
      component: UploadNotiComponent,
      title: 'LAWSUIT.NOTICE.LETTER_DIALOG_SAVE_WITH_SIGNED',
      iconName: 'icon-Mail-Edit',
      rightButtonLabel: 'LAWSUIT.NOTICE.LETTER_SAVE',
      buttonIconName: 'icon-save-primary',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: myContext,
    };

    const res = await this.notificationService.showCustomDialog(dialogSetting);

    if (!(res?.noticeDuration && res?.noticeDate && res?.noticeStatus && res?.updateFlag && res?.uploadSessionId)) return;
    this.notificationService.openSnackbarSuccess(`${this.translate.instant('LAWSUIT.NOTICE.LETTER_UPLOAD_SUCCUSS')}`);

    this.lawsuitService.hasEdit = true;

    const newLitigationNoticeDto = {
      ...litigationNoticeDto,
      noticeDuration: res.noticeDuration,
      noticeDate: res.noticeDate,
      noticeStatus: res.noticeStatus,
      noticeImageId: res.uploadSessionId,
    };

    const updateLitigationNotice = {
      ...newLitigationNoticeDto,
      updateFlag: res.updateFlag,
    };

    this.addOrUpdateDraftOnScreen(newLitigationNoticeDto, updateLitigationNotice, index);
  }

  getLetterTooltipText(text: string) {
    const tdrInfo: Array<ITooltip> = [{ title: this.translate.instant('LAWSUIT.NOTICE.WARNING'), content: text }];
    return tdrInfo;
  }

  async onClickDownloadDocNews(element: LitigationNoticeDto) {
    await this.onClickDownloadDoc(element);
  }

  async onClickDownloadDoc(element: LitigationNoticeDto, isDownloadCofirmLetterDoc: boolean = false) {
    /*2. เมื่อ click , call API [Document controller] get Document (/v1/document/view/
    {imageSource}/{imageId}) โดยระบุค่าใน request
    • imageId: uploadSessionId ของรายการ LitigationNoticeDto ที่เลือก
    • imageSource: (* What is the value to be used ? ‘LEXS’ ?) */

    const dataSource = element.noticeImageSource || DocumentDto.ImageSourceEnum.Lexs;
    const res: any = await this.documentService.getDocument(
      !isDownloadCofirmLetterDoc || LETTER_TRACKING_STATUS_TEXTS.failed === element?.trackingStatusName
        ? (element?.noticeImageId ?? '')
        : (element?.postalImageId ?? ''),
      dataSource
    );

    if (!res) return;

    const fileName = isDownloadCofirmLetterDoc ? 'ยืนยันบอกกล่าวทวงถาม' : 'บอกกล่าวทวงถาม';
    this.documentService.downloadDocument(res, `${fileName}.${res?.type.split('/')[1]}`);
  }

  private findIndexRawDataByNoticeId(noticeId: number) {
    return this.updateLitigationNoticeDtoList.findIndex(dto => dto.noticeId === noticeId);
  }

  async clickNoticeTracking(litigationNoticeDto: LitigationNoticeDto) {
    const item: TrackingRequestItem = {
      barcode: litigationNoticeDto.barcode,
      litigationId: litigationNoticeDto.litigationId,
      noticeId: litigationNoticeDto.noticeId,
    };
    const req: TrackingRequest = {
      items: [item],
    };
    await this.lawsuitService.updateTracking(req);
  }

  async onClickDeleteLetter(litigationNoticeDto: LitigationNoticeDto) {
    /* 1. แสดงเมื่อ LitigationNoticeDto.addressType = ‘CONTRACT’ */
    const index = this.findIndexRawDataByNoticeId(litigationNoticeDto?.noticeId ?? -1);

    /*
    • Keep updated data model in FE until user press ‘บันทึกร่าง’ or ‘เสร็จสิ้น’ (to call
      API update Litigation notice (/v1/notice/updateNotice)
    • Display toast success message as per design
    */
    if (index === -1) return;
    this.updateLitigationNoticeDtoList[index].updateFlag = NoticeLetterDto.UpdateFlagEnum.D;
    this.updateLitigationNoticeDtoList[index].actionFlag = false;
    this.lawsuitService.hasEdit = true;

    /* Display toast success message as per design */
    this.notificationService.openSnackbarSuccess(`${this.translate.instant('LAWSUIT.NOTICE.LETTER_DELETED')}`);

    this.convertRawDataToTableData([...this.updateLitigationNoticeDtoList]);
  }

  async onClickAddLetter(litigationNoticeDto: LitigationNoticeDto) {
    /*
    ปุ่ม เพิ่มหนังสือบอกกล่าว
    1. เมื่อกด
    */
    const createAddressRequest: CreateAddressRequest = {
      addressType: CreateAddressRequest.AddressTypeEnum.Contract,
      personId: litigationNoticeDto.personId,
    };

    const res: LitigationNoticeDto = await this.lawsuitService.createAddress(
      litigationNoticeDto.litigationId ?? '-1',
      createAddressRequest
    );
    /*
    • Keep updated data model in FE until user press ‘บันทึกร่าง’ or ‘เสร็จสิ้น’ (to call
      API update Litigation notice (/v1/notice/updateNotice)
    • Display toast success message as per design
    */
    if (!res) return;

    const updateRes: UpdateLitigationNoticeDto = {
      ...res,
      updateFlag: NoticeLetterDto.UpdateFlagEnum.A,
    };
    this.lawsuitService.hasEdit = true;

    /* Display toast success message as per design */
    this.notificationService.openSnackbarSuccess(`${this.translate.instant('LAWSUIT.NOTICE.LETTER_ADDED')}`);

    this.addOrUpdateDraftOnScreen(res, updateRes, -2);
  }

  addOrUpdateDraftOnScreen(
    litigationNoticeDto: LitigationNoticeDto,
    updateLitigationNoticeDto: UpdateLitigationNoticeDto,
    index: number = -1
  ) {
    if (index === -1) {
      this.updateLitigationNoticeDtoList = [updateLitigationNoticeDto, ...this.updateLitigationNoticeDtoList];
    } else if (index === -2) {
      this.updateLitigationNoticeDtoList = [...this.updateLitigationNoticeDtoList, updateLitigationNoticeDto];
    } else {
      this.updateLitigationNoticeDtoList[index] = { ...updateLitigationNoticeDto };
    }
    this.convertRawDataToTableData([...this.updateLitigationNoticeDtoList]);
  }

  async onConfirmBankrupt(litigationNoticeDto: LitigationNoticeDto) {
    const createAddressRequest: CreateAddressRequest = {
      addressType: CreateAddressRequest.AddressTypeEnum.Receivership,
      personId: litigationNoticeDto.personId,
    };

    const res: LitigationNoticeDto = await this.lawsuitService.createAddress(
      litigationNoticeDto.litigationId ?? '-1',
      createAddressRequest
    );

    if (!res) return;

    const updateRes: UpdateLitigationNoticeDto = {
      ...res,
      updateFlag: NoticeLetterDto.UpdateFlagEnum.A,
    };
    this.lawsuitService.hasEdit = true;

    this.notificationService.openSnackbarSuccess(
      `${this.translate.instant('LAWSUIT.NOTICE.MAIN_BORROWER_BANKRUPT_ADDED')}`
    );

    const index = this.findIndexRawDataByNoticeId(litigationNoticeDto.noticeId ?? -1);
    if (index === -1) return;
    this.updateLitigationNoticeDtoList.splice(index + 1, 0, updateRes);
    this.convertRawDataToTableData([...this.updateLitigationNoticeDtoList]);
  }

  async onCancelBankrupt(litigationNoticeDto: LitigationNoticeDto) {
    /*
    • If confirm, find LitigationNoticeDto which has
    • litigationId = litigationId of current Litigation
    • personId = personId of current focused Person
    • addressType = ‘RECEIVERSHIP’
    • If found then set updateFlag = ‘D’
    • Keep updated data model in FE until user press ‘บันทึก’
    */
    const index = this.findIndexRawDataByNoticeId(litigationNoticeDto.noticeId ?? -1);
    if (index === -1) return;

    this.updateLitigationNoticeDtoList[index].updateFlag = NoticeLetterDto.UpdateFlagEnum.D;
    this.lawsuitService.hasEdit = true;

    this.notificationService.openSnackbarSuccess(
      `${this.translate.instant('LAWSUIT.NOTICE.MAIN_BORROWER_BANKRUPT_CANCELED')}`
    );

    this.convertRawDataToTableData([...this.updateLitigationNoticeDtoList]);
  }

  async onClickDownloadLetter(element: LitigationNoticeDto) {
    /*
    2. เมื่อกด จะ call API [Notice Controller] Generate Notice Letter by Id (/v1/notice/{noticeId}/download)
    โดยส่ง noticeId ของรายการที่กดเป็น request parameter
    3. Wait for response and handle for let user download the file
    */
    if(element.noticeDate === null || element.noticeDate === undefined){
      element.noticeDate = Utils.getCurrentDate()
    }
    const res = await this.lawsuitService.downloadNoticeLetter(element.noticeId ?? -1);

    if (!res) return;
    /*3. Wait for response and handle for let user download the file*/
    Utils.saveAsStrToBlobFile(res, 'NOTICE_DOC' || 'excel' + FileType.DOC_SHEET, BlobType.DOC_SHEET);

    if (element.noticeStatus !== NoticeLetterDto.NoticeStatusEnum.DraftNotice) return;

    const index = this.findIndexRawDataByNoticeId(element.noticeId ?? -1);
    if (index === -1) return;
    this.updateLitigationNoticeDtoList[index].noticeStatus = NoticeLetterDto.NoticeStatusEnum.Downloaded;
    this.updateLitigationNoticeDtoList[index].updateFlag = NoticeLetterDto.UpdateFlagEnum.U;
    this.lawsuitService.hasEdit = true;

    this.convertRawDataToTableData([...this.updateLitigationNoticeDtoList]);
  }

  async onClickDownloadNews(element: LitigationNoticeDto) {
    await this.onClickDownloadLetter(element);
  }

  async onClickUploadNews(litigationNoticeDto: LitigationNoticeDto) {
    const myContext = {
      litigationNoticeDto,
    };

    const index = this.findIndexRawDataByNoticeId(litigationNoticeDto?.noticeId ?? -1);
    if (index === -1) return;

    const dialogSetting: DialogOptions = {
      component: UploadNewspaperComponent,
      title: 'LAWSUIT.NOTICE.NEWS_SAVE_TITLE',
      iconName: 'icon-Date',
      rightButtonLabel: 'LAWSUIT.NOTICE.NEWS_SAVE_BT',
      buttonIconName: 'icon-save-primary',
      leftButtonLabel: 'COMMON.BUTTON_CANCEL',
      context: myContext,
    };
    const res = await this.notificationService.showCustomDialog(dialogSetting);

    if (
      !(
        res.noticeDate &&
        res.firstNoticeDate &&
        res.lastNoticeDate &&
        res.noticeDueDate &&
        res.noticeStatus &&
        res.updateFlag &&
        res.uploadSessionId
      )
    )
      return;

    this.notificationService.openSnackbarSuccess(`${this.translate.instant('LAWSUIT.NOTICE.NEWS_UPLOAD_SUCCUSS')}`);
    this.lawsuitService.hasEdit = true;

    const newLitigationNoticeDto = {
      ...litigationNoticeDto,
      noticeDate: res.noticeDate,
      firstNoticeDate: res.firstNoticeDate,
      lastNoticeDate: res.lastNoticeDate,
      noticeDueDate: res.noticeDueDate,
      noticeStatus: res.noticeStatus,
      noticeImageId: res.uploadSessionId,
    };

    const updateLitigationNoticeDto = {
      ...newLitigationNoticeDto,
      updateFlag: NoticeLetterDto.UpdateFlagEnum.U,
    };

    this.addOrUpdateDraftOnScreen(newLitigationNoticeDto, updateLitigationNoticeDto, index);
  }
}
