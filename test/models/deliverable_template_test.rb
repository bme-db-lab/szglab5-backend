require 'test_helper'

class DeliverableTemplateTest < ActiveSupport::TestCase
  test 'attributes' do
    deliverable_template = deliverable_templates(:dbms_deliverable_template)
    assert_respond_to deliverable_template, :format
    assert_respond_to deliverable_template, :deadline
    assert_respond_to deliverable_template, :title
    assert_respond_to deliverable_template, :description
  end

  test 'associations' do
    deliverable_template = deliverable_templates(:dbms_deliverable_template)
    assert_respond_to deliverable_template, :event_template
  end
end
