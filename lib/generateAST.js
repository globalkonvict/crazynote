const esprima = require("esprima");

function generateAST(fileContent, filePath) {
  try {
    return esprima.parseScript(fileContent, { tolerant: true, loc: true });
  } catch (error) {
    console.error(`Error generating AST: ${error.message}  for ${filePath}`);
    return null;
  }
}

module.exports = { generateAST };
