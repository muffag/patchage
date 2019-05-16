import 'colors';
import { prompt } from 'inquirer';
import { getAllMetas } from './patch';
import { QuestionType } from './question-type';
import { execSync } from 'child_process';
import { log } from './logger';

const run = async () => {
  const patches = await getAllMetas();

  const answers: {
    [QuestionType.Target]: string;
    [QuestionType.Patches]: string[];
  } = await prompt([
    {
      name: QuestionType.Target,
      message: 'Enter target directory',
      default: process.cwd()
    },
    <any>{
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
    }
  ]);

  const targetPath = answers[QuestionType.Target];
  const chosenPatches = answers[QuestionType.Patches];

  log(
    `Applying ${chosenPatches.length > 1 ? 'patches' : 'patch'}: ` +
      chosenPatches.map(answer => answer.cyan).join(', ')
  );

  log('Running command: ' + 'npm install --save'.bgYellow.black);

  execSync('npm install --save', {
    stdio: [0, 1, 2],
    cwd: targetPath
  });

  log('Complete!');
};

run();
