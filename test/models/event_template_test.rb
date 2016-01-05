require 'test_helper'

class EventTemplateTest < ActiveSupport::TestCase
  test 'attributes' do
    event_template = event_templates(:dbms_meres_template)
    assert_respond_to event_template, :title
    assert_respond_to event_template, :number
  end

  test 'associations' do
    event_template = event_templates(:dbms_meres_template)
    assert_respond_to event_template, :course
    assert_respond_to event_template, :exercise_category
  end
end
