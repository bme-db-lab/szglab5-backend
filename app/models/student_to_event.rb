# TODO: documentation
#
class StudentToEvent < ActiveRecord::Base
  belongs_to :student
  belongs_to :event
end
