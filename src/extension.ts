// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rails-navigation" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('rails-navigation.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed

		var currentlyOpenTabfilePath = vscode.window.activeTextEditor?.document.uri.fsPath;

		// Display a message box to the user
		let files = await vscode.workspace.findFiles('app/controllers/*.rb', '**/node_modules/**', 10);
		let fileNames = files.map(file => file.path);

		// console.log(files);
		vscode.window.showQuickPick(fileNames).then(selection => {
			if (selection) {
				vscode.window.showInformationMessage(selection);
			}
		});

		vscode.window.showInformationMessage('lol!' + currentlyOpenTabfilePath);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
