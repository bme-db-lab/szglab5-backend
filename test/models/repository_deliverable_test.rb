require 'test_helper'
require 'models/deliverable_test_helper'

class RepositoryDeliverableTest < ActiveSupport::TestCase
  include DeliverableTestHelper

  test 'attributes' do
    repository_deliverable = deliverables(:deliverable01dbms)
    assert_respond_to repository_deliverable, :url
    assert_respond_to repository_deliverable, :commit
  end

  test 'base_attributes' do
    repository_deliverable = deliverables(:deliverable01dbms)
    check_deliverable_base_attributes(repository_deliverable)
  end

  test 'associations' do
    # repository_deliverable = deliverables(:deliverable01dbms)
    # no specific associations for now
  end

  test 'base_associations' do
    repository_deliverable = deliverables(:deliverable01dbms)
    check_deliverable_base_associations(repository_deliverable)
  end
end
