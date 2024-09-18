import { Command } from 'commander';
import aiResponse from './ai';
import { processFile } from './utils/fileHandler';
import { name, version, description } from '../package.json';

const program = new Command();

program
  .name(name)
  .description(description)
  .version(`${name} v${version}`, '-v, --version', 'output the current version') // Set the version number and command to display it
  .option(
    '-m,--model <model-name>', // Option to specify the AI model
    'specify the model to use',
    'google/gemma-2-9b-it:free',
  )
  .option('-o,--output <output-file>', 'file to output response') // Option to specify the output file
  .option('-t, --temperature <temperature>', 'set the model temperature', '0.5') // Option to set the model temperature
  .argument('<files...>') // Define the required file argument
  .action(async function (files: string[]) {
    //Loop through files and process them
    for (const file of files) {
      try {
        const data = await processFile(file, 'read'); // Process the file content
        if (data) {
          // If file processing was successful
          await aiResponse(data); // Send the processed data to ai function
        } else {
          console.warn('received empty or unsupported file'); // Handle cases where the file is empty or unsupported
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  });

export default program;
