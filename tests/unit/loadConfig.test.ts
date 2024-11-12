import fs from 'fs';
import os from 'os';
import path from 'path';
import { loadConfig } from '../../src/utils/loadConfig';
import { json } from 'stream/consumers';

jest.mock('fs');
jest.mock('os');
jest.mock('path');

describe('Testing loadConfig.ts', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('Testing loadConfig() function', () => {
    test('should load configuration from .toml file', () => {
      const tomlContent = `
          model = "gpt-3"
          temperature = "0.7"
          output = "text"
      `;

      (os.homedir as jest.Mock).mockReturnValue('/mock/home/dir');
      (path.join as jest.Mock).mockReturnValue(
        '/mock/home/dir/.dev-mate-cli.toml',
      );
      (fs.readFileSync as jest.Mock).mockReturnValue(tomlContent);
      const config = loadConfig();
      expect(config).toEqual({
        model: 'gpt-3',
        temperature: '0.7',
        output: 'text',
      });
    });

    test('should return null if .toml file is parsed with error', () => {
      const invalidTomlContent = `
        model = "gpt-3"
        temperature = "0.7"
        output = text
      `;
      (os.homedir as jest.Mock).mockReturnValue('/mock/home/dir');
      (path.join as jest.Mock).mockReturnValue(
        '/mock/home/dir/.dev-mate-cli.toml',
      );
      (fs.readFileSync as jest.Mock).mockReturnValue(invalidTomlContent);

      const config = loadConfig();
      expect(config).toBeNull();
    });

    test('should load configuration from .json file if there is no .toml file', () => {
      const jsonContent = JSON.stringify({
        model: 'gpt-3',
        temperature: '0.7',
        output: 'text',
      });

      (os.homedir as jest.Mock).mockReturnValue('/mock/home/dir');
      (path.join as jest.Mock).mockReturnValue(
        '/mock/home/dir/.dev-mate-cli.toml',
      );
      (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
        if (filePath === '/mock/home/dir/.dev-mate-cli.toml') {
          const error: any = new Error('File not found');
          error.code = 'ENOENT';
          throw error;
        }
        return jsonContent;
      });

      const config = loadConfig();
      expect(config).toEqual({
        model: 'gpt-3',
        temperature: '0.7',
        output: 'text',
      });
    });

    test('should return null if .json file is parsed with error', () => {
      const invalidJsonContent = `
        model: 'gpt-3',
        temperature: '0.7',
        output: text,
      `;
      (os.homedir as jest.Mock).mockReturnValue('/mock/home/dir');
      (path.join as jest.Mock).mockReturnValue(
        '/mock/home/dir/.dev-mate-cli.toml',
      );
      (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
        if (filePath === '/mock/home/dir/.dev-mate-cli.toml') {
          const error: any = new Error('File not found');
          error.code = 'ENOENT';
          throw error;
        }
        return invalidJsonContent;
      });

      const config = loadConfig();
      expect(config).toBeNull();
    });
  });
});
