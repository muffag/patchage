import { stat } from 'fs-extra';
import { join } from 'path';

export async function validateTargetDirectory(
  directory: string
): Promise<boolean> {
  try {
    const stats = await stat(join(directory, 'package.json'));
    return true;
  } catch (error) {
    return false;
  }
}
