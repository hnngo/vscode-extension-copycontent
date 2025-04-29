const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
  const copyContentCommand = vscode.commands.registerCommand('extension.copyContent', async (fileUri, selectedUris) => {
    const uris = selectedUris || [fileUri];

    if (!uris || uris.length === 0) {
      vscode.window.showErrorMessage('No files selected.');
      return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace opened.');
      return;
    }

    try {
      const allFiles = await gatherAllSelectedFiles(uris);
      const combinedContent = buildCombinedFileContent(workspaceFolder, allFiles);

      await vscode.env.clipboard.writeText(combinedContent.trim());
      vscode.window.showInformationMessage('Copied content to clipboard!');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to copy content: ${error.message}`);
    }
  });

  context.subscriptions.push(copyContentCommand);
}

function deactivate() {}

/**
 * Recursively gathers all files from selected URIs
 * @param {vscode.Uri[]} uris 
 * @returns {Promise<string[]>} Absolute file paths
 */
async function gatherAllSelectedFiles(uris) {
  let allFiles = [];

  for (const uri of uris) {
    const absolutePath = uri.fsPath;
    const stat = fs.statSync(absolutePath);

    if (stat.isDirectory()) {
      const files = getAllFilesRecursively(absolutePath);
      allFiles = allFiles.concat(files);
    } else if (stat.isFile()) {
      allFiles.push(absolutePath);
    }
  }

  return allFiles;
}

/**
 * Recursively find all files inside a folder
 * @param {string} dirPath 
 * @returns {string[]} List of absolute file paths
 */
function getAllFilesRecursively(dirPath) {
  let files = [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(getAllFilesRecursively(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Build the combined clipboard string with relative paths
 * @param {string} workspaceFolder 
 * @param {string[]} filePaths 
 * @returns {string}
 */
function buildCombinedFileContent(workspaceFolder, filePaths) {
  let result = '';

  for (const filePath of filePaths) {
    const relativePath = path.relative(workspaceFolder, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    result += `// ${relativePath}\n${content}\n\n`;
  }

  return result;
}

module.exports = {
  activate,
  deactivate
};
