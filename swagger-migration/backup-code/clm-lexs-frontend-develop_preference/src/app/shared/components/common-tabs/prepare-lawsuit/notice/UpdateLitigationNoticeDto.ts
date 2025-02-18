import { LitigationNoticeDto, NoticeLetterDto } from '@lexs/lexs-client';

export interface UpdateLitigationNoticeDto extends LitigationNoticeDto {
  updateFlag?: NoticeLetterDto.UpdateFlagEnum;
}
