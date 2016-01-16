require 'test_helper'
require 'models/deliverable_test_helper'

class FileDeliverableTest < ActiveSupport::TestCase
  include DeliverableTestHelper

  test 'attributes' do
    file_deliverable = deliverables(:file_deliverable)
    assert_respond_to file_deliverable, :size
    assert_respond_to file_deliverable, :checksum_algorithm
    assert_respond_to file_deliverable, :checksum
    assert_respond_to file_deliverable, :filename
  end

  test 'base_attributes' do
    file_deliverable = deliverables(:file_deliverable)
    check_deliverable_base_attributes(file_deliverable)
  end

  test 'associations' do
    # file_deliverable = deliverables(:file_deliverable)
    # assert_respond_to file_deliverable, :directory
  end

  test 'base_associations' do
    file_deliverable = deliverables(:file_deliverable)
    check_deliverable_base_associations(file_deliverable)
  end
end
