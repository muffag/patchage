import { execSync } from 'child_process';
import 'colors';
import { prompt } from 'inquirer';
import { join } from 'path';
import { log } from './logger';
import { ensureVersionControl } from './patcher/ensure_version_control';
import { applyPatch, executeScripts } from './patcher/patcher';
import { validateTargetDirectory } from './patcher/validate_target_directory';
import { QuestionType } from './question-type';
import { scanPatches } from './scanner/scanner';

const run = async () => {
  const patches = await scanPatches(join(__dirname, '../patches'));

  const answers: {
    [QuestionType.Target]: string;
    [QuestionType.Patches]: string[];
  } = await prompt([
    {
      name: QuestionType.Target,
      message: 'Enter target directory',
      default: process.cwd(),
      validate: async (input: string) => {
        const exists = await validateTargetDirectory(input);
        return exists || 'No package.json file found';
      },
    },
    {
      name: QuestionType.Patches,
      type: 'checkbox',
      message: 'Select patches to apply',
      choices: patches.map(patch => ({
        name: patch.name + ' ' + patch.description.grey,
        checked: false,
      })),
      filter: (values: string[]) => {
        // Remove description from answer
        return values.map(value => value.replace(/\s.+$/, ''));
      },
      validate: (values: string[]) => {
        return values.length > 0 || 'Please choose at least one patch';
      },
    } as any,
  ]);

  const targetPath = answers[QuestionType.Target];
  const chosenPatches = answers[QuestionType.Patches].map(patchName => {
    return patches.find(p => p.name === patchName)!;
  });

  if (!(await ensureVersionControl(targetPath))) {
    const confirmation: {
      [QuestionType.ConfirmNoVersionControl]: boolean;
    } = await prompt({
      name: QuestionType.ConfirmNoVersionControl,
      type: 'confirm',
      message: 'No version control in target directory found. Continue?',
    });

    if (!confirmation[QuestionType.ConfirmNoVersionControl]) {
      return log('Goodbye');
    }
  }

  /**
   * Applies all chosen patches
   */
  log(
    `Applying ${chosenPatches.length > 1 ? 'patches' : 'patch'}: ` +
      chosenPatches.map(answer => answer.name.cyan).join(', ')
  );
  for (const patch of chosenPatches) {
    await applyPatch(patch, targetPath);
  }

  log('Running command: ' + 'npm install'.bgYellow.black);

  /**
   * Execute install command of preferred package manager
   */
  execSync('npm install', {
    stdio: [0, 1, 2],
    cwd: targetPath,
  });

  /**
   * Run scripts with `exec` set to `postinstall`. These scripts usually depend
   * on a certain node module being installed.
   */
  log('Running postinstall scripts');
  for (const patch of chosenPatches) {
    await executeScripts(patch, targetPath, 'postinstall');
  }

  log('Complete!');
};

run();
