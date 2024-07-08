# CrazyNote

CrazyNote is a powerful CLI tool designed to generate a flat code file from your project files. It can traverse your project directory, read file contents, and create a Markdown or Json file based on customizable templates. This tool is especially useful for feeding code to AI models for context, making it a great addition to any developer's toolkit.

## Features

- **Directory Traversal**: Recursively scans your project directory to include all relevant files.
- **Ignore Patterns**: Exclude specific files or directories based on patterns defined in the configuration file, optimized for efficiency.
- **Custom MarkDown Templates**: Use predefined or custom Handlebars templates to format your output, with caching for reused templates.
- **File Metadata**: Include file size and last modified date in the generated output file.
- **Initialization**: Easily create default configuration files and templates.
- **Project Structure JSON Generation**: Generate a detailed JSON file of the project structure.
- **Include AST in JSON**: Include the ast in JSON

## Installation

You can install CrazyNote globally from npm or directly from GitHub.

### From npm

```sh
npm install -g crazynote
```

### From GitHub

```sh
git clone https://github.com/globalkonvict/crazynote.git
cd crazynote
npm install -g
```

## Setup

Before using CrazyNote in a new project, you need to initialize a configuration file. By default, CrazyNote looks for a configuration file named `crazyconfig.json` and a `template.hbs` in the current directory. If it doesn't find the configuration file, it will error out.

To set up CrazyNote in your project, follow these steps:

### Initialize Configuration

To initialize a configuration file with default settings, use the `--init` option. You can also specify a template:

```sh
crazynote --init // Will use minimalist template by default
```

Or

```sh
crazynote --init --template detailed_explorer
```

Available templates include:

- `minimalist`
- `detailed_explorer`
- `colorful_insights`

This command creates a default `crazyconfig.json` configuration file and a `template.hbs` file in your project directory.

## Usage

### Basic Usage

After initializing the configuration, you can generate Markdown documentation by running:

```sh
crazynote
```

If you need to specify a different configuration file, use the `-c` or `--config` option:

```sh
crazynote --config path/to/your/config.json
```

### Generate JSON

You can also generate a JSON file of the project structure by using the `--json` option:

```sh
crazynote --json
```

## Configuration

The configuration file ([`crazyconfig.json`](example/crazyconfig.json)) includes settings to customize the behavior of CrazyNote. Here is an example configuration:

```json
{
  "directory": ".",
  "ignore": [
    "**/.env",
    ".**/",
    ".git/**",
    "**/node_modules/**",
    "**/package-lock.json"
  ],
  "outputDir": "./",
  "outputFileName": "output",
  "templatePath": "template.hbs",
  "exclusionText": " (excluded)",
  "removeIgnoredFromTree": true,
  "includeAST": true
}
```

### Configuration Options

- `directory`: The root directory to start scanning from.
- `ignore`: An array of glob patterns to exclude files and directories.
- `templatePath`: Path to the Handlebars template file.
- `outputDir`: Path to the output file.
- `outputFileName`: Name of output file.
- `exclusionText`: The text included next to file and directory names in the markdown file's directory tree structure for the ignored files.
- `removeIgnoredFromTree`: Removes the ignored from the file tree in the markdown files
- `includeAST`: Include the code AST in JSON output.

## Templates

CrazyNote uses Handlebars templates to format the generated Markdown file. You can create custom templates or use the default ones provided. After initializing the default options you can modify the `template.hbs` according to your needs.

### Example Template

```hbs
# Project Documentation ## Directory Structure

{{{fileTree}}}

## Files

{{#each files}}
  ###
  {{this.path}}

  \`\`\`{{this.language}}
  {{{this.content}}}
  \`\`\` - **Size**:
  {{this.size}}
  bytes - **Last Modified**:
  {{this.modified}}
{{/each}}
```

## Examples

Better examples for config, template, and output can be found in the [examples](example/) folder.

## Development

If you want to contribute to CrazyNote or customize it further, you can clone the repository and install dependencies locally:

```sh
git clone https://github.com/yourusername/crazynote.git
cd crazynote
npm install
```

### Running Locally

To run the CLI tool locally without installing it globally, use:

```sh
node bin/crazynote.js
```

## Acknowledgements

CrazyNote uses the following libraries:

- `commander` for command-line interface
- `fs-extra` for file system operations
- `fast-glob` and `micromatch` for pattern matching
- `handlebars` for templating
- `@swc/core` for AST generation

## Contact

For any questions or suggestions, please open an issue on GitHub or contact me at [LinkedIn](https://www.linkedin.com/in/globalkonvict/).
