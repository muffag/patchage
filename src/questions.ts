import { QuestionType } from './question-type';
import { Separator, Question } from 'inquirer';
import { PatchMeta } from './types';

export const getQuestions = (metas: PatchMeta[]): Question[] => [
  {
    name: QuestionType.PATH,
    message: 'Please enter your directory (empty for current directory)'
  },
  {
    name: QuestionType.PATCHTYPE,
    type: 'list',
    message: 'Which patch do you want to apply?',
    choices: ['All', new Separator(), ...metas.map(x => x.name)],
    filter: function(val) {
      return val.toLowerCase();
    }
  }
];
