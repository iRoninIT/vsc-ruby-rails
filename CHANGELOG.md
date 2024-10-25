# Change Log

## 1.0.0

- Added all Ruby on Rails 8 tasks and commands.
- General cleanup.

## 0.12.9

### Added

- **Rails Tasks**
  - `Rails: Fix AI timestamps in db migrations` - Renames user selected Rails DB migration files to ensure timestamps in the filenames conform to the Ruby on Rails format (YYYYMMDDHHmmss) and match the file creation time. Useful for migrations created with AI where the timestamp is usually in the past.

## 0.11.0

### Added

- **TailwindCSS Tasks**
  - `bin/rails tailwindcss:install` - Installs the configuration file, output file, and `Procfile.dev`.
  - `bin/rails tailwindcss:build` - Generates the output file.
  - `bin/rails tailwindcss:build[debug]` - Generates unminimized output.
  - `bin/rails tailwindcss:watch` - Starts live rebuilds, generating output on file changes.
  - `bin/rails tailwindcss:watch[debug]` - Generates unminimized output.
  - `bin/rails tailwindcss:watch[poll]` - For systems without file system events.
  - `bin/rails tailwindcss:watch[always]` - For systems without TTY (e.g., some Docker containers).

### Changed

- Updated README.md with new TailwindCSS tasks.
- Added TailwindCSS tasks to `rubyTasks.json`.
- Updated extension version to `0.11.0`.

## 0.10.1

- Updated changelog...

## 0.10.0

### Added

- Add more tasks
- Add Rails DB migrate task
- Add Rails: clear cache task
- Add Rails: Routes task
- Add publish and package tasks
- Add Start Rails Console task/command
- Add `Install Tasks` command
- Add commands to start Rails bin/dev and bin/debug
- Add command that adds Rails debug config
- Add Start Rails command
- Command to install Ruby debug gem
- Add command to configure rdbg debugging for Ruby and Rails via vscode launch.json
- Add icon
- Add `Ruby Ruby File` task
- Add `Show Ruby version` task
- Add debug config

### Changed

- Update README.md
- Update package.json
- Improve esbuild
- Improve README
- Bug fixes and cleanup
- Updates for publishing
- Updating package info and README
- Dynamically generate commands from rubyTasks.json
- Add conditions to commands
- Fix publishing bug
- Fix build bug
