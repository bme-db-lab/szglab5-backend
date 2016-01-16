module DeliverableTestHelper
  def check_deliverable_base_attributes(p_deliverable)
    assert_respond_to p_deliverable, :type
    assert_respond_to p_deliverable, :deadline
    assert_respond_to p_deliverable, :submitted_date
    assert_respond_to p_deliverable, :title
    assert_respond_to p_deliverable, :description
  end

  def check_deliverable_base_associations(p_deliverable)
    assert_respond_to p_deliverable, :event
    assert_respond_to p_deliverable, :deliverable_template
    assert_respond_to p_deliverable, :evaluations
    assert_respond_to p_deliverable, :upstream_deliverable
    assert_respond_to p_deliverable, :related_deliverables
  end
end
