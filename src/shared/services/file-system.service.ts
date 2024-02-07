import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import nodePath from 'node:path';

import { Injectable } from '@nestjs/common';
import { BaseError } from 'common/BaseError';
import { FileSystem } from 'enums';
import {
  type IDirectoryStat,
  type IFileStat,
  type IFileSystemService,
  type IFileSystemStat,
  type IFileTransformer,
} from 'shared/interfaces';

import {
  FileNotFoundException,
  GetFileSystemStatException,
} from '../../exceptions/file';

@Injectable()
export class FileSystemService implements IFileSystemService {
  async readFile<T>(path: string, transformer: IFileTransformer<T>) {
    try {
      const fileBuffer = await fs.readFile(path);

      return transformer.transform(fileBuffer, path);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      console.info(error);

      throw new FileNotFoundException(path);
    }
  }

  async saveFile(
    path: string,
    content: Buffer | string | Uint8Array,
  ): Promise<void> {
    try {
      await fs.writeFile(path, content);
    } catch (error) {
      console.info(error);

      throw error;
    }
  }

  async rename(currentPath: string, newPath: string): Promise<void> {
    try {
      await fs.rename(currentPath, newPath);
    } catch (error) {
      console.info(error);

      throw error;
    }
  }

  async move(path: string, destination: string): Promise<void> {
    try {
      await fs.rename(path, destination);
    } catch (error) {
      console.info(error);

      throw error;
    }
  }

  async copy(
    path: string,
    destination: string,
    options: { replace?: boolean; recursive?: boolean } = {},
  ): Promise<void> {
    try {
      await fs.cp(path, destination, {
        recursive: options.recursive,
        errorOnExist: !options.replace,
        force: options.replace,
      });
    } catch (error) {
      console.info(error);

      throw error;
    }
  }

  async delete(path: string): Promise<void> {
    try {
      await fs.unlink(path);
    } catch (error) {
      console.info(error);

      throw error;
    }
  }

  async createDirectory(
    path: string,
    options: { recursive?: boolean } = {},
  ): Promise<void> {
    try {
      await fs.mkdir(path, { recursive: options.recursive });
    } catch (error) {
      console.info(error);

      throw error;
    }
  }

  exist(path: string): boolean {
    return fsSync.existsSync(path);
  }

  async stat(path: string): Promise<IFileSystemStat> {
    try {
      const stat = await fs.stat(path, { bigint: true });

      if (stat.isFile()) {
        return {
          size: stat.size,
          createdAt: stat.birthtime,
          type: FileSystem.FILE,
          name: path.split('/').at(-1),
          modifiedAt: stat.mtime,
          path,
          fileExtension: nodePath.extname(path),
        } as IFileStat;
      }

      if (stat.isDirectory()) {
        const dirStat = {
          size: stat.size,
          createdAt: stat.birthtime,
          type: FileSystem.DIRECTORY,
          name: path.split('/').at(-1),
          modifiedAt: stat.mtime,
          path,
          children: [],
        } as IDirectoryStat;

        const fileEntities = await fs.readdir(path, { withFileTypes: true });
        dirStat.children = await Promise.all(
          fileEntities.map((item) => this.stat.call(this, item.path)),
        );

        return dirStat;
      }

      throw new Error('Get file system stat failed');
    } catch (error) {
      console.info(error);

      throw new GetFileSystemStatException(path);
    }
  }
}
