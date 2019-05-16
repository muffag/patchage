import { execSync } from 'child_process';
import 'colors';
import { prompt } from 'inquirer';
import { join } from 'path';
import { log } from './logger';
import { applyPatch } from './patcher/patcher';
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
      default: process.cwd()
    },
    {
      name: QuestionType.Patches,
      type: 'checkbox',
      message: 'Select patches to apply',
      choices: patches.map(patch => ({
        name: patch.name + ' ' + patch.description.grey,
        checked: false
      })),
      filter: (values: string[]) => {
        // Remove description from answer
        return values.map(value => value.replace(/\s.+$/, ''));
      }
    } as any
  ]);

  const targetPath = answers[QuestionType.Target];
  const chosenPatches = answers[QuestionType.Patches].map(patchName => {
    return patches.find(p => p.name === patchName)!;
  });

  log(
    `Applying ${chosenPatches.length > 1 ? 'patches' : 'patch'}: ` +
      chosenPatches.map(answer => answer.name.cyan).join(', ')
  );

  for (const patch of chosenPatches) {
    await applyPatch(patch, targetPath);
  }

  log('Running command: ' + 'npm install'.bgYellow.black);

  execSync('npm install', {
    stdio: [0, 1, 2],
    cwd: targetPath
  });

  log('Complete!');
};

run();
