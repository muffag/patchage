import { readdir, readFile } from 'fs-extra';
import { join } from 'path';
import { IPatch } from './scanner.interface';

export async function scanPatches(patchDirectory: string) {
  const subdirectoryNames = await readdir(patchDirectory);
  return Promise.all(
    subdirectoryNames.map(directoryName =>
      readManifest(join(patchDirectory, directoryName))
    )
  );
}

async function readManifest(directory: string): Promise<IPatch> {
  const manifestRaw = await readFile(join(directory, 'manifest.json'));
  const manifest = JSON.parse(manifestRaw.toString());
  manifest.directory = directory;
  return manifest;
}
