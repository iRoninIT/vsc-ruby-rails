# ironin-vsc-ruby-rails README

Simple extension for Visual Studio Code (VSC / VSCode) that adds sample Ruby and Ruby on Rails (RoR) features.

## Features

Currently implmented Ruby features (as tasks or commands):
- Show Ruby Version
- Bundle Install
- Run Ruby File
- Install Debug Gem
- Add rdbg launch config

Easily add new tasks and commands by modifying `rubyTasks.json`

![feature X](images/commands.png)

### Add rdbg launch config

Creates `.vscode/launch.json` if not present.
Adds the following config to `.vscode/launch.json` if not present.

With `debug` gem installed (`Install Debug Gem` command) you can enable debugging for Ruby scrips and RoR apps by simply placing breakpoints in VSC and running `Attach with rdbg`.

```json
{
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
}
```
