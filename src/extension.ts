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
	const rubyTasksPath = path.join(extensionPath, 'src', 'rubyTasks.json');
	let rubyTasks: any[] = [];

	try {
		rubyTasks = JSON.parse(fs.readFileSync(rubyTasksPath, 'utf8'));
	} catch (error) {
		vscode.window.showErrorMessage('Failed to read rubyTasks.json.');
		return;
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
			const gemfileExists = await hasGemfile(workspaceFolder);
			const environmentVariables = {
				hasGemfile: gemfileExists
			};

			// Filter tasks based on conditions
			const applicableTasks = rubyTasks.filter(task => {
				if (!task.condition) {return true;} 
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
		const commandTitle = `ruby: ${task.label}`;
		
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

	context.subscriptions.push(taskProvider);
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
