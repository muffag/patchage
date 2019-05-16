import 'colors';
import { prompt } from 'inquirer';
import { getAllMetas } from './patch';
import { QuestionType } from './question-type';
import { exec } from 'child_process';

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

  console.log(
    `📦 Applying ${chosenPatches.length > 1 ? 'patches' : 'patch'}: ` +
      chosenPatches.map(answer => answer.cyan).join(', ')
  );

  console.log('📦 Running command: ' + 'npm install --save'.bgYellow.black);

  const child = exec('npm install --save', { cwd: targetPath });
  child.stdout!.pipe(process.stdout);
  child.stderr!.pipe(process.stderr);
};

run();
