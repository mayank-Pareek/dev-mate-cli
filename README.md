# dev-mate-cli

A command-line tool that leverages OpenAI's Chat Completion API to document code with the assistance of AI models.

Watch this [Demo video](https://youtu.be/YJDD6YBaEFk) to view features.

## Features

- **Source Code Documentation**: Automatically generate comments and documentation for your source code.
- **Multiple File Processing**: Handle one or multiple files in a single command.
- **Model Selection**: Use AI model of your choice with the `--model` flag.
- **Custom Output**: Output the results to a file with the `--output` flag, or display them in the console.
- **Stream Output**: Stream the LLM response to command line with `--stream` flag.

## Installation
```bash
npm install -g dev-mate-cli
```

### Environment Variables
`dev-mate-cli` needs API_KEY and BASE_URL to generate responses, these variables should be stored in a `.env` file within the current directory. Make sure to use the API_KEY and BASE_URL from the same OpenAI-compatible completion API provider.
```makefile
API_KEY=your_api_key
BASE_URL=https://api.openai.com/v1
```
 Popular providers - [OpenRouter](https://openrouter.ai/), [Groq](https://console.groq.com/), [OpenAI](https://openai.com/api/).

## Usage

### Basic Usage

To run the tool, specify one or more source files or folders as input:

```bash
dev-mate-cli ./examples/file.js
```

For processing multiple files:

```bash
dev-mate-cli ./examples/file.js ./examples/file.cpp
```

For processing folders:

```bash
dev-mate-cli ./examples
```

### Command-line Options

- `-m, --model <model-name>`: Choose the AI model to use `(default: google/gemma-2-9b-it:free from OpenRouter)`.

  ```bash
  dev-mate-cli file.js -m "openai/gpt-4o-mini"
  ```

- `-o, --output <output-file>`: Write the output to a specified file.

  ```bash
  dev-mate-cli file.js -o output.js
  ```

- `-t, --temperature <value>`: Set the creativity level of the AI model `(default: 0.7)`.

  ```bash
  dev-mate-cli file.js -t 1.1
  ```

- `-u, --token-usage`: Display token usage information

  ```bash
  dev-mate-cli file.js -u
  ```

- `-s, --stream`: Stream response to command line

  ```bash
  dev-mate-cli file.js -s
  ```

### Additional Commands

- **Check Version:** To check the current version of the tool, use:
  ```bash
  dev-mate-cli --version
  ```
- **Help:** Display the help message listing all available options:
  ```bash
  dev-mate-cli --help
  ```

### Examples

- **Document a JavaScript file and save the result:**

  ```bash
  dev-mate-cli ./examples/file.js --output file-documented.js --model google/gemini-flash-8b-1.5-exp
  ```

- **Process multiple files and print output to the console:**

  ```bash
  dev-mate-cli ./examples/file.js ./examples/file.py --model google/gemini-flash-8b-1.5-exp
  ```

### LLM Configuration
To use a file for LLM configuration, create a `dotfile` named `.dev-mate-cli.toml` in the home directory of your system.

Ex: `~/.dev-mate-cli.toml`:

  ```
  model = "gpt-4o"
  temperature = "1"
  ```

## Contributing

Contributions are welcome! If you find a bug or have an idea for an improvement, feel free to [open an issue](https://github.com/mayank-Pareek/dev-mate-cli/issues) or submit a pull request, view [Contribution Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the [MIT License](LICENSE).
