export interface Product {
  id: number;
  categoryId: number;
  videoLink?: string;
  affiliateLink?: string;
  voucherLink?: string;
  title: string;
  description: string;
}

export interface Pagination {
  count: number;
  totalPage: number;
}

export interface ProductsResponse {
  _pagination: Pagination;
  data: Product[];
}