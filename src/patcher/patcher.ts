import { execSync } from 'child_process';
import { copy, mkdirp, readFile, stat, writeFile } from 'fs-extra';
import { merge } from 'lodash';
import { dirname, join } from 'path';
import { ExecTiming, IPatch } from '../scanner/scanner.interface';
import { mergePackageJson } from './merge_package_json';

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
