# TODO: documentation
#
class Student < ActiveRecord::Base
  belongs_to :language
  belongs_to :semester
  belongs_to :user, inverse_of: :students
  has_many :student_groups, through: :student_to_student_groups
end
