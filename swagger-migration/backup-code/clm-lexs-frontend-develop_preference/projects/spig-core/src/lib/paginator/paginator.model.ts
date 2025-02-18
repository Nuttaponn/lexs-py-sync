export interface PaginatorResultConfig {
  title?: string;
  fromIndex?: number;
  toIndex?: number;
  fromLabel?: string;
  totalElements?: number; // totalItems?: number;
}

export interface PaginatorActionConfig {
  previousLabel?: string;
  nextLabel?: string;
  totalPages?: number;
  currentPage?: number;
  fromPage?: number;
  toPage?: number;
}
