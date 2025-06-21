export type HttpException = {
  error: string;
  message: string | string[];
  statusCode: number;
};

export type MetaPagination = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};
