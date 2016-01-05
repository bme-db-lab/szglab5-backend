require 'test_helper'

class AppointmentTest < ActiveSupport::TestCase
  test 'attributes' do
    appointment = appointments(:appointment01)
    assert_respond_to appointment, :date
    assert_respond_to appointment, :location
  end

  test 'associations' do
    appointment = appointments(:appointment01)
    assert_respond_to appointment, :student_group
    assert_respond_to appointment, :event_template
  end
end
