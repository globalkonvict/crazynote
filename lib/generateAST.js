const { parseSync } = require("@swc/core");

function generateAST(content, filePath) {
  // Detect file type based on the file extension
  const isTS = filePath.endsWith(".ts");
  const isTSX = filePath.endsWith(".tsx");
  const isJSX = filePath.endsWith(".jsx");

  const syntax = isTSX ? "typescript" : isTS ? "typescript" : "ecmascript";
  const jsx = isTSX || isJSX;

  // Parse the code using SWC
  const ast = parseSync(content, {
    syntax,
    jsx,
    decorators: true,
    dynamicImport: true,
  });

  return ast;
}

module.exports = { generateAST };
