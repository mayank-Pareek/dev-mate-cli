import * as os from 'os';
import path from 'path';
import * as fs from 'fs';
import * as toml from 'toml';

// Configuration for LLM Model
interface Config {
  model: string;
  temperature: string;
  output: string;
}

/**
 * Load configuration from .toml or fallback to .json
 */
export const loadConfig = (): Config | null => {
  const homeDir = os.homedir();
  const configFilePath = path.join(homeDir, '.dev-mate-cli.toml');
  let configFileContent;
  try {
    // Try loading from .toml file first
    console.log(`Reading TOML config from ${configFilePath}`);
    configFileContent = fs.readFileSync(configFilePath, 'utf-8');
    try {
      return toml.parse(configFileContent);
    } catch (tomlError) {
      console.error('Error parsing .toml configuration file:', tomlError);
      return null;
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // .toml file doesn't exist, fallback to .json
      try {
        configFileContent = fs.readFileSync('.dev-mate-cli.json', 'utf-8');
        try {
          return JSON.parse(configFileContent);
        } catch (jsonError) {
          console.error('Error parsing .json configuration file', jsonError);
          return null;
        }
      } catch (jsonFileError: any) {
        if (jsonFileError.code != 'ENOENT') {
          console.error(
            'Error reading .json configuration file:',
            jsonFileError,
          );
        }
        return null;
      }
    } else {
      return null;
    }
  }
};

// Load config from the config.json file
const config: Config | null = loadConfig();

// Check if data types in file are appropriate
if (config) {
  if (
    (config.model !== undefined && typeof config.model != 'string') ||
    (config.temperature !== undefined &&
      typeof config.temperature != 'string') ||
    (config.output !== undefined && typeof config.output != 'string')
  ) {
    console.error('error in configuration data types, must be string');
    process.exit(1);
  }
}

export default config;
