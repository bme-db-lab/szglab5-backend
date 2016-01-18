# TODO: documentation
#
class Client < ActiveRecord::Base
  belongs_to :extended_client, class_name: 'Client'
  belongs_to :course
  belongs_to :default_language, class_name: 'Language'
end
