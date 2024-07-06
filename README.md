# CrazyNote

CrazyNote is a powerful CLI tool designed to generate comprehensive Markdown documentation from your project files. It can traverse your project directory, read file contents, and create a Markdown file based on customizable templates. This tool is especially useful for feeding code to AI models for context, making it a great addition to any developer's toolkit.

## Features

- **Directory Traversal**: Recursively scans your project directory to include all relevant files.
- **Ignore Patterns**: Exclude specific files or directories based on patterns defined in the configuration file.
- **Custom Templates**: Use predefined or custom Handlebars templates to format your documentation.
- **Language Mapping**: Automatically detect the programming language of files based on their extension.
- **File Metadata**: Include file size and last modified date in the generated documentation.
- **Initialization**: Easily create default configuration files and templates.

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

## Configuration

The configuration file ([`crazyconfig.json`]("example/crazyconfig.json")) includes settings to customize the behavior of CrazyNote. Here is an example configuration:

```json
{
  "directory": "./",
  "ignore": ["**/node_modules/**", "**/dist/**"],
  "templatePath": "./template.hbs",
  "output": "./output.md",
  "removeExclusionText": false
}
```

### Configuration Options

- `directory`: The root directory to start scanning from.
- `ignore`: An array of glob patterns to exclude files and directories.
- `templatePath`: Path to the Handlebars template file.
- `output`: Path to the output Markdown file.
- `removeExclusionText`: Boolean to remove "(excluded)" text from the file tree for ignored files.

## Templates

CrazyNote uses Handlebars templates to format the generated Markdown file. You can create custom templates or use the default ones provided. After initializing the deafult options you can modify the `template.hbs` according to your needs.

### Example Template

```hbs
# Project Documentation

## Directory Structure

{{{tripleCurly fileTree}}}

## Files

{{#each files}}
### {{this.path}}

\`\`\`{{this.language}}
{{{this.content}}}
\`\`\`

- **Size**: {{this.size}} bytes
- **Last Modified**: {{this.modified}}
{{/each}}
```

## Examples

Better examples for config, template and output can be found on [examples]("example/") folder.

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
- `glob` and `micromatch` for pattern matching
- `handlebars` for templating
- `ora` for spinner animations

## Contact

For any questions or suggestions, please open an issue on GitHub or contact the me at [LinkedIn](https://www.linkedin.com/in/globalkonvict/).

---
