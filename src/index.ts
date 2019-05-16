import 'colors';
import { prompt } from 'inquirer';
import { getAllMetas } from './patch';
import { QuestionType } from './question-type';
import { exec } from 'child_process';

const start = async () => {
  const patches = await getAllMetas();

  const answers: {
    [QuestionType.PATH]: string;
    [QuestionType.PATCHTYPE]: string[];
  } = await prompt([
    {
      name: QuestionType.PATH,
      message: 'Enter target directory',
      default: process.cwd()
    },
    <any>{
      name: QuestionType.PATCHTYPE,
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

  const chosenPatches = answers[QuestionType.PATCHTYPE];

  console.log(
    `📦 Applying ${chosenPatches.length > 1 ? 'patches' : 'patch'}: ` +
      chosenPatches.map(answer => answer.cyan).join(', ')
  );

  console.log('📦 Running command: ' + 'npm install -s'.bgYellow.black);

  const child = exec('npm install -s');
  child.stdout!.pipe(process.stdout);
  child.stderr!.pipe(process.stderr);
};

start();
