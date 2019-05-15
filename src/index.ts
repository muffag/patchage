import { prompt } from 'inquirer';
import { getAllMetas } from './patch';
import { getQuestions } from './questions';

const start = async () => {
  const metas = await getAllMetas();
  const answers = await prompt(getQuestions(metas));

  console.log(answers);
};

start();
