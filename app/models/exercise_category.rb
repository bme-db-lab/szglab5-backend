# TODO: documentation
#
class ExerciseCategory < ActiveRecord::Base
  belongs_to :course
  has_many :exercise_type
end
