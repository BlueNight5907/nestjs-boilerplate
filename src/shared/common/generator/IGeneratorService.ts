export interface IGeneratorService {
  uuid(): string;
  fileName(extension: string): string;
}
