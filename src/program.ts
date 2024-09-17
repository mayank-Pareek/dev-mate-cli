import { Command } from 'commander';
import aiResponse from './ai';
import * as fs from 'fs';
import { processFile } from './utils/fileHandler';
const program = new Command();

//Configuration for LLM Model
interface Config {
  model: string;
  temperature: string;
}

// Function to load the configuration
const loadConfig = (filePath: string): Config => {
  const data = fs.readFileSync(filePath, 'utf-8');
  const configData = JSON.parse(data);
  //validate parsed data
  if (
    typeof configData.model !== 'string' ||
    typeof configData.temperature !== 'string'
  ) {
    console.error('Missing or invalid LLM configuration, check config.json');
  }
  return configData;
};

// Load config from the config.json file
const config: Config = loadConfig('./config.json');

program
  .name('dev-mate-cli')
  .description('CLI tool for code documentation')
  .version('0.1.0', '-v, --version', 'output the current version') // Set the version number and command to display it
  .option(
    '-m,--model <model-name>', // Option to specify the AI model
    'specify the model to use, check available models at https://openrouter.ai/models/',
    config.model,
  )
  .option('-o,--output <output-file>', 'file to output response') // Option to specify the output file
  .option(
    '-t, --temperature <temperature>',
    'set the model temperature',
    config.temperature,
  ) // Option to set the model temperature
  .option('-u, --token-usage', 'output token usage data') // Option to display token usage data
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
