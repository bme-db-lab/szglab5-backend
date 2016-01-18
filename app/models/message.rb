# TODO: documentation
#
class Message < ActiveRecord::Base
  belongs_to :client
  belongs_to :language
end
