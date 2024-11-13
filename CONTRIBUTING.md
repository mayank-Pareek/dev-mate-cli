# Contributing to dev-mate-cli

Thank you for your interest in contributing to **dev-mate-cli**! Contributions are welcome, whether they are bug reports, feature requests, or code improvements.

## Development Setup

To get started with developing the project, please follow these setup instructions:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You can check if it's installed by running:

```bash
node -v
```

### Installation

1. Clone the Repository:

   ```bash
   git clone https://github.com/mayank-Pareek/dev-mate-cli.git
   cd dev-mate-cli
   ```

Note: VSCode optimizations have been configured for consistent formatting and linting; please check the .vscode folder for settings and recommended extensions.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the project’s root directory by making a copy of `.env.example` file:

   ```bash
   cp .env.example .env
   ```

   Replace `API_KEY` and `BASE_URL` values with an API Key and URL generated from a Open AI's chat completion API compatible LLM provider.

4. **Set up LLM configuration:**
   There are 2 ways that you can set up your configuration:

- Open `.dev-mate-cli.json` file from the project’s root directory and edit default configuration to customize LLM. Visit your API Key provider and browse models. Make sure to use the same provider for API Key and LLM.

- Open the home directory in your system and create a `dotfile` named `.dev-mate-cli.toml`

  Ex: `~/.dev-mate-cli.toml`:

  ```
  model = "gpt-4o"
  temperature = "1"
  ```

  **Note**: The tool first searches the home directory for a config file, then searches in project's root directory and uses the parsed values as defaults, however command-line arguments will take precedence over both.

5. **Build the TypeScript files:**

   ```bash
   npm run build
   ```

- Run the program without building files:
  ```bash
  npm run dev
  ```

## Contributing Guidelines

I encourage you to submit bug reports and feature requests through issues on GitHub. If you want to submit code changes, please create a pull request and ensure your changes follow these guidelines:

- Code Quality: Please ensure your code follows the existing coding style.
- Documentation: Update the documentation if your changes require it.

### Code Formatting and Linting

This project uses [Biome](https://biomejs.dev/) to ensure consistent code quality and style. Please ensure your code meets our standards by using the provided npm scripts.

#### Available Commands
_________________________
| Command | Description |
|---------|-------------|
| `npm run format` | Check all files for formatting issues |
| `npm run format:changed` | Check formatting only in changed files |
| `npm run format:fix` | Automatically fix formatting issues across all files |

| Command | Description |
|---------|-------------|
| `npm run lint` | Run linting checks across all files |
| `npm run lint:changed` | Check linting issues only in changed files |
| `npm run lint:fix` | Automatically fix linting issues across all files |

| Command | Description |
|---------|-------------|
| `npm run check` | Run both formatting and linting checks on all files |
| `npm run check:changed` | Run checks only on changed files |
| `npm run check:fix` | Automatically fix both formatting and linting issues |

*Note: Use Biome extension with your IDE to see lints while you type and apply code fixes.*

### Running Tests

The project uses Jest for unit testing. All test files are written in TypeScript and are stored in the `tests/unit/` directory. Please test your changes before committing using the following scripts:

- Run all tests once with: `npm run test`
- Continuously run tests on file changes: `npm run test:watch`
- Generate test coverage: `npm run coverage`

#### Writing and Organizing Tests

- All new test files should be added to the `tests/unit/` directory.
- Name your test files with `.test.ts` extension to ensure they are compatible with Jest.

### License

By contributing to dev-mate-cli, you agree that your contributions will be licensed under the MIT License.
