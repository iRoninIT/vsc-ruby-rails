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

// Update the contributes.commands section
packageJson.contributes = packageJson.contributes || {};
packageJson.contributes.commands = commands;

// Write back to package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('package.json commands have been updated based on rubyTasks.json.');
