require 'English'

require 'simplecov'
SimpleCov.start 'rails'

require 'coveralls'
Coveralls.wear!

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

# based on: https://docs.travis-ci.com/user/common-build-problems/#Ruby%3A-RSpec-returns-0-even-though-the-build-failed
# jmarton, 2016-01-16
# if defined?(RUBY_ENGINE) && RUBY_ENGINE == 'ruby' && RUBY_VERSION >= '1.9'
#   module Kernel
#     alias_method :__at_exit, :at_exit
#     def at_exit(&block)
#       __at_exit do
#         exit_status = $ERROR_INFO.status if $ERROR_INFO.is_a?(SystemExit)
#         block.call
#         exit exit_status if exit_status
#       end
#     end
#   end
# end

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end
