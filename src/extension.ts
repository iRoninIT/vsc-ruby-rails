// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';

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
		const binRailsExists = workspaceFolders ? await hasBin(workspaceFolders[0], 'rails') : false;
		const binDevExists = workspaceFolders ? await hasBin(workspaceFolders[0], 'dev') : false;
		const binDebugExists = workspaceFolders ? await hasBin(workspaceFolders[0], 'debug') : false;
		const dbMigrateExists = workspaceFolders ? await hasDbMigrateFolder(workspaceFolders[0]) : false;
		const isRuby = await isRubyFile();
		const environmentVariables = {
			hasGemfile: gemfileExists,
			hasBinRails: binRailsExists,
			hasBinDev: binDevExists,
			hasBinDebug: binDebugExists,
			hasDbMigrateFolder: dbMigrateExists,
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

	// Register custom commands
	const customCommands = [
		{ command: 'ruby.addRdbgLaunchConfig', callback: addRdbgLaunchConfig },
		{ command: 'ruby.addRubyTasks', callback: () => addRubyTasks(context) },
		{ command: 'ruby.addRailsDebugConfig', callback: addRailsDebugConfig },
	];

	customCommands.forEach(({ command, callback }) => {
		context.subscriptions.push(
			vscode.commands.registerCommand(command, callback)
		);
	});

	// Register the new command for fixing AI timestamps in db migrations
	const fixAITimestampsinDBMigrations = vscode.commands.registerCommand('ironin.fixAITimestampsinDBMigrations', async (fileUris?: vscode.Uri[]) => {
		let filesToProcess: vscode.Uri[] = [];

		if (fileUris && fileUris.length > 0) {
			filesToProcess = fileUris;
		} else {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				filesToProcess = [editor.document.uri];
			} else {
				vscode.window.showErrorMessage('No files selected to fix timestamps.');
				return;
			}
		}

		// Filter files to ensure they are in 'db/migrate' and have the correct extension
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder found.');
			return;
		}

		const workspacePath = workspaceFolders[0].uri.fsPath;

		const migrateDir = path.join(workspacePath, 'db', 'migrate');
		let renamedFiles = 0;

		filesToProcess.forEach(fileUri => {
			const filePath = fileUri.fsPath;
			if (!filePath.startsWith(migrateDir)) {
				vscode.window.showWarningMessage(`Skipping ${path.basename(filePath)} as it's not in db/migrate directory.`);
				return;
			}

			const fileName = path.basename(filePath);
			const match = fileName.match(/^(\d{14})_(.+)\.rb$/);

			if (match) {
				const timestamp = match[1];
				const creationTime = fs.statSync(filePath).birthtime;
				const formattedCreationTime = formatLocalDate(creationTime);

				if (timestamp !== formattedCreationTime) {
					const newFileName = `${formattedCreationTime}_${match[2]}.rb`;
					const newFilePath = path.join(migrateDir, newFileName);

					try {
						fs.renameSync(filePath, newFilePath);
						vscode.window.showInformationMessage(`Renamed ${fileName} to ${newFileName}`);
						renamedFiles++;
					} catch (renameErr) {
						console.error(`Failed to rename ${fileName}:`, renameErr);
						vscode.window.showErrorMessage(`Failed to rename ${fileName}.`);
					}
				} else {
					vscode.window.showInformationMessage(`Timestamp for ${fileName} is already correct.`);
				}
			} else {
				vscode.window.showWarningMessage(`Skipping ${fileName} as it does not match the migration file pattern.`);
			}
		});

		if (renamedFiles > 0) {
			vscode.window.showInformationMessage(`Fixed ${renamedFiles} migration timestamp(s).`);
		} else {
			vscode.window.showInformationMessage('No migration timestamps needed fixing.');
		}
	});

	context.subscriptions.push(fixAITimestampsinDBMigrations);

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

