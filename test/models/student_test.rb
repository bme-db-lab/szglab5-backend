require 'test_helper'

class StudentTest < ActiveSupport::TestCase
  test 'attributes' do
    student = students(:student01)
    assert_respond_to student, :neptun_subject_code
    assert_respond_to student, :neptun_course_code
  end

  test 'associations' do
    student = students(:student01)
    assert_respond_to student, :language
    assert_respond_to student, :semester
    assert_respond_to student, :user
    assert_respond_to student, :student_groups
  end
end
