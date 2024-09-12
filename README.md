# dev-mate-cli

A command-line tool that leverages OpenAI's Chat Completion API to document code with the assistance of AI models.

## Features

- **Source Code Documentation**: Automatically generate comments and documentation for your source code.
- **Multiple File Processing**: Handle one or multiple files in a single command.
- **Model Selection**: Choose which AI model to use with the `--model` flag.
- **Custom Output**: Output the results to a file with the `--output` flag, or display them in the console.
- **API Key and Configuration**: Manage API credentials via a `.env` file.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mayank-Pareek/dev-mate-cli.git
   cd dev-mate-cli
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the project’s root directory with the following configuration:

   ```bash
   API_KEY=your_openrouter_api_key
   BASE_URL=https://api.openai.com/v1
   ```

4. **Build the TypeScript files:**

   ```bash
   npm run build
   ```

## Usage

### Basic Usage

To run the tool, specify one or more source files as input:

```bash
npm start ./example/file1.js
```

For processing multiple files:

```bash
npm start ./example/file1.js ./example/file1.js
```

## Command-line Options

Note: Use `npm start -- -option` to pass the option flag to the program, as npm captures it without the `--`.

- `-m, --model <model-name>`: Choose the AI model to use `(default: google/gemma-2-9b-it:free)`.

  ```bash
  npm start file.js -- -m "openai/gpt-4o-mini"
  ```

- `-o, --output <output-file>`: Write the output to a specified file.

  ```bash
  npm start file.js -- -o output.js
  ```

- `-t, --temperature <value>`: Set the creativity level of the AI model `(default: 0.5)`.
  ```bash
  npm start file.js -- -t 1.1
  ```

### Additional Commands

- **Check Version:** To check the current version of the tool, use:
  ```bash
  npm start -- --version
  ```
- **Help:** Display the help message listing all available options:
  ```bash
  npm start -- --help
  ```

### Examples

- **Document a JavaScript file and save the result:**

  ```bash
  npm start ./example/file.js -- --output file-documented.js --model google/gemini-flash-8b-1.5-exp
  ```

- **Process multiple files and print output to the console:**

  ```bash
  npm start ./example/file.js ./example/file.js --model google/gemini-flash-8b-1.5-exp
  ```

## Debugging and Logs

- All debug information and errors are output to `stderr`.
- The main results are sent to `stdout`, ensuring clean separation between logs and the actual output.

## Environment Variables

You can store your api key and base url in a `.env` file created at the root of the project. Example configuration:

```makefile
API_KEY=your_openai_api_key
BASE_URL=https://api.openai.com/v1
```

This setup will also allow you to customize other settings, like temperature or base URL, directly in the `.env` file.

## Future Enhancements

Planned improvements for this tool include:

- **Additional Transformations**: Convert code between different programming languages.
- **Response Streaming**: Stream output for larger responses.
- **Code Review**: Code review capabilities with more detailed AI feedback.

## Contributing

Contributions are welcome! If you find a bug or have an idea for an improvement, feel free to [open an issue](https://github.com/mayank-Pareek/dev-mate-cli/issues) or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
