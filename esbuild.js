const esbuild = require("esbuild");
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

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
	console.log('generateCommands called'); // Added logging
	const rubyTasksPath = path.join(__dirname, 'src', 'rubyTasks.json');
	const packageJsonPath = path.join(__dirname, 'package.json');

	// Read rubyTasks.json
	const rubyTasks = JSON.parse(fs.readFileSync(rubyTasksPath, 'utf8'));

	// Read package.json
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

	// Generate commands based on rubyTasks
	const commands = rubyTasks.map(task => ({
		command: `extension.runTask.${task.label.replace(/\s+/g, '')}`,
		title: `💎 ${task.label}`
	}));

	// Preserve existing custom commands
	const customCommands = packageJson.contributes.commands.filter(cmd => cmd.command === 'ruby.addRdbgLaunchConfig');

	// Merge generated and custom commands
	packageJson.contributes.commands = [...commands, ...customCommands];


	// Write back to package.json
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

	console.log('package.json commands and menu contributions have been updated based on rubyTasks.json.');
	console.log('Added commands:', commands); // Added logging
}

async function main() {
	await generateCommands();

	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts',
			'src/rubyTasks.json'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outdir: 'dist',
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

// Copy rubyTasks.json to dist
fs.copyFileSync(
    path.join(__dirname, 'src', 'rubyTasks.json'),
    path.join(__dirname, 'dist', 'rubyTasks.json')
);
