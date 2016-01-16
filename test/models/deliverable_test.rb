require 'test_helper'
require 'models/deliverable_test_helper'

class DeliverableTest < ActiveSupport::TestCase
  include DeliverableTestHelper

  test 'attributes' do
    deliverable = deliverables(:pure_deliverable)
    check_deliverable_base_attributes(deliverable)
  end

  test 'associations' do
    deliverable = deliverables(:pure_deliverable)
    check_deliverable_base_associations(deliverable)
  end
end
