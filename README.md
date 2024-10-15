# vsc-ruby-rails README

Simple extension for Visual Studio Code (VSC / VSCode) that adds sample Ruby and Ruby on Rails (RoR) features.

## Features

Currently implmented features (as tasks or commands):

### Generic features

- Install Tasks (command only)

### Ruby on Rails (RoR) features

- Install Rails Debug Config (command only) via `Add Rails Debug Config` command
- Install rdbg VSC launch config (command only) via `Install rdbg VSC launch config` command
- Start Rails Server with `bin/rails server` via `Rails: Server` task
- Start Rails Console with `bin/rails c` via `Rails: Console` task
- Start Rails: `bin/dev` (assuming it's already present) via `Rails: Dev` task
- Start Rails debug mode with: `bin/debug` (available after running `Add Rails Debug Config`) via `Rails: Debug` task
- Show Rails Routes with: `bin/rails routes` via `Rails: Routes` task
- Clear Rails cache with: `bin/rails runner 'Rails.cache.clear'` via `Rails: Clear cache` task
- Run Rails DB Create with: `bin/rails db:create` via `Rails: DB Create` task
- Run Rails DB Seed with: `bin/rails db:seed` via `Rails: DB Seed` task
- Run Rails DB Migrate with: `bin/rails db:migrate` via `Rails: DB Migrate` task
- Run Rails DB Console with: `bin/rails dbconsole` via `Rails: DB Console` task
- Run Rails DB Reset with: `bin/rails db:reset` via `Rails: DB Reset` task
- Run Rails DB Drop with: `bin/rails db:drop` via `Rails: DB Drop` task
- Run Rails Test with: `bin/rails test` via `Rails: Test` task
- Run Rails Assets Precompile with: `bin/rails assets:precompile` via `Rails: Assets Precompile` task
- Run Rails Log Tail with: `tail -f log/development.log` via `Rails: Log Tail` task

### Ruby features

- Run Ruby File via `Ruby: Run file` command
- Show Ruby Version via `Ruby: Show version` command
- Bundle Install via `Ruby: Bundle install` command
- Install Debug Gem via `Ruby: Install debug gem` command

Easily add new tasks and commands by modifying `rubyTasks.json`

![features](https://github.com/iRoninIT/vsc-ruby-rails/raw/main/images/commands.png)

### Install Tasks

Creates or extends `.vscode/tasks.json` with all this [extensions tasks](https://github.com/iRoninIT/vsc-ruby-rails/blob/main/src/rubyTasks.json).

It only adds tasks that are not already present in the file by comparing the `command`.

Unfortunately the tasks added dynamically are not visible when you open `Tasks: Run Tasks`, only in `Show All Tasks`. Installing tasks make them more accessible.

The advantage of the extension tasks (over the installed) is that they are available only if their condition are met (eg. if `bin/rails` exists for `Run Rails Server` etc).

### Install rdbg VSC launch config

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

Assuming `bin/dev` and `Procfile.dev` exists - eg. when RoR app has Docker or devcontainers configured.

Duplicates `bin/dev` to `bin/debug` and makes it execute `Procfile.debug` instead of `Procfile.dev`.

Duplicates `Procfile.dev` to `Procfile.debug` and adds `rdbg` to the `web` process.

### Start Rails Server

Starts Ruby on Rails server.

```bash
bin/rails server
```

### Start Rails Console

Starts Ruby on Rails console.

```bash
bin/rails c
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
