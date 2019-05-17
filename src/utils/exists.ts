import { stat } from 'fs-extra';

/**
 * Checks if a file or directory exists.
 * @param path file or directory to check
 */
export async function exists(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return true;
  } catch (error) {
    return false;
  }
}
