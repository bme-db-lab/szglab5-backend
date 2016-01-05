require 'test_helper'

class DeliverableTest < ActiveSupport::TestCase
  test 'attributes' do
    deliverable = deliverables(:deliverable01dbms)
    assert_respond_to deliverable, :type
    assert_respond_to deliverable, :deadline
    assert_respond_to deliverable, :submitted_date
    assert_respond_to deliverable, :grade
    assert_respond_to deliverable, :title
    assert_respond_to deliverable, :description
  end

  test 'associations' do
    deliverable = deliverables(:deliverable01dbms)
    assert_respond_to deliverable, :event
    assert_respond_to deliverable, :deliverable_template
    assert_respond_to deliverable, :evaluator
    assert_respond_to deliverable, :upstream_deliverable
    assert_respond_to deliverable, :related_deliverables
  end
end
