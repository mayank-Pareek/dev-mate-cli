import { Command } from 'commander';
import aiResponse from './ai';
import * as fs from 'fs';
import { processFile } from './utils/fileHandler';
import { name, version, description } from '../package.json';
import path from 'path';
import * as toml from 'toml';
import * as os from 'os';

const program = new Command();

//Configuration for LLM Model
interface Config {
  model: string;
  temperature: string;
  output: string;
}

// Function to load the configuration
const loadConfig = (): Config => {
  const homeDir = os.homedir();
  const tomlFiles = fs
    .readdirSync(homeDir)
    .filter((file) => file.endsWith('.toml') && file.startsWith('.'));

  if (tomlFiles.length > 0) {
    const configFilePath = path.join(homeDir, tomlFiles[0]);
    const configFileContent = fs.readFileSync(configFilePath, 'utf-8');
    try {
      const configData = toml.parse(configFileContent);
      return configData;
    } catch (error) {
      console.log(
        'Error parsing toml file',
        (error as Error)?.message || error,
      );
      process.exit(1);
    }
  } else {
    const filePath = './config.json';
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
  }
};

// Load config from the config.json file
const config: Config = loadConfig();

program
  .name(name)
  .description(description)
  .version(`${name} v${version}`, '-v, --version', 'output the current version') // Set the version number and command to display it
  .option(
    '-m,--model <model-name>', // Option to specify the AI model
    'specify the model to use, check available models at https://openrouter.ai/models/',
    config.model,
  )
  .option('-o,--output <output-file>', 'file to output response', config.output) // Option to specify the output file
  .option('-s, --stream', 'stream response to command line') // // Option to specify response streaming
  .option(
    '-t, --temperature <temperature>',
    'set the model temperature',
    config.temperature,
  ) // Option to set the model temperature
  .option('-u, --token-usage', 'output token usage data') // Option to display token usage data
  .argument('<paths...>') // Define the required path argument
  .action(async function (paths: string[], options) {
    // Loop through paths and process them
    for (const p of paths) {
      try {
        const stat = fs.statSync(p); // Check if it's a file or directory

        if (stat.isDirectory()) {
          // If it's a directory, read its contents
          const files = fs.readdirSync(p);
          for (const file of files) {
            const filePath = path.join(p, file);
            await processFileAndRespond(filePath);
          }
        } else if (stat.isFile()) {
          // If a file, process it directly
          await processFileAndRespond(p);
        } else {
          console.warn(`'${p}' is neither a file nor a directory.`);
        }
      } catch (error) {
        console.error('Error processing path:', error);
      }
    }
  });

async function processFileAndRespond(filePath: string) {
  try {
    const data = await processFile(filePath, 'read'); // Process the file content
    if (data) {
      await aiResponse(data); // Send the processed data to the ai function
    } else {
      console.warn('Received empty or unsupported file:', filePath);
    }
  } catch (error) {
    console.error('Error processing file:', filePath, error);
  }
}

export default program;
