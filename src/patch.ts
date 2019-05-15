import { exists, readdir, readFile } from 'fs-extra';
import { join } from 'path';
import { PatchMeta, PatchManifest } from './types';

const basePath = './example/patches';

export const getAllMetas = (): Promise<PatchMeta[]> => {
  return new Promise<PatchMeta[]>(async res => {
    const dirNames = await readdir(basePath);
    const metas = await Promise.all(dirNames.map(dirName => getMeta(dirName)));
    res(metas.filter(x => x !== null).map(x => x!));
  });
};

export const getMeta = (patchName: string): Promise<PatchMeta | null> => {
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
): Promise<PatchManifest | null> => {
  return new Promise(async res => {
    const path = join(basePath, patchName, 'manifest.json');
    exists(path, async exists => {
      if (!exists) {
        res(null);
        return;
      }

      const fileBuffer = await readFile(path);
      res(JSON.parse(fileBuffer.toString()) as PatchManifest);
    });
  });
};
