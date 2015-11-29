require 'test_helper'

class CourseTest < ActiveSupport::TestCase
  test 'attributes' do
    course = courses(:dblab)
    assert_respond_to course, :code
    assert_respond_to course, :name
  end

  test 'associations' do
    course = courses(:dblab)
    assert_respond_to course, :semesters
  end
end
