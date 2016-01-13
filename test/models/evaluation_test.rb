require 'test_helper'

class EvaluationTest < ActiveSupport::TestCase
  test 'attributes' do
    evaluation = evaluations(:evaluation01)
    assert_respond_to evaluation, :grade
    assert_respond_to evaluation, :grade_date
    assert_respond_to evaluation, :comment
    assert_respond_to evaluation, :comment_for_staff
  end

  test 'associations' do
    evaluation = evaluations(:evaluation01)
    assert_respond_to evaluation, :evaluation_type
    assert_respond_to evaluation, :staff
    assert_respond_to evaluation, :evaluatable
  end
end
