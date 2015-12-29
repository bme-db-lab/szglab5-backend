# TODO: documentation
#
class Course < ActiveRecord::Base
  has_many :semesters
  has_many :exercise_categories
end
