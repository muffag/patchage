import { execSync } from 'child_process';
import { copy, mkdirp, readFile, stat, writeFile } from 'fs-extra';
import { merge } from 'lodash';
import { dirname, join } from 'path';
import { ExecTiming, IPatch } from '../scanner/scanner.interface';

/**
 * Used to apply a given IPatch to a target directory.
 */
export async function applyPatch(patch: IPatch, targetDirectory: string) {
  await copyFiles(patch, targetDirectory);

  await mergePackageJson(
    join(targetDirectory, 'package.json'),
    join(patch.directory, 'package.json')
  );

  executeScripts(patch, targetDirectory, 'preinstall');
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
    readFile(targetPath),
  ]);
  const parsedSource = JSON.parse(sourcePackageJson.toString());
  const parsedTarget = JSON.parse(targetPackageJson.toString());

  // Merge source and target objects
  const merged = merge(parsedSource, parsedTarget);

  // Stringify merged object and write to source path
  await writeFile(sourcePath, JSON.stringify(merged, null, 2));
}

async function copyFiles(patch: IPatch, targetDirectory: string) {
  if (!patch.files) {
    return;
  }

  for (const entry of patch.files) {
    const sourcePath = join(patch.directory, entry.source);
    const targetPath = join(targetDirectory, entry.destination);

    await mkdirp(dirname(targetPath));
    await copy(sourcePath, targetPath);
  }
}

export async function executeScripts(
  patch: IPatch,
  targetDirectory: string,
  execTiming: ExecTiming
) {
  if (!patch.scripts) {
    return;
  }

  const filteredScripts = patch.scripts.filter(
    script => script.exec === execTiming
  );

  for (const entry of filteredScripts) {
    execSync('bash ' + join(patch.directory, entry.script), {
      cwd: targetDirectory,
    });
  }
}
