require 'test_helper'

class StudentToEventTest < ActiveSupport::TestCase
  test 'attributes' do
    # student_to_event = student_to_events(:s2e01)
    # no attributes for now
  end

  test 'associations' do
    student_to_event = student_to_events(:s2e01)
    assert_respond_to student_to_event, :student
    assert_respond_to student_to_event, :event
  end
end
