import { readFile, writeFile } from 'fs-extra';
import { merge } from 'lodash';

/**
 * Patches a package.json file at `sourcePath` with the file at `targetPath`.
 * @param sourcePath Original package.json path
 * @param targetPath Patch package.json
 */
export async function mergePackageJson(sourcePath: string, targetPath: string) {
  // Read and parse both JSON files into objects
  const [sourcePackageJson, targetPackageJson] = await Promise.all([
    readFile(sourcePath),
    readFile(targetPath),
  ]);
  const parsedSource = JSON.parse(sourcePackageJson.toString());
  const parsedTarget = JSON.parse(targetPackageJson.toString());

  // Merge source and target objects
  const merged = sortDependencies(merge(parsedSource, parsedTarget));

  // Stringify merged object and write to source path
  await writeFile(sourcePath, JSON.stringify(merged, null, 2));
}

export function sortDependencies(packageJson: {
  devDependencies?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  [key: string]: any;
}): object {
  const devDependenciesClone = packageJson.devDependencies
    ? sortKeysOfObject(packageJson.devDependencies)
    : null;

  const dependenciesClone = packageJson.dependencies
    ? sortKeysOfObject(packageJson.dependencies)
    : null;

  return {
    ...packageJson,
    dependencies: dependenciesClone || packageJson.dependencies,
    devDependencies: devDependenciesClone || packageJson.devDependencies,
  };
}

/**
 * Clone an object and sort its keys alphabetically.
 */
function sortKeysOfObject(obj: { [key: string]: any }) {
  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((prev, key) => ({ ...prev, [key]: obj[key] }), {});
}
