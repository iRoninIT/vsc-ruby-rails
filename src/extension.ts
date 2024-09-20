// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "ironin-vsc-ruby" is now active');

	const extensionPath = context.extensionPath;
	const rubyTasksPath = path.join(extensionPath, 'dist', 'rubyTasks.json');
	let rubyTasks: any[] = [];

	try {
		rubyTasks = JSON.parse(fs.readFileSync(rubyTasksPath, 'utf8'));
	} catch (error) {
		vscode.window.showErrorMessage('Failed to read rubyTasks.json.');
		return;
	}

	async function updateContextKeys() {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		const gemfileExists = workspaceFolders ? await hasGemfile(workspaceFolders[0]) : false;
		const binRailsExists = workspaceFolders ? await hasBinRails(workspaceFolders[0]) : false;
		const isRuby = await isRubyFile();
		const environmentVariables = {
			hasGemfile: gemfileExists,
			hasBinRails: binRailsExists,
			isRubyFile: isRuby
		};
		setContextKeys(environmentVariables);
		return environmentVariables;
	}

	// Register task provider
	const taskProvider = vscode.tasks.registerTaskProvider('ruby', {
		provideTasks: async () => {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				vscode.window.showErrorMessage('No workspace folder found.');
				return [];
			}

			const workspaceFolder = workspaceFolders[0];
			const environmentVariables = await updateContextKeys();

			// Filter tasks based on conditions
			const applicableTasks = rubyTasks.filter(task => {
				if (!task.condition) { return true; }
				const condition = task.condition as keyof typeof environmentVariables;
				return environmentVariables[condition];
			});

			return applicableTasks.map(task => {
				return new vscode.Task(
					{ type: 'ruby', task: task.label },
					workspaceFolder,
					task.label,
					'ruby',
					new vscode.ShellExecution(task.command),
					task.problemMatcher
				);
			});
		},
		resolveTask(_task: vscode.Task): vscode.Task | undefined {
			return undefined;
		}
	});

	// Register commands to execute tasks dynamically
	rubyTasks.forEach(task => {
		const commandId = `extension.runTask.${task.label.replace(/\s+/g, '')}`;
		const commandTitle = `💎 ${task.label}`;

		context.subscriptions.push(
			vscode.commands.registerCommand(commandId, () => {
				const vscodeTask = new vscode.Task(
					{ type: 'ruby', task: task.label },
					vscode.TaskScope.Workspace,
					task.label,
					'ruby',
					new vscode.ShellExecution(task.command)
				);
				vscode.tasks.executeTask(vscodeTask);
			})
		);
	});

	// Register the new command
	const addRdbgLaunchConfigCommand = 'ruby.addRdbgLaunchConfig';
	context.subscriptions.push(
		vscode.commands.registerCommand(addRdbgLaunchConfigCommand, addRdbgLaunchConfig)
	);

	context.subscriptions.push(taskProvider);

	// Update context keys on relevant events
	vscode.workspace.onDidChangeWorkspaceFolders(() => {
		updateContextKeys();
	}, null, context.subscriptions);

	vscode.window.onDidChangeActiveTextEditor(() => {
		updateContextKeys();
	}, null, context.subscriptions);

	// Initial context key setup
	updateContextKeys();
}

// This method is called when your extension is deactivated
export function deactivate() {}

// Helper function to check for Gemfile
async function hasGemfile(workspaceFolder: vscode.WorkspaceFolder): Promise<boolean> {
	const gemfilePath = path.join(workspaceFolder.uri.fsPath, 'Gemfile');
	return fs.promises.access(gemfilePath, fs.constants.F_OK)
		.then(() => true)
		.catch(() => false);
}

// Helper function to check for bin/rails
async function hasBinRails(workspaceFolder: vscode.WorkspaceFolder): Promise<boolean> {
	const binRailsPath = path.join(workspaceFolder.uri.fsPath, 'bin', 'rails');
	return fs.promises.access(binRailsPath, fs.constants.F_OK)
		.then(() => {
			console.log(`bin/rails found at ${binRailsPath}`);
			return true;
		})
		.catch((error) => {
			console.error(`bin/rails not found at ${binRailsPath}:`, error);
			return false;
		});
}

// Helper function to check if the current file is a Ruby file
async function isRubyFile(): Promise<boolean> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return false;
	}
	const document = editor.document;
	return document.languageId === 'ruby';
}

// New: Set context keys based on environment variables
function setContextKeys(env: { [key: string]: boolean }) {
	Object.keys(env).forEach(key => {
		vscode.commands.executeCommand('setContext', key, env[key]);
	});
}

async function addRdbgLaunchConfig() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}

	const launchJsonPath = path.join(workspaceFolders[0].uri.fsPath, '.vscode', 'launch.json');
	let launchConfig: any;

	const rdbgConfig = [{
				"type": "rdbg",
				"name": "Debug current file with rdbg",
				"request": "launch",
				"script": "${file}",
				"args": [],
				"askParameters": true
			},
			{
				"type": "rdbg",
				"name": "Attach with rdbg",
				"request": "attach"
			}];

	if (fs.existsSync(launchJsonPath)) {
		const launchContent = fs.readFileSync(launchJsonPath, 'utf8');
		launchConfig = JSON.parse(launchContent);

		const hasRdbg = launchConfig.configurations.some((config: any) => config.type === 'rdbg');
		if (hasRdbg) {
			vscode.window.showWarningMessage('rdbg configuration already exists');
			return;
		}

		// Add new rdbg configurations
		launchConfig.configurations.push(...rdbgConfig);

		fs.writeFileSync(launchJsonPath, JSON.stringify(launchConfig, null, 4), 'utf8');
	} else {
		// Create launch.json with rdbg configurations
		launchConfig = {
			version: "0.2.0",
			configurations: rdbgConfig
		};

		fs.mkdirSync(path.dirname(launchJsonPath), { recursive: true });
	}
	fs.writeFileSync(launchJsonPath, JSON.stringify(launchConfig, null, 4), 'utf8');
	vscode.window.showInformationMessage('launch.json created with rdbg configurations');
	vscode.window.showInformationMessage('remember to install the debug gem (available as a command)');
}
