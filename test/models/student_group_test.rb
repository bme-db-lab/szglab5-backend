require 'test_helper'

class StudentGroupTest < ActiveSupport::TestCase
  test 'attributes' do
    student_group = student_groups(:english_group)
    assert_respond_to student_group, :name
  end

  test 'associations' do
    student_group = student_groups(:english_group)
    assert_respond_to student_group, :language
    assert_respond_to student_group, :semester
    assert_respond_to student_group, :demonstrator
  end
end
