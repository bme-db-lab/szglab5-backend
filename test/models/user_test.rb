require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'attributes' do
    student = users(:user01)
    assert_respond_to student, :name
    assert_respond_to student, :email
  end

  test 'associations' do
    student_user = users(:user01)
    assert_respond_to student_user, :students
    assert_equal student_user, student_user.students.first.user

    staff_user = users(:user80)
    assert_respond_to staff_user, :staffs
    assert_equal staff_user, staff_user.staffs.first.user
  end
end
