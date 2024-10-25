<!-- prettier-ignore -->
about                              List versions of all Rails frameworks and the environment

action_mailbox:ingress:exim        Relay an inbound email from Exim to Action Mailbox (URL and INGRESS_PASSWORD required)
action_mailbox:ingress:postfix     Relay an inbound email from Postfix to Action Mailbox (URL and INGRESS_PASSWORD required)
action_mailbox:ingress:qmail       Relay an inbound email from Qmail to Action Mailbox (URL and INGRESS_PASSWORD required)
action_mailbox:install             Install Action Mailbox and its dependencies
action_mailbox:install:migrations  Copy migrations from action_mailbox to application
action_text:install                Copy over the migration, stylesheet, and JavaScript files
action_text:install:migrations     Copy migrations from action_text to application
active_storage:install             Copy over the migration needed to the application

app:template                       Apply the template supplied by LOCATION=(/path/to/template) or URL
app:update                         Update configs and some other initially generated files (or use just update:configs or update:bin)

assets:clean[count]                Removes old files in config.assets.output_path
assets:clobber                     Remove config.assets.output_path
assets:precompile                  Compile all the assets from config.assets.paths
assets:reveal                      Print all the assets available in config.assets.paths
assets:reveal:full                 Print the full path of assets available in config.assets.paths

boot                               Boot the application and exit

cache_digests:dependencies         Lookup first-level dependencies for TEMPLATE (like messages/show or comments/_comment.html)
cache_digests:nested_dependencies  Lookup nested dependencies for TEMPLATE (like messages/show or comments/_comment.html)

credentials:diff                   Enroll/disenroll in decrypted diffs of credentials using git
credentials:edit                   Open the decrypted credentials in `$VISUAL` or `$EDITOR` for editing
credentials:show                   Show the decrypted credentials

cucumber:ok                        Run features that should pass
cucumber:rerun                     Record failing features and run only them if any exist
cucumber:wip                       Run features that are being worked on

db:create                          Create the database from DATABASE_URL or config/database.yml for the current RAILS_ENV (use db:create:all to create all databases in the config). Without RAILS_E...
db:drop                            Drop the database from DATABASE_URL or config/database.yml for the current RAILS_ENV (use db:drop:all to drop all databases in the config). Without RAILS_ENV or ...
db:encryption:init                 Generate a set of keys for configuring Active Record encryption in a given environment
db:environment:set                 Set the environment value for the database
db:fixtures:load                   Load fixtures into the current environment's database
db:migrate                         Migrate the database (options: VERSION=x, VERBOSE=false, SCOPE=blog)
db:migrate:down                    Run the "down" for a given migration VERSION
db:migrate:redo                    Roll back the database one migration and re-migrate up (options: STEP=x, VERSION=x)
db:migrate:status                  Display status of migrations
db:migrate:up                      Run the "up" for a given migration VERSION
db:prepare                         Run setup if database does not exist, or run migrations if it does
db:reset                           Drop and recreate all databases from their schema for the current environment and load the seeds
db:rollback                        Roll the schema back to the previous version (specify steps w/ STEP=n)
db:schema:cache:clear              Clear a db/schema_cache.yml file
db:schema:cache:dump               Create a db/schema_cache.yml file
db:schema:dump                     Create a database schema file (either db/schema.rb or db/structure.sql, depending on `ENV['SCHEMA_FORMAT']` or `config.active_record.schema_format`)
db:schema:load                     Load a database schema file (either db/schema.rb or db/structure.sql, depending on `ENV['SCHEMA_FORMAT']` or `config.active_record.schema_format`) into the database
db:seed                            Load the seed data from db/seeds.rb
db:seed:replant                    Truncate tables of each database for current environment and load the seeds
db:setup                           Create all databases, load all schemas, and initialize with the seed data (use db:reset to also drop all databases first)
db:system:change                   Change `config/database.yml` and your database gem to the target database
db:version                         Retrieve the current schema version number

destroy                            Remove code generated by `bin/rails generate`
dev:cache                          Toggle Action Controller development mode caching on/off
devcontainer                       Generate a Dev Container setup based on current application configuration
encrypted:edit                     Open the decrypted file in `$VISUAL` or `$EDITOR` for editing
encrypted:show                     Show the decrypted contents of the file
importmap:install                  Setup Importmap for the app
initializers                       Print out all defined initializers in the order they are invoked by Rails.
log:clear                          Truncate all/specified *.log files in log/ to zero bytes (specify which logs with LOGS=test,development)
middleware                         Print out your Rack middleware stack
notes                              Show comments in your code annotated with FIXME, OPTIMIZE, and TODO
restart                            Restart app by touching tmp/restart.txt
routes                             List all the defined routes
runner                             Run Ruby code in the context of your application
secret                             Generate a cryptographically secure secret key (this is typically used to generate a secret for cookie sessions).
solid_cable:install                Copy over the schema and set cable adapter for Solid Cable
solid_cache:install                Copy over the migration, and set cache
solid_queue:install                Install Solid Queue
solid_queue:start                  start solid_queue supervisor to dispatch and process jobs
stats                              Report code statistics (KLOCs, etc) from the application or engine
stats                              Report code statistics (KLOCs, etc) from the application or engine
stimulus:install                   Install Stimulus into the app
stimulus:install:bun               Install Stimulus on an app running bun
stimulus:install:importmap         Install Stimulus on an app running importmap-rails
stimulus:install:node              Install Stimulus on an app running node
stimulus:manifest:display          Show the current Stimulus manifest (all installed controllers)
stimulus:manifest:update           Update the Stimulus manifest (will overwrite controllers/index.js)

tailwindcss:build                  Build your Tailwind CSS
tailwindcss:clobber                Remove CSS builds
tailwindcss:install                Install Tailwind CSS into the app
tailwindcss:watch                  Watch and build your Tailwind CSS on file changes

test:all                           Run all tests, including system tests
test:channels                      Run tests in test/channels
test:controllers                   Run tests in test/controllers
test:db                            Reset the database and run `bin/rails test`
test:functionals                   Run tests in test/controllers, test/mailers, and test/functional
test:generators                    Run tests in test/lib/generators
test:helpers                       Run tests in test/helpers
test:integration                   Run tests in test/integration
test:jobs                          Run tests in test/jobs
test:mailboxes                     Run tests in test/mailboxes
test:mailers                       Run tests in test/mailers
test:models                        Run tests in test/models
test:units                         Run tests in test/models, test/helpers, and test/unit

time:zones[country_or_offset]      List all time zones, list by two-letter country code (`bin/rails time:zones[US]`), or list by UTC offset (`bin/rails time:zones[-8]`)
tmp:clear                          Clear cache, socket and screenshot files from tmp/ (narrow w/ tmp:cache:clear, tmp:sockets:clear, tmp:screenshots:clear)
tmp:create                         Create tmp directories for cache, sockets, and pids
turbo:install                      Install Turbo into the app
turbo:install:bun                  Install Turbo into the app with bun
turbo:install:importmap            Install Turbo into the app with asset pipeline
turbo:install:node                 Install Turbo into the app with webpacker
version                            Show the Rails version
yarn:install                       Install all JavaScript dependencies as specified via Yarn

zeitwerk:check                     Check project structure for Zeitwerk compatibility