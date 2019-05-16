import { IPatch } from '../scanner/scanner.interface';
import { readFile, writeFile } from 'fs-extra';
import { join } from 'path';

/**
 * Used to apply a given IPatch to a target directory.
 */
export async function applyPatch(patch: IPatch, targetDirectory: string) {
  await mergePackageJson(
    join(targetDirectory, 'package.json'),
    join(patch.directory, 'package.json')
  );
}

/**
 * Patches a package.json file at `sourcePath` with the file at `targetPath`.
 * @param sourcePath Original package.json path
 * @param targetPath Patch package.json
 */
async function mergePackageJson(sourcePath: string, targetPath: string) {
  // Read and parse both JSON files into objects
  const [sourcePackageJson, targetPackageJson] = await Promise.all([
    readFile(sourcePath),
    readFile(targetPath)
  ]);
  const parsedSource = JSON.parse(sourcePackageJson.toString());
  const parsedTarget = JSON.parse(targetPackageJson.toString());

  // Assigned the target to the source
  const merged = Object.assign(parsedSource, parsedTarget);

  // Stringify merged object and write to source path
  await writeFile(sourcePath, JSON.stringify(merged, null, 2));
}
