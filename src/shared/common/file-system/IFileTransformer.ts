export interface IFileTransformer<T> {
  transform(fileBuffer: Buffer, path?: string): T;
}
