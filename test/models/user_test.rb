require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'attributes' do
    student = users(:student1)
    assert_respond_to student, :name
    assert_respond_to student, :email
  end
end
