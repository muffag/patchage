import { join } from 'path';
import { exists } from '../utils/exists';

// TODO: Check for version control other than git
export async function ensureVersionControl(directory: string) {
  return exists(join(directory, '.git'));
}
