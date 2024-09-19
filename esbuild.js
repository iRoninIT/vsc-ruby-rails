const esbuild = require("esbuild");
const fs = require('fs');
const path = require('path');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

// Added: Generate commands from rubyTasks.json
async function generateCommands() {
	const rubyTasksPath = path.join(__dirname, 'src', 'rubyTasks.json');
	const packageJsonPath = path.join(__dirname, 'package.json');

	// Read rubyTasks.json
	const rubyTasks = JSON.parse(fs.readFileSync(rubyTasksPath, 'utf8'));

	// Read package.json
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

	// Generate commands based on rubyTasks
	const commands = rubyTasks.map(task => ({
		command: `extension.runTask.${task.label.replace(/\s+/g, '')}`,
		title: `ruby: ${task.label}`
	}));

	// Generate menu contributions based on task conditions
	const menuCommands = rubyTasks.map(task => ({
		command: `extension.runTask.${task.label.replace(/\s+/g, '')}`,
		when: task.condition ? `${task.condition}` : undefined,
		key: undefined // You can add keyboard shortcuts here if needed
	})).filter(menu => menu.when); // Only include menus with conditions

	// Update the contributes.commands section
	packageJson.contributes = packageJson.contributes || {};
	packageJson.contributes.commands = commands;

	// Update the contributes.menus section
	packageJson.contributes.menus = packageJson.contributes.menus || {};
	packageJson.contributes.menus['commandPalette'] = menuCommands.map(menu => ({
		command: menu.command,
		when: menu.when
	}));

	// Write back to package.json
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

	console.log('package.json commands and menu contributions have been updated based on rubyTasks.json.');
}

async function main() {
	await generateCommands(); // Ensure commands are generated before building

	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [
			esbuildProblemMatcherPlugin,
		],
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
