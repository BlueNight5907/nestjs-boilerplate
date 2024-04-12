export interface IDeleteAction {
  delete(...keys: string[]): Promise<void>;
}
