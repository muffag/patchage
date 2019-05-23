import { execSync } from 'child_process';
import 'colors';
import { prompt } from 'inquirer';
import { join } from 'path';
import { log } from './logger';
import { ensureVersionControl } from './patcher/ensure_version_control';
import { getInstallCommandForPackageManager } from './patcher/get_install_command_for_package_manager';
import {
  guessPackageManager,
  PackageManagerGuess,
} from './patcher/guess_package_manager';
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

  /**
   * Ensure that there is version control present in the `targetPath`. If there
   * is not, make the user confirm the action.
   */
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
   * Determine package manager. If the guess (based on `package-lock.json` and
   * `yarn.lock` files) fails we ask the user which package manager they prefer.
   */
  const packageManagerGuess = await guessPackageManager(targetPath);
  let installCommand =
    packageManagerGuess === PackageManagerGuess.Npm
      ? getInstallCommandForPackageManager('npm')
      : packageManagerGuess === PackageManagerGuess.Yarn
      ? getInstallCommandForPackageManager('yarn')
      : '';

  if (packageManagerGuess === PackageManagerGuess.Unknown) {
    const result: {
      [QuestionType.ChoosePackageManager]: 'npm' | 'yarn';
    } = await prompt({
      name: QuestionType.ChoosePackageManager,
      message: 'Choose package manager',
      type: 'list',
      choices: ['npm', 'yarn'],
    });
    installCommand = getInstallCommandForPackageManager(
      result[QuestionType.ChoosePackageManager]
    );
  }

  /**
   * Apply all chosen patches.
   */
  log(
    `Applying ${chosenPatches.length > 1 ? 'patches' : 'patch'}: ` +
      chosenPatches.map(answer => answer.name.cyan).join(', ')
  );
  for (const patch of chosenPatches) {
    await applyPatch(patch, targetPath);
  }

  /**
   * Execute install command of preferred package manager.
   */
  log('Running command: ' + installCommand.bgYellow.black);
  execSync(installCommand, {
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
