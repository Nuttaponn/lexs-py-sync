import { LexsUserDto } from '@lexs/lexs-client';

export interface UserInformation {
  content: Array<LexsUserDto>;
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: IPageable;
  size: number;
  sort: ISort;
  totalElements: number;
  totalPages: number;
}

interface ISort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface IPageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: ISort;
  unpaged: boolean;
}

export interface InquiryUsersRequest {
  filterKeyword: string;
  dataScope: string;
  role: string;
  subRole: string;
  page: number;
  size: number;
}
