# ironin-vsc-ruby-rails README

Simple extension for Visual Studio Code (VSC / VSCode) that adds sample Ruby and Ruby on Rails (RoR) features.

## Features

Currently implmented Ruby features (as tasks or commands):

### Ruby on Rails (RoR) features

- Add Rails Debug Config
- Add rdbg VSC launch config

### Ruby features

- Run Ruby File
- Show Ruby Version
- Bundle Install
- Install Debug Gem

Easily add new tasks and commands by modifying `rubyTasks.json`

![feature X](images/commands.png)

### Add rdbg VSC launch config

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

### Add Rails Debug Config

Assuming `bin/dev` and `Procfile.dev` exists.

Duplicates `bin/dev` to `bin/debug` and makes it execute `Procfile.debug` instead of `Procfile.dev`.

Duplicates `Procfile.dev` to `Procfile.debug` and adds `rdbg` to the `web` process.

### Start Rails Server

Starts Ruby on Rails server.

```bash
bin/rails server
```

### Run Ruby File

Runs the current Ruby file in the terminal.

```bash
ruby ${file}
```

### Bundle Install

Runs `bundle install` in the terminal.

```bash
bundle install
```

### Install Debug Gem

Installs the `debug` gem in the terminal.

```bash
gem install debug
```

### Show Ruby Version

Shows the Ruby version in the terminal.

```bash
ruby -v
```
