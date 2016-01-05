# TODO: documentation
#
class StudentGroup < ActiveRecord::Base
  belongs_to :language
  belongs_to :semester, inverse_of: :student_groups
  belongs_to :demonstrator, class_name: 'Staff'
  has_many :appointments, inverse_of: :student_group
  has_many :students, through: :student_to_student_groups
end
