import { prompt } from 'inquirer';

prompt([
  {
    name: 'path',
    message: 'Please enter your directory (empty for current directory)'
  }
]).then(answers => {
  console.log(answers);
});
