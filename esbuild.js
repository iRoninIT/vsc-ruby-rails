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

	// Array of custom command names
	const customCommandNames = [
		'ruby.addRdbgLaunchConfig',
		'ruby.addRubyTasks',
		'ruby.addRailsDebugConfig'
	];

	// Preserve existing custom commands
	const customCommands = packageJson.contributes.commands.filter(cmd =>
		customCommandNames.includes(cmd.command)
	);

	// Merge generated and custom commands
	packageJson.contributes.commands = [...commands, ...customCommands];

	// Write back to package.json
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

	console.log('package.json commands and menu contributions have been updated based on rubyTasks.json.');
	console.log('Added commands:', commands); // Added logging
}

async function main() {
	await generateCommands();

	const buildOptions = {
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
	};

	if (watch) {
		const ctx = await esbuild.context(buildOptions);
		await ctx.watch();

		// Watch all files in src/ directory
		const srcPath = path.join(__dirname, 'src');
		fs.watch(srcPath, { recursive: true }, async (eventType, filename) => {
			if (filename) {
				console.log(`[watch] ${filename} changed, rebuilding...`);
				await ctx.rebuild().catch((err) => console.error(err));
			}
		});
	} else {
		await esbuild.build(buildOptions);
		process.exit(0); // Ensure the process exits after the build
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
