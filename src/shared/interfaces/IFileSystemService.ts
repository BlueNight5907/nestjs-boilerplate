import { type FileSystem } from 'enums';

import { type IFileTransformer } from './IFileTransformer';

export interface IFileSystemStat {
  path: string;
  name: string;
  type: FileSystem;
  size?: number | bigint;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IFileStat extends IFileSystemStat {
  fileExtension: string;
}

export interface IDirectoryStat extends IFileSystemStat {
  children: IFileSystemStat[];
}

export interface IFileSystemService {
  readFile<T>(path: string, transformer: IFileTransformer<T>): Promise<T>;
  saveFile(path: string, content: Buffer): Promise<void>;
  rename(currentPath: string, newPath: string): Promise<void>;
  move(path: string, destination: string): Promise<void>;
  copy(
    path: string,
    destination: string,
    options: { replace?: boolean; recursive?: boolean },
  ): Promise<void>;
  delete(path: string): Promise<void>;
  createDirectory(
    path: string,
    options: { recursive?: boolean },
  ): Promise<void>;
  exist(path: string): boolean;
  stat(path: string): Promise<IFileSystemStat>;
}
