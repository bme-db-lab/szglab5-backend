source 'https://rubygems.org'

gem 'rails', github: 'rails/rails'
gem 'sprockets-rails', github: 'rails/sprockets-rails'
gem 'sprockets', github: 'rails/sprockets'
gem 'sass-rails', github: 'rails/sass-rails'
gem 'arel', github: 'rails/arel'
gem 'rack', github: 'rack/rack'

# Use sqlite3 as the database for Active Record
gem 'sqlite3'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Use ActiveModelSerializers to serialize JSON responses
gem 'active_model_serializers', '~> 0.10.0.rc2'

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
# gem 'rack-cors'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'
  gem 'rubocop', require: false

  # Automation
  gem 'travis', '~>1.8.0'
  gem 'travis-lint'
end

group :development do
end

group :test do
  gem 'simplecov', platform: :ruby
  gem 'coveralls', require: false
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
