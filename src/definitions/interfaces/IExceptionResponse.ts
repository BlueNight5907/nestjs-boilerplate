export interface IExceptionResponse {
  code: string;
  message: string;
  errors?: unknown[];
  timestamp: Date;
  url: string;
  path: string;
  type: string;
  id: string;
  method: string;
  args?: Record<string, unknown>;
}
