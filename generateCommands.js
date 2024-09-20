const fs = require('fs');
const path = require('path');

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

// Preserve existing custom commands
const customCommands = packageJson.contributes.commands.filter(cmd => cmd.command === 'ruby.addRdbgLaunchConfig');

// Merge generated and custom commands
packageJson.contributes.commands = [...commands, ...customCommands];

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('package.json commands have been updated based on rubyTasks.json.');
