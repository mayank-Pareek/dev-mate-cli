import { Command } from 'commander';
import aiResponse from './ai';
import { processFilesAndCollectData } from './utils/fileHandler';
import config from './utils/loadConfig';
import { name, version, description } from '../package.json';

const program = new Command();

program
  .name(name)
  .description(description)
  .version(`${name} v${version}`, '-v, --version', 'output the current version') // Set the version number and command to display it
  .option(
    '-m,--model <model-name>', // Option to specify the AI model
    'specify the model to use, check available models at https://openrouter.ai/models/',
    config?.model,
  )
  .option(
    '-o,--output <output-file>',
    'file to output response',
    config?.output,
  ) // Option to specify the output file
  .option('-s, --stream', 'stream response to command line') // // Option to specify response streaming
  .option(
    '-t, --temperature <temperature>',
    'set the model temperature',
    config?.temperature,
  ) // Option to set the model temperature
  .option('-u, --token-usage', 'output token usage data') // Option to display token usage data
  .argument('<paths...>') // Define the required path argument
  .action(async function (paths: string[]) {
    try {
      // Call the new function to process files and collect their data
      const filesData = await processFilesAndCollectData(paths);

      if (filesData) {
        await aiResponse(filesData); // Call AI response with all the data at once
      } else {
        console.warn('No valid data found in the provided files.');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      process.exit(1);
    }
  });

export default program;
