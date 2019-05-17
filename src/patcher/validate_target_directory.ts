import { join } from 'path';
import { exists } from '../utils/exists';

export async function validateTargetDirectory(
  directory: string
): Promise<boolean> {
  return exists(join(directory, 'package.json'));
}
