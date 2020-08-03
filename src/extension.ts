
import * as vscode from 'vscode';
import * as pluralize from 'pluralize';

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
	let resource = getResourceName({ fileName, type });

	let result = {
		type,
		namespaces,
		fileName,
		fileType,
		resource
	};

	return result;
}

function getResourceName ({fileName, type}: {fileName: string, type: string}) {
	if (type === "controller") {
		return pluralize.singular(fileName.replace('_controller', ''));
	} else {
		return fileName;
	}
}

function getControllerPath ({resource, namespaces}: {resource: string, namespaces: string[]}) {
	return 'controllers/' +
		namespaces.join('/') +
		pluralize.plural(resource) + "_controller" +
		'.rb';
}

function getModelPath ({resource, namespaces}: {resource: string, namespaces: string[]}) {

	return 'models/' +
		namespaces.join('/') +
		resource +
		'.rb';
}

function getViewPattern ({resource, namespaces}: {resource: string, namespaces: string[]}) {

	return 'app/views/' +
		namespaces.join('/') +
		pluralize.plural(resource) +
		'/*';
}

async function showRelatedFiles (path:String) {
	let { namespaces, fileName, type, resource } = getFileInfo(path);
	let files = [];

	if (type !== "model") {
		files.push(getModelPath({resource, namespaces}));
	}

	if (type !== "controller") {
		files.push(getControllerPath({resource, namespaces}));
	}

	if (type !== "view") {
		let searchString = getViewPattern({resource, namespaces});
		let viewFiles = await vscode.workspace.findFiles(searchString, '**/node_modules/**', 10);
		files.push(...viewFiles.map(file => file.path.split('app/')[1]));
	}

	let selection = await vscode.window.showQuickPick(files);
	if (selection) {
		let document = await vscode.workspace.openTextDocument(vscode.workspace.rootPath + '/app/' + selection);
		vscode.window.showTextDocument(document);
	}

}

export function activate(context: vscode.ExtensionContext) {

	console.log('Ready');

	let disposable = vscode.commands.registerCommand('rails-navigation.listFiles', async () => {

		let path = vscode.window.activeTextEditor?.document.uri.fsPath;

		if (path) {
			showRelatedFiles(path);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
