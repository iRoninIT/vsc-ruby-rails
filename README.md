# vsc-ruby-rails README

Simple extension for Visual Studio Code (VSC / VSCode) that adds sample Ruby and Ruby on Rails (RoR) features.

![Fix AI Timestamps in DB Migrations](https://github.com/iRoninIT/vsc-ruby-rails/raw/main/images/fix-ai-timestamps.png)
![Rails Commands](https://github.com/iRoninIT/vsc-ruby-rails/raw/main/images/commands-rails.png)
![Ruby Commands](https://github.com/iRoninIT/vsc-ruby-rails/raw/main/images/commands-ruby.png)
![TailwindCSS Commands](https://github.com/iRoninIT/vsc-ruby-rails/raw/main/images/tailwind-commands.png)

## Features

Currently implemented features (as tasks or commands):

- **Rails: Fix AI timestamps in db migrations** - Renames user selected Rails DB migration files to ensure timestamps in the filenames conform to the Ruby on Rails format (YYYYMMDDHHmmss) and match the file creation time. Useful for migrations created with AI where the timestamp is usually in the past.

### Ruby on Rails (RoR) features

- **Rails: Install Debug Config** - Installs Rails debug configuration. See below for details.
- **Rails: Install rdbg VSC Launch Config** - Installs rdbg VSC launch configuration. See below for details.
- **Rails: Server** - Start Rails server with `bin/rails server`.
- **Rails: Console** - Start Rails console with `bin/rails c`.
- **Rails: Dev** - Start Rails development mode with `bin/dev`.
- **Rails: Debug** - Start Rails debug mode with `bin/debug`.
- **Rails: Routes** - Show Rails routes with `bin/rails routes`.
- **Rails: Clear Cache** - Clear Rails cache with `bin/rails runner 'Rails.cache.clear'`.
- **Rails: DB Create** - Create Rails database with `bin/rails db:create`.
- **Rails: DB Seed** - Seed Rails database with `bin/rails db:seed`.
- **Rails: DB Migrate** - Migrate Rails database with `bin/rails db:migrate`.
- **Rails: DB Console** - Open Rails database console with `bin/rails dbconsole`.
- **Rails: DB Reset** - Reset Rails database with `bin/rails db:reset`.
- **Rails: DB Drop** - Drop Rails database with `bin/rails db:drop`.
- **Rails: Test** - Run Rails tests with `bin/rails test`.
- **Rails: Assets Precompile** - Precompile Rails assets with `bin/rails assets:precompile`.
- **Rails: Log Tail** - Tail Rails development log with `tail -f log/development.log`.
- **Rails: About** - List versions of all Rails frameworks and the environment.
- **Rails: Action Mailbox Ingress Exim** - Relay an inbound email from Exim to Action Mailbox.
- **Rails: Action Mailbox Ingress Postfix** - Relay an inbound email from Postfix to Action Mailbox.
- **Rails: Action Mailbox Ingress Qmail** - Relay an inbound email from Qmail to Action Mailbox.
- **Rails: Action Mailbox Install** - Install Action Mailbox and its dependencies.
- **Rails: Action Mailbox Install Migrations** - Copy migrations from action_mailbox to application.
- **Rails: Action Text Install** - Copy over the migration, stylesheet, and JavaScript files.
- **Rails: Action Text Install Migrations** - Copy migrations from action_text to application.
- **Rails: Active Storage Install** - Copy over the migration needed to the application.
- **Rails: App Template** - Apply the template supplied by LOCATION or URL.
- **Rails: App Update** - Update configs and other generated files.
- **Rails: Assets Clean** - Remove old files in `config.assets.output_path`.
- **Rails: Assets Clobber** - Remove `config.assets.output_path`.
- **Rails: Assets Reveal** - Print all assets available in `config.assets.paths`.
- **Rails: Assets Reveal Full** - Print the full path of assets in `config.assets.paths`.
- **Rails: Boot** - Boot the application and exit.
- **Rails: Cache Digests Dependencies** - Lookup first-level dependencies for a template.
- **Rails: Cache Digests Nested Dependencies** - Lookup nested dependencies for a template.
- **Rails: Credentials Diff** - Enroll/disenroll in decrypted diffs of credentials using git.
- **Rails: Credentials Edit** - Open the decrypted credentials for editing.
- **Rails: Credentials Show** - Show the decrypted credentials.
- **Rails: Cucumber OK** - Run features that should pass.
- **Rails: Cucumber Rerun** - Record failing features and run only them if any exist.
- **Rails: Cucumber WIP** - Run features that are being worked on.
- **Rails: DB Encryption Init** - Generate keys for Active Record encryption.
- **Rails: db:create** - Create the database from DATABASE_URL or config/database.yml for the current RAILS_ENV.
- **Rails: db:drop** - Drop the database from DATABASE_URL or config/database.yml for the current RAILS_ENV.
- **Rails: db:encryption:init** - Generate a set of keys for configuring Active Record encryption in a given environment.
- **Rails: db:environment:set** - Set the environment value for the database.
- **Rails: db:fixtures:load** - Load fixtures into the current environment's database.
- **Rails: db:migrate** - Migrate the database.
- **Rails: db:migrate:down** - Run the "down" for a given migration VERSION.
- **Rails: db:migrate:redo** - Roll back the database one migration and re-migrate up.
- **Rails: db:migrate:status** - Display status of migrations.
- **Rails: db:migrate:up** - Run the "up" for a given migration VERSION.
- **Rails: db:prepare** - Run setup if database does not exist, or run migrations if it does.
- **Rails: db:reset** - Drop and recreate all databases from their schema and load the seeds.
- **Rails: db:rollback** - Roll the schema back to the previous version.
- **Rails: db:schema:cache:clear** - Clear a db/schema_cache.yml file.
- **Rails: db:schema:cache:dump** - Create a db/schema_cache.yml file.
- **Rails: db:schema:dump** - Create a database schema file.
- **Rails: db:schema:load** - Load a database schema file into the database.
- **Rails: db:seed** - Load the seed data from db/seeds.rb.
- **Rails: db:seed:replant** - Truncate tables and load the seeds.
- **Rails: db:setup** - Create all databases, load all schemas, and initialize with the seed data.
- **Rails: db:system:change** - Change `config/database.yml` and your database gem to the target database.
- **Rails: db:version** - Retrieve the current schema version number.
- **Rails: destroy** - Remove code generated by `bin/rails generate`.
- **Rails: dev:cache** - Toggle Action Controller development mode caching on/off.
- **Rails: devcontainer** - Generate a Dev Container setup based on current application configuration.
- **Rails: encrypted:edit** - Open the decrypted file for editing.
- **Rails: encrypted:show** - Show the decrypted contents of the file.
- **Rails: importmap:install** - Setup Importmap for the app.
- **Rails: initializers** - Print out all defined initializers in the order they are invoked by Rails.
- **Rails: log:clear** - Truncate all/specified \*.log files in log/.
- **Rails: middleware** - Print out your Rack middleware stack.
- **Rails: notes** - Show comments in your code annotated with FIXME, OPTIMIZE, and TODO.
- **Rails: restart** - Restart app by touching tmp/restart.txt.
- **Rails: routes** - List all the defined routes.
- **Rails: runner** - Run Ruby code in the context of your application.
- **Rails: secret** - Generate a cryptographically secure secret key.
- **Rails: solid_cable:install** - Copy over the schema and set cable adapter for Solid Cable.
- **Rails: solid_cache:install** - Copy over the migration, and set cache.
- **Rails: solid_queue:install** - Install Solid Queue.
- **Rails: solid_queue:start** - Start solid_queue supervisor to dispatch and process jobs.
- **Rails: stats** - Report code statistics (KLOCs, etc) from the application or engine.
- **Rails: stimulus:install** - Install Stimulus into the app.
- **Rails: stimulus:install:bun** - Install Stimulus on an app running bun.
- **Rails: stimulus:install:importmap** - Install Stimulus on an app running importmap-rails.
- **Rails: stimulus:install:node** - Install Stimulus on an app running node.
- **Rails: stimulus:manifest:display** - Show the current Stimulus manifest.
- **Rails: stimulus:manifest:update** - Update the Stimulus manifest.
- **Rails: tailwindcss:install** - Install Tailwind CSS into the app.
- **Rails: tailwindcss:build** - Build your Tailwind CSS.
- **Rails: tailwindcss:build[debug]** - Build your Tailwind CSS with debug.
- **Rails: tailwindcss:clobber** - Remove CSS builds.
- **Rails: tailwindcss:watch** - Watch and build your Tailwind CSS on file changes.
- **Rails: tailwindcss:watch[debug]** - Watch and build your Tailwind CSS with debug.
- **Rails: tailwindcss:watch[poll]** - Watch and build your Tailwind CSS with polling.
- **Rails: tailwindcss:watch[always]** - Watch and build your Tailwind CSS always.
- **Rails: Test** - Run tests using `bin/rails test`.
- **Rails: test:all** - Run all tests, including system tests.
- **Rails: test:channels** - Run tests in `test/channels`.
- **Rails: test:controllers** - Run tests in `test/controllers`.
- **Rails: test:db** - Reset the database and run tests.
- **Rails: test:functionals** - Run functional tests.
- **Rails: test:generators** - Run tests in `test/lib/generators`.
- **Rails: test:helpers** - Run tests in `test/helpers`.
- **Rails: test:integration** - Run integration tests.
- **Rails: test:jobs** - Run tests in `test/jobs`.
- **Rails: test:mailboxes** - Run tests in `test/mailboxes`.
- **Rails: test:mailers** - Run tests in `test/mailers`.
- **Rails: test:models** - Run tests in `test/models`.
- **Rails: test:units** - Run unit tests.
- **Rails: time:zones[country_or_offset]** - List all time zones.
- **Rails: tmp:clear** - Clear cache, socket, and screenshot files from `tmp/`.
- **Rails: tmp:create** - Create `tmp` directories.
- **Rails: turbo:install** - Install Turbo into the app.
- **Rails: turbo:install:bun** - Install Turbo with bun.
- **Rails: turbo:install:importmap** - Install Turbo with importmap-rails.
- **Rails: turbo:install:node** - Install Turbo with webpacker.
- **Rails: version** - Show the Rails version.
- **Rails: yarn:install** - Install all JavaScript dependencies as specified via Yarn.
- **Rails: zeitwerk:check** - Check project structure for Zeitwerk compatibility.

Easily add new tasks and commands by modifying `rubyTasks.json`.

### Ruby features

- **Run Ruby File** via `Ruby: Run file` command
- **Show Ruby Version** via `Ruby: Show version` command
- **Bundle Install** via `Ruby: Bundle install` command
- **Install Debug Gem** via `Ruby: Install debug gem` command

### Generic Commands

- **Install Tasks** - Creates or extends `.vscode/tasks.json` with all this extension's tasks from `rubyTasks.json`. It only adds tasks that are not already present in the file by comparing the `command`.

**Note:** The tasks added dynamically are not visible when you open `Tasks: Run Tasks`, only in `Show All Tasks`. Installing tasks makes them more accessible.

The advantage of the extension tasks (over the installed) is that they are available only if their conditions are met (e.g., if `bin/rails` exists for `Run Rails Server`, etc.).

### Install rdbg VSC launch config

Creates `.vscode/launch.json` if not present.
Adds the following config to `.vscode/launch.json` if not present.

With the `debug` gem installed (`Install Debug Gem` command), you can enable debugging for Ruby scripts and RoR apps by simply placing breakpoints in VSC and running `Attach with rdbg`.

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

Assuming `bin/dev` and `Procfile.dev` exist—for example, when a RoR app has Docker or devcontainers configured.

- Duplicates `bin/dev` to `bin/debug` and makes it execute `Procfile.debug` instead of `Procfile.dev`.
- Duplicates `Procfile.dev` to `Procfile.debug` and adds `rdbg` to the `web` process.
