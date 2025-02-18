import { CourtResultDto } from '@lexs/lexs-client';

export interface DisplayCourtResult extends CourtResultDto {
  showDispute?: boolean;
  notDecree?: boolean;
}

export interface LitigationCaseDownloadMap {
  [key: number]: number;
}
