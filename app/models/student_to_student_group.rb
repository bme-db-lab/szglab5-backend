# TODO: documentation
#
class StudentToStudentGroup < ActiveRecord::Base
  belongs_to :student
  belongs_to :student_group
end
