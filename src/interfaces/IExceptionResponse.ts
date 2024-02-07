export interface IExceptionResponse {
  code: number;
  message: string;
  errors?: unknown[];
  timestamp: Date;
  url: string;
  path: string;
  type: string;
}
