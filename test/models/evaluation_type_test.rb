require 'test_helper'

class EvaluationTypeTest < ActiveSupport::TestCase
  test 'attributes' do
    evaluation_type = evaluation_types(:report_grade)
    assert_respond_to evaluation_type, :name
    assert_respond_to evaluation_type, :description
  end

  test 'associations' do
    evaluation_type = evaluation_types(:report_grade)
    assert_respond_to evaluation_type, :evaluations
  end
end