// Helper function to check for bin files
async function hasBin(workspaceFolder: vscode.WorkspaceFolder, binName: string): Promise<boolean> {
	const binPath = path.join(workspaceFolder.uri.fsPath, 'bin', binName);
	return fs.promises.access(binPath, fs.constants.F_OK)
		.then(() => {
			console.log(`bin/${binName} found at ${binPath}`);
			return true;
		})
		.catch((error) => {
			console.error(`bin/${binName} not found at ${binPath}:`, error);
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

// Set context keys based on environment variables
function setContextKeys(env: { [key: string]: boolean }) {
	Object.keys(env).forEach(key => {
		vscode.commands.executeCommand('setContext', key, env[key]);
	});
}

/**
 * Formats a Date object into a string with format YYYYMMDDHHmmss in local time.
 * @param date - The Date object to format.
 * @returns A string representing the formatted date.
 */
function formatLocalDate(date: Date): string {
	const pad = (n: number) => n.toString().padStart(2, '0');
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1); // Months are zero-based
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${year}${month}${day}${hours}${minutes}${seconds}`;
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
					"name": "Attach with rdbg",
					"request": "attach"
			},
			{
				"type": "rdbg",
				"name": "Debug current file with rdbg",
				"request": "launch",
				"script": "${file}",
				"args": [],
				"askParameters": true
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
	vscode.window.showInformationMessage('Remember to install the debug gem (available as a command)');
}

// Implement the addRailsDebugConfig command
async function addRailsDebugConfig() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}

	const workspacePath = workspaceFolders[0].uri.fsPath;
	const binDevPath = path.join(workspacePath, 'bin', 'dev');
	const procfileDevPath = path.join(workspacePath, 'Procfile.dev');
	const binDebugPath = path.join(workspacePath, 'bin', 'debug');
	const procfileDebugPath = path.join(workspacePath, 'Procfile.debug');

	// Check and duplicate bin/dev to bin/debug
	if (fs.existsSync(binDevPath)) {
		fs.copyFileSync(binDevPath, binDebugPath);
		let binDebugContent = fs.readFileSync(binDebugPath, 'utf8');
		binDebugContent = binDebugContent.replace(/Procfile\.dev/g, 'Procfile.debug');
		fs.writeFileSync(binDebugPath, binDebugContent, 'utf8');
		vscode.window.showInformationMessage('bin/debug created');
	} else {
		vscode.window.showWarningMessage('bin/dev not found.');
	}

	// Check and duplicate Procfile.dev to Procfile.debug
	if (fs.existsSync(procfileDevPath)) {
		fs.copyFileSync(procfileDevPath, procfileDebugPath);
		let procfileDebugContent = fs.readFileSync(procfileDebugPath, 'utf8');
		procfileDebugContent = procfileDebugContent.replace(/^web:(.*)bin\/rails(.*)$/gm,
			(match, p1, p2) => {
				return `#${match}\nweb:${p1}rdbg -n --open -c -- bin/rails${p2}`;
			});
		fs.writeFileSync(procfileDebugPath, procfileDebugContent, 'utf8');
		vscode.window.showInformationMessage('Procfile.debug created');
	} else {
		vscode.window.showWarningMessage('Procfile.dev not found.');
	}
}

async function addRubyTasks(context: vscode.ExtensionContext) {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder found.');
		return;
	}

	const tasksJsonPath = path.join(workspaceFolders[0].uri.fsPath, '.vscode', 'tasks.json');
	let tasksConfig: any;

	const extensionPath = context.extensionPath;
	const rubyTasksPath = path.join(extensionPath, 'dist', 'rubyTasks.json');
	let rubyTasks: any[] = [];

	if (fs.existsSync(rubyTasksPath)) {
		const rubyTasksContent = fs.readFileSync(rubyTasksPath, 'utf8');
		rubyTasks = JSON.parse(rubyTasksContent);
	} else {
		vscode.window.showErrorMessage('rubyTasks.json not found.');
		return;
	}

	if (fs.existsSync(tasksJsonPath)) {
		const tasksContent = fs.readFileSync(tasksJsonPath, 'utf8');
		tasksConfig = JSON.parse(tasksContent);

		// Build a set of existing commands
		const existingCommands = new Set(tasksConfig.tasks.map((task: any) => task.command));

		// Add new tasks from rubyTasks.json if they don't already exist
		tasksConfig.tasks = tasksConfig.tasks || [];
		rubyTasks.forEach(task => {
			if (!existingCommands.has(task.command)) {
				tasksConfig.tasks.push(task);
			}
		});

		fs.writeFileSync(tasksJsonPath, JSON.stringify(tasksConfig, null, 4), 'utf8');
	} else {
		// Create tasks.json with ruby tasks
		tasksConfig = {
			version: "2.0.0",
			tasks: rubyTasks
		};

		fs.mkdirSync(path.dirname(tasksJsonPath), { recursive: true });
		fs.writeFileSync(tasksJsonPath, JSON.stringify(tasksConfig, null, 4), 'utf8');
	}

	vscode.window.showInformationMessage('tasks.json created with Ruby tasks');
}

// Helper function to check for db/migrate folder
async function hasDbMigrateFolder(workspaceFolder: vscode.WorkspaceFolder): Promise<boolean> {
	const dbMigratePath = path.join(workspaceFolder.uri.fsPath, 'db', 'migrate');
	return fs.promises.access(dbMigratePath, fs.constants.F_OK)
		.then(() => true)
		.catch(() => false);
}
