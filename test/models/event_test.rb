require 'test_helper'

class EventTest < ActiveSupport::TestCase
  test 'attributes' do
    event = events(:event01dbms)
    assert_respond_to event, :date
    assert_respond_to event, :location
    assert_respond_to event, :title
    assert_respond_to event, :number
    assert_respond_to event, :attempt
  end

  test 'associations' do
    event = events(:event01dbms)
    assert_respond_to event, :student_group
    assert_respond_to event, :event_template
    assert_respond_to event, :demonstrator
    assert_respond_to event, :students
    assert_respond_to event, :exercise_type
    assert_respond_to event, :upstream_event
    assert_respond_to event, :related_events
    assert_respond_to event, :deliverables
  end
end
