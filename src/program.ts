import { Command } from 'commander';
import aiResponse from './ai';
import { openFile } from './fileHandler';
const program = new Command();

program
  .name('cli-tool')
  .description('CLI for code utilities')
  .version('0.0.1', '-v, --vers', 'output the current version')
  .option(
    '-m,--model <model-name>',
    'specify the model to use',
    'google/gemma-2-9b-it:free',
  )
  .option('-o,--output <output-file>', 'file to output response')
  .argument('<files...>')
  .action(function (files: string[]) {
    files.forEach((file) => {
      openFile(file).then((data) => {
        if (data) {
          //Send data to chat model
          console.log(data);
        } else {
          console.warn('received empty or unsupported file');
        }
      });
    });
  });

program
  .command('document')
  .description('Add comments and document the provided source code')
  .argument('<input-file>', 'File containing the source code')
  .action((file: string) => {
    openFile(file).then((data) => {
      if (data) {
        //Send data to chat model
        console.log(data);
      } else {
        console.warn('received empty or unsupported file');
      }
    });
  });

export default program;
