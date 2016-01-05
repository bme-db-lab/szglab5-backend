# TODO: documentation
#
class EventTemplate < ActiveRecord::Base
  belongs_to :course
  belongs_to :exercise_category
end
