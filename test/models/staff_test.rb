require 'test_helper'

class StaffTest < ActiveSupport::TestCase
  test 'attributes' do
    # staff = staffs(:staff80)
    # no attributes for now
  end

  test 'associations' do
    staff = staffs(:staff80)
    assert_respond_to staff, :semester
    assert_respond_to staff, :user
    assert_respond_to staff, :evaluations_given
  end
end
