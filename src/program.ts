import { Command } from 'commander';
import aiResponse from './ai';
import { processFile } from './utils/fileHandler';
const program = new Command();

program
  .name('dev-mate-cli')
  .description('CLI tool for code documentation')
  .version('0.0.1', '-v, --version', 'output the current version')
  .option(
    '-m,--model <model-name>',
    'specify the model to use',
    'google/gemma-2-9b-it:free',
  )
  .option('-o,--output <output-file>', 'file to output response')
  .option('-t, --temperature <temperature>', 'set the model temperature', '0.5')
  .argument('<files...>')
  .action(async function (files: string[]) {
    //Loop through files and process them
    for (const file of files) {
      try {
        const data = await processFile(file, 'read');
        if (data) {
          await aiResponse(data);
        } else {
          console.warn('received empty or unsupported file');
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  });

export default program;
