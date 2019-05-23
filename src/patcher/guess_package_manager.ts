import { join } from 'path';
import { exists } from '../utils/exists';

export enum PackageManagerGuess {
  Unknown,
  Npm,
  Yarn,
}

export async function guessPackageManager(
  directory: string
): Promise<PackageManagerGuess> {
  const [npm, yarn] = await Promise.all([
    exists(join(directory, 'package-lock.json')),
    exists(join(directory, 'yarn.lock')),
  ]);

  if (npm && yarn) {
    // if both exist
    return PackageManagerGuess.Unknown;
  } else if (npm) {
    // if only package-lock.json exists
    return PackageManagerGuess.Npm;
  } else if (yarn) {
    // if only yarn.lock exists
    return PackageManagerGuess.Yarn;
  }

  // if none exist
  return PackageManagerGuess.Unknown;
}
