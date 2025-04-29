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

    let workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No workspace opened.');
      return;
    }

    let result = '';

    for (const uri of uris) {
      const absolutePath = uri.fsPath;
      const relativePath = path.relative(workspaceFolder, absolutePath);
      const content = fs.readFileSync(absolutePath, 'utf-8');

      result += `// ${relativePath}\n${content}\n\n`;
    }

    await vscode.env.clipboard.writeText(result.trim());
    vscode.window.showInformationMessage('Copied content to clipboard!');
  });

  context.subscriptions.push(copyContentCommand);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
