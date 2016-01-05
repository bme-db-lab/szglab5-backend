require 'test_helper'

class StudentToStudentGroupTest < ActiveSupport::TestCase
  test 'attributes' do
    # student_to_student_group = student_to_student_groups(:s2sg01)
    # no attributes for now
  end

  test 'associations' do
    student_to_student_group = student_to_student_groups(:s2sg01)
    assert_respond_to student_to_student_group, :student
    assert_respond_to student_to_student_group, :student_group
  end
end
