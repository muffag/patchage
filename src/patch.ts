import { exists, readdir, readFile } from 'fs-extra';
import { join, resolve } from 'path';
import { IPatchManifest, IPatchMeta } from './types';

const basePath = resolve(join(__dirname, '../patches'));

export const getAllMetas = (): Promise<IPatchMeta[]> => {
  return new Promise<IPatchMeta[]>(async res => {
    const dirNames = await readdir(basePath);
    const metas = await Promise.all(dirNames.map(dirName => getMeta(dirName)));
    res(metas.filter(x => x !== null).map(x => x!));
  });
};

export const getMeta = (patchName: string): Promise<IPatchMeta | null> => {
  return new Promise(async res => {
    const manifest = await getManifest(patchName);

    if (!manifest) {
      res(null);
      return;
    }

    const pathPatch = join(basePath, patchName);
    const files = await readdir(pathPatch);
    const meta = {
      ...manifest,
      files
    };

    res(meta);
  });
};

export const getManifest = (
  patchName: string
): Promise<IPatchManifest | null> => {
  return new Promise(async res => {
    const path = join(basePath, patchName, 'manifest.json');
    exists(path, async exists => {
      if (!exists) {
        res(null);
        return;
      }

      const fileBuffer = await readFile(path);
      res(JSON.parse(fileBuffer.toString()) as IPatchManifest);
    });
  });
};
