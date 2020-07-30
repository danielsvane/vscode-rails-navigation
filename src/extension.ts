import * as vscode from 'vscode';

// Extracts info about file, ie is it a model, view, what is the namespace, etc
function getFileInfo (fullPath:String) {
	// Only use the path after /app
	let path = fullPath.split('app/')[1];
	// Separate into parts
	let parts = path.split('/');

	let type = parts[0].slice(0, -1); // Remove last part of type so models -> model
	let namespaces = parts.slice(1, parts.length - 1);
	let file = parts[parts.length - 1].split('.');
	let fileName = file[0];
	let fileType = file[1];

	let result = {
		type,
		namespaces,
		fileName,
		fileType
	};

	console.log(result);
	return result;
}

function modelNameToControllerName (term:String) {
	return term + "s_controller";
}

async function openController (path:String) {
	let { namespaces, fileName } = getFileInfo(path);
	let controllerPath =
		'controllers/' +
		namespaces.join('/') +
		'/' +
		modelNameToControllerName(fileName) +
		'.rb';

	console.log(controllerPath);

	vscode.window.showQuickPick([controllerPath]).then(selection => {
		if (selection) {
			vscode.window.showInformationMessage(selection);
		}
	});
	// let files = await vscode.workspace.findFiles('app/controllers/*.rb', '**/node_modules/**', 10);
}

export function activate(context: vscode.ExtensionContext) {

	console.log('Ready');

	let disposable = vscode.commands.registerCommand('rails-navigation.listFiles', async () => {

		let path = vscode.window.activeTextEditor?.document.uri.fsPath;

		// // Display a message box to the user
		// let files = await vscode.workspace.findFiles('app/controllers/*.rb', '**/node_modules/**', 10);
		// let fileNames = files.map(file => file.path);

		// vscode.window.showQuickPick(fileNames).then(selection => {
		// 	if (selection) {
		// 		vscode.window.showInformationMessage(selection);
		// 	}
		// });

		if (path) {
			openController(path);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
