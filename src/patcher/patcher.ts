import { IPatch } from '../scanner/scanner.interface';
import { readFile, writeFile } from 'fs-extra';
import { join } from 'path';

export async function applyPatch(patch: IPatch, targetDirectory: string) {
  await mergePackageJson(
    join(targetDirectory, 'package.json'),
    join(patch.directory, 'package.json')
  );
}

async function mergePackageJson(sourcePath: string, targetPath: string) {
  const [sourcePackageJson, targetPackageJson] = await Promise.all([
    readFile(sourcePath),
    readFile(targetPath)
  ]);

  const parsedSource = JSON.parse(sourcePackageJson.toString());
  const parsedTarget = JSON.parse(targetPackageJson.toString());

  const merged = Object.assign(parsedSource, parsedTarget);

  await writeFile(sourcePath, JSON.stringify(merged, null, 2));
}
